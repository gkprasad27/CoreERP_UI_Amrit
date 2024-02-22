import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuntimeSettings } from '../models/common/RuntimeSettings';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigService {
  runtimeConfig: any = null; 
  tableColumnsData: any;

  tableDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


constructor(private injector: Injector, private httpClient: HttpClient) { }

    public loadRuntimeConfig():Promise<any>  {
      return this.httpClient.get(`../../assets/settings/runtime-config.json`)
        .pipe(tap((res) => this.runtimeConfig = res)).toPromise();
    }

    public getTableColumns():Promise<any>  {
      return this.httpClient.get(`../../assets/settings/table-col.json`)
        .pipe(tap((res) => {
          this.tableColumnsData = res;
          this.tableDataLoaded.next(true);
        })).toPromise();
    }

}
