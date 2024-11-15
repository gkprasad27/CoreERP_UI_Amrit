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
  selector: 'app-attendance-process',
  templateUrl: './attendance-process.component.html',
  styleUrls: ['./attendance-process.component.scss']
})
export class AttendanceProcessComponent {

  modelFormData: FormGroup;
  formData: any;
  constructor(
    private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AttendanceProcessComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      sno: [''],
      id: 0,
      compCode:[''],
      emp_Code: [''],
      employeename: [''],
      month_Days: [''],
      pay_Days: [''],
      oT_Hrs: [''],
      month: [''],
      year: [''],
      lessHrs:[''],
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    // const addCompanyUrl = String.Join('', this.apiConfigService.registerAttendanceProcess);
    // this.apiService.apiPostRequest(addCompanyUrl, this.modelFormData.value)
    //   .subscribe(
    //     response => {
    //       const res = response;
    //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
    //         if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dialogRef.close(this.modelFormData.value);
        //     }
        //   }
        //   this.spinner.hide();
        // });

  }

  cancel() {
    this.dialogRef.close();
  }

}
