import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicTableComponent } from '../../../../reuse-components/dynamic-table/dynamic-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
@Component({
  selector: 'app-costobjectnumberseries',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './costobjectnumberseries.component.html',
  styleUrls: ['./costobjectnumberseries.component.scss']
})

export class CostingObjectNumberSeriesComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CostingObjectNumberSeriesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      numberObject: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      fromInterval: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      toInterval: [null],
      nonNumaric: [null],
      prefix: [null],
      presentNumber: [null]
       
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['numberObject'].disable();
    }

  }

  ngOnInit() {
  }
  // onChangeEvent() {
  //   this.validationcode();
  // }
  // onChangeEvents() {
  //   this.validationcode();
  // }

  // validationcode() {
  //   let i = 0;
  //   let j = 0;
  //   i = parseInt(this.modelFormData.get('fromInterval').value);
  //   j = parseInt(this.modelFormData.get('toInterval').value);
  //   if (i <= j) {
  //   }
  //   else {
  //     this.alertService.openSnackBar("Enter correct Value", Static.Close, SnackBar.error);
  //   }

  // }
  validationcode() {
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('fromInterval').value) &&
      !this.commonService.checkNullOrUndefined(this.modelFormData.get('toInterval').value) && this.modelFormData.get('fromInterval').value != ''
      && this.modelFormData.get('toInterval').value != '') {
      if (parseInt(this.modelFormData.get('toInterval').value) <= parseInt(this.modelFormData.get('fromInterval').value)) {
        this.alertService.openSnackBar("Enter correct Value", Static.Close, SnackBar.error);
      }
    }
  }

  approveOrReject(event) {
    if (event) {
      this.modelFormData.patchValue({
        nonNumaric: "A",
        reject: null
      });
    } else {
      this.modelFormData.patchValue({
        nonNumaric: null,
        reject: "R"
      });
    }
  }
  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['numberObject'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['numberObject'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
