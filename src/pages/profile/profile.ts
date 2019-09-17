import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { MessageProvider } from '../../providers/message/message';
import { HomeProvider } from '../../providers/home/home';

import "rxjs/add/operator/finally";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private user: IUser;
  private cancelledFlag: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider,
    private homeProvider: HomeProvider,
    private messageProvider: MessageProvider
    ) {
      this.cancelledFlag = false;
      this.user = this.authProvider.getUserInfo();      
  }  

  goToMembership() {
    //this.navCtrl.push('MembershipPage');
    this.navCtrl.setRoot('LoginPage', { plan: 6 });
  }

  pushPage(page: string) {
    this.navCtrl.push(page);
  }  

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  cancelSubscription() {
    this.showPromptAlert('Alert', 'Are you sure to cancel your subscription?', null, () => {
      this.user.isPremium = false;
      this.cancelledFlag = true;
      this.authProvider.setUserInfo(this.user);

      this.homeProvider.updateMembership(this.user.email, 5)
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

    });
  }  

  logOut() {
    this.showPromptAlert('Alert', 'Are you sure to log out?', null, () => {
      this.authProvider.logout().then(() => {
        this.navCtrl.setRoot('WelcomePage');
      }).catch(err => {
        this.messageProvider.showAlertMessage(err);
      });
    });
  }

  private showPromptAlert(title: string, message: string, cancelCallback?: () => any, yesCallback?: () => any) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if(yesCallback) yesCallback();
          }
        },
        {
        role: 'cancel',
        text: 'No',
        handler: () => {
          if(cancelCallback) cancelCallback();
        }
      }]
    });
    alert.present();
  }

}
