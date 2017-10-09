import { Injectable } from '@angular/core';
import {Alert, AlertController} from "ionic-angular/index";


@Injectable()
export class AlertServiceProvider {

  alert:Alert;
  constructor(public alertCtrl: AlertController) {
    console.log('Hello AlertServiceProvider Provider');
  }


  present(title:string,subTitle:string){
    this.alert=this.alertCtrl.create({
      title:title,
      subTitle:subTitle,
      buttons: ['Dismiss']
    });

    this.alert.present();
  }


  dismiss(){
    this.alert.dismiss();
  }

}
