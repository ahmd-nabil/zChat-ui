import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms'
import { MyRxStompService } from './services/my-rx-stomp.service';
import { myRxStompServiceFactory } from './my-rx-stomp-service-factory';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    OAuthModule.forRoot(),
    MatSidenavModule,
    MatListModule,
  ],
  providers: [
    {
      provide: MyRxStompService,
      useFactory: myRxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
