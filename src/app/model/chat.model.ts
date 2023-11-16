import { ChatMessage } from "./chat-message.model";
import { ChatUser } from "./chat-user.model";

export interface Chat {
    id ?: number;
    chatName ?: string;
    chatMessages: ChatMessage[];
    chatUsers: ChatUser[];
    lastMessage: ChatMessage;
}