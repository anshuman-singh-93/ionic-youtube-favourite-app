import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChannelsPage } from './channels';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ChannelsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChannelsPage),
    ComponentsModule
  ],
})
export class ChannelsPageModule {}
