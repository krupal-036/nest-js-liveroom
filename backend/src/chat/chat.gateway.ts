import { JwtService } from '@nestjs/jwt';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
    ConnectedSocket,
    OnGatewayDisconnect,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserRepository } from 'src/users/repositories/UserRepository';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    maxHttpBufferSize: 1e8,
})
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepo: UserRepository,
    ) { }

    private activeRooms: Set<string> = new Set();
    private activeUsers: Map<string, { name: string; room: string; userId: string }> = new Map();

    private generateMessageId() {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    }

    async handleConnection(client: Socket) {
        try {
            const cookieHeader = client.handshake.headers.cookie;
            let token = client.handshake.auth?.token;

            if (!token && cookieHeader) {
                const match = cookieHeader.match(/token=([^;]+)/);
                token = match ? match[1] : null;
            }

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            const user = await this.usersRepo.findByFilter({ id: payload.id });

            if (!user || user.isDisabled || user.isBlacklisted) {
                client.disconnect();
                return;
            }

            client.data.user = user;

            // Restore room if user was in one
            if (user.currentRoom) {
                client.join(user.currentRoom);
                this.activeUsers.set(client.id, {
                    name: user.username,
                    room: user.currentRoom,
                    userId: user.id,
                });
                this.server.to(user.currentRoom).emit('chatMessage', {
                    user: 'System',
                    text: `${user.username} reconnected to the room.`,
                    timestamp: new Date().toISOString(),
                });
                this.broadcastActiveUsers(user.currentRoom);
            }
        } catch (error) {
            client.disconnect();
        }
    }

    @SubscribeMessage('createRoom')
    handleCreateRoom(@MessageBody() room: string) {
        if (room && !this.activeRooms.has(room)) {
            this.activeRooms.add(room);
            this.server.emit('roomList', Array.from(this.activeRooms));
        }
    }

    @SubscribeMessage('getRooms')
    handleGetRooms(@ConnectedSocket() client: Socket) {
        client.emit('roomList', Array.from(this.activeRooms));
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
        const user = client.data.user;
        if (!user) return;

        client.join(data.room);
        this.activeUsers.set(client.id, { name: user.username, room: data.room, userId: user.id });

        this.usersRepo.updateStatus(user.id, { currentRoom: data.room });

        client.emit('joinedRoom', data.room);
        this.server.to(data.room).emit('chatMessage', {
            user: 'System',
            text: `${user.username} joined the chat room.`,
            timestamp: new Date().toISOString(),
        });

        this.broadcastActiveUsers(data.room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
        const userProfile = this.activeUsers.get(client.id);
        if (userProfile) {
            this.server.to(data.room).emit('chatMessage', {
                id: this.generateMessageId(), // <-- ADDED
                user: 'System',
                text: `${userProfile.name} has left the room.`,
                timestamp: new Date().toISOString(),
            });

            client.leave(data.room);
            this.activeUsers.delete(client.id);
            this.usersRepo.updateStatus(userProfile.userId, { currentRoom: null });
            this.broadcastActiveUsers(data.room);
        }
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() data: { room: string; message: string },
        @ConnectedSocket() client: Socket,
    ) {
        const userProfile = this.activeUsers.get(client.id);
        const username = userProfile ? userProfile.name : 'Unknown';

        this.server.to(data.room).emit('chatMessage', {
            id: this.generateMessageId(), // <-- ADDED
            user: username,
            text: data.message,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { room: string; isTyping: boolean },
        @ConnectedSocket() client: Socket,
    ) {
        const userProfile = this.activeUsers.get(client.id);
        if (userProfile) {
            client.to(data.room).emit('userTyping', {
                user: userProfile.name,
                isTyping: data.isTyping,
            });
        }
    }

    handleDisconnect(client: Socket) {
        const userProfile = this.activeUsers.get(client.id);

        if (userProfile) {
            const { name, room } = userProfile;

            this.server.to(room).emit('chatMessage', {
                user: 'System',
                text: `${name} has left the room.`,
            });

            client.to(room).emit('userTyping', { user: name, isTyping: false });

            this.activeUsers.delete(client.id);

            this.broadcastActiveUsers(room);
        }
    }

    private broadcastActiveUsers(room: string) {
        const roomUsers: string[] = [];
        this.activeUsers.forEach((profile) => {
            if (profile.room === room) {
                roomUsers.push(profile.name);
            }
        });
        this.server.to(room).emit('activeUsersUpdate', roomUsers);
    }

    @SubscribeMessage('deleteRoom')
    handleDeleteRoom(@MessageBody() room: string) {
        if (room && this.activeRooms.has(room)) {
            this.server.to(room).emit('roomDeleted', room);

            const roomSockets = this.server.sockets.adapter.rooms.get(room);
            if (roomSockets) {
                roomSockets.forEach((socketId) => {
                    const clientSocket = this.server.sockets.sockets.get(socketId);
                    if (clientSocket) {
                        clientSocket.leave(room);
                        this.activeUsers.delete(socketId);
                    }
                });
            }

            this.activeRooms.delete(room);
            this.server.emit('roomList', Array.from(this.activeRooms));
        }
    }

    @SubscribeMessage('sendFile')
    handleSendFile(
        @MessageBody() data: { room: string; text: string; file: any },
        @ConnectedSocket() client: Socket,
    ) {
        const userProfile = this.activeUsers.get(client.id);
        const username = userProfile ? userProfile.name : 'Unknown';

        this.server.to(data.room).emit('chatMessage', {
            id: this.generateMessageId(), // <-- ADDED
            user: username,
            text: data.text,
            file: data.file,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('clearChat')
    handleClearChat(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
        const userProfile = this.activeUsers.get(client.id);
        const username = userProfile ? userProfile.name : 'Anonymous';

        if (data.room) {
            this.server.to(data.room).emit('chatCleared', { clearedBy: username });
        }
    }

    @SubscribeMessage('adminJoinRoom')
    handleAdminJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
        const user = client.data.user;
        if (!user || user.role !== 'admin') return;

        client.join(data.room);
        this.server.to(data.room).emit('chatMessage', {
            user: 'System',
            text: `👑 Admin ${user.username} has entered the room as an observer.`,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('addReaction')
    handleAddReaction(
        @MessageBody() data: { messageId: string; user: string; emoji: string },
        @ConnectedSocket() client: Socket,
    ) {
        const userProfile = this.activeUsers.get(client.id);
        if (userProfile) {
            this.server.to(userProfile.room).emit('reactionAdded', data);
        }
    }

    @SubscribeMessage('removeReaction')
    handleRemoveReaction(
        @MessageBody() data: { messageId: string; user: string },
        @ConnectedSocket() client: Socket,
    ) {
        const userProfile = this.activeUsers.get(client.id);
        if (userProfile) {
            this.server.to(userProfile.room).emit('reactionRemoved', data);
        }
    }
}
