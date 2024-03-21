import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { String } from 'typescript-string-operations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from '../../../enums/common/common';
import { AlertService } from '../../../services/alert.service';
import { RuntimeConfigService } from '../../../services/runtime-config.service';
import { ApiConfigService } from '../../../services/api-config.service';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  getComponentData: any;

  modelFormData: FormGroup;

  companyList: any[] = [];
  customerList: any[] = [];
  materialList: any[] = [];

  data: any;

  submitted = false;

  routeParam: any;

  date = new Date()

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private environment: RuntimeConfigService,
    private apiConfigService: ApiConfigService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.model();
    this.getcompaniesList();
    this.getmaterialData();
    this.getCustomerList();
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id
      this.commonService.routeParam = params.id
      this.reset();
      this.getParameters(params.id);
    });
  }

  getColSpan(keys: any) {
    return (keys.val instanceof Array) ? Object.keys(keys['val'][0]).length + 1 : '1'
  }

  getRowSpan(keys: any) {
    return (keys.val instanceof Array) ? '1' : '2'
  }

  isArray(keys: any) {
    return (keys.val instanceof Array)
  }

  model() {
    this.modelFormData = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      customerCode: ['-1'],
      materialCode: ['-1'],
      companyName: [null],
      selected: [null, [Validators.required]],
      fromDate: [null],
      toDate: [null],
    });
    this.setValidator();
  }


  setValidator() {

    if (this.routeParam == 'stockvaluation' || this.routeParam != 'pendingpurchaseorders' || this.routeParam != 'pendingsales' || this.routeParam == 'pendingjobworkreport') {
      this.modelFormData.controls['selected'].removeValidators(Validators.required);
      this.modelFormData.controls['selected'].updateValueAndValidity();
    } else {
      this.modelFormData.controls['selected'].addValidators(Validators.required);
      this.modelFormData.controls['selected'].updateValueAndValidity();
    }
  }

  getcompaniesList() {
    const getcompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getcompanyList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
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
        });
  }

  getCustomerList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const costCenUrl = String.Join('/', this.apiConfigService.getCustomerList, obj.companyCode);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpList'];
              const data = resp.length && resp.filter((t: any) => t.bptype == 'Customer');
              this.customerList = data;
            }
          }
        });
  }

  getParameters(id) {
    const getUrl = String.Join('/', this.apiConfigService.getComponentInfo, id);
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getComponentData = res.response;
            }
          }
        });
  }

  ngOnInit() {
  }

  reset() {
    this.modelFormData.reset();
    this.setValidator();
  }

  search() {
    if (this.modelFormData.invalid) {
      this.submitted = true;
      return;
    }
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.value.selected) && this.modelFormData.value.selected.start) {
      this.modelFormData.patchValue({
        fromDate: this.commonService.formatDateValue(this.modelFormData.value.selected.start.$d),
        toDate: this.commonService.formatDateValue(this.modelFormData.value.selected.end.$d)
      });
    }
    this.print();
  }


  print() {
    let getUrl
    if (this.routeParam == 'stockvaluation' || this.routeParam == 'pendingpurchaseorders' || this.routeParam == 'pendingsales' || this.routeParam == 'pendingjobworkreport') {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.companyCode}`);
    }  else if (this.routeParam == 'salesanalysis' || this.routeParam == 'materialinward') {
      const obj = this.customerList.find((c: any) => c.text == this.modelFormData.value.customerCode);
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}/${obj ? obj.id: '-1'}/${this.modelFormData.value.materialCode ? this.modelFormData.value.materialCode: '-1'}`);
    } else {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}`);
    }
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
              const keys = [];
              const tableResp = res.response[this.getComponentData.listName];
              if (res.response[this.getComponentData.totals] && res.response[this.getComponentData.totals].length) {
                tableResp.push(res.response[this.getComponentData.totals][0]);
              }
              tableResp.forEach(obj => {
                const cols = [];
                Object.keys(this.environment.tableColumnsData[this.routeParam]).forEach(col => {
                  let nObj: any;
                  if ((obj[col] instanceof Array)) {
                    let arr = [];
                    obj[col].forEach(key => {
                      Object.keys(this.environment.tableColumnsData[this.routeParam][col]).forEach(col1 => {
                        arr.push({ val: key[col1], label: col1, type: this.environment.tableColumnsData[this.routeParam][key] });
                      })
                    })
                    nObj = { val: arr, label: col, type: this.environment.tableColumnsData[this.routeParam][col] };
                  } else {
                    nObj = { val: obj[col], label: col, type: this.environment.tableColumnsData[this.routeParam][col] };
                  }
                  cols.push(nObj);
                })
                keys.push(cols);
              });
              const obj = this.companyList.find((c: any) => c.id == this.modelFormData.value.companyCode);
              this.modelFormData.patchValue({
                companyName: obj.text
              })
              this.data = keys;
              setTimeout(() => {
                var w = window.open();
                var html = document.getElementById('printData').innerHTML;
                w.document.body.innerHTML = html;
                this.data = null;
                w.print();
              }, 50);

            }
          }
          this.spinner.hide();
        });

  }



  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

}