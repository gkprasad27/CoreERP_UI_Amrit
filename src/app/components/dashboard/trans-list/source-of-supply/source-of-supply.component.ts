import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-source-of-supply',
  templateUrl: './source-of-supply.component.html',
  styleUrls: ['./source-of-supply.component.scss']
})
export class SourceOfSupplyComponent implements OnInit {

  // form control
  formData: FormGroup;
  sendDynTableData: any;

  // header props

  materialList = [];
  costunitList = [];
  supplyCodeList = [];
  employeesList = [];


  // details props
  tableData = [];
  dynTableProps: any;
  routeEdit = '';
  stateList: any;
  bpaList: any;

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
    this.getmaterialData();
  }


  tablePropsFunc() {
    return {
      tableData: {
        materialCode: {
          value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        description: {
          value: null, type: 'text', width: 100, maxLength: 50
        },
        priceperUnit: {
          value: null, type: 'text', width: 100, maxLength: 50
        },
        unit: {
          value: null, type: 'dropdown', list: this.costunitList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        lastSupplyPrice: {
          value: null, type: 'text', width: 100, maxLength: 50
        },
        lastSupplyOn: {
          value: new Date(), type: 'datepicker', width: 100, disabled: true
        },
        ponumber: {
          value: null, type: 'text', width: 100, maxLength: 50
        },
        podate: {
          value: new Date(), type: 'datepicker', width: 100, disabled: true
        },
        delete: {
          type: 'delete', width: 10
        }
      },

      formControl: {
        ponumber: [null, [Validators.required]],
      }
    };
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      supplierCode: [null, [Validators.required]],
      supplierName: [null],
      phone: [null],
      mobile: [null],
      email: [null],
      place: [null],
      state: [null],
      transportMethod: [null],
      deliveryTime: [null],
      contactPerson: [null],
      narration: [null],
    });
  }


  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
            }
          }
          this.getcostunitsData();
        });
  }

  getcostunitsData() {
    const getsecondelementUrl = String.Join('/', this.apiConfigService.getcostingunitsList);
    this.apiService.apiGetRequest(getsecondelementUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
            }
          }
          this.getstateList();
        });
  }
  getstateList() {
    const getstateList = String.Join('/', this.apiConfigService.getstatesList);
    this.apiService.apiGetRequest(getstateList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stateList = res.response['StatesList'];
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
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpaList = res.response['bpaList'];
              this.bpaList = res.response['bpaList'].filter(resp => resp.bpTypeName == 'Domestic vendors')

            }
          }
          this.getplantList();
        });
  }
  getplantList() {
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
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getSourceOfSupplyDetails(this.routeEdit);
          }
        });
  }

  getSourceOfSupplyDetails(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getsupplierDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.setValue(res.response['ssmasters']);
              console.log(res.response['ssDetail']);
              this.sendDynTableData = { type: 'edit', data: res.response['ssDetail'] };
              this.formData.disable();
            }
          }
        });
  }


  emitColumnChanges(data) {
    this.tableData = data.data;
  }


  back() {
    this.router.navigate(['dashboard/transaction/sourceofsupply'])
  }

  save() {
    this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.saveSourcesupply();
  }

  saveSourcesupply() {
    const addssapply = String.Join('/', this.apiConfigService.addsupplierreq);
    const requestObj = { ssHdr: this.formData.value, ssDtl: this.tableData };
    this.apiService.apiPostRequest(addssapply, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Source Supply created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnsupplierreq, this.routeEdit);
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
