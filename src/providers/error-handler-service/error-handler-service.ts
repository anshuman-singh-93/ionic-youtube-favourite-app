import { Injectable } from '@angular/core';
import {ToastServiceProvider} from "../toast-service/toast-service";

@Injectable()
export class ErrorHandlerServiceProvider {

  errors=[];
  constructor(private toastService:ToastServiceProvider) {
    console.log('Hello ErrorHandlerServiceProvider Provider');
  }

  handle(err:any){
    this.errors.push(err);
    console.log(err)
    this.toastService.present(err.message||'Something went wrong.try again')
  }
}
