import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { MyRxStompService } from './my-rx-stomp.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private myRxStomp: MyRxStompService) { }

  login(username: string, password: string) {
    // this is for now, TODO make a post request, on success send a CONNECT message with JWT
    this.myRxStomp.configure({
      connectHeaders: {
        login: username,
        passcode: `{noop}${password}`,
      }
    })
    this.myRxStomp.activate();
    this.myRxStomp.watch({destination: '/user/queue/messages'}).subscribe(messages => {console.log("TODO change to add to ui");console.log(messages);})
  }

}
