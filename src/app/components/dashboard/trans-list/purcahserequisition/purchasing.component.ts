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
  selector: 'app-purchasing',
  templateUrl: './purchasing.component.html',
  styleUrls: ['./purchasing.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PurchasingComponent implements OnInit {

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
  listOfProdList = [{ id: "Stores consumption", text: "Stores consumption" },
  { id: "General services", text: "General services" }, { id: "Production", text: "Production" }];

  // details props
  tableData = [];
  dynTableProps: any;
  routeEdit = '';
  materialList: any;
  pcgroupList: any;
  functionaldeptList: any;
  costunitList: any;

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
  //       materialCode: {
  //         value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 200
  //       },
  //       requiredQty: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },
  //       stockQty: {
  //         value: null, type: 'number', width: 100, maxLength: 50
  //       },        
  //       delete: {
  //         type: 'delete', width: 50
  //       }
  //     },

  //     formControl: {
  //       reservationNumber: [null, [Validators.required]],
  //     }
  //   };
  // }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      id: 0,
      company: [null, [Validators.required]],
      departmentName: [null],
      profitcenterName: [''],
      companyName: [null],
      plant: [null],
      department: [null, [Validators.required]],
      branch: [null],
      costCenter: [null],
      profitCenter: [null, [Validators.required]],
      wbs: [null],
      requiredfor: [null, [Validators.required]],
      projectName: [null],
      requisitionNumber: [null],
      requisitionDate: [null, [Validators.required]],
      narration: [null],
      addWho: [null],
      addDate: [null],
      editWho: null,
      editDate: [null],
      recomendedBy: null,
      recomendedDate: [null],
      approvedBy: null,
      approvedDate: [null],
      status: [null],
    });

    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      materialName: [''],
      netWeight: [0],
      qty: ['', Validators.required],
      stockQty: [0],
      id: [0],
      highlight: false,
      action: 'editDelete',
      index: 0
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
          this.getdepartmentData();
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
  //         this.getcostunitsData();
  //       });
  // }
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
  //         this.getdepartmentData();
  //       });
  // }
  getdepartmentData() {
    const getdepartmentTypeUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
    this.apiService.apiGetRequest(getdepartmentTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.functionaldeptList = res.response['fdeptList'];
            }
          }
          this.getProfitcenterData();
        });
  }

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
  //   const getccUrl = String.Join('/', this.apiConfigService.GetCostCenterList);
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

          this.getmaterialData()
        });
  }
  // getPurchaseGroupData() {
  //   const getpcUrl = String.Join('/', this.apiConfigService.getPurchaseGroupList);
  //   this.apiService.apiGetRequest(getpcUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         console.log(res);
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.pcgroupList = res.response['PCGroupsList'];
  //           }
  //         }

  //         this.getmaterialData()
  //       });
  // }
  getmaterialData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getmaterialList = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
    this.apiService.apiGetRequest(getmaterialList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              
              this.materialList = res.response['mmasterList'];
            }
          }
          // this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getPurchasingDetails(this.routeEdit);
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
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getPurchasingDetails(this.routeEdit);
  //         }
  //       });
  // }

  getPurchasingDetails(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getpurchasereqDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.setValue(res.response['preqmasters']);

              this.formData.disable();

              res.response['preqDetail'].forEach((s: any, index: number) => {
                const obj = this.materialList.find((m: any) => m.id == s.materialCode);
                s.materialName = obj.text
                s.action = 'editDelete';
                s.index = index + 1;
                s.qty = s.qty;
                s.stockQty = obj.closingQty;
              })
              this.tableData = res.response['preqDetail'];
              // this.sendDynTableData = { type: 'edit', data: res.response['preqDetail'] };
            }
          }
        });
  }

  // emitColumnChanges(data) {
  //   this.tableData = data.data;
  // }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete',
      id: 0
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
  //     profitcenterName: obj.name
  //   })
  // }

  // customerChange() {
  //   const obj = this.functionaldeptList.find((c: any) => c.id == this.formData.value.departmentName);
  //   this.formData.patchValue({
  //     departmentName: obj.description
  //   })
  // }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true,
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


  materialCodeChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      stockQty: obj.closingQty,
      materialName: obj.text,
      netWeight: obj.netWeight,
    })
  }

  back() {
    this.router.navigate(['dashboard/transaction/purcahserequisition'])
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.savepurcahserequisition();
  }

  savepurcahserequisition() {
    const addprreq = String.Join('/', this.apiConfigService.addpurchasereq);
    const requestObj = { preqHdr: this.formData.value, preqDtl: this.tableData };
    this.apiService.apiPostRequest(addprreq, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Purchase Requisition created Successfully..', Static.Close, SnackBar.success);
            this.spinner.hide();
            this.router.navigateByUrl('dashboard/transaction/purcahserequisition');
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnpurchasereq, this.routeEdit);
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
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

}
