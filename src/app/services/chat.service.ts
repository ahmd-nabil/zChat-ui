import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyRxStompService } from './my-rx-stomp.service';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ChatMessage } from '../model/chat-message.model';
import { Chat } from '../model/chat.model';
import { MessageRequest } from '../model/new-message-request.model';
import { ChatResponse } from '../model/chat-response.model';
import { MessageResponse } from '../model/message-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // todo keep them seperated chat objects with chat info ie (chatname, photo, last-message, ...) and chatMessages with content, sender, receiver, time, seen, ...
  chatMessageSubjectMap = new Map<number, BehaviorSubject<MessageResponse>>();
  oldChatsSubject = new BehaviorSubject<ChatResponse | null>(null);

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
      const message : MessageResponse = JSON.parse(iMessage.body);
      const chatId = message.chatId;
      // check if the message belongs to an old chat append it to its array
      if(this.chatMessageSubjectMap.has(chatId)) {
        this.chatMessageSubjectMap.get(chatId)!.next(message);
      } else {
      // else fetch the new chat from backend add it to the chatMap and append the new messages
      this.chatMessageSubjectMap.set(chatId, new BehaviorSubject<MessageResponse>(message));
      }
    });
  }
  
  getChatById(id : number) {
    return this.http.get<ChatResponse>(`http://localhost:8080/chats/${id}`);
  }

  private setOldChatsArray() {
    this.http.get<ChatResponse[]>(`http://localhost:8080/chats`, {headers: {'Authorization': `Bearer ${this.oauthService.getIdToken()}`}}).subscribe(result => {
      result.forEach(chat => {
        chat.chatName = chat.chatUsers.find(user => user.subject != this.oauthService.getIdentityClaims()['sub'])?.name;
        this.oldChatsSubject.next(chat);
        this.chatMessageSubjectMap.set(chat.id!, new BehaviorSubject<any>(null));
      });
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
}
