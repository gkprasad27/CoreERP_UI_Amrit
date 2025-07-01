import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicTableComponent } from '../../../../reuse-components/dynamic-table/dynamic-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatButtonModule } from '@angular/material/button';

interface Session {
  value: string;
  viewValue: string;
}
//interface NumberType {
//  value: string;
//  viewValue: string;
//}
@Component({
  selector: 'app-applyod',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './applyod.component.html',
  styleUrls: ['./applyod.component.scss']
})

export class ApplyodComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  LeaveTypeatList: any;
  companyList: any;
  brandList: any;
  MaterialGroupsList: any;
  SizesList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new FormControl(new Date());

  sessions: Session[] =
    [
      { value: 'Train', viewValue: 'Train' },
      { value: 'Bus', viewValue: 'Bus' },
      { value: 'Air', viewValue: 'Air' },
      { value: 'Car', viewValue: 'Car' },
      { value: 'Own Vechile', viewValue: 'Own Vechile' },
    ];
  EmpName: any;
  pipe = new DatePipe('en-US');
  now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ApplyodComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      sno: ['0'],
      empCode: [null],
      applDate: [null],
      fromDate: [null],
      toDate: [null],
      fromTime: [null],
      toTime: [null],
      remarks: [null],
      recBy: [null],
      recStatus: [null],
      recDate: [null],
      apprBy: [null],
      apprStatus: [null],
      apprDate: [null],
      reason: [null],
      acceptedBy: [null],
      timeStamp: [null],
      skip: [null],
      transport: [null],
      visitingPlace: [null],
      empName: [null],
      visitingPlacePurpus: [null],
      type: [null],
      status: [null],
      approvedId: [null],
      approveName: [null],
      reportId: [null],
      reportName: [null],
      code: [null],
      name: [null],
      rejectedId: [null],
      rejectedName: [null],
      noOfDays: [null],
      department: [null]
    });



    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.getTableData();
    this.modelFormData.patchValue
      ({
        empCode: user.userName
      });
    this.getProductByProductCode(user.userName);
    this.onSearchChange(null);
  }


  //load data
  getLeaveApplDetailsList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getLeaveApplDetailsListUrl = String.Join('/', this.apiConfigService.getLeaveRequestList, user.userName);
    this.apiService.apiGetRequest(getLeaveApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dataSource = new MatTableDataSource(res.response['LeaveApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              //this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }


  ///gettting NoofdaysCount code
  NoofdaysCount() {
    var date1 = this.pipe.transform(this.modelFormData.get('fromDate').value, 'dd-MM-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('toDate').value, 'dd-MM-yyyy');

    var session1 = null;
    var session2 = null;
    if (!this.commonService.checkNullOrUndefined(date1)) {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getnoofdayscount);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['days'])) {
                this.EmpName = res.response['days']
                this.modelFormData.patchValue
                  ({
                    noOfDays: res.response['days']
                  });
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }


  orgValueChange() {
    this.NoofdaysCount();
  }
  leaveToValueChange() {
    this.NoofdaysCount();
  }


  getTableDataonempcodechangevent() {

    this.spinner.show();
    const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatList, this.modelFormData.get('empCode').value);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.LeaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }

  getTableData() {
    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.spinner.show();
    const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatList, username);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.LeaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }


  getProductByProductCode(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getEmpCode);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['Empcodes'])) {
                this.getProductByProductCodeArray = res.response['Empcodes'];
                this.spinner.hide();
              }
            }
          }

        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  onSearchChange(code) {
    let genarateVoucherNoUrl;
    if (!this.commonService.checkNullOrUndefined(code)) {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getEmpName, code.value);
    } else {
      genarateVoucherNoUrl = String.Join('/', this.apiConfigService.getEmpName, this.modelFormData.get('empCode').value);
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['empname'])) {
              this.EmpName = res.response['empname']
              this.modelFormData.patchValue
                ({
                  empName: res.response['empname']
                });
              this.spinner.hide();
            }
          }
        }
        this.getTableDataonempcodechangevent();
      });
  }



  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.patchValue({
      leaveTo: this.commonService.formatDate(this.modelFormData.get('toDate').value),
      leaveFrom: this.commonService.formatDate(this.modelFormData.get('fromDate').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

