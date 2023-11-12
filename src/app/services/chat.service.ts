import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyRxStompService } from './my-rx-stomp.service';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ChatMessage } from '../model/chat-message.model';
import { Chat } from '../model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  stompMessagesSubject = new BehaviorSubject<any>(null);
  chatMessageSubjectMap = new Map<number, BehaviorSubject<any>>();
  oldChatsSubject = new BehaviorSubject<Chat | null>(null);

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    private myRxStompService: MyRxStompService
    ) {
      this.subscribeToPrivateMessagesQueue();
      this.setOldChatsArray();  
    }



  subscribeToPrivateMessagesQueue() {
    /** Adding header configs for stomp and connecting to ws server */
    this.myRxStompService.configure({
      connectHeaders: {
        Authorization: `Bearer ${this.oauthService.getIdToken()}`,
      }
    });
    this.myRxStompService.activate();

    this.myRxStompService.watch({destination: '/user/queue/messages'}).subscribe(iMessage => {
      const chatMessage : ChatMessage = JSON.parse(iMessage.body);
      const chatId = chatMessage.chat?.id!;
      // check if the message belongs to an old chat append it to its array
      if(this.chatMessageSubjectMap.has(chatId)) {
        this.chatMessageSubjectMap.get(chatId)?.next(chatMessage);
      } else {
      // else fetch the new chat from backend add it to the chatMap and append the new messages
      this.chatMessageSubjectMap.set(chatId, new BehaviorSubject<any>(chatMessage));
      // this.oldChatsSubject.next(new chat())
      }
    });
  }
  
  getChatById(id : number) {
    return this.http.get(`http://localhost:8080/chats/${id}`);
  }

  private setOldChatsArray() {
    this.http.get<Chat[]>(`http://localhost:8080/chats`, {headers: {'Authorization': `Bearer ${this.oauthService.getIdToken()}`}}).subscribe(result => {
      result.forEach(chat => {
        chat.chatName = chat.chatUsers.find(user => user.name !== this.oauthService.getIdentityClaims()['name'])?.name;
        this.oldChatsSubject.next(chat);
      });
    });
  }

  private setOldMessages() {

  }
}
