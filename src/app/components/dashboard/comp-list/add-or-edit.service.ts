import { Injectable } from '@angular/core';
import { String } from 'typescript-string-operations';
import { RuntimeConfigService } from '../../../services/runtime-config.service';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { StatusCodes, SnackBar } from '../../../enums/common/common';
import { AlertService } from '../../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddOrEditService {

  tableParameters: any;
  editData: any;


  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  Add(result, callBack) {
    const addCompanyUrl = String.Join('', environment.baseUrl, this.tableParameters.registerUrl);
    this.apiService.apiPostRequest(addCompanyUrl, result.item)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
              callBack(res);
            }
          }
          this.spinner.hide();
        });
  }

  Edit(result, callBack) {
    const updateCompanyUrl = String.Join('', environment.baseUrl, this.tableParameters.updateUrl);
    this.apiService.apiUpdateRequest(updateCompanyUrl, result.item)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.alertService.openSnackBar('Record Updated...', 'close', SnackBar.success);
              callBack(res);
            }
          }
        });
  }

}
