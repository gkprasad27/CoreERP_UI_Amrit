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
  selector: 'app-purchasingperson',
  templateUrl: './purchasingperson.component.html',
  styleUrls: ['./purchasingperson.component.scss']
})

export class PurchasingpersonComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glList: any;
  emplist: any;
  purchaseTypeList: any;
  pcgroupList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PurchasingpersonComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: [null],
      purchasePerson: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      purchaseGroup: [null],
      purchaseTypes: [null]

    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['id'].disable();
    }
  }

  //  this.formData = { ...data };
  //  if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
  //    this.modelFormData.patchValue(this.formData.item);
  //    this.modelFormData.controls['purchasePerson'].disable();
  //  }

  //}

  ngOnInit() {
    this.getEmployeeData();
    this.getPurchaseGroupData();
    this.getPurchaseTypeData();
  }
  getEmployeeData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeUrl = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.emplist = res.response['emplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getPurchaseGroupData() {
    const getPurchaseGroupUrl = String.Join('/', this.apiConfigService.getPurchaseGroupList);
    this.apiService.apiGetRequest(getPurchaseGroupUrl)
      .subscribe(
        response => {
          const res = response
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.pcgroupList = res.response['PCGroupsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getPurchaseTypeData() {
    const getPurchaseTypeUrl = String.Join('/', this.apiConfigService.getPurchasingtypeList);
    this.apiService.apiGetRequest(getPurchaseTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.purchaseTypeList = res.response['purchaseTypeList'];
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
    this.modelFormData.controls['id'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['id'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
