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

interface ApprovalType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-approvaltype',
  templateUrl: './approvaltype.component.html',
  styleUrls: ['./approvaltype.component.scss']
})

export class ApprovalTypeComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
 

  aptypes: ApprovalType[] =
    [
      { value: 'Vehicle Requisition', viewValue: 'Vehicle Requisition' },
      { value: 'Applyod', viewValue: 'Applyod' }
    ];
  EmpName: any;
  pipe = new DatePipe('en-US');
  now = Date.now();
    branchesList: any;
    compiniesList: any;
    employeesList: any;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ApprovalTypeComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      approvalType1: [null],
      immediateReporting: [null],
      reportingTo: [null],
      approvedBy: [null],
      company: [null],
      department: [null],
      companyName: [null],
      departmentName: [null],
      approveName: [null]
    });



    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    this.getCashAccBranchesList();
    this.getCompiniesList();
    this.getEmployeesList();
  }

  getCashAccBranchesList() {
    const getCashAccBranchesList = String.Join('/', this.apiConfigService.getCashAccBranchesList);
    this.apiService.apiGetRequest(getCashAccBranchesList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.branchesList = res.response['BranchesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getCompiniesList() {
    const getCompiniesListList = String.Join('/', this.apiConfigService.getCompaniesList);
    this.apiService.apiGetRequest(getCompiniesListList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.compiniesList = res.response['CompaniesList'];
            }
          }
          this.spinner.hide();
        });
  }


  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getempList);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.employeesList = res.response['EmployeesList'];
            }
          }
          this.spinner.hide();
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

   
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

