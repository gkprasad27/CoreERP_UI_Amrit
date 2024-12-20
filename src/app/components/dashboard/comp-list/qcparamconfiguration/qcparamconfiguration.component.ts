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

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-qcparamconfiguration',
  templateUrl: './qcparamconfiguration.component.html',
  styleUrls: ['./qcparamconfiguration.component.scss']
})
export class QcparamconfigurationComponent {

  modelFormData: FormGroup;
  formData: any;

  Type: Type[] =
    [
      { value: 'Balancing', viewValue: 'Balancing' },
      { value: 'Inspection', viewValue: 'Inspection' },
      { value: 'Instruments', viewValue: 'Instruments' },
    ];
  ProductType: Type[] =
    [
      { value: 'Pulley', viewValue: 'Pulley' },
      { value: 'Taperlock Bush', viewValue: 'Taperlock Bush' },
      { value: 'Adapter', viewValue: 'Adapter' },
      { value: 'Coupling', viewValue: 'Coupling' },
      { value: 'Belts', viewValue: 'Belts' },
      { value: 'Forgings', viewValue: 'Forgings' },
      { value: 'Castings', viewValue: 'Castings' },
      { value: 'Flanges', viewValue: 'Flanges' },
      { value: 'Plates', viewValue: 'Plates' },
    ];
  constructor(public commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<QcparamconfigurationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: [0],
      paramName : [null, Validators.required],
      sortOrder  : [null],
      product : [null],
      type: [null, Validators.required]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['id'].disable();
    }

  }

  ngOnInit() {
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
