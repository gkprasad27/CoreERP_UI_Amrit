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




  constructor(
    private RuntimeConfigService: RuntimeConfigService, private apiConfigService: ApiConfigService,
    private apiService: ApiService,     private commonService: CommonService,
    private translate: TranslateService,      private spinner: NgxSpinnerService,

    ) {

    this.RuntimeConfigService.tableDataLoaded.subscribe((t: any) => {
      if (t) {
      
        this.print();

        this.tableData1 = [
          { totalEmployes: 100, totalPresent: 20, totalObsent: 80 },
        ];
        this.chartOptions1 = {
          title: {
            text: 'Employess'
          },
          series: [
            {
              // name: 'Total Employes',
              data: [{
                y: 100,
                name: "Total Employes",
                color: "blue"
              }, {
                y: 20,
                name: "Total Present",
                color: "green"
              }, {
                y: 80,
                name: "Total Obsent",
                color: "red"
              }],
              type: 'pie'
            },
          ],
        }

      }
    })
  }

  
  print() {
    let getUrl = String.Join('', this.apiConfigService.getOrdersvsSales, '/2023-01-01/2024-01-01/1000');
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response['OrdersvsSales'] && res.response['OrdersvsSales'].length) {
              this.tableData = res.response['OrdersvsSales'];
              debugger
              this.translate.get('ordervssales').subscribe((data: any) => {
                const categories = this.tableData.map((d: any) => d.monthYear);
                let series = [];
                for (const key in this.RuntimeConfigService.tableColumnsData['ordervssales']) {
                  // tslint:disable-next-line: prefer-for-of
                  if (key != 'monthYear') {
                    series.push({ name: data[key], data: this.tableData.map((d: any) => d[key]), type: 'line' })
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





}
