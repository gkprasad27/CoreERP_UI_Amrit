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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule ],
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
