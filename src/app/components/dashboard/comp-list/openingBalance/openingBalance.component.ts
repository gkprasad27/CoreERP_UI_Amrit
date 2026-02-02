import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { CommonService } from '../../../../services/common.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'openingBalance',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, MatRadioModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './openingBalance.component.html',
  styleUrls: ['./openingBalance.component.scss'],
  providers: [DatePipe]
})

export class OpeningBalanceComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  voucherClass: any;
  compList: any;
  GetBranchesListArray:[];

  gLAccountsList: any[] = [];
  getPaymentListArray: any[] = [];
  getBankPAccountLedgerListArray:any[] = [];
  getBusinessPartnersAccList: any[] = [];


  constructor(
    private alertService: AlertService,
    private addOrEditService: AddOrEditService,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OpeningBalanceComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    let obj = JSON.parse(localStorage.getItem("user"));

    this.modelFormData = this.formBuilder.group({
      // departmentId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      // departmentName: ['', [Validators.required, Validators.minLength(2)]],
      openingBalanceId:  [0],
      companyCode: [obj.companyCode],
      voucherNo:[null],
      openingBalanceDate: [null],
      ledgerId: [null],
      ledgerCode: [null],
      ledgerName: [null],
      paymentTypeId: [null],
      openingBalance:[null],
      narration: [null],
      closingBalance:[null],

      itemType:['GLAccounts'],
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    // this.getOpeningBalBranchesList();
    this.allApis();
    this.commonService.setFocus('ledgerName');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!this.commonService.checkNullOrUndefined(user.branchCode)) {
      this.modelFormData.patchValue({
        branchCode: user.branchCode,
        userId: user.seqId,
        userName: user.userName
      });
      this.genarateVoucherNo(user.companyCode);
    }
  }


  allApis() {

    let obj = JSON.parse(localStorage.getItem("user"));
    const getPaymentType = String.Join('/', this.apiConfigService.getPaymentType);
    const getGLAccountsList = String.Join('/', this.apiConfigService.getGLAccountsList);
    const getBusienessPartnersAccList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList, obj.companyCode);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getPaymentType),
        this.apiService.apiGetRequest(getGLAccountsList),
        this.apiService.apiGetRequest(getBusienessPartnersAccList),
      ]).subscribe(([paymentType, gLAccountsList, businessPartnersAccList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(paymentType) && paymentType.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(paymentType.response)) {
            this.getPaymentListArray = paymentType.response['BranchesList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(gLAccountsList) && gLAccountsList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(gLAccountsList.response)) {
            this.gLAccountsList = gLAccountsList.response['glList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(businessPartnersAccList) && businessPartnersAccList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(businessPartnersAccList.response)) {
            const resp = businessPartnersAccList.response['bpaList'];
            this.getBusinessPartnersAccList = resp;
          }
        }

      });
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

  onLedgerChange(code) {
    this.modelFormData.patchValue({
      ledgerCode: code.item.id
    });
  }

  // getOpeningBalBranchesList() {
  //   const getOpeningBalBranchesListUrl = String.Join('/', this.apiConfigService.getObBranchesList);
  //  this.apiService.apiGetRequest(getOpeningBalBranchesListUrl).subscribe(
  //     response => {
  //       const res = response.body;
  //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //         if (!this.commonService.checkNullOrUndefined(res.response)) {
  //           if (!this.commonService.checkNullOrUndefined(res.response['BranchesList']) && res.response['BranchesList'].length) {
  //             this.GetBranchesListArray = res.response['BranchesList'];
  //             this.spinner.hide();
  //           }
  //         }
  //       }
  //     });
  // }


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
    this.formData.item = this.modelFormData.getRawValue();
    this.formData.item.effectiveFrom = this.formData.item.effectiveFrom ? this.datepipe.transform(this.formData.item.effectiveFrom, 'MM-dd-yyyy') : '';

    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
