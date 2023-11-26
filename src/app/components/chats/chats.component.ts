import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs';
import { ChatResponse } from 'src/app/model/chat-response.model';
import { ChatUser } from 'src/app/model/chat-user.model';
import { MessageResponse } from 'src/app/model/message-response.model';
import { MessageRequest } from 'src/app/model/new-message-request.model';
import { ChatService } from 'src/app/services/chat.service';

// TODO change the whole subsription model (should be better than that)
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, AfterViewChecked {
  myClaims : any;
  chats : ChatResponse[] = [];
  messages : MessageResponse[] = [];
  chatId : number | null = null;
  currentChat : ChatResponse | undefined;
  receiver: ChatUser | undefined;
  msgContent = ''

  currentMessagesSub ?: Subscription;
  @ViewChild('scroller')
  messagesBox!: ElementRef;

  constructor(
    private chatService: ChatService,
    private oauthService: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.myClaims = this.oauthService.getIdentityClaims();
    this.chatService.oldChatsSubject.subscribe(result => {
      if(result) {
        this.chats.push(result);
      }
    });

    this.chatService.userStatusSubject.subscribe(status => {
      this.chats.flatMap(chat => chat.chatUsers).filter(user => user.subject === status?.subject).forEach(user => {
        user.lastSeen = status?.lastSeen;
        user.isOnline = status?.isOnline;
      });
    });

    this.route.queryParams.subscribe(queryParams => {
      if(this.currentMessagesSub) {
        this.currentMessagesSub.unsubscribe();
      }
      const chatParam = queryParams['chat'];
      this.chatId = +chatParam;
      this.currentChat = this.chats.find(chat => (chat.id == this.chatId));
      if(!this.currentChat) return;
      this.messages = this.currentChat!.chatMessages;
      this.receiver = this.currentChat!.chatUsers.find(user => user.subject !== this.oauthService.getIdentityClaims()['sub']);
      this.currentMessagesSub = this.chatService.chatMessageSubjectMap.get(this.chatId)?.subscribe(newMessage => {
          if(newMessage) {
            this.currentChat!.lastMessage = newMessage;
            this.messages.push(newMessage);
          }
      });
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToLastMessage();
  }

  openChat(id : number) {
    this.router.navigate(['/chats'], {queryParams: {'chat': id}});
  }

  sendMessage() {
    if(!this.msgContent || this.msgContent === "") return;
    const newMessage : MessageRequest = 
    {
      chatId: this.chatId,
      content: this.msgContent,
      senderSubject: this.oauthService.getIdentityClaims()['sub'],
      receiverSubject: this.receiver!.subject!,
      id: null,
      senderId: null,
      receiverId: null
    };
    this.chatService.sendMessage(newMessage);
    this.msgContent = '';
  }

  scrollToLastMessage() {
    try {
      if(this.messagesBox) this.messagesBox.nativeElement.scrollTop = this.messagesBox.nativeElement.scrollHeight;
    } catch(error) {
      console.log(error);
    }
  }

}
