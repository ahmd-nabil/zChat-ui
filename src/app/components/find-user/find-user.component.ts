import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit {
  email : string = "";
  
  constructor(
    public dialogRef: MatDialogRef<FindUserComponent>,
    private userService: UserService,
    private chatService: ChatService,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {
    console.log('The dialog was opened');
  }


  addUser() {
    this.userService.findUserByEmail(this.email).subscribe(user => {
      const newChatSubjects = [user.subject, this.oauthService.getIdentityClaims()['sub']];
      this.chatService.addNewChat(newChatSubjects).subscribe(chat => this.dialogRef.close(chat));
    });
  }
}
