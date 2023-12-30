import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
;
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-permissionrequest',
  templateUrl: './permissionrequest.component.html',
  styleUrls: ['./permissionrequest.component.scss']
})

export class PermissionRequestComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  permissionDate = new FormControl(new Date());


  EmpName: any;
  advanceList: any;
  //pipe = new DatePipe('en-US');
  //now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<PermissionRequestComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      empCode: [null],
      permissionDate: new FormControl(new Date()),
      status: [null],
      companyCode: [null],
      fromTime: [null],
      toTime: [null],
      reason: [null],
      approvedId: [null],
      approvedName: [null],
      empName: [null],
      reportId: [null],
      reportName: [null],
      recommendedBy: [null],
      rejectedId: [null],
      rejectedName: [null],
      rejectReason: [null],
      purpose: [null],
      department: [null],
      fromdate: [null],
      todate: [null]
    });



    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    //this.getTableData();
    //this.getTableDatas();
    this.modelFormData.patchValue
      ({
        empCode: user.userName
      });
    this.getProductByProductCode(user.userName);
  }


  //getTableDatas() {
  //  const getCompanyUrl = String.Join('/', this.apiConfigService.getAdvancetypeList);
  //  this.apiService.apiGetRequest(getCompanyUrl)
  //    .subscribe(
  //      response => {
  //        const res = response.body;
  //        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //          if (!this.commonService.checkNullOrUndefined(res.response)) {
  //            console.log(res);
  //            this.advanceList = res.response['advancesList'];
  //          }
  //        }
  //        this.spinner.hide();
  //      });
  //}

  getProductByProductCode(value) {

    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getEmpCode);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Empcodes'])) {
                this.getProductByProductCodeArray = res.response['Empcodes'];
                this.spinner.hide();
              }
            }
          }

        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }


  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }
  fromdateValueChange() {
    this.modelFormData.patchValue
      ({
        todate: this.modelFormData.get('fromdate').value
      });
  }
  onSearchChange() {
    let arr = 0;
    let arr1 = 0;
    var ftime = this.modelFormData.get('fromTime').value
    let str = ftime
    arr = str.substring(0, str.length - 3);
    arr1 = ftime.slice(-2);
    let count = 0;
    count = Number.parseInt(arr.toString()) + 1;
    var x = count + ':' + arr1 + '' + '';
    this.modelFormData.patchValue
      ({
        toTime: x
      });
  }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.patchValue({
      todate: this.commonService.formatDate(this.modelFormData.get('todate').value),
      fromdate: this.commonService.formatDate(this.modelFormData.get('fromdate').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

