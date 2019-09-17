import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthProvider } from "../../providers/auth/auth";
import { HomeProvider } from '../../providers/home/home';

import "rxjs/add/operator/finally";

@IonicPage()
@Component({
  selector: "page-membership",
  templateUrl: "membership.html"
})
export class MembershipPage {
  private user: IUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private homeProvider: HomeProvider
  ) {    
    this.user = this.authProvider.getUserInfo();
  }

  goToHome() {
    this.navCtrl.setRoot("HomePage");
  }

  paySubscription() {
    this.user.isPremium = true;    
    this.authProvider.setUserInfo(this.user);

    this.homeProvider.updateMembership(this.user.email, 6)
      .finally(() => {
        //Do something here...
      })
      .subscribe(
        res => {
          console.log("update membership success:", res);
        },
        err => {
          console.log("Update membership error:", err);
        }
      );

  }
}
