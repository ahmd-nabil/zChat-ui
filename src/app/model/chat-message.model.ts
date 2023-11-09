import { ChatUser } from "./chat-user.model";
import { Chat } from "./chat.model";

export interface ChatMessage {
    id ?: number;
    content ?: string;
    sender ?: ChatUser;
    receiver ?: ChatUser;
    chat ?: Chat;
}