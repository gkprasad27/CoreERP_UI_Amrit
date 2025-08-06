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
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from '../../../../reuse-components/table/table.component';

@Component({
  selector: 'app-receiptspayments',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './receiptspayments.component.html',
  styleUrls: ['./receiptspayments.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})

export class ReceiptspaymentsComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  formData: FormGroup;
  formData1: FormGroup;

  // sendDynTableData: any;
  routeEdit = '';
  bpList = [];
  tableData = [];
  dynTableProps: any;
  bpgLists: any;
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  transactionTypeList = ['Cash', 'Bank']
  natureofTransactionList = ['Receipts', 'Payment'];
  accountList = [];
  accountFilterList = [];
  glAccountList = [];
  indicatorList = [{ id: 'Debit', text: 'Debit' }, { id: 'Credit', text: 'Credit' }];
  profitCenterList = [];
  bpTypeList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  purchaseinvoice = [];
  amount = [];
  date = [];

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
    this.formData.controls['voucherNumber'].disable();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      branch: [null, [Validators.required]],
      voucherClass: [null],
      voucherType: [null, [Validators.required]],
      // voucherDate: [new Date()],
      // postingDate: [new Date()],
      voucherDate: [],
      postingDate: [],
      period: [null],
      voucherNumber: [null, [Validators.required]],
      // transactionType: ['Cash', [Validators.required]],
      // natureofTransaction: ['Receipts', [Validators.required]],
      transactionType: ['', [Validators.required]],
      natureofTransaction: ['', [Validators.required]],
      account: [null],
      accountingIndicator: [null],
      referenceNo: [null],
      referenceDate: [null],
      profitCenter: [null],
      segment: [null],
      narration: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null],
      amount: [null],
      chequeNo: [null],
      chequeDate: [null],
      bpcategory: [null, [Validators.required]],
      partyAccount: [null, [Validators.required]]
    });
    this.checkTransType();

    this.formData1 = this.formBuilder.group({
      partyInvoiceNo: [''],
      partyInvoiceDate: [''],
      dueDate: [''],
      totalAmount: [''],
      memoAmount: [''],
      clearedAmount: [''],
      balanceDue: [''],
      notDue: [''],
      adjustmentAmount: [''],
      discount: [''],
      writeOffAmount: [''],
      partyAccount: [''],
      paymentterms: [''],
      postingDate: [''],
      discountGl: [''],
      writeOffGl: [''],
      narration: [''],

      id: [0],
      highlight: false,
      action: [[
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]],
      index: 0
    });

  }

  checkTransType() {
    this.formData.patchValue({
      chequeNo: null,
      chequeDate: null
    })
    if (this.formData.get('transactionType').value == 'Cash') {
      this.formData.controls['chequeNo'].disable();
      this.formData.controls['chequeDate'].disable();
    } else {
      this.formData.controls['chequeNo'].enable();
      this.formData.controls['chequeDate'].enable();
    }
  }

  // apis
  allApis() {
    const getCompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    const getVoucherTypesList = String.Join('/', this.apiConfigService.getVoucherTypesList);
    const getGLAccountsList = String.Join('/', this.apiConfigService.getGLAccountsList);
    const getpurchaseinvoiceList = String.Join('/', this.apiConfigService.getpurchaseinvoiceList);
    const getBPList = String.Join('/', this.apiConfigService.getBPList);
    const getPartnerTypeList = String.Join('/', this.apiConfigService.getPartnerTypeList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getCompanyList),
        this.apiService.apiGetRequest(getVoucherTypesList),
        this.apiService.apiGetRequest(getGLAccountsList),
        this.apiService.apiGetRequest(getpurchaseinvoiceList),
        this.apiService.apiGetRequest(getBPList),
        this.apiService.apiGetRequest(getPartnerTypeList)

      ]).subscribe(([supplierRes, materialRes, getmsizeRes, purchaseinvoice, bpList, ptypeList]) => {
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

        if (!this.commonService.checkNullOrUndefined(getmsizeRes) && getmsizeRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(getmsizeRes.response)) {
            this.accountFilterList = getmsizeRes.response['glList'];
            this.glAccountList = getmsizeRes.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
          }
        }

        if (!this.commonService.checkNullOrUndefined(purchaseinvoice) && purchaseinvoice.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(purchaseinvoice.response)) {
            this.functionaldeptList = purchaseinvoice.response['purchaseinvoiceList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(bpList) && bpList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(bpList.response)) {
            this.bpList = bpList.response['BPList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(ptypeList) && ptypeList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(ptypeList.response)) {
            this.bpTypeList = ptypeList.response['ptypeList'];
          }
        }

        if (this.routeEdit != '') {
          this.getreceiptpaymentDetail(this.routeEdit);
        }

      });
    });
  }

  getreceiptpaymentDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getPaymentsReceiptsDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['paymentreceiptMasters']);
              this.accountSelect();
              this.onbpChange(false);
              const bObj = this.bpgLists.find((p: any) => p.id == this.formData.value.partyAccount);
              this.formData.patchValue({ partyAccount: bObj.text });

              res.response['paymentreceiptDetail'].forEach((s: any, index: number) => {
                s.partyInvoiceNo = s.partyInvoiceNo ? s.partyInvoiceNo : '';
                s.partyInvoiceDate = s.partyInvoiceDate ? s.partyInvoiceDate : '';
                s.dueDate = s.dueDate ? s.dueDate : '';
                s.totalAmount = s.totalAmount ? s.totalAmount : 0;
                s.memoAmount = s.memoAmount ? s.memoAmount : 0;
                s.clearedAmount = s.clearedAmount ? s.clearedAmount : 0;
                s.balanceDue = s.balanceDue ? s.balanceDue : 0;
                s.notDue = s.notDue ? s.notDue : 0;
                s.adjustmentAmount = s.adjustmentAmount ? s.adjustmentAmount : 0;
                s.discount = s.discount ? s.discount : null;
                s.writeOffAmount = s.writeOffAmount ? s.writeOffAmount : 0;
                s.partyAccount = s.partyAccount ? s.partyAccount : 0;
                s.paymentterms = s.paymentterms ? s.paymentterms : 0;
                s.postingDate = s.postingDate ? s.postingDate : '';
                s.discountGl = s.discountGl ? s.discountGl : '';
                s.writeOffGl = s.writeOffGl ? s.writeOffGl : '';
                s.narration = s.narration ? s.narration : '';
                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ];
                s.id = s.id ? s.id : 0;
                s.index = index + 1;
              })
              this.tableData = res.response['paymentreceiptDetail'];
              // this.sendDynTableData = { type: 'edit', data: res.response['paymentreceiptDetail'] };
              this.formData.disable();
            }
          }
        });
  }

  accountSelect() {
    this.accountList = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('transactionType').value)) {
      this.accountList = this.accountFilterList.filter(resp => resp.taxCategory == this.formData.get('transactionType').value);
    }
  }

  voucherTypeSelect() {
    const record = this.voucherTypeList.find(res => res.voucherTypeId == this.formData.get('voucherType').value)
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
                })
              }
            }
          });
    }
  }

  onbpChange(flag = true) {
    this.bpgLists = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('bpcategory').value)) {
      let data = this.bpTypeList.find(res => res.code == this.formData.get('bpcategory').value);
      this.bpgLists = this.bpList.filter(res => res.bptype == data.code);
      // this.formData.patchValue({
      //   partyAccount: this.bpgLists.length ? this.bpgLists[0].text : null
      // })
      if (flag) {
        this.puchaseinvoiceselect();
      }
    }
  }

  puchaseinvoiceselect() {
    this.tableComponent.defaultValues();
    this.tableData = null;
    let data = [];
    const bObj = this.bpgLists.find((p: any) => p.text == this.formData.value.partyAccount);
    if (!this.commonService.checkNullOrUndefined(this.formData.get('partyAccount').value)) {
      data = this.functionaldeptList.filter(resp => resp.partyAccount == bObj.id);
    }
    if (data.length) {
      data.forEach((s: any, index: number) => {
        s.partyInvoiceNo = s.partyInvoiceNo ? s.partyInvoiceNo : '';
        s.partyInvoiceDate = s.partyInvoiceDate ? s.partyInvoiceDate : '';
        s.dueDate = s.dueDate ? s.dueDate : '';
        s.totalAmount = s.totalAmount ? s.totalAmount : 0;
        s.memoAmount = s.memoAmount ? s.memoAmount : 0;
        s.clearedAmount = s.clearedAmount ? s.clearedAmount : 0;
        s.balanceDue = s.balanceDue ? s.balanceDue : 0;
        s.notDue = s.notDue ? s.notDue : 0;
        s.adjustmentAmount = s.adjustmentAmount ? s.adjustmentAmount : 0;
        s.discount = s.discount ? s.discount : null;
        s.writeOffAmount = s.writeOffAmount ? s.writeOffAmount : 0;
        s.partyAccount = s.partyAccount ? s.partyAccount : 0;
        s.paymentterms = s.paymentterms ? s.paymentterms : 0;
        s.postingDate = s.postingDate ? s.postingDate : '';
        s.discountGl = s.discountGl ? s.discountGl : '';
        s.writeOffGl = s.writeOffGl ? s.writeOffGl : '';
        s.narration = s.narration ? s.narration : '';
        s.action = [
          { id: 'Edit', type: 'edit' },
          { id: 'Delete', type: 'delete' }
        ];
        s.id = 0;
        s.index = index + 1;
      })
      this.tableData = data;
      // data.forEach((res, index) => {
      //   newData.push(this.tablePropsFunc().tableData);
      //   newData[index].dueDate.value = res.dueDate;
      //   newData[index].partyAccount.value = res.partyAccount;
      //   newData[index].partyInvoiceNo.value = res.partyInvoiceNo;
      //   newData[index].paymentterms.value = res.paymentterms;
      //   newData[index].postingDate.value = res.postingDate;
      //   newData[index].totalAmount.value = res.totalAmount;
      //   newData[index].balanceDue.value = res.balanceDue;
      //   newData[index].clearedAmount.value = res.clearedAmount;
      // })
      // this.sendDynTableData = { type: 'add', data: newData };
    }
  }

  saveForm() {

    if (+this.formData1.value.adjustmentAmount > +this.formData1.value.totalAmount) {
      this.alertService.openSnackBar(`AdjustmentAmount can't be more than totalAmount`, Static.Close, SnackBar.error);
      this.formData1.patchValue({
        adjustmentAmount: 0
      });
      return;
    }

    if (this.formData1.invalid) {
      return;
    }

    this.formData1.patchValue({
      highlight: true
    });

    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.formData1.value.index == 0) {
      return;
      // this.formData1.patchValue({
      //   index: data ? (data.length + 1) : 1
      // });
      // data = [this.formData1.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
      const arr = this.tableData.filter((t: any) => t.highlight);
      const totalAdjustment = arr.reduce((sum, item) => sum + (+item.adjustmentAmount || 0), 0);
      this.formData.patchValue({
        amount: totalAdjustment
      });
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
      if (this.commonService.checkNullOrUndefined(this.formData1.value.discount)) {
        this.getDiscount();
      }
    }
  }

  getDiscount() {
    const getDiscountUrl = String.Join('/', this.apiConfigService.getDiscount);
    const requestObj = {
      dueDate: this.formData1.value.dueDate || this.datepipe.transform(new Date(), 'yyyy-MM-dd'), partyAccount: this.formData1.value.partyAccount,
      partyInvoiceNo: this.formData1.value.partyInvoiceNo, paymentterms: this.formData1.value.paymentterms,
      postingDate: this.formData1.value.postingDate, totalAmount: this.formData1.value.totalAmount
    };
    this.apiService.apiPostRequest(getDiscountUrl, requestObj)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          // if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          //   if (!this.commonService.checkNullOrUndefined(res.response)) {
          this.formData1.patchValue({
            discount: res.response['discount'] || 0
          })
          //   }
          // }
        });
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

  save() {
    const arr = this.tableData.filter((t: any) => t.highlight);
    // this.tableData = this.commonService.formatTableData(this.tableData, 0);
    if (this.tableData.length == 0 || this.formData.invalid || arr.length == 0) {
      return;
    }

    const bObj = this.bpgLists.find((p: any) => p.text == this.formData.value.partyAccount);
    this.formData.patchValue({ partyAccount: bObj.id });
    this.formData.controls['voucherNumber'].enable();
    const addCashBank = String.Join('/', this.apiConfigService.addPaymentsReceipts);
    const requestObj = { pcbHdr: this.formData.value, pcbDtl: arr };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Payments Receipts created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
          // this.reset();
          this.router.navigate(['/dashboard/transaction/receiptspayments'])

        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  back() {
    this.router.navigate(['dashboard/transaction/receiptspayments'])
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnCashBank, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
          this.spinner.hide();
        }
      });
  }

  // getCompanyList() {
  //   const companyUrl = String.Join('/', this.apiConfigService.getCompanyList);
  //   this.apiService.apiGetRequest(companyUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.companyList = res.response['companiesList'];
  //             // if (this.routeEdit == '') {
  //             //   this.formData.patchValue({
  //             //     company: this.companyList.length ? this.companyList[0].id : null
  //             //   })
  //             // }
  //           }
  //         }
  //         this.getTransVoucherClassList();
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
  //             // if (this.routeEdit == '') {
  //             //   this.formData.patchValue({
  //             //     voucherType: this.voucherTypeList.length ? this.voucherTypeList[0].voucherTypeId : null
  //             //   })
  //             // }
  //           }
  //         }
  //         this.getGLAccountsList();
  //       });
  // }


  // getGLAccountsList() {
  //   const glAccUrl = String.Join('/', this.apiConfigService.getGLAccountsList);
  //   this.apiService.apiGetRequest(glAccUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.accountFilterList = res.response['glList'];
  //             this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
  //           }
  //         }
  //         this.getpurchaseinvoiceList();
  //       });
  // }


  // getpurchaseinvoiceList() {
  //   const taxCodeUrl = String.Join('/', this.apiConfigService.getpurchaseinvoiceList);
  //   this.apiService.apiGetRequest(taxCodeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.functionaldeptList = res.response['purchaseinvoiceList'];
  //           }
  //         }
  //         this.getTaxRatesList();
  //       });
  // }


  // getbpList() {
  //   const costCenUrl = String.Join('/', this.apiConfigService.getBPList);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.bpList = res.response['BPList'];
  //           }
  //         }
  //         this.getPartnerTypeList();
  //       });
  // }

  //   getPartnerTypeList() {
  //   const costCenUrl = String.Join('/', this.apiConfigService.getPartnerTypeList);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.bpTypeList = res.response['ptypeList'];
  //             // if (this.routeEdit == '') {
  //             //   this.formData.patchValue({
  //             //     bpcategory: this.bpTypeList.length ? this.bpTypeList[0].code : null
  //             //   })
  //             //   this.onbpChange();
  //             //   this.accountSelect();
  //             //   this.voucherTypeSelect();
  //             // }
  //           }
  //         }
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getreceiptpaymentDetail(this.routeEdit);
  //         }
  //         this.spinner.hide();
  //       });
  // }



  tablePropsFunc() {
    return {
      tableData: {
        id: {
          value: 0, type: 'autoInc', width: 10, disabled: true, fieldEnable: true
        },
        checkAll:
        {
          value: false, type: 'checkbox'
        },

        partyInvoiceNo: {
          value: null, type: 'none', width: 150, disabled: true
        },
        partyInvoiceDate: {
          // value: null, type: 'dropdown', list: this.date, id: 'date', text: 'date', displayMul: true, width: 100
          value: new Date(), type: 'noneDate', width: 100, disabled: true
        },
        dueDate: {
          value: null, type: 'noneDate', width: 100, disabled: true
        },
        totalAmount: {
          //value: null, type: 'dropdown', list: this.amount, id: 'amount', text: 'amount', displayMul: true, width: 100
          value: 0, type: 'none', width: 75, disabled: true
        },
        memoAmount: {
          value: 0, type: 'none', width: 75, disabled: true
        },
        clearedAmount: {
          value: 0, type: 'none', width: 75, disabled: true
        },
        balanceDue: {
          value: 0, type: 'none', width: 75, disabled: true
        },
        notDue: {
          value: 0, type: 'number', width: 75, disabled: true, fieldEnable: true
        },
        adjustmentAmount: {
          value: 0, type: 'number', width: 75, disabled: true, fieldEnable: true
        },
        discount: {
          value: 0, type: 'number', width: 75, disabled: true
        },
        writeOffAmount: {
          value: 0, type: 'number', width: 75, disabled: true, fieldEnable: true
        },
        partyAccount: {
          value: 0, type: 'none', width: 75, disabled: true
        },
        paymentterms: {
          value: 0, type: 'text', width: 75, disabled: true
        },
        postingDate: {
          value: 0, type: 'noneDate', width: 100, disabled: true
        },
        discountGl: {
          value: null, type: 'dropdown', list: this.glAccountList, id: 'id', text: 'text', displayMul: true, width: 100, disabled: true, fieldEnable: true
        },
        writeOffGl: {
          value: null, type: 'dropdown', list: this.glAccountList, id: 'id', text: 'text', displayMul: true, width: 100, disabled: true, fieldEnable: true
        },

        narration: {
          value: null, type: 'text', width: 150, disabled: true, fieldEnable: true
        },
        // delete: {
        //   type: 'delete', width: 10
        // }
      },
      formControl: {}
    }
  }









  // getBranchList() {
  //   const branchUrl = String.Join('/', this.apiConfigService.getBranchList);
  //   this.apiService.apiGetRequest(branchUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.branchList = res.response['branchsList'];
  //             if (this.routeEdit == '') {
  //               this.formData.patchValue({
  //                 branch: this.branchList.length ? this.branchList[0].id : null
  //               })
  //             }
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
  //         this.getbpList();
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
  //         this.getSegments();
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
  //         this.getbpList();
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
  //         if (this.routeEdit != '') {
  //           this.getreceiptpaymentDetail(this.routeEdit);
  //         }
  //         this.spinner.hide();
  //       });
  // }




  emitColumnChanges(data) {
    this.tableData = data.data;
    if (data.column == 'adjustmentAmount') {
      this.loopTableData(data);
      this.checkAjectAmount(true)
    }
    if (data.column == 'checkAll') {
      if (data.data[data.index].checkAll.value) {
        // this.getDiscount(data);
      }
      else {
        data.data[data.index].discount.value = 0;
        // this.sendDynTableData = { type: 'add', data: data.data };
        this.tableData = data.data;
      }
    }

  }

  loopTableData(row) {
    const dublicateRow = [...row.data];
    let flag = false;
    // let checkAjectAmount = 0;
    // for (let r = 0; r < row.data.length; r++) {
    // if (row.column == 'adjustmentAmount' && r == row.index) {
    if (row.column == 'adjustmentAmount') {
      if (+row.data[row.index].adjustmentAmount.value > +row.data[row.index].totalAmount.value) {
        this.alertService.openSnackBar(`AdjustmentAmount can't be more than totalAmount`, Static.Close, SnackBar.error);
        row.data[row.index].adjustmentAmount.value = 0;
        flag = true;
        // break;
      }
    }

    // }
    if (flag) {
      this.spinner.show();

      // this.sendDynTableData = { type: 'add', data: dublicateRow };
      this.tableData = dublicateRow;
    }
  }




  checkAjectAmount(flag = false) {
    let adjustmentAmount = 0;
    if (this.tableData.length) {
      this.tableData.forEach(res => {
        if (res.adjustmentAmount) {
          adjustmentAmount = adjustmentAmount + (+res.adjustmentAmount)
        }
      });
      if (adjustmentAmount == +this.formData.get('amount').value && !this.commonService.checkNullOrUndefined(adjustmentAmount) && flag) {
        this.alertService.openSnackBar(`AdjustmentAmount can't be same as total amount`, Static.Close, SnackBar.error);
      }
      return (adjustmentAmount == +this.formData.get('amount').value && !this.commonService.checkNullOrUndefined(adjustmentAmount)) ? false : true;
    }
    return true;
  }




}
