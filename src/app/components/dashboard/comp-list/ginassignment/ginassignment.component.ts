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
  selector: 'app-ginassignment',
  templateUrl: './ginassignment.component.html',
  styleUrls: ['./ginassignment.component.scss']
})

export class GoodsIssueNoteAssignmentComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  plantsList: any;
  porangeList: any;
  porderList: any;
  lotList: any;
  issuenoList: any;
  matypeList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GoodsIssueNoteAssignmentComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      ginseries: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      company: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      plant: [null],
      id: 0,
      materilaType: [null],
      currentNumber: [null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      // this.modelFormData.controls['id'].disable();
    }

  }

  ngOnInit() {
    this.getGINSeriesData();
    // this.getcompanyData();
    // this.getPlantData();
    // this.getmaterialTypeData();
  }
  getGINSeriesData() {
    const getGINSeriesUrl = String.Join('/', this.apiConfigService.getGINSeriesList);
    this.apiService.apiGetRequest(getGINSeriesUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.issuenoList = res.response['issuenoList'];
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
          this.getmaterialTypeData();
        });
  }

  getmaterialTypeData() {
    const getmaterialTypeUrl = String.Join('/', this.apiConfigService.getMaterialtypeList);
    this.apiService.apiGetRequest(getmaterialTypeUrl)
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
    // this.modelFormData.controls['ginseries'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      // this.modelFormData.controls['ginseries'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
