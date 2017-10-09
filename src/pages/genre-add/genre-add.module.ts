import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenreAddPage } from './genre-add';

@NgModule({
  declarations: [
    GenreAddPage,
  ],
  imports: [
    IonicPageModule.forChild(GenreAddPage),
  ],
})
export class GenreAddPageModule {}
