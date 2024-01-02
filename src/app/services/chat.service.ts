import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyRxStompService } from './my-rx-stomp.service';
import { BehaviorSubject, Observable, retry, retryWhen } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { MessageRequest } from '../model/new-message-request.model';
import { ChatResponse } from '../model/chat-response.model';
import { MessageResponse } from '../model/message-response.model';
import { ChatUserStatus } from '../model/user-status.model';
import { Chat } from '../model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // todo keep them seperated chat objects with chat info ie (chatname, photo, last-message, ...) and chatMessages with content, sender, receiver, time, seen, ...
  chatMessageSubjectMap = new Map<number, BehaviorSubject<MessageResponse>>();
  oldChatsSubject = new BehaviorSubject<ChatResponse | null>(null);
  userStatusSubject = new BehaviorSubject<ChatUserStatus | null>(null);

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    private myRxStompService: MyRxStompService
    ) {
      console.log("CHAT SERVice")
      this.setupConnectionsToServer();
    }



  setupConnectionsToServer() {
    /** Adding header configs for stomp and connecting to ws server */
    this.myRxStompService.configure({
      connectHeaders: {
        Authorization: `Bearer ${this.oauthService.getIdToken()}`,
      }
    });
    // once connected pull all old data
    this.myRxStompService.connected$.subscribe(
      () => this.setOldChatsArray()
    )
    
    // once connected subscribe to the private queue to get all realtime new messages
    this.myRxStompService.watch({destination: '/user/queue/messages'}).subscribe(iMessage => {
      const message : MessageResponse = JSON.parse(iMessage.body);
      this.changeMessageStringsToDate(message);
      const chatId = message.chatId;
      // check if the message belongs to an old chat append it to its array
      if(this.chatMessageSubjectMap.has(chatId)) {
        this.chatMessageSubjectMap.get(chatId)!.next(message);
      } else {
      // else fetch the new chat from backend add it to the chatMap and append the new messages
      this.chatMessageSubjectMap.set(chatId, new BehaviorSubject<MessageResponse>(message));
      }
    });

    // subscribtion for logged in logged out users
    this.myRxStompService.watch({destination: '/topic/status'}).subscribe(iMessage => {
      const userStatus : ChatUserStatus = JSON.parse(iMessage.body);
      userStatus.lastSeen = new Date(userStatus.lastSeen);
      this.userStatusSubject.next(userStatus);
    });

    // initiate the connection with the broker
    this.myRxStompService.activate();
  }
  
  getChatById(id : number) {
    return this.http.get<ChatResponse>(`http://localhost:8080/chats/${id}`);
  }

  private setOldChatsArray() {
    this.http.get<ChatResponse[]>(`http://localhost:8080/chats`, {headers: {'Authorization': `Bearer ${this.oauthService.getIdToken()}`}})
    .subscribe({
      next: (result) => {
        result.forEach(chat => {
          chat.chatName = chat.chatUsers.find(user => user.subject != this.oauthService.getIdentityClaims()['sub'])?.name;
          this.changeChatMessagesStringsToDates(chat);
          this.oldChatsSubject.next(chat);
          this.chatMessageSubjectMap.set(chat.id!, new BehaviorSubject<any>(null));
        });
      },
      error: (error) => {
        console.log(error);
        retry({
          delay: 1000
        });
      }
    });
  }

  public sendMessage(newMessage: MessageRequest) {
    this.myRxStompService.publish({
      destination: "/app/messages/private",
      body: JSON.stringify(newMessage)
    });
  }

  private setOldMessages() {
  }
  
  public isMyMessage(message: MessageResponse): boolean {
    return this.oauthService.getIdentityClaims()['sub'] === message.senderSubject;
  }

  changeChatMessagesStringsToDates(chatResponse: ChatResponse) {
    chatResponse.chatMessages.forEach(msg => msg.createdAt = new Date(msg.createdAt));
    chatResponse.lastMessage.createdAt = new Date(chatResponse.lastMessage.createdAt);
    chatResponse.chatUsers.forEach(user => user.lastSeen = new Date(user.lastSeen!));
  }

  changeMessageStringsToDate(message: MessageResponse) {
    message.createdAt = new Date(message.createdAt);
  }

  addNewChat(subjects : string[]): Observable<Chat> {
    return this.http.post<Chat>("http://localhost:8080/chats", subjects, {headers: {'Authorization': `Bearer ${this.oauthService.getIdToken()}`}});
  }
}
