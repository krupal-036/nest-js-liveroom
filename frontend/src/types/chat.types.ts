export interface UserTypingData {
    user: string;
    isTyping: boolean;
}

export interface FileAttachment {
    fileName: string;
    fileType: string;
    fileSize: number;
    base64Data: string;
}

export interface ChatMessage {
    id?: any;
    user: string;
    text: string;
    file?: FileAttachment;
    timestamp?: string;
}

export type MessageReactions = Record<string, Record<string, string>>;
