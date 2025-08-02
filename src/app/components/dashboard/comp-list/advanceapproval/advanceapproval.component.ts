import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../services/api.service';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-advanceapproval',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatPaginatorModule, MatTableModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatCheckboxModule ],
  templateUrl: './advanceapproval.component.html',
  styleUrls: ['./advanceapproval.component.scss']

})

export class AdvanceApprovalComponent implements OnInit {

  leaveApprovalList: any;

  leaveRequestForm: FormGroup;
  displayedColumns: string[] = ['select', 'employeeId', 'id', 'applydate', 'advanceType', 'advanceAmount', 'status', 'approvedId', 'reason'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AdvanceApprovalComponent>,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

    this.leaveRequestForm = this.formBuilder.group({
      accept: [null],
      reject: [null],
      ApprBy: [null],
      chkAcceptReject: [null],
      reason: [null]
    });

  }

  ngOnInit() {
    this.getOdApplDetailsList();
  }

  approveOrReject(event) {
    if (event) {
      this.leaveRequestForm.patchValue({
        ApprBy: "Accept",
        reject: null
      });
    } else {
      this.leaveRequestForm.patchValue({
        ApprBy: null,
        reject: "Reject"
      });
    }
  }

  singleChecked(flag, column, row) {
    let statusFlag = true;
    if (this.leaveApprovalList.length) {
      for (let l = 0; l < this.leaveApprovalList.length; l++) {
        if (this.leaveApprovalList[l]['id'] == column) {
          statusFlag = false;
          if (!flag) {
            if (this.leaveApprovalList.length == 1) {
              this.leaveApprovalList = [];
            }
            else {
              this.leaveApprovalList.splice(0, l);
            }
          }
          if (flag) {
            this.leaveApprovalList.push(row);
          }
        }
      }
    }
    if (this.leaveApprovalList.length == 0 || statusFlag) {
      this.leaveApprovalList.push(row);
    }
  }

  checkAll(flag, checkAll?) {
    for (let l = 0; l < this.dataSource.data.length; l++) {
      this.dataSource.data[l]['select'] = flag;
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    if (flag && checkAll) {
      this.leaveApprovalList = this.dataSource.data;
    } else {
      this.leaveApprovalList = [];
    }
  }

  getOdApplDetailsList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getOdApplDetailsListUrl = String.Join('/', this.apiConfigService.getAdvanceApplDetailsList, user.userName);
    this.apiService.apiGetRequest(getOdApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dataSource = new MatTableDataSource(res.response['AdvanceApprovalApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }

  save() {
    const user = JSON.parse(localStorage.getItem('user'));
    const registerInvoiceUrl = String.Join('/', this.apiConfigService.RegisterAdvanceApprovalDetails);
    const requestObj = { StockissueHdr: this.leaveRequestForm.value, code: user.userName, StockissueDtl: this.leaveApprovalList };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Advance Approval  Successfully..', Static.Close, SnackBar.success);
            //this.branchFormData.reset();
          }
          this.reset();

          this.spinner.hide();

        }
      });
  }



  reset() {
    this.leaveRequestForm.reset();
    this.dataSource = new MatTableDataSource();
    this.getOdApplDetailsList();
  }


  cancel() {
    this.dialogRef.close();
  }
}
