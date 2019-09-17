import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { timeout, map, catchError, retry } from 'rxjs/operators'


import { CommonProvider } from '../common';
import { AppSettings } from '../../utils/setting';

@Injectable()
export class HomeProvider {

  public posts = [];

  constructor(
    private common: CommonProvider,
    public http: HttpClient,    
  ) {

  }

  public getCollections(atletaId: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/collections?atletaId=${atletaId}`;
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public getLatestPosts(atletaId: number, max: number, offset: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/latestPosts?atletaId=${atletaId}&max=${max}&offset=${offset}`;    
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public getExclusivePosts(atletaId: number, max: number, offset: number, typePost: number = 1): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/getExclusivePost?atletaId=${atletaId}&max=${max}&offset=${offset}&typePost=${typePost}`;
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public getPostsInCollection(collectionId: number, max: number, offset: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/postsInCollection?collectionId=${collectionId}&max=${max}&offset=${offset}`;
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public getPostComments(postId: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/listComments?postId=${postId}`;
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public searchPosts(atletaId: number, keyword: string): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/searchPosts?atletaId=${atletaId}&keyword=${keyword}`;
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public getSponsoredPosts(atletaId: number, max: number, offset: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/postPublicity?atletaId=${atletaId}&max=${max}&offset=${offset}`;    
    return this.http.get(url)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public updateMembership(userName: string, plan: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/upgradeMembership`;
    let payload = JSON.stringify({ userName, plan });
    return this.http.post(url, payload)
      .pipe(
        retry(3),
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
      );
  }

  public postComment(userName: string, postId: number, comment: string): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/postComment`;
    let payload = JSON.stringify({ userName, postId, comment });
    return this.http.post(url, payload)
      .pipe(
        retry(3),
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
      );
  }

  public postLike(userName: string, postId: number): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/postLike`;
    let payload = JSON.stringify({ userName, postId });
    return this.http.post(url, payload)
      .pipe(
        retry(3),
        map(this.common.extractData),
        timeout(AppSettings.TIMEOUT_REQUEST),
        catchError(this.common.handleError)
      );
  }

  /*public isValidTicketCortesia(ticketId: string): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/courtesy/validate/status/order`;
    let data = JSON.stringify({ticketId});
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: headers };

    return this.http.post(url, data, options)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }
  
  public login(credentials: any): Observable<any> {
    let url = `${AppSettings.API_ENDPOINT}/user/login`;
    let data = JSON.stringify(credentials);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: headers };

    return this.http.post(url, data, options)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public recoveryPassword(email: string): Observable<any> {
    let url = AppSettings.API_ENDPOINT + '/user/reset/password';
    let data = JSON.stringify({ email });
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: headers };

    return this.http.post(url, data, options)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }

  public updatePassword(userId: number, password: string): Observable<any> {
    let url = AppSettings.API_ENDPOINT + '/user/update';
    let data = JSON.stringify({ userId, password });
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: headers };

    return this.http.post(url, data, options)
      .pipe(
      map(this.common.extractData),
      timeout(AppSettings.TIMEOUT_REQUEST),
      catchError(this.common.handleError)
      );
  }  */
  /* ---------------------------- */

}