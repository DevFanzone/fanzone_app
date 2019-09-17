
import { Loading, LoadingController, AlertController, Toast, ToastController, ToastOptions } from 'ionic-angular';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { timeout, map, catchError, retry } from 'rxjs/operators'


import { CommonProvider } from '../common';
import { AppSettings } from '../../utils/setting';

@Injectable()
export class MessageProvider {

  public loader: Loading;

  constructor(
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private common: CommonProvider,
    public http: HttpClient,
    ) { }

  public showAlertMessage(text: string, title?: string) {
    let alert = this.alertCtrl.create({
      title: (title) ? title : 'Alert',
      subTitle: text,
      //cssClass: 'custom-alert',
      buttons: ['OK']
    });
    alert.present();
  }

  public showLoading() {
    this.loader = this.loadingCtrl.create();
    this.loader.present();
  }

  public toastAlert(options: ToastOptions): Toast {
    return this.toastCtrl.create(options);
  }

  public supportEmail(subject: string, issue: string): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/supportEmail`;
    let payload = JSON.stringify({ subject, issue });
    return this.http.post(url, payload)
      .pipe(
        retry(3),
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
      );
  }


}
