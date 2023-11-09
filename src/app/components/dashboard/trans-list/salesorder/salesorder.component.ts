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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SalesorderComponent {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  // form control
  formData: FormGroup;
  formData1: FormGroup;
  companyList = [];
  tableData: any[] = [];

  fileList: any;

  // header props
  customerList = [];
  taxCodeList = [];
  materialList = [];
  profitCenterList = [];

  routeEdit = '';
  // url: string;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private datepipe: DatePipe
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCustomerList();
  }


  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, Validators.required],
      companyName: [null],
      saleOrderNo: [0],
      materialCode: [''],
      customerCode: ['', Validators.required],
      supplierName: [''],
      orderDate: [null],
      profitCenter: ['', Validators.required],
      profitcenterName: [''],
      poNumber: ['', Validators.required],
      poDate: [null],
      gstNo: [null],
      dateofSupply: [null],
      placeofSupply: [null],
      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [0],
      documentURL: [''],
    });


    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      taxCode: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      discount: [''],
      sgst: [''],
      id: [0],
      igst: [''],
      cgst: [''],
      amount: [''],
      total: [''],
      netWeight: [''],
      deliveryDate: [''],
      stockQty: [0],
      materialName: [''],
      documentURL: [''],
      action: 'editDelete',
      index: 0
    });
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete',
      id: 0
    });
  }

  companyChange() {
    const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
    this.formData.patchValue({
      companyName: obj.text
    })
  }

  profitChange() {
    const obj = this.profitCenterList.find((c: any) => c.id == this.formData.value.profitCenter);
    this.formData.patchValue({
      profitcenterName: obj.text
    })
  }

  customerChange() {
    const obj = this.customerList.find((c: any) => c.id == this.formData.value.customerCode);
    this.formData.patchValue({
      supplierName: obj.text,
      gstNo: obj.gstNo
    })
  }


  emitTypeAheadValue(event: any) {

  }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.dataChange();
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode)
    if (this.formData1.value.index == 0 && !obj) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [...data, this.formData1.value];
    } else {
      if (this.formData1.value.index == 0) {
        data.forEach((res: any) => { if (res.materialCode == this.formData1.value.materialCode) { (res.qty = res.qty + this.formData1.value.qty) } });
      } else {
        data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
      }
    }
    setTimeout(() => {
      this.tableData = data;
      this.calculate();
    });
    this.resetForm();
  }

  dataChange() {
    const formObj = this.formData1.value
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const igst = obj.igst ? ((+formObj.qty * +formObj.rate) * obj.igst) / 100 : 0;
    const cgst = obj.cgst ? ((+formObj.qty * +formObj.rate) * obj.cgst) / 100 : 0;
    const sgst = obj.sgst ? ((+formObj.qty * +formObj.rate) * obj.sgst) / 100 : 0;
    this.formData1.patchValue({
      amount: (+formObj.qty * +formObj.rate),
      total: (+formObj.qty * +formObj.rate) + (igst + sgst + cgst),
      igst: igst,
      cgst: cgst,
      sgst: sgst,
    })
  }


  materialChange() {
    const obj = this.materialList.some((m: any) => m.id == this.formData1.value.materialCode);
    if (!obj) {
      this.alertService.openSnackBar('Please enter valid material code', Static.Close, SnackBar.error);
      this.formData1.patchValue({
        materialCode: ''
      })
    }
  }

  calculate() {
    this.formData.patchValue({
      igst: 0,
      cgst: 0,
      sgst: 0,
      amount: 0,
      totalTax: 0,
      totalAmount: 0,
    })
    this.tableData && this.tableData.forEach((t: any) => {
      this.formData.patchValue({
        igst: ((+this.formData.value.igst) + t.igst).toFixed(2),
        cgst: ((+this.formData.value.cgst) + t.cgst).toFixed(2),
        sgst: ((+this.formData.value.sgst) + t.sgst).toFixed(2),
        amount: ((+this.formData.value.amount) + (t.qty * t.rate)).toFixed(2),
        totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
      })
    })
    this.formData.patchValue({
      totalAmount: (+this.formData.value.amount) + (+this.formData.value.totalTax),
    })
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
      this.calculate();
    } else {
      this.formData1.patchValue(value.item);
    }
  }

  // profitCenterChange() {
  //   this.formData.patchValue({
  //     saleOrderNo: ''
  //   })
  //   const costCenUrl = String.Join('/', this.apiConfigService.getSaleOrderNumber, this.formData.value.profitCenter);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.formData.patchValue({
  //               saleOrderNo: res.response['SaleOrderNumber']
  //             })
  //           }
  //         }
  //       });
  // }

  onSearchChange() {
    this.formData1.value.materialCode;

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
          this.getCompanyList();

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

          this.getProfitcenterData();
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

          this.getTaxRatesList()
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
              const data = resp.length && resp.filter((t: any) => t.taxType == 'Output');
              this.taxCodeList = data;
            }
          }
          this.getmaterialData();
        });
  }

  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
              if (this.routeEdit != '') {
                this.getSaleOrderDetail();
              }
            }
          }
        });
  }


  getSaleOrderDetail() {
    const qsDetUrl = String.Join('/', this.apiConfigService.getSaleOrderDetail, this.routeEdit);
    this.apiService.apiGetRequest(qsDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['SaleOrderMasters']);
              // if (this.formData.value.documentURL) {
              //   this.downLoad();
              // }
              // this.formData.disable();
              res.response['SaleOrderDetails'].forEach((s: any, index: number) => {
                const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                s.materialName = obj.text
                s.stockQty = obj.closingQty;
                s.documentURL = s.documentURL ? s.documentURL : '',
                  s.action = 'editDelete'; s.index = index + 1;
              })
              this.tableData = res.response['SaleOrderDetails'];
            }
          }
        });
  }


  downLoadFile(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.item[event.action]);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  materialCodeChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      netWeight: obj.netWeight,
      stockQty: obj.closingQty,
      materialName: obj.text
    })
    if (!obj.netWeight) {
      this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
    }

  }

  emitFilesList(event: any) {
    this.fileList = event[0];
  }


  uploadFile() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList ? this.fileList.name.split('.')[0] : '');
    const formData = new FormData();
    formData.append("file", this.fileList);

    return this.httpClient.post<any>(addsq, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
        this.router.navigate(['/dashboard/transaction/saleorder'])
      });
  }


  back() {
    this.router.navigate(['dashboard/transaction/saleorder'])
  }

  save() {
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
    // this.uploadFile();
    this.addSaleOrder();
  }

  addSaleOrder() {
    const addsq = String.Join('/', this.apiConfigService.addSaleOrder);
    const obj = this.formData.value;
    obj.orderDate = obj.orderDate ? this.datepipe.transform(obj.orderDate, 'MM-dd-yyyy') : '';
    obj.poDate = obj.poDate ? this.datepipe.transform(obj.poDate, 'MM-dd-yyyy') : '';
    obj.dateofSupply = obj.dateofSupply ? this.datepipe.transform(obj.dateofSupply, 'MM-dd-yyyy') : '';
    obj.documentURL = this.fileList ? this.fileList.name.split('.')[0] : '';
    const arr = this.tableData;
    arr.forEach((a: any) => {
      a.deliveryDate = a.deliveryDate ? this.datepipe.transform(a.deliveryDate, 'MM-dd-yyyy') : '';
      a.documentURL = a.documentURL ? a.documentURL : (this.fileList ? this.fileList.name.split('.')[0] : '');
    })
    const requestObj = { qsHdr: this.formData.value, qsDtl: arr };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.uploadFile();
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
      });
  }

  // downLoad() {
  //   const url = String.Join('/', this.apiConfigService.getFile, this.formData.get('documentURL').value);
  //   this.apiService.apiGetRequest(url)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         this.url = response.response;
  //       });
  // }

  reset() {
    this.tableData = [];
    this.formData.reset();
  }


}
