import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddOrEditService } from '../add-or-edit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { CommonService } from '../../../../services/common.service';

interface ContributionType {
  value: string;
  viewValue: string;
}

interface pfType {
  value: string;
  viewValue: string;
}

interface Limit {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pfmaster',
  templateUrl: './pfmaster.component.html',
  styleUrls: ['./pfmaster.component.scss']
})

export class PFMasterComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  componentList: any;
  companyList: any;

  limit: Limit[] =
    [
      { value: 'Yes', viewValue: 'Yes' },
      { value: 'No', viewValue: 'No' }
    ];

  contributionType: ContributionType[] =
    [
      { value: 'Employee', viewValue: 'Employee' },
      { value: 'Employer', viewValue: 'Employer' },
      { value: 'Both', viewValue: 'Both' }
    ];

    pfType: pfType[] =
    [
      { value: 'CTC', viewValue: 'CTC' },
      { value: 'Basic', viewValue: 'Basic' },
      { value: 'HRA', viewValue: 'HRA' },
      { value: 'Standard', viewValue: 'Standard' }
    ];

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PFMasterComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      pfName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      limit: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      pfType: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      componentName: [null],
      employeeContribution: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      employerContribution: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      companyCode: [null],
      branchCode: [null],
      active: [null],
      id: ['0'],
      contributionType: [null],
      amount:[null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    this.getPfComponentsList();
    this.getCompanyData();
  }

  getCompanyData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getPfComponentsList() {
    const getPfComponentsList = String.Join('/', this.apiConfigService.getPfComponentsList);
    this.apiService.apiGetRequest(getPfComponentsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.componentList = res.response['ComponentTypesList'];
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
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
