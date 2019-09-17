import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {

  welcome : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if( navParams.get('welcome'))
      this.welcome = navParams.get('welcome');
  }

}
