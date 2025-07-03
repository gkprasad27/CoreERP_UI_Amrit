import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface account {
  value: string;
  viewValue: string;
}
interface TaxCategory {
  value: string;
  viewValue: string;
}
interface CostElementCategory {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-glaccount',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule ],
  templateUrl: './glaccount.component.html',
  styleUrls: ['./glaccount.component.scss']
})

export class GLAccountComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  companyList: any;
  currencyList: any;
  glAccgrpList: any;
  coaList: any;
  bankList: any;

  accounts: account[] =
    [
      { value: 'Asset', viewValue: 'Asset' },
      { value: 'Contractor', viewValue: 'Contractor' },
      { value: 'Customer', viewValue: 'Customer' },
      { value: 'Material', viewValue: 'Material' },
      { value: 'ServiceProvider', viewValue: 'ServiceProvider' },
      { value: 'Vendor', viewValue: 'Vendor' }
    ];

  taxCategorys: TaxCategory[] =
    [
      { value: 'Bank', viewValue: 'Bank' },
      { value: 'Cash', viewValue: 'Cash' },
      { value: 'Control Account', viewValue: 'Control Account' },
      { value: 'Fixed Account', viewValue: 'Fixed Account' },
      { value: 'Inventory', viewValue: 'Inventory' },
      { value: 'TDS', viewValue: 'TDS' },
      { value: 'TAX', viewValue: 'TAX' }
    ];

  costElementCategorys: CostElementCategory[] =
    [
      { value: ' Primary cost', viewValue: ' Primary cost' },
      { value: ' Secondary cost', viewValue: 'Secondary cost' },
      { value: 'Revenues', viewValue: 'Revenues' },
      { value: 'Internal settlement', viewValue: 'Internal settlement' },
      { value: 'External settlement', viewValue: 'External settlement' }
    ];

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<GLAccountComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      accountNumber: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      company: [null, Validators.required],
      chartAccount: [null, Validators.required],
      accGroup: [null, Validators.required],
      glaccountName: [null],
      consolidatedAccount: [null],
      currency: [null],
      taxCategory: [null],
      controlAccount: [null],
      clearingAccount: [null],
      noPostingAllowed: [null],
      relevantCashFlow: [null],
      bankKey: [null],
      legacyGl: [null],
      costElementCategory: [null],
      subgroup: [null],
      Undersubaccount: [null],
      groupUnder: [null]
    });
    this.modelFormData.controls.accountNumber.disable();
    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.onCategoryChange(false);
    }
  }

  ngOnInit() {
    this.getcurrencyList();
    this.getTableData();
    this.getchartofAccountData();
    this.getglAccgrpList();
    this.getBankData();
  }

  enableAccount() {
    this.modelFormData.controls.accountNumber.enable();
    this.modelFormData.patchValue({
      accountNumber: ''
    })
  }

  onCategoryChange(flag = true) {
    this.modelFormData.controls['bankKey'].disable();
    this.modelFormData.controls['controlAccount'].disable();
    if (flag) {
      this.modelFormData.patchValue({
        bankKey: null,
        controlAccount: null
      })
    }

    if (this.modelFormData.get('taxCategory').value == 'Bank') {
      this.modelFormData.controls['bankKey'].enable();
    }

    if (this.modelFormData.get('taxCategory').value == 'Control Account') {
      this.modelFormData.controls['controlAccount'].enable();
    }
  }

  onChange(event: any) {
    const obj = this.glAccgrpList.find((gl: any) => gl.groupCode == this.modelFormData.value.accGroup);
    if (obj) {
      if (this.modelFormData.value.accountNumber && (!(+this.modelFormData.value.accountNumber >= obj.numberRangeFrom && +this.modelFormData.value.accountNumber <= obj.numberRangeTo))) {
        this.modelFormData.patchValue({
          accountNumber: ''
        })
        this.alertService.openSnackBar(`Account Number should be from ${obj.numberRangeFrom} to ${obj.numberRangeTo}`, Static.Close, SnackBar.error);
        return;
      }
    }
    const getAccountSubGrouplist = String.Join('/', this.apiConfigService.getaccountNumber,
      this.modelFormData.get('accGroup').value, this.modelFormData.get('accountNumber').value);
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
            }
          }
          this.spinner.hide();
        });
  };

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

  getglAccgrpList() {
    const getglAccgrpList = String.Join('/', this.apiConfigService.getglAccgrpList);
    this.apiService.apiGetRequest(getglAccgrpList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccgrpList = res.response['GLAccGroupList'];
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

  getBankData() {
    const getbankUrl = String.Join('/', this.apiConfigService.getBankMastersList);
    this.apiService.apiGetRequest(getbankUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bankList = res.response['bankList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcurrencyList() {
    const getcurrencyList = String.Join('/', this.apiConfigService.getcurrencyList);
    this.apiService.apiGetRequest(getcurrencyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.currencyList = res.response['CurrencyList'];
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
    this.modelFormData.controls['accountNumber'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['accountNumber'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}