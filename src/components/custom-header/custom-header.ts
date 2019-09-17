import { Component, ViewChild } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppSettings } from '../../utils/setting';

@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent {
  @ViewChild('searchBar') search: any;

  private isExclusive: number;
  private isSearchbarOpened: boolean;
  private user: IUser;

  constructor(
    private auth: AuthProvider,
    public navCtrl: NavController,
    private iab: InAppBrowser,
    private events: Events
    ) {
    this.isExclusive = 0;
    this.user = this.auth.getUserInfo();
    this.isSearchbarOpened = false;
  }

  exclusiveContent() {
    this.isExclusive = 1;
    if(this.navCtrl.getActive().id !== 'HomePage') {
      this.navCtrl.setRoot('HomePage', { isExclusive: this.isExclusive })
    }else {
      this.events.publish('home:exclusiveContent',);
    }
  }

  normalContent() {
    this.isExclusive = 0;
    if(this.navCtrl.getActive().id != 'HomePage') {
      this.navCtrl.setRoot('HomePage', { isExclusive: this.isExclusive })
    }else {
      this.events.publish('home:normalContent');
    }
  }

  onSearch(event) {
    this.isSearchbarOpened = false;
    this.navCtrl.setRoot('HomePage', { isExclusive: this.isExclusive, keyword: event.target.value })
  }

  goToProfile() {
    if(this.navCtrl.getActive().id !== 'ProfilePage') {
      this.navCtrl.setRoot("ProfilePage");
    }
  }

  openShopify(): void {
    this.iab.create(AppSettings.URL_SHOPIFY, "_self");
  }

  isSearchbarFocus() {
    this.isSearchbarOpened = true;
    this.search.setFocus();
  }

}
