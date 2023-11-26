import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MyRxStompService } from './services/my-rx-stomp.service';
import { myRxStompServiceFactory } from './my-rx-stomp-service-factory';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DateFnsConfigurationService, DateFnsModule, FormatDistanceToNowPipeModule } from 'ngx-date-fns';
import { enUS, arEG } from "date-fns/locale";
import { ChatsComponent } from './components/chats/chats.component';
import { MatMenuModule } from '@angular/material/menu';

const FnsConfiguration = new DateFnsConfigurationService();
FnsConfiguration.setLocale(enUS);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ChatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    OAuthModule.forRoot(),
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    DateFnsModule.forRoot(),
    MatMenuModule,
  ],
  providers: [
    {
      provide: MyRxStompService,
      useFactory: myRxStompServiceFactory,
    },
    { provide: DateFnsConfigurationService, useValue: FnsConfiguration },
    { provide: OAuthStorage, useValue: localStorage}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
