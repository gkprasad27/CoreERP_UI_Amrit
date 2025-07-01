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
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from '../../../../reuse-components/dynamic-table/dynamic-table.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

interface Usage {
  value: string;
  viewValue: string;
}

interface Element {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-primary-cost-element',
  imports: [ CommonModule , TranslatePipe , DynamicTableComponent, MatCardModule],
  templateUrl: './primary-cost-element.component.html',
  styleUrls: ['./primary-cost-element.component.scss']
})
export class PrimaryCostElementComponent implements OnInit {

  dynTableProps: any;
  tableData = [];
  sendDynTableData: any;

  companyList = [];
  glAccountList = [];
  glAccNameList = [];
  UomList: any;
  usage: Usage[] =
    [
      { value: 'Material cost', viewValue: 'Material cost' },
      { value: ' Labour cost', viewValue: ' Labour cost' },
      { value: 'Personal cost', viewValue: 'Personal cost' },
      { value: 'Manufacturing cost', viewValue: 'Manufacturing cost' },
      { value: 'Administrative cost', viewValue: 'Administrative cost' },
      { value: 'Distribution cost', viewValue: 'Distribution cost' },
      { value: 'Selling cost', viewValue: 'Selling cost' },
      { value: 'Marketing cost', viewValue: 'Marketing cost' },
      { value: 'Non cost', viewValue: 'Non cost' },
      { value: 'Revenue', viewValue: 'Revenue' }
    ];
  element: Element[] =
    [
      { value: 'Direct cost', viewValue: 'Direct cost' },
      { value: 'Indirect cost', viewValue: 'Indirect cost' },
      { value: 'Revenue', viewValue: 'Revenue' }
    ];
  PRCList: any;
  coaList: any;
  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public commonService: CommonService,
    public route: ActivatedRoute,
  ) {
    this.getcompaniesList();

  }

  ngOnInit(): void {
  }

  tablePropsFunc() {
    return {
      tableData: {
        id: {
          value: 0, type: 'autoInc', width: 2, disabled: true,
        },
        company: {
          value: null, type: 'dropdown', list: this.companyList, id: 'id', text: 'text', displayMul: false, width: 100
        },
        chartofAccount: {
          value: null, type: 'dropdown', list: this.coaList, id: 'code', text: 'desctiption', displayMul: false, width: 100
        },
        glAccount: {
          value: null, type: 'text', width: 100, maxLength: 10, disabled: true
        },
        glAccountName: {
          value: null, type: 'text', width: 100, maxLength: 10, disabled: true
          // value: null, type: 'dropdown', list: this.PRCList, id: 'id', text: 'text', displayMul: false, width: 100
        },
        usage: {
          value: null, type: 'dropdown', list: this.usage, id: 'value', text: 'viewValue', displayMul: false, width: 100
        },
        element: {
          value: null, type: 'dropdown', list: this.element, id: 'value', text: 'viewValue', displayMul: false, width: 100
        },
        uom: {
          value: null, type: 'dropdown', list: this.UomList, id: 'id', text: 'text', displayMul: false, width: 100
        },
        qty: {
          value: null, type: 'checkbox', width: 100, maxLength: 10
        },
        delete: {
          type: 'delete', width: 10
        }
      },

      formControl: {
        company: [null, [Validators.required]]
      }
    };
  }

  getcompaniesList() {
    const getcompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getcompanyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.getChartofAccountData();
        });
  }

  getChartofAccountData() {
    const getchartaccUrl = String.Join('/', this.apiConfigService.getChartOfAccountList);
    this.apiService.apiGetRequest(getchartaccUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.coaList = res.response['coaList'];
            }
          }
          this.getuomTypeData();
        });
  }


  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UOMList'];
            }
          }
          this.getglData();
        });
  }
  getglData() {
    const getglUrl = String.Join('/', this.apiConfigService.getprcList);
    this.apiService.apiGetRequest(getglUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.PRCList = res.response['PRCList'];
            }
          }
          this.getAccountNamelist();
        });
  }
  getAccountNamelist() {
    const getAccountNamelist = String.Join('/', this.apiConfigService.getAccountNamelist);
    this.apiService.apiGetRequest(getAccountNamelist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccNameList = res.response['GetAccountNamelist'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          this.getPrimerycostList();
        });
  }


  getPrimerycostList() {
    let newData = [];
    const pcUrl = String.Join('/', this.apiConfigService.getprimeryList);
    this.apiService.apiGetRequest(pcUrl)
      .subscribe(
        response => {
          const resp = response.body;
          if (!this.commonService.checkNullOrUndefined(resp) && resp.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(resp.response) && resp.response['pcostList'].length) {
              resp.response['pcostList'].forEach((res, index) => {
                newData.push(this.tablePropsFunc().tableData);
                newData[index].company.value = res.company;
                newData[index].chartofAccount.value = res.chartofAccount;
                newData[index].glAccount.value = res.generalLedger;
                newData[index].glAccountName.value = res.generalLedger;
                newData[index].usage.value = res.usage;
                newData[index].element.value = res.element;
                newData[index].uom.value = res.uom;
                newData[index].qty.value = res.qty;
                newData[index].id.value = res.id;
              })
              this.sendDynTableData = { type: 'add', data: newData };
            }
          }
          this.spinner.hide();
        });
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
    console.log(data);
  }



  save() {
    this.tableData = this.commonService.formatTableData(this.tableData, 0);
    if (this.tableData.length == 0) {
      return;
    }
    this.savepcost();
  }

  savepcost() {
    const addpcost = String.Join('/', this.apiConfigService.addpccost);
    const requestObj = { grDtl: this.tableData };
    this.apiService.apiPostRequest(addpcost, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Primerycost created Successfully..', Static.Close, SnackBar.success);
          }
          //this.reset();
          this.spinner.hide();
        }
      });
  }

  reset() {
    this.tableData = [];
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

}
