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
  selector: 'app-goodsissue',
  templateUrl: './goodsissue.component.html',
  styleUrls: ['./goodsissue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class GoodsissueComponent implements OnInit {

  sendDynTableData: any;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  formData: FormGroup;
  formData1: FormGroup;
  routeEdit = '';
  hsnsacList = [];
  debitValue = 0;
  creditValue = 0;
  totalTaxValue = 0;
  tableData = [];
  dynTableProps: any;
  btList = [];
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  glAccountList = [];
  profitCenterList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  employeesList: any;
  fdeptList: any;
  plantList: any;
  movementList: any;
  wbsElementList: any;
  ordertypeList: any;
  locationList: any;
  mreqList: any;
  mreqdetailsList: any;
  mmasterList: any;

  constructor(private commonService: CommonService,
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

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      plant: [null, [Validators.required]],
      goodsIssueId: ['0'],
      storesPerson: [null, Validators.required],
      saleOrder: [true, Validators.required],
      department: [null, Validators.required],
      saleOrderNumber: [null, Validators.required],
      productionPerson: [null, Validators.required],
      movementType: [null],
      profitCenter: [''],
      profitcenterName: [''],
      DepartmentName: [''],
      companyName: [null],
      // status: [null],
    });

    this.formData1 = this.formBuilder.group({
      allocatedqty: ['', Validators.required],
      materialCode: [''],
      qty: ['',],
      id: 0,
      changed: true,
      availableqty: [''],
      allocatedqty1: [''],
      highlight: false,
      requiredqty: [''],
      action: 'edit',
      index: 0
    });


  }

  allocatedqtyChange() {
    if ((this.formData1.value.requiredqty && (this.formData1.value.allocatedqty > this.formData1.value.requiredqty)) ||
      (this.formData1.value.allocatedqty > this.formData1.value.availableqty) ||
      ((this.formData1.value.availableqty > this.formData1.value.qty) && this.formData1.value.allocatedqty > this.formData1.value.qty)) {
      this.qtyErrorMessage();
    }
    if (this.formData1.value.allocatedqty1 + this.formData1.value.allocatedqty > this.formData1.value.qty) {
      this.qtyErrorMessage();
    }
  }

  qtyErrorMessage() {
    this.alertService.openSnackBar("Allocation Quatity cannot be greater than quatity", Static.Close, SnackBar.error);
    this.formData1.patchValue({
      allocatedqty: ''
    })
  }

  tablePropsFunc() {
    return {
      tableData: {

        // checkAll:
        // {
        //   value: false, type: 'checkbox'
        // },

        materialCode: {
          value: null, type: 'none', width: 75, maxLength: 15, disabled: true,
        },
        qty: {
          value: null, type: 'none', width: 75, maxLength: 15, disabled: true,
        },
        availableqty: {
          value: null, type: 'none', width: 100, maxLength: 7, disabled: true
        },
        allocatedqty: {
          value: null, type: 'number', width: 100, maxLength: 7, disabled: false, fieldEnable: true
        },
        // delete: {
        //   type: 'delete', width: 10
        // }
      },
      formControl: {
        costCenter: [null, [Validators.required]],
      }
    }
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'edit'
    });
  }

  // companyChange() {
  //   const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
  //   this.formData.patchValue({
  //     companyName: obj.text
  //   })
  // }

  // profitChange() {
  //   const obj = this.fdeptList.find((c: any) => c.id == this.formData.value.profitCenter);
  //   this.formData.patchValue({
  //     profitcenterName: obj.text
  //   })
  // }

  // customerChange() {
  //   const obj = this.fdeptList.find((c: any) => c.id == this.formData.value.customerCode);
  //   this.formData.patchValue({
  //     DepartmentName: obj.description
  //   })
  // }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      changed: true,
      highlight: true
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
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
    });
    this.resetForm();
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData1.patchValue(value.item);
    }
  }


  toggle() {
    if (this.formData.value.saleOrder == 'Sale Order') {
      this.getreqList();
    } else if (this.formData.value.saleOrder == 'Master Saleorder') {
      this.getPRList();
    } else if (this.formData.value.saleOrder == 'Bill of Material') {
      this.getBOMList();
    }
  }

  getGIDetail(val) {
    const jvDetUrl = String.Join('/', this.apiConfigService.getGoodsissueDetail, val);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['goodsissueasters']);
              console.log(res.response['goodsissueastersDetail']);
              // this.sendDynTableData = { type: 'edit', data: res.response['goodsissueastersDetail'] };
              this.formData.disable();
              let arr = [];
              res.response['goodsissueastersDetail'].forEach((s: any, index: number) => {
                const qty = this.mmasterList.find(resp => resp.id == s.materialCode);
                let obj = {
                  action: 'edit',
                  id: s.id ? s.id : 0,
                  index: index + 1,
                  qty: s.qty ? s.qty : 0,
                  changed: false,
                  materialCode: s.materialCode ? s.materialCode : 0,
                  availableqty: qty.availQTY ? qty.availQTY : 0,
                  allocatedqty: s.allocatedQTY ? s.allocatedQTY : 0,
                  allocatedqty1: s.allocatedQTY ? s.allocatedQTY : 0,
                  requiredqty: s.qty - s.allocatedQTY
                }
                arr.push(obj);
              })
              this.tableData = arr;
              this.toggle();
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
          this.getEmployeesList();
        });
  }

  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          this.getmaterialList();
        });
  }

  // getDepartmentData() {
  //   const getdepteUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
  //   this.apiService.apiGetRequest(getdepteUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.fdeptList = res.response['fdeptList'];
  //           }
  //         }
  //         this.getplantData();
  //       });
  // }

  // getplantData() {
  //   const getplantUrl = String.Join('/', this.apiConfigService.getPlantsList);
  //   this.apiService.apiGetRequest(getplantUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.plantList = res.response['plantsList'];
  //           }
  //         }
  //         this.getMomentTypeList();
  //       });
  // }

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
  //         this.getWbselementList();
  //       });
  // }
  // getWbselementList() {
  //   const getwbselementUrl = String.Join('/', this.apiConfigService.getwbselement);
  //   this.apiService.apiGetRequest(getwbselementUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.wbsElementList = res.response['wbsList'];
  //           }
  //         }
  //         this.getOrderTypeList();
  //       });
  // }
  // getOrderTypeList() {
  //   const getOrderTypeUrl = String.Join('/', this.apiConfigService.getordernolist);
  //   this.apiService.apiGetRequest(getOrderTypeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.ordertypeList = res.response['ordertypeList'];
  //           }
  //         }
  //         this.getmaterialList();
  //       });
  // }
  getmaterialList() {
    const getmaterialList = String.Join('/', this.apiConfigService.getmaterialdata);
    this.apiService.apiGetRequest(getmaterialList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mmasterList = res.response['mmasterList'];
            }
          }
          this.getreqdetailsList();
        });
  }
  getreqList() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderData);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mreqList = res.response['BPList'];
            }
          }
        });
  }

  getPRList() {
    const companyUrl = String.Join('/', this.apiConfigService.getPRList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mreqList = res.response['BPList'];
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
              this.mreqList = res.response['BOMList'];
            }
          }
        });
  }

  getreqdetailsList() {
    const getreqdetailsListUrl = String.Join('/', this.apiConfigService.getreqdetailsList);
    this.apiService.apiGetRequest(getreqdetailsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mreqdetailsList = res.response['mreqdetailsList'];
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

          this.getfunctionaldeptList()
        });
  }
  // getlocationList() {
  //   const getlocationUrl = String.Join('/', this.apiConfigService.getlocationList);
  //   this.apiService.apiGetRequest(getlocationUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.locationList = res.response['locationList'];
  //           }
  //         }
  //         this.getfunctionaldeptList();
  //       });
  // }

  getfunctionaldeptList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.fdeptList = res.response['fdeptList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getGIDetail(this.routeEdit);
          }
        });
  }
  // getCostcenters() {
  //   const costCenUrl = String.Join('/', this.apiConfigService.getCostCentersList);
  //   this.apiService.apiGetRequest(costCenUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.costCenterList = res.response['costcenterList'];
  //           }
  //         }
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getGIDetail(this.routeEdit);
  //         }
  //       });
  // }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  dataChange(row) {
    //this.sendDynTableData = { type: 'add', data: row.data };
  }
  reqnoselect() {
    let data = [];
    let newData = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('saleOrderNumber').value)) {
      data = this.mreqdetailsList.filter(resp => resp.saleOrderNumber == this.formData.get('saleOrderNumber').value);
    }
    if (data.length) {
      console.log(data, this.tablePropsFunc());
      data.forEach((res, index) => {
        newData.push(this.tablePropsFunc().tableData);
        newData[index].qty.value = res.qty;
        newData[index].materialCode.value = res.materialCode;
        newData[index].location.value = res.sotrageLocation;
        newData[index].joborProject.value = res.joborProject;
        newData[index].jobOrder.value = res.order;
        newData[index].costCenter.value = res.costCenter;
        newData[index].wbs.value = res.wbs;
        const qty = this.mmasterList.find(resp => resp.id == res.materialCode);
        newData[index].availableqty.value = qty.availQTY;
      })
    }
    //
    this.sendDynTableData = { type: 'add', data: newData };
  }


  getGoodsissueDetail() {
    const jvDetUrl = String.Join('/', this.apiConfigService.getGoodsissueDetail, this.formData.value.saleOrderNumber);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getSaleOrderDetail(res.response['goodsissueastersDetail']);
            }
          }
        });
  }

  getSaleOrderDetail(goodsissueastersDetail: any = []) {
    this.tableComponent.defaultValues();
    let url = '';
    if (this.formData.value.saleOrder == 'Sale Order') {
      url = this.apiConfigService.getSaleOrderDetail;
    } else if (this.formData.value.saleOrder == 'Master Saleorder') {
      url = this.apiConfigService.getPurchaseRequisitionDetail;
    } else if (this.formData.value.saleOrder == 'Bill of Material') {
      url = this.apiConfigService.getBOMDetail;
    }
    const qsDetUrl = String.Join('/', url, this.formData.value.saleOrderNumber);
    this.apiService.apiGetRequest(qsDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              let obj = { data: {}, data1: [] }
              if (this.formData.value.saleOrder == 'Sale Order') {
                obj.data = res.response['SaleOrderMasters'];
                obj.data1 = res.response['SaleOrderDetails'];
              } else if (this.formData.value.saleOrder == 'Master Saleorder') {
                obj.data = res.response['preqmasters']
                obj.data1 = res.response['preqDetail']
              } else if (this.formData.value.saleOrder == 'Bill of Material') {
                obj.data = res.response['bomMasters']
                obj.data1 = res.response['bomDetail']
              }
              // this.formData.patchValue(obj['data']);
              // this.formData.patchValue({
              //   saleOrderNumber: obj['data'].saleOrderNumber ? +obj['data'].saleOrderNumber : ''
              // })
              obj['data1'].forEach((s: any, index: number) => {
                const qty = this.mmasterList.find(resp => resp.id == s.materialCode);
                const allocatedqty = goodsissueastersDetail.find(resp => resp.materialCode == s.materialCode);
                s.action = 'edit';
                s.id = 0;
                s.index = index + 1;
                s.qty = s.qty ? s.qty : 0;
                s.changed = true;
                s.availableqty = qty.availQTY ? qty.availQTY : 0,
                  s.materialCode = s.materialCode ? s.materialCode : 0;
                s.allocatedqty = allocatedqty ? allocatedqty.allocatedQTY : 0;
                s.allocatedqty1 = allocatedqty ? allocatedqty.allocatedQTY : 0;
              })

              // this.sendDynTableData = { type: 'add', data: newData };
              this.tableData = obj['data1'];

              // this.calculate();

            }
          }
        });
  }




  back() {
    this.router.navigate(['dashboard/transaction/goodsissue']);
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData, 0);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }

    this.savegoodsissue();
  }

  return() { }

  reset() {
    this.tableData = [];
    this.formData.reset();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  savegoodsissue() {
    const arr = this.tableData.filter((d: any) => d.changed);
    const addJournal = String.Join('/', this.apiConfigService.addGoodsissue);
    const requestObj = { gibHdr: this.formData.value, gibDtl: arr };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('GoodsIssue created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/transaction/goodsissue'])
          }
          // this.reset();
          this.spinner.hide();
        }
      });
  }
}
