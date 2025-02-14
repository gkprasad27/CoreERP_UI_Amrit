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
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-receipt-of-goods',
  templateUrl: './receipt-of-goods.component.html',
  styleUrls: ['./receipt-of-goods.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ReceiptOfGoodsComponent implements OnInit {

  formData: FormGroup;
  formData1: FormGroup;
  routeEdit = '';
  mpatternList= [];
  tableData = [];
  materialCodeList = [];
  perChaseOrderList = [];


  dynTableProps: any;
  sendDynTableData: any;
  grnDate: any;
  // header props
  porderList = [];
  companyList = [];
  plantList = [];
  branchList = [];
  profitCenterList = [];
  employeesList = [];
  movementList = [];
  stlocList = [];
  materialList = [];
  purchaseordernoList: any;
  podetailsList: any;
  bpaList: any;

  fileList: any;
  fileList1: any;
  


  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'id',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings2: IDropdownSettings = {
    singleSelection: true,
    idField: 'materialCode',
    textField: 'materialName',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'code',
    textField: 'description',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  taxCodeList = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private httpClient: HttpClient,
    public commonService: CommonService,
    public route: ActivatedRoute,
    private router: Router) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit(): void {
    this.formDataGroup();
    this.getpurchaseOrderTypeData();
    this.getModelPatternList();
  }
  approveOrReject(event) {
    if (event) {
      this.formData.patchValue({
        qualityCheck: "Accept",
        reject: null
      });
    } else {
      this.formData.patchValue({
        qualityCheck: null,
        reject: "Reject"
      });
    }
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      purchaseOrderNo: [null, Validators.required],
      company: [null, [Validators.required]],
      // plant: [null],
      // branch: [null],
      profitCenter: [null, Validators.required],
      supplierCode: [null],
      //supplierName: [null],
      supplierReferenceNo: [null, Validators.required],
      profitcenterName: [''],
      companyName: [null],
      receivedBy: [null, Validators.required],
      receivedDate: [null, Validators.required],
      receiptDate: [null],
      // supplierGinno: [null],
      // movementType: [null],
      // grnno: [null],
      // grndate: [null],
      // qualityCheck: [null],
      // storageLocation: [null],
      customerName: [null],
      id: ['0'],
      // rrno: [null],
      vehicleNo: [null, Validators.required],
      addWho: [null],
      addDate: [null],
      editWho: [null],
      editDate: [null],
      lotNo: ['', Validators.required],
      documentURL: [''],
      invoiceURL: [''],
      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [''],
      materialgrade: ['']
    });


    this.formData1 = this.formBuilder.group({
      rejectQty: [''],
      receivedQty: ['', Validators.required],
      materialCode: ['', Validators.required],
      materialName: [''],
      netWeight: [''],
      purchaseOrderNumber: [''],
      description: [''],
      heatNumber: [''],
      materialgrade:[''],
      milltcno:[''],
      tptcno:[''],
      pendingQty: [''],
      qty: [''],
      hsnsac: [''],
      highlight: false,
      type: [''],     
      rate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      taxCode: 0,

      action: 'editDelete',
      index: 0
    });
  }


  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete'
    });
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
  //     profitcenterName: obj.text
  //   })
  // }

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
    let qtyT = this.formData1.value.receivedQty;
    data.forEach((t: any) => {
      if (t.materialCode == this.formData1.value.materialCode[0]['materialCode']) {
        qtyT = qtyT + (this.formData1.value.index == t.index ? ((+this.formData1.value.receivedQty) + (+this.formData1.value.rejectQty))  :  ((+t.receivedQty) + (+t.rejectQty))) 
      }
    })
    // const remainigQ = this.formData1.value.qty - qtyT;
    if (this.formData1.value.qty < qtyT) {
      this.alertService.openSnackBar("You can't recevie more Quantity", Static.Close, SnackBar.error);
      return;
    }
    this.dataChange();
    this.tableData = null;
    this.tableComponent.defaultValues();
    let fObj = this.formData1.value;
    if(fObj.materialCode) {
      fObj.materialCode = fObj.materialCode[0].materialCode;
      fObj.materialgrade = fObj.materialgrade[0].description
    }
    if (this.formData1.value.index == 0) {
      // this.formData1.patchValue({
        fObj.index = data ? (data.length + 1) : 1
      // });
      data = [fObj, ...data];
    } else {
      if (this.formData1.value.index == 0) {
        data.push(fObj);
      } else {
        data = data.map((res: any) => res = res.index == fObj.index ? fObj : res);
      }
    }
    setTimeout(() => {
      this.tableData = data;
      this.calculate();
    });
    this.resetForm();
  }

  editOrDeleteEvent(value) {
    
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
      this.calculate();
      this.resetForm();
    } else {
      
      let item = { ...value.item };
      if (typeof item.materialCode == 'string') {
        item.materialCode = [{ materialCode: item.materialCode, materialName: item.materialName }]
      }
      if (typeof item.materialgrade == 'string') {
        item.materialgrade = [{ code: item.materialCode, description: item.materialgrade }]
      }
      this.formData1.patchValue(item);
    }
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

  downLoadFile1(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.name);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  tablePropsFunc() {
    return {
      tableData: {
        checkAll:
        {
          value: false, type: 'checkbox'
        },

        materialCode: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        description: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
        },
        poqty: {
          value: null, type: 'number', width: 75, maxLength: 15, disabled: true,
        },
        receivedQty: {
          value: null, type: 'number', width: 75, maxLength: 15, disabled: true, fieldEnable: true
        },
        plant: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.plantList, id: 'plantCode', text: 'plantname', displayMul: true, width: 100
        },
        storageLocation: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.stlocList, id: 'code', text: 'name', displayMul: true, width: 100
        },
        profitCenter: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.profitCenterList, id: 'code', text: 'description', displayMul: true, width: 100
        },
        project: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
        },
        branch: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.branchList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        movementType: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          // value: null, type: 'dropdown', list: this.movementList, id: 'code', text: 'description', displayMul: true, width: 100, 
        },
        lotNo: {
          value: null, type: 'number', width: 100, maxLength: 50, fieldEnable: true
        },
        lotDate: {
          value: null, type: 'datepicker', width: 100, fieldEnable: true
        },
        delete: {
          type: 'delete', width: 10
        }
      },

      formControl: {
        materialCode: [null, [Validators.required]],
      }
    };
  }

  grndatechange() {
    if (this.tableData.length) {
      this.tableData.map(resp => resp.lotDate.value === this.formData.get('grndate').value)
      // this.sendDynTableData = { type: 'add', data: this.tableData };
    }
  }

  ponoselect() {
    
    let data = [];
    this.perChaseOrderList = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('purchaseOrderNo').value) && this.formData.value.purchaseOrderNo[0].id) {
      data = this.podetailsList.filter(resp => resp.purchaseOrderNumber == this.formData.value.purchaseOrderNo[0].id);
    }
    if (data.length) {
      
      data.forEach((d: any, index: number) => {
        const obj = {
          materialCode: d.materialCode ? d.materialCode : '',
          materialName: d.materialName ? d.materialName : '',
          netWeight: d.netWeight ? d.netWeight : '',
          purchaseOrderNumber: d.purchaseOrderNumber ? d.purchaseOrderNumber : '',
          rejectQty: d.rejectQty ? d.rejectQty : '',
          qty: d.qty ? d.qty : '',
          receivedQty: d.receivedQty ? d.receivedQty : '',
          description: d.description ? d.description : '',
          heatNumber: d.heatNumber ? d.heatNumber : '',
          materialgrade:d.materialgrade ? d.materialgrade : '',
          milltcno:d.milltcno ? d.milltcno : '',
          tptcno:d.tptcno ? d.tptcno : '',
          hsnsac: d.hsnsac ? d.hsnsac : '',
          action: '',
          index: index + 1,

          cgst: d.cgst ? d.cgst : 0,
          sgst: d.sgst ? d.sgst : 0,
          igst: d.igst ? d.igst : 0,
          taxCode: d.taxCode ? d.taxCode : 0,
          rate: d.rate ? d.rate : 0,
        }
        this.perChaseOrderList.push(obj)
      })
      // this.tableData = this.perChaseOrderList;
      // const unique = [...new Set(this.perChaseOrderList.map(item => item.materialCode))]

      this.materialCodeList = this.perChaseOrderList;
      this.formData1.patchValue({
        qty: '',
        netWeight: '',
      })
      this.tableData = null;
    }
    const obj = this.purchaseordernoList.find(resp => resp.id == this.formData.value.purchaseOrderNo[0].id);
    this.formData.patchValue({
      customerName: obj.text,
      supplierCode: obj.supplierCode,
      igst: 0,
      cgst: 0,
      sgst: 0,
      amount: 0,
      totalTax: 0,
      totalAmount: 0
    })
    this.getRecepitOfGoodsDetails1(obj.id)
  }

  materialCodeChange() {
    const obj = this.materialCodeList.find((p: any) => p.materialCode == this.formData1.value.materialCode[0]['materialCode']);
    let pendingQty = 0;
    this.grDetail && this.grDetail.forEach((t: any) => {
      if (t.materialCode == obj.materialCode) {
        pendingQty = pendingQty + t.receivedQty
      }
    })
    this.formData1.patchValue({
      qty: obj ? obj.qty : '',
      netWeight: obj ? obj.netWeight : '',
      materialName: obj ? obj.materialName : '',
      pendingQty: obj.qty - pendingQty,
      hsnsac: obj.hsnsac,
      taxCode: obj.taxCode,
      rate: obj.rate,
    })
  }

  getpurchaseOrderTypeData() {
    const getpurchaseOrderTypeUrl = String.Join('/', this.apiConfigService.getpurchaseOrderTypeList);
    this.apiService.apiGetRequest(getpurchaseOrderTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.porderList = res.response['porderList'];
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
          this.getpodetailsList();
        });
  }
  getpodetailsList() {
    const getpodetailsListUrl = String.Join('/', this.apiConfigService.getpodetailsList);
    this.apiService.apiGetRequest(getpodetailsListUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.podetailsList = res.response['podetailsList'];
            }
          }
          this.getpurchasenoList();
        });
  }
  getpurchasenoList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const poUrl = String.Join('/', this.apiConfigService.getpurchasenoList, obj.companyCode);
    this.apiService.apiGetRequest(poUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.purchaseordernoList = res.response['purchaseordernoList'];
            }
          }
          this.getProfitcenterData();
        });
  }
  // getsuppliercodeList() {
  //   const getsuppliercodeList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList);
  //   this.apiService.apiGetRequest(getsuppliercodeList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         console.log(res);
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.bpaList = res.response['bpaList'];
  //             this.bpaList = res.response['bpaList'].filter(resp => resp.bpTypeName == 'Vendor')

  //           }
  //         }
  //         this.getplantList();
  //       });
  // }

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
              this.getEmployeesList()
            }
          }
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          if (this.routeEdit != '') {
            this.getRecepitOfGoodsDetails(this.routeEdit);
          }
          // this.getmaterialData();
        });
  }

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
  // getMomentTypeList() {
  //   const MomentTypeList = String.Join('/', this.apiConfigService.getmomenttypeList);
  //   this.apiService.apiGetRequest(MomentTypeList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.movementList = res.response['movementList'];
  //           }
  //         }
  //         this.getstorageLocationData();
  //       });
  // }

  // getstorageLocationData() {
  //   const getstorageUrl = String.Join('/', this.apiConfigService.getStList);
  //   this.apiService.apiGetRequest(getstorageUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.stlocList = res.response['stlocList'];
  //           }
  //         }
  //         this.getmaterialData();
  //       });
  // }

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
            }
          }
          // this.dynTableProps = this.tablePropsFunc();
          // if (this.routeEdit != '') {
          //   this.getRecepitOfGoodsDetails(this.routeEdit);
          // }
        });
  }

  grDetail: any[] = [];
  getRecepitOfGoodsDetails1(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getgoodsreceiptDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.grDetail = res.response['grDetail'];
            }
          }
        });
  }

  getRecepitOfGoodsDetails(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getgoodsreceiptDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['grmasters']);
              // this.formData.patchValue({
              //   purchaseOrderNo: +res.response['grmasters'].purchaseOrderNo
              // })
              // if (this.formData.value.documentURL) {
              //   this.downLoad(this.formData.value.documentURL, 'document');
              // }
              // if (this.formData.value.invoiceURL) {
              //   this.downLoad(this.formData.value.invoiceURL, 'invoice');
              // }
              this.perChaseOrderList = [];

              if (res.response['grDetail'] && res.response['grDetail'].length) {
                
                let str = res.response['grDetail'][0].taxCode;
                const obj = this.taxCodeList.find((t: any) => t.taxRateCode == str);
                this.formData1.patchValue({
                  taxCode: obj ? (obj.igst ? obj.igst : obj.sgst) : ''
                })
              }

              res.response['grDetail'].forEach((d: any, index: number) => {
                const obj = {
                  materialCode: d.materialCode ? d.materialCode : '',
                  materialName: d.materialName ? d.materialName : '',
                  netWeight: d.netWeight ? d.netWeight : '',
                  // pendingQty: (d.qty - d.receivedQty),
                  purchaseOrderNumber: d.purchaseOrderNumber ? d.purchaseOrderNumber : '',
                  rejectQty: d.rejectQty ? d.rejectQty : '',
                  qty: d.qty ? d.qty : '',
                  lotNo: d.lotNo ? d.lotNo : '',
                  documentURL: d.documentURL ? d.documentURL : '',
                  invoiceURL: d.invoiceURL ? d.invoiceURL : '',
                  supplierReferenceNo: d.supplierReferenceNo ? d.supplierReferenceNo : '',
                  supplierRefno: d.supplierRefno ? d.supplierRefno : '',
                  receivedDate: d.receivedDate ? d.receivedDate : '',
                  receivedQty: d.receivedQty ? d.receivedQty : '',
                  hsnsac: d.hsnsac ? d.hsnsac : '',
                  description: d.description ? d.description : '',
                  heatNumber: d.heatNumber ? d.heatNumber : '',
                  materialgrade:d.materialgrade ? d.materialgrade : '',
                  milltcno:d.milltcno ? d.milltcno : '',
                  tptcno:d.tptcno ? d.tptcno : '',
                  cgst: d.cgst ? d.cgst : 0,
                  sgst: d.sgst ? d.sgst : 0,
                  igst: d.igst ? d.igst : 0,
                  taxCode: d.taxCode ? d.taxCode : 0,
                  rate: d.rate ? d.rate : 0,

                  type: 'edit',
                  // action: 'editDelete',
                  index: index + 1
                }
                this.perChaseOrderList.push(obj)
              })
              this.grDetail = res.response['grDetail'];
              this.tableData = this.perChaseOrderList;
              this.calculate();
              // const arr = this.podetailsList.filter(resp => !this.perChaseOrderList.some((p: any) => p.materialCode == resp.materialCode));
              // const unique = [...new Set(arr.map(item => item.materialCode))];
              // this.materialCodeList = this.podetailsList;
              this.materialCodeList = this.podetailsList.filter(resp => resp.purchaseOrderNumber == this.formData.get('purchaseOrderNo').value);
              this.formData.controls.purchaseOrderNo.disable();
              this.formData.controls.company.disable();
              this.formData.controls.customerName.disable();
              this.formData.controls.profitCenter.disable();
              this.tableData && this.tableData.forEach((t: any) => {
                let pendingQty = 0;
                const obj = this.materialCodeList.find((p: any) => p.materialCode == t.materialCode);
                if (obj) {
                  pendingQty = pendingQty + t.receivedQty
                  pendingQty = obj.qty - pendingQty

                if (pendingQty == 0) {
                  this.materialCodeList = this.materialCodeList.filter((p: any) => p.materialCode != t.materialCode);
                }
                }
              })
            }
          }
        });
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
        amount: ((+this.formData.value.amount) + (t.receivedQty * t.rate * t.netWeight)).toFixed(2),
        totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
      })
    })
    this.formData.patchValue({
      totalAmount: ((+this.formData.value.amount) + (+this.formData.value.totalTax)).toFixed(2),
    })
  }

  dataChange() {
    const formObj = this.formData1.value;
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const igst = obj.igst ? ((+formObj.receivedQty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.igst) / 100 : 0;
    const cgst = obj.cgst ? ((+formObj.receivedQty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.cgst) / 100 : 0;
    const sgst = obj.sgst ? ((+formObj.receivedQty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.sgst) / 100 : 0;
    this.formData1.patchValue({
      amount: (+formObj.receivedQty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)),
      total: (+formObj.receivedQty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) + (igst + sgst + cgst),
      igst: igst,
      cgst: cgst,
      sgst: sgst,
    })
  }

  getLotNumData(row) {

    const getlotnos = String.Join('/', this.apiConfigService.gettinglotNumbers, row.data[row.index].materialCode.value);
    this.apiService.apiGetRequest(getlotnos)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              row.data[row.index].lotNo.value = res.response['lotNum']
              //row.data[row.index].lotDate.value =JSON.stringify(this.grnDate);
              // this.sendDynTableData = { type: 'add', data: row.data };
              // this.tableData = row.data;
            }
          }
          //this.spinner.hide();
        });

  }

  emitColumnChanges(data) {
    this.tableData = data.data;
    if (data.column == 'checkAll') {
      if (data.data[data.index].checkAll.value) {
        this.getLotNumData(data);
      }

    }

  }



  back() {
    this.router.navigate(['dashboard/transaction/goodsreceipts'])
  }

  save() {
    this.formData.markAsTouched();
    // this.tableData = this.commonService.formatTableData(this.tableData, 0);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.savegoodsreceipt();
  }

  savegoodsreceipt() {
    this.formData.controls.purchaseOrderNo.enable();
    this.formData.controls.company.enable();
    this.formData.controls.customerName.enable();
    this.formData.controls.profitCenter.enable();
    const arr = this.tableData.filter((d: any) => !d.type);
    const addgoodsreceipt = String.Join('/', this.apiConfigService.addgoodsreceipt);
    const formData = this.formData.value;
    if (typeof formData.purchaseOrderNo != 'string') {
      formData.purchaseOrderNo = this.formData.value.purchaseOrderNo[0].id;
    }
    if (typeof formData.receivedBy != 'string') {
      formData.receivedBy = this.formData.value.receivedBy[0].id;
    }
    if (typeof formData.materialgrade != 'string') {
      formData.materialgrade = this.formData.value.materialgrade[0].description;
    }

    formData.receivedDate = this.formData.get('receivedDate').value ? this.datepipe.transform(this.formData.get('receivedDate').value, 'MM-dd-yyyy') : '';
    formData.documentURL = this.fileList ? this.fileList.name.split('.')[0] : '';
    formData.invoiceURL = this.fileList1 ? this.fileList1.name.split('.')[0] : '';
    const requestObj = { grHdr: formData, grDtl: arr };
    this.apiService.apiPostRequest(addgoodsreceipt, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (this.fileList) {
              this.uploadFile();
            } else {
              this.router.navigateByUrl('dashboard/transaction/goodsreceipts');
            }
            this.alertService.openSnackBar('Goods Receipt created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
        }
      });
  }

  emitFilesList(event: any) {
    this.fileList = event[0];
  }
  emitFilesList1(event: any) {
    this.fileList1 = event[0];
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
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
        if (this.fileList1) {
          this.uploadFile1();
        } else {
          this.router.navigateByUrl('dashboard/transaction/goodsreceipts');
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
          }
        }
        this.router.navigateByUrl('dashboard/transaction/goodsreceipts');
      });
  }

  // downLoad(id: any, flag: string) {
  //   const url = String.Join('/', this.apiConfigService.getFile, id);
  //   this.apiService.apiGetRequest(url)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         if (flag == 'document') {
  //           this.url = response.response;
  //         } else {
  //           this.url1 = response.response;
  //         }
  //       });
  // }
  


  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returngoodsreceipt, this.routeEdit);
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
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

}
