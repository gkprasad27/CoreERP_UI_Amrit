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

@Component({
  selector: 'app-quotationsupplier',
  templateUrl: './quotationsupplier.component.html',
  styleUrls: ['./quotationsupplier.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class QuotationSupplierComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  // form control
  formData: FormGroup;
  formData1: FormGroup;
  sendDynTableData: any;

  // header props
  companyList = [];
  plantList = [];
  deptList = [];
  branchList = [];
  costcenterList = [];
  profitCenterList = [];
  projectNameList = [];
  wbsList = [];
  taxCodeList = [];

  tableData = [];
  // dynTableProps: any;
  routeEdit = '';
  costunitList: any;
  materialList: any;
  UomList: any;
  ptypeList: any;

  constructor(
    private commonService: CommonService,
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
  }

  // tablePropsFunc() {
  //   return {
  //     tableData: {
  //       itemCode: {
  //         value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
  //       },
  //       description: {
  //         value: null, type: 'text', width: 100, maxLength: 50
  //       },
  //       qty: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },
  //       price: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },

  //       unit: {
  //         value: null, type: 'dropdown', list: this.UomList, id: 'id', text: 'text', displayMul: true, width: 100
  //       },
  //       discount: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },
  //       discountAmount: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },
  //       tax: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },
  //       delete: {
  //         type: 'delete', width: 10
  //       }
  //     },

  //     formControl: {
  //       tax: [null, [Validators.required]],
  //     }
  //   };
  // }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      plant: [null],
      branch: [null],
      profitCenter: [null,[Validators.required]],
      quotationNumber: [null],
      quotationDate: [null,[Validators.required]],
      supplierQuoteDate: [null],
      supplier: [null,[Validators.required]],
      deliveryPeriod: [null],
      creditDays: [null],
      deliveryMethod: [null],
      advance: [null],
      transportMethod: [null],

      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [0],
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
      // stockQty: [0],
      materialName: [''],
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

  materialCodeChange() {
    debugger
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      netWeight: obj.netWeight,
      // stockQty: obj.closingQty,
      materialName: obj.text
    })
    if (!obj.netWeight) {
      this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
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
          this.getmaterialData();
        });
  }
  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
            }
          }
          this.getTaxRatesList();
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
          this.getCustomerList();
        });
  }

  getCustomerList() {
    const getcurrencyList = String.Join('/', this.apiConfigService.getCustomerList);
    this.apiService.apiGetRequest(getcurrencyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // this.ptypeList = res.response['bpList'];
              this.ptypeList = res.response['bpList'].filter(resp => resp.bptype == 'Customer')
            }
          }
          this.getProfitcenterData();
        });
  }
  // getplantList() {
  //   const getplantList = String.Join('/', this.apiConfigService.getplantList);
  //   this.apiService.apiGetRequest(getplantList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.plantList = res.response['plantList'];
  //           }
  //         }
  //         this.getuomList();
  //       });
  // }


  // getuomList() {
  //   const getsecondelementUrl = String.Join('/', this.apiConfigService.getuomList);
  //   this.apiService.apiGetRequest(getsecondelementUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;

  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.UomList = res.response['UOMList'];
  //           }
  //         }
  //         this.getBranchList();
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
  //         this.getProfitcenterData();
  //       });
  // }


  getProfitcenterData() {
    const getpcUrl = String.Join('/', this.apiConfigService.getProfitCenterList);
    this.apiService.apiGetRequest(getpcUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }

          if (this.routeEdit != '') {
            this.getQuotationSuppliersDetails(this.routeEdit);
          }
        });
  }

  // getWbsList() {
  //   const segUrl = String.Join('/', this.apiConfigService.getwbselement);
  //   this.apiService.apiGetRequest(segUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.wbsList = res.response['wbsList'];
  //           }
  //         }
  //         // this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getQuotationSuppliersDetails(this.routeEdit);
  //         }
  //       });
  // }

  getQuotationSuppliersDetails(val) {
    const qsDetUrl = String.Join('/', this.apiConfigService.getsupplierqsDetail, val);
    this.apiService.apiGetRequest(qsDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['qsmasters']);
              //console.log(res.response['qsDetail']);
              // this.sendDynTableData = { type: 'edit', data: res.response['qsDetail'] };
              res.response['qsDetail'].forEach((s: any, index: number) => {
                const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                s.materialName = obj.text
                // s.stockQty = obj.closingQty;
                s.action = 'editDelete'; s.index = index + 1;
              })
              this.tableData = res.response['qsDetail'];
              this.calculate();
              this.formData.disable();
            }
          }
        });
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
    // this.calculateAmount(data);
  }


  back() {
    this.router.navigate(['dashboard/transaction/supplierquotation'])
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.savesupplierquotation();
  }

  savesupplierquotation() {
    const addsq = String.Join('/', this.apiConfigService.addsupplierqs);
    const requestObj = { qsHdr: this.formData.value, qsDtl: this.tableData };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
          this.router.navigate(['/dashboard/transaction/supplierquotation'])

          // this.reset();
          this.spinner.hide();
        }
      });
  }

  convertToSaleOrder() {
    const addsq = String.Join('/', this.apiConfigService.addSaleOrder);
    const obj = this.formData.value;
    obj.PONumber = this.formData.value.quotationNumber;
    this.tableData.forEach((t: any) => t.id = 0);
    // obj.orderDate = obj.orderDate ? this.datepipe.transform(obj.orderDate, 'MM-dd-yyyy') : '';
    // obj.poDate = obj.poDate ? this.datepipe.transform(obj.poDate, 'MM-dd-yyyy') : '';
    // obj.dateofSupply = obj.dateofSupply ? this.datepipe.transform(obj.dateofSupply, 'MM-dd-yyyy') : '';
    // obj.documentURL = obj.saleOrderNo;
    const requestObj = { qsHdr: obj, qsDtl: this.tableData };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            // this.uploadFile();
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
      });
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnsupplierqs, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    //this.formData.controls['voucherNumber'].disable();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

}
