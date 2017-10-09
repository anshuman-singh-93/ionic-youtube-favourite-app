import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Ivideo} from "../../models/video-interface";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {AngularFireAuth} from "angularfire2/auth/auth";
import firebase from 'firebase';
import {Events} from "ionic-angular/index";
import {IchannelPost} from "../../models/channel-post-interface";

@Injectable()
export class FavouriteServiceProvider {


  constructor(public http: Http,
              private events:Events,
              private afireAuth:AngularFireAuth) {



  }

  addChannelToFavourite(youtubeChannel:IyoutubeChannel){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});

    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/favouriteChannel/${userId}/${youtubeChannel.id}`);
    return new Promise((resolve,reject)=>{
      ref.once('value').then((snap)=>{
        if(snap.val()){
          reject({message:'You have already marked as favourite'})
        }
        else{
          ref.set({channelId:youtubeChannel.id}).then(()=>{
            resolve({success:true})
          }).catch((err)=>{
            reject(err);
          })
        }
      }).catch((err)=>{
        reject(err);
      })

    })

  }



  addVideoToFavourite(video:Ivideo){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/favouriteVideo/${userId}/${video.snippet.resourceId.videoId}`);

    return new Promise((resolve,reject)=>{

      ref.once('value').then((snap)=>{
        if(snap.val()){
          reject({message:'You have already marked as favourite'})
        }
        else{
          ref.set({videoId:video.snippet.resourceId.videoId}).then(()=>{
            resolve({success:true})
          }).catch((err)=>{
            reject(err);
          })
        }
      }).catch((err)=>{
        reject(err);

      })


    })

  }

  getMyFavouriteChannel(){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/favouriteChannel/${userId}`);
    return new Promise((resolve,reject)=>{
      ref.once('value').then((snap)=>{
        let favChannels=snap.val();
        let listOfFavChannels=[];
        for(let id in favChannels){
          let channel=favChannels[id];
          listOfFavChannels.push(channel.channelId);
        }

        resolve(listOfFavChannels)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  getMyFavouriteVideo(){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/favouriteVideo/${userId}`);
    return new Promise((resolve,reject)=>{
      ref.once('value').then((snap)=>{
        let favVideos=snap.val();
        let listOfFavVideos=[];
        for(let id in favVideos){
          let video=favVideos[id];
          listOfFavVideos.push(video.videoId);
        }
        resolve(listOfFavVideos)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  removeChannelFromFavourite(youtubeChannel:IyoutubeChannel){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let ref=firebase.database().ref(`/favouriteChannel/${userId}/${youtubeChannel.id}`);

    return new Promise((resolve,reject)=>{
      ref.remove().then(()=>{

        resolve({success:true});
      }).catch((err)=>{
        reject(err);
      })
    })

  }

  removeVideoFromFavourite(video:Ivideo){
    if(!this.afireAuth.auth.currentUser)
      return Promise.reject({message:'You need to login first'});
    let userId=this.afireAuth.auth.currentUser.uid;
    let videoId=null;
    if(video.kind==='youtube#playlistItem')
     videoId=video.snippet.resourceId.videoId;
    if(video.kind==='youtube#video')
      videoId=video.id;
    if(!videoId)
      return Promise.reject({message:'No video ID found'});
    let ref=firebase.database().ref(`/favouriteVideo/${userId}/${videoId}`);
    return new Promise((resolve,reject)=>{
      ref.remove().then(()=>{
        resolve({success:true});
      }).catch((err)=>{
        reject(err);
      })
    })
  }

}
