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
  selector: 'app-lotseriesassignment',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './lotseriesassignment.component.html',
  styleUrls: ['./lotseriesassignment.component.scss']
})

export class StoresAssignmentComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  companiesList: any;
  plantsList: any;
  porangeList: any;
  porderList: any;
  lotList: any;
  matypeList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StoresAssignmentComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      lotSeries: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      company: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      plant: [null],
      materialType: [null],
      currentNumber: [null]

    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['lotSeries'].disable();
    }

  }

  ngOnInit() {
    this.getLotSeriesData();

  }
  getLotSeriesData() {
    const getLotSeriesUrl = String.Join('/', this.apiConfigService.getLotSeriesUrlList);
    this.apiService.apiGetRequest(getLotSeriesUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.lotList = res.response['lotList'];
            }
          }
          this.getcompanyData();
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
          this.getPlantData();
        });
  }

  getPlantData() {
    const getPlantTypeUrl = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getPlantTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantsList = res.response['plantsList'];
            }
          }
          this.getMaterialTypeData();
        });
  }

  getMaterialTypeData() {
    const getMaterialTypeUrl = String.Join('/', this.apiConfigService.getMaterialtypeList);
    this.apiService.apiGetRequest(getMaterialTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.matypeList = res.response['matypeList'];
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
    this.modelFormData.controls['lotSeries'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['lotSeries'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
