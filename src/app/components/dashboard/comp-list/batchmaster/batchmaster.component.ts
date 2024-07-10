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
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';


@Component({
  selector: 'app-batchmaster',
  templateUrl: './batchmaster.component.html',
  styleUrls: ['./batchmaster.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class BatchMasterComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  UomList: any;
  companiesList: any;
  plantList: any;
  empList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BatchMasterComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      company: [null],
      plant: [null],
      batchNumber: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      dob: [new Date()],
      year: [null],
      createdBy: [null],
      createdDate: [new Date()],
      description: [null],
      batchSize: [null],
      uom: [null],
      plantStart: [null],
      plantEndDate: [new Date()],
      actualStartDate: [new Date()],
      actualStartTime: [null],
      actualEndDate: [new Date()],
      actualEndTime: [null]

    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        dob: this.formData.item.dob ? new Date(this.formData.item.dob) : '',
        createdDate: this.formData.item.createdDate ? new Date(this.formData.item.createdDate) : '',
        plantEndDate: this.formData.item.plantEndDate ? new Date(this.formData.item.plantEndDate) : '',
        actualStartDate: this.formData.item.actualStartDate ? new Date(this.formData.item.actualStartDate) : '',
        actualEndDate: this.formData.item.actualEndDate ? new Date(this.formData.item.actualEndDate) : '',
      });
      this.modelFormData.controls['batchNumber'].disable();
    }

  }

  ngOnInit() {
    this.getcompanyData();

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
          this.getplantData();
        });
  }
  getplantData() {
    const getplantUrl = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getplantUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantList = res.response['plantsList'];
            }
          }
          this.getemployeeData();
        });
  }
  getemployeeData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getemployeeUrl = String.Join('/', this.apiConfigService.getEmployeeList,obj.companyCode);
    this.apiService.apiGetRequest(getemployeeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.empList = res.response['emplist'];
            }
          }
          this.getuomTypeData();
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
    this.modelFormData.controls['batchNumber'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['batchNumber'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
