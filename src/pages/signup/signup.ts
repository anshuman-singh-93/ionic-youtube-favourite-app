import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoadingSpinnerServiceProvider} from "../../providers/loading-spinner-service/loading-spinner-service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {Icredential} from "../../models/auth-credentials";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  credential ={} as Icredential;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService:AuthenticationServiceProvider,
              private loadingSpinnerService:LoadingSpinnerServiceProvider,private toastService:ToastServiceProvider) {
  }

  ionViewDidLoad() {
  }


  signUp(){
    this.loadingSpinnerService.present('Signing you up!');
    this.authService.signUp(this.credential).then((data)=>{
      this.loadingSpinnerService.dismiss();
      if(this.navCtrl.parent)
        this.navCtrl.parent.parent.setRoot('TabsPage');
      this.navCtrl.setRoot('TabsPage')
    }).catch((err)=>{
      this.loadingSpinnerService.dismiss();
      this.toastService.present(err);

    })
  }
  goToSignInPage(){
    if(this.navCtrl.parent)
    this.navCtrl.parent.parent.setRoot('SigninPage');
    this.navCtrl.setRoot('SigninPage');
  }

}
