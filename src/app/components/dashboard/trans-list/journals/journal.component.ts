import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
@Component({
  selector: 'app-journals',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class JournalComponent implements OnInit {

  formData: FormGroup;
  sendDynTableData: any;

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

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
    //this.getfunctionaldeptList();
    this.formData.controls['voucherNumber'].disable();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      branch: [null, [Validators.required]],
      voucherType: [null, [Validators.required]],
      voucherNumber: [null, [Validators.required]],
      voucherDate: [new Date()],
      postingDate: [new Date()],
      transactionType: [null, [Validators.required]],
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
  }

  tablePropsFunc(subGlAccountList = []) {
    return {
      tableData: {
        id: {
          value: 0, type: 'autoInc', width: 10, disabled: true
        },
        glaccount: {
          value: null, type: 'autocomplete', list: this.glAccountList, id: 'glaccountName', displayId: 'accountNumber', displayText: 'glaccountName', multiple: true, width: 200, primary: true
        },
        subGlaccount: {
          value: null, type: 'autocomplete', list: subGlAccountList, id: 'glsubName', displayId: 'glsubCode', displayText: 'glsubName', multiple: true, width: 200, primary: true
        },
        accountingIndicator: {
          value: null, type: 'dropdown', list: this.indicatorList, id: 'id', text: 'text', displayMul: false, width: 100, disabled: false
        },
        amount: {
          value: null, type: 'number', width: 75, maxLength: 15
        },
        taxCode: {
          value: null, type: 'dropdown', list: this.taxCodeList, id: 'taxRateCode', text: 'description', displayMul: false, width: 100
        },
        sgstamount: {
          value: 0, type: 'number', disabled: true, width: 75
        },
        cgstamount: {
          value: 0, type: 'number', disabled: true, width: 75
        },
        igstamount: {
          value: 0, type: 'number', disabled: true, width: 75
        },
        // ugstamount: {
        //   value: 0, type: 'number', disabled: true, width: 75
        // },
        // referenceNo: {
        //   value: null, type: 'number', maxLength: 50, width: 75
        // },
        // referenceDate: {
        //   value: new Date(), type: 'datepicker', width: 100
        // },
        // functionalDept: {
        //   value: null, type: 'dropdown', list: this.functionaldeptList, id: 'code', text: 'description', displayMul: false, width: 100
        // },
        // profitCenter: {
        //   value: null, type: 'dropdown', list: this.profitCenterList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // segment: {
        //   value: null, type: 'dropdown', list: this.segmentList, id: 'id', text: 'name', displayMul: false, width: 100
        // },
        // bttypes: {
        //   value: null, type: 'dropdown', list: this.btList, id: 'code', text: 'description', displayMul: false, width: 150
        // },
        // costCenter: {
        //   value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        narration: {
          value: null, type: 'text', width: 100, maxLength: 50
        },
        // workBreakStructureElement: {
        //   value: null, type: 'dropdown', list: this.wbsList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // netWork: {
        //   value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // orderNo: {
        //   value: null, type: 'dropdown', list: this.ordertypeList, id: 'orderType', text: 'description', displayMul: false, width: 100
        // },
        // fundCenter: {
        //   value: null, type: 'dropdown', list: this.fcList, id: 'code', text: 'description', displayMul: false, width: 100
        // },
        // commitment: {
        //   value: null, type: 'dropdown', list: this.citemList, id: 'code', text: 'description', displayMul: false, width: 100
        // },
        hsnsac: {
          value: null, type: 'dropdown', list: this.hsnsacList, id: 'code', text: 'description', displayMul: false, width: 100
        },
        delete: {
          type: 'delete', width: 10
        }
      },
      formControl: {
        glaccount: [null, [Validators.required]],
        amount: [null, [Validators.required]],
      }
    }
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
              res.response['JvDetail'].forEach((d: any) => d.delete = true);
              this.sendDynTableData = { type: 'edit', data: res.response['JvDetail'] };
              this.formData.disable();
              this.checkCreditDebit();
            }
          }
        });
  }

  getCompanyList() {
    const companyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.getTransVoucherClassList();
        });
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
  //           }
  //         }
  //         this.getTransVoucherClassList();
  //       });
  // }

  getTransVoucherClassList() {
    const voucherClassList = String.Join('/', this.apiConfigService.getvocherclassList);
    this.apiService.apiGetRequest(voucherClassList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.voucherClassList = res.response['vcList'];
            }
          }
          this.getVoucherTypes();
        });
  }

  getVoucherTypes() {
    const voucherTypes = String.Join('/', this.apiConfigService.getVoucherTypesList);
    this.apiService.apiGetRequest(voucherTypes)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // this.voucherTypeList = res.response['vouchertypeList'].filter(resp => resp.voucherClass == '003' || resp.voucherClass == '03');
              this.voucherTypeList = res.response['vouchertypeList'].filter(resp => resp.voucherClass == '18');
            }
          }
          this.getGLAccountList();
        });
  }

  getGLAccountList() {
    const glAccUrl = String.Join('/', this.apiConfigService.getGLAccountList);
    this.apiService.apiGetRequest(glAccUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccountList = res.response['glList'];
              // this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
            }
          }
          this.getTaxRatesList();
        });
  }

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

  getTaxRatesList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.taxCodeList = res.response['TaxratesList'];
            }
          }
          this.getBusienessTransactionTypeList();
        });
  }

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

  getBusienessTransactionTypeList() {
    const segUrl = String.Join('/', this.apiConfigService.getBusienessTransactionTypeList);
    this.apiService.apiGetRequest(segUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.btList = res.response['bpttList'];
            }
          }
          this.getHsnSacList();
        });
  }

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

  getHsnSacList() {
    const segUrl = String.Join('/', this.apiConfigService.getHsnSacList);
    this.apiService.apiGetRequest(segUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.hsnsacList = res.response['hsnsacList'];
            }
          }
          this.getordernoList();
        });
  }



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
  getordernoList() {
    const onoUrl = String.Join('/', this.apiConfigService.getordernolist);
    this.apiService.apiGetRequest(onoUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.ordertypeList = res.response['ordertypeList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getJVDetail(this.routeEdit);
          } else {
            this.spinner.hide();
          }
        });
  }

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

  emitColumnChanges(data) {

    if (data.column == "glaccount") {
      const obj = this.glAccountList.find((g: any) => g.glaccountName == data.data[data.index].glaccount.value);
      const voucherNoUrl = String.Join('/', this.apiConfigService.gLsubAccountListbyCatetory, obj.accountNumber);
      this.apiService.apiGetRequest(voucherNoUrl)
        .subscribe(
          response => {
            this.spinner.hide();
            const res = response;
            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                data.data[data.index].subGlaccount.list  = res.response['glsubList'];
                this.sendDynTableData = { type: 'add', data: data.data };
              }
            }
          });
    }
    
    this.tableData = data.data;
    this.dataChange(data);
    this.checkCreditDebit();
  }

  dataChange(row) {
    if (row.column == 'accountingIndicator' || row.column == 'glaccount') {
      if (row.data.length > 1) {
        row.data.map((res, index) => {
          if (index != 0 && !this.commonService.checkNullOrUndefined(row.data[0].accountingIndicator.value)) {
            res.accountingIndicator.value = (row.data[0].accountingIndicator.value == 'Debit') ? 'Credit' : 'Debit';
            res.accountingIndicator.disabled = true;
          } else if (index != 0) {
            res.accountingIndicator.disabled = true;
          }
        })
      }
      this.sendDynTableData = { type: 'add', data: row.data };
      this.tableData = row.data;
    }
    if (row.column == 'taxCode' || row.column == 'amount') {
      const code = row.data[row.index]['taxCode'].list.find(res => res.taxRateCode == row.data[row.index]['taxCode'].value);
      if (!this.commonService.checkNullOrUndefined(code)) {
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
        row.data[row.index].igstamount.value = (row.data[row.index].amount.value * code.igst) / 100;
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.sgst) / 100;
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
        this.sendDynTableData = { type: 'add', data: row.data };
        this.tableData = row.data;
      }
    }
  }


  checkCreditDebit() {
    this.debitValue = 0;
    this.creditValue = 0;
    this.totalTaxValue = 0;
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.tableData.forEach(res => {
          if (res.accountingIndicator.value == 'Debit') {
            this.debitValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount.value)) ? (this.debitValue + parseInt(res.amount.value)) : 0;
          }
          if (res.accountingIndicator.value == 'Credit') {
            this.creditValue = !this.commonService.checkNullOrUndefined(parseInt(res.amount.value)) ? (this.creditValue + parseInt(res.amount.value)) : 0;
          }
          // this.totalTaxValue = this.totalTaxValue + res.sgstamount.value + res.cgstamount.value + res.ugstamount.value + res.igstamount.value
          this.totalTaxValue = this.totalTaxValue + res.sgstamount.value + res.cgstamount.value  + res.igstamount.value
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
    this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0) {
      return;
    }

    this.saveJournal();
  }

  return() { }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  saveJournal() {
    this.formData.controls['voucherNumber'].enable();
    const tableData = this.tableData;
    tableData.forEach((t: any) => {
      const obj = this.glAccountList.find((g: any) => g.glaccountName == t.glaccount);
      t.glaccount = obj.accountNumber
    })
    const addJournal = String.Join('/', this.apiConfigService.addJournal);
    const requestObj = { journalHdr: this.formData.value, journalDtl: this.tableData };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Journal created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }
}
