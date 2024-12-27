import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';
import { TableComponent } from 'src/app/reuse-components';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent {

  modelFormData: FormGroup;

  tableData: any;

  submitted = false;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

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
      id: 0,
      dateTimeStamp: ['', Validators.required],
      logDatetime: ['', Validators.required],
      highlight: false,
      empCode: '',
      employeeName: ''
      // logouttime: ['', Validators.required],
      // duration: [''],
      // status: [''],
      // lateIn: [''],
      // earlyOut: ['']
    });

    if (!this.commonService.checkNullOrUndefined(this.data)) {
      this.modelFormData.patchValue({
        empCode: this.data.empCode,
        employeeName: this.data.employeeName
      });
    }

    this.employeeattendance();
  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }


  employeeattendance() {
    const employeeattendanceUrl = String.Join('/', this.apiConfigService.eemployeeAttendanceChange, this.data.fromDate, this.data.toDate, this.data.company, this.data.empCode);
    this.apiService.apiGetRequest(employeeattendanceUrl)
      .subscribe(
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass && res.response.EMPAttendanceReport && res.response.EMPAttendanceReport.length) {

            let arr = [];
            res.response.EMPAttendanceReport.map(element => {
              if (element.id) {
                element.id = element.id;
                element.empCode = element.employeeCode;
                element.dateTimeStamp = element.attndate;
                element.deviceAddress = this.data.empCode.charAt(0);
                element.staffId = this.data.empCode;
                element.logDatetime = element.logtime ? `${this.commonService.formatDate1(element.logtime)} ${this.commonService.formatReportTime(element.logtime)}:00` : '';
                element.action = 'edit';
                arr.push(element);
              }
            });
            this.tableData = arr;
          }
          this.spinner.hide();
        });
  }

  editOrDeleteEvent(value) {
    this.submitted = true
    if (value.action === 'Edit') {
      this.modelFormData.patchValue({
        id: value.item.id,
        dateTimeStamp: value.item.dateTimeStamp,
        logDatetime: value.item.logDatetime ? this.commonService.formatReportTime(value.item.logDatetime) : '',
      });
    }
  }

  addTOgrid() {
   
    if (this.modelFormData.invalid) {
      return;
    }
    const arr = [...this.tableData];
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    if (this.modelFormData.value.id) {
      arr.forEach((d: any) => {
        if (d.id == this.modelFormData.value.id) {
          d.highlight = true;
          d.dateTimeStamp = this.modelFormData.value.dateTimeStamp,
            d.logDatetime = `${this.commonService.formatDate1(this.modelFormData.value.dateTimeStamp)} ${this.modelFormData.value.logDatetime}:00`
        }
      })
    } else {
      arr.unshift({
        action: 'edit',
        id: 0,
        empCode: this.modelFormData.value.empCode,
        employeeName: this.modelFormData.value.employeeName,
        highlight: true,
        dateTimeStamp: this.modelFormData.value.dateTimeStamp,
        logDatetime: `${this.commonService.formatDate1(this.modelFormData.value.dateTimeStamp)} ${this.modelFormData.value.logDatetime}:00`
      })
    }
    this.tableData = arr;
    this.cancel();
  }

  save() {
    const arr = this.tableData.filter((t: any) => t.highlight);
    const addAttendanceUrl = String.Join('/', this.apiConfigService.addAttendance);
    this.apiService.apiPostRequest(addAttendanceUrl, { qsDtl: arr })
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
      id: 0,
      dateTimeStamp: '',
      logDatetime: '',
      // logouttime:  '',
      // duration: '',
      // status: '',
      // lateIn: '',
      // earlyOut: ''
    });
  }

}
