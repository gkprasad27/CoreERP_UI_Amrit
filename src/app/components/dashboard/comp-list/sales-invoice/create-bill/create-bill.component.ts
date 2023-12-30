import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../../services/api.service';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { AlertService } from '../../../../../services/alert.service';
import { Static } from '../../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaveItemComponent } from '../../../../../reuse-components/save-item/save-item.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { HostListener } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class CreateBillComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  getCashPartyAccountListArray = [];
  myControl = new FormControl();
  getmemberNamesArray = [];
  getStateListArray = [];
  getProductByProductCodeArray = [];
  getProductByProductNameArray = [];
  getVechielsArray = [];
  getPupmsArray = [];
  getSalesBranchListArray = [];
  memberNamesList = [];
  branchesList = [];
  disableSlipList = [];
  disablePump: any
  displayedColumns: string[] = ['SlNo', 'productCode', 'productName', 'hsnNo', 'pumpNo', 'qty', 'fQty',
    'slipNo', 'unitName', 'discount', 'taxGroupName', 'rate', 'grossAmount', 'availStock', 'delete'
  ];
  dataSource: MatTableDataSource<any>;
  isSaveDisabled = false;
  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  printBill = false;
  routeUrl = '';
  taxPercentage: any;
  isSalesReturnInvoice: any;
  setFocus: any;
  tableLength = 6;
  itemsLength = [];
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  GetPumpsListArray: any;
  pumpList = [];
  getCustomerGstNumListArray: any[];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {

    this.formDataGroup();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  formDataGroup() {
    this.branchFormData = this.formBuilder.group({
      branchCode: [null],
      branchName: [null],
      invoiceDate: [(new Date()).toISOString()],
      invoiceNo: [null],
      ledgerCode: [null],
      vehicleRegNo: [null],
      stateCode: [null],
      memberName: [null],
      customerGstin: [null],
      paymentMode: [null],
      mobile: [null],
      generalNo: [null],
      amountInWords: [null],
      totalAmount: [null],
      totaltaxAmount: [null],
      invoiceMasterId: [null],
      voucherNo: [null],
      voucherTypeId: [null],
      ledgerId: [null],
      ledgerName: [null],
      vehicleId: [null],
      memberCode: [null],
      customerName: [null],
      suppliedTo: [null],
      accountBalance: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      discount: [0.00],
      grandTotal: [null],
      totalCgst: [null],
      totalSgst: [null],
      totalIgst: [null],
      otherAmount1: [null],
      otherAmount2: [null],
      roundOffPlus: [null],
      roundOffMinus: [null],
      serverDateTime: [null],
      isSalesReturned: [null],
      isManualEntry: [null],
      manualInvoiceNo: [null],
    });
  }

  ngOnInit() {
    this.loadData();
    this.getperchaseBranchData();
    this.commonService.setFocus('ledgerCode');
  }
  check(event: KeyboardEvent) {
    // 31 and below are control keys, don't block them.
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  loadData() {
    this.GetBranchesList();
    this.GetMasterBranchesList();
    this.getCashPartyAccountList("100");
    this.getStateList();
    this.getSlipDate();
    this.getperchaseData();
    this.activatedRoute.params.subscribe(params => {
      if (!this.commonService.checkNullOrUndefined(params.id1)) {
        this.routeUrl = params.id1;
        const billHeader = JSON.parse(localStorage.getItem('selectedBill'));
        this.branchFormData.setValue(billHeader);
        this.getInvoiceDeatilList(params.id2);
        if (this.routeUrl == 'return') {
          const user = JSON.parse(localStorage.getItem('user'));
          this.generateSalesReturnInvNo(user.branchCode, params.id2);
        }
        this.disableForm(params.id1);
      } else {
        this.addTableRow();
        this.getCashPartyAccountList("100");
        const user = JSON.parse(localStorage.getItem('user'));
        if (!this.commonService.checkNullOrUndefined(user.branchCode)) {
          this.branchFormData.patchValue({
            branchCode: user.branchCode,
            userId: user.seqId,
            userName: user.userName,
            ledgerCode: "100"
          });
          this.branchFormData.patchValue({
            stateCode: '37',
            stateName: 'ANDHRA PRADESH'
          });
          this.getCashPartyAccount();
          this.setBranchCode();
          this.genarateBillNo(user.branchCode);
          this.formGroup();
        }
        this.disableForm();
      }
    });
  }

  getperchaseBranchData() {
    const getSlipListUrl = String.Join('/', '../../../../../../assets/settings/perchase-branch.json');
    this.apiService.apiGetRequest(getSlipListUrl).subscribe(
      response => {
        this.itemsLength = response.body;
        this.spinner.hide();
      });
  }

  setBranchLenght() {
    let flag = true;
    for (let b = 0; b < this.itemsLength.length; b++) {
      if (this.branchFormData.get('branchCode').value == this.itemsLength[b]) {
        this.tableLength = 3;
        flag = false;
        break;
      }
    }
    if (flag) {
      this.tableLength = 6;
    }
  }

  getperchaseData() {
    const getSlipListUrl = String.Join('/', '../../../../../../assets/settings/perchase.json');
    this.apiService.apiGetRequest(getSlipListUrl).subscribe(
      response => {
        this.disablePump = response.body;
        this.spinner.hide();
      });
  }

  disabledPump(code) {
    if (!this.commonService.checkNullOrUndefined(this.disablePump)) {
      for (let p = 0; p < this.disablePump.length; p++) {
        if (this.disablePump[p] == code) {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  generateSalesReturnInvNo(branchCode, invoice) {
    const generateSalesReturnInvNoUrl = String.Join('/', this.apiConfigService.generateSalesReturnInvNo, this.branchFormData.get('branchCode').value);
    this.apiService.apiGetRequest(generateSalesReturnInvNoUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['SalesReturnInvNo'])) {
              this.isSalesReturnInvoice = res.response['SalesReturnInvNo'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  getInvoiceDeatilList(id) {
    const getInvoiceDeatilListUrl = String.Join('/', this.apiConfigService.getInvoiceDeatilList, id);
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response['InvoiceDetailList']) && res.response['InvoiceDetailList'].length) {
            this.dataSource = new MatTableDataSource(res.response['InvoiceDetailList']);
            this.spinner.hide();
          }
        }
      });
  }

  disableForm(route?) {
    if (!this.commonService.checkNullOrUndefined(route)) {
      this.branchFormData.controls['ledgerCode'].disable();
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['invoiceDate'].disable();
      this.branchFormData.controls['vehicleRegNo'].disable();
      this.branchFormData.controls['stateCode'].disable();
      this.branchFormData.controls['paymentMode'].disable();
      this.branchFormData.controls['memberName'].disable();
      this.branchFormData.controls['customerGstin'].disable();
      this.branchFormData.controls['generalNo'].disable();
      this.branchFormData.controls['suppliedTo'].disable();
      this.branchFormData.controls['customerName'].disable();
      this.branchFormData.controls['mobile'].disable();
    }

    this.branchFormData.controls['invoiceNo'].disable();
    this.branchFormData.controls['accountBalance'].disable();
    this.branchFormData.controls['totalAmount'].disable();
    this.branchFormData.controls['ledgerName'].disable();
    this.branchFormData.controls['grandTotal'].disable();
    this.branchFormData.controls['totaltaxAmount'].disable();
    this.branchFormData.controls['paymentMode'].disable();
    this.branchFormData.controls['totalCgst'].disable();
    this.branchFormData.controls['totalSgst'].disable();
    this.branchFormData.controls['totalIgst'].disable();
    this.branchFormData.controls['amountInWords'].disable();
    this.branchFormData.controls['userName'].disable();

  }


  GetBranchesList() {
    const getBranchesListUrl = String.Join('/', this.apiConfigService.getBillingBranchesList);
    this.apiService.apiGetRequest(getBranchesListUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['BranchesList']) && res.response['BranchesList'].length) {
              this.GetBranchesListArray = res.response['BranchesList'];
              this.setBranchCode();
              this.spinner.hide();
            }
          }
        }
      });
  }

  GetMasterBranchesList() {
    const getMasterBranchesListUrl = String.Join('/', this.apiConfigService.getBranchesList);
    this.apiService.apiGetRequest(getMasterBranchesListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              console.log(res);
              this.branchesList = res.response['branchesList'];
            }
          }
          this.spinner.hide();
        });
  }



  genarateBillNo(branch?) {
    let flag = false;
    const branchList = JSON.parse(localStorage.getItem('branchList'));
    for (let b = 0; b < branchList.length; b++) {
      if (this.branchFormData.get('branchCode').value == branchList[b]) {
        flag = true;
      }
    }
    if (!flag) {
      this.alertService.openSnackBar(`You are not eligible to use this Branch(${this.branchFormData.get('branchCode').value}) code`, Static.Close, SnackBar.error);
      this.branchFormData.patchValue({
        branchCode: null,
        branchName: null,
        invoiceNo: null
      });
    } else {
      this.setBranchCode();
      this.setBranchLenght();
      let generateBillUrl;
      if (!this.commonService.checkNullOrUndefined(branch)) {
        generateBillUrl = String.Join('/', this.apiConfigService.generateBillNo, branch);
      } else {
        generateBillUrl = String.Join('/', this.apiConfigService.generateBillNo, this.branchFormData.get('branchCode').value);
      }
      this.apiService.apiGetRequest(generateBillUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['BillNo'])) {
                this.branchFormData.patchValue({
                  invoiceNo: res.response['BillNo']
                });
                // this.getAccountBalance();
                this.spinner.hide();
              }
            }
          } else if (res.status === StatusCodes.fail) {
            this.branchFormData.patchValue({
              invoiceNo: null
            });
          }
        });
    }
  }

  setBranchCode() {
    const bname = this.GetBranchesListArray.filter(branchCode => {
      if (branchCode.id == this.branchFormData.get('branchCode').value) {
        return branchCode;
      }
    });
    if (bname.length) {
      this.branchFormData.patchValue({
        branchName: !this.commonService.checkNullOrUndefined(bname[0]) ? bname[0].text : null
      });
    }
  }

  setLedgerName() {
    const lname = this.getCashPartyAccountListArray.filter(lCode => {
      if (lCode.id == this.branchFormData.get('ledgerCode').value) {
        return lCode;
      }
    });
    this.branchFormData.patchValue({
      ledgerName: !this.commonService.checkNullOrUndefined(lname[0]) ? lname[0].text : null
    });
    this.getCashPartyAccount();
    this.commonService.setFocus('vehicleRegNo');
    
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'F2'){
      this.commonService.setFocus('productCode0');
    }
    // else 
    // {
    //   alert("hi2");
    // }
    //  else if (event.key === 'Enter' && !isNaN(this.mbfValue)){
    //   this.cbm = this.mathService.mbf2cbm(this.mbfValue, this.autoRenew.value).toFixed(3);
    // }
  }
  getAccountBalance(accountGroupId) {
    if (!this.commonService.checkNullOrUndefined(this.branchFormData.get('ledgerCode').value) && this.branchFormData.get('ledgerCode').value != '') {
      const getAccountBalanceUrl = String.Join('/', this.apiConfigService.getAccountBalance,
        this.branchFormData.get('ledgerCode').value);
      this.apiService.apiGetRequest(getAccountBalanceUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['AccountBalance'])) {
                this.branchFormData.patchValue({
                  accountBalance: res.response['AccountBalance']
                });
                if (accountGroupId === 7576 && res.response['AccountBalance'] <= 0) {
                  this.isSaveDisabled = true;
                  this.alertService.openSnackBar(`Advance Party Account Balance Should not Be Less Than or Equal To Zero(${accountGroupId}) code`, Static.Close, SnackBar.error);
                } else {
                  this.isSaveDisabled = false;
                }

                this.spinner.hide();
              }
            }
          }
        });
    }
  }

  getmemberNames(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getmemberNamesUrl = String.Join('/', this.apiConfigService.getmemberNames, value);
      this.apiService.apiGetRequest(getmemberNamesUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Members']) && res.response['Members'].length) {
                this.getmemberNamesArray = res.response['Members'];
              } else {
                this.getmemberNamesArray = [];
              }
            }
          }
          this.spinner.hide();
        });
    } else {
      this.getmemberNamesArray = [];
    }
  }


  getVechiels(value) {
    this.branchFormData.patchValue({
      memberCode: null,
      memberName: null,
      // mobile: null,
      generalNo: null,
      vehicleId: null
    })
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getVechielsUrl = String.Join('/', this.apiConfigService.getVechiels, value, this.branchFormData.get('memberCode').value);
      this.apiService.apiGetRequest(getVechielsUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Members']) && res.response['Members'].length) {
                this.getVechielsArray = res.response['Members'];
              } else {
                this.getVechielsArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.getVechielsArray = [];
    }
  }

  getCashPartyAccountList(value) {
    if ((value.which || value.keyCode) == 113) {
      
  }
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getCashPartyAccountListUrl = String.Join('/', this.apiConfigService.getCashPartyAccountList, value);
      this.apiService.apiGetRequest(getCashPartyAccountListUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['CashPartyAccountList']) && res.response['CashPartyAccountList'].length) {
                this.getCashPartyAccountListArray = res.response['CashPartyAccountList'];
                this.getCashPartyAccount();
              } else {
                this.getCashPartyAccountListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.getCashPartyAccountListArray = [];
    }
  }
  //Raghavendra
  getCustomerGstNumList(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getCashPartyAccountListUrl = String.Join('/', this.apiConfigService.getCustomerGstNumList, value);
      this.apiService.apiGetRequest(getCashPartyAccountListUrl).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['CustomerGstNum'])) {
                this.branchFormData.patchValue({
                  customerGstin: res.response['CustomerGstNum']['customerGstin'],
                });
                
              }
            }
            this.spinner.hide();
          }
        });
    }
  }
 

  setMemberName(member) {
    this.branchFormData.patchValue({
      memberCode: member.item.id,
      mobile: member.item.phoneNo
    });
  }

  getCashPartyAccount() {
    const getCashPartyAccountUrl = String.Join('/', this.apiConfigService.getCashPartyAccount,
      this.branchFormData.get('ledgerCode').value);
    this.apiService.apiGetRequest(getCashPartyAccountUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['CashPartyAccount'])) {
              this.branchFormData.patchValue({
                ledgerName: res.response['CashPartyAccount']['ledgerName'],
                paymentMode: res.response['CashPartyAccount']['crOrDr'],
                ledgerId: res.response['CashPartyAccount']['ledgerId'],
                // mobile: res.response['CashPartyAccount']['mobile'],
                // customerGstin: res.response['CashPartyAccount']['tin']
              });
              this.getAccountBalance(res.response['CashPartyAccount']['accountGroupId']);
              this.spinner.hide();
            }
            if(this.branchFormData.get('ledgerCode').value!='100'){
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
            if(this.branchFormData.get('ledgerCode').value!='2295'){
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
            if(this.branchFormData.get('ledgerCode').value!='2403'){
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
          }
        }
      });
  }

  getStateList() {
    const getStateListUrl = String.Join('/', this.apiConfigService.getStateList);
    this.apiService.apiGetRequest(getStateListUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['StateList']) && res.response['StateList'].length) {
              this.getStateListArray = res.response['StateList'];
              // this.branchFormData.patchValue({
              //   stateCode: '37'
              // });
              this.getSelectedState();
              this.spinner.hide();
            }
          }
        }
      });
  }

  getSlipDate() {
    const getSlipListUrl = String.Join('/', '../../../../../../assets/settings/bill.json');
    this.apiService.apiGetRequest(getSlipListUrl).subscribe(
      response => {
        this.disableSlipList = response.body;
        this.spinner.hide();
      });
  }

  disableSlipVal(column) {
    let flag = true;
    for (let s = 0; s < this.disableSlipList.length; s++) {
      if (this.disableSlipList[s] == column) {
        flag = false;
        return false;
      }
    }
    if (flag) {
      return true;
    }
  }

  // disableSlipValData(column) {
  //   if (this.disableSlipVal(column.productCode)) {
  //     return true;
  //   } else if (this.commonService.checkNullOrUndefined(column.slipNo)) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  getSelectedState() {
    const getSelectedStateUrl = String.Join('/', this.apiConfigService.getSelectedState,
      this.branchFormData.get('stateCode').value);
    this.apiService.apiGetRequest(getSelectedStateUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['StateList']) && res.response['StateList'].length) {
              const taxP = res.response['StateList'][0];
              this.branchFormData.patchValue({
                stateCode: taxP.stateCode
              });
              if (taxP.igst == 0) {
                this.taxPercentage = true;
              } else {
                this.taxPercentage = false;
              }
              this.spinner.hide();
              this.calculateAmount();
            }
          }
        }
      });
  }

  setBackGroundColor(value, disabled) {
    if (disabled) {
      return '';
    } else if (value == 0) {
      return '';
    } else if (value == '' || this.commonService.checkNullOrUndefined(value)) {
      return 'flashLight';
    } else {
      return '';
    }
  }

  addTableRow() {
    const tableObj = {
      productCode: '', productName: '', hsnNo: '', pumpNo: '', qty: '', fQty: '', slipNo: '', unitName: '',
      discount: 0.00, taxGroupName: '', rate: '', grossAmount: '', availStock: '', delete: '', text: 'obj'
    };
    if (!this.commonService.checkNullOrUndefined(this.dataSource)) {
      this.dataSource.data.push(tableObj);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      this.dataSource = new MatTableDataSource([tableObj]);
    }
    this.commonService.setFocus(this.setFocus);
  }

  formGroup() {
    this.tableFormData = this.formBuilder.group({
      invoiceNo: [null],
      invoiceDate: [null],
      stateCode: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productId: [null],
      hsnNo: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      rate: [null],
      productGroupId: [null],
      productGroupCode: [null],
      pumpID: [null],
      pumpNo: [null],
      qty: [null],
      fQty: [null],
      slipNo: [null],
      unitId: [null],
      unitName: [null],
      discount: [0.00],
      taxGroupId: [null],
      taxGroupCode: [null],
      taxGroupName: [null],
      taxStructureId: [null],
      taxStructureCode: [null],
      cgst: [null],
      sgst: [null],
      igst: [null],
      grossAmount: [null],
      totalGST: [null],
      availStock: [null],
    });
  }

  setToFormModel(text, column, value) {
    if (text == 'obj') {
      this.tableFormData.patchValue({
        [column]: value
      });
    }
    if (this.tableFormData.valid) {
      if (this.dataSource.data.length < this.tableLength) {
        if (this.dataSource.data[this.dataSource.data.length - 1].productCode != '') {
          this.addTableRow();
        }
        this.formGroup();
      }
    }
  }

  clearQty(index, value, column, row) {
    this.dataSource.data[index].qty = null;
    this.dataSource.data[index].fQty = null;
    if (row.availStock < value) {
      this.alertService.openSnackBar(`This Product(${row.productCode}) qty or Fqty cannot be greater than available stock`, Static.Close, SnackBar.error);
      return;
    }
    this.dataSource.data[index][column] = value;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  deleteRow(i) {
    if (this.dataSource.data.length == 1) {
      return;
    }
    this.dataSource.data = this.dataSource.data.filter((value, index, array) => {
      return index !== i;
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.calculateAmount();

  }

  getProductByProductCode(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getProductByProductCode);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { productCode: value }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Products'])) {
                this.getProductByProductCodeArray = res.response['Products'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  getmemberNamesByCode(event) {
    console.log(event);
    const getmemberNamesByCodeUrl = String.Join('/', this.apiConfigService.getmemberNamesByCode, event.item.memberCode);
    this.apiService.apiGetRequest(getmemberNamesByCodeUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['Members'])) {
              this.branchFormData.patchValue({
                memberCode: res.response['Members']['memberCode'],
                memberName: res.response['Members']['memberName'],
                mobile: res.response['Members']['phoneNo'],
                generalNo: res.response['Members']['generalNo'],
                vehicleId: event.item.id
              });
              //this.getAccountBalance();
              this.spinner.hide();
            }
          }
        }
      });
  }

  calculateAmount(row?, index?) {
    if (!this.commonService.checkNullOrUndefined(row)) {
      if (!this.commonService.checkNullOrUndefined(row.qty) && (row.qty != '')) {
        this.dataSource.data[index].grossAmount = (row.qty * row.rate).toFixed(2);
      } else if (!this.commonService.checkNullOrUndefined(row.fQty) && (row.fQty != '')) {
        this.dataSource.data[index].grossAmount = (0 * row.rate).toFixed(2);
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    let totaltaxAmount = 0;
    let totalAmount = 0;
    for (let a = 0; a < this.dataSource.data.length; a++) {
      if (this.dataSource.data[a].grossAmount) {
        let tax = (this.taxPercentage) ? (this.dataSource.data[a].cgst + this.dataSource.data[a].sgst) : this.dataSource.data[a].igst;
        let amountTax = (+this.dataSource.data[a].grossAmount * 100) / (tax + 100);
        let totalTax = (+this.dataSource.data[a].grossAmount - amountTax);
        totalAmount = totalAmount + amountTax;
        totaltaxAmount = totaltaxAmount + totalTax;
      }
    }
    this.branchFormData.patchValue({
      totalAmount: !this.commonService.checkNullOrUndefined(totalAmount) ? totalAmount.toFixed(2) : null,
      totaltaxAmount: !this.commonService.checkNullOrUndefined(totaltaxAmount) ? totaltaxAmount.toFixed(2) : null,
    });
    this.branchFormData.patchValue({
      grandTotal: (totalAmount + totaltaxAmount).toFixed(2),
      totalCgst: (this.taxPercentage) ? (totaltaxAmount / 2).toFixed(2) : 0,
      totalSgst: (this.taxPercentage) ? (totaltaxAmount / 2).toFixed(2) : 0,
      totalIgst: (!this.taxPercentage) ? (totaltaxAmount).toFixed(2) : 0,
    });
    this.branchFormData.patchValue({
      amountInWords: this.branchFormData.get('grandTotal').value[0],
    });
  }

  getBillingDetailsRcd(productCode, index, id) {
    this.setFocus = id + index;
    this.commonService.setFocus(id + index);
    // if (this.checkProductCode(productCode, index)) {
    if (!this.commonService.checkNullOrUndefined(this.branchFormData.get('branchCode').value) && this.branchFormData.get('branchCode').value != '' &&
      !this.commonService.checkNullOrUndefined(productCode.value) && productCode.value != '') {
      const getBillingDetailsRcdUrl = String.Join('/', this.apiConfigService.getBillingDetailsRcd);
      this.apiService.apiPostRequest(getBillingDetailsRcdUrl, { productCode: productCode.value, branchCode: this.branchFormData.get('branchCode').value }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['BillingDetailsSection'])) {
                this.billingDetailsSection(res.response['BillingDetailsSection'], index);
                this.getProductByProductCodeArray = [];
                this.spinner.hide();
              }
            }
          }
        });
    }
    // } else {
    //   this.dataSource.data[index].productCode = null;
    //   this.dataSource = new MatTableDataSource(this.dataSource.data);
    //   this.alertService.openSnackBar(`Product Code( ${productCode.value} ) Allready Selected`, Static.Close, SnackBar.error);
    // }
  }

  // checkProductCode(code, index) {
  //   if (!this.commonService.checkNullOrUndefined(code.value)) {
  //     for (let c = 0; c < this.dataSource.data.length; c++) {
  //       if ((this.dataSource.data[c].productCode == code.value) && c != index) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  // }

  billingDetailsSection(obj, index) {
    if (this.commonService.checkNullOrUndefined(obj.availStock) || (obj.availStock == 0)) {
      this.alertService.openSnackBar(`This Product(${obj.productCode}) available stock is 0`, Static.Close, SnackBar.error);
    }
    obj.text = 'obj';
    this.dataSource.data[index] = obj;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.tableFormData.patchValue({
      productCode: obj.productCode,
      productName: obj.productName
    });
    // this.dataSource.data = this.dataSource.data.map(val => {
    //   if (val.productCode == obj.productCode) {
    //     this.tableFormData.patchValue({
    //       productCode: obj.productCode,
    //       productName: obj.productName
    //     });
    //     val = obj;
    //   }
    //   val.text = 'obj';
    //   return val;
    // });
    // if (this.disableSlipValData(obj)) {
    this.setToFormModel(null, null, null);
    // }
    this.commonService.setFocus(this.setFocus);
  }

  getProductByProductName(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getProductByProductNameUrl = String.Join('/', this.apiConfigService.getProductByProductName);
      this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Products'])) {
                this.getProductByProductNameArray = res.response['Products'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductNameArray = [];
    }
  }

  getPupms(pump, productCode) {
    const pNumber = +pump;
    if (!isNaN(pNumber)) {
      if (!this.commonService.checkNullOrUndefined(this.branchFormData.get('branchCode').value) && this.branchFormData.get('branchCode').value != '' &&
        !this.commonService.checkNullOrUndefined(pump) && pump != '' && !this.commonService.checkNullOrUndefined(productCode) && productCode != '') {
        const getPupmsUrl = String.Join('/', this.apiConfigService.getPupms, pump,
          this.branchFormData.get('branchCode').value, productCode);
        this.apiService.apiGetRequest(getPupmsUrl).subscribe(
          response => {
            const res = response.body;
            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                if (!this.commonService.checkNullOrUndefined(res.response['PumpsList'])) {
                  this.getPupmsArray = res.response['PumpsList'];
                  this.spinner.hide();
                }
              }
            }
            if (this.getPupmsArray.length == 0) {
              this.alertService.openSnackBar('Select Valid PumpNo', Static.Close, SnackBar.error);
            }
          });
      } else {
        this.getPupmsArray = [];
      }
    } else {
      this.alertService.openSnackBar('Only Number', Static.Close, SnackBar.error);
    }
  }

  // getPumpsList(productCode) {
  //   const getPumpsListUrl = String.Join('/', this.apiConfigService.getPumps, this.branchFormData.get('branchCode').value, productCode);
  //   this.apiService.apiGetRequest(getPumpsListUrl).subscribe(
  //     response => {
  //       const res = response.body;
  //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //         if (!this.commonService.checkNullOrUndefined(res.response)) {
  //           if (!this.commonService.checkNullOrUndefined(res.response['PumpsList']) && res.response['PumpsList'].length) {
  //             this.GetPumpsListArray = res.response['PumpsList'];
  //             this.setBranchCode();
  //             this.spinner.hide();
  //           }
  //         }
  //       }
  //     });
  // }

  setProductName(name, column) {
    this.tableFormData.patchValue({
      productName: name.value
    });
    // if (this.disableSlipValData(column)) {
    this.setToFormModel(null, null, null);
    // }
  }

  print() {
    this.enableFileds();
    const requestObj = { InvoiceHdr: this.branchFormData.value, InvoiceDetail: this.dataSource.data, Branches: this.branchesList, BranchCode: this.branchFormData.get('branchCode').value };
    if (requestObj.InvoiceDetail || requestObj.InvoiceHdr)
      this.printBill = true;
    //if (this.printBill) {

    //  this.dialog.open(PrintComponent, {
    //    width: '1024px',
    //    data: requestObj,
    //    disableClose: true
    //  });
    //}
    if (this.printBill) {
      if (this.branchFormData.get('branchCode').value == 2 || (this.branchFormData.get('branchCode').value == 3) || (this.branchFormData.get('branchCode').value == 4) || (this.branchFormData.get('branchCode').value == 7)) {
        // this.dialog.open(PrintPetrolComponent, {
        //   width: '1024px',
        //   data: requestObj,
        //   disableClose: true
        // });
      }
      else {
        // this.dialog.open(PrintComponent, {
        //   width: '1024px',
        //   data: requestObj,
        //   disableClose: true
        // });
      }

    }
  }

  save() {
    if (this.routeUrl == 'return') {
      this.registerInvoiceReturn();
      return;
    }
    if (this.routeUrl != '' || this.dataSource.data.length == 0) {
      return;
    }
    let tableData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      if (this.dataSource.data[d]['productCode'] != '') {
        tableData.push(this.dataSource.data[d]);
      }
    }
    let content = '';
    let availStock = tableData.filter(stock => {
      if (stock.availStock == 0) {
        content = '0 Availablilty Stock';
        return stock;
      }
      if (this.commonService.checkNullOrUndefined(stock.qty) && this.commonService.checkNullOrUndefined(stock.fQty)) {
        content = 'qty or Fqty is null';
        return stock;
      }
      if ((stock.qty > stock.availStock) || (stock.fQty > stock.availStock)) {
        content = 'qty or Fqty cannot be greater than available stock';
        return stock;
      }
      if (stock.productCode == 'D') {
        if (this.commonService.checkNullOrUndefined(stock.slipNo)) {
          content = 'SlipNo is null';
          return stock;
        }
      }
      if (stock.productCode == 'D' || stock.productCode == 'P' || stock.productCode == 'XP') {
        if (this.commonService.checkNullOrUndefined(stock.pumpNo)) {
          content = 'PumpNo is null';
          return stock;
        }
      }
      if (!this.commonService.checkNullOrUndefined(stock.pumpNo)) {
        if (this.getPupmsArray.length == 0) {
          content = 'PumpNo is not valid';
          return stock;
        }
      }

    });
    if (availStock.length) {
      this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) ${content}`, Static.Close, SnackBar.error);
      return;
    }

    const dialogRef = this.dialog.open(SaveItemComponent, {
      width: '1024px',
      data: '',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!this.commonService.checkNullOrUndefined(result)) {
        this.enableFileds();
        this.registerInvoice(tableData);
        this.isSaveDisabled = true;
      }
    });
  }

  enableFileds() {
    this.branchFormData.controls['invoiceNo'].enable();
    this.branchFormData.controls['accountBalance'].enable();
    this.branchFormData.controls['totalAmount'].enable();
    this.branchFormData.controls['ledgerName'].enable();
    this.branchFormData.controls['grandTotal'].enable();
    this.branchFormData.controls['totaltaxAmount'].enable();
    this.branchFormData.controls['paymentMode'].enable();
    this.branchFormData.controls['totalCgst'].enable();
    this.branchFormData.controls['totalSgst'].enable();
    this.branchFormData.controls['totalIgst'].enable();
    this.branchFormData.controls['amountInWords'].enable();
    this.branchFormData.controls['userName'].enable();
  }

  enableEditFields() {
    this.branchFormData.controls['ledgerCode'].enable();
    this.branchFormData.controls['branchCode'].enable();
    this.branchFormData.controls['invoiceDate'].enable();
    this.branchFormData.controls['vehicleRegNo'].enable();
    this.branchFormData.controls['stateCode'].enable();
    this.branchFormData.controls['paymentMode'].enable();
    this.branchFormData.controls['memberName'].enable();
    this.branchFormData.controls['customerGstin'].enable();
    this.branchFormData.controls['generalNo'].enable();
    this.branchFormData.controls['suppliedTo'].enable();
    this.branchFormData.controls['customerName'].enable();
    this.branchFormData.controls['mobile'].enable();
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.getVechielsArray = [];
    this.formDataGroup();
    this.loadData();
  }

  registerInvoice(data) {
    this.branchFormData.patchValue({
      paymentMode: 0,
      invoiceDate: this.commonService.formatDate(this.branchFormData.get('invoiceDate').value)
    });
    const registerInvoiceUrl = String.Join('/', this.apiConfigService.registerInvoice);
    const requestObj = { InvoiceHdr: this.branchFormData.value, InvoiceDetail: data, Branches: this.branchesList, BranchCode: this.branchFormData.get('branchCode').value };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Billing Successfully..', Static.Close, SnackBar.success);
            if (this.printBill) {
              if (this.branchFormData.get('branchCode').value == 2 || (this.branchFormData.get('branchCode').value == 3) || (this.branchFormData.get('branchCode').value == 4) || (this.branchFormData.get('branchCode').value == 7)) {
                // this.dialog.open(PrintPetrolComponent, {
                //   width: '1024px',
                //   data: requestObj,
                //   disableClose: true
                // });
              }
              else {
                // this.dialog.open(PrintComponent, {
                //   width: '1024px',
                //   data: requestObj,
                //   disableClose: true
                // });
              }
            }
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  registerInvoiceReturn() {
    const registerInvoiceReturnUrl = String.Join('/', this.apiConfigService.registerInvoiceReturn, this.isSalesReturnInvoice, this.branchFormData.get('invoiceMasterId').value);
    this.apiService.apiGetRequest(registerInvoiceReturnUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Billing Return Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

}