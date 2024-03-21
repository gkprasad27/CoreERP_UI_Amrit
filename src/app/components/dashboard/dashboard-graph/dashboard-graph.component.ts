import { Component } from '@angular/core';

import * as Highcharts from 'highcharts';
import { ApiConfigService } from 'src/app/services/api-config.service';

import { RuntimeConfigService } from '../../../services/runtime-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { StatusCodes } from 'src/app/enums/common/common';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.scss']
})
export class DashboardGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = null;
  chartOptions1: Highcharts.Options = null;

  tableData = [];
  tableData1 = [];

  companyList: any[] = [];


  constructor(
    private RuntimeConfigService: RuntimeConfigService, private apiConfigService: ApiConfigService,
    private apiService: ApiService, private commonService: CommonService,
    private translate: TranslateService, private spinner: NgxSpinnerService,

  ) {
    this.RuntimeConfigService.tableDataLoaded.subscribe((t: any) => {
      if (t) {
        this.getEmpPresent();
    this.getcompaniesList();
      }
    })
  }



  getEmpPresent() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmpPresent = String.Join('/', this.apiConfigService.getEmpPresent, obj.companyCode);
    this.apiService.apiGetRequest(getEmpPresent)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tableData1 = res.response['EmpPresent'];
              this.chartOptions1 = {
                title: {
                  text: 'Employess'
                },
                series: [
                  {
                    // name: 'Total Employes',
                    data: [{
                      y: this.tableData1[0].totalEmployees,
                      name: "Total Employes",
                      color: "blue"
                    }, {
                      y: this.tableData1[0].totalPresent,
                      name: "Total Present",
                      color: "green"
                    }, {
                      y: this.tableData1[0].totalAbsent,
                      name: "Total Absent",
                      color: "red"
                    }],
                    type: 'pie'
                  },
                ],
              }
            }
          }
          this.spinner.hide();
        });
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
          this.print();
          this.spinner.hide();
        });
  }



  print() {
    let obj = JSON.parse(localStorage.getItem("user"));
    let getUrl = String.Join('', this.apiConfigService.getOrdersvsSales, `/${this.commonService.formatDateValue(this.companyList[0].financialYear)}/${this.commonService.formatDateValue(new Date())}/`, obj.companyCode);
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response['OrdersvsSales'] && res.response['OrdersvsSales'].length) {
              this.tableData = res.response['OrdersvsSales'];
              this.translate.get('ordervssales').subscribe((data: any) => {
                const categories = this.tableData.map((d: any) => d.monthYear);
                let series = [];
                for (const key in this.RuntimeConfigService.tableColumnsData['ordervssales']) {
                  // tslint:disable-next-line: prefer-for-of
                  if (key != 'monthYear') {
                    series.push({ name: data[key], data: this.tableData.map((d: any) => d[key]), type: 'column', color: this.RuntimeConfigService.tableColumnsData['ordervssales'][key] })
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
                  // yAxis: {
                  //   min: 0,
                  //   tickInterval: this.tickInterval(series),
                  //   max: this.tickInterval(series) > 10 ? (this.tickInterval(series) * 10) : 100,
                  //   visible: true,
                  //   title: {
                  //     text: data.yAxis
                  //   }
                  // },
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


  tickInterval(data) {
    if (!(data && data.length)) {
      return 10
    }
    let value = Math.max.apply(Math, data.map(function (o) { return o[1]; }))
    return (value ? (Math.ceil(value / 100) * 10) : 10)
  }



}
