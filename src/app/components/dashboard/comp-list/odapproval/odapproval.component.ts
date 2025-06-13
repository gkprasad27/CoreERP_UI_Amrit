import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
//import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../services/api.service';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';

@Component({
  selector: 'app-odapproval',
  templateUrl: './odapproval.component.html',
  styleUrls: ['./odapproval.component.scss']

})

export class odApprovalComponent implements OnInit {

  leaveApprovalList: any;

  leaveRequestForm: FormGroup;
  displayedColumns: string[] = ['select', 'empCode', 'empName', 'sno', 'applydate', 'fromDate', 'toDate', 'status', 'approvedId', 'reason'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

    this.leaveRequestForm = this.formBuilder.group({
      accept: [null],
      reject: [null],
      ApprBy:[null],
      chkAcceptReject: [null],
      reason: [null]
    });

  }

  ngOnInit() {
    this.getOdApplDetailsList();
  }

  approveOrReject(event) {
    if (event) {
      this.leaveRequestForm.patchValue({
        ApprBy: "Accept",
        reject: null
      });
    } else {
      this.leaveRequestForm.patchValue({
        ApprBy: null,
        reject: "Reject"
      });
    }
  }

  singleChecked(flag, column, row) {
    let statusFlag = true;
    if (this.leaveApprovalList.length) {
      for (let l = 0; l < this.leaveApprovalList.length; l++) {
        if (this.leaveApprovalList[l]['sno'] == column) {
          statusFlag = false;
          if (!flag) {
            if (this.leaveApprovalList.length == 1) {
              this.leaveApprovalList = [];
            }
            else {
              //delete this.leaveApprovalList[l];
              this.leaveApprovalList.splice(0, l);
            }
          }
          if (flag) {
            this.leaveApprovalList.push(row);
          }
        }
      }
    }
    if (this.leaveApprovalList.length == 0 || statusFlag) {
      this.leaveApprovalList.push(row);
    }
  }

  checkAll(flag, checkAll?) {
    for (let l = 0; l < this.dataSource.data.length; l++) {
      this.dataSource.data[l]['select'] = flag;
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    if (flag && checkAll) {
      this.leaveApprovalList = this.dataSource.data;
    } else {
      this.leaveApprovalList = [];
    }
  }

  getOdApplDetailsList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getOdApplDetailsListUrl = String.Join('/', this.apiConfigService.getOdApplDetailsList, user.userName);
    this.apiService.apiGetRequest(getOdApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dataSource = new MatTableDataSource(res.response['OdApprovalApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }

  save() {
    const user = JSON.parse(localStorage.getItem('user'));
    const registerInvoiceUrl = String.Join('/', this.apiConfigService.RegisterOdApprovalDetails);
    const requestObj = { StockissueHdr: this.leaveRequestForm.value, code: user.userName, StockissueDtl: this.leaveApprovalList };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Od Approval  Successfully..', Static.Close, SnackBar.success);
            //this.branchFormData.reset();
          }
          this.reset();

          this.spinner.hide();

        }
      });
  }



  reset() {
    this.leaveRequestForm.reset();
    this.dataSource = new MatTableDataSource();
    this.ngOnInit();
  }


}
