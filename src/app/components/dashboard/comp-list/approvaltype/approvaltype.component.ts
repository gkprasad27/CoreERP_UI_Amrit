import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AddOrEditService } from '../add-or-edit.service';

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
 

  aptypes: any[] = [];
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
    private addOrEditService: AddOrEditService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      approval: [null],
      immediateReporting: [null],
      reportingTo: [null],
      approvedBy: [null],
      recommendedBy: [null],
      company: [null],
      // department: [null],
      companyName: [null],
      // departmentName: [null],
      approveName: [null]
    });



    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    this.getFormListList();
    this.getCashAccBranchesList();
    this.getCompiniesList();
    this.getEmployeesList();
  }

  getFormListList() {
    const getFormListList = String.Join('/', this.apiConfigService.getFormList);
    this.apiService.apiGetRequest(getFormListList)
      .subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              console.log(response);
              this.aptypes = response.response['ConfigurationList'];
            }
          }
          this.spinner.hide();
        });
  }

  getCashAccBranchesList() {
    const getCashAccBranchesList = String.Join('/', this.apiConfigService.getCashAccBranchesList);
    this.apiService.apiGetRequest(getCashAccBranchesList)
      .subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              console.log(response);
              this.branchesList = response.response['BranchesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getCompiniesList() {
    const getCompiniesListList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getCompiniesListList)
      .subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              console.log(response);
              this.compiniesList = response.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }


  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getUserCreation);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              console.log(response);
              this.employeesList = response.response['userList'];
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
    if (this.modelFormData.invalid) {
      return;
    }

    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}

