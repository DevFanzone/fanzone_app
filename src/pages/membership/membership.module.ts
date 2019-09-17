import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MembershipPage } from './membership';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MembershipPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MembershipPage),
  ],
})
export class MembershipPageModule {}
