import { Injectable } from '@angular/core';
import {ToastController, Toast} from "ionic-angular/index";

@Injectable()
export class ToastServiceProvider {

  toast:Toast;
  toastIsRunning:boolean=false;
  constructor(private toastCtrl:ToastController) {
  }

  present(msg:any,position:string='top'){
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position:position
    });
    this.toastIsRunning=true;
    this.toast.present();

  }
}
