import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { MyRxStompService } from './my-rx-stomp.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private myRxStomp: MyRxStompService,
    private oauthService: OAuthService) { }


// ONLY LOGIN WITH GOOGLE FOR NOW (TODO implement username, password loging)
  login(username: string, password: string) {
    // TODO make a post request, on success send a CONNECT message with JWT
    this.oauthService.initLoginFlow();

    /** Adding header configs for stomp and connecting to ws server */
    // this.myRxStomp.configure({
    //   connectHeaders: {
    //     login: username,
    //     passcode: `{noop}${password}`,
    //   }
    // })
    // this.myRxStomp.activate();
    // this.myRxStomp.watch({destination: '/user/queue/messages'}).subscribe(messages => {console.log("TODO change to add to ui");console.log(messages);})
  }

  loginWithGmail() {
    this.oauthService.initLoginFlow();
  }
  
  public logout() {
    this.oauthService.logOut();
  }

  public name() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    console.log(claims);
    return claims['given_name'];
  }
}
