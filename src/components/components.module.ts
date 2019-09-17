import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { CustomHeaderComponent } from './custom-header/custom-header';
@NgModule({
	declarations: [CustomHeaderComponent],
	imports: [IonicModule, CommonModule],
	exports: [CustomHeaderComponent]
})
export class ComponentsModule {}
