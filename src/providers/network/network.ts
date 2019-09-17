import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController, Platform } from 'ionic-angular';

@Injectable()
export class NetworkProvider {
  private alert:any;

  constructor(
    private platform: Platform,
    private network: Network,
    private alertController: AlertController
    ) {
  }

  public listenConnection(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        this.showErrorNetwork();
      });

    this.network.onConnect()
      .subscribe(() => {
        this.closeErrorNetwork()
      });
  }

  public showErrorNetwork(): void {
    
    this.alert = this.alertController.create({
      title: ('Connection Failed !'),
      subTitle: ('There may be a problem in your internet connection. Please try again later ! '),
      buttons:   (this.platform.is('ios'))
                  ? []
                  : [{
                        text:  'Okay',
                          handler: () => {
                          this.platform.exitApp();
                        }
                    }]
    })
    this.alert.present();
  }

  public closeErrorNetwork(): void {
    this.alert.dismiss();
  }
}
