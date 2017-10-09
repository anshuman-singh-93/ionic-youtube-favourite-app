import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import {CONFIG} from './app.config';
import {AngularFireModule} from 'angularfire2'
import {AngularFireAuthModule} from "angularfire2/auth/auth.module";
import {AngularFireDatabaseModule} from "angularfire2/database/database.module";
import {HttpModule} from "@angular/http";
import {FirebaseServiceProvider} from "../providers/firebase-service/firebase-service";
import { YoutubeServiceProvider } from '../providers/youtube-service/youtube-service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AuthenticationServiceProvider } from '../providers/authentication-service/authentication-service';
import {LoadingSpinnerServiceProvider} from "../providers/loading-spinner-service/loading-spinner-service";
import {ErrorHandlerServiceProvider} from "../providers/error-handler-service/error-handler-service";
import {ComponentsModule} from "../components/components.module";
import { FavouriteServiceProvider } from '../providers/favourite-service/favourite-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(CONFIG.firebase),
    IonicModule.forRoot(MyApp,{tabsPlacement:'bottom'}),
    AngularFireAuthModule,
    AngularFireDatabaseModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AlertServiceProvider,
    ToastServiceProvider,
    FirebaseServiceProvider,
    YoutubeServiceProvider,
    YoutubeVideoPlayer,
    AuthenticationServiceProvider,
    LoadingSpinnerServiceProvider,
    ErrorHandlerServiceProvider,
    FavouriteServiceProvider
  ]
})
export class AppModule {}
