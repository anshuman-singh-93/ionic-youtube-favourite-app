import { Component } from '@angular/core';
import {Platform, LoadingController, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireAuth} from "angularfire2/auth/auth";
import {AuthenticationServiceProvider} from "../providers/authentication-service/authentication-service";
import {CONFIG} from '../app/app.config'
import {FavouriteServiceProvider} from "../providers/favourite-service/favourite-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen,
              private afireAuth:AngularFireAuth,
              private events:Events,
              private favouriteService:FavouriteServiceProvider,
              private authService:AuthenticationServiceProvider) {
    platform.ready().then(() => {

// let status bar overlay webview
      this.statusBar.overlaysWebView(true);

// set status bar to white
      this.statusBar.backgroundColorByHexString('#03b6b3');
      this.afireAuth.authState.subscribe((user)=>{
        if(user){

          this.authService.isAuthenticated=true;
          this.authService.user=user;
          if(user.email===CONFIG.app.adminEmailId)
            this.authService.isAdmin=true;
          else
            this.authService.isAdmin=false;

          this.events.publish('user-loggedIn');
          console.log('user is logged in with ', this.authService.user.email)
          console.log('is admin? ',this.authService.isAdmin);
        }
        else{
          this.authService.isAuthenticated=false;
          this.authService.user=null;
          this.authService.isAdmin=null;

          this.events.publish('user-loggedOut');
          console.log('user is logged out', this.authService.user,this.authService.isAuthenticated);

        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
