import React, { useState, useEffect, useRef, type SubmitEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import { Header } from './Header';
import { RoomSidebar } from './RoomSidebar';
import { MessageTerminal } from './MessageTerminal';
import type { ChatMessage, UserTypingData } from '../types/chat.types';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { API_URL } from '../utils/getApiURL';

export const ChatApp: React.FC<{ onGoToAdmin?: () => void; onGoToAbout?: () => void }> = ({ onGoToAdmin, onGoToAbout }) => {
    const { user, logout } = useAuth();
    const { showAlert } = useAlert();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [username, setUsername] = useState<string>(user?.username || 'Anonymous');
    const [roomInput, setRoomInput] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');

    const [rooms, setRooms] = useState<string[]>([]);
    const [joinedRoom, setJoinedRoom] = useState<string>(() => localStorage.getItem('joinedRoom') || '');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingStatus, setTypingStatus] = useState<string>('');
    const [activeUsers, setActiveUsers] = useState<string[]>([]);

    const isCurrentlyTyping = useRef<boolean>(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        let socketInstance = io(API_URL, { withCredentials: true, transports: ['websocket'], upgrade: false, });
        setSocket(socketInstance);

        const bindSocketListeners = (instance: Socket) => {
            instance.on('connect', () => {
                setIsConnected(true);
                instance.emit('getRooms');
                if (joinedRoom && user) instance.emit('joinRoom', { room: joinedRoom });
            });
            instance.on('disconnect', () => {
                setIsConnected(false);
                localStorage.removeItem('joinedRoom');
            });
            instance.on('roomList', (fetchedRooms: string[]) => setRooms(fetchedRooms));
            instance.on('joinedRoom', (roomName: string) => {
                setJoinedRoom(roomName);
                localStorage.setItem('joinedRoom', roomName);
            });
            instance.on('chatMessage', (data: ChatMessage) => setMessages((prev) => [...prev, data]));
            instance.on('chatCleared', (data: { clearedBy: string }) => {
                setMessages([{ user: 'System', text: `Chat successfully cleared by ${data.clearedBy}.` }]);
            });
            instance.on('userTyping', (data: UserTypingData) => setTypingStatus(data.isTyping ? `${data.user} is typing...` : ''));
            instance.on('activeUsersUpdate', (users: string[]) => setActiveUsers(users));
            instance.on('roomDeleted', (deletedRoomName: string) => {
                setJoinedRoom((currentRoom) => {
                    if (currentRoom === deletedRoomName) {
                        setTimeout(() => showAlert(`The room #${deletedRoomName} has been deleted.`, 'Room deleted', 3), 0);
                        setMessages([]); setTypingStatus(''); setActiveUsers([]); setMessageInput('');
                        localStorage.removeItem('joinedRoom');
                        return '';
                    }
                    return currentRoom;
                });
            });
        };

        bindSocketListeners(socketInstance);
        return () => { if (socketInstance) socketInstance.disconnect(); };
    }, [user, joinedRoom]);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomInput.trim() && socket) { socket.emit('createRoom', roomInput.trim()); setRoomInput(''); }
    };

    const handleFetchRooms = () => { if (socket) socket.emit('getRooms'); };

    const handleJoinRoom = (roomName: string) => {
        if (socket && !joinedRoom && user) {
            socket.emit('joinRoom', { room: roomName });
            setIsSidebarOpen(false); // Close sidebar on mobile after joining
        }
    };

    const handleDeleteRoom = (roomName: string, e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        if (socket && user?.role === 'admin') socket.emit('deleteRoom', roomName);
        else showAlert('You are not authorized to delete chatrooms.', 'Permission denied', 1);
    };

    const handleLeaveRoom = () => {
        if (socket && joinedRoom) {
            socket.emit('leaveRoom', { room: joinedRoom });
            setJoinedRoom(''); localStorage.removeItem('joinedRoom');
            setMessages([]); setTypingStatus(''); setActiveUsers([]); setMessageInput('');
            isCurrentlyTyping.current = false;
            socket.emit('getRooms');
        }
    };

    const stopTypingNotification = () => {
        if (isCurrentlyTyping.current && socket && joinedRoom) {
            isCurrentlyTyping.current = false;
            socket.emit('typing', { room: joinedRoom, isTyping: false });
        }
    };

    const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        if (!isCurrentlyTyping.current && socket && joinedRoom) {
            isCurrentlyTyping.current = true;
            socket.emit('typing', { room: joinedRoom, isTyping: true });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => { stopTypingNotification(); }, 1500);
    };

    const handleSendMessage = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (messageInput.trim() && joinedRoom && socket) {
            socket.emit('sendMessage', { room: joinedRoom, message: messageInput.trim() });
            setMessageInput('');
            stopTypingNotification();
        }
    };

    const handleClearChat = () => { if (socket && joinedRoom) socket.emit('clearChat', { room: joinedRoom }); };

    const handleExportChat = () => {
        if (messages.every((m) => m.user.toLowerCase() === 'system')) {
            showAlert('There are no messages to export in this room yet.', 'Nothing to export', 3);
            return;
        }
        const exportData = { room: joinedRoom, exportedAt: new Date().toISOString(), history: messages };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `chat_history_${joinedRoom || 'terminal'}.json`);
        document.body.appendChild(downloadAnchor); downloadAnchor.click(); downloadAnchor.remove();
    };

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-cream-soft text-stone-900 dark:bg-ink-deep dark:text-stone-100">
            <Header
                isConnected={isConnected}
                serverUrl={API_URL}
                joinedRoom={joinedRoom}
                handleLeaveRoom={handleLeaveRoom}
                userRole={user?.role}
                onLogout={logout}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <main className="mx-auto grid min-h-0 w-full max-w-[1700px] flex-1 grid-cols-1 gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6 xl:grid-cols-[336px_minmax(0,1fr)]">
                <RoomSidebar
                    username={username}
                    setUsername={setUsername}
                    activeUsers={activeUsers}
                    handleDeleteRoom={handleDeleteRoom}
                    roomInput={roomInput}
                    setRoomInput={setRoomInput}
                    rooms={rooms}
                    joinedRoom={joinedRoom}
                    handleCreateRoom={handleCreateRoom}
                    handleFetchRooms={handleFetchRooms}
                    handleJoinRoom={handleJoinRoom}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <MessageTerminal
                    joinedRoom={joinedRoom}
                    activeUsers={activeUsers}
                    username={username}
                    messages={messages}
                    typingStatus={typingStatus}
                    messageInput={messageInput}
                    handleTypingInput={handleTypingInput}
                    handleSendMessage={handleSendMessage}
                    handleClearChat={handleClearChat}
                    handleExportChat={handleExportChat}
                    handleLeaveRoom={handleLeaveRoom}
                    messagesEndRef={messagesEndRef}
                    setMessageInput={setMessageInput}
                    socket={socket}
                />
            </main>
        </div>
    );
};