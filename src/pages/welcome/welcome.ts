import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../../providers/auth/auth';



@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public splashScreen: SplashScreen,
    private authProvider: AuthProvider
    ) {}

  ionViewDidEnter() {
    this.splashScreen.hide();
  }

  goToLogin(plan: number) {
    if(plan == 5) {
      this.authProvider.setUserInfo({
        id: '1',
        image: 'assets/imgs/avatarempty.png',
        displayName: '',
        email: '',
        loginType: 'DB',
        isPremium: false
      });
      this.navCtrl.setRoot('HomePage', { isExclusive: 0 });
    }else {
      this.navCtrl.push('LoginPage', { plan });
    }
  }

  openPrivacyPolicy(){
   this.navCtrl.push('PrivacyPage', {
    welcome: true
   });

  } 

}


