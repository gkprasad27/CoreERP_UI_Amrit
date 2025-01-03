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
import { MatDialog } from '@angular/material/dialog';
import { MaterialRequisitionViewComponent } from './material-requisition-view/material-requisition-view.component';
@Component({
  selector: 'app-materialrequisition',
  templateUrl: './materialrequisition.component.html',
  styleUrls: ['./materialrequisition.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class MaterialrequisitionComponents implements OnInit {

  formData: FormGroup;
  formData1: FormGroup;
  sendDynTableData: any;

  @ViewChild('tableRef', { static: false }) tableComponent: TableComponent;


  routeEdit = '';
  hsnsacList = [];
  debitValue = 0;
  creditValue = 0;
  totalTaxValue = 0;
  tableData = [];
  tableData1 = [];
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
  employeesList: any[] = [];
  citemList: any[] = [];
  mechenaryList: any[] = [];
  fdeptList: any;
  plantList: any;
  movementList: any;
  wbsElementList: any;
  ordertypeList: any;
  locationList: any;
  mmasterList: any;
  costunitList: any;

  filePath: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.getGoodsissueDetail(this.routeEdit);
    this.formDataGroup();
    this.getEmployeesList();
    // this.getCompanyList();
    // this.getfunctionaldeptList();
    /// this.formData.controls['requisitionNumber'].disable();
  }

  formDataGroup() {
    this.formData1 = this.formBuilder.group({
      allocatedPerson: ['', Validators.required],
      typeofWork: [''],
      mechine: [''],
      startDate: [''],
      endDate: [''],
      remarks: [''],
      workStatus: [''],

      productionPlanDate: [null],
      productionTargetDate: [null],
      materialName: [''],
      materialCode: [''],
      productionTag: [''],
      saleOrderNumber: [''],
      company:[''],
      bomKey: [''],
      bomName: [''],

      highlight: false,
      id: 0,
      action: 'editView',
      index: 0
    });
    // this.formData = this.formBuilder.group({
       //: [null//],
    //   plant: [null, [Validators.required]],
    //   branch: [null],
    //   project: [null],
    //   department: [null],
    //   requisitionNmber: [null],
    //   bomorderNumber: [null],
    //   requisitionDate: [null],
    //   addWho: [null],
    //   addDate: [null],
    //   editDate: [null],
    //   editWho: [null],
    //   status: [null],
    // });
  }

  tablePropsFunc() {
    return {
      tableData: {

        materialCode: {
          value: null, type: 'none', width: 100
        },
        qty: {
          value: null, type: 'none', width: 75, maxLength: 15
        },

        // sotrageLocation: {
        //   value: null, type: 'dropdown', list: this.locationList, id: 'locationId', text: 'description', displayMul: false, width: 100
        // },

        // joborProject: {
        //   value: null, type: 'dropdown', list: this.costunitList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // costCenter: {
        //   value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 100
        // },

        // profitCenter: {
        //   value: null, type: 'dropdown', list: this.profitCenterList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // wbs: {
        //   value: null, type: 'dropdown', list: this.wbsElementList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // order: {
        //   value: null, type: 'dropdown', list: this.ordertypeList, id: 'orderType', text: 'description', displayMul: false, width: 100
        // },
        // price: {
        //   value: null, type: 'number', width: 75, maxLength: 15
        // },
        // value: {
        //   value: null, type: 'text', width: 75, maxLength: 15
        // },

        // delete: {
        //   type: 'delete', width: 10
        // }
      },
      formControl: {
        costCenter: [null, [Validators.required]],
      }
    }
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          this.getCommitmentList('Production');
          this.getCommitmentList('Mechenary');
        });
  }

  getCommitmentList(type: any) {
    const cmntUrl = String.Join('/', this.apiConfigService.getCommitmentLists, type);
    this.apiService.apiGetRequest(cmntUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // const list = res.response['citemList'].filter((c: any) => c.type == 'Production');
              // const listM = res.response['citemList'].filter((c: any) => c.type == 'Mechenary');
              if (type == 'Production') {
                this.citemList = res.response['citemList'];
              } else if (type == 'Mechenary') {
                this.mechenaryList = res.response['citemList'];
              }
            }
          }
        });
  }
  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true,
      //   changed: true
    });
    let data: any = this.tableData1;
    this.tableData1 = null;
    this.tableComponent.defaultValues();
    if (this.formData1.value.index == 0) {
      data.forEach((d: any) => {
        if (d.checkbox) {
          const obj = this.formData1.value;
          Object.keys(obj).forEach((key: any) => {
            d[key] = obj[key] ? obj[key] : d[key]
          })
        }
        d.checkbox = false
      })
    } else {
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData1 = data;
    });
    this.resetForm();
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editView'
    });
  }


  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData1 = this.tableData1.filter((res: any) => res.index != value.item.index);
    } else if (value.action === 'Edit') {
      this.formData1.patchValue(value.item);
    } else {
      this.inspectioncheck(value);
    }
  }


  getGoodsissueDetail(val) {
    const jvDetUrl = String.Join('/', this.apiConfigService.getGoodsissueDetail, val);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // this.formData.patchValue(res.response['goodsissueasters']);
              // console.log(res.response['mreqDetail']);
              let arr = [];
              res.response['goodsissueastersDetail'].forEach((s: any, index: number) => {
                // const qty = this.mmasterList.find(resp => resp.id == s.materialCode);
                let obj = {
                  // action: 'editView',
                  // id: s.id ? s.id : 0,
                  // index: index + 1,
                  qty: s.qty ? s.qty : 0,
                  // changed: false,
                  status: s.status ? s.status : '',
                  materialCode: s.materialCode ? s.materialCode : 0,
                  // availableqty: qty.availQTY ? qty.availQTY : 0,
                  saleOrderNumber: s.saleOrderNumber ? s.saleOrderNumber : 0,
                  bomNumber: s.bomNumber ? s.bomNumber : '',
                  materialName: s.materialName ? s.materialName : null,
                  allocatedqty: s.allocatedQTY ? s.allocatedQTY : 0,
                  // requiredqty: s.qty - s.allocatedQTY
                }
                arr.push(obj);
              })
              this.tableData = arr;

              // this.sendDynTableData = { type: 'editView', data: res.response['goodsissueastersDetail'] };
              // this.formData.disable();
            }
          }
        });
  }

  onEditEmit(event: any) {
    this.getTagsissueDetail(event.saleOrderNumber, event.materialCode,event.bomNumber);
  }

  getTagsissueDetail(val, val1,bomNumber) {
    this.filePath = '';
    this.tableComponent.defaultValues();
    const jvDetUrl = String.Join('/', this.apiConfigService.getTagsissueDetail, val, val1,bomNumber);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // this.formData.patchValue(res.response['goodsissueasters']);
              // console.log(res.response['mreqDetail']);
              let arr = [];
              res.response['tagsDetail'].forEach((s: any, index: number) => {
                // const qty = this.mmasterList.find(resp => resp.id == s.materialCode);
                let obj = {
                  // action: 'editView',
                  // id: s.id ? s.id : 0,
                  // index: index + 1,
                  // qty: s.qty ? s.qty : 0,
                  // changed: false,
                  // materialCode: s.materialCode ? s.materialCode : 0,
                  // availableqty: qty.availQTY ? qty.availQTY : 0,
                  // saleOrderNumber: s.saleOrderNumber ? s.saleOrderNumber : 0,
                  // allocatedqty: s.allocatedQTY ? s.allocatedQTY : 0,
                  // requiredqty: s.qty - s.allocatedQTY,
                  materialName: s.materialName ? s.materialName : null,
                  allocatedPerson: s.allocatedPerson ? s.allocatedPerson : '',
                  endDate: s.endDate ? s.endDate : '',
                  // isReject: s.isReject ? s.isReject : '',
                  materialCode: s.materialCode ? s.materialCode : '',
                  mechine: s.mechine ? s.mechine : '',
                  productionTag: s.productionTag ? s.productionTag : '',
                  remarks: s.remarks ? s.remarks : '',
                  status: s.status ? s.status : '',
                  saleOrderNumber: s.saleOrderNumber ? s.saleOrderNumber : '',
                  startDate: s.startDate ? s.startDate : '',
                  productionPlanDate: s.productionPlanDate ? s.productionPlanDate : '',
                  productionTargetDate: s.productionTargetDate ? s.productionTargetDate : '',
                  typeofWork: s.typeofWork ? s.typeofWork : '',
                  workStatus: s.workStatus ? s.workStatus : '',
                  bomKey: s.bomKey ? s.bomKey : '',
                  company:s.company?s.company:'',
                  bomName: s.bomName ? s.bomName : '',            
                  id: s.id ? s.id : '',
                  action: s.status != 'Rejected' ? 'editView' : 'view',
                  index: index + 1,
                  checkbox: false
                }
                this.filePath = s.filePath;
                arr.push(obj);
              })
              this.tableData1 = arr;


              // this.sendDynTableData = { type: 'editView', data: res.response['goodsissueastersDetail'] };
              // this.formData.disable();
            }
          }
        });
  }

  downLoadFile() {
    const url = String.Join('/', this.apiConfigService.getFile, this.filePath);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }



  inspectioncheck(event: any) {
    this.dialog.open(MaterialRequisitionViewComponent, {
      width: '100%',
      height: '700px',
      data: {
        row: event.item,
        employeesList: this.employeesList,
        mechenaryList: this.mechenaryList
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
          this.getDepartmentData();
        });
  }
  // getcostunitsData() {
  //   const getsecondelementUrl = String.Join('/', this.apiConfigService.getcostingunitsList);
  //   this.apiService.apiGetRequest(getsecondelementUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.costunitList = res.response['costunitList'];
  //             this.costunitList = res.response['costunitList'].filter(resp => resp.costUnitType == 'Project')
  //           }
  //         }
  //         this.getbranchList();
  //       });
  // }
  // getbranchList() {
  //   const getbranchList = String.Join('/', this.apiConfigService.getBranchList);
  //   this.apiService.apiGetRequest(getbranchList)
  //     .subscribe(
  //       response => {
  //         const res = response;

  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.branchList = res.response['branchsList'];
  //           }
  //         }
  //         this.getDepartmentData();
  //       });
  // }

  getDepartmentData() {
    const getdepteUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
    this.apiService.apiGetRequest(getdepteUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.fdeptList = res.response['fdeptList'];
            }
          }
          this.getprofircenterData();
        });
  }

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
  //         this.getprofircenterData();
  //       });
  // }

  getprofircenterData() {
    const getprofircenterData = String.Join('/', this.apiConfigService.getProfitCentersList);
    this.apiService.apiGetRequest(getprofircenterData)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getGoodsissueDetail(this.routeEdit);
          }
          //this.getMaterialTypeData();
        });
  }
  // getMaterialTypeData() {
  //   const getMaterialTypeUrl = String.Join('/', this.apiConfigService.getMaterialtypeList);
  //   this.apiService.apiGetRequest(getMaterialTypeUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;

  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.mmasterList = res.response['matypeList'];
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
  //         this.getlocationList();
  //       });
  // }

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
  //         this.getCostcenters();
  //       });
  // }
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
  //           this.getGoodsissueDetail(this.routeEdit);
  //         }
  //       });
  // }

  emitColumnChanges(data) {
    this.tableData = data.data;
    //this.dataChange(data);
  }

  dataChange(row) {
    // this.sendDynTableData = { type: 'add', data: row.data };
  }



  back() {
    this.router.navigate(['dashboard/transaction/materialrequisition']);
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0) {
      return;
    }

    this.savemreq();
  }

  return() { }

  reset() {
    this.tableData = [];
    this.formData.reset();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  savemreq() {
    const addJournal = String.Join('/', this.apiConfigService.addProductionissue);
    const requestObj = { mreqDtl: this.tableData1 };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response;
        // this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Material Req created Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/transaction/materialrequisition'])
          }
          // this.reset();
          this.spinner.hide();
        }
      });
  }
}
