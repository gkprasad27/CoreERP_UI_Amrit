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

interface Usage {
  value: string;
  viewValue: string;
}

interface Element {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-primarycostelement',
  templateUrl: './primarycostelement.component.html',
  styleUrls: ['./primarycostelement.component.scss']
})

export class PrimaryCostElementsCreationComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  glList: any;
  porangeList: any;
  porderList: any;
  lotList: any;
  coaList: any;
  matypeList: any;


  usage: Usage[] =
    [
      { value: 'Material cost', viewValue: 'Material cost' },
      { value: ' Labour cost', viewValue: ' Labour cost' },
      { value: 'Personal cost', viewValue: 'Personal cost' },
      { value: 'Manufacturing cost', viewValue: 'Manufacturing cost' },
      { value: 'Administrative cost', viewValue: 'Administrative cost' },
      { value: 'Distribution cost', viewValue: 'Distribution cost' },
      { value: 'Selling cost', viewValue: 'Selling cost' },
      { value: 'Marketing cost', viewValue: 'Marketing cost' },
      { value: 'Non cost', viewValue: 'Non cost' }
    ];
  element: Element[] =
    [
      { value: 'Direct cost', viewValue: 'Direct cost' },
      { value: 'Indirect cost', viewValue: 'Indirect cost' }
    ];
  UomList: any;
  glAccgrpList: any;
  glAccountList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PrimaryCostElementsCreationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      //primaryCostCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      company: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      chartofAccount: [null],
      generalLedger: [null],
      description: [null],
      usage: [null],
      element: [null],
      qty: [null],
      uom: [null],
      id: ['0']
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['primaryCostCode'].disable();
    }

  }

  ngOnInit() {
    this.getChartofAccountData();
    this.getcompanyData();
    this.getuomTypeData();
  }
  approveOrReject(event) {
    if (event) {
      this.modelFormData.patchValue({
        qty: event,
        //reject: null
      });
    } else {
      this.modelFormData.patchValue({
        // ChkAcceptReject: null,
        qty: event
      });
    }
  }
  getChartofAccountData() {
    const getchartaccUrl = String.Join('/', this.apiConfigService.getChartOfAccountList);
    this.apiService.apiGetRequest(getchartaccUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
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
    this.modelFormData.patchValue({
      qty: this.modelFormData.get('qty').value ? '1' : '0'
    });
    //this.modelFormData.controls['primaryCostCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      //this.modelFormData.controls['primaryCostCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
