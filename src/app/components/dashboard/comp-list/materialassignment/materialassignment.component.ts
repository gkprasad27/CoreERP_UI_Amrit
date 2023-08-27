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
  selector: 'app-materialassignment',
  templateUrl: './materialassignment.component.html',
  styleUrls: ['./materialassignment.component.scss']
})

export class MaterialNumberAsssignmentComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  plantsList: any;
  porangeList: any;
  matypeList: any;
  lotList: any;
  mnosList: any;
  id:any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MaterialNumberAsssignmentComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      numberRange: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      companyCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      plant: [null],
      materialType: [null],
      currentNumber: [null],
      id:[null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['numberRange'].disable();
    }

  }

  ngOnInit() {
    this.getmaterialSeriesData();

  }
  getmaterialSeriesData() {
    const getMaterialSeriesUrl = String.Join('/', this.apiConfigService.getMaterialSeriesList);
    this.apiService.apiGetRequest(getMaterialSeriesUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mnosList = res.response['mnosList'];
            }
          }
          this.getcompanyData();
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
          this.getPlantData();
        });
  }

  getPlantData() {
    const getPlantTypeUrl = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getPlantTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantsList = res.response['plantsList'];
            }
          }
          this.getMaterialTypeData();
        });
  }

  getMaterialTypeData() {
    const getMaterialTypeUrl = String.Join('/', this.apiConfigService.getMaterialtypeList);
    this.apiService.apiGetRequest(getMaterialTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.matypeList = res.response['matypeList'];
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
    this.modelFormData.controls['numberRange'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['numberRange'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
