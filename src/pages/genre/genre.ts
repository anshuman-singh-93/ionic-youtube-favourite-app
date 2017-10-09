import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {IgenrePost} from "../../models/genre-post-interface";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";
import {Iuser} from "../../models/user-interface";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {FavouriteServiceProvider} from "../../providers/favourite-service/favourite-service";



@IonicPage()
@Component({
  selector: 'page-genre',
  templateUrl: 'genre.html',
})
export class GenrePage {
  isAuthenticated:boolean=null;
  isAdmin:boolean=null;
  user={} as Iuser;
  listOfGenre=[];
  promiseStatus:string='resolved';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private events:Events,
              private firebaseService:FirebaseServiceProvider,
              private toastService:ToastServiceProvider,
              private authService:AuthenticationServiceProvider) {
    this.isAuthenticated=this.authService.isAuthenticated;
    this.isAdmin=this.authService.isAdmin;
    this.user=this.authService.user;
  }

  ionViewDidLoad() {
    this.events.subscribe('genre-changed',(data)=>{
      this.getListOfGenre();
    });
    this.getListOfGenre();

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


  getListOfGenre(){
    this.promiseStatus='pending';
    this.firebaseService.getListOfGenre().then((genre:any)=>{
      console.log(genre)

      this.listOfGenre=genre;
      this.promiseStatus='resolved';

    }).catch((err)=>{
      this.promiseStatus='rejected';

    })
  }

  goToChannelPage(genre:IgenrePost){
    this.navCtrl.push('ChannelsAddPage',{genre:genre});
  }
  goToPlaylistPage(genre:IgenrePost){
    this.navCtrl.push('ChannelsPage',{genre:genre});

  }

  private deleteGenre(genre:IgenrePost,index:number){
    this.firebaseService.deleteGenre(genre).then(()=>{
      this.toastService.present('Deleted');
      this.listOfGenre.splice(index,1);
    }).catch((err)=>{
      this.toastService.present(err.message|| err);
    })
  }

  goToAddGenrePage(){
    this.navCtrl.push('GenreAddPage');

  }
}
