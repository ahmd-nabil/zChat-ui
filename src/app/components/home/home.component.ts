import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ChatMessage } from 'src/app/model/chat-message.model';
import { ChatResponse } from 'src/app/model/chat-response.model';
import { ChatUser } from 'src/app/model/chat-user.model';
import { MessageResponse } from 'src/app/model/message-response.model';
import { MessageRequest } from 'src/app/model/new-message-request.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked   {
  myClaims : any;
  chats : ChatResponse[] = [];
  messages : MessageResponse[] = [];
  chatId : number | null = null;
  currentChat : ChatResponse | undefined;
  receiver: ChatUser | undefined;
  msgContent = ''
  
  @ViewChild('messagesBox')
  messagesBox!: ElementRef;

  constructor(
    private chatService: ChatService,
    private oauthService: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.myClaims = this.oauthService.getIdentityClaims();
    this.chatService.oldChatsSubject.subscribe(result => {
      if(result) {
        this.chats.push(result);
      }
    });
    this.route.queryParams.subscribe(queryParams => {
      const chatParam = queryParams['chat'];
      this.chatId = +chatParam;
      this.currentChat = this.chats.find(chat => (chat.id == this.chatId));
      if(!this.currentChat) return;
      this.messages = this.currentChat!.chatMessages;
      this.receiver = this.currentChat!.chatUsers.find(user => user.subject !== this.oauthService.getIdentityClaims()['sub']);
      this.chatService.chatMessageSubjectMap.get(this.chatId)?.subscribe(newMessage => {
          if(newMessage) {
            this.messages.push(newMessage);
            this.changeDetection.detectChanges();
          }
      });
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToLastMessage();
  }

  openChat(id : number) {
    this.router.navigate(['/home'], {queryParams: {'chat': id}});
  }

  sendMessage() {
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
