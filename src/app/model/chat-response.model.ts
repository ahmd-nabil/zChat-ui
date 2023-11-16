import { ChatUser } from "./chat-user.model";
import { MessageResponse } from "./message-response.model";

export interface ChatResponse {
    id ?: number;
    chatName ?: string;
    chatMessages: MessageResponse[];
    chatUsers: ChatUser[];
    lastMessage: MessageResponse;
}