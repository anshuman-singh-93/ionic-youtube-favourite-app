import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {IgenrePost} from "../../models/genre-post-interface";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {ToastServiceProvider} from "../../providers/toast-service/toast-service";



@IonicPage()
@Component({
  selector: 'page-genre-add',
  templateUrl: 'genre-add.html',
})
export class GenreAddPage {
  genre={} as IgenrePost;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseService:FirebaseServiceProvider,
              private toastService:ToastServiceProvider)
  {
  }

  ionViewDidLoad() {
  }
  createGenre(genre:IgenrePost){
    this.firebaseService.createGenre(genre).then(()=>{
      this.toastService.present('Genre added successfully');
      this.genre.name='';
      this.genre.thumbnailURL='';
    }).catch((err)=>{
      this.toastService.present(err);
    })
  }
}
