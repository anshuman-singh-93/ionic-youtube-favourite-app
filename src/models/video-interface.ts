export interface Ivideo{
  id?:string,
  kind?:string,
  contentDetails:{videoId:string},
  snippet:{
    channelId:string,
    channelTitle:string,
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
    },
    resourceId:{videoId:string}
  }
}
