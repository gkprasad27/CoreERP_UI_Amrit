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
  mpatternList = [];

  quotationSupplier: any;
  finalTableData: any[] = [];
  qnoList = [];

  constructor(
    public commonService: CommonService,
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
    this.getModelPatternList();
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


  getModelPatternList() {
    const getmpList = String.Join('/', this.apiConfigService.getModelPatternList);
    this.apiService.apiGetRequest(getmpList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mpatternList = res.response['mpatternList'];
            }
          }
          this.spinner.hide();
        });
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      profitcenterName: [''],
      supplierName: [''],
      companyName: [null],
      plant: [null],
      branch: [null],
      bom: [''],
      profitCenter: [null, [Validators.required]],
      customerCode: ['', Validators.required],
      quotationNumber: [null],
      quotationDate: [null, [Validators.required]],
      supplierQuoteDate: [null],
      deliveryPeriod: [null],
      creditDays: [null],
      deliveryMethod: [null],
      advance: [null],
      // transportMethod: [null],
      material: [''],
      gstNo: [null],
      refNo: [null],
      responsiblePerson: [null],
      quotationfor: [null],
      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [0],
    });

    this.formData1 = this.formBuilder.group({
      materialCode: [''],
      taxCode: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      discount: [''],
      sgst: [''],
      id: [0],
      igst: [''],
      cgst: [''],
      amount: [''],
      mainComponent: [''],
      billable: [''],
      bomKey: [''],
      bomName: [''],
      total: [''],
      netWeight: [''],
      quotationNumber: [''],
      deliveryDate: [''],
      highlight: false,
      // stockQty: [0],
      materialName: [''],
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

  // companyChange() {
  //   const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
  //   this.formData.patchValue({
  //     companyName: obj.text
  //   })
  // }

  // profitChange() {
  //   const obj = this.profitCenterList.find((c: any) => c.code == this.formData.value.profitCenter);
  //   this.formData.patchValue({
  //     profitcenterName: obj.name
  //   })
  // }

  // customerChange() {
  //   const obj = this.ptypeList.find((c: any) => c.id == this.formData.value.supplier);
  //   this.formData.patchValue({
  //     supplierName: obj.text,
  //     gstNo: obj.gstNo
  //   })
  // }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true,
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
    const formObj = this.formData1.value
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const discountAmount = (((+formObj.qty * +formObj.rate) * ((+formObj.discount) / 100)));
    const amount = (+formObj.qty * +formObj.rate) - discountAmount
    const igst = obj.igst ? (amount * obj.igst) / 100 : 0;
    const cgst = obj.cgst ? (amount * obj.cgst) / 100 : 0;
    const sgst = obj.sgst ? (amount * obj.sgst) / 100 : 0;

    this.formData1.patchValue({
      amount: amount,
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
          t.qty = obj.qty * (t.bomQty ? t.bomQty : t.qty)
          t.changed = true
        }
      }
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

  supplierChange(event: any) {
    this.formData.patchValue({
      gstNo: event.item.gstNo
    })
  }

  materialCodeChange() {
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
          this.getCustomerList();
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
                const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                s.materialName = obj ? obj.text: ''
                // s.stockQty = obj.availQTY
                // s.hsnsac = obj.hsnsac
                s.id = 0
                s.action = s.billable == 'N' ? 'delete' : 'editDelete';
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


  getCustomerList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getcurrencyList = String.Join('/', this.apiConfigService.getCustomerList, obj.companyCode);
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
    const getpcUrl = String.Join('/', this.apiConfigService.getProfitCentersList);
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
              const pObj = this.ptypeList.find((p: any) => p.id == this.formData.value.customerCode);
              this.formData.patchValue({ customerCode: pObj ? pObj.text : '' });

              res.response['qsDetail'].forEach((s: any, index: number) => {
                // const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                // s.materialName = obj.text
                // s.stockQty = obj.closingQty;
                s.action = s.billable == 'N' ? 'delete' : 'editDelete';
                s.index = index + 1;
              })
              this.tableData = res.response['qsDetail'];
              this.calculate(false);
              
              this.getBusienessPartnerAccounts(res.response['qsmasters']);
            //  this.formData.disable();
              // this.formData.get('refNo').enable();
              // this.formData.get('bom').enable();
              this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
            }
          }
        });
  }

  bpaList: any;
  getBusienessPartnerAccounts(data: any) {
    
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getBusienessPartnerAccount, data.customerCode);
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

  emitColumnChanges(data) {
    this.tableData = data.data;
    // this.calculateAmount(data);
    this.finalTableData = JSON.parse(JSON.stringify(this.tableData));
  }


  back() {
    this.router.navigate(['dashboard/transaction/supplierquotation'])
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
   // this.formData.enable();
    const obj = this.ptypeList.find((p: any) => p.text == this.formData.value.customerCode);
    this.formData.patchValue({ customerCode: obj.id });
    this.savesupplierquotation();
  }

  savesupplierquotation() {
    const arr = this.tableData;
    arr.forEach((a: any) => {
      a.id = this.routeEdit ? a.id : 0
    })
    const addsq = String.Join('/', this.apiConfigService.addsupplierqs);
    const requestObj = { qsHdr: this.formData.value, qsDtl: arr };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        // if(this.routeEdit != '') {
        //   this.formData.disable();
        // }
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
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
    const pObj = this.ptypeList.find((p: any) => p.text == this.formData.value.customerCode);
    this.formData.patchValue({ customerCode: pObj.id });
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

  print() {
    const lists = JSON.parse(JSON.stringify(this.tableData))
    let list = lists.filter((t: any) => t.billable == 'Y');
    lists.forEach((data: any) => {
      const index = list.findIndex((l: any) => l.quotationNumber == data.quotationNumber);
      if (index != -1) {
       // list[index].qty = list[index].qty + 1;
        list[index].amount = list[index].qty * list[index].rate
      } else {
        list.push({ ...data });
      }
    })
    const obj = {
      heading: 'QUOTATION',
      headingObj: {
        ...this.formData.value,
        qDate: new Date(),
        // ref: 'AMT/WEIR/2324/311/27.03.2024',
        // to: 'Mr. Harish Sir',
        name: this.formData.value.customerCode,
        office: this.bpaList.address,
      },
      detailArray: list
    //  [{ sno: 1, itemCode: '495X7C5050B120XX', itemDesc: 'PULLEY', qty: 1, rate: 23243, amount: 2423423 }]
    }

    // if (res.tagsDetail && res.tagsDetail.length) {
    //   res.tagsDetail.forEach((t: any, i: number) => {
    //     const tObj = {
    //       Parameter: t.parameter,
    //       [t.tagName]: t.result,
    //     }
    //     if (!arr.length) {
    //       arr.push({ detailArray: [tObj], ...obj });
    //     } else {
    //       const key = Object.keys(arr[arr.length - 1].detailArray[arr[arr.length - 1].detailArray.length - 1]);
    //       if (key.filter((f: any) => f.includes('AMT-')).length > 4) {
    //         arr.push({ detailArray: [], ...obj });
    //       }
    //       let dObj = arr[arr.length - 1].detailArray.find((d: any) => d.Parameter == t.parameter);
    //       if (dObj) {
    //         dObj[t.tagName] = t.result
    //       } else {
    //         arr[arr.length - 1].detailArray.push(tObj);
    //       }
    //     }
    //   })
    // }

    this.quotationSupplier = obj;

    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('quotationSupplierPrintData').innerHTML;
      w.document.body.innerHTML = html;
      this.quotationSupplier = null;
      w.print();
    }, 1000);

  }

}
