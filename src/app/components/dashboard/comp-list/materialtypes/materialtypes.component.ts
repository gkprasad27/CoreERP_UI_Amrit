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

interface Class {
  value: string;
  viewValue: string;
}

interface Usage {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-materialtypes',
  templateUrl: './materialtypes.component.html',
  styleUrls: ['./materialtypes.component.scss']
})

export class MaterialTypesComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glList: any;
  class: Class[] =
    [
      { value: 'Raw Material', viewValue: 'Raw Material' },
      { value: 'Semi-Finished', viewValue: 'Semi-Finished' },
      { value: 'Parts and components', viewValue: 'Parts and components' },
      { value: 'Finished', viewValue: 'Finished' },
      { value: 'Maintenance', viewValue: 'Maintenance' },
      { value: 'Packing', viewValue: 'Packing' },
      { value: 'Service', viewValue: 'Service' },
      { value: 'Trading', viewValue: 'Trading' },
      { value: 'Capital', viewValue: 'Capital' },
      { value: 'Repairs and operations', viewValue: 'Repairs and operations' }

    ];

  usage: Usage[] =
    [
      { value: 'Production operations-Direct', viewValue: 'Production operations-Direct' },
      { value: 'Production operation-Indirect', viewValue: 'Production operation-Indirect' },
      { value: 'Capital', viewValue: 'Capital' },
      { value: 'Consumable stores', viewValue: 'Consumable stores' },
      { value: 'Operations maintenance', viewValue: 'Operations maintenance' },
      { value: 'Packing', viewValue: 'Packing' }

    ];

    magroupList: any[] = [];

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MaterialTypesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      class: [null],
      usage: [null],
      materialGroup: [null]
      
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
    this.getMaterialGroupTableData();
  }

  getMaterialGroupTableData() {
    const getMaterialGroupUrl = String.Join('/', this.apiConfigService.getmaterialgroupList);
    this.apiService.apiGetRequest(getMaterialGroupUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.magroupList = res.response['magroupList'];
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
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['code'].disable();
    }
  }

  

  cancel() {
    this.dialogRef.close();
  }

}
