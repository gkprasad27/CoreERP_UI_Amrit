import { Component, OnInit, ViewChild } from '@angular/core';
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

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stockexcess',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatNativeDateModule ],
  templateUrl: './stockexcess.component.html',
  styleUrls: ['./stockexcess.component.scss']
})
export class StockExcessComponent implements OnInit {

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
    const newObj = this.dateForm.value;
    if (!this.commonService.checkNullOrUndefined(this.dateForm.value.fromDate)) {
      newObj.FromDate = this.commonService.formatDate(this.dateForm.value.fromDate);
      newObj.ToDate = this.commonService.formatDate(this.dateForm.value.toDate);
    }
    const getStockexcessListUrl = String.Join('/', this.apiConfigService.getStockexcessList, this.branchCode.branchCode);
    this.apiService.apiPostRequest(getStockexcessListUrl, newObj).subscribe(
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
        if (this.commonService.checkNullOrUndefined(this.dateForm.value.fromDate)) {
          this.alertService.openSnackBar('Select StockExcess No or Date', Static.Close, SnackBar.error);
          return;
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
