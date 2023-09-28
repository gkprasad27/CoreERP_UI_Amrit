import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-stockexcess',
  templateUrl: './stockexcess.component.html',
  styleUrls: ['./stockexcess.component.scss']
})
export class StockExcessComponent implements OnInit {
  selectedDate = {start : moment().add(-1, 'day'), end: moment().add(0, 'day')};

  dateForm: FormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode','branchName','stockExcessNo','stockExcessDate', 'costCenter','userId','shiftId'
];
branchCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,

  ) {
    this.dateForm = this.formBuilder.group({
      selected: [null],
      fromDate: [null],
      toDate: [null],
      stockExcessNo: [null],
      role:[null]
    });
  }

  ngOnInit() {
      this.branchCode = JSON.parse(localStorage.getItem('user'));
      this.dateForm.patchValue({role:this.branchCode.role})
      this.getStockexcessList();
  }



  getStockexcessList() {
    const getStockexcessListUrl = String.Join('/', this.apiConfigService.getStockexcessList, this.branchCode.branchCode);
    this.apiService.apiPostRequest(getStockexcessListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
        if (!this.commonService.checkNullOrUndefined(res.response['StockexcessList']) && res.response['StockexcessList'].length) {
          this.dataSource = new MatTableDataSource( res.response['StockexcessList']);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        }
      }
      });
  }

  openSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/stockexcess/createStockExcess', row.stockExcessMasterId]);
  }

  search() {
    if (this.commonService.checkNullOrUndefined(this.dateForm.value.stockExcessNo)) {
        if (this.commonService.checkNullOrUndefined(this.dateForm.value.selected)) {
          this.alertService.openSnackBar('Select StockExcess No or Date', Static.Close, SnackBar.error);
          return;
        } else {
          this.dateForm.patchValue({
            fromDate: this.commonService.formatDate(this.dateForm.value.selected.start.$d),
            toDate: this.commonService.formatDate(this.dateForm.value.selected.end.$d),
            stockExcessNo:this.dateForm.value.stockExcessNo
          });
        }
    }

    this.getStockexcessList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
