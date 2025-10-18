export enum MessageAuthor {
    USER = 'user',
    AGENT = 'agent',
    SYSTEM = 'system',
}

export interface ChatMessage {
    author: MessageAuthor;
    content: string;
}
