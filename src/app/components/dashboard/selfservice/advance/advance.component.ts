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
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})

export class AdvanceComponent implements OnInit {


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
  advanceList: any;
  //pipe = new DatePipe('en-US');
  //now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AdvanceComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      employeeId: [null],
      advanceType: [null],
      advanceAmount: [null],
      applyDate: [null],
      approveDate: [null],
      reason: [null],
      recommendedBy: [null],
      approvedBy: [null],
      status: [null],
      balance: [null],
      deductedAmount: [null]
    });



    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    //this.getTableData();
    this.getTableDatas();
    this.modelFormData.patchValue
      ({
        employeeId: user.userName
      });
    this.getProductByProductCode(user.userName);
  }
  

  getTableDatas() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getAdvancetypeList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.advanceList = res.response['advancesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getProductByProductCode(value) {

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
  

  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    // debugger;
    if (this.modelFormData.invalid) {
      return;
    }
   
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

