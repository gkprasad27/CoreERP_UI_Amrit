import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { StatusCodes } from '../enums/common/common';
import { AlertService } from './alert.service';
import { SnackBar } from '../enums/common/common';
import { Static } from '../enums/common/static';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public options;

  constructor(private commonService: CommonService,
    private http: HttpClient,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,

  ) {
    this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }


  // get API requests
  public apiGetRequest(url: any, obj?: any): Observable<any> {
    setTimeout(() => this.spinner.show());
    return this.http.get(url, this.options)
      .pipe((tap<any>(res => {
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.error);
          setTimeout(() => this.spinner.hide());
          return;
        }
        return res;
      })),
        catchError(this.handleError('apiGetRequest')));
  }

  // Post API request
  public apiPostRequest(url: any, obj?: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    if (obj && user) {
      obj.addWho = user.userName;
      obj.editWho = user.userName;
    }
    this.spinner.show();
    return this.http.post(url, obj, this.options)
      .pipe((tap<any>(res => {
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.error);
          this.spinner.hide();
          return;
        }
        return res;
      })),
        catchError(this.handleError('apiPostRequest')));
  }

  // Delete API request
  public apiDeleteRequest(url: any, obj?: any): Observable<any> {
    this.spinner.show();
    return this.http.delete(url, this.options)
      .pipe((tap<any>(res => {
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.error);
          this.spinner.hide();
          return;
        }
        return res;
      })),
        catchError(this.handleError('apiPostRequest')));
  }

  // Update API request
  public apiUpdateRequest(url: any, obj?: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    if (obj && user) {
      obj.addWho = user.userName;
      obj.editWho = user.userName;
    }
    this.spinner.show();
    return this.http.put(url, obj, this.options)
      .pipe((tap<any>(res => {
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.error);
          this.spinner.hide();
          return;
        }
        return res;
      })),
        catchError(this.handleError('apiPostRequest')));
  }

  // API error handling
  private handleError(operation: string) {
    return (err: HttpErrorResponse) => {
      this.spinner.hide();
      const errMsg = `error in ${operation}()  status: ${err.status}, ${err.statusText || ''}, ${err} `;
      if (err instanceof HttpErrorResponse) {
        this.alertService.openSnackBar(`${err.statusText}`, Static.Close, SnackBar.error);
      }
      // tslint:disable-next-line: deprecation
      return of(err);
    };
  }

}
