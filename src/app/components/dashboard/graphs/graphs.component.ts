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
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = null;

  tableData = null;


  getComponentData: any;

  modelFormData: FormGroup;

  companyList: any[] = [];

  submitted = false;

  routeParam: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private environment: RuntimeConfigService,
    private apiConfigService: ApiConfigService,
    private translate: TranslateService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.model();
    this.getcompaniesList(); 0
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id
      this.commonService.routeParam = params.id;
      this.tableData = null;
      this.chartOptions = null;
      this.reset();
      this.getParameters(params.id);
    });
  }

  model() {
    this.modelFormData = this.formBuilder.group({
      companyCode: [null, [Validators.required]],
      selected: [null, [Validators.required]],
      fromDate: [null],
      toDate: [null],
    });
    this.setValidator();
  }


  setValidator() {
    this.modelFormData.controls['selected'].addValidators(Validators.required);
    this.modelFormData.controls['selected'].updateValueAndValidity();
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
    this.tableData = null;
    this.print();
  }


  print() {
    let getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}`);
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
              this.tableData = res.response[this.getComponentData.listName];
              this.translate.get(this.routeParam).subscribe((data: any) => {


                const categories = this.tableData.map((d: any) => d.monthYear);
                let series = [];
                for (const key in this.environment.tableColumnsData[this.routeParam]) {
                  // tslint:disable-next-line: prefer-for-of
                  if (key != 'monthYear') {
                    series.push({ name: data[key], data: this.tableData.map((d: any) => d[key]), type: this.getChartName() })
                  }
                }
                this.chartOptions = {
                  title: {
                    text: data.reportTitle
                  },
                  yAxis: {
                    title: {
                      text: data.yAxis
                    }
                  },
                  xAxis: {
                    title: {
                      text: data.xAxis
                    },
                    categories: categories
                  },
                  series: series
                }

              });

            }
          }
          this.spinner.hide();
        });

  }

  getChartName() {
    switch (this.routeParam) {
      case 'ordervssales':
        return 'column'
      default:
        return 'line'
    }
  }

  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

}