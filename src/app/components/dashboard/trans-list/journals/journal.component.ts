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
import { CommonModule, DatePipe } from '@angular/common';
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
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-journals',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, NgMultiSelectDropDownModule, TranslateModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})

export class JournalComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  formData: FormGroup;
  formData1: FormGroup;

  sendDynTableData: any;

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
  hsnsacList = [];
  debitValue = 0;
  creditValue = 0;
  totalTaxValue = 0;
  tableData = [];
  dynTableProps: any;
  btList = [];
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  glAccountList = [];
  subGlAccountList = [];
  indicatorList = [{ id: 'Debit', text: 'Debit' }, { id: 'Credit', text: 'Credit' }];
  profitCenterList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  wbsList: any;
  fcList: any;
  citemList: any;
  ordertypeList: any;

  // disableSave = true;

  constructor(public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private datepipe: DatePipe,
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
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      branch: [null],
      voucherType: [null, [Validators.required]],
      voucherNumber: [null, [Validators.required]],
      voucherDate: [new Date()],
      postingDate: [new Date()],
      transactionType: [null],
      period: [null],
      referenceNo: [null],
      referenceDate: [null],
      ext: [null],
      ext1: [null],
      narration: [null],
      voucherClass: [null],
      accountingIndicator: [null],
      status: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null]
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
      hsnsac: [''],

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
    const getCompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    const getVoucherTypesList = String.Join('/', this.apiConfigService.getVoucherTypesList);
    const getGLAccountList = String.Join('/', this.apiConfigService.getGLAccountList);
    const getTaxRatesList = String.Join('/', this.apiConfigService.getTaxRatesList);
    const getHsnSacList = String.Join('/', this.apiConfigService.getHsnSacList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getCompanyList),
        this.apiService.apiGetRequest(getVoucherTypesList),
        this.apiService.apiGetRequest(getGLAccountList),
        this.apiService.apiGetRequest(getTaxRatesList),
        this.apiService.apiGetRequest(getHsnSacList),

      ]).subscribe(([supplierRes, materialRes, glList, taxratesList, hsnsacList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(supplierRes) && supplierRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(supplierRes.response)) {
            this.companyList = supplierRes.response['companiesList']
          }
        }

        if (!this.commonService.checkNullOrUndefined(materialRes) && materialRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(materialRes.response)) {
            this.voucherTypeList = materialRes.response['vouchertypeList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(glList) && glList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(glList.response)) {
            this.glAccountList = glList.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
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
          this.getJVDetail(this.routeEdit);
        }

      });
    });
  }

  getJVDetail(val) {
    const jvDetUrl = String.Join('/', this.apiConfigService.getJVDetail, val);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['jvMasters']);
              // res.response['JvDetail'].forEach((d: any) => d.delete = true);
              // this.sendDynTableData = { type: 'edit', data: res.response['JvDetail'] };

              const arr = [ ...res.response['JvDetail'] ];
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
                s.hsnsac = s.hsnsac ? s.hsnsac : '';

                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ];
                s.id = s.id ? s.id : 0;
                s.index = index + 1;
              })
              this.tableData = arr;

              this.formData.disable();
              this.checkCreditDebit();
            }
          }
        });
  }

  voucherTypeSelect() {
    const record = this.voucherTypeList.find(res => res.id == this.formData.get('voucherClass').value)
    this.formData.patchValue({
      voucherClass: !this.commonService.checkNullOrUndefined(record) ? record.voucherClass : null
    })
  }

  voucherNoCalculate() {
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
                });
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
      this.checkCreditDebit();
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

  checkCreditDebit() {
    this.debitValue = 0;
    this.creditValue = 0;
    this.totalTaxValue = 0;
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.tableData.forEach(res => {
          if (res.accountingIndicator == 'Debit') {
            this.debitValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount)) ? (this.debitValue + parseInt(res.amount)) : 0;
          }
          if (res.accountingIndicator == 'Credit') {
            this.creditValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount)) ? (this.creditValue + parseInt(res.amount)) : 0;
          }
          // this.totalTaxValue = this.totalTaxValue + res.sgstamount + res.cgstamount + res.ugstamount + res.igstamount
          this.totalTaxValue = this.totalTaxValue + res.sgstamount + res.cgstamount + res.igstamount
        });
        // this.disableSave = (this.debitValue == this.creditValue) ? false : true;
      }
    }
    // this.disableSave = true;
  }

  back() {
    this.router.navigate(['dashboard/transaction/journals']);
  }

  save() {
    const arr = this.tableData.filter((t: any) => t.highlight);
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 || this.formData.invalid || arr.length == 0) {
      return;
    }

    this.formData.controls['voucherNumber'].enable();
    const obj = this.formData.value;
    obj.voucherDate = obj.voucherDate ? this.datepipe.transform(obj.voucherDate, 'MM-dd-yyyy') : '';
    obj.postingDate = obj.postingDate ? this.datepipe.transform(obj.postingDate, 'MM-dd-yyyy') : '';
    obj.referenceDate = obj.referenceDate ? this.datepipe.transform(obj.referenceDate, 'MM-dd-yyyy') : '';


    arr.forEach((t: any) => {
      const obj = this.glAccountList.find((g: any) => g.glaccountName == t.glaccount);
      t.glaccount = obj.accountNumber
    })
    const addJournal = String.Join('/', this.apiConfigService.addJournal);
    const requestObj = { journalHdr: obj, journalDtl: arr };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Journal created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
          this.router.navigate(['/dashboard/transaction/journals'])
          // this.reset();
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  // tablePropsFunc(subGlAccountList = []) {
  //   return {
  //     tableData: {
  //       id: {
  //         value: 0, type: 'autoInc', width: 10, disabled: true
  //       },
  //       glaccount: {
  //         value: null, type: 'autocomplete', list: this.glAccountList, id: 'glaccountName', displayId: 'accountNumber', displayText: 'glaccountName', multiple: true, width: 200, primary: true
  //       },
  //       subGlaccount: {
  //         value: null, type: 'autocomplete', list: subGlAccountList, id: 'glsubName', displayId: 'glsubCode', displayText: 'glsubName', multiple: true, width: 200, primary: true
  //       },
  //       accountingIndicator: {
  //         value: null, type: 'dropdown', list: this.indicatorList, id: 'id', text: 'text', displayMul: false, width: 100, disabled: false
  //       },
  //       amount: {
  //         value: null, type: 'number', width: 75, maxLength: 15
  //       },
  //       taxCode: {
  //         value: null, type: 'dropdown', list: this.taxCodeList, id: 'taxRateCode', text: 'description', displayMul: false, width: 100
  //       },
  //       sgstamount: {
  //         value: 0, type: 'number', disabled: true, width: 75
  //       },
  //       cgstamount: {
  //         value: 0, type: 'number', disabled: true, width: 75
  //       },
  //       igstamount: {
  //         value: 0, type: 'number', disabled: true, width: 75
  //       },
  //       // ugstamount: {
  //       //   value: 0, type: 'number', disabled: true, width: 75
  //       // },
  //       // referenceNo: {
  //       //   value: null, type: 'number', maxLength: 50, width: 75
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
  //       narration: {
  //         value: null, type: 'text', width: 100, maxLength: 50
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
  //       hsnsac: {
  //         value: null, type: 'dropdown', list: this.hsnsacList, id: 'code', text: 'description', displayMul: false, width: 100
  //       },
  //       delete: {
  //         type: 'delete', width: 10
  //       }
  //     },
  //     formControl: {
  //       glaccount: [null, [Validators.required]],
  //       amount: [null, [Validators.required]],
  //     }
  //   }
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
  //             // this.voucherTypeList = res.response['vouchertypeList'].filter(resp => resp.voucherClass == '003' || resp.voucherClass == '03');
  //             this.voucherTypeList = res.response['vouchertypeList'].filter(resp => resp.voucherClass == '18');
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
  //             this.glAccountList = res.response['glList'];
  //             // this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
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
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getJVDetail(this.routeEdit);
  //         } else {
  //           this.spinner.hide();
  //         }
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
  //           this.getJVDetail(this.routeEdit);
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
  //               data.data[data.index].subGlaccount.list = res.response['glsubList'];
  //               this.sendDynTableData = { type: 'add', data: data.data };
  //             }
  //           }
  //         });
  //   }

  //   this.tableData = data.data;
  //   this.dataChange(data);
  //   this.checkCreditDebit();
  // }

  // dataChange(row) {
  //   if (row.column == 'accountingIndicator' || row.column == 'glaccount') {
  //     if (row.data.length > 1) {
  //       row.data.map((res, index) => {
  //         if (index != 0 && !this.commonService.checkNullOrUndefined(row.data[0].accountingIndicator.value)) {
  //           res.accountingIndicator.value = (row.data[0].accountingIndicator.value == 'Debit') ? 'Credit' : 'Debit';
  //           res.accountingIndicator.disabled = true;
  //         } else if (index != 0) {
  //           res.accountingIndicator.disabled = true;
  //         }
  //       })
  //     }
  //     this.sendDynTableData = { type: 'add', data: row.data };
  //     this.tableData = row.data;
  //   }
  //   if (row.column == 'taxCode' || row.column == 'amount') {
  //     const code = row.data[row.index]['taxCode'].list.find(res => res.taxRateCode == row.data[row.index]['taxCode'].value);
  //     if (!this.commonService.checkNullOrUndefined(code)) {
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
  //       row.data[row.index].igstamount.value = (row.data[row.index].amount.value * code.igst) / 100;
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.sgst) / 100;
  //       row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
  //       this.sendDynTableData = { type: 'add', data: row.data };
  //       this.tableData = row.data;
  //     }
  //   }
  // }


  // checkCreditDebit1() {
  //   this.debitValue = 0;
  //   this.creditValue = 0;
  //   this.totalTaxValue = 0;
  //   if (!this.commonService.checkNullOrUndefined(this.tableData)) {
  //     if (this.tableData.length) {
  //       this.tableData.forEach(res => {
  //         if (res.accountingIndicator.value == 'Debit') {
  //           this.debitValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount.value)) ? (this.debitValue + parseInt(res.amount.value)) : 0;
  //         }
  //         if (res.accountingIndicator.value == 'Credit') {
  //           this.creditValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount.value)) ? (this.creditValue + parseInt(res.amount.value)) : 0;
  //         }
  //         // this.totalTaxValue = this.totalTaxValue + res.sgstamount.value + res.cgstamount.value + res.ugstamount.value + res.igstamount.value
  //         this.totalTaxValue = this.totalTaxValue + res.sgstamount.value + res.cgstamount.value + res.igstamount.value
  //       });
  //       // this.disableSave = (this.debitValue == this.creditValue) ? false : true;
  //     }
  //   }
  //   // this.disableSave = true;
  // }






  return() { }


}
