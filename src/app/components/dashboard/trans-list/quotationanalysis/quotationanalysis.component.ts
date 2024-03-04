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
  selector: 'app-quotationanalysis',
  templateUrl: './quotationanalysis.component.html',
  styleUrls: ['./quotationanalysis.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class QuotationAnalysisComponent implements OnInit {

  // form control
  formData: FormGroup;
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
  // details props
  tableData = [];
  dynTableProps: any;
  routeEdit = '';
  materialList: any;
  pcgroupList: any;
  functionaldeptList: any;
  ptypeList: any;
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
    this.getCompanyList();
  }

  tablePropsFunc() {
    return {
      tableData: {
        materialCode: {
          value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        unitPrice: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        discount: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        netPrice: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        tax: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        total: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        delivery: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        credit: {
          value: null, type: 'number', width: 100, maxLength: 50
        },
        advance: {
          value: null, type: 'number', width: 100, maxLength: 50
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

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      plant: [null],
      branch: [null],
      profitCenter: [null],
      supplier: [null],
      quotationNumber: [null],
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
              this.bpaList = res.response['bpaList'].filter(resp => resp.bpTypeName == 'Vendor')

            }
          }
          this.getplantList();
        });
  }


  getplantList() {
    const getplantList = String.Join('/', this.apiConfigService.getplantList);
    this.apiService.apiGetRequest(getplantList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantList = res.response['plantList'];
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
          this.getProfitcenterData();
        });
  }

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

          this.getmaterialData()
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
          this.getWbsList();
        });
  }

  getWbsList() {
    const segUrl = String.Join('/', this.apiConfigService.getwbselement);
    this.apiService.apiGetRequest(segUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.wbsList = res.response['wbsList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getQuotationAnalysysDetails(this.routeEdit);
          }
        });
  }

  getQuotationAnalysysDetails(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getquotationanalysisDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.setValue(res.response['qamasters']);
              this.sendDynTableData = { type: 'edit', data: res.response['qaDetail'] };
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
    this.router.navigate(['dashboard/transaction/quotationanalysis'])
  }

  save() {
    this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.savequotationanalysis();
  }

  savequotationanalysis() {
    const addprreq = String.Join('/', this.apiConfigService.addquotationanalysis);
    const requestObj = { qaHdr: this.formData.value, qaDtl: this.tableData };
    this.apiService.apiPostRequest(addprreq, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Analysis created Successfully..', Static.Close, SnackBar.success);
            //this.spinner.hide();
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnquotationanalysis, this.routeEdit);
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
