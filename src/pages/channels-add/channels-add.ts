import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {IchannelPost} from "../../models/channel-post-interface";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {IgenrePost} from "../../models/genre-post-interface";
import {YoutubeServiceProvider} from "../../providers/youtube-service/youtube-service";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {Iuser} from "../../models/user-interface";
import {IyoutubeChannelVideo} from "../../models/youtube-channel-video-interface";
import {IchannelSearchResult} from "../../models/channel-search-result-interface";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";

@IonicPage()
@Component({
  selector: 'page-channels-add',
  templateUrl: 'channels-add.html',
})
export class ChannelsAddPage {
  isAuthenticated:boolean=null;
  isAdmin:boolean=null;
  user={} as Iuser;
  promiseStatus:string='resolved';

  channel={} as IchannelPost;
  youtubeChannel={items:[],pageInfo:{}} as IchannelSearchResult;

  genre={} as IgenrePost;
  nextPageToken=null;
  prevPageToken='somerandom';
  searchValue:string='';
  resultsPerPage=null;
  totalResults=null;
  constructor(public navCtrl: NavController,private events:Events,
              public navParams: NavParams,private youtubeService:YoutubeServiceProvider,private authService:AuthenticationServiceProvider,
              private firebaseService:FirebaseServiceProvider,private toastService:ToastServiceProvider) {
  }

  ionViewDidLoad() {

    this.genre=this.navParams.get('genre')||null;
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
  }

  onInput(event){
    let val=event.target.value;
    console.log(val)
    this.youtubeService.searchChannelByQuery(val).then((youtubeChannel:IchannelSearchResult)=>{
      this.youtubeChannel=youtubeChannel;
      this.totalResults=youtubeChannel.pageInfo.totalResults;
      this.resultsPerPage=youtubeChannel.pageInfo.resultsPerPage;
      this.nextPageToken=youtubeChannel.nextPageToken;
      console.log(youtubeChannel)
    }).catch((err)=>{
      this.toastService.present(err.message|| err);
    })
  }

  doScroll(infiniteScroll){
    if(this.totalResults>5 && this.nextPageToken && !this.prevPageToken){
      console.log('returned',this.totalResults,this.nextPageToken,this.prevPageToken)
      infiniteScroll.complete();
      return false;
    }

    this.youtubeService.searchChannelByQuery(this.searchValue,this.nextPageToken).then((youtubeChannel:IchannelSearchResult)=>{
      console.log(youtubeChannel)
      youtubeChannel.items.forEach((channel)=>{
        this.youtubeChannel.items.push(channel);
      });
      this.totalResults=youtubeChannel.pageInfo.totalResults;
      this.resultsPerPage=youtubeChannel.pageInfo.resultsPerPage;
      this.nextPageToken=youtubeChannel.nextPageToken;
      this.prevPageToken=youtubeChannel.prevPageToken;
      infiniteScroll.complete();

    }).catch((err)=>{
      console.log(err);
      infiniteScroll.complete();

    })
  }

  addChannelToGenre(channel:IyoutubeChannel){
    this.firebaseService.createChannel(channel,this.genre.id).then(()=>{
      this.toastService.present('Added');
    }).catch((err)=>{
      this.toastService.present(err.message|| err);
    })

  }
}
