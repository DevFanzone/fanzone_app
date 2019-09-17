import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { AuthProvider } from './auth/auth';
import { Events } from "ionic-angular";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthProvider,
    private events: Events
    )
  {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const re = /login/gi;
    const si = /signup/gi;
    // Exclude interceptor for login and sigup request:
    if (req.url.search(re) === -1 && req.url.search(si) === -1) {
      // Get the auth header from your auth service.
      const authToken = `Bearer ${this.auth.getApiToken()}`;
      const headers = new HttpHeaders({
        Authorization: authToken,
        "Content-Type": "application/json"
      });

      const authReq = req.clone({ headers });
      return next.handle(authReq).do(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // redirect to the login route or show a modal
              console.log('Unauthorized... finish session and redirect to login');                
              this.events.publish("auth:unauthorized");
            }
          }
        }
      );
    }
    return next.handle(req);
  }
}
