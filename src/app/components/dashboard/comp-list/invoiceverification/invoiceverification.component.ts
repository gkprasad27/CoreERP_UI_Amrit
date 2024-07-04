import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';

@Component({
  selector: 'app-invoiceverification',
  templateUrl: './invoiceverification.component.html',
  styleUrls: ['./invoiceverification.component.scss']
})
export class InvoiceverificationComponent implements OnInit {

  sendCapacityDynTableData: any;
  sendActivityDynTableData: any;
  sendDynTableData: any;
  companyList = [];
  plantList = [];
  locList = [];
  empList = [];
  uomList = [];
  costCenterList = [];
  workCenterTypeList = [{ id: 'Machine', text: 'Machine' }, { id: 'Labour', text: 'Labour' }, { id: 'Set up', text: 'Set up' }, { id: 'Production line', text: 'Production line' }, { id: 'Maintenance', text: 'Maintenance' }]
  usageList = [{ id: 'Routing', text: 'Routing' }, { id: 'Maintenance task list', text: 'Maintenance task list' }, { id: 'Quality inspection', text: 'Quality inspection' }, { id: 'Standard net work', text: 'Standard net work' }]

  modelFormData: FormGroup;
  formData: any;
  routeEdit = '';
  dynTablePropsActivity: any;
  dynTablePropsCapacity: any;

  activityTableData = [];
  capacityTableData = [];
  formulaList: any;
  profitCenterList: any;
  branchList: any;
  purchaseordernoList: any;
  materialList: any;
  costunitList: any;
  segmentList: any;
  bpaList: any;
  glList: any;

  constructor(
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
  }

  tablePropsActivityFunc() {
    return {
      tableData: {
        materialCode: {

          value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        description: {
          value: null, type: 'text', width: 150
        },
        price: {
          value: null, type: 'number', width: 150
        },
        unit: {
          value: null, type: 'dropdown', list: this.costunitList, id: 'objectNumber', text: 'description',
          disabled: false, displayMul: true
        },
        qty: {
          value: null, type: 'number', width: 150
        },
        value: {
          value: null, type: 'number', width: 150
        },
        plant: {
          value: null, type: 'dropdown', list: this.plantList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        accountKeyAccount: {
          value: null, type: 'number', width: 150
        },
        accountKey: {
          value: null, type: 'number', width: 150
        },

        otherExpenses: {
          value: null, type: 'number', width: 150
        },
        otherExpensesAccount: {
          value: null, type: 'number', width: 150
        },
        account: {
          value: null, type: 'dropdown', list: this.glList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        materialCode: [null, [Validators.required]]
      }
    }
  }

  tablePropsCapacityFunc() {
    return {
      tableData: {
        account: {
          value: null, type: 'dropdown', list: this.glList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        amount: {
          value: null, type: 'number', width: 150
        },
        drcr: {
          value: null, type: 'text', width: 150
        },
        plant: {
          value: null, type: 'dropdown', list: this.plantList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        profitCenter: {
          value: null, type: 'dropdown', list: this.profitCenterList, id: 'code', text: 'description', displayMul: true, width: 100
        },
        segment: {
          value: null, type: 'dropdown', list: this.segmentList, id: 'id', text: 'name',
          disabled: false, displayMul: true
        },
        branch: {
          value: null, type: 'dropdown', list: this.branchList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        text: {
          value: null, type: 'text', width: 150
        },

        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        account: [null, [Validators.required]]
      }
    }
  }

  emitColumnActivityData(data) {
    this.activityTableData = data.data;
  }

  emitColumnCapacityData(data) {
    this.capacityTableData = data.data;
  }

  formDataGroup() {
    this.modelFormData = this.formBuilder.group({
      company: [null, [Validators.required]],
      plant: [null, [Validators.required]],
      purchaseOrderNo: [null],
      supplierCode: [null],
      branch: [null],
      profitCenter: [null],
      description: [null],
      invoiceAmount: [null],
      invoiceReferenceNo: [null],
      invoiceDate: [null],
      grnno: [null],
      grndate: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null],
    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
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
              this.modelFormData.patchValue({
                company: this.companyList.length ? this.companyList[0].id : null
              })
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
              this.bpaList = res.response['bpaList'];
              this.bpaList = res.response['bpaList'].filter(resp => resp.bpTypeName == 'Vendor')

            }
          }
          this.getGLaccData();
        });
  }
  getGLaccData() {
    const getdptcnUrl = String.Join('/', this.apiConfigService.getGLAccountListbyCatetory);
    this.apiService.apiGetRequest(getdptcnUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'];
            }
          }
          this.getplantsList();
        });
  }
  getplantsList() {
    const getplantsList = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getplantsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantList = res.response['plantsList'];

            }
          }
          this.getBranchList();
        });
  }
  getBranchList() {
    const branchUrl = String.Join('/', this.apiConfigService.getBranchList);
    this.apiService.apiGetRequest(branchUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.branchList = res.response['branchsList'];
            }
          }
          this.getcostunitData();
        });
  }

  getcostunitData() {
    const getcostunittypeUrl = String.Join('/', this.apiConfigService.getCostUnitListList);
    this.apiService.apiGetRequest(getcostunittypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
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
          this.getmaterialData();
        });
  }
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
          this.getsegmentList();
        });
  }


  getsegmentList() {
    const getsegmentList = String.Join('/', this.apiConfigService.getSegmentList);
    this.apiService.apiGetRequest(getsegmentList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.segmentList = res.response['segmentList'];
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
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.purchaseordernoList = res.response['purchaseordernoList'];
            }
          }
          this.dynTablePropsActivity = this.tablePropsActivityFunc();
          this.dynTablePropsCapacity = this.tablePropsCapacityFunc();

          if (this.routeEdit != '') {
            this.getinvoiceDetail(this.routeEdit);
          }
          this.spinner.hide();
        });
  }

  getinvoiceDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getinvoiceDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.setValue(res.response['ivcmasters']);
              this.sendActivityDynTableData = { type: 'edit', data: res.response['ivcDetail'] };
              this.sendCapacityDynTableData = { type: 'edit', data: res.response['iecDetail'] };
            }
          }
        });
  }

  back() {
    this.router.navigate(['dashboard/master/invoiceverification'])
  }


  reset() {
    this.modelFormData.reset();
    this.activityTableData = [];
    this.capacityTableData = [];

    this.sendCapacityDynTableData = { type: 'reset', data: [] };
    this.sendActivityDynTableData = { type: 'reset', data: [] };
  }

  save() {
    this.activityTableData = this.commonService.formatTableData(this.activityTableData);
    this.capacityTableData = this.commonService.formatTableData(this.capacityTableData);
    this.saveinvoice();

  }
  saveinvoice() {
    const addinvoice = String.Join('/', this.apiConfigService.addinvoice);
    const requestObj = { ivcHdr: this.modelFormData.value, ivcDtl: this.activityTableData, ioeDtl: this.capacityTableData };
    this.apiService.apiPostRequest(addinvoice, requestObj).subscribe(
      response => {
        const res = response;
        this.activityTableData = [];
        this.capacityTableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Invoice Verification created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

}
