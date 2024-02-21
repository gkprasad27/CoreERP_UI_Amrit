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

import * as Highcharts from 'highcharts';
import { Options } from "highcharts";


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    series: [
      {
        type: "line",
        data: [1, 2, 3]
      }
    ]
  };

  tableData = [
    { 'sNo': 1, month: 'Apr-23', 'suppliedQty': 602, 'rejectionQty': 5 },
    { 'sNo': 2, month: 'Apr-23', 'suppliedQty': 602, 'rejectionQty': 5 },
    { 'sNo': 3, month: 'Apr-23', 'suppliedQty': 602, 'rejectionQty': 5 },
    { 'sNo': 4, month: 'Apr-23', 'suppliedQty': 602, 'rejectionQty': 5 },
  ];


  getComponentData: any;

  modelFormData: FormGroup;

  companyList: any[] = [];

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
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id
      this.commonService.routeParam = params.id
      this.reset();
      this.getParameters(params.id);
    });
  }

  model() {
    this.modelFormData = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      companyName: [null],
      selected: [null, [Validators.required]],
      fromDate: [null],
      toDate: [null],
    });
    this.setValidator();
  }
  

  setValidator() {
    
    if (this.routeParam == 'stockvaluation' || this.routeParam != 'pendingpurchaseorders' || this.routeParam != 'pendingsales'|| this.routeParam == 'pendingjobworkreport') {
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
    if (this.routeParam == 'stockvaluation' || this.routeParam == 'pendingpurchaseorders' || this.routeParam == 'pendingsales'|| this.routeParam == 'pendingjobworkreport') {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.companyCode}`);
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
              if(res.response[this.getComponentData.totals] && res.response[this.getComponentData.totals].length) {
                tableResp.push(res.response[this.getComponentData.totals][0]);
              }
              tableResp.forEach(obj => {
                const cols = [];
                Object.keys(this.environment.tableColumnsData[this.routeParam]).forEach(col => {
                  const nObj = { val: obj[col], label: col, type: this.environment.tableColumnsData[this.routeParam][col] };
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