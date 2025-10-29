import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS, NonEditableDatepicker } from '../../../../directives/format-datepicker';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableComponent } from '../../../../reuse-components/table/table.component';

@Component({
  selector: 'app-cashbank',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, NonEditableDatepicker, TableComponent, NgMultiSelectDropDownModule, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './cashbank.component.html',
  styleUrls: ['./cashbank.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class CashbankComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  formData: FormGroup;
  formData1: FormGroup;
  
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'glaccountName',
    textField: 'glaccountName',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'glsubName',
    textField: 'glsubName',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  routeEdit = '';

  tableData = [];
  dynTableProps: any;
  sendDynTableData: any;

  indicatorList = [{ id: 'Debit', text: 'Debit' }, { id: 'Credit', text: 'Credit' }];
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  transactionTypeList = ['Cash', 'Bank']
  natureofTransactionList = ['Receipts', 'Payment'];
  accountList = [];
  vouchersTypeList = [];
  accountFilterList = [];
  glAccountList = [];
  subGlAccountList = [];
  profitCenterList = [];
  segmentList = [];
  hsnsacList = [];
  btList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  wbsList: any;
  fcList: any;
  citemList: any;
  ordertypeList: any;


  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public commonService: CommonService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.allApis();
  }

  formDataGroup() {
    let obj = JSON.parse(localStorage.getItem("user"));
    this.formData = this.formBuilder.group({
      company: [obj.companyCode],
      //branch: [null, [Validators.required]],
      voucherType: [null, [Validators.required]],
      voucherNumber: [null, [Validators.required]],
      voucherDate: [new Date()],
      postingDate: [new Date()],
      transactionType: [null, [Validators.required]],
      natureofTransaction: [null, [Validators.required]],
      account: [null],
      referenceNo: [null],
      referenceDate: [null],
      profitCenter: [null],
      segment: [null],
      narration: [null],
      voucherClass: [null],
      period: [null],
      accountingIndicator: [null],
      ext: [null],
      status: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null],
      totalAmount: [0]
    });
    this.formData.controls['voucherNumber'].disable();

    this.formData1 = this.formBuilder.group({
      glaccount: [''],
      subGlaccount: [''],
      accountingIndicator: [''],
      amount: [''],
      taxCode: [''],
      sgstamount: [0],
      cgstamount: [0],
      igstamount: [0],
      narration: [''],
      hsnsaccode: [''],

      id: [0],
      highlight: false,
      action: [[
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]],
      index: 0
    });
  }

  allApis() {
    // const getCompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    const getVoucherTypesList = String.Join('/', this.apiConfigService.getVoucherTypesList);
    const getGLAccountList = String.Join('/', this.apiConfigService.getGLAccountList);
    const getTaxRatesList = String.Join('/', this.apiConfigService.getTaxRatesList);
    const getHsnSacList = String.Join('/', this.apiConfigService.getHsnSacList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        // this.apiService.apiGetRequest(getCompanyList),
        this.apiService.apiGetRequest(getVoucherTypesList),
        this.apiService.apiGetRequest(getGLAccountList),
        this.apiService.apiGetRequest(getTaxRatesList),
        this.apiService.apiGetRequest(getHsnSacList),

      ]).subscribe(([materialRes, glList, taxratesList, hsnsacList]) => {
        this.spinner.hide();

        // if (!this.commonService.checkNullOrUndefined(supplierRes) && supplierRes.status === StatusCodes.pass) {
        //   if (!this.commonService.checkNullOrUndefined(supplierRes.response)) {
        //     this.companyList = supplierRes.response['companiesList']
        //   }
        // }

        if (!this.commonService.checkNullOrUndefined(materialRes) && materialRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(materialRes.response)) {
            this.voucherTypeList = materialRes.response['vouchertypeList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(glList) && glList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(glList.response)) {
            this.glAccountList = glList.response['glList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(taxratesList) && taxratesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(taxratesList.response)) {
            this.taxCodeList = taxratesList.response['TaxratesList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(hsnsacList) && hsnsacList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(hsnsacList.response)) {
            this.hsnsacList = hsnsacList.response['hsnsacList'];
          }
        }

        if (this.routeEdit != '') {
          this.getCashBankDetail(this.routeEdit);
        }

      });
    });
  }


  getCashBankDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getCashBankDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['CashBankMasters']);

              const arr = [...res.response['CashBankDetail']];
              arr.forEach((s: any, index: number) => {
                s.glaccount = s.glaccount ? s.glaccount : '';
                s.subGlaccount = s.subGlaccount ? s.subGlaccount : '';
                s.accountingIndicator = s.accountingIndicator ? s.accountingIndicator : '';
                s.amount = s.amount ? s.amount : 0;
                s.taxCode = s.taxCode ? s.taxCode : '';
                s.sgstamount = s.sgstamount ? s.sgstamount : 0;
                s.cgstamount = s.cgstamount ? s.cgstamount : 0;
                s.igstamount = s.igstamount ? s.igstamount : 0;
                s.narration = s.narration ? s.narration : '';
                s.hsnsaccode = s.hsnsaccode ? s.hsnsaccode : '';

                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ];
                s.id = s.id ? s.id : 0;
                s.index = index + 1;
              })
              this.tableData = arr;

              // this.sendDynTableData = { type: 'edit', data: res.response['CashBankDetail'] };
              this.formData.disable();
            }
          }
        });
  }

  accountSelect() {
    this.accountList = [];
    this.vouchersTypeList = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('transactionType').value)) {
      this.accountList = this.glAccountList.filter(resp => resp.taxCategory == this.formData.get('transactionType').value);
    }
    this.vouchersTypeList = this.voucherTypeList.filter(resp => resp.accountType == this.formData.get('transactionType').value);
  }

  voucherTypeSelect() {
    this.spinner.hide();
    const record = this.voucherTypeList.find(res => res.id == this.formData.get('voucherClass').value)
    this.formData.patchValue({
      voucherClass: !this.commonService.checkNullOrUndefined(record) ? record.voucherClass : null
    })
  }

  voucherNoCalculate() {
    this.voucherTypeSelect();
    this.formData.patchValue({
      voucherNumber: null
    })
    if (!this.commonService.checkNullOrUndefined(this.formData.get('voucherType').value)) {
      const voucherNoUrl = String.Join('/', this.apiConfigService.getVoucherNumber, this.formData.get('voucherType').value);
      this.apiService.apiGetRequest(voucherNoUrl)
        .subscribe(
          response => {
            this.spinner.hide();
            const res = response;
            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                this.formData.patchValue({
                  voucherNumber: !this.commonService.checkNullOrUndefined(res.response['VoucherNumber']) ? res.response['VoucherNumber'] : null
                })
              }
            }
          });
    }
  }

  saveForm() {

    if (this.formData1.invalid) {
      return;
    }

    this.formData1.patchValue({
      highlight: true
    });

    let fObj = this.formData1.value;
    fObj.glaccount = Array.isArray(fObj.glaccount) && fObj.glaccount.length > 0 && fObj.glaccount[0].glaccountName
      ? fObj.glaccount[0].glaccountName
      : fObj.glaccount;
    fObj.subGlaccount = Array.isArray(fObj.subGlaccount) && fObj.subGlaccount.length > 0 && fObj.subGlaccount[0].glsubName
      ? fObj.subGlaccount[0].glsubName
      : fObj.subGlaccount;

    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (fObj.index == 0) {
      fObj.index = data ? (data.length + 1) : 1
      data = [fObj, ...data];
    } else {
      data = data.map((res: any) => res = res.index == fObj.index ? fObj : res);
    }
    setTimeout(() => {
      this.tableData = data;
      // this.checkCreditDebit();
    });
    this.resetForm();
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: [
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ],
      id: 0
    });
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.deleteRecord(value);
    } else {
      this.formData1.patchValue(value.item);
      this.formData1.patchValue({
        glaccount: [{ glaccountName: value.item.glaccount }],
        subGlaccount: [{ glsubName: value.item.subGlaccount }]
      })
    }
  }

  deleteRecord(value) {
    // const obj = {
    //   item: {
    //     materialCode: value.item.materialCode
    //   },
    //   primary: 'materialCode'
    // }
    // this.commonService.deletePopup(obj, (flag: any) => {
    //   if (flag) {
    //     const jvDetUrl = String.Join('/', this.apiConfigService.deletePurchaseOrder, value.item.id);
    //     this.apiService.apiDeleteRequest(jvDetUrl)
    //       .subscribe(
    //         response => {
    //           const res = response;
    //           if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
    //             if (!this.commonService.checkNullOrUndefined(res.response)) {
    this.tableComponent.defaultValues();
    this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    //               this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
    //             }
    //           }
    //           this.spinner.hide();
    //         });
    //   }
    // })
  }

  getgLsubAccountList() {
    const obj = this.glAccountList.find((g: any) => g.glaccountName == this.formData1.value.glaccount[0].glaccountName);
    const voucherNoUrl = String.Join('/', this.apiConfigService.gLsubAccountListbyCatetory, obj.accountNumber);
    this.apiService.apiGetRequest(voucherNoUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.subGlAccountList = res.response['glsubList'];
            }
          }
        });
  }


  taxCodeAmountChange() {
    const code = this.taxCodeList.find(res => res.taxRateCode == this.formData1.value.taxCode);
    if (code) {
      this.formData1.patchValue({
        sgstamount: (this.formData1.value.amount * code.sgst) / 100,
        igstamount: (this.formData1.value.amount * code.igst) / 100,
        cgstamount: (this.formData1.value.amount * code.cgst) / 100
      })
      // this.sendDynTableData = { type: 'add', data: row.data };
      // this.tableData = row.data;
    }
  }

  accountingIndicatorChange() {
    // if (row.data.length > 1) {
    //         row.data.map((res, index) => {
    //           if (index != 0 && !this.commonService.checkNullOrUndefined(row.data[0].accountingIndicator.value)) {
    //             res.accountingIndicator.value = (row.data[0].accountingIndicator.value == 'Debit') ? 'Credit' : 'Debit';
    //             res.accountingIndicator.disabled = true;
    //           } else if (index != 0) {
    //             res.accountingIndicator.disabled = true;
    //           }
    //         })
    //       }
  }

  // checkCreditDebit() {
  //   this.debitValue = 0;
  //   this.creditValue = 0;
  //   this.totalTaxValue = 0;
  //   if (!this.commonService.checkNullOrUndefined(this.tableData)) {
  //     if (this.tableData.length) {
  //       this.tableData.forEach(res => {
  //         if (res.accountingIndicator == 'Debit') {
  //           this.debitValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount)) ? (this.debitValue + parseInt(res.amount)) : 0;
  //         }
  //         if (res.accountingIndicator == 'Credit') {
  //           this.creditValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount)) ? (this.creditValue + parseInt(res.amount)) : 0;
  //         }
  //         // this.totalTaxValue = this.totalTaxValue + res.sgstamount + res.cgstamount + res.ugstamount + res.igstamount
  //         this.totalTaxValue = this.totalTaxValue + res.sgstamount + res.cgstamount + res.igstamount
  //       });
  //       // this.disableSave = (this.debitValue == this.creditValue) ? false : true;
  //     }
  //   }
  //   // this.disableSave = true;
  // }

  back() {
    this.router.navigate(['dashboard/transaction/cashbank']);
  }


  save() {
    const arr = this.tableData.filter((t: any) => t.highlight);
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 || this.formData.invalid || arr.length == 0) {
      return;
    }
    this.formData.controls['voucherNumber'].enable();
    arr.forEach((t: any) => {
      const obj = this.glAccountList.find((g: any) => g.glaccountName == t.glaccount);
      t.glaccount = obj.accountNumber
    })
    const addCashBank = String.Join('/', this.apiConfigService.addCashBank);
    const requestObj = { cashbankHdr: this.formData.value, cashbankDtl: arr };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Cash bank created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
          this.router.navigate(['dashboard/transaction/cashbank']);
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnCashBank, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
        }
      });
  }

  // tablePropsFunc(subGlAccountList = []) {
  //   return {
  //     tableData: {
  //       id: {
  //         value: 0, type: 'autoInc', width: 10, disabled: true
  //       },
  //       // glaccount: {
  //       //   value: null, type: 'multiSelect', list: this.glAccountList, dropdownSettings: {
  //       //     singleSelection: true,
  //       //     idField: 'accountNumber',
  //       //     textField: 'glaccountName',
  //       //     enableCheckAll: false,
  //       //     allowSearchFilter: true
  //       //   }, width: 200
  //       // },
  //       glaccount: {
  //         value: null, type: 'autocomplete', list: this.glAccountList, id: 'glaccountName', displayId: 'accountNumber', displayText: 'glaccountName', multiple: true, width: 200, primary: true
  //       },
  //       subGlaccount: {
  //         value: null, type: 'autocomplete', list: subGlAccountList, id: 'glsubName', displayId: 'glsubCode', displayText: 'glsubName', multiple: true, width: 200, primary: true
  //       },
  //       amount: {
  //         value: null, type: 'number', width: 100, maxLength: 15
  //       },
  //       accountingIndicator: {
  //         value: null, type: 'dropdown', list: this.indicatorList, id: 'id', text: 'text', displayMul: false, width: 100
  //       },
  //       taxCode: {
  //         value: null, type: 'dropdown', list: this.taxCodeList, id: 'taxRateCode', text: 'description', displayMul: false, width: 100
  //       },
  //       // referenceNo: {
  //       //   value: null, type: 'number', width: 100, maxLength: 10
  //       // },
  //       // referenceDate: {
  //       //   value: new Date(), type: 'datepicker', width: 100
  //       // },
  //       // functionalDept: {
  //       //   value: null, type: 'dropdown', list: this.functionaldeptList, id: 'code', text: 'description', displayMul: false, width: 100
  //       // },
  //       // profitCenter: {
  //       //   value: null, type: 'dropdown', list: this.profitCenterList, id: 'id', text: 'text', displayMul: false, width: 100
  //       // },
  //       // segment: {
  //       //   value: null, type: 'dropdown', list: this.segmentList, id: 'id', text: 'name', displayMul: false, width: 100
  //       // },
  //       // bttypes: {
  //       //   value: null, type: 'dropdown', list: this.btList, id: 'code', text: 'description', displayMul: false, width: 150
  //       // },
  //       // costCenter: {
  //       //   value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 100
  //       // },
  //       sgstamount: {
  //         value: null, type: 'number', disabled: true, width: 75
  //       },
  //       cgstamount: {
  //         value: null, type: 'number', disabled: true, width: 75
  //       },
  //       // workBreakStructureElement: {
  //       //   value: null, type: 'dropdown', list: this.wbsList, id: 'id', text: 'text', displayMul: false, width: 100
  //       // },
  //       // netWork: {
  //       //   value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 100
  //       // },
  //       // orderNo: {
  //       //   value: null, type: 'dropdown', list: this.ordertypeList, id: 'orderType', text: 'description', displayMul: false, width: 100
  //       // },
  //       // fundCenter: {
  //       //   value: null, type: 'dropdown', list: this.fcList, id: 'code', text: 'description', displayMul: false, width: 100
  //       // },
  //       // commitment: {
  //       //   value: null, type: 'dropdown', list: this.citemList, id: 'code', text: 'description', displayMul: false, width: 100
  //       // },
  //       hsnsaccode: {
  //         value: null, type: 'dropdown', list: this.hsnsacList, id: 'code', text: 'description', displayMul: false, width: 100
  //       },
  //       narration: {
  //         value: null, type: 'text', width: 100, maxLength: 50
  //       },
  //       igstamount: {
  //         value: null, type: 'number', disabled: true, width: 75
  //       },
  //       // ugstamount: {
  //       //   value: null, type: 'number', disabled: true, width: 75, hide: !this.commonService.checkNullOrUndefined(this.commonService.routeConfig.ugstamount) ? this.commonService.routeConfig.ugstamount : false
  //       // },
  //       delete: {
  //         type: 'delete', width: 10
  //       }
  //     },

  //     formControl: {
  //       glaccount: [null, [Validators.required]],
  //       amount: [null, [Validators.required]],
  //       accountingIndicator: [null, [Validators.required]]
  //     }
  //   };
  // }


  // getCompanyList() {
  //   const companyUrl = String.Join('/', this.apiConfigService.getCompanyList);
  //   this.apiService.apiGetRequest(companyUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.companyList = res.response['companiesList'];
  //           }
  //         }
  //         this.getTransVoucherClassList();
  //       });
  // }

  // getBranchList() {
  //   const branchUrl = String.Join('/', this.apiConfigService.getBranchList);
  //   this.apiService.apiGetRequest(branchUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.branchList = res.response['branchsList'];
  //           }
  //         }
  //         this.getTransVoucherClassList();
  //       });
  // }

  // getTransVoucherClassList() {
  //   const voucherClassList = String.Join('/', this.apiConfigService.getvocherclassList);
  //   this.apiService.apiGetRequest(voucherClassList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.voucherClassList = res.response['vcList'];
  //           }
  //         }
  //         this.getVoucherTypes();
  //       });
  // }

  // getVoucherTypes() {
  //   const voucherTypes = String.Join('/', this.apiConfigService.getVoucherTypesList);
  //   this.apiService.apiGetRequest(voucherTypes)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.voucherTypeList = res.response['vouchertypeList'];
  //           }
  //         }
  //         this.getGLAccountList();
  //       });
  // }

  // getGLAccountList() {
  //   const glAccUrl = String.Join('/', this.apiConfigService.getGLAccountList);
  //   this.apiService.apiGetRequest(glAccUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //            // this.accountFilterList = res.response['glList'];
  //             this.glAccountList = res.response['glList'];
  //             // this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' &&
  //             // resp.taxCategory != 'Bank' && resp.taxCategory != 'Control Account');
  //           }
  //         }
  //         this.getTaxRatesList();
  //       });
  // }


  // getfunctionaldeptList() {
  //   const taxCodeUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
  //   this.apiService.apiGetRequest(taxCodeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.functionaldeptList = res.response['fdeptList'];
  //           }
  //         }
  //         this.getTaxRatesList();
  //       });
  // }

  // getTaxRatesList() {
  //   const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
  //   this.apiService.apiGetRequest(taxCodeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.taxCodeList = res.response['TaxratesList'];
  //           }
  //         }
  //         this.getBusienessTransactionTypeList();
  //       });
  // }

  // getProfitCentersList() {
  //   const profCentUrl = String.Join('/', this.apiConfigService.getProfitCentersList);
  //   this.apiService.apiGetRequest(profCentUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.profitCenterList = res.response['profitCenterList'];
  //           }
  //         }
  //         this.getBusienessTransactionTypeList();
  //       });
  // }

  // getBusienessTransactionTypeList() {
  //   const segUrl = String.Join('/', this.apiConfigService.getBusienessTransactionTypeList);
  //   this.apiService.apiGetRequest(segUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.btList = res.response['bpttList'];
  //           }
  //         }
  //         this.getHsnSacList();
  //       });
  // }

  // getSegments() {
  //   const segUrl = String.Join('/', this.apiConfigService.getSegmentList);
  //   this.apiService.apiGetRequest(segUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.segmentList = res.response['segmentList'];
  //           }
  //         }
  //         this.getHsnSacList();
  //       });
  // }

  // getHsnSacList() {
  //   const segUrl = String.Join('/', this.apiConfigService.getHsnSacList);
  //   this.apiService.apiGetRequest(segUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.hsnsacList = res.response['hsnsacList'];
  //           }
  //         }
  //         this.getordernoList();
  //       });
  // }
  // getWbsList() {
  //   const segUrl = String.Join('/', this.apiConfigService.getwbselement);
  //   this.apiService.apiGetRequest(segUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.wbsList = res.response['wbsList'];
  //           }
  //         }
  //         this.getFundCenterList();
  //       });
  // }
  // getFundCenterList() {
  //   const fcUrl = String.Join('/', this.apiConfigService.getfundcenterList);
  //   this.apiService.apiGetRequest(fcUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.fcList = res.response['fcList'];
  //           }
  //         }
  //         this.getCommitmentList();
  //       });
  // }
  // getCommitmentList() {
  //   const cmntUrl = String.Join('/', this.apiConfigService.getCommitmentList);
  //   this.apiService.apiGetRequest(cmntUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.citemList = res.response['citemList'];
  //           }
  //         }
  //         this.getordernoList();
  //       });
  // }
  // getordernoList() {
  //   const onoUrl = String.Join('/', this.apiConfigService.getordernolist);
  //   this.apiService.apiGetRequest(onoUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.ordertypeList = res.response['ordertypeList'];
  //           }
  //         }
  //         this.voucherTypeSelect();
  //       });
  // }


  // getCostcenters() {
  //   const costCenUrl = String.Join('/', this.apiConfigService.getCostCentersList);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.costCenterList = res.response['costcenterList'];
  //           }
  //         }
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getCashBankDetail(this.routeEdit);
  //         }
  //       });
  // }



  // emitColumnChanges(data) {
    
  //   if (data.column == "glaccount") {
  //     const obj = this.glAccountList.find((g: any) => g.glaccountName == data.data[data.index].glaccount.value);
  //     const voucherNoUrl = String.Join('/', this.apiConfigService.gLsubAccountListbyCatetory, obj.accountNumber);
  //     this.apiService.apiGetRequest(voucherNoUrl)
  //       .subscribe(
  //         response => {
  //           this.spinner.hide();
  //           const res = response;
  //           if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //             if (!this.commonService.checkNullOrUndefined(res.response)) {
  //               data.data[data.index].subGlaccount.list  = res.response['glsubList'];
  //               this.sendDynTableData = { type: 'add', data: data.data };
  //             }
  //           }
  //         });
  //   }
  //   this.tableData = data.data;
  //   this.calculateAmount(data);
  // }

  // calculateAmount(row) {
  //   if (row.column == 'taxCode' || row.column == 'amount') {
  //     const code = row.data[row.index]['taxCode'].list.find(res => res.taxRateCode == row.data[row.index]['taxCode'].value);
  //     if (!this.commonService.checkNullOrUndefined(code)) {
  //       this.spinner.show();
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
  //       row.data[row.index].igstamount.value = (row.data[row.index].amount.value * code.igst) / 100;
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.sgst) / 100;
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
  //       this.sendDynTableData = { type: 'add', data: row.data };
  //       this.tableData = row.data;
  //     }
  //   }
  // }

  // back() {
  //   this.router.navigate(['dashboard/transaction/cashbank'])
  // }

  // save() {
  //   this.tableData = this.commonService.formatTableData(this.tableData);
  //   if (this.tableData.length == 0 && this.formData.invalid) {
  //     return;
  //   }
  //   this.saveCashBank();
  // }

  // saveCashBank() {
  //   this.formData.controls['voucherNumber'].enable();
  //   const tableData = this.tableData;
  //   tableData.forEach((t: any) => {
  //     const obj = this.glAccountList.find((g: any) => g.glaccountName == t.glaccount);
  //     t.glaccount = obj.accountNumber
  //   })
  //   const addCashBank = String.Join('/', this.apiConfigService.addCashBank);
  //   const requestObj = { cashbankHdr: this.formData.value, cashbankDtl: tableData };
  //   this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
  //     response => {
  //       const res = response;
  //       this.tableData = [];
  //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //         if (!this.commonService.checkNullOrUndefined(res.response)) {
  //           this.alertService.openSnackBar('Cash bank created Successfully..', Static.Close, SnackBar.success);
  //         }
  //         this.reset();
  //         this.spinner.hide();
  //       }
  //     });
  // }

}
