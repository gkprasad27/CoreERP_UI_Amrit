import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '../../../../reuse-components/file-upload/file-upload.component';

@Component({
  selector: 'app-jobworkmaterialissue',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NgMultiSelectDropDownModule, TypeaheadModule, NonEditableDatepicker, TableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, FileUploadComponent],
  templateUrl: './jobworkmaterialissue.component.html',
  styleUrls: ['./jobworkmaterialissue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})
export class JobworkmaterialissueComponent {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  data: any;

  date = new Date()
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

  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'saleOrderNo',
    textField: 'saleOrderNo',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  qnoList: any[] = [];

  // form control
  formData: FormGroup;
  formData1: FormGroup;
  companyList = [];
  tableData: any[] = [];
  bpaList: any[] = [];


  // header props
  customerList = [];
  taxCodeList = [];
  materialList = [];
  profitCenterList = [];

  routeEdit = '';
  http: any;


  fileList: any;
  fileList1: any;

  user: any;

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
    this.getSaleOrderList();
  }

  getSaleOrderList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderApprovedList, obj.companyCode);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.qnoList = res.response['BPList'];
            }
          }
        });
  }


  formDataGroup() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.formData = this.formBuilder.group({

      id: [0],
      jobWorkNumber: [0],

      company: [null, Validators.required],
      companyName: [null],

      profitCenter: ['', Validators.required],

      vendor: ['', Validators.required],
      vendorGSTN: [null],

      addWho: this.user.userName,
      editWho: this.user.userName,

      orderDate: [null],
      deliveryDate: [null],

      materialCode: [''],

      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [0],
      createdBy: [''],
      contactNo: [''],

      saleOrderType: ['Sale Order'],
      saleOrderNo: [null, this.user.companyCode !== '1000' ? Validators.required : null],

      documentURL: [''],
      invoiceURL: [''],
    });


    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      taxCode: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      discount: [0],
      sgst: [''],
      id: [0],
      igst: [''],
      cgst: [''],
      amount: [0],
      total: [0],
      weight: [0],
      deliveryDate: [''],
      stockQty: [0],
      totalTax: [0],
      materialName: [''],
      highlight: false,
      action: [[
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]],
      index: 0
    });
  }
  public mmasterListData: EventEmitter<any[]> = new EventEmitter<any[]>();

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

  emitFilesList(event: any) {
    this.fileList = event[0];
  }
  emitFilesList1(event: any) {
    this.fileList1 = event[0];
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
    });
    this.resetForm();
  }

  dataChange() {
    const formObj = this.formData1.value
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const discountAmount = (((+formObj.qty * +formObj.rate) * ((+formObj.discount) / 100)));
    const amount = (+formObj.qty * +formObj.rate * (+(formObj.weight ? formObj.weight : 1))) - discountAmount
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

  getSaleOrderDetail() {
    this.tableComponent.defaultValues();
    const url = this.apiConfigService.getSaleOrderDetailJO;
    const qsDetUrl = String.Join('/', url, this.formData.value.saleOrderNo[0].saleOrderNo);
    this.apiService.apiGetRequest(qsDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              let obj = { data: {}, data1: [] }
              if (this.formData.value.saleOrderType == 'Sale Order') {
                obj.data = res.response['SaleOrderMasters'];
                obj.data1 = res.response['SaleOrderDetails'];
                if (obj.data1 && obj.data1.length) {
                  let arr = [];
                  obj.data1.forEach((d: any) => {
                    if (arr.length) {
                      const index = arr.findIndex((a: any) => a.materialCode == d.materialCode);
                      if (index != -1) {
                        arr[index].qty = arr[index].qty + d.qty
                      } else {
                        arr.push(d);
                      }
                    } else {
                      arr.push(d);
                    }
                  })
                  obj.data1 = arr;
                }
              }
              obj['data1'].forEach((s: any, index: number) => {
                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ]
                s.id = 0;
                s.index = index + 1;
                s.poQty = s.poQty ? s.poQty : 0;
                s.soQty = s.qty ? s.qty : 0;
                s.qty = 0;
                s.rate = s.rate ? s.rate : 0;
                s.discount = s.discount ? s.discount : 0;
                s.cgst = s.cgst ? s.cgst : 0;
                s.sgst = s.sgst ? s.sgst : 0;
                s.changed = false;
                s.igst = s.igst ? s.igst : 0;
                s.taxCode = s.taxCode ? s.taxCode : '';
                s.hsnsac = s.hsnsac ? s.hsnsac : '';
                s.availableQTY = s.availableQTY ? s.availableQTY : '';
                s.amount = s.amount ? s.amount : 0;
                s.total = s.total ? s.total : 0;
                s.supplierCode = s.supplierCode ? s.supplierCode : '';
              })
              this.tableData = obj['data1'];
            }
          }
        });
  }


  materialChange() {
    this.materialList = [];
    this.mmasterListData.emit([]);
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let obj = JSON.parse(localStorage.getItem("user"));
    const voucherClassList = String.Join('/', this.apiConfigService.getMaterialList, obj.companyCode, this.formData1.value.materialCode);
    this.apiService.apiGetRequest(voucherClassList)
      .subscribe(((response: any) => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.materialList = res.response['mmasterList'];
            this.mmasterListData.emit(res.response['mmasterList']);
          }
        }
      })
      )
    // const obj = this.materialList.some((m: any) => m.id == this.formData1.value.materialCode);
    // if (!obj) {
    //   this.alertService.openSnackBar('Please enter valid material code', Static.Close, SnackBar.error);
    //   this.formData1.patchValue({
    //     materialCode: ''
    //   })
    // }
  }

  calculate(flag = false) {
    this.formData.patchValue({
      igst: 0,
      cgst: 0,
      sgst: 0,
      amount: 0,
      totalTax: 0,
      totalAmount: 0,
    })
    this.tableData && this.tableData.forEach((t: any) => {
      if (t.highlight || flag) {
        this.formData.patchValue({
          igst: ((+this.formData.value.igst) + t.igst).toFixed(2),
          cgst: ((+this.formData.value.cgst) + t.cgst).toFixed(2),
          sgst: ((+this.formData.value.sgst) + t.sgst).toFixed(2),
          amount: ((+this.formData.value.amount) + (t.qty * t.rate * (t.weight || 1))).toFixed(2),
          totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
        })
      }
    })
    this.formData.patchValue({
      totalAmount: ((+this.formData.value.amount) + (+this.formData.value.totalTax)).toFixed(2),
    })
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.deleteRecord(value);
    } else {
      this.formData1.patchValue(value.item);
    }
  }


  deleteRecord(value) {
    const obj = {
      item: {
        materialCode: value.item.materialCode
      },
      primary: 'materialCode'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const jvDetUrl = String.Join('/', this.apiConfigService.deletePurchaseOrder, value.item.id);
        this.apiService.apiDeleteRequest(jvDetUrl)
          .subscribe(
            response => {
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.tableComponent.defaultValues();
                  this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
                  this.calculate();
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    })
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
              const data = resp.length && resp.filter((t: any) => t.bptype == 'Vendor' && t.bpgroup == "Jobwork Vendors");
              this.customerList = data;
            }
          }
          this.getCompanyList();
        });
  }

  vendorChange(event?: any) {
    const obj = this.customerList.find((c: any) => c.id == (event ? event.id : this.formData.value.vendor));
    this.formData.patchValue({
      vendorGSTN: obj ? obj.gstNo : ''
    })
    if (!event) {
      this.formData.patchValue({
        vendor: [{ id: obj.id, text: obj.text }]
      })
    }
  }

  getCompanyList() {
    const companyUrl = String.Join('/', this.apiConfigService.getCompanysList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.getsuppliercodeList();
        });
  }

  getsuppliercodeList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getsuppliercodeList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList, obj.companyCode);
    this.apiService.apiGetRequest(getsuppliercodeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpaList'];
              const data = resp.length && resp.filter((t: any) => t.bpTypeName == 'Vendor');
              this.bpaList = data;
            }
          }
          this.getProfitcenterData();
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
          this.getTaxRatesList()
        });
  }

  getTaxRatesList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['TaxratesList'];
              const data = resp.length && resp.filter((t: any) => t.taxType == 'Output');
              this.taxCodeList = data;
            }
          }
          if (this.routeEdit != '') {
            this.getJobworkDetail();
          }
        });
  }

  // getmaterialData() {
  //   const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
  //   this.apiService.apiGetRequest(getmaterialUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.materialList = res.response['materialList'];
  //             if (this.routeEdit != '') {
  //               this.getJobworkDetail();
  //             }
  //           }
  //         }
  //       });
  // }

  getJobworkDetail() {
    const qsDetUrl = String.Join('/', this.apiConfigService.getJobworkDetail, this.routeEdit);
    this.apiService.apiGetRequest(qsDetUrl).subscribe(response => {
      this.spinner.hide();
      const res = response;
      if (res && res.status === StatusCodes.pass && res.response) {
        this.formData.patchValue(res.response['JobWorkMasters']);

        if (res.response['JobWorkDetails'] && res.response['JobWorkDetails'].length) {
          let taxCode = res.response['JobWorkDetails'][0].taxCode;
          const taxObj = this.taxCodeList.find((t: any) => t.taxRateCode == taxCode);
          if (taxObj) {
            this.formData1.patchValue({
              taxCode: taxObj.igst ? taxObj.igst : taxObj.sgst
            });
          }

          res.response['JobWorkDetails'].forEach((detail: any, index: number) => {
            const materialObj = this.materialList.find((m: any) => m.id == detail.materialCode);
            if (materialObj) {
              detail.materialName = materialObj.text;
              detail.stockQty = materialObj.availQTY;
              detail.materialCode = { materialCode: materialObj.id, materialName: materialObj.text };
            }
            detail.action = [
              { id: 'Edit', type: 'edit' },
              { id: 'Delete', type: 'delete' }
            ],
              detail.index = index + 1;
          });

          this.tableData = res.response['JobWorkDetails'];
          this.calculate(true);
          this.vendorChange();
        }
      }
    });
  }


  // getJobworkDetail() {
  //   const qsDetUrl = String.Join('/', this.apiConfigService.getJobworkDetail, this.routeEdit);
  //   this.apiService.apiGetRequest(qsDetUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.formData.patchValue(res.response['JobWorkMasters']);

  //             if (res.response['JobWorkDetails'] && res.response['JobWorkDetails'].length) {
  //               let str = res.response['JobWorkDetails'][0].taxCode;
  //               // str = str.split('-')[0].substring(1, 3)
  //               const obj = this.taxCodeList.find((t: any) => t.taxRateCode == str);
  //               this.formData1.patchValue({
  //                 taxCode: obj.igst ? obj.igst : obj.sgst
  //               })
  //             }

  //             res.response['JobWorkDetails'].forEach((s: any, index: number) => {
  //               const obj = this.materialList.find((m: any) => m.id == s.materialCode);
  //               s.materialName = obj.text
  //               s.stockQty = obj.availQTY
  //               s.action = [
  //   { id: 'Edit', type: 'edit' },
  //   { id: 'Delete', type: 'delete' }
  // ],
  //                s.index = index + 1;
  //             })
  //             this.tableData = res.response['JobWorkDetails'];
  //             this.calculate();
  //             this.vendorChange();
  //           }
  //         }
  //       });
  // }


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
  }

  materialCodeChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      weight: obj.netWeight,
      stockQty: obj.availQTY,
      materialName: obj.text,

    })
    if (!obj.netWeight) {
      this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
    }

  }



  back() {
    this.router.navigate(['dashboard/transaction/jobworkmaterialissue'])
  }

  save() {
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
    this.addJobWork();
  }

  addJobWork() {
    const addsq = String.Join('/', this.apiConfigService.addJobWork);
    const obj = this.formData.value;
    obj.orderDate = obj.orderDate ? this.datepipe.transform(obj.orderDate, 'MM-dd-yyyy') : '';
    obj.deliveryDate = obj.deliveryDate ? this.datepipe.transform(obj.deliveryDate, 'MM-dd-yyyy') : '';
    obj.vendor = this.formData.value.vendor[0].id;
    obj.documentURL = this.fileList ? this.fileList.name.split('.')[0] : '';
    obj.invoiceURL = this.fileList1 ? this.fileList1.name.split('.')[0] : '';
    const arr = this.tableData.filter((t: any) => t.highlight);
    arr.forEach((a: any) => {
      a.deliveryDate = a.deliveryDate ? this.datepipe.transform(a.deliveryDate, 'MM-dd-yyyy') : '';
    })
    const requestObj = { qsHdr: this.formData.value, qsDtl: arr };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (this.fileList) {
              this.uploadFile();
            } else {
              this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
              this.back();
            }
          }
        }
      });
  }

  uploadFile() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList.name.split('.')[0]);
    const formData = new FormData();
    formData.append("file", this.fileList);

    return this.httpClient.post<any>(addsq, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const res = response;
        if (this.fileList1) {
          this.uploadFile1();
        } else {
          this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          this.back();
        }
      });
  }

  uploadFile1() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList1.name.split('.')[0]);
    const formData = new FormData();
    formData.append("file", this.fileList1);

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
            this.back();
          }
        }
      });
  }

  print() {
    let formObj = this.formData.value;
    if (this.companyList.length) {
      const cObj = this.companyList.find((c: any) => c.companyCode == formObj.company);
      formObj['address'] = {
        companyName: cObj.companyName,
        address: cObj.address,
        address1: cObj.address1,
        city: cObj.city,
        stateName: cObj.stateName,
        pin: cObj.pin,
        phone: cObj.phone,
        email: cObj.email,
      }
    }
    if (this.bpaList.length) {
      const str = (this.formData.value.vendor && this.formData.value.vendor) ? this.formData.value.vendor[0].id : ''
      const bpaObj = this.bpaList.find((c: any) => c.bpnumber == str);
      formObj['vAddress'] = {
        name: bpaObj.name,
        address: bpaObj.address,
        address1: bpaObj.address1,
        city: bpaObj.city,
        stateName: bpaObj.stateName,
        pin: bpaObj.pin,
        phone: bpaObj.phone,
        email: bpaObj.email,
        gstno: bpaObj.gstno,
      }
    }
    if (this.profitCenterList.length) {
      const cObj = this.profitCenterList.find((c: any) => c.code == formObj.profitCenter);
      formObj['pAddress'] = {
        name: cObj.name,
        address: cObj.address1,
        address1: cObj.address2,
        city: cObj.city,
        stateName: cObj.stateName,
        pin: cObj.pin,
        phone: cObj.phone,
        email: cObj.email,
        gstno: cObj.gstNo,
      }
    }
    let list = [...this.tableData];
    list = [...list, ...this.setArray(list.length)];
    const obj = {
      heading: 'Job Work Material Issue',
      headingObj: formObj,
      detailArray: list,
      headingObj1: { ...this.formData1.value, ...this.formData.value }
    }

    this.data = obj;

    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('printData').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 1000);

  }

  setArray(length: number) {
    let newArr = [];
    if (length < 10) {
      for (let i = 0; i < (10 - length); i++) {
        newArr.push({})
      }
    }
    return newArr;
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
  }




}
