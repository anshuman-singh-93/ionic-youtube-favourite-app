export interface IyoutubeChannelPlaylist{
  id:string
  items:Array<{
    snippet:{
      title:string,
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
    }
  }>

}
