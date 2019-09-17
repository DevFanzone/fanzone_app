import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../utils/setting';
import { CommonProvider } from '../common';
import { map, timeout, catchError } from 'rxjs/operators';


@Injectable()
export class AuthProvider {

  private HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    public http: HttpClient,
    private common: CommonProvider,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private events: Events
    ) {}

    public getVersion(atletaId: number, platform: string = 'app'): Observable<any> {
      let url = `${AppSettings.API_ENDPOINT}/getVersions?platform=${platform}&atletaId=${atletaId}`;
      return this.http.get(url)
        .pipe(
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
        );
    }

    public getApiUserInfo(email: string): Observable<any> {
      let url = `${AppSettings.API_ENDPOINT}/userInfo/${email}`;
      return this.http.get(url)
        .pipe(
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
        );
    }

  public createAccount(email: string, password: string, firstName: string, plan: number, socialNetwork: string, socialId: string, profile_picture: string, lastName: string = 'N/D', phone: string = 'N/D'): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/createAccount`;
    let payload =JSON.stringify({ 
      email,
      password,
      firstName,
      plan,
      socialNetwork,
      socialId,
      profile_picture,
      lastName,
      phone      
     });
    return this.http.post(url, payload)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  //Login in WS para obtener token y consumir el resto de recursos.
  public login(): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/login`;
    let payload =JSON.stringify({ "username": "ws@ws.com", "password": "admin" })
    return this.http.post(url, payload)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  // LOGIN FACEBOOK  

  public loginFB() {
    return Observable.create(observer => {
      this.fb.login(['public_profile', 'email']).then(function (response) {
        observer.next(response);
        observer.complete();
      });
    }).pipe(
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
    );      
  }

  public getFbLoginStatus() {
    return Observable.create(observer => {
      this.fb.getLoginStatus().then(function (response) {
        observer.next(response);
        observer.complete();
      });
    }).pipe(
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
    ); 
  }

  public getFbProfileInfo(accessToken) {
    return Observable.create(observer => {
      this.fb.api('/me?fields=email,name&access_token=' + accessToken, []).then(function (response) {
        observer.next(response);
        observer.complete();
      });
    }).pipe(
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
    ); 
  }


  //LOCAL STORAGE
  public getApiToken(): string {
    return localStorage.getItem('apiToken');
  }

  public setApiToken(apiToken: string): void {
    localStorage.setItem('apiToken', apiToken);
  }

  public removeApiToken(): void {
    localStorage.removeItem('apiToken');
  }

  public setUserInfo(user: IUser): void {
    localStorage.setItem(this.HAS_LOGGED_IN, 'true');
    localStorage.setItem("user", JSON.stringify(user));    
  }

  public getUserInfo(): IUser {
    let user: IUser = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.getUserInfo()) {
        switch(this.getUserInfo().loginType.toLowerCase()) {
          case 'google':
            this.googlePlus.logout().then((rs) => {
              // do stuff with response if you want
            }, err => {
              reject('It was not possible to log out, please try again later.');              
            });
          break;
          case 'facebook':
            this.fb.logout().then((rs) => {
              // do stuff with response if you want
            }, err => {
              reject('It was not possible to log out, please try again later.');
            });
          break;
          default:
          //Other logout ...
        }
      }
      localStorage.removeItem(this.HAS_LOGGED_IN);
      localStorage.removeItem('user');
      resolve('OK');
    });
  }

  public isLogged(): boolean {
    return (localStorage.getItem(this.HAS_LOGGED_IN) === 'true');
  }

}
