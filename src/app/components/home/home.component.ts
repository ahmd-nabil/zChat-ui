import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ChatMessage } from 'src/app/model/chat-message.model';
import { Chat } from 'src/app/model/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  myClaims : any;
  chats : Chat[] = [];
  messages : ChatMessage[] = [];

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
        console.log(this.chats);
        console.log(this.myClaims)
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      console.log('called');
      const chatParam = queryParams['chat'];
      const chatId = +chatParam;
      this.messages = this.chats.find(chat => (chat.id == chatId))!.chatMessages;
      this.changeDetection.detectChanges();
      this.chatService.chatMessageSubjectMap.get(chatId)?.subscribe(newMessage => this.messages.push(newMessage));
    });
  }

  openChat(id : number) {
    this.router.navigate(['/home'], {queryParams: {'chat': id}});
  }
}
