import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatUser } from '../model/chat-user.model';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private oauthService: OAuthService) { }


  findUserByEmail(email: string): Observable<ChatUser> {
    return this.http.get<ChatUser>("http://localhost:8080/users", { params: {'email': email} , headers: {'Authorization': `Bearer ${this.oauthService.getIdToken()}`}});
  }
  
}
