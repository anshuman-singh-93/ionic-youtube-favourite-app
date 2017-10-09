import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {CONFIG} from '../../app/app.config'
import {AngularFireDatabase} from "angularfire2/database/database";
import {IchannelPost} from "../../models/channel-post-interface";
import {IgenrePost} from "../../models/genre-post-interface";
import * as firebase from 'firebase';
import {Events} from "ionic-angular/index";
import {AngularFireAuth} from "angularfire2/auth/auth";
import {Ivideo} from "../../models/video-interface";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {AuthenticationServiceProvider} from "../authentication-service/authentication-service";
@Injectable()
export class FirebaseServiceProvider {
  youtubeApiKey:string;
  listOfChannels=[];
  listOfGenre=[];
  constructor(public http: Http,public afireAuth:AngularFireAuth,private events:Events,
              private authService:AuthenticationServiceProvider) {
    this.youtubeApiKey=CONFIG.youtube.apiKey;
  }




  createChannel(channel:IyoutubeChannel,genreId:string){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    if(!genreId)
      return Promise.reject({message:'No genre Id found'});

    let userId=this.afireAuth.auth.currentUser.uid;
    let isOfficial=this.authService.isAdmin||false;
    let ref=null;
    let channelToStore:IchannelPost={
      channelId:channel.snippet.channelId,
      name:channel.snippet.channelTitle,
      userId:userId,
      isOfficial:isOfficial
    };
    if(isOfficial)
      ref=firebase.database().ref(`/channel/${genreId}/official/${channel.snippet.channelId}`);
    else
      ref=firebase.database().ref(`/channel/${genreId}/nonOfficial/${userId}/${channel.snippet.channelId}`);

    return new Promise((resolve,reject)=>{

      ref.set(channelToStore).then(()=>{
        if(!isOfficial){
          this.events.publish('user-added-channel');
        }
        resolve({success:true});
      }).catch((err)=>{
        reject(err);
      })

    })
  }

  createGenre(genre:IgenrePost){

    let ref=firebase.database().ref('/genre');

    return new Promise((resolve,reject)=>{
       ref.push(genre).then(()=>{
         this.events.publish('genre-changed');
         resolve({success:true});
       }).catch((err)=>{
        reject(err);
      })

    })

  }

  removeChannel(genreId:string,channel:IyoutubeChannel) {
    console.log(channel)
    if (!this.afireAuth.auth.currentUser)
      return Promise.reject({message: 'You need to login first'});
    if (!channel.snippet.channelId && !channel.id )
      return Promise.reject({message: 'No channel Id found'});
    if(!genreId)
      return Promise.reject({message:'No genre Id found'});

    let userId=this.afireAuth.auth.currentUser.uid;
    let channeId=channel.snippet.channelId||channel.id;
    let isOfficial=this.authService.isAdmin||false;
    let ref=null;
    if(isOfficial)
      ref=firebase.database().ref(`/channel/${genreId}/official/${channeId}`);
    else
      ref=firebase.database().ref(`/channel/${genreId}/nonOfficial/${userId}/${channeId}`);

    return ref.remove();

  }


  getListOfGenre(){
    let ref=firebase.database().ref('/genre');
    return new Promise((resolve,reject)=>{
      ref.once('value').then((snap)=>{
        let channels=snap.val();
        this.listOfGenre=[];
        for(let id in channels){
          let channel=channels[id];
          channel.id=id;
          this.listOfGenre.push(channel);
        }
        resolve(this.listOfGenre);

      }).catch((err)=>{
        reject(err);
      })
    })
  }

  getOfficialChannelsByGenreId(genreId:string){
    if(!genreId)
      return Promise.reject({message:'No genre Id found'});
    let ref=firebase.database().ref(`/channel/${genreId}/official`);

    return new Promise((resolve,reject)=>{


      ref.once('value').then((snap)=>{
        let channels=snap.val();
        let listOfChannels=[];
        for(let id in channels){
          let channel=channels[id];
          listOfChannels.push(channel.channelId);
        }
        resolve(listOfChannels);

      }).catch((err)=>{
        reject(err);
      })
    })

  }


  getUserCreatedChannelsByGenreId(genreId:string){
    if(!genreId)
      return Promise.reject({message:'No genre Id found'});

    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/channel/${genreId}/nonOfficial/${userId}`);

    return new Promise((resolve,reject)=>{

      ref.once('value').then((snap)=>{
        let channels=snap.val();
        let listOfChannels=[];
        for(let id in channels){
          let channel=channels[id];
          channel.id=id;
          listOfChannels.push(channel);
        }
        resolve(listOfChannels);

      }).catch((err)=>{
        reject(err);
      })
    })

  }




  deleteGenre(genre:IgenrePost){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let genreId=genre.id;
    let update={};
    update[`/genre/${genreId}`]=null;
    update[`/channel/${genreId}`]=null;
    let ref=firebase.database().ref();

    return new Promise((resolve,reject)=>{
      ref.update(update).then(()=>{
        resolve({success:true});
      }).catch((err)=>{
        reject(err);
      })

    })
  }
}
