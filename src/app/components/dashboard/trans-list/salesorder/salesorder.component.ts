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
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FileUploadComponent } from '../../../../reuse-components/file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-salesorder',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, NgMultiSelectDropDownModule, FileUploadComponent, TableComponent, TypeaheadModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SalesorderComponent {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };


  // form control
  formData: FormGroup;
  formData1: FormGroup;
  companyList = [];
  tableData: any[] = [];
  finalTableData: any[] = [];

  fileList: any;

  // header props
  customerList = [];
  taxCodeList = [];
  materialList = [];
  profitCenterList = [];
  qnoList = [];

  routeEdit = '';

  constructor(
    public commonService: CommonService,
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
      bom: [''],
      id: 0,
      customerCode: ['', Validators.required],
      supplierName: [''],
      // orderDate: [null],
      profitCenter: ['', Validators.required],
      profitcenterName: [''],
      poDate: [null],
      poNumber: ['', Validators.required],
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
      materialCode: [''],
      taxCode: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      discount: [''],
      saleOrderNo: [0],
      sgst: [''],
      id: [0],
      igst: [''],
      cgst: [''],
      amount: [''],
      total: [''],
      netWeight: [''],
      mainComponent: [''],
      billable: [''],
      poQty:[0],
      bomKey: [''],
      bomName: [''],
      deliveryDate: [''],
      stockQty: [0],
      totalTax: [0],
      hsnsac: [''],
      status: [''],
      materialName: [''],
      highlight: false,
      action: 'editDelete',
      index: 0
    });
    this.formData1.disable();
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete',
      id: 0
    });
    this.formData1.disable();
  }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true
    });
    this.dataChange();
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode)
    if (this.formData1.value.index == 0 && !obj) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
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
      this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
    });
    this.resetForm();
  }

  dataChange() {
    const formObj = this.formData1.value;
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const discountAmount = (((+formObj.qty * +formObj.rate) * ((+formObj.discount) / 100)));
    const amount = (+formObj.qty * +formObj.rate) - discountAmount
    const igst = obj.igst ? (amount * obj.igst) / 100 : 0;
    const cgst = obj.cgst ? (amount * obj.cgst) / 100 : 0;
    const sgst = obj.sgst ? (amount * obj.sgst) / 100 : 0;
    this.formData1.patchValue({
      amount: amount,
      totalTax: (igst + sgst + cgst),
      total: (amount) + (igst + sgst + cgst),
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

  calculate(flag = true) {
    this.formData.patchValue({
      igst: 0,
      cgst: 0,
      sgst: 0,
      amount: 0,
      totalTax: 0,
      totalAmount: 0,
    })
    this.tableData && this.tableData.forEach((t: any) => {

      if (t.mainComponent == 'N' && flag) {
        const obj = this.tableData.find((td: any) => td.bomKey == t.bomKey && td.mainComponent == 'Y');
        if (obj && obj.taxCode && !t.changed) {
          t.qty = obj.qty * (t.bomqty ? t.bomqty : t.qty);
          t.changed = true
        }
      }
      // if (t.taxCode) {
      //   // const formObj = t.mainComponent == 'N' ? this.tableData.find((td: any) => td.bomKey == t.bomKey && td.mainComponent == 'Y') : t;
      //   const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == t.taxCode);
      //   const discountAmount = (((+t.qty * +t.rate) * ((+t.discount) / 100)));
      //   const amount = (+t.qty * +t.rate) - discountAmount
      //   const igst = obj.igst ? (amount * obj.igst) / 100 : 0;
      //   const cgst = obj.cgst ? (amount * obj.cgst) / 100 : 0;
      //   const sgst = obj.sgst ? (amount * obj.sgst) / 100 : 0;
      //   // this.formData1.patchValue({
      //   t.amount = amount;
      //   t.totalTax = (igst + sgst + cgst);
      //   t.total = (amount) + (igst + sgst + cgst);
      //   t.igst = igst;
      //   t.cgst = cgst;
      //   t.sgst = sgst;
      //   //  })
      // }


      this.formData.patchValue({
        igst: ((+this.formData.value.igst) + t.igst).toFixed(2),
        cgst: ((+this.formData.value.cgst) + t.cgst).toFixed(2),
        sgst: ((+this.formData.value.sgst) + t.sgst).toFixed(2),
        amount: ((+this.formData.value.amount) + (t.amount)).toFixed(2),
        totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
      })
    })
    this.formData.patchValue({
      totalAmount: ((+this.formData.value.amount) + (+this.formData.value.totalTax)).toFixed(2),
    })
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
      this.calculate(false);
      this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
      this.formData1.disable();
    } else {
      this.formData1.patchValue(value.item);
      this.formData1.enable();
    }
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
          this.getCompanyList();
        });
  }

  customerCodeChange(event?: any) {
    const obj = this.customerList.find((c: any) => c.id == (event ? event.id : this.formData.value.customerCode));
    this.formData.patchValue({
      gstNo: obj ? obj.gstNo : ''
    })
    if (!event) {
      this.formData.patchValue({
        customerCode: [{ id: obj.id, text: obj.text }]
      })
    }
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
          this.getBOMList();
        });
  }

  getBOMList() {
    const companyUrl = String.Join('/', this.apiConfigService.getBOMList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.qnoList = res.response['BOMList'];
            }
          }
          this.getmaterialData();
        });
  }

  getBomDetail() {
    if (this.tableData.some((t: any) => t.bomKey == this.formData.value.bom)) {
      this.formData.patchValue({
        bom: ''
      })
      this.alertService.openSnackBar('Bom already selected...', Static.Close, SnackBar.error);
      return;
    }
    this.tableData = null;
    this.tableComponent.defaultValues();
    const companyUrl = String.Join('/', this.apiConfigService.getBomDetail, this.formData.value.bom);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              res.response['bomDetail'].forEach((s: any, index: number) => {
                // const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                // s.materialName = obj.text
                // s.stockQty = obj.availQTY
                // s.hsnsac = obj.hsnsac
                s.id = 0
                s.action = s?.billable == 'N' ? 'delete' : 'editDelete';
              })
              const tableData = [...this.finalTableData, ...res.response['bomDetail']];
              tableData.forEach((t: any, index: number) => t.index = index + 1);
              this.tableData = tableData;
              this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
              this.calculate(false);
            }
          }
          // this.getmaterialData();
        });
  }


  getmaterialData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getmaterialUrl = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.materialList = res.response['mmasterList'];
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

              res.response['SaleOrderDetails'].forEach((s: any, index: number) => {
                const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                s.materialName = obj?.text ? obj?.text : ''
                s.stockQty = obj?.availQTY ? obj?.availQTY : ''
                s.hsnsac = obj?.hsnsac ? obj?.hsnsac : ''
                s.action = s?.billable == 'N' ? 'delete' : 'editDelete';
                s.index = index + 1;
              })
              this.tableData = res.response['SaleOrderDetails'];
              this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
              this.customerCodeChange();
            }
          }
        });
  }


  downLoadFile(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.name);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
    this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
  }

  materialCodeChange() {

    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      netWeight: obj.netWeight,
      stockQty: obj.availQTY,
      materialName: obj.text,
      hsnsac: obj.hsnsac
    })
    if (!obj.netWeight) {
      this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
    }

  }

  materialCodehChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData.value.materialCode);
    if (obj && obj.bom)
      this.formData.patchValue({
        bom: obj.bom,
      })
    this.getBomDetail();
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
    this.addSaleOrder();
  }

  addSaleOrder() {
    const addsq = String.Join('/', this.apiConfigService.addSaleOrder);
    const obj = this.formData.value;
    // obj.orderDate = obj.orderDate ? this.datepipe.transform(obj.orderDate, 'MM-dd-yyyy') : '';
    obj.poDate = obj.poDate ? this.datepipe.transform(obj.poDate, 'MM-dd-yyyy') : '';
    obj.dateofSupply = obj.dateofSupply ? this.datepipe.transform(obj.dateofSupply, 'MM-dd-yyyy') : '';
    obj.documentURL = this.fileList ? this.fileList.name.split('.')[0] : '';
    obj.customerCode = this.formData.value.customerCode[0].id;
    const arr = this.tableData;
    arr.forEach((a: any) => {
      a.deliveryDate = a.deliveryDate ? this.datepipe.transform(a.deliveryDate, 'MM-dd-yyyy') : '';
      a.id = this.routeEdit ? a.id : 0
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

  downLoad(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, this.formData.get('documentURL').value);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.tableComponent.defaultValues();
    const companyField = document.getElementById('company');
    if (companyField) {
      companyField.focus();
    }
  }


}
