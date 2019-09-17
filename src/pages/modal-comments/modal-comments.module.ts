import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCommentsPage } from './modal-comments';

@NgModule({
  declarations: [
    ModalCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCommentsPage),
  ],
})
export class ModalCommentsPageModule {}
