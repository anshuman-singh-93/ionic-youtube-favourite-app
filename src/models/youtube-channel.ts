
export interface IyoutubeChannel {
  id:string,
  contentDetails: {
    relatedPlaylists: {
      uploads:string ,
      watchHistory:string ,
      watchLater: string
    }
  },
  snippet:{
    title:string,
    channelId?:string,
    channelTitle?:string,
    description:string,
    customUrl:string,
    publishedAt:string,
    thumbnails:{
      default:{
        url:string
      },
      medium:{
        url:string
      },
      high:{
        url:string
      }
    }
  },
  statistics:{
    subscriberCount:number,
    viewCount:number,
    videoCount:number
  }


}
