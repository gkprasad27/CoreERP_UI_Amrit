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

interface ProcessType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})

export class ProcessComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  csList: any;
  UomList: any;
  companiesList: any;
  plantList: any;
  costunitList: any;
  matypeList: any;

  processType: ProcessType[] =
    [
      { value: 'Independent', viewValue: 'Independent' },
      { value: 'Dependent', viewValue: 'Dependent' },
      { value: 'Parallel', viewValue: 'Parallel' }
    ];


  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProcessComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      processKey: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      company: [null],
      plant: [null],
      costUnit: [null],
      material: [null],
      nextProcess: [null],
      wipcalculation: [false],
      byProduct: [null],
      jointProduct: [null],
      reWork: [false],
      normalLossIn: [null],
      abnormalLossIn: [null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        wipcalculation: (+this.formData.item.wipcalculation == 0) ? false : true,
        reWork: (+this.formData.item.reWork == 0) ? false : true
      })
      this.modelFormData.controls['processKey'].disable();
    }
    this.modelFormData.controls['material'].disable();

  }

  ngOnInit() {
    this.getcompanyData();
    this.getplantData();
    this.getcostunitsData();
    this.getmaterialData();
  }

  costunitSelect() {
    const object = this.costunitList.find(res => res.id === this.modelFormData.get('costUnit').value)
    this.modelFormData.patchValue({
      material: !this.commonService.checkNullOrUndefined(object) ? object.material : null
    })
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
          this.spinner.hide();
        });
  }

  getcostunitsData() {
    const getsecondelementUrl = String.Join('/', this.apiConfigService.getcostingunitsList);
    this.apiService.apiGetRequest(getsecondelementUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
            }
          }
          this.spinner.hide();
        });
  }

  getmaterialData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getmaterialUrl = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.matypeList = res.response['mmasterList'];
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
      wipcalculation: this.modelFormData.get('wipcalculation').value ? 1 : 0
    })
    this.modelFormData.patchValue({
      reWork: this.modelFormData.get('reWork').value ? 1 : 0
    })
    this.modelFormData.controls['processKey'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['processKey'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
