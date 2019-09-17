import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { GooglePlus } from "@ionic-native/google-plus";
import { Facebook } from "@ionic-native/facebook";
import { AuthProvider } from "../../providers/auth/auth";
import { MessageProvider } from "../../providers/message/message";

import "rxjs/add/operator/finally";
import { AppSettings } from '../../utils/setting';

@IonicPage({
  segment: 'login/:plan'
})
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  private isPremium: boolean;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private messageProvider: MessageProvider,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private events: Events
  ) {
    this.isPremium = (navParams.get('plan') == '5') ? false : true;
    console.log(navParams.get('plan'), this.isPremium);
  }

  goToHome(params?: any): void {    
    this.navCtrl.setRoot("HomePage", params);
  }

  public loginFacebook() {
    this.messageProvider.showLoading();
    this.authProvider.getFbLoginStatus().subscribe(rs => {
        if (rs.status === "connected") {
          let accessToken = rs.authResponse.accessToken;
          this.getProfileInfo(accessToken);
        } else {
          this.loginFB();
        }
      },error => {
        this.messageProvider.loader.dismiss();
        this.messageProvider.showAlertMessage(error);
      }
    );
  }

  public getProfileInfo(accessToken) {
    this.authProvider.getFbProfileInfo(accessToken)
      .finally(() => {
        this.messageProvider.loader.dismiss();
      })
      .subscribe(res => {

        let image = `https://graph.facebook.com/${res.id}/picture?width=1024&height=1024`;
        let loginType = 'facebook';

        this.messageProvider.showLoading();
        this.authProvider.createAccount(res.email, res.id, res.name, this.navParams.get('plan'), loginType, res.id, image)
        .subscribe((rs) => {
          console.log('Create account success:', rs);
          
          this.authProvider.setUserInfo({
            id: res.id,
            image,
            displayName: res.name,
            email: res.email,
            loginType,
            isPremium: this.isPremium
          });
          this.goToHome({ isExclusive: 0 });

        }, err => {
          this.messageProvider.loader.dismiss();
          this.messageProvider.showAlertMessage('Create account error.');
          console.log('Create account error:', err);
        });        
      },
      error => {
        this.messageProvider.loader.dismiss();
        this.messageProvider.showAlertMessage(error);
      }
    );
  }

  public loginFB() {
    this.authProvider.loginFB()
      .finally(() => {
        this.messageProvider.loader.dismiss();
      })
      .subscribe(response => {
          let accessToken = response.authResponse.accessToken;
          this.getProfileInfo(accessToken);
        },error => {
          this.messageProvider.showAlertMessage(error);
        }
      );
  }

  loginGoogle() {
    if(this.platform.is('cordova')) {
      this.googlePlus.login({}).then(res => {
        res.id = res.userId;
        res.loginType = "google";
        res.image = res.imageUrl || 'assets/imgs/avatarempty.png';
        res.isPremium = this.isPremium;
        
        this.authProvider.createAccount(res.email, res.id, res.displayName, this.navParams.get('plan'), 'google', res.id, res.image)
        .subscribe((rs) => {
          console.log('Create account success:', rs);          
          this.authProvider.setUserInfo(res);
          this.goToHome({ isExclusive: 0 });
        }, err => {
          this.messageProvider.loader.dismiss();
          this.messageProvider.showAlertMessage('Create account error.');
          console.log('Create account error:', err);
        });


      }).catch(err => {        
        let msgError: string = "It was not possible to log in, please try again.";
        if (err == 12501) {
          msgError = "Log in cancelled by user";
        }
        this.messageProvider.showAlertMessage(msgError, "Message");
        console.log("google plus error: " + JSON.stringify(err));
      });
    }else {
      
      this.authProvider.createAccount('demo@demo.com', '1', 'demo', this.navParams.get('plan'), 'DB', '1', 'assets/imgs/avatarpanda.jpg')
      .subscribe((rs) => {
        console.log('Create account success:', rs);

        let userInfo = {
          id: '1',
          image: 'assets/imgs/avatarpanda.jpg',
          displayName: 'demo',
          email: 'demo@demo.com',
          loginType: 'DB',
          isPremium: this.isPremium
        };
        this.authProvider.setUserInfo(userInfo);
        this.goToHome({ isExclusive: 0 });        
        
      }, err => {        
        this.messageProvider.loader.dismiss();
        this.messageProvider.showAlertMessage('Create account error.');
        console.log('Create account error:', err);
      });

    }
  }
  
}
