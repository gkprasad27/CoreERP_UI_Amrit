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

interface Status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-tdsrates',
  templateUrl: './tdsrates.component.html',
  styleUrls: ['./tdsrates.component.scss']
})

export class TdsRatesComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  tdsList: any;
  incmList: any;

  status: Status[] =
    [
      { value: 'Resident', viewValue: 'Resident' },
      { value: 'Non Resident', viewValue: 'Non Resident' }
    ];
  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<TdsRatesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      desctiption: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tdstype: [null],
      incomeType: [null],
      status: [null],
      effectiveFrom: [null],
      baseAmount: [null],
      tdsRate: [null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        effectiveFrom: this.formData.item.effectiveFrom ? new Date(this.formData.item.effectiveFrom) : ''
      });
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
    this.getTdsTypeList();
    this.getIncomeTypeList();
  }
  getTdsTypeList() {
    const getTDSList = String.Join('/', this.apiConfigService.getTDStypeList);
    this.apiService.apiGetRequest(getTDSList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tdsList = res.response['tdsList'];
            }
          }
          this.spinner.hide();
        });
  }
  getIncomeTypeList() {
    const getIncomeList = String.Join('/', this.apiConfigService.getIncomeTypeList);
    this.apiService.apiGetRequest(getIncomeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.incmList = res.response['incmList'];
            }
          }
          this.spinner.hide();
        });
  }

  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['code'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}