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

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-secondarycostelement',
  templateUrl: './secondarycostelement.component.html',
  styleUrls: ['./secondarycostelement.component.scss']
})

export class SecondaryCostElementsCreationComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  glList: any;
  porangeList: any;
  porderList: any;
  lotList: any;
  coaList: any;
  matypeList: any;
  UomList: any;

  type: Type[] =
    [
      { value: 'Apportionment', viewValue: 'Apportionment' },
      { value: 'Absorption', viewValue: 'Absorption' },
      { value: 'Activity', viewValue: 'Activity' }
    ];

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SecondaryCostElementsCreationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      secondaryCostCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      company: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      chartofAccount: [null],
      description: [null],
      type: [null],
      recordQty: [false],
      uom: [null]

    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        recordQty: (+this.formData.item.recordQty == 0) ? false : true
      })
      this.modelFormData.controls['secondaryCostCode'].disable();
    }

  }

  ngOnInit() {
    this.getChartofAccountData();
    this.getcompanyData();
    this.getuomTypeData();
  }

  getChartofAccountData() {
    const getchartaccUrl = String.Join('/', this.apiConfigService.getChartOfAccountList);
    this.apiService.apiGetRequest(getchartaccUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.coaList = res.response['coaList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcompanyData() {
    const getompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companiesList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UOMList'];
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
    this.modelFormData.patchValue({
      recordQty: this.modelFormData.get('recordQty').value ? 1 : 0
    })
    this.modelFormData.controls['secondaryCostCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['secondaryCostCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
