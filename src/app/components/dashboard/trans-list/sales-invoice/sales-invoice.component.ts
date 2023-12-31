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
  getsaleOrdernoData: any[] = [];
  customerList: any[] = [];
  profitCenterList: any[] = [];
  companyList: any[] = [];

  routeEdit = '';

  tableData = [];

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


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
    this.getsaleOrdernoList();
    this.getCustomerList();
    this.getProfitcenterData();
    this.getCompanyList();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({

      company: ['', [Validators.required]],
      profitCenter: ['', Validators.required],
      manualInvoiceNo: ['', Validators.required],
      invoiceMasterId: [''],
      invoiceDate: [''],
      customerName: [''],
      customerGstin: [''],
      mobile: [''],
      id: [0]
    });

    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      materialName: [''],
      netWeight: [''],
      qty: [''],
      highlight: false,
      type: [''],
      action: 'editDelete',
      index: 0
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

  getsaleOrdernoList() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getsaleOrdernoList);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getsaleOrdernoData = res.response['saleordernoList'];
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
              debugger
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

  ponoselect() {
    let data = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('manualInvoiceNo').value)) {
      data = this.getsaleOrdernoData.filter(resp => resp.id == this.formData.get('manualInvoiceNo').value);
    }
    this.formData1.patchValue({
      qty: '',
      netWeight: '',
      materialCode: '',
    })
    this.tableData = null;
    this.materialCodeList = data;
  }

  saveForm() {
    debugger
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
    const obj = this.materialCodeList.find((p: any) => p.id == this.formData1.value.materialCode);
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


}
