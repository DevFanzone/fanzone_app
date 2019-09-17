import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppSettings } from '../../utils/setting';


@IonicPage()
@Component({
  selector: 'page-update-app',
  templateUrl: 'update-app.html',
})
export class UpdateAppPage {

  constructor(
    private platform: Platform,
    private iab: InAppBrowser
    ) {
  }

  goToMarket() {
    let url = this.platform.is('android') ? AppSettings.URL_GOOGLE_PLAY : AppSettings.URL_APP_STORE;
    this.iab.create(url, "_system");
  }

}
