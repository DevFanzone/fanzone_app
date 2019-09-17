import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPage } from './privacy';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PrivacyPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PrivacyPage),
  ],
})
export class PrivacyPageModule {}
