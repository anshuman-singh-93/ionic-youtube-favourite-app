import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {IgenrePost} from "../../models/genre-post-interface";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {IchannelPost} from "../../models/channel-post-interface";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {YoutubeServiceProvider} from "../../providers/youtube-service/youtube-service";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {Iuser} from "../../models/user-interface";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {Ivideo} from "../../models/video-interface";
import {FavouriteServiceProvider} from "../../providers/favourite-service/favourite-service";


@IonicPage()
@Component({
  selector: 'page-channels',
  templateUrl: 'channels.html',
})
export class ChannelsPage {
  isAuthenticated:boolean=null;
  isAdmin:boolean=null;
  user={} as Iuser;
  promiseStatus:string='resolved';

  favouriteChannelsId:Array<string>=[];
  segmentName:string='user';
  genre={} as IgenrePost;
  youtubeChannels:Array<IyoutubeChannel>=[];
  nonOffcialYoutubeChannels:Array<IyoutubeChannel>=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private events:Events,
              private favouriteService:FavouriteServiceProvider,
              private firebaseService:FirebaseServiceProvider,
              private authService:AuthenticationServiceProvider,
              private toastService:ToastServiceProvider,private youtubeService:YoutubeServiceProvider) {
    this.isAuthenticated=this.authService.isAuthenticated;
    this.isAdmin=this.authService.isAdmin;
    this.user=this.authService.user;
  }

  ionViewDidLoad() {
    this.genre=this.navParams.get('genre')||null;
    if(this.isAuthenticated)
    this.getUsercreatedChannelsByGenreId();
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

    this.events.subscribe('user-added-channel',()=>{
      this.getUsercreatedChannelsByGenreId();
    });

    this.events.subscribe('favourite-channel-removed',()=>{
      console.log('favourite-channel-removed event fired')
      this.favouriteService.getMyFavouriteChannel().then((favouriteChannelsId:Array<string>)=>{
        this.favouriteChannelsId=favouriteChannelsId;

      }).catch((err)=>{
        this.favouriteChannelsId=[];
      })
    });

  }

  getOfficialChannelsByGenreId(){
    this.promiseStatus='pending';

    this.firebaseService.getOfficialChannelsByGenreId(this.genre.id).then((channel:Array<string>)=>{
      return this.youtubeService.getChannelInfoByChannelIds(channel);
    }).then((youtubeChannels:Array<IyoutubeChannel>)=>{
      this.youtubeChannels=youtubeChannels;
      console.log(youtubeChannels)
      return this.favouriteService.getMyFavouriteChannel();

    }).then((favChannelsId:Array<string>)=>{
      this.favouriteChannelsId=favChannelsId;
      this.promiseStatus='resolved';

    }).catch((err)=>{
      this.errorHandle(err);
    })
  }

  getUsercreatedChannelsByGenreId(){
    this.promiseStatus='pending';

    this.firebaseService.getUserCreatedChannelsByGenreId(this.genre.id).then((channel:Array<string>)=>{
      return this.youtubeService.getChannelInfoByChannelIds(channel);
    }).then((nonOffcialYoutubeChannels:Array<IyoutubeChannel>)=>{
      this.nonOffcialYoutubeChannels=nonOffcialYoutubeChannels;
      console.log(nonOffcialYoutubeChannels)
      return this.favouriteService.getMyFavouriteChannel();

    }).then((favChannelsId:Array<string>)=>{
      this.favouriteChannelsId=favChannelsId;
      this.promiseStatus='resolved';

    }).catch((err)=>{
      this.errorHandle(err);
    })
  }

  goToVideosPage(youtubeChannel:IyoutubeChannel){
    this.navCtrl.push('VideosPage',{youtubeChannel:youtubeChannel});
  }

  addChannelInFavourite(youtubeChannel:IyoutubeChannel){
    if(!this.isAuthenticated){
      this.toastService.present('You need to login to add to favourite');
      return false;
    }

    this.favouriteService.addChannelToFavourite(youtubeChannel).then(()=>{

      this.toastService.present('Successfully added');
      this.favouriteChannelsId.push(youtubeChannel.id);
      this.events.publish('favourite-channel-added');

    }).catch((err)=>{
      this.errorHandle(err);
    })
  }

  private errorHandle(err:any){
    if(this.promiseStatus==='pending')
      this.promiseStatus='rejected';
    this.toastService.present(err.message||err);

  }

  segmentChanged(){
    if(this.segmentName==='official'){

      this.getOfficialChannelsByGenreId();

    }
    else{
      this.getUsercreatedChannelsByGenreId();
    }
  }

  removeChannel(channel:IyoutubeChannel,index:number,isOffcial:boolean){
    this.firebaseService.removeChannel(this.genre.id ,channel).then(()=>{
      this.toastService.present('Deleted');
      if(isOffcial){
        this.youtubeChannels.splice(index,1)
      }
      else{
        this.nonOffcialYoutubeChannels.splice(index,1);
      }
    }).catch((err)=>{
      this.toastService.present(err.message||err);
    })
  }
  goToAddChannelPage(){
    this.navCtrl.push('ChannelsAddPage',{genre:this.genre});
  }

  goToLoginPage(){
    this.navCtrl.push('SigninPage');

  }

  removeChannelFromFavourite(youtubeChannel:IyoutubeChannel,index:number){
    this.favouriteService.removeChannelFromFavourite(youtubeChannel).then(()=>{
      this.toastService.present('Done!');
      let arrayIndex=this.favouriteChannelsId.indexOf(youtubeChannel.id);
      this.favouriteChannelsId.splice(arrayIndex,1);
      this.events.publish('favourite-channel-removed');

    }).catch((err)=>{
      this.toastService.present(err.message||err);
    })
  }
}
