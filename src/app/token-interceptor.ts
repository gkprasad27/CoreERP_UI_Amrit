import { Injectable, Injector,  } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
 

    constructor(private router: Router ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!isNullOrUndefined(localStorage.getItem('Token'))) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('Token'))
                }
            });
        }
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }

          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                     // redirect to the login route
                    this.authLogout();
              }
            }
          });
    }
    authLogout(){
        this.router.navigateByUrl('/login');
    }
}
