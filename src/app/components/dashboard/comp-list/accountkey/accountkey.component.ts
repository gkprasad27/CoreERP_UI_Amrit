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
  selector: 'app-accountkey',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './accountkey.component.html',
  styleUrls: ['./accountkey.component.scss']
})

export class AccountKeyComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  nrrList: any;
  coaList: any;
  companyList: any;
  glList: any;
  gl2List: any;

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AccountKeyComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      acquisitionsGl: [null],
      accumulatedGl: [null],
      depreciationGl: [null],
      salesRevenueGl: [null],
      lossOnSaleGl: [null],
      gainOnSaleGl: [null],
      scrappingGl: [null],
      auggl: [null],
      companyCode: [null],
      chartofAccount: [null],
      description: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.getyNumberrangeData();
    this.getTableData();
    this.getchartofAccountData();
    this.getGLAccountData();
  }

  getGLAccountData() {
    const getGLAccountUrl = String.Join('/', this.apiConfigService.getGLAccountListbyCatetory);
    this.apiService.apiGetRequest(getGLAccountUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'].filter(res => res.controlaccount == 'Asset');
              this.gl2List = res.response['glList'].filter(res => res.accGroup == '0003' || res.accGroup == '003' || res.accGroup == '0004' || res.accGroup == '004' || res.accGroup == '03' || res.accGroup == '04');
            }
          }
          this.spinner.hide();
        });
  }

  getTableData() {
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

  getchartofAccountData() {
    const getchartofAccountUrl = String.Join('/', this.apiConfigService.getChartOfAccountList);
    this.apiService.apiGetRequest(getchartofAccountUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.coaList = res.response['coaList'];
            }
          }
          this.spinner.hide();
        });
  }

  getyNumberrangeData() {
    const getnumrangeUrl = String.Join('/', this.apiConfigService.getNumberRangeList);
    this.apiService.apiGetRequest(getnumrangeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.nrrList = res.response['nrrList'];
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
