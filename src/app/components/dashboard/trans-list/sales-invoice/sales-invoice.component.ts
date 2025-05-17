import { Component, OnInit, ViewChild, ViewRef } from '@angular/core';
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
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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

  getInvoiceDeatilData: any;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  invoicePrintData: any;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'saleOrderNo',
    textField: 'saleOrderNo',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  bpaList: any;


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
      invoiceDate: ['', Validators.required],
      customerCode: [''],
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
      transportCharges:[0],
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
      changed: false,
      cgst: [''],
      sgst: [''],
      igstCode: [''],
      cgstCode: [''],
      sgstCode: [''],
      bomKey: [''],
      bomName: [''],
      hsnNo: [''],
      grossAmount: [''],
      transportCharges:[''],
      taxStructureId: [''],
      checkbox: [''],
      hideCheckbox: [''],
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
    let obj = JSON.parse(localStorage.getItem("user"));
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderData, obj.companyCode);
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
    let obj = JSON.parse(localStorage.getItem("user"));
    const costCenUrl = String.Join('/', this.apiConfigService.getCustomerList, obj.companyCode);
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
    const getpcUrl = String.Join('/', this.apiConfigService.getProfitCentersList);
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
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getsaleOrdernoListe, this.formData.value.saleOrderNo[0].saleOrderNo);
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

onFocusOutEvent(event: any) {
  this.calculate();
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
                customerCode: res.response.bpaList.name,
                customerName: res.response.bpaList.bpnumber,
                customerGstin: res.response.bpaList.gstno,
              })
            }
          }
        });
  }

  getInspectionCheckDetailbySaleorder() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getInspectionCheckDetailbySaleorder, this.formData.value.saleOrderNo[0].saleOrderNo);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tableComponent.defaultValues();             
              res.response['icDetail'].forEach((i: any) => {
                const master = res.response['icmasters'];
                
                let obj: any = this.materialCodeList;
                if (this.materialCodeList.find((m: any) => m.mainComponent == 'Y')) {
                  if(master.company=='1000')
                  {
                  obj = this.materialCodeList.find((m: any) => m.bomKey == i.materialCode && m.mainComponent == 'Y');
                  }
                else
                {
                   obj= this.materialCodeList.find((m: any) => m.materialCode == i.materialCode && m.mainComponent == 'Y');
                }
                if (!this.commonService.checkNullOrUndefined(obj)) {
                const objT = this.taxCodeList.find((tax: any) => tax.taxRateCode == obj.taxCode);
                const igst = (objT && objT.igst) ? (obj.rate * objT.igst) / 100 : 0;
                const cgst = (objT && objT.cgst) ? (obj.rate * objT.cgst) / 100 : 0;
                const sgst = (objT && objT.sgst) ? (obj.rate * objT.sgst) / 100 : 0;
                i.igst = igst;
                i.cgst = cgst;
                i.sgst = sgst;
                i.igstCode = (objT && objT.igst) || 0;
                i.cgstCode = (objT && objT.cgst) || 0;
                i.sgstCode = (objT && objT.sgst) || 0;
                i.grossAmount = obj.rate;
                i.tagName = i.productionTag;
                i.saleorder = i.saleOrderNumber;
                i.materialCode = i.materialCode;
                i.materialName = i.materialName;
                i.hsnNo = i.hsnNo;
                i.inspectionCheckNo = i.inspectionCheckNo;
                i.rate = obj.rate;
                i.qty = 1;
                i.changed = false;
                i.hideCheckbox = i.status == "Invoice Generated";
                i.taxStructureId = obj.taxCode;
                i.totalTax = (igst + sgst + cgst);
                i.totalAmount = (obj.rate + obj.transportCharges) + (igst + sgst + cgst)
                i.checkbox = false
                const data = res.response['icDetail'];
                // if(master.company=='2000')
                // {
                // this.tableData = data.filter((t: any) => t.materialCode == obj.materialCode);
                // }
                // else
                // {
                //   this.tableData = data;
                // }
                this.tableData = data;
              if (this.tableData.length > 0) {
                this.tableData[0].checkbox = true;
              }

              this.calculate();
                }
              }
              });
              // this.tableData = res.response['icDetail'];
              // if (this.tableData.length > 0) {
              //   this.tableData[0].checkbox = true;
              // }

              // this.calculate();
           
            }
          }          
        });
  }

  tableCheckboxEvent(event: any) {
    
    this.tableData.forEach((res: any) => res.checkbox = (res.id == event.item.invoiceDetailId) ? event.flag.checked : res.checkbox);
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
    transpTax: 0,
  });

  let totalIGST = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalAmount = 0;
  let totalTax = 0;

  let selectedRow: any = null;

  this.tableData && this.tableData.forEach((t: any) => {
    if (t.checkbox) {
      totalIGST += t.igst;
      totalCGST += t.cgst;
      totalSGST += t.sgst;
      totalAmount += t.grossAmount;
      totalTax += t.igst + t.cgst + t.sgst;

      if (!selectedRow) {
        selectedRow = t; // Use first selected row to get transport GST codes
      }
    }
  });

   // Helper to get value ignoring case
  function getCaseInsensitiveValue(obj: any, key: string): number {
    if (!obj) return 0;
    const keys = Object.keys(obj);
    const foundKey = keys.find(k => k.toLowerCase() === key.toLowerCase());
    return foundKey ? +obj[foundKey] : 0;
  }

  // Handle transport charges
  const transportCharges = +this.formData.value.transportCharges || 0;
  let transpIGST = 0;
  let transpCGST = 0;
  let transpSGST = 0;

  if (selectedRow) {
    const igstCode = getCaseInsensitiveValue(selectedRow, 'igstCode');
    const cgstCode = getCaseInsensitiveValue(selectedRow, 'cgstCode');
    const sgstCode = getCaseInsensitiveValue(selectedRow, 'sgstCode');
    // const igstCode = +selectedRow.igstcode || 0;
    // const cgstCode = +selectedRow.cgstcode || 0;
    // const sgstCode = +selectedRow.sgstcode || 0;

    transpIGST = +(transportCharges * (igstCode / 100));
    transpCGST = +(transportCharges * (cgstCode / 100));
    transpSGST = +(transportCharges * (sgstCode / 100));
  }

  const transpTax = transpIGST + transpCGST + transpSGST;

  // Update totals with transport charges and taxes
  totalIGST += transpIGST;
  totalCGST += transpCGST;
  totalSGST += transpSGST;
  totalAmount += transportCharges;
  totalTax += transpTax;

  const grandTotal = totalAmount + totalTax;

  // Patch updated totals back to form
  this.formData.patchValue({
    totalIGST: totalIGST.toFixed(2),
    totalCGST: totalCGST.toFixed(2),
    totalSGST: totalSGST.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    totalTax: totalTax.toFixed(2),
    transpTax: transpTax.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
  });
}


  // calculate() {
  //   this.formData.patchValue({
  //     totalIGST: 0,
  //     totalCGST: 0,
  //     totalSGST: 0,
  //     totalAmount: 0,
  //     totalTax: 0,
  //     grandTotal: 0,
  //     transpTax:0,
  //   })
  //   this.tableData && this.tableData.forEach((t: any) => {
  //     if (t.checkbox) {
  //       this.formData.patchValue({
  //         totalIGST: ((+this.formData.value.totalIGST) + t.igst).toFixed(2),
  //         totalCGST: ((+this.formData.value.totalCGST) + t.cgst).toFixed(2),
  //         totalSGST: ((+this.formData.value.totalSGST) + t.sgst).toFixed(2),
  //         totalAmount: ((+this.formData.value.totalAmount) + (t.grossAmount)).toFixed(2),
  //         totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
  //       })
  //     }
  //   })
  //   this.formData.patchValue({
  //     grandTotal: ((+this.formData.value.totalAmount) + (+this.formData.value.totalTax)).toFixed(2),
  //   })
  // }

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
              this.getInvoiceDeatilData = res.response;
              this.formData.patchValue(res.response['InvoiceMasterList']);
              this.formData.patchValue({
                profitCenter: res.response['InvoiceMasterList']['profitcenter']
              })
              let arr = [];
              res.response['invoiceDetailsList'].forEach((d: any, index: number) => {
                const obj = {
                  ...d,
                  materialCode: d.materialCode ? d.materialCode : '',
                  materialName: d.materialName ? d.materialName : '',
                  saleOrderNumber: d.saleorder ? d.saleorder : '',
                  productionTag: d.tagName ? d.tagName : '',
                  inspectionCheckNo: d.inspectionCheckNo ? d.inspectionCheckNo : '',
                  status: d.status ? d.status : '',
                  checkbox: true
                }
                arr.push(obj)
              })
              this.tableData = arr;
              this.materialCodeChange();
              this.calculate();
              this.getBusienessPartnerAccounts(res.response.InvoiceMasterList);
              this.formData.disable();
            }
          }
        });
  }

  getBusienessPartnerAccounts(data: any) {
    
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getBusienessPartnerAccount, data.customerName);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpaList = res.response.bpaList;
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
      highlight: true,
      changed: true
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
    if (this.tableData.length == 0 || this.formData.invalid || !(this.tableData.some((t: any) => t.checkbox))) {
      return;
    }
    this.savegoodsreceipt();
  }

  savegoodsreceipt() {
    this.formData.enable();
    const arr = this.tableData.filter((d: any) => !d.type && d.checkbox);
    const registerInvoice = String.Join('/', this.apiConfigService.registerInvoice);
    const formData = this.formData.value;
    if (typeof formData.saleOrderNo != 'string') {
      formData.saleOrderNo = this.formData.value.saleOrderNo[0].saleOrderNo;
    }
    formData.invoiceDate = this.formData.get('invoiceDate').value ? this.datepipe.transform(this.formData.get('invoiceDate').value, 'yyyy-MM-dd') : '';
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
    this.tableComponent.defaultValues();   
  }

  invoicePrint() {
    
    const totalObj = {
      qty: 0,
      grossAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    };
    let list = [];
    this.getInvoiceDeatilData.invoiceDetailsList.forEach((data: any) => {

      totalObj.qty = totalObj.qty + data.qty,
        totalObj.grossAmount = totalObj.grossAmount + data.grossAmount,
        totalObj.cgst = totalObj.cgst + data.cgst,
        totalObj.sgst = totalObj.sgst + data.sgst,
        totalObj.igst = totalObj.igst + data.igst,
        totalObj.total = totalObj.total + (data.grossAmount + data.cgst + data.sgst + data.igst)

      const index = list.findIndex((l: any) => l.materialCode == data.materialCode);
      if (index != -1) {
        list[index].qty = list[index].qty + 1;
        list[index].grossAmount = list[index].qty * list[index].rate
      } else {
        list.push({ ...data });
      }
    })


    // let list = [...this.getInvoiceDeatilData.invoiceDetailsList];
    // list = [...list, ...this.setArray(list.length)];

    const obj = {
      headingObj: {
        reverseCharge: '',
        transportationMode: '',
        invoiceNo: this.getInvoiceDeatilData?.InvoiceMasterList?.invoiceNo || '',
        poNo: this.getInvoiceDeatilData?.InvoiceMasterList?.poNo,
        vehicleRegNo: this.getInvoiceDeatilData?.InvoiceMasterList?.vehicleRegNo || '',
        invoiceDate: this.getInvoiceDeatilData?.InvoiceMasterList?.invoiceDate || '',
        poDate: this.getInvoiceDeatilData?.InvoiceMasterList?.poDate || '',
        dateOfSupply: this.getInvoiceDeatilData?.InvoiceMasterList?.dateOfSupply || '',
        shiptoState: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoState || '',
        shiptoCity: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoCity || '',
        ...this.formData.value
      },
      vAddress: {
        custName: this.bpaList?.name || '',
        address: this.bpaList?.address || '',
        address1: this.bpaList?.address1 || '',
        city: this.bpaList?.city || '',
        stateName: this.bpaList?.stateName || '',
        pin: this.bpaList?.shiptoZip || '',
        gstno: this.bpaList?.gstno || '',
      },
      pAddress: {
        custName: this.getInvoiceDeatilData?.InvoiceMasterList?.custName || '',
        address: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoAddress1 || '',
        address1: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoAddress2 || '',
        city: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoCity || '',
        stateName: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoState || '',
        pin: this.getInvoiceDeatilData?.InvoiceMasterList?.shiptoZip || '',
        gstno: this.getInvoiceDeatilData?.InvoiceMasterList?.customerGstin || '',
      },
      detailArray: list,
      totalObj: totalObj,
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

  setArray(length: number) {
    let newArr = [];
    if (length < 20) {
      for (let i = 0; i < (20 - length); i++) {
        newArr.push({})
      }
    }
    return newArr;
  }
  issavebuttonenabled(){
    return this.tableData.some(item=>item.checkbox)&& this.formData.valid;
  }



}
