import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-assetnumberrange',
  templateUrl: './assetnumberrange.component.html',
  styleUrls: ['./assetnumberrange.component.scss']
})

export class AssetNumberRangeComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any; 

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AssetNumberRangeComponent>,
    private apiService: ApiService,
    private alertService: AlertService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      // description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      fromRange: [null],
      toRange: [null],
      nonNumeric: [null]
      
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {  } 

  validationcode() {
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('fromRange').value) &&
      !this.commonService.checkNullOrUndefined(this.modelFormData.get('toRange').value) && 
      this.modelFormData.get('fromRange').value != ''
      && this.modelFormData.get('toRange').value != '') {
      if (parseInt(this.modelFormData.get('toRange').value) <= parseInt(this.modelFormData.get('fromRange').value)) {
        this.alertService.openSnackBar("Enter correct Value", Static.Close, SnackBar.error);
      }
    }
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
