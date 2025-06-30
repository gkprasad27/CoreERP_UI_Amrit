import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-stocktransfer',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatNativeDateModule ],
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.scss']
})
export class StocktransferComponent implements OnInit {

  dateForm: FormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['fromBranchCode', 'fromBranchName', 'toBranchCode',
  'toBranchName', 'stockTransferDate', 'userId',
  'stockTransferNo', 'shiftId'
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
    private activatedRoute: ActivatedRoute,

  ) {
    this.dateForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      invoiceNo: [null],
      Role:[null]
    });
  }

  ngOnInit() {
      this.branchCode = JSON.parse(localStorage.getItem('user'));
      this.dateForm.patchValue({
        Role: this.branchCode.role
      })
      this.search();
  }

  getInvoiceList() {
    const newObj = this.dateForm.value;
    if (!this.commonService.checkNullOrUndefined(this.dateForm.value.fromDate)) {
      newObj.FromDate = this.commonService.formatDate(this.dateForm.value.fromDate);
      newObj.ToDate = this.commonService.formatDate(this.dateForm.value.toDate);
    }
    const getInvoiceListUrl = String.Join('/', this.apiConfigService.getStockTransferList, this.branchCode.branchCode);
    this.apiService.apiPostRequest(getInvoiceListUrl, newObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
        if (!this.commonService.checkNullOrUndefined(res.response['InvoiceList']) && res.response['InvoiceList'].length) {
          this.dataSource = new MatTableDataSource( res.response['InvoiceList']);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        }
      }
      });
  }

  openStock(row) {
    localStorage.setItem('stockTransfer', JSON.stringify(row));
    this.router.navigate(['dashboard/sales/stockTransfer/createStockTransfer', row.stockTransferMasterId]);
  }

  search() {
    if (this.commonService.checkNullOrUndefined(this.dateForm.value.invoiceNo)) {
        if (this.commonService.checkNullOrUndefined(this.dateForm.value.fromDate)) {
          this.alertService.openSnackBar('Select Invoice or Date', Static.Close, SnackBar.error);
          return;
        }
    }

    this.getInvoiceList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
