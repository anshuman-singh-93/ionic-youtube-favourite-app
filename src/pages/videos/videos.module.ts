import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideosPage } from './videos';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    VideosPage,
  ],
  imports: [
    IonicPageModule.forChild(VideosPage),
    ComponentsModule
  ],
})
export class VideosPageModule {}
