import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
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
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'assignmentofvoucherseriestovouchertype',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './assignmentvoucherseriestovouchertype.component.html',
  styleUrls: ['./assignmentvoucherseriestovouchertype.component.scss']
})

export class AssignmentVoucherSeriestoVoucherTypesComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  vtypeList: any;
  vcList: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<AssignmentVoucherSeriestoVoucherTypesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [0],
      voucherType: [null],
      voucherSeries: [null],
      lastNumber: null,
      id: null,
      suffix: null
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      // this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.getvochertypesList();
  }

  getvochertypesList() {
    const getvouchertypeList = String.Join('/', this.apiConfigService.getVoucherTypesList);
    this.apiService.apiGetRequest(getvouchertypeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.vtypeList = res.response['vouchertypeList'];
            }
          }
          this.getvoucherseriesList();
        });
  }

  getvoucherseriesList() {
    const getvclassList = String.Join('/', this.apiConfigService.getvochersseriesList);
    this.apiService.apiGetRequest(getvclassList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.vcList = res.response['vseriesList'];
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
    // this.modelFormData.controls['code'].enable();
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