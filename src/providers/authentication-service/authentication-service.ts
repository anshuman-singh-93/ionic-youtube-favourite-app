import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth'
import {ErrorHandlerServiceProvider} from "../error-handler-service/error-handler-service";
import {Iuser} from "../../models/user-interface";
import {Icredential} from "../../models/auth-credentials";
@Injectable()
export class AuthenticationServiceProvider {

  isAuthenticated:boolean=false;
  user:Iuser=null;
  isAdmin:boolean=null;
  constructor(private afireAuth:AngularFireAuth,
              private errorHandlerService:ErrorHandlerServiceProvider
  ) {

  }



  signUp(credential:any){
    return new Promise((resolve,reject)=>{
      this.afireAuth.auth.createUserWithEmailAndPassword(credential.email,credential.password).then((data)=> {
        this.afireAuth.auth.currentUser.updateProfile(credential).then(()=>{
          resolve({ success:true });
        }).catch((err)=>{
          reject(err);
        })

      }).catch((err)=>{
        this.errorHandlerService.handle(err);
        reject(err)
      })
    })

  }

  signIn(credential:Icredential){

    return new Promise((resolve,reject)=>{
      this.afireAuth.auth.signInWithEmailAndPassword(credential.email,credential.password).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        this.errorHandlerService.handle(err);
        reject(err)
      })
    })

  }

  signOut(){
    return this.afireAuth.auth.signOut();
  }

}
