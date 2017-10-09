import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChannelsAddPage } from './channels-add';

@NgModule({
  declarations: [
    ChannelsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ChannelsAddPage),
  ],
})
export class ChannelsAddPageModule {}
