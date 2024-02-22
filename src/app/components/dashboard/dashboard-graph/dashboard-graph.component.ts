import { Component } from '@angular/core';

import * as Highcharts from 'highcharts';

import { RuntimeConfigService } from '../../../services/runtime-config.service';

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

  constructor(private RuntimeConfigService: RuntimeConfigService) {

    this.RuntimeConfigService.tableDataLoaded.subscribe((t: any) => {
      debugger
      if (t) {
        this.tableData = [
          { ORDER: '2', SALES: 602 },
          { ORDER: '3', SALES: 234 },
          { ORDER: '23', SALES: 6032 },
          { ORDER: '221', SALES: 60432 },
          { ORDER: '212', SALES: 6032 },
        ];
        this.chartOptions = {
          title: {
            text: 'Order && Sales'
          },
          yAxis: {
            title: {
              text: 'Order && Sales'
            }
          },
          series: [
            {
              name: 'ORDER',
              data: [2, 3, 4],
              type: 'line'
            },
            {
              name: 'SALES',
              data: [1, 2, 3],
              type: 'line'
            }
          ],
        }


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




}
