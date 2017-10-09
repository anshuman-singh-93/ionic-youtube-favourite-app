import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {CONFIG} from '../../app/app.config'
import {IchannelPost} from "../../models/channel-post-interface";
import {IyoutubeChannel} from "../../models/youtube-channel";
import {IyoutubeChannelPlaylist} from "../../models/youtube-channel-playlist-interface";

@Injectable()
export class YoutubeServiceProvider {

  apiKey:string = null;
  constructor(public http:Http) {
    console.log('Hello YoutubeServiceProvider Provider');
    this.apiKey = CONFIG.youtube.apiKey;
  }

  getPlaylistsByChannelId(youtubeChannel:IyoutubeChannel) {

    let url = `https://www.googleapis.com/youtube/v3/playlists?key=${this.apiKey}&part=snippet,contentDetails&channelId=${youtubeChannel.id}`
    return new Promise((resolve, reject)=> {
      this.http.get(url).subscribe((lists)=> {
        resolve(lists.json());
      }, (err)=> {
        reject(err);
      })
    })

  }

  getUploadedVideosByChannelId(youtubeChannel:IyoutubeChannel,nextPageToken:string) {

    return new Promise((resolve, reject)=> {
      if(!youtubeChannel.contentDetails.relatedPlaylists.uploads)
        reject({message:'playlist id could not be found'});
      let url:string='';
      if(nextPageToken)
        url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.apiKey}&pageToken=${nextPageToken}&part=snippet,contentDetails&playlistId=${youtubeChannel.contentDetails.relatedPlaylists.uploads}`;
      else
        url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.apiKey}&part=snippet,contentDetails&playlistId=${youtubeChannel.contentDetails.relatedPlaylists.uploads}`;

      this.http.get(url).subscribe((lists)=> {
        resolve(lists.json());
      }, (err)=> {
        reject(err);
      })
    })

  }


  getChannelInfoByChannelIds(channelsId:Array<string>):Promise<Array<IyoutubeChannel>> {
    let promiseArray = [];
    channelsId.forEach((channelId:string)=> {
      promiseArray.push(this.getChannelInfo(channelId));
    })

    return Promise.all(promiseArray);
  }

  getChannelInfo(channelId:string) {
    let url = `https://www.googleapis.com/youtube/v3/channels?key=${this.apiKey}&part=snippet,contentDetails,statistics&id=${channelId}`
    return new Promise((resolve, reject)=> {
      this.http.get(url).subscribe((lists)=> {
        resolve(lists.json().items[0]);
      }, (err)=> {
        reject(err);
      })
    })


  }


  getVideoByVideoId(videosId:Array<string>){

    let promiseArray = [];
    videosId.forEach((videoId:string)=> {
      promiseArray.push(this.getVideo(videoId));
    });

    return Promise.all(promiseArray);
  }


  getVideo(videoId:string){
    let url = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&part=snippet,contentDetails&id=${videoId}`
    return new Promise((resolve, reject)=> {
      this.http.get(url).subscribe((lists)=> {
        resolve(lists.json().items[0]);
      }, (err)=> {
        reject(err);
      })
    })

  }

searchChannelByQuery(query:string,nextPageToken?:string){
  let url:string='';
  if(nextPageToken)
     url=`https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&part=snippet&q=${query}&type=channel&pageToken=${nextPageToken}`;

  else
     url=`https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&part=snippet&q=${query}&type=channel`;


  return new Promise((resolve, reject)=> {
    this.http.get(url).subscribe((lists)=> {
      resolve(lists.json());
    }, (err)=> {
      reject(err);
    })
  })
}
}
