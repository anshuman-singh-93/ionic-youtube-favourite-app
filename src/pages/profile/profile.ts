import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {Iuser} from "../../models/user-interface";
import {LoadingSpinnerServiceProvider} from "../../providers/loading-spinner-service/loading-spinner-service";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  isAuthenticated:boolean=null;
  isAdmin:boolean=null;
  defaultURL='http://via.placeholder.com/100x100?text=?';
  user={} as Iuser;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private events:Events,
              private authService:AuthenticationServiceProvider,
              private spinnerService:LoadingSpinnerServiceProvider,private toastService:ToastServiceProvider) {

    this.isAuthenticated=this.authService.isAuthenticated;
    this.isAdmin=this.authService.isAdmin;
    this.user=this.authService.user;

  }

  ionViewDidLoad() {
    this.events.subscribe('user-loggedIn',()=>{
      this.isAuthenticated=this.authService.isAuthenticated;
      this.isAdmin=this.authService.isAdmin;
      this.user=this.authService.user;

    });

    this.events.subscribe('user-loggedOut',()=>{
      this.isAuthenticated=this.authService.isAuthenticated;
      this.isAdmin=this.authService.isAdmin;
      this.user=this.authService.user;
    });

  }

  addGenre(){
    this.navCtrl.push('GenreAddPage')
  }
  goToLoginPage(){
    this.navCtrl.push('SigninPage');
  }
  private signOut(){
    //this.navCtrl.parent.parent.setRoot('SigninPage');
    this.spinnerService.present('Logging you out');
    this.authService.signOut().then(()=>{
      this.spinnerService.dismiss();
    }).catch((err)=>{
      this.spinnerService.dismiss();
      this.toastService.present('We could not log you out.try again');

    })
  }

}
