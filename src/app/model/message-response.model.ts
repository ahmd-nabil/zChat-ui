export interface MessageResponse {
    id: number | null;
    content: string;
    senderId: number;
    receiverId: number;
    chatId: number;
    senderSubject: string;
    receiverSubject: string;
}