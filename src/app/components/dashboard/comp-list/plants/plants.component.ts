import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  employeesList: any;
  stateList: any;
  currencyList: any;
  regionsList: any;
  countrysList: any;
  languageList: any;
  locList: any;

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PlantsComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      plantCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      plantname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      city: [null],
      state: [null],
      region: [null],
      country: [null],
      address1: [null],
      address2: [null],
      pin: [null],
      phone: [null],
      mobile: [null],
      email: [null],
      panno: [null],
      gstno: [null],
      location: [null],
      ext: [null],
      currency: [null],
      language: [null],
      responsiblePerson: [null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['plantCode'].disable();
    }

  }

  ngOnInit() {
    this.getlocationsList();
    this.getstateList();
    this.getLanguageList();
    this.getregionsList();
    this.getcountrysList();
    this.getcurrencyList();
    this.getEmployeesList();
  }

  getlocationsList() {
    const getlocationsList = String.Join('/', this.apiConfigService.getlocationsList);
    this.apiService.apiGetRequest(getlocationsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.locList = res.response['locationList'];
            }
          }
          this.spinner.hide();
        });
  }

  getLanguageList() {
    const getlanguageList = String.Join('/', this.apiConfigService.getlanguageList);
    this.apiService.apiGetRequest(getlanguageList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.languageList = res.response['LanguageList'];
            }
          }
          this.spinner.hide();
        });
  }

  getregionsList() {
    const getRegionsList = String.Join('/', this.apiConfigService.getRegionsList);
    this.apiService.apiGetRequest(getRegionsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.regionsList = res.response['RegionList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcountrysList() {
    const getCountrysList = String.Join('/', this.apiConfigService.getCountrysList);
    this.apiService.apiGetRequest(getCountrysList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.countrysList = res.response['CountryList'];
            }
          }
          this.spinner.hide();
        });
  }

  getstateList() {
    const getstateList = String.Join('/', this.apiConfigService.getstatesList);
    this.apiService.apiGetRequest(getstateList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stateList = res.response['StatesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcurrencyList() {
    const getcurrencyList = String.Join('/', this.apiConfigService.getcurrencyList);
    this.apiService.apiGetRequest(getcurrencyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.currencyList = res.response['CurrencyList'];
            }
          }
          this.spinner.hide();
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
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
    this.modelFormData.controls['plantCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['plantCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}