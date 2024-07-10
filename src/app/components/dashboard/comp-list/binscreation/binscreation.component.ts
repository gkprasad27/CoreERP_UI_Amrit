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
  selector: 'app-binscreation',
  templateUrl: './binscreation.component.html',
  styleUrls: ['./binscreation.component.scss']
})

export class BinsCreationComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  plantsList: any;
  UomList: any;
  porderList: any;
  lotList: any;
  mseriesnoList: any;
  stlocList: any;
  mmasterList: any;
  emplist: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BinsCreationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      binNumber: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      plant: [null],
      storageLocation: [null],
      material: [null],
      minLevel: [null],
      maxLevel: [null],
      reOrderLevel: [null],
      openQty: [null],
      uom: [null],
      storeIncharge: [null]

    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['binNumber'].disable();
    }

  }

  ngOnInit() {
    this.getMaterielData();
    this.getstorageLocationData();
    this.getPlantData();
    this.getuomTypeData();
    this.getEmployeetData();
  }
  getMaterielData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getMaterielUrl = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
    this.apiService.apiGetRequest(getMaterielUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mmasterList = res.response['mmasterList'];
            }
          }
          this.spinner.hide();
        });
  }

  getstorageLocationData() {
    const getstorageUrl = String.Join('/', this.apiConfigService.getStList);
    this.apiService.apiGetRequest(getstorageUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stlocList = res.response['stlocList'];
            }
          }
          this.spinner.hide();
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
          this.spinner.hide();
        });
  }
  getEmployeetData() {
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

  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
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
    this.modelFormData.controls['binNumber'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['binNumber'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
