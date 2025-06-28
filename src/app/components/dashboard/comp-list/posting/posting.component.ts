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
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-posting',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './posting.component.html',
  styleUrls: ['./posting.component.scss']
})

export class PostingComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  compList: any;
  branchList: any;
  plantList: any;
  coaList: any;
  tdsratesList: any;
  glList: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<PostingComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [0],
      // tdstype: [null],
      tdsrate: [null],
      glaccount: [null],
      branch: [null],
      company: [null],
      plant: [null],
      chartofAccount: [null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.getTDSTypeList();
    this.getcompaniesList();
    this.getbranchessList();
    this.getplantsList();
    this.getchartofAccountData();
    this.getGLAccountData();
  }

  getGLAccountData() {
    const getGLAccountUrl = String.Join('/', this.apiConfigService.getGLAccountListbyCatetory, 'TDS');
    this.apiService.apiGetRequest(getGLAccountUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'];
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

  getTDSTypeList() {
    const getTDSList = String.Join('/', this.apiConfigService.getTDSRateList);
    this.apiService.apiGetRequest(getTDSList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tdsratesList = res.response['tdsratesList'];
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