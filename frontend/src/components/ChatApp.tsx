// frontend/src/components/ChatApp.tsx
import React, { useState, useEffect, useRef, type SubmitEvent } from "react";
import { io, Socket } from "socket.io-client";
import { Header } from "@/components/Header";
import { RoomSidebar } from "@/components/RoomSidebar";
import { MessageTerminal } from "@/components/MessageTerminal";
import type { ChatMessage, UserTypingData } from "@/types/chat.types";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { API_URL } from "@/utils/getApiURL";
import { playClearSound, playReceiveSound, playTypingSound } from "@/utils/soundEffects";
import { createPortal } from "react-dom";

export const ChatApp = () => {
    const { user, logout } = useAuth();
    const { showAlert } = useAlert();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [username, setUsername] = useState<string>(user?.username || "Anonymous");
    const [roomInput, setRoomInput] = useState<string>("");
    const [messageInput, setMessageInput] = useState<string>("");

    const [rooms, setRooms] = useState<string[]>([]);
    const [joinedRoom, setJoinedRoom] = useState<string>(
        () => localStorage.getItem("joinedRoom") || "",
    );
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingStatus, setTypingStatus] = useState<string>("");
    const [activeUsers, setActiveUsers] = useState<string[]>([]);

    const isCurrentlyTyping = useRef<boolean>(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (pipWindow && !pipWindow.closed) {
                pipWindow.close();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (pipWindow && !pipWindow.closed) {
                pipWindow.close();
            }
        };
    }, [pipWindow]);

    useEffect(() => {
        let socketInstance = io(API_URL, {
            withCredentials: true,
            transports: ["websocket"],
            upgrade: false,
        });
        setSocket(socketInstance);

        const bindSocketListeners = (instance: Socket) => {
            instance.on("connect", () => {
                setIsConnected(true);
                instance.emit("getRooms");
                if (rooms.includes(joinedRoom) && user)
                    instance.emit("joinRoom", { room: joinedRoom });
            });
            instance.on("disconnect", () => {
                setIsConnected(false);
            });
            instance.on("roomList", (fetchedRooms: string[]) => setRooms(fetchedRooms));
            instance.on("joinedRoom", (roomName: string) => {
                setJoinedRoom(roomName);
            });
            instance.on("chatMessage", (data: ChatMessage) => {
                if (data.user !== user?.username && data.user !== "System") {
                    playReceiveSound();
                }
                setMessages((prev) => [...prev, data]);
            });
            instance.on("chatCleared", (data: { clearedBy: string }) => {
                playClearSound();
                setMessages([
                    { user: "System", text: `Chat successfully cleared by ${data.clearedBy}.` },
                ]);
            });
            instance.on("userTyping", (data: UserTypingData) => {
                if (data.isTyping && data.user !== user?.username) {
                    playTypingSound();
                }
                setTypingStatus(data.isTyping ? `${data.user} is typing...` : "");
            });
            instance.on("activeUsersUpdate", (users: string[]) => setActiveUsers(users));
            instance.on("roomDeleted", (deletedRoomName: string) => {
                setJoinedRoom((currentRoom) => {
                    if (currentRoom === deletedRoomName) {
                        setTimeout(
                            () =>
                                showAlert(
                                    `The room #${deletedRoomName} has been deleted.`,
                                    "Room deleted",
                                    3,
                                ),
                            0,
                        );
                        setMessages([]);
                        setTypingStatus("");
                        setActiveUsers([]);
                        setMessageInput("");
                        localStorage.removeItem("joinedRoom");
                        return "";
                    }
                    return currentRoom;
                });
            });
        };

        bindSocketListeners(socketInstance);
        return () => {
            if (socketInstance) socketInstance.disconnect();
        };
    }, [user, joinedRoom]);

    const togglePip = async () => {
        // If PiP is already open, close it and bring terminal back to main window
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            return;
        }

        let targetWindow: Window | null = null;

        // 1. Try Native Always-On-Top Document PiP (Chrome/Edge on localhost/HTTPS)
        if ("documentPictureInPicture" in window) {
            try {
                targetWindow = await (window as any).documentPictureInPicture.requestWindow({
                    width: 440,
                    height: 700,
                });
            } catch (err) {
                console.warn("Native PiP failed, falling back to OS Pop-out Window:", err);
            }
        }

        // 2. Universal Fallback: True OS Pop-out Desktop Window (Firefox, Safari, HTTP)
        if (!targetWindow) {
            const width = 450;
            const height = 720;
            const left = Math.max(0, window.screen.width - width - 40);
            const top = 40;

            targetWindow = window.open(
                "",
                "ChatTerminalPiP",
                `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no`,
            );
        }

        if (!targetWindow) {
            showAlert(
                "Pop-up was blocked. Please allow pop-ups for this site.",
                "Popup Blocked",
                2,
            );
            return;
        }

        // Copy styles into the new OS window
        Array.from(document.styleSheets).forEach((styleSheet) => {
            try {
                const cssRules = Array.from(styleSheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("");
                const style = targetWindow!.document.createElement("style");
                style.textContent = cssRules;
                targetWindow!.document.head.appendChild(style);
            } catch {
                if (styleSheet.href) {
                    const link = targetWindow!.document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = styleSheet.href;
                    targetWindow!.document.head.appendChild(link);
                }
            }
        });

        // Match Dark/Light theme & title
        targetWindow.document.title = `#${joinedRoom || "Terminal"} - ChatApp PiP`;
        targetWindow.document.documentElement.className = document.documentElement.className;
        targetWindow.document.body.className =
            "h-screen w-screen overflow-hidden m-0 p-0 bg-white dark:bg-ink";

        // Sync dark mode live if toggled in main window
        const themeObserver = new MutationObserver(() => {
            if (targetWindow && targetWindow.document) {
                targetWindow.document.documentElement.className =
                    document.documentElement.className;
            }
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // When closed natively (clicking the OS window 'X'), dock it back
        const cleanup = () => {
            themeObserver.disconnect();
            setPipWindow(null);
        };
        targetWindow.addEventListener("pagehide", cleanup);
        targetWindow.addEventListener("beforeunload", cleanup);

        setPipWindow(targetWindow);
    };

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomInput.trim() && socket) {
            socket.emit("createRoom", roomInput.trim());
            setRoomInput("");
        }
    };

    const handleFetchRooms = () => {
        if (socket) socket.emit("getRooms");
    };

    const handleJoinRoom = (roomName: string) => {
        if (socket && !joinedRoom && user) {
            socket.emit("joinRoom", { room: roomName });
            setIsSidebarOpen(false);
        }
    };

    const handleDeleteRoom = (roomName: string, e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        if (socket && user?.role === "admin") socket.emit("deleteRoom", roomName);
        else showAlert("You are not authorized to delete chatrooms.", "Permission denied", 1);
    };

    const handleLeaveRoom = () => {
        if (socket && joinedRoom) {
            socket.emit("leaveRoom", { room: joinedRoom });
            setJoinedRoom("");
            localStorage.removeItem("joinedRoom");
            setMessages([]);
            setTypingStatus("");
            setActiveUsers([]);
            setMessageInput("");
            isCurrentlyTyping.current = false;
            socket.emit("getRooms");
        }
    };

    const stopTypingNotification = () => {
        if (isCurrentlyTyping.current && socket && joinedRoom) {
            isCurrentlyTyping.current = false;
            socket.emit("typing", { room: joinedRoom, isTyping: false });
        }
    };

    const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        playTypingSound();
        if (!isCurrentlyTyping.current && socket && joinedRoom) {
            isCurrentlyTyping.current = true;
            socket.emit("typing", { room: joinedRoom, isTyping: true });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            stopTypingNotification();
        }, 1500);
    };

    const handleSendMessage = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (messageInput.trim() && joinedRoom && socket) {
            socket.emit("sendMessage", { room: joinedRoom, message: messageInput.trim() });
            setMessageInput("");
            stopTypingNotification();
        }
    };

    const handleClearChat = () => {
        if (socket && joinedRoom) socket.emit("clearChat", { room: joinedRoom });
    };

    const handleExportChat = () => {
        if (messages.every((m) => m.user.toLowerCase() === "system")) {
            showAlert("There are no messages to export in this room yet.", "Nothing to export", 3);
            return;
        }
        const exportData = {
            room: joinedRoom,
            exportedAt: new Date().toISOString(),
            history: messages,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute("download", `chat_history_${joinedRoom || "terminal"}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
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
                isPipActive={Boolean(pipWindow)}
                onTogglePip={togglePip}
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
                {pipWindow ? (
                    <>
                        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 p-6 text-center dark:border-stone-800">
                            <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                                Message Terminal is running in an external Desktop PiP window.
                            </p>
                            <button
                                type="button"
                                onClick={togglePip}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:scale-95"
                            >
                                Dock Terminal back to Main Window
                            </button>
                        </div>
                        {createPortal(
                            <div className="h-full w-full p-2">
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
                            </div>,
                            pipWindow.document.body,
                        )}
                    </>
                ) : (
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
                )}
            </main>
        </div>
    );
};
