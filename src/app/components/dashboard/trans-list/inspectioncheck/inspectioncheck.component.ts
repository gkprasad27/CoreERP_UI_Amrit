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
import { InspectionComponent } from './inspection/inspection.component';
import { MatDialog } from '@angular/material/dialog';
import { BalanceCertificateComponent } from './balance-certificate/balance-certificate.component';
@Component({
  selector: 'app-inspectioncheck',
  templateUrl: './inspectioncheck.component.html',
  styleUrls: ['./inspectioncheck.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class InspectioncheckComponent implements OnInit {

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

  materialcode: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
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

      completionDate: [''],
      status: [''],
      inspectionType: [''],
      inspectionTypeValue: [''],
      completedBy: [''],
      description: [''],


      // typeofWork: [''],
      // mechine: [''],
      // startDate: [''],
      // endDate: [''],
      // remarks: [''],
      // workStatus: [''],
      // materialName: [''],
      // materialCode: [''],
      // productionTag: [''],
      saleOrderNumber: [''],
    });
    // this.formData = this.formBuilder.group({
    //   company: [null, [Validators.required]],
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

  approveOrReject() {
    this.formData1.patchValue({
      inspectionType: this.formData1.value.inspectionTypeValue ? 'Sampling Inspection' : '100% Inspection',
    });
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
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
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
          // this.getCommitmentList();
        });
  }

  getCommitmentList() {
    const cmntUrl = String.Join('/', this.apiConfigService.getCommitmentList);
    this.apiService.apiGetRequest(cmntUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const list = res.response['citemList'].filter((c: any) => c.type == 'Production');
              const listM = res.response['citemList'].filter((c: any) => c.type == 'Mechenary');
              this.citemList = list;
              this.mechenaryList = listM;
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
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
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
      action: 'edit'
    });
  }


  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData1 = this.tableData1.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData1.patchValue(value.item);
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
                  // action: 'edit',
                  id: s.id ? s.id : 0,
                  // index: index + 1,
                  qty: s.qty ? s.qty : 0,
                  // changed: false,
                  materialCode: s.materialCode ? s.materialCode : 0,
                  // availableqty: qty.availQTY ? qty.availQTY : 0,
                  saleOrderNumber: s.saleOrderNumber ? s.saleOrderNumber : 0,
                  materialName: s.materialName ? s.materialName : null,
                  allocatedqty: s.allocatedQTY ? s.allocatedQTY : 0,
                  // requiredqty: s.qty - s.allocatedQTY
                }
                arr.push(obj);
              })
              this.tableData = arr;

              // this.sendDynTableData = { type: 'edit', data: res.response['goodsissueastersDetail'] };
              // this.formData.disable();
            }
          }
        });
  }

  onEditEmit(event: any) {
    this.getQCissueDetail(event.saleOrderNumber, event.materialCode);
  }

  getQCissueDetail(val, val1) {
    this.tableComponent.defaultValues();
    const jvDetUrl = String.Join('/', this.apiConfigService.getQCissueDetail, val, val1);
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
                  // action: 'edit',
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
                  saleOrderNumber: s.saleOrderNumber ? s.saleOrderNumber : '',
                  startDate: s.startDate ? s.startDate : '',
                  typeofWork: s.typeofWork ? s.typeofWork : '',
                  workStatus: s.workStatus ? s.workStatus : '',
                  id: s.id ? s.id : '',
                  checkbox: false,
                  button: 'Inspection Check'
                  // action: 'edit',
                  // index: index + 1,
                }
                arr.push(obj);
              })
              this.formData1.patchValue({
                saleOrderNumber: val
              })
              this.materialcode = val1;
              this.tableData1 = arr;

              // this.sendDynTableData = { type: 'edit', data: res.response['goodsissueastersDetail'] };
              // this.formData.disable();
            }
          }
        });
  }

  tableCheckboxEvent(event: any) {
    this.tableData1.forEach((res: any) => res.checkbox = (res.id == event.item.id) ? event.flag.checked : res.checkbox);
    console.log(this.tableData1);
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
    const arr = this.tableData1.filter((t: any) => t.checkbox);
    const addJournal = String.Join('/', this.apiConfigService.addinspectioncheck);
    const requestObj = { icDtl: arr, icHdr: this.formData1.value };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Material Req created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/transaction/inspectioncheck'])
          }
          // this.reset();
          this.spinner.hide();
        }
      });
  }


  tableButtonEvent(event: any) {
    this.inspectioncheck(event);
  }


  inspectioncheck(event: any) {
    this.dialog.open(InspectionComponent, {
      width: '100%',
      height: '700px',
      data: event.item
    });
  }

  balanceCertificate() {
    const arr = this.tableData1.filter((t: any) => t.checkbox);

    if (!arr.length) {
      this.alertService.openSnackBar('Please select production tag', Static.Close, SnackBar.error);
      return;
    }

    this.dialog.open(BalanceCertificateComponent, {
      width: '100%',
      height: '700px',
      data: { materialcode: this.materialcode, tableData: arr }
    });

  }

  print() {
    localStorage.setItem('printData', '');
    const getQCReportDetail = String.Join('/', this.apiConfigService.getQCReportDetail, this.formData1.value.saleOrderNumber, this.materialcode);
    this.apiService.apiGetRequest(getQCReportDetail)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              // this.profitCenterList = res.response['profitCenterList'];
              this.printData(res.response);
            }
          }
        });
  }

  printData(res) {
    let arr = [];
    if (res.tagsDetail && res.tagsDetail.length) {
      res.tagsDetail.forEach((t: any) => {
        const obj = {
          Parameter: t.parameter,
          Specification: t.spec,
          UOM: t.uom,
          Instrument: t.instrument,
          [t.tagName]: t.result,
          description: t.description,
        }
        if (!arr.length) {
          arr.push(obj);
        } else {
          const index = arr.findIndex((a: any) => a.Parameter == t.parameter);
          if(index != -1) {
            arr[index][t.tagName] = t.result
          } else {
            arr.push(obj);
          }
        }
      })
    }
    const obj = {
      heading: 'INSPECTION REPORT',
      headingObj: {
        Amount: res.SaleorderMaster.amount,
        'company': res.SaleorderMaster.company,
        supplierName: res.SaleorderMaster.supplierName,
        poNumber: res.SaleorderMaster.poNumber,
        poDate: res.SaleorderMaster.poDate,
        description: res.QCData.materialName,
        heatNumber: res.QCData.heatNumber,
        drgNo: res.QCData.drgNo,
      },
      detailArray: arr
    }
    localStorage.setItem('inspectionPrintData', JSON.stringify(obj));
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`dashboard/inspection-preview`])
    );

    window.open(url, "_blank");
  }

}
