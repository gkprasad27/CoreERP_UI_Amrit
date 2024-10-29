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
import { MatDialog } from '@angular/material/dialog';
import { PoHistoryComponent } from './po-history/po-history.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-purcahseorder',
  templateUrl: './purcahseorder.component.html',
  styleUrls: ['./purcahseorder.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PurchaseOrderComponent implements OnInit {

  // form control
  formData: FormGroup;
  formData1: FormGroup;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  // sendDynTableData: any;

  // header props
  companyList = [];
  plantList = [];
  deptList = [];
  branchList = [];
  costcenterList = [];
  profitCenterList = [];
  projectNameList = [];
  wbsList = [];
  termsofDeliveryList = [{ id: "FOR", text: "FOR" },
  { id: "FOB", text: "FOB" }, { id: "CIF", text: "CIF" }, { id: "FAS", text: "FAS" }];

  // details props
  tableData = [];
  dynTableProps: any;
  routeEdit = '';
  materialList: any;
  pcgroupList: any;
  functionaldeptList: any;
  porderList: any;
  fcList: any;
  citemList: any;
  locList: any;
  employeesList: any;
  qnoList: any;
  ptypeList: any;
  ptermsList: any;
  filesend: any;
  // user details
  loginUser: any;
  bpaList: any;
  imgShow: any;
  taxCodeList = [];
  mpatternList = [];
  materialCodeList = [];

  data: any;

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

  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'description',
    textField: 'description',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };


  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.loginUser = JSON.parse(localStorage.getItem('user'));
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
    this.getTaxRatesList();
    this.getModelPatternList();
    // this.getPurchaseGroupData();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }


  formDataGroup() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.formData = this.formBuilder.group({

      company: [null, [Validators.required]],
      plant: [null],
      branch: [null],
      profitCenter: [null, [Validators.required]],
      saleOrderType: [null, [Validators.required]],
      purchaseOrderNumber: [null],
      purchaseOrderType: [null, [Validators.required]],
      // quotationDate: [null],
      supplierCode: [null, [Validators.required]],
      supplierName: [null, [Validators.required]],
      gstno: [null],
      profitcenterName: [''],
      material: [''],
      companyName: [null],
      deliveryDate: [null],
      deliveryPeriod: [null],
      termsofDelivery: null,
      paymentTerms: [null],
      purchaseOrderDate: [null, Validators.required],
      addWho: user.userName,
      addDate: [null],
      editWho: user.userName,
      editDate: [null],
      filePath: [null],
      advance: [null],
      dispatchMode: [null],
      termsOfDelivery: [null],
      termsOfPayment: [null],
      fright: [0],
      weightBridge: [0],
      otherCharges: [0],
      hamaliCharges: [0],
      ammendment: [0],
      extaCharges: 0,
      mechineNumber:[null],
      roundOff: [0],
      igst: [0],
      cgst: [0],
      sgst: [0],
      amount: [0],
      totalTax: [0],
      totalAmount: [0],
      saleOrderNo: [null, [Validators.required]],
    });
    this.formData.controls.gstno.disable();

    this.formData1 = this.formBuilder.group({
      materialCode: [''],
      materialName: [''],
      material: [''],
      taxCode: ['', [Validators.required]],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      discount: [''],
      availableQTY: [''],
      // purchaseOrderNumber: [''],
      cgst: 0,
      sgst: 0,
      igst: 0,
      id: 0,
      diemntions: [''],
      changed: true,
      netWeight: [''],
      dimentions:[''],
      hsnsac: [''],
      soQty: 0,
      poQty: 0,
      highlight: false,
      amount: [''],
      deliveryDate: [''],
      status: [''],
      saleOrderNo: [''],
      total: [''],
      type: ['add'],
      action: 'editDeleteView',
      index: 0
    });

  }

  toggle() {
    if (this.formData.value.saleOrderType == 'Sale Order') {
      this.getSaleOrderList();
    } else if (this.formData.value.saleOrderType == 'Master Saleorder') {
      this.getPRList();
    } else if (this.formData.value.saleOrderType == 'Bill of Material') {
      this.getBOMList();
    }
  }

  // profitCenterChange() {
  //   this.formData.patchValue({
  //     purchaseOrderNumber: ''
  //   })
  //   const costCenUrl = String.Join('/', this.apiConfigService.getPurchaseOrderNumber, this.formData.value.profitCenter);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.formData.patchValue({
  //               purchaseOrderNumber: res.response['PurchaseOrderNumber']
  //             })
  //           }
  //         }
  //       });
  // }

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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.patchValue({
        filePath: file
      });
    }
  }

  supplierCodeChange() {
    const obj = this.bpaList.find((b: any) => b.name == this.formData.value.supplierName);
    this.formData.patchValue({
      supplierCode: obj.bpnumber,
      gstno: obj.gstno
    })
  }

  quotationNumberChange() {
    this.getSaleOrderDetail();
  }

  getSaleOrderDetail() {
    this.tableComponent.defaultValues();
    let url = '';
    if (this.formData.value.saleOrderType == 'Sale Order') {
      url = this.apiConfigService.getSaleOrderDetailPO;
    } else if (this.formData.value.saleOrderType == 'Master Saleorder') {
      url = this.apiConfigService.getPurchaseRequisitionDetail;
    } else if (this.formData.value.saleOrderType == 'Bill of Material') {
      url = this.apiConfigService.getBOMDetail;
    }
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
              } else if (this.formData.value.saleOrderType == 'Master Saleorder') {
                obj.data = res.response['preqmasters']
                obj.data1 = res.response['preqDetail']
              } else if (this.formData.value.saleOrderType == 'Bill of Material') {
                obj.data = res.response['bomMasters']
                obj.data1 = res.response['bomDetail']
              }
              // this.formData.patchValue(obj['data']);
              // this.formData.patchValue({
              //   saleOrderNo: obj['data'].saleOrderNo ? +obj['data'].saleOrderNo : ''
              // })
              obj['data1'].forEach((s: any, index: number) => {
                s.action = 'editDeleteView';
                s.id = 0;
                s.index = index + 1;
                // s.qty = s.qty ? s.qty : 0;
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
              })
              this.tableData = obj['data1'];
              //this.calculate();
            }
          }
        });
  }

  getPRList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const companyUrl = String.Join('/', this.apiConfigService.getPRList, obj.companyCode);
    this.apiService.apiGetRequest(companyUrl)
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
        });
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
  // getPaymenttermsList() {
  //   const getpmList = String.Join('/', this.apiConfigService.getPaymentsTermsList);
  //   this.apiService.apiGetRequest(getpmList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.ptermsList = res.response['ptermsList'];
  //           }
  //         }
  //         this.getsuppliercodeList();
  //       });
  // }
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
          this.getpurchaseordertypetData();
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
  //         this.getSaleOrderList();
  //       });
  // }
  getSaleOrderList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderList, obj.companyCode);
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
  getpurchaseordertypetData() {
    const getpurchaseordertypeUrl = String.Join('/', this.apiConfigService.getpurchaseOrderTypeList);
    this.apiService.apiGetRequest(getpurchaseordertypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.porderList = res.response['porderList'];
            }
          }
          this.getProfitcenterData();
        });
  }
  // getFundCenterList() {
  //   const fcUrl = String.Join('/', this.apiConfigService.getfundcenterList);
  //   this.apiService.apiGetRequest(fcUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.fcList = res.response['fcList'];
  //           }
  //         }
  //         this.getCommitmentList();
  //       });
  // }
  // getCommitmentList() {
  //   const cmntUrl = String.Join('/', this.apiConfigService.getCommitmentList);
  //   this.apiService.apiGetRequest(cmntUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.citemList = res.response['citemList'];
  //           }
  //         }
  //         this.getlocationsList();
  //       });
  // }
  // getlocationsList() {
  //   const getlocationsList = String.Join('/', this.apiConfigService.getlocationsList);
  //   this.apiService.apiGetRequest(getlocationsList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.locList = res.response['locationList'];
  //           }
  //         }
  //         this.getfunctionaldeptList();
  //       });
  // }
  // getfunctionaldeptList() {
  //   const taxCodeUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
  //   this.apiService.apiGetRequest(taxCodeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;

  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.functionaldeptList = res.response['fdeptList'];
  //           }
  //         }
  //         this.getCostCenterData();
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
  //         this.getCostCenterData();
  //       });
  // }

  // getCostCenterData() {
  //   const getccUrl = String.Join('/', this.apiConfigService.getCostCentersList);
  //   this.apiService.apiGetRequest(getccUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.costcenterList = res.response['costcenterList'];
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
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }

          this.getRolesList()
        });
  }
  getRolesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getrolelist);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['roleList'];
              this.employeesList = res.response['roleList'].filter(resp => resp.roleId == this.loginUser.role)
            }
          }
          if (this.routeEdit != '') {
            this.getPurchaseorderDetails(this.routeEdit);
          }
          // this.getmaterialData();
        });
  }
  // getPurchaseGroupData() {
  //   const getpcUrl = String.Join('/', this.apiConfigService.getPurchaseGroupList);
  //   this.apiService.apiGetRequest(getpcUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.pcgroupList = res.response['pcgroupList'];
  //           }
  //         }

  //         this.spinner.hide()
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
          //   this.getPurchaseorderDetails(this.routeEdit);
          // }
          // this.getWbsList();
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
  //           this.getPurchaseorderDetails(this.routeEdit);
  //         }
  //       });
  // }

  getPurchaseorderDetails(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getpurchaseorderDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['pomasters']);
              // this.toggle();

              if (res.response['poDetail'] && res.response['poDetail'].length) {
                let str = res.response['poDetail'][0].taxCode;
                // str = str.split('-')[0].substring(1, 3)
                const obj = this.taxCodeList.find((t: any) => t.taxRateCode == str);
                this.formData1.patchValue({
                  taxCode: obj.igst ? obj.igst : obj.sgst
                })
              }
              // this.sendDynTableData = { type: 'edit', data: res.response['poDetail'] };
              //this.formData.disable();
              res.response['poDetail'].forEach((s: any, index: number) => {
                s.availableQTY = s.availableQTY ? s.availableQTY : '';
                s.action = 'editDeleteView';
                s.changed = false;
                s.poQty = s.qty ? s.qty : 0;
                s.index = index + 1;
              })
              this.tableData = res.response['poDetail'];
              this.getsaleOrdernoList();
              // this.calculate();
            }
          }
        });
  }

  getsaleOrdernoList() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderDetail, this.formData.get('saleOrderNo').value);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const arr = res.response['SaleOrderDetails'];
              this.materialCodeList = arr.filter((s: any) => !this.tableData.some((t: any) => t.materialCode == s.materialCode));
            }
          }
        });
  }


  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDeleteView',
      type: 'add'
    });
  }

  // companyChange() {
  //   const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
  //   this.formData.patchValue({
  //     companyName: obj.text
  //   })
  // }

  // profitChange() {
  //   const obj = this.profitCenterList.find((c: any) => c.id == this.formData.value.profitCenter);
  //   this.formData.patchValue({
  //     profitcenterName: obj.text
  //   })
  // }



  saveForm() {
    if (this.formData1.invalid) {
      return;
    }

    let checkqty = 0;
    if (this.routeEdit) {
      checkqty = this.formData1.value.soQty
    } else {
      checkqty = this.formData1.value.poQty ? (this.formData1.value.soQty - this.formData1.value.poQty) : this.formData1.value.soQty
    }

    if (this.formData1.value.qty > checkqty) {
      this.formData1.patchValue({
        qty: 0,
      });
      this.alertService.openSnackBar(`Qty can't be greater than the sale order qty`, Static.Close, SnackBar.error);
      return;
    }
    this.dataChange();
    this.formData1.patchValue({
      highlight: true,
      changed: true,
    });
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.formData1.value.index == 0) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      const obj = this.formData1.value;
      obj.material = obj.material ? obj.material[0].description : '';
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
      this.calculate();
    });
    this.resetForm();
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      if (value.item.id) {
        this.deletePurchaseOrder(value.item)
      } else {
        this.tableComponent.defaultValues();
        this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
        this.calculate();
        this.resetForm();
      }
    } else if (value.action === 'View') {
      this.dialog.open(PoHistoryComponent, {
        width: '100%',
        height: '700px',
        data: value
      });
    } else {
      value.item['type'] = 'edit';
      this.formData1.patchValue({
        material: value.item.material ? [{ description: value.item.material  }] : ''
      })
      this.formData1.patchValue(value.item);
    }
  }

  deletePurchaseOrder(item: any) {
    const obj = {
      item: {
        materialCode: item.materialCode
      },
      primary: 'materialCode'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const jvDetUrl = String.Join('/', this.apiConfigService.deletePurchaseOrder, item.id);
        this.apiService.apiDeleteRequest(jvDetUrl)
          .subscribe(
            response => {
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.tableComponent.defaultValues();
                  this.tableData = this.tableData.filter((res: any) => res.index != item.index);
                  this.calculate();
                  this.resetForm();
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    })

  }

  dataChange() {
    const formObj = this.formData1.value;
    const obj = this.taxCodeList.find((tax: any) => tax.taxRateCode == formObj.taxCode);
    const igst = obj.igst ? ((+formObj.qty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.igst) / 100 : 0;
    const cgst = obj.cgst ? ((+formObj.qty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.cgst) / 100 : 0;
    const sgst = obj.sgst ? ((+formObj.qty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) * obj.sgst) / 100 : 0;

    this.formData1.patchValue({
      amount: (+formObj.qty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)),
      total: (+formObj.qty * +formObj.rate * +(formObj.netWeight ? formObj.netWeight : 1)) + (igst + sgst + cgst),
      igst: igst,
      cgst: cgst,
      sgst: sgst,
    })

    this.calculateTotal(obj);
  }

  calculateTotal(obj) {

    const igst1 = obj.igst ? ((((+this.formData.value.fright) + 
    (+this.formData.value.weightBridge) + (+this.formData.value.otherCharges) + 
    (+this.formData.value.hamaliCharges))) * obj.igst) / 100 : 0;

    const cgst1 = obj.cgst ? ((((+this.formData.value.fright) + 
    (+this.formData.value.weightBridge) + (+this.formData.value.otherCharges) + 
    (+this.formData.value.hamaliCharges))) * obj.cgst) / 100 : 0;
    
    const sgst1 = obj.sgst ? ((((+this.formData.value.fright) + 
    (+this.formData.value.weightBridge) + (+this.formData.value.otherCharges) + 
    (+this.formData.value.hamaliCharges))) * obj.sgst) / 100 : 0;
    
    this.formData.patchValue({
      extaCharges: (igst1 + sgst1 + cgst1),
    })
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
      if(t.changed || this.routeEdit) {
      this.formData.patchValue({
        igst: ((+this.formData.value.igst) + t.igst).toFixed(2),
        cgst: ((+this.formData.value.cgst) + t.cgst).toFixed(2),
        sgst: ((+this.formData.value.sgst) + t.sgst).toFixed(2),
        amount: ((+this.formData.value.amount) + (t.qty * t.rate * (t.netWeight ? t.netWeight: 1))).toFixed(2),
        totalTax: ((+this.formData.value.totalTax) + (t.igst + t.cgst + t.sgst)).toFixed(2),
      })
    }
    })
    // this.formData.patchValue({
    //   totalAmount: ((+this.formData.value.amount) + (+this.formData.value.totalTax)).toFixed(2),
    // })
    this.formData.patchValue({
      totalAmount: (
        (+this.formData.value.amount || 0) +      // Base amount, default to 0 if undefined
        (+this.formData.value.totalTax || 0) +    // Total tax, default to 0 if undefined
        (+this.formData.value.fright || 0) +      // Freight charges, default to 0 if undefined
        (+this.formData.value.weightBridge || 0) +  // Weightbridge charges, default to 0 if undefined
        (+this.formData.value.otherCharges || 0) + // Cutting charges, default to 0 if undefined
        (+this.formData.value.hamaliCharges || 0) + // Cutting charges, default to 0 if undefined
        (+this.formData.value.extaCharges || 0)    // Hamali charges, default to 0 if undefined
      ).toFixed(2),  // Round to 2 decimal places
  });
  
  
  }
  // emitColumnChanges(data) {
  //   this.tableData = data.data;
  // }

  materialCodeChange() {
    const obj = this.materialCodeList.find((m: any) => m.materialCode == this.formData1.value.materialCode);
    if (obj) {
      this.formData1.patchValue(obj);
    } else {
      this.resetForm();
    }
  }

  back() {
    this.router.navigate(['dashboard/transaction/purchaseorder'])
  }

  save() {
    if ((this.tableData.length == 0 || this.formData.invalid || (!(this.tableData.some((t: any) => t.changed)))  && !this.routeEdit)) {
      this.formData.markAllAsTouched();
      return;
    }
    this.savepurcahseorder();
  }

  savepurcahseorder() {
    const addprorder = String.Join('/', this.apiConfigService.addpurchaseorder);
    this.formData.enable();
    const obj = this.formData.value;
    // obj.quotationDate = obj.quotationDate ? this.datepipe.transform(obj.quotationDate, 'MM-dd-yyyy') : '';
    obj.purchaseOrderDate = obj.purchaseOrderDate ? this.datepipe.transform(obj.purchaseOrderDate, 'MM-dd-yyyy') : '';
    obj.deliveryDate = obj.deliveryDate ? this.datepipe.transform(obj.deliveryDate, 'MM-dd-yyyy') : '';
    if (typeof obj.saleOrderNo != 'string') {
      obj.saleOrderNo = this.formData.value.saleOrderNo[0].saleOrderNo;
    }
    if (typeof obj.material != 'string') {
      obj.material = this.formData.value.material[0].description;
    }
    const arr = this.tableData.filter((d: any) => d.changed);

    const taxCodeobj = this.taxCodeList.find((tax: any) => tax.taxRateCode == arr[0].taxCode);
    this.calculateTotal(taxCodeobj);
    this.calculate();
    const requestObj = { poHdr: obj, poDtl: arr };
    this.apiService.apiPostRequest(addprorder, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        // this.saveimage();
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Purchase Order created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/transaction/purchaseorder'])
          }
          // this.reset();
          this.spinner.hide();
        }
      });
  }
  downloadImg() {
    const url = String.Join('/', this.apiConfigService.getFile, this.formData.get('filePath').value);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          const res = response;
          this.imgShow = res.response;
          this.commonService.downloadFile(res.response)
          this.spinner.hide();
        });
  }

  downloadDocFile(data) {
    const DocFileName = data.DocFile;
    var DocFile = DocFileName.slice(0, -5);
  }
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.filesend = file;
    this.formData.patchValue({
      filePath: file.name
    });
  }
  saveimage() {
    var formData: any = new FormData();
    formData.append("avatar", this.filesend);
    const getLoginUrl = String.Join('/', this.apiConfigService.saveimage);
    this.apiService.apiPostRequest(getLoginUrl, formData)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.alertService.openSnackBar('Image Saved Successfully..', Static.Close, SnackBar.success);
            }
          }
          this.spinner.hide();
        });
  }
  return() {
    const addpo = String.Join('/', this.apiConfigService.returnpurchaseorder, this.routeEdit);
    this.apiService.apiGetRequest(addpo).subscribe(
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

  setArray(length: number) {
    let newArr = [];
    if (length < 10) {
      for (let i = 0; i < (10 - length); i++) {
        newArr.push({})
      }
    }
    return newArr;
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
        street:cObj.street,
        gstno: cObj.gstno,
      }
    }
    if (this.bpaList.length) {
      const bpaObj = this.bpaList.find((c: any) => c.bpnumber == formObj.supplierCode);
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
        pin: cObj.pinCode,
        phone: cObj.phone,
        email: cObj.email,
        gstno: cObj.gstNo,
      }
    }
    let list = [...this.tableData];
    list = [...list, ...this.setArray(list.length)];
    const obj = {
      heading: 'PURCHASE ORDER',
      headingObj: formObj,
      detailArray: list,
      headingObj1: { ...this.formData1.value, ...this.formData.value }
      //  {
      //   Company: this.formData.value.company,
      //   "Profit Center": this.formData.value.profitCenter,
      //   "Sale Order": this.formData.value.saleOrderType,
      //   "Purchase Order Number": this.formData.value.purchaseOrderNumber,
      //   "Supplier Code": this.formData.value.supplierCode,
      //   "Gst Number": this.formData.value.gstno,
      //   "Delivery Date": this.formData.value.deliveryDate,
      //   "Purchase Order Date": this.formData.value.purchaseOrderDate,
      //   "Advance": this.formData.value.advance,
      //   "Sale Order Number": this.formData.value.saleOrderNo,
      // },
      // detailArray: this.tableData.map((t: any) => {
      //   return {
      //     'Material Code': t.materialCode,
      //     'Material Name': t.materialName,
      //     'Tax Code': t.taxCode,
      //     'Quantity': t.qty,
      //   }
      // })
    }

    this.data = obj;

    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('printData').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 1000);

    // localStorage.setItem('printData', JSON.stringify(obj));
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree([`dashboard/preview`])
    // );

    // window.open(url, "_blank");
  }




}
