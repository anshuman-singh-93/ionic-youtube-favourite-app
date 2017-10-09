import { Injectable } from '@angular/core';
import {LoadingController, Loading} from "ionic-angular/index";

@Injectable()
export class LoadingSpinnerServiceProvider {

  loader:Loading;
  loaderIsRunning:boolean=false;
  constructor(public loadingCtrl: LoadingController) {
  }

  present(msg:string){
     this.loader=this.loadingCtrl.create({
      content:msg
     });

    this.loaderIsRunning=true;
    this.loader.present();
  }

  dismiss(){
    if(this.loaderIsRunning)
    this.loader.dismiss();
    this.loaderIsRunning=false;
  }
}
