import {Ivideo} from "./video-interface";
export interface IyoutubeChannelVideo{
  id:string
  items:Array<Ivideo>,
    pageInfo:{
  resultsPerPage:number,
    totalResults:number
},
  nextPageToken:string,
    prevPageToken:string

}
