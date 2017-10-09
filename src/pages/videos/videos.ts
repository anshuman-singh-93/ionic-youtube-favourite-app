import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {IyoutubeChannelVideo} from "../../models/youtube-channel-video-interface";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {YoutubeServiceProvider} from "../../providers/youtube-service/youtube-service";
import {Ivideo} from "../../models/video-interface";
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {Iuser} from "../../models/user-interface";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {FavouriteServiceProvider} from "../../providers/favourite-service/favourite-service";


@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {
  youtubeChannel={} as IyoutubeChannel;
  videos={items:[],pageInfo:{}} as IyoutubeChannelVideo;
  nextPageToken=null;
  prevPageToken='somerandom';
  resultsPerPage=null;
  totalResults=null;
  isAuthenticated:boolean=null;
  isAdmin:boolean=null;
  user={} as Iuser;
  promiseStatus:string='resolved';
  favouriteVideosId:Array<string>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private toastService:ToastServiceProvider,
              private youtube: YoutubeVideoPlayer,
              private favouriteService:FavouriteServiceProvider,
              private events:Events,
              private firebaseService:FirebaseServiceProvider,
              private youtubeSwrvice:YoutubeServiceProvider,
              private authService:AuthenticationServiceProvider) {

    this.isAuthenticated=this.authService.isAuthenticated;
    this.isAdmin=this.authService.isAdmin;
    this.user=this.authService.user;
  }

  ionViewDidLoad() {
    this.youtubeChannel=this.navParams.get('youtubeChannel')||null;
    this.getVideosFromChannel();
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

    this.events.subscribe('favourite-video-removed',()=>{
      this.favouriteService.getMyFavouriteVideo().then((favouriteVideosId:Array<string>)=>{
        this.favouriteVideosId=favouriteVideosId;

      }).catch((err)=>{
        this.favouriteVideosId=[];
      })
    });


  }


  getVideosFromChannel(){
    this.promiseStatus='pending';

    this.youtubeSwrvice.getUploadedVideosByChannelId(this.youtubeChannel,this.nextPageToken).then((videos:IyoutubeChannelVideo)=>{
      console.log(videos)
      this.videos=videos;
      this.totalResults=videos.pageInfo.totalResults;
      this.resultsPerPage=videos.pageInfo.resultsPerPage;
      this.nextPageToken=videos.nextPageToken;
      return this.favouriteService.getMyFavouriteVideo();

    }).then((favouriteVideosId:Array<string>)=> {
      this.favouriteVideosId = favouriteVideosId;
      console.log('my fav videos id')
      console.log(favouriteVideosId)
      this.promiseStatus = 'resolved';
    })
      .catch((err)=>{
      console.log(err);
      this.promiseStatus='rejected';

    })
  }
  doScroll(infiniteScroll){
    if(this.totalResults>5 && this.nextPageToken && !this.prevPageToken){
      console.log('returned',this.totalResults,this.nextPageToken,this.prevPageToken)
      infiniteScroll.complete();
      return false;
    }

    this.youtubeSwrvice.getUploadedVideosByChannelId(this.youtubeChannel,this.nextPageToken).then((videos:IyoutubeChannelVideo)=>{
      console.log(videos)
      videos.items.forEach((video)=>{
        this.videos.items.push(video);
      });
      this.totalResults=videos.pageInfo.totalResults;
      this.resultsPerPage=videos.pageInfo.resultsPerPage;
      this.nextPageToken=videos.nextPageToken;
      this.prevPageToken=videos.prevPageToken;
      infiniteScroll.complete();

    }).catch((err)=>{
      console.log(err);
      infiniteScroll.complete();

    })
  }



  playVideo(video:Ivideo){
    this.youtube.openVideo(video.snippet.resourceId.videoId);
  }
  addVideoInFavourite(video:Ivideo){
    if(!this.isAuthenticated){
      this.toastService.present('You need to login to add to favourite');
      return false;
    }

    this.favouriteService.addVideoToFavourite(video).then(()=>{

      this.toastService.present('Done!');
      this.favouriteVideosId.push(video.contentDetails.videoId);
      this.events.publish('favourite-video-added');

    }).catch((err)=>{
      console.log(err)
      this.toastService.present(err.message||err);
    })

  }

  removeVideoInFavourite(video:Ivideo){
    console.log(video)
    this.favouriteService.removeVideoFromFavourite(video).then(()=>{
      this.toastService.present('Done!');
      let arrayIndex=this.favouriteVideosId.indexOf(video.contentDetails.videoId);
      this.favouriteVideosId.splice(arrayIndex,1);
      this.events.publish('favourite-video-removed');

    }).catch((err)=>{
      this.toastService.present(err.message||err);
    })
  }
}
