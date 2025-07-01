import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { AddOrEditService } from '../add-or-edit.service';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-assignmentoftaxaccountstotaxcodes',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './assignmentoftaxaccountstotaxcodes.component.html',
  styleUrls: ['./assignmentoftaxaccountstotaxcodes.component.scss']
})
export class AssignmentoftaxaccountstotaxcodesComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  compList: any;
  branchList: any;
  TaxTypeList: any;
  plantList: any;
  coaList: any;
  glList: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<AssignmentoftaxaccountstotaxcodesComponent>,
    private spinner: NgxSpinnerService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      // description: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sgstgl: [null],
      cgstgl: [null],
      igstgl: [null],
      ugstgl: [null],
      branch: [null],
      company: [null],
      plant: [null],
      compositeAccount: [null],
      chartofAccount: [null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.GetTaxRateList();
    this.getcompaniesList();
    this.getbranchessList();
    this.getplantsList();
    this.getchartofAccountData();
    this.getGLAccountData();
  }

  getGLAccountData() {
    const getGLAccountUrl = String.Join('/', this.apiConfigService.getGLAccountListbyCatetory, 'TAX');
    this.apiService.apiGetRequest(getGLAccountUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'];
              // .filter(res => res.taxCategory == 'TAX')
            }
          }
          this.spinner.hide();
        });
  }

  GetTaxRateList() {
    const gettaxtransactinlist = String.Join('/', this.apiConfigService.gettaxrateList);
    this.apiService.apiGetRequest(gettaxtransactinlist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.TaxTypeList = res.response['TaxratesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcompaniesList() {
    const getcompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getcompanyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.compList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getbranchessList() {
    const getbranchList = String.Join('/', this.apiConfigService.getBranchList);
    this.apiService.apiGetRequest(getbranchList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.branchList = res.response['branchsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getplantsList() {
    const getplantsList = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getplantsList)
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