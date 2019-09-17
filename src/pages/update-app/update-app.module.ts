import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateAppPage } from './update-app';

@NgModule({
  declarations: [
    UpdateAppPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateAppPage),
  ],
})
export class UpdateAppPageModule {}
