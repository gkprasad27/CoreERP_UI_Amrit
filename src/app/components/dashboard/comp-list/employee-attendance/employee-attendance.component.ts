import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent {

  modelFormData: FormGroup;

  tableData: any;

  submitted = false;

  constructor(
    private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeAttendanceComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.modelFormData = this.formBuilder.group({
      employeeCode:[''],
      employeeName: [''],
      attndate:['', Validators.required],
      logintime: ['', Validators.required],
      logouttime: ['', Validators.required],
      duration: [''],
      status:[''],
      lateIn: [''],
      earlyOut: ['']
    });

    if (!this.commonService.checkNullOrUndefined(this.data)) {
      this.modelFormData.patchValue({
        employeeCode: this.data.employeeCode,
        employeeName: this.data.employeename
      });
    }
    
    this.employeeattendance();
  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }

  
  employeeattendance() {
    const employeeattendanceUrl = String.Join('/', this.apiConfigService.employeeattendance, this.data.fromDate, this.data.toDate, this.data.company, this.data.employeeCode);
    this.apiService.apiGetRequest(employeeattendanceUrl)
      .subscribe(
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass && res.response.EMPAttendanceReport && res.response.EMPAttendanceReport.length) {
            const arr = res.response.EMPAttendanceReport.map(element => {
              element.action = 'edit';
              return element;
            });
            this.tableData = arr;
          }
          this.spinner.hide();
        });
  }

  editOrDeleteEvent(value) {
    this.submitted = true
    if (value.action === 'Edit') {
      this.modelFormData.patchValue(value);
    }
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    const addAttendanceUrl = String.Join('/', this.apiConfigService.addAttendance);
    this.apiService.apiPostRequest(addAttendanceUrl, { qsDtl: this.modelFormData.value  })
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dialogRef.close(this.modelFormData.value);
            }
          }
          this.spinner.hide();
        });

  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.modelFormData.patchValue({
      attndate: '',
      logintime:  '',
      logouttime:  '',
      duration: '',
      status:'',
      lateIn: '',
      earlyOut: ''
    });
  }

}
