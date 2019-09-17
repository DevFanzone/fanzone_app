import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthProvider } from "../../providers/auth/auth";
import { AppSettings } from "../../utils/setting";
import { NetworkProvider } from "../../providers/network/network";
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: "page-splash",
  templateUrl: "splash.html"
})
export class SplashPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private networkProvider: NetworkProvider,
    private network: Network,
  ) {}



  ionViewDidLoad() {

    this.initApp();

    this.network.onDisconnect()
      .subscribe(() => {
        this.networkProvider.showErrorNetwork();
      });

    this.network.onConnect()
      .subscribe(() => {
        this.initApp();
        this.networkProvider.closeErrorNetwork()
      });

  }


  private initApp(){
    this.auth.login().subscribe(
      res => {
        this.auth.setApiToken(res.access_token);

        this.getVersion();
      },
      err => {
        this.networkProvider.showErrorNetwork();
        console.log("Error login:", err);
      }
    );
  }

  private getVersion() {
    this.auth.getVersion(AppSettings.ATLETA_ID).subscribe(
      res => {
        let matchVersion = res.versiones.filter(item => item.version === AppSettings.VERSION).length > 0;
        if (matchVersion) {
          setTimeout(() => {
            let page = this.auth.isLogged() ? "HomePage" : "WelcomePage";
            this.navCtrl.setRoot(page, {}, { animate: true, duration: 500 });
          }, 3500);
        } else {
          this.navCtrl.setRoot("UpdateAppPage",{},{ animate: true, duration: 500 });
        }
      },
      err => console.log(err)
    );
  }
}
