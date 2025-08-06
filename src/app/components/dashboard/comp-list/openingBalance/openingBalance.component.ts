import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { CommonService } from '../../../../services/common.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'openingBalance',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './openingBalance.component.html',
  styleUrls: ['./openingBalance.component.scss']
})

export class OpeningBalanceComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  voucherClass: any;
  compList: any;
  GetBranchesListArray:[];
  GetPaymentListArray:any;
  GetBankPAccountLedgerListArray:[];

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OpeningBalanceComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      // departmentId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      // departmentName: ['', [Validators.required, Validators.minLength(2)]],
      openingBalanceId:  ['0'],
      branchCode: [null],
      branchName:[null],
      voucherNo:[null],
      paymentTypeId: [null],
      openingBalanceDate: [null],
      narration: [null],
      ledgerCode: [null],
      ledgerName: [null],
      amount:[null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    this.getOpeningBalBranchesList();
    this.getPaymentType();
    this.commonService.setFocus('ledgerName');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!this.commonService.checkNullOrUndefined(user.branchCode)) {
      this.modelFormData.patchValue({
        branchCode: user.branchCode,
        userId: user.seqId,
        userName: user.userName
      });
      this.genarateVoucherNo(user.branchCode);
    }
  }
 
  getOpeningBalBranchesList() {
    const getOpeningBalBranchesListUrl = String.Join('/', this.apiConfigService.getObBranchesList);
   this.apiService.apiGetRequest(getOpeningBalBranchesListUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['BranchesList']) && res.response['BranchesList'].length) {
              this.GetBranchesListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  getPaymentType() {
    const getPaymentTypeListUrl = String.Join('/', this.apiConfigService.getPaymentType);
   this.apiService.apiGetRequest(getPaymentTypeListUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['BranchesList']) && res.response['BranchesList'].length) {
              this.GetPaymentListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  genarateVoucherNo(branch?) {
    let genarateVoucherNoUrl;
    if (!this.commonService.checkNullOrUndefined(branch)) {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getObVoucherNo, branch);
    } else {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getObVoucherNo, this.modelFormData.get('branchCode').value);
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['BranchesList'])) {
              this.modelFormData.patchValue({
                voucherNo: res.response['BranchesList']
              });
              this.spinner.hide();
            }
          }
        }
      });
  }
  getBankPAccountLedgerList(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getBankPAccountLedgerListUrl = String.Join('/', this.apiConfigService.getBPAccountLedgerList, value);
      this.apiService.apiGetRequest(getBankPAccountLedgerListUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['AccountLedgerList']) && res.response['AccountLedgerList'].length) {
                this.GetBankPAccountLedgerListArray = res.response['AccountLedgerList'];
              } else {
                this.GetBankPAccountLedgerListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetBankPAccountLedgerListArray = [];
    }
  }

  // setLedgerName(value) {
  //   const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
  //     if (lCode.id == this.modelFormData.get('ledgerCode').value) {
  //       return lCode;
  //     }
  //   });
  //   this.modelFormData.patchValue({
  //     ledgerName:  !this.commonService.checkNullOrUndefined(lname[0]) ? lname[0].text : null
  //   });
  // }

  // setBranchCode() {
  //   const bname = this.GetBranchesListArray.filter(branchCode => {
  //     if (branchCode.id == this.modelFormData.get('branchCode').value) {
  //       return branchCode;
  //     }
  //   });
  //   if (bname.length) {
  //     this.modelFormData.patchValue({
  //       branchName: !this.commonService.checkNullOrUndefined(bname[0]) ? bname[0].text : null
  //     });
  //   }
  // }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
