import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {IgenrePost} from "../../models/genre-post-interface";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {YoutubeServiceProvider} from "../../providers/youtube-service/youtube-service";
import {IyoutubeChannelPlaylist} from "../../models/youtube-channel-playlist-interface";



@IonicPage()
@Component({
  selector: 'page-playlists',
  templateUrl: 'playlists.html',
})
export class PlaylistsPage {
  youtubeChannel={} as IyoutubeChannel;
  youtubePlaylist={items:[]} as IyoutubeChannelPlaylist;
  constructor(public navCtrl: NavController, public navParams: NavParams,private youtubeService:YoutubeServiceProvider) {
  }

  ionViewDidLoad() {
    this.youtubeChannel=this.navParams.get('youtubeChannel')||null;
    this.getPlaylists();
  }


  getPlaylists(){
    this.youtubeService.getPlaylistsByChannelId(this.youtubeChannel).then((playlists:IyoutubeChannelPlaylist)=>{
      console.log(playlists)
      this.youtubePlaylist=playlists;
    }).catch((err)=>{
      console.log(err)
    })
  }
}
