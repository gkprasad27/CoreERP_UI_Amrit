import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild,
  CanLoad, Route, UrlSegment, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from './services/api-config.service';
import { AddOrEditService } from './components/dashboard/comp-list/add-or-edit.service';
import { ApiService } from './services/api.service';
import { CommonService } from './services/common.service';
import { StatusCodes } from './enums/common/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, Resolve<any> {
  options;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private apiConfigService: ApiConfigService,
    private addOrEditService: AddOrEditService,
    private commomService: CommonService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) {
    this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let obj = JSON.parse(localStorage.getItem("user"));
    if (next.url.length > 1) {
      const getMenuUrl = String.Join('/', this.apiConfigService.getUserPermissions, obj.role, next.url[1].path);
      return this.http.get(getMenuUrl, this.options)
        .pipe((map(resp => {
          const res = resp;
          this.commomService.userPermission = res['response']['Permissions'];
          if (!this.commomService.checkNullOrUndefined(res) && res['status'] === StatusCodes.pass) {
            if (this.authService.isLoggedIn()) {
              if (state.url.includes('Edit') || state.url.includes('Add') || state.url.includes('New')) {
                if (!this.addOrEditService.editData && next.url.length > 1) {
                  if(next.url[2].parameters.value.includes('purchaseOrderNo_')) {
                    return true;
                  }
                  const route = String.Join('/', 'dashboard', next.url[0].path, next.url[1].path);
                  this.router.navigate([route]);
                }
              }
              return true;
            }
          } else if (!this.commomService.checkNullOrUndefined(res) && res['status'] === StatusCodes.fail) {
            this.router.navigate(['/login']);
            return false;
          }
        })));
    }
    return false;
  }

  resolve(route: ActivatedRouteSnapshot) {
    let obj = JSON.parse(localStorage.getItem("user"));
    const configUrl = String.Join('/', this.apiConfigService.getFieldsConfig, obj.role, route.url[1].path);

    return true
    this.http.get(configUrl, this.options)
      .pipe((map(res => console.log(res['response']['FieldsConfiguration']))));

  }

}
