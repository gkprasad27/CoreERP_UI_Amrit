import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TableComponent } from 'src/app/reuse-components';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SalesInvoiceComponent implements OnInit {

  formData: FormGroup;
  formData1: FormGroup;

  materialCodeList: any[] = [];
  getSaleOrderData: any[] = [];
  customerList: any[] = [];
  profitCenterList: any[] = [];
  companyList: any[] = [];
  taxCodeList: any[] = [];

  routeEdit = '';

  tableData = [];

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  invoicePrintData: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    public commonService: CommonService,
    public route: ActivatedRoute,
    private router: Router) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit(): void {
    this.formDataGroup();
    this.getSaleOrderList();
    // this.getCustomerList();
    this.getProfitcenterData();
    this.getTaxRatesList();
    this.getCompanyList();
    if (this.routeEdit != '') {
      this.getInvoiceDeatilList(this.routeEdit);
    }
  }

  formDataGroup() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.formData = this.formBuilder.group({

      userId: [user.userName],
      company: ['', [Validators.required]],
      profitCenter: ['', Validators.required],
      saleOrderNo: ['', Validators.required],
      invoiceMasterId: 0,
      invoiceDate: [''],
      customerName: [''],
      customerGstin: [''],
      // mobile: [''],
      shiptoAddress1: [''],
      shiptoAddress2: [''],
      shiptoState: [''],
      shiptoCity: [''],
      shiptoZip: [''],
      shiptoPhone: [''],

      totalIGST: [0],
      totalCGST: [0],
      totalSGST: [0],
      totalAmount: [0],
      totalTax: [0],
      grandTotal: [0],

      id: [0]
    });

    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      materialName: [''],
      netWeight: [''],
      inspectionCheckNo: [''],
      tagName: [''],
      saleorder: [''],
      igst: [''],
      cgst: [''],
      sgst: [''],
      grossAmount: [''],
      taxStructureId: [''],
      rate: [''],
      invoiceDetailId: 0,
      qty: [''],
      highlight: false,
      type: [''],
      action: 'editDelete',
      index: 0
    });
  }

  getTaxRatesList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['TaxratesList'];
              this.taxCodeList = resp;
            }
          }
        });
  }

  getSaleOrderList() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderList);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getSaleOrderData = res.response['BPList'];
            }
          }
        });
  }


  getCustomerList() {
    const costCenUrl = String.Join('/', this.apiConfigService.getCustomerList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpList'];
              const data = resp.length && resp.filter((t: any) => t.bptype == 'Customer');
              this.customerList = data;
            }
          }
        });
  }

  getProfitcenterData() {
    const getpcUrl = String.Join('/', this.apiConfigService.getProfitCenterList);
    this.apiService.apiGetRequest(getpcUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
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
        });
  }

  customerNameSelect() {
    const obj = this.customerList.find((c: any) => c.id == this.formData.value.customerName);
    this.formData.patchValue({
      customerGstin: obj ? obj.gstNo : ''
    })
  }

  getsaleOrdernoList() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getsaleOrdernoListe, this.formData.get('saleOrderNo').value);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialCodeList = res.response['saleordernoList'];
              this.getBusienessPartnerAccount(res.response.saleOrderMasterList);
              this.ponoselect();
              this.getInspectionCheckDetailbySaleorder();
            }
          }
        });
  }



  getBusienessPartnerAccount(data: any) {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getBusienessPartnerAccount, data.customerCode);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response.bpaList);
              this.formData.patchValue({
                customerName: res.response.bpaList.name,
                customerGstin: res.response.bpaList.gstno,
              })
            }
          }
        });
  }

  getInspectionCheckDetailbySaleorder() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getInspectionCheckDetailbySaleorder, this.formData.get('saleOrderNo').value);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tableComponent.defaultValues();
              res.response['icDetail'].forEach((i: any) => {
                debugger
                const obj = this.materialCodeList.find((m: any) => m.materialCode == i.materialCode)

                const objT = this.taxCodeList.find((tax: any) => tax.taxRateCode == obj.taxCode);
                const igst = objT.igst ? (obj.rate * objT.igst) / 100 : 0;
                const cgst = objT.cgst ? (obj.rate * objT.cgst) / 100 : 0;
                const sgst = objT.sgst ? (obj.rate * objT.sgst) / 100 : 0;
                i.igst = igst;
                i.cgst = cgst;
                i.sgst = sgst;
                i.grossAmount = obj.rate;
                i.tagName = i.productionTag;
                i.saleorder = i.saleOrderNumber;
                i.materialCode = i.materialCode;
                i.materialName = i.materialName;
                i.inspectionCheckNo = i.inspectionCheckNo;
                i.rate = obj.rate;
                i.taxStructureId = obj.taxCode;
                i.totalTax = (igst + sgst + cgst);
                i.totalAmount = (obj.rate) + (igst + sgst + cgst)
                i.checkbox = false
              });
              this.tableData = res.response['icDetail'];

            }
          }
        });
  }

  tableCheckboxEvent(event: any) {
    this.tableData.forEach((res: any) => res.checkbox = (res.id == event.item.id) ? event.flag.checked : res.checkbox);
    this.calculate();
  }

  calculate() {
    this.formData.patchValue({
      totalIGST: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalAmount: 0,
      totalTax: 0,
      grandTotal: 0,
    })
    this.tableData && this.tableData.forEach((t: any) => {
      if (t.checkbox) {
        this.formData.patchValue({
          totalIGST: ((+this.formData.value.totalIGST) + t.igst).toFixed(2),
          totalCGST: ((+this.formData.value.totalCGST) + t.cgst).toFixed(2),
          totalSGST: ((+this.formData.value.totalSGST) + t.sgst).toFixed(2),
          totalAmount: ((+this.formData.value.totalAmount) + (t.grossAmount)).toFixed(2),
          totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
        })
      }
    })
    this.formData.patchValue({
      grandTotal: ((+this.formData.value.totalAmount) + (+this.formData.value.totalTax)).toFixed(2),
    })
  }

  ponoselect() {
    this.formData1.patchValue({
      qty: '',
      netWeight: '',
      materialCode: '',
    })
    this.tableData = null;
  }

  getInvoiceDeatilList(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getInvoiceDeatilList, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              debugger
              this.formData.patchValue(res.response['InvoiceMasterList']);
              this.formData.patchValue({
                profitCenter: res.response['InvoiceMasterList']['profitcenter']
              })
              let arr = [];
              res.response['invoiceDetailsList'].forEach((d: any, index: number) => {
                const obj = {
                  materialCode: d.materialCode ? d.materialCode : '',
                  materialName: d.materialName ? d.materialName : '',
                  saleOrderNumber: d.saleorder ? d.saleorder : '',
                  productionTag: d.tagName ? d.tagName : '',
                  inspectionCheckNo: d.inspectionCheckNo ? d.inspectionCheckNo : '',
                  status: d.status ? d.status : '',
                }
                arr.push(obj)
              })
              this.tableData = arr;
              this.materialCodeChange();
              this.formData.disable();
            }
          }
        });
  }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      type: '',
      highlight: true
    })
    let data: any = this.tableData;
    data = (data && data.length) ? data : [];
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.formData1.value.index == 0) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
    });
    this.resetForm();
  }

  materialCodeChange() {
    const obj = this.materialCodeList.find((p: any) => p.materialCode == this.formData1.value.materialCode);
    this.formData1.patchValue({
      qty: obj ? obj.qty : '',
      netWeight: obj ? obj.netWeight : '',
      materialName: obj ? obj.text : ''
    })
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData1.patchValue(value.item);
    }
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete'
    });
  }


  save() {
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.savegoodsreceipt();
  }

  savegoodsreceipt() {
    this.formData.enable();
    const arr = this.tableData.filter((d: any) => !d.type);
    const registerInvoice = String.Join('/', this.apiConfigService.registerInvoice);
    const formData = this.formData.value;
    formData.receivedDate = this.formData.get('invoiceDate').value ? this.datepipe.transform(this.formData.get('invoiceDate').value, 'MM-dd-yyyy') : '';
    const requestObj = { grHdr: formData, grDtl: arr };
    this.apiService.apiPostRequest(registerInvoice, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.router.navigateByUrl('dashboard/transaction/salesinvoice');
            this.alertService.openSnackBar('Goods Receipt created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
        }
      });
  }

  back() {
    this.router.navigate(['dashboard/transaction/salesinvoice'])
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
  }

  invoicePrint() {

    const obj = {
      headingObj: {
        reverseCharge: 'test',
        transportationMode: 'trans',
        invoiceNo: '100'
      },
      vAddress: {
        name: 'w323we',
        address: 'w323we',
        address1: 'w323we',
        city: 'w323we',
        stateName: 'w323we',
        pin: 'w323we',
        gstno: '234234234',
      },
      pAddress: {
        name: 'w323we',
        address: 'w323we',
        address1: 'w323we',
        city: 'w323we',
        stateName: 'w323we',
        pin: 'w323we',
        gstno: '234234234',
      },
      detailArray: []
    };
    this.invoicePrintData = obj;

    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('invoicePrintData').innerHTML;
      w.document.body.innerHTML = html;
      this.invoicePrintData = null;
      w.print();
    }, 1000);
  }

  convertNumberToWords(data) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    var amount = data.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    var value: any = "";

    if (n_length <= 9) {
      var n_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

}
