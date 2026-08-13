import React, { useState, useEffect, useRef, type SubmitEvent } from 'react';
import { FiMessageSquare, FiUsers, FiActivity, FiSend, FiCopy, FiCheck, FiSmile, FiDownload, FiX, FiMic, FiSquare, FiPaperclip, FiCornerUpLeft, FiEye, FiFile, FiTrash2, FiArrowDown } from 'react-icons/fi';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import type { ChatMessage } from '../types/chat.types';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { renderMarkdown } from '../utils/markdown';
import { getDateKey, getDateLabel, formatTime } from '../utils/formatDate';
import LeaveRoomButton from './common/LeaveRoomButton';

interface MessageTerminalProps {
    joinedRoom: string;
    activeUsers: string[];
    username: string;
    messages: ChatMessage[];
    typingStatus: string;
    messageInput: string;
    setMessageInput: React.Dispatch<React.SetStateAction<string>>;
    handleTypingInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendMessage: (e: SubmitEvent<HTMLFormElement>) => void;
    handleClearChat: () => void;
    handleExportChat: () => void;
    handleLeaveRoom: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    socket: any;
}

const actionBtn = 'flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-400 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400';

export const MessageTerminal: React.FC<MessageTerminalProps> = ({
    joinedRoom,
    activeUsers,
    username,
    messages,
    typingStatus,
    messageInput,
    setMessageInput,
    handleTypingInput,
    handleSendMessage,
    handleClearChat,
    handleExportChat,
    handleLeaveRoom,
    messagesEndRef,
    socket
}) => {
    const { theme } = useTheme();
    const { showAlert } = useAlert();
    const isDarkMode = theme === 'dark';

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [previewFile, setPreviewFile] = useState<{ fileName: string; fileType: string; base64Data: string } | null>(null);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [reactions, setReactions] = useState<Record<string, Record<string, string>>>({});
    const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
    const [activeActionsId, setActiveActionsId] = useState<string | null>(null);

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    socket?.emit('sendFile', {
                        room: joinedRoom,
                        text: `Sent a voice memo.`,
                        file: {
                            fileName: `Voice_Memo_${Date.now()}.webm`,
                            fileType: 'audio/secure-voice',
                            fileSize: audioBlob.size,
                            base64Data: base64String
                        }
                    });
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone hardware access rejected: ", err);
            showAlert('Microphone access was denied. Please allow microphone permissions and try again.', 'Recording failed', 1);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const pickerRef = useRef<HTMLDivElement>(null);
    const reactionMenuRef = useRef<HTMLDivElement>(null);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [isScrolledUp, setIsScrolledUp] = useState(false);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const prevMsgCountRef = useRef(messages.length);
    const initialScrollDoneRef = useRef(false);

    const NEAR_BOTTOM_THRESHOLD = 160;

    const isNearBottom = () => {
        const el = scrollContainerRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
    };

    const handleScroll = () => {
        const scrolledUp = !isNearBottom();
        setIsScrolledUp(scrolledUp);
        if (!scrolledUp) setNewMessagesCount(0);
    };

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        setNewMessagesCount(0);
        setIsScrolledUp(false);
    };

    useEffect(() => {
        prevMsgCountRef.current = 0;
        initialScrollDoneRef.current = false;
        setNewMessagesCount(0);
        setIsScrolledUp(false);
    }, [joinedRoom]);

    useEffect(() => {
        const added = messages.length - prevMsgCountRef.current;
        prevMsgCountRef.current = messages.length;
        if (added <= 0) return;

        /* First batch in a room (e.g. history load): jump instantly */
        if (!initialScrollDoneRef.current) {
            initialScrollDoneRef.current = true;
            scrollToBottom(false);
            return;
        }

        const lastMsg = messages[messages.length - 1];
        const isOwnMessage = lastMsg?.user === username.trim();
        if (isNearBottom() || isOwnMessage) {
            scrollToBottom();
        } else {
            setNewMessagesCount((c) => c + added);
        }
    }, [messages, username]);

    /* Keep the typing indicator visible only when already near the bottom */
    useEffect(() => {
        if (isNearBottom()) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [typingStatus]);

    useEffect(() => {
        if (!socket) return;
        const handleReactionAdded = (data: { messageId: string; user: string; emoji: string }) => {
            setReactions(prev => ({
                ...prev,
                [data.messageId]: { ...prev[data.messageId], [data.user]: data.emoji }
            }));
        };
        const handleReactionRemoved = (data: { messageId: string; user: string }) => {
            setReactions(prev => {
                const msgReactions = { ...prev[data.messageId] };
                delete msgReactions[data.user];
                return { ...prev, [data.messageId]: msgReactions };
            });
        };
        socket.on('reactionAdded', handleReactionAdded);
        socket.on('reactionRemoved', handleReactionRemoved);
        return () => {
            socket.off('reactionAdded', handleReactionAdded);
            socket.off('reactionRemoved', handleReactionRemoved);
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (reactionMenuRef.current && !reactionMenuRef.current.contains(event.target as Node)) {
                setShowReactionPicker(null);
            }
            /* Tap-away dismissal for the mobile message action bar */
            const target = event.target as HTMLElement;
            if (!target.closest?.('[data-msg-card]')) {
                setActiveActionsId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessageInput((prevInput) => prevInput + emojiData.emoji);
    };

    const handleCopyText = async (text: string, index: number) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
                return;
            } catch (err) {
                console.error('Modern API failed, attempting fallback: ', err);
            }
        }
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
            }
        } catch (err) {
            console.error('Fallback: Unable to copy text', err);
        } finally {
            document.body.removeChild(textArea);
        }
    };

    const handleReaction = (messageId: string, emoji: string) => {
        const existingReaction = reactions[messageId]?.[username];
        if (existingReaction === emoji) {
            socket?.emit('removeReaction', { messageId, user: username });
        } else {
            socket?.emit('addReaction', { messageId, user: username, emoji });
        }
        setShowReactionPicker(null);
    };

    const handleReplyClick = (msg: ChatMessage) => {
        setReplyingTo(msg);
        setShowReactionPicker(null);
        setActiveActionsId(null);
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const wrappedHandleSendMessage = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageInput.trim() || !joinedRoom || !socket) return;

        let finalMessage = messageInput.trim();
        if (replyingTo) {
            // Format includes BOTH the username and the actual quoted message
            const cleanQuote = replyingTo.text.replace(/\n/g, ' ').substring(0, 80);
            const isLong = replyingTo.text.length > 80;
            finalMessage = `[Reply to @${replyingTo.user}: "${cleanQuote}${isLong ? '...' : ''}"]\n${finalMessage}`;
        }

        socket.emit('sendMessage', { room: joinedRoom, message: finalMessage });
        setMessageInput('');
        setReplyingTo(null);
    };

    const allSystem = messages.every((m) => m.user.toLowerCase() === 'system');
    const dateKeys = messages.map((m) => getDateKey(m.timestamp));

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card dark:border-stone-800/80 dark:bg-ink">

            {/* Terminal header */}
            <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/60 px-4 py-3.5 dark:border-stone-800/80 dark:bg-stone-900/30 sm:px-5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FiMessageSquare className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
                            {joinedRoom ? `# ${joinedRoom}` : 'Conversation'}
                        </h2>
                        <p className="truncate text-[11px] font-medium text-stone-400 dark:text-stone-500">
                            {joinedRoom
                                ? `${activeUsers.length} member${activeUsers.length === 1 ? '' : 's'} online`
                                : 'Join a room to start chatting'}
                        </p>
                    </div>
                </div>

                {joinedRoom && activeUsers.length > 0 && (
                    <div className="flex shrink-0 items-center gap-2">
                        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <FiUsers className="h-3.5 w-3.5" />
                            {activeUsers.length} online
                        </div>
                        <button
                            type="button"
                            onClick={handleExportChat}
                            disabled={allSystem}
                            title="Export chat history as JSON"
                            aria-label="Export chat history"
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-600 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                        >
                            <FiDownload className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleClearChat()}
                            disabled={allSystem}
                            title="Clear chat for everyone"
                            aria-label="Clear chat"
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                        >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Clear</span>
                        </button>
                        <LeaveRoomButton handleLeaveRoom={handleLeaveRoom} isHeader={false} />
                    </div>
                )}
            </div>

            {/* Messages area */}
            <div className="relative min-h-0 flex-1">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full space-y-3 overflow-y-auto scrollbar-slim bg-stone-50/40 p-4 dark:bg-ink-deep/30 sm:p-5"
                >
                    {!joinedRoom ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400/70">
                                <FiActivity className="h-6 w-6 animate-pulse" />
                            </span>
                            <p className="max-w-xs text-sm leading-relaxed font-medium text-stone-400 dark:text-stone-500">
                                No room selected. Set your display name and join a room to start the conversation.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Room manifest — active users */}
                            {activeUsers.length > 0 && (
                                <div className="mb-5 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-card backdrop-blur-md dark:border-stone-800/80 dark:bg-ink-soft/40">
                                    <div className="mb-3.5 flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                            </span>
                                            <h3 className="text-[11px] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                                                In this room
                                            </h3>
                                        </div>
                                        <span className="font-mono text-xs font-medium text-stone-400 dark:text-stone-500">
                                            {String(activeUsers.length).padStart(2, '0')} online
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
                                        {activeUsers.map((user, idx) => {
                                            const isCurrentUser = user.trim() === username.trim();
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 ease-out sm:py-1.5 ${isCurrentUser
                                                        ? 'border-emerald-500/30 bg-emerald-50/60 text-emerald-950 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300'
                                                        : 'border-stone-100 bg-stone-50/60 text-stone-600 hover:border-stone-200 dark:border-stone-800/70 dark:bg-stone-900/20 dark:text-stone-400 dark:hover:border-stone-700'
                                                        }`}
                                                >
                                                    <div className="relative shrink-0">
                                                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white uppercase transition-transform duration-300 group-hover:scale-105 ${isCurrentUser
                                                            ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400'
                                                            : 'bg-stone-300 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                                                            }`}
                                                        >
                                                            {user.charAt(0)}
                                                        </span>
                                                        {!isCurrentUser && (
                                                            <span className="absolute right-0 bottom-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-ink" />
                                                        )}
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-1.5">
                                                        <span className="truncate text-xs font-semibold tracking-wide">{user}</span>
                                                        {isCurrentUser && (
                                                            <span className="text-[10px] font-bold tracking-wider text-emerald-600/90 uppercase dark:text-emerald-400/90 sm:ml-auto">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const isSystem = msg.user === 'System';
                                const isMe = msg.user === username.trim();
                                const msgId = msg.id || `msg-${index}`;
                                const msgReactions = reactions[msgId] || {};

                                let displayText = msg.text || '';
                                let replyContext: { user: string; quote: string } | null = null;

                                if (displayText.startsWith('[Reply to @')) {
                                    const firstUserMatch = displayText.match(/^\[Reply to @([^:]+):/);
                                    const replyUser = firstUserMatch ? firstUserMatch[1] : 'Unknown';

                                    const lastBracketIndex = displayText.lastIndexOf(']');
                                    if (lastBracketIndex !== -1) {
                                        displayText = displayText.substring(lastBracketIndex + 1).trim();
                                    }

                                    let quoteText = '';
                                    const quoteMatches = msg.text.match(/"([^"]+)"/g);
                                    if (quoteMatches && quoteMatches.length > 0) {
                                        quoteText = quoteMatches[quoteMatches.length - 1].replace(/"/g, '');
                                    } else {
                                        quoteText = 'Original message';
                                    }

                                    replyContext = {
                                        user: replyUser,
                                        quote: quoteText
                                    };
                                }

                                const needsDivider = index === 0 || dateKeys[index] !== dateKeys[index - 1];

                                return (
                                    <React.Fragment key={index}>
                                        {needsDivider && (
                                            <div title={msg.timestamp ? new Date(msg.timestamp).toLocaleString() : undefined} className="my-4 flex items-center justify-center gap-3 px-2">
                                                <div className="h-px flex-1 bg-stone-200/90 dark:bg-stone-800" />
                                                <span className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-stone-500 shadow-sm dark:border-stone-700/70 dark:bg-ink-soft dark:text-stone-400">
                                                    {getDateLabel(msg.timestamp)}
                                                </span>
                                                <div className="h-px flex-1 bg-stone-200/90 dark:bg-stone-800" />
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isSystem ? 'my-2 items-center justify-center' : (isMe ? 'items-end' : 'items-start')}`}>
                                            {isSystem ? (
                                                <div className="my-3 flex w-full items-center justify-center px-4">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-400/70 dark:to-emerald-700/60" />
                                                    <span className="mx-4 flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 font-mono text-[11px] font-medium tracking-wide text-stone-500 shadow-sm dark:border-emerald-700/40 dark:bg-emerald-900/40 dark:text-emerald-200">
                                                        <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                                                        {renderMarkdown(displayText)}
                                                    </span>
                                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-400/70 dark:to-emerald-700/60" />
                                                </div>
                                            ) : (
                                                <div
                                                    data-msg-card
                                                    onClick={() => setActiveActionsId(prev => prev === msgId ? null : msgId)}
                                                    className={`group relative mb-3 max-w-[85%] cursor-pointer rounded-2xl px-4 py-3 shadow-card transition-all duration-200 ease-out sm:max-w-[75%] ${isMe
                                                        ? 'ml-auto rounded-br-md bg-emerald-600 dark:bg-emerald-700'
                                                        : 'mr-auto rounded-bl-md border border-stone-200/80 bg-white dark:border-stone-700/60 dark:bg-ink-soft'
                                                        }`}
                                                >
                                                    {!isMe && (
                                                        <span className="mb-1 block text-[11px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                                                            {msg.user}
                                                        </span>
                                                    )}

                                                    {replyContext && (
                                                        <div className={`mb-2.5 rounded-lg border-l-2 p-2.5 text-xs ${isMe
                                                            ? 'border-emerald-300 bg-emerald-700/50 text-emerald-50/90'
                                                            : 'border-emerald-500 bg-stone-50 text-stone-600 dark:bg-ink-deep/60 dark:text-stone-400'
                                                            }`}
                                                        >
                                                            <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold opacity-90">
                                                                <FiCornerUpLeft className="h-3 w-3 shrink-0" />
                                                                <span>@{replyContext.user}</span>
                                                            </div>
                                                            <p className="line-clamp-1 text-[11px] leading-relaxed font-normal opacity-75">
                                                                {replyContext.quote}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <p className={`text-sm leading-relaxed font-normal tracking-wide break-words whitespace-pre-wrap ${isMe ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                                                        {displayText}
                                                    </p>

                                                    {/* File / media attachment */}
                                                    {msg.file && (
                                                        <div className={`mt-2.5 flex max-w-sm items-center gap-3 rounded-xl border p-2.5 ${isMe
                                                            ? 'border-emerald-500/30 bg-emerald-700/50'
                                                            : 'border-stone-200 bg-stone-50 dark:border-stone-700/70 dark:bg-ink-deep/60'
                                                            }`}
                                                        >
                                                            {msg.file.fileType.startsWith('image/') ? (
                                                                <img
                                                                    src={msg.file.base64Data}
                                                                    alt={msg.file.fileName}
                                                                    className="h-12 w-12 shrink-0 rounded-lg border border-stone-200/60 object-cover shadow-sm dark:border-stone-700"
                                                                />
                                                            ) : (
                                                                <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase shadow-sm ${isMe
                                                                    ? 'border border-emerald-400/20 bg-emerald-500/30 text-emerald-50'
                                                                    : 'bg-stone-200/70 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                                                                    }`}
                                                                >
                                                                    <FiFile className="mb-0.5 h-4 w-4 opacity-70" />
                                                                    <span>{msg.file.fileName.split('.').pop() || 'file'}</span>
                                                                </div>
                                                            )}

                                                            <div className="min-w-0 flex-1">
                                                                <span className={`block truncate text-xs font-semibold tracking-wide ${isMe ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                                                                    {msg.file.fileName}
                                                                </span>
                                                                <span className={`mt-0.5 block font-mono text-[10px] ${isMe ? 'text-emerald-100/80' : 'text-stone-500 dark:text-stone-400'}`}>
                                                                    {(msg.file.fileSize / 1024).toFixed(1)} KB
                                                                </span>
                                                            </div>

                                                            <div className="flex shrink-0 items-center gap-1">
                                                                {(msg.file.fileType.startsWith('image/') || msg.file.fileType.startsWith('video/') || msg.file.fileType.startsWith('audio/') || msg.file.fileType === 'application/pdf') && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => { e.stopPropagation(); setPreviewFile({ fileName: msg.file!.fileName, fileType: msg.file!.fileType, base64Data: msg.file!.base64Data }); }}
                                                                        title="Preview attachment"
                                                                        aria-label={`Preview ${msg.file.fileName}`}
                                                                        className={`rounded-md border p-1.5 transition-all active:scale-95 ${isMe
                                                                            ? 'border-emerald-500/20 bg-emerald-600/60 text-white hover:bg-emerald-600'
                                                                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800'
                                                                            }`}
                                                                    >
                                                                        <FiEye className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                                <a
                                                                    href={msg.file.base64Data}
                                                                    download={msg.file.fileName}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    title="Download attachment"
                                                                    aria-label={`Download ${msg.file.fileName}`}
                                                                    className={`rounded-md border p-1.5 transition-all active:scale-95 ${isMe
                                                                        ? 'border-emerald-500/20 bg-emerald-600/60 text-white hover:bg-emerald-600'
                                                                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800'
                                                                        }`}
                                                                >
                                                                    <FiDownload className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg.timestamp && (
                                                        <span className={`mt-1.5 block text-right font-mono text-[10px] leading-none tabular-nums ${isMe ? 'text-emerald-100/70' : 'text-stone-400 dark:text-stone-500'}`}>
                                                            {formatTime(msg.timestamp)}
                                                        </span>
                                                    )}

                                                    {/* Floating action bar — hover on desktop, tap on mobile */}
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={`absolute -top-4 z-30 flex items-center gap-0.5 rounded-full border border-stone-200/90 bg-white/95 p-1 shadow-pop backdrop-blur-md transition-all duration-200 ease-out dark:border-stone-700/80 dark:bg-ink-soft/95 ${activeActionsId === msgId
                                                            ? 'scale-100 opacity-100'
                                                            : 'scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 focus-within:scale-100 focus-within:opacity-100'
                                                            } ${isMe ? 'right-3' : 'left-3'}`}
                                                    >
                                                        <button
                                                            onClick={() => handleReplyClick(msg)}
                                                            type="button"
                                                            title="Reply"
                                                            aria-label="Reply to message"
                                                            className="rounded-full p-1.5 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                                                        >
                                                            <FiCornerUpLeft className="h-3.5 w-3.5" />
                                                        </button>

                                                        <div className="relative" ref={showReactionPicker === msgId ? reactionMenuRef : null}>
                                                            <button
                                                                onClick={() => setShowReactionPicker(showReactionPicker === msgId ? null : msgId)}
                                                                type="button"
                                                                title="React"
                                                                aria-label="Add reaction"
                                                                className={`rounded-full p-1.5 transition-colors ${showReactionPicker === msgId
                                                                    ? 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                                                                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200'
                                                                    }`}
                                                            >
                                                                <FiSmile className="h-3.5 w-3.5" />
                                                            </button>

                                                            {showReactionPicker === msgId && (
                                                                <div className={`absolute bottom-full z-50 mb-2.5 overflow-hidden rounded-2xl border border-stone-200 shadow-pop animate-scale-in dark:border-stone-800 ${isMe ? 'right-0' : 'left-0'}`}>
                                                                    <EmojiPicker
                                                                        theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                                                                        onEmojiClick={(emojiData) => {
                                                                            handleReaction(msgId, emojiData.emoji);
                                                                            setShowReactionPicker(null);
                                                                            setActiveActionsId(null);
                                                                        }}
                                                                        lazyLoadEmojis={true}
                                                                        skinTonesDisabled
                                                                        searchPlaceHolder="Search reactions..."
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => { handleCopyText(msg.text, index); setActiveActionsId(null); }}
                                                            type="button"
                                                            title="Copy message"
                                                            aria-label="Copy message text"
                                                            className="rounded-full p-1.5 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                                                        >
                                                            {copiedIndex === index ? (
                                                                <FiCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                            ) : (
                                                                <FiCopy className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Reactions */}
                                                    {Object.keys(msgReactions).length > 0 && (
                                                        <div className={`absolute -bottom-3.5 z-20 flex flex-wrap items-center gap-1.5 rounded-full border px-2 py-0.5 shadow-card backdrop-blur-sm ${isMe
                                                            ? 'left-3 border-emerald-500/20 bg-emerald-50/95 dark:border-stone-700 dark:bg-ink-soft/95'
                                                            : 'right-3 border-stone-200/90 bg-white/95 dark:border-stone-700 dark:bg-ink-soft/95'
                                                            }`}
                                                        >
                                                            {Object.entries(
                                                                Object.entries(msgReactions).reduce((acc: any, [user, emoji]: [any, any]) => {
                                                                    if (!acc[emoji]) acc[emoji] = [];
                                                                    acc[emoji].push(user);
                                                                    return acc;
                                                                }, {})
                                                            ).map(([emoji, users]: [any, any]) => {
                                                                const hasReacted = users.includes(username?.trim());
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={emoji}
                                                                        title={`${emoji} reacted by: ${users.join(', ')}`}
                                                                        onClick={(e) => { e.stopPropagation(); handleReaction(msgId, emoji); }}
                                                                        className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium transition-colors select-none ${hasReacted
                                                                            ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                                            : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70 dark:bg-stone-800/60 dark:text-stone-400 dark:hover:bg-stone-800'
                                                                            }`}
                                                                    >
                                                                        <span className="scale-95 text-sm">{emoji}</span>
                                                                        {users.length > 1 && (
                                                                            <span className="font-mono text-[10px] font-bold">{users.length}</span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </>
                    )
                    }

                    {/* Typing indicator */}
                    {typingStatus && (
                        <div className="flex w-fit animate-fade-in items-center gap-2.5 rounded-full border border-stone-200/80 bg-white px-4 py-2 text-xs font-medium text-stone-500 shadow-card dark:border-stone-700/60 dark:bg-ink-soft dark:text-stone-400">
                            <span className="flex items-center gap-1">
                                {[0, 150, 300].map((d) => (
                                    <span key={d} className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-emerald-500" style={{ animationDelay: `${d}ms` }} />
                                ))}
                            </span>
                            <span className="italic">{typingStatus}</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll-to-bottom pill */}
                {isScrolledUp && (
                    <button
                        type="button"
                        onClick={() => scrollToBottom()}
                        className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 animate-scale-in items-center gap-2 rounded-full border border-stone-200 bg-white/95 py-2 pr-4 pl-3.5 text-xs font-bold text-stone-600 shadow-pop backdrop-blur-md transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-95 dark:border-stone-700 dark:bg-ink-soft/95 dark:text-stone-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                    >
                        <FiArrowDown className="h-3.5 w-3.5" />
                        {newMessagesCount > 0
                            ? `${newMessagesCount} new message${newMessagesCount === 1 ? '' : 's'}`
                            : 'Jump to latest'}
                    </button>
                )}
            </div>

            {/* Composer */}
            <div className="relative flex-shrink-0 border-t border-stone-200/80 bg-white/85 p-3 backdrop-blur-md dark:border-stone-800/80 dark:bg-ink/85 sm:p-4">

                {/* Reply banner */}
                {replyingTo && (() => {
                    let cleanPreviewText = replyingTo.text || '';

                    while (cleanPreviewText.startsWith('[Reply to @')) {
                        const closingBracketIdx = cleanPreviewText.indexOf(']\n');
                        if (closingBracketIdx !== -1) {
                            cleanPreviewText = cleanPreviewText.substring(closingBracketIdx + 2);
                        } else {
                            const structuralRegex = /^\[Reply to @[^:]+: "([\s\S]*?)"\]\s*/;
                            if (structuralRegex.test(cleanPreviewText)) {
                                cleanPreviewText = cleanPreviewText.replace(structuralRegex, '');
                            } else {
                                break;
                            }
                        }
                    }

                    return (
                        <div className="absolute inset-x-0 bottom-full z-40 flex items-center justify-between border-t border-stone-200/80 bg-stone-50/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md animate-slide-up dark:border-stone-800/80 dark:bg-ink-soft/95" style={{ animation: 'slide-down 0.25s cubic-bezier(0.16,1,0.3,1) both' }}>
                            <div className="mr-4 flex min-w-0 flex-1 items-start gap-2.5">
                                <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                                    <FiCornerUpLeft className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                        Replying to @{replyingTo.user}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs font-medium text-stone-600 dark:text-stone-300">
                                        {cleanPreviewText}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={cancelReply}
                                type="button"
                                aria-label="Cancel reply"
                                title="Cancel reply"
                                className="shrink-0 rounded-full bg-stone-200/60 p-1.5 text-stone-500 transition-colors hover:bg-stone-300/60 hover:text-stone-800 dark:bg-stone-800/70 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                            >
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    );
                })()}

                {/* Emoji picker */}
                {showEmojiPicker && (
                    <div ref={pickerRef} className="absolute bottom-[4.5rem] left-3 z-50 animate-scale-in overflow-hidden rounded-2xl border border-stone-200 shadow-pop dark:border-stone-700">
                        <EmojiPicker
                            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                            onEmojiClick={onEmojiClick}
                            lazyLoadEmojis={true}
                            skinTonesDisabled
                            searchPlaceHolder="Search emojis…"
                        />
                    </div>
                )}

                <form onSubmit={wrappedHandleSendMessage} className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={!joinedRoom}
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        aria-label="Toggle emoji picker"
                        title="Emoji"
                        className={actionBtn}
                    >
                        <FiSmile className="h-5 w-5" />
                    </button>

                    <input
                        type="file"
                        id="hidden-file-input"
                        className="hidden"
                        disabled={!joinedRoom}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 25 * 1024 * 1024) {
                                showAlert('Transmission aborted — the file exceeds the 25 MB limit.', 'File too large', 1);
                                e.target.value = '';
                                return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                socket?.emit('sendFile', { room: joinedRoom, text: `Sent a file: ${file.name}`, file: { fileName: file.name, fileType: file.type, fileSize: file.size, base64Data: reader.result as string } });
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                        }}
                    />

                    <button
                        type="button"
                        disabled={!joinedRoom}
                        onClick={() => document.getElementById('hidden-file-input')?.click()}
                        aria-label="Attach a file"
                        title="Attach file (max 25 MB)"
                        className={actionBtn}
                    >
                        <FiPaperclip className="h-5 w-5" />
                    </button>

                    <input
                        type="text"
                        disabled={!joinedRoom}
                        value={messageInput}
                        onChange={handleTypingInput}
                        placeholder={isRecording ? 'Recording voice memo…' : joinedRoom ? 'Type a message…' : 'Join a room to start chatting'}
                        aria-label="Message"
                        className="h-11 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-ink-soft dark:text-cream-soft dark:placeholder:text-stone-500 dark:focus:border-emerald-500"
                    />

                    <button
                        type="button"
                        disabled={!joinedRoom}
                        onClick={isRecording ? stopRecording : startRecording}
                        aria-label={isRecording ? 'Stop recording voice memo' : 'Record voice memo'}
                        title={isRecording ? 'Stop recording' : 'Record voice memo'}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${isRecording
                            ? 'animate-pulse border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                            : 'border-stone-200 bg-white text-stone-500 hover:border-emerald-400 hover:text-emerald-600 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-400 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400'
                            }`}
                    >
                        {isRecording ? <FiSquare className="h-4 w-4" fill="currentColor" /> : <FiMic className="h-5 w-5" />}
                    </button>

                    <button
                        type="submit"
                        disabled={!joinedRoom || !messageInput.trim()}
                        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none sm:px-5 dark:disabled:bg-stone-800 dark:disabled:text-stone-600"
                    >
                        <span className="hidden sm:inline">Send</span>
                        <FiSend className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* File preview modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Preview of ${previewFile.fileName}`}>
                    <div className="absolute inset-0 animate-fade-in bg-stone-950/70 backdrop-blur-sm" onClick={() => setPreviewFile(null)} />
                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-pop dark:border-stone-700/60 dark:bg-ink">
                        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/80 px-5 py-4 dark:border-stone-800 dark:bg-stone-900/40">
                            <span className="truncate pr-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
                                Preview: {previewFile.fileName}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewFile(null)}
                                aria-label="Close preview"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-colors hover:text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-white"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex min-h-[200px] flex-1 items-center justify-center overflow-y-auto scrollbar-slim bg-stone-50 p-6 dark:bg-ink-deep/40">
                            {previewFile.fileType.startsWith('image/') && (
                                <img src={previewFile.base64Data} alt={previewFile.fileName} className="max-h-[55vh] max-w-full rounded-lg object-contain shadow-card" />
                            )}
                            {previewFile.fileType.startsWith('video/') && (
                                <video src={previewFile.base64Data} controls autoPlay className="max-h-[55vh] max-w-full rounded-lg shadow-card" />
                            )}
                            {previewFile.fileType.startsWith('audio/') && (
                                <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700/60 dark:bg-ink-soft">
                                    <audio src={previewFile.base64Data} controls autoPlay className="w-full" />
                                </div>
                            )}
                            {previewFile.fileType === 'application/pdf' && (
                                <iframe src={previewFile.base64Data} title={previewFile.fileName} className="h-[55vh] w-full rounded-lg border border-stone-200 bg-white dark:border-stone-700/60" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};