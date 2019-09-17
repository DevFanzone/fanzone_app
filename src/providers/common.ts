import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpErrorResponse } from '@angular/common/http';
import { Events } from 'ionic-angular';

@Injectable()
export class CommonProvider {

    constructor(public events: Events) { }

    public extractData(res: Response) {
        return res || {};
    }

    public handleError(error: HttpErrorResponse) {
        let errMsg: string = 'Something bad happened; please try again later.';
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);            
        }
        // return an observable with a user-facing error message
        return Observable.throw(errMsg);
      };

}