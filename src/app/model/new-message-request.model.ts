export interface MessageRequest {
    id : number | null;
    senderId : number | null;
    receiverId: number | null;
    chatId: number | null;
    content : string;
    senderSubject: string;
    receiverSubject: string;
}