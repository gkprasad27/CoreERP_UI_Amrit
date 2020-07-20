import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-vehiclerequisition',
  templateUrl: './vehiclerequisition.component.html',
  styleUrls: ['./vehiclerequisition.component.scss']
})

export class VehicleRequisitionsComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  //LeaveTypeatList: any;
  //companyList: any;
  //brandList: any;
  //MaterialGroupsList: any;
  //SizesList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new FormControl(new Date());

  
  EmpName: any;
  pipe = new DatePipe('en-US');
  now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<VehicleRequisitionsComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      sno: ['0'],
      empCode: [null],
      applDate: [(new Date()).toISOString()],
      fromDate: [null],
      fromTime: [null],
      todate: [null],
      totime: [null],
      place: [null],
      purpose: [null],
      approvedId: [null],
      reportId: [null],
      userId: [null],
      timeStam: [null],
      reportingTime: [null],
      reprtingAddress: [null],
      apprDate: [null],
      recDate: [null],
      accDate: [null],
      contactPersonNo: [null],
      skip: [null],
      reason: [null],
      empName: [null],
      department: [null],
      recommendedby: [null],
      status: [null],
      approveName: [null],
      reportName: [null],
      accptedId: [null],
      approvedby: [null],
      company: [null],
      rejectedName: [null],
      rejectedId: [null],
      companyGroupCode: [null],
      companyGroupName: [null]
    });



    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    //this.getTableData();
    this.modelFormData.patchValue
      ({
        empCode: user.userName
      });
    this.getProductByProductCode(user.userName);
    this.onSearchChange(null);
  }


  //load data
  getLeaveApplDetailsList() {
    // debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    const getLeaveApplDetailsListUrl = String.Join('/', this.apiConfigService.getLeaveRequestList, user.userName);
    this.apiService.apiGetRequest(getLeaveApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.dataSource = new MatTableDataSource(res.response['LeaveApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              //this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }


  ///gettting NoofdaysCount code
  NoofdaysCount() {
    //debugger;
    var date1 = this.pipe.transform(this.modelFormData.get('leaveFrom').value, 'dd-MM-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('leaveTo').value, 'dd-MM-yyyy');

    var session1 = this.modelFormData.get('session1').value
    var session2 = this.modelFormData.get('session2').value

    if (!isNullOrUndefined(date1)) {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getnoofdayscount);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (!isNullOrUndefined(res.response['days'])) {
                this.EmpName = res.response['days']
                this.modelFormData.patchValue
                  ({
                    leaveDays: res.response['days']
                  });
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  //getTableDataonempcodechangevent() {

  //  this.spinner.show();
  //  const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatList, this.modelFormData.get('empCode').value);
  //  this.apiService.apiGetRequest(getCompanyUrl)
  //    .subscribe(
  //      response => {
  //        const res = response.body;
  //        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //          if (!isNullOrUndefined(res.response)) {
  //            console.log(res);
  //            this.LeaveTypeatList = res.response['leavetypesList'];
  //          }
  //        }
  //        this.spinner.hide();
  //      }, error => {

  //      });
  //}

  //getTableData() {
  //  //debugger;
  //  const user = JSON.parse(localStorage.getItem('user'));
  //  let username = user.userName;
  //  this.spinner.show();
  //  const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatList, username);
  //  this.apiService.apiGetRequest(getCompanyUrl)
  //    .subscribe(
  //      response => {
  //        const res = response.body;
  //        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //          if (!isNullOrUndefined(res.response)) {
  //            console.log(res);
  //            //this.LeaveTypeatList = res.response['leavetypesList'];
  //          }
  //        }
  //        this.spinner.hide();
  //      }, error => {

  //      });
  //}


  getProductByProductCode(value) {
    //debugger;

    if (!isNullOrUndefined(value) && value != '') {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getEmpCode);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (!isNullOrUndefined(res.response['Empcodes'])) {
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

  onSearchChange(code) {
    //debugger;
    let genarateVoucherNoUrl;
    if (!isNullOrUndefined(code)) {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getEmpName, code.value);
    } else {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getEmpName, this.modelFormData.get('empCode').value);
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response.body;
        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!isNullOrUndefined(res.response)) {
            if (!isNullOrUndefined(res.response['empname'])) {
              this.EmpName = res.response['empname']
              this.modelFormData.patchValue
                ({
                  empName: res.response['empname']
                });
              this.spinner.hide();
            }
          }
        }
        //this.getTableDataonempcodechangevent();
      });
  }



  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    // debugger;
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.patchValue({
      todate: this.commonService.formatDate(this.modelFormData.get('todate').value),
      fromDate: this.commonService.formatDate(this.modelFormData.get('fromDate').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

