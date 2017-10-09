import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {YoutubeServiceProvider} from "../../providers/youtube-service/youtube-service";
import {Ivideo} from "../../models/video-interface";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {Iuser} from "../../models/user-interface";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {FavouriteServiceProvider} from "../../providers/favourite-service/favourite-service";



@IonicPage()
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {

  isAuthenticated:boolean=null;
  user={} as Iuser
  isAdmin:boolean=null;
  youtubeChannels:Array<IyoutubeChannel>=[];
  youtubeVideos:Array<Ivideo>=[];
  selectedFab='Channels';
  promiseStatus:string='resolved';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private events:Events,
              private favouriteService:FavouriteServiceProvider,
              private firebaseService:FirebaseServiceProvider,
              private youtube:YoutubeVideoPlayer,
              private authService:AuthenticationServiceProvider,
              private toastService:ToastServiceProvider,
              private youtubeService:YoutubeServiceProvider) {
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

    this.events.subscribe('favourite-channel-added', ()=> {
      this.getFavChannel();

    });
    this.events.subscribe('favourite-channel-removed',(id:string)=>{
      this.getFavChannel();

    });

    this.events.subscribe('favourite-video-added', ()=> {
      this.getFavVideo();

    });

    this.events.subscribe('favourite-video-removed',(id:string)=>{
      this.getFavVideo();

    });

    this.getFavChannel();
  }



  private getFavChannel(){

    this.promiseStatus='pending';
    this.favouriteService.getMyFavouriteChannel().then((channels:Array<string>)=>{
    console.log(channels)
    return this.youtubeService.getChannelInfoByChannelIds(channels);
  }).then((youtubeChannels:Array<IyoutubeChannel>)=>{
    this.youtubeChannels=youtubeChannels;
    console.log(youtubeChannels)
    this.promiseStatus='resolved';

  }).catch((err)=>{
    this.errorHandle(err);
  })
}


  private getFavVideo(){
    this.promiseStatus='pending';
    this.favouriteService.getMyFavouriteVideo().then((videos:Array<string>)=>{
      return this.youtubeService.getVideoByVideoId(videos);
    }).then((youtubeVideos:Array<Ivideo>)=>{
      this.youtubeVideos=youtubeVideos;
      console.log(youtubeVideos)
      this.promiseStatus='resolved';

    }).catch((err)=>{
      this.errorHandle(err);
    })
  }



  private showFavChannel(){
    this.selectedFab='Channels'
    this.getFavChannel();
  }
  private showFavPlaylist(){
    this.selectedFab='Playlists'
  }

  private showFavVideo(){
    this.selectedFab='Videos';
    this.getFavVideo();

  }

  private goToVideosPage(youtubeChannel:IyoutubeChannel){
    this.navCtrl.push('VideosPage',{youtubeChannel:youtubeChannel});
  }

  private playVideo(video:Ivideo){
    let videoId=video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id;
    this.youtube.openVideo(videoId);
  }

  private removeChannelFromFavourite(youtubeChannel:IyoutubeChannel,index:number){
   this.favouriteService.removeChannelFromFavourite(youtubeChannel).then(()=>{
     this.toastService.present('Done!');
     this.youtubeChannels.splice(index,1)
     this.promiseStatus='resolved';
     this.events.publish('favourite-channel-removed');


   }).catch((err)=>{
     this.errorHandle(err);

   })
  }

  private removeVideoFromFavourite(video:Ivideo,index:number){
    this.favouriteService.removeVideoFromFavourite(video).then(()=>{
      this.toastService.present('Done!');
      this.youtubeVideos.splice(index,1);
      this.events.publish('favourite-video-removed');
    }).catch((err)=>{
      this.errorHandle(err);
    })
  }


  private errorHandle(err:any){
    if(this.promiseStatus==='pending')
    this.promiseStatus='rejected';
    this.toastService.present(err.message || err);

  }

  private goToLoginPage(){
    this.navCtrl.push('SigninPage');

  }
}
