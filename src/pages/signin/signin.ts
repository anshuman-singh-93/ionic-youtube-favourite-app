import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {Icredential} from "../../models/auth-credentials";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {LoadingSpinnerServiceProvider} from "../../providers/loading-spinner-service/loading-spinner-service";
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  credential ={} as Icredential;
  constructor(public navCtrl: NavController,
              private toastService:ToastServiceProvider,
              private loadingSpinnerService:LoadingSpinnerServiceProvider,
              public navParams: NavParams,
              private authService:AuthenticationServiceProvider) {
  }

  ionViewDidLoad() {
  }



  signIn(){
    this.loadingSpinnerService.present('Signing you in!');
    this.authService.signIn(this.credential).then((data)=>{
      this.loadingSpinnerService.dismiss();
      if(this.navCtrl.parent)
        this.navCtrl.parent.parent.setRoot('TabsPage');
      this.navCtrl.setRoot('TabsPage')

    }).catch((err)=>{
      this.loadingSpinnerService.dismiss();
      this.toastService.present(err)
    })
  }

  goToSignUpPage(){
    if(this.navCtrl.parent)
      this.navCtrl.parent.parent.setRoot('SignupPage');
    this.navCtrl.setRoot('SignupPage');
  }


}
