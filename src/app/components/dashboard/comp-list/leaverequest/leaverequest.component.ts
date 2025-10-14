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
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddOrEditService } from '../add-or-edit.service';

interface Session {
  value: string;
  viewValue: string;
}
//interface NumberType {
//  value: string;
//  viewValue: string;
//}
@Component({
  selector: 'app-leaverequest',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NgMultiSelectDropDownModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './leaverequest.component.html',
  styleUrls: ['./leaverequest.component.scss']
})

export class LeaveRequestComponent implements OnInit {

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  leaveTypeatList: any;
  companyList: any;
  brandList: any;
  MaterialGroupsList: any;
  SizesList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new FormControl(new Date());

  sessions: Session[] =
    [
      { value: 'FirstHalf', viewValue: 'FirstHalf' },
      { value: 'SecondHalf', viewValue: 'SecondHalf' }
    ];
  pipe = new DatePipe('en-US');
  now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<LeaveRequestComponent>,
    public commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      empCode: [null],
      empName: [null],
      sno: ['0'],
      applDate: [null],
      leaveCode: [null],
      leaveFrom: [null],
      leaveTo: [null],
      leaveDays: [null],
      leaveRemarks: [null],
      status: [null],
      approvedId: [null],
      approveName: [null],
      reason: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(2), Validators.maxLength(40)]],
      authorizedStatus: [null],
      authorizedId: [null],
      formno: [null],
      trmno: [null],
      apprDate: [null],
      authDate: [null],
      accptedId: [null],
      accDate: [null],
      acceptedRemarks: [null],
      skip: [null],
      lopdays: [null],
      reportId: [null],
      reportName: [null],
      recomendedby: [null],
      companyCode: [null],
      companyName: [null],
      rejectedId: [null],
      rejectedName: [null],
      countofLeaves: [null],
      chkAcceptReject: [null],
      session1: [null],
      session2: null
    });



    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
      this.modelFormData.patchValue({
        empCode: this.formData.item.empCode ? [{ id: this.formData.item.empCode, text: this.formData.item.empName }] : null
      });
    }

  }

  ngOnInit() {
    this.getTableData();
    this.getEmployeeList();
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
    var date1 = this.pipe.transform(this.modelFormData.get('leaveFrom').value, 'MM-dd-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('leaveTo').value, 'MM-dd-yyyy');

    var session1 = this.modelFormData.get('session1').value
    var session2 = this.modelFormData.get('session2').value

    if (!this.commonService.checkNullOrUndefined(date1)) {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getnoofdayscount);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['days'])) {
                this.modelFormData.patchValue
                  ({
                    leaveDays: res.response['days']
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

  sessionevent() {
    this.NoofdaysCount();
  }
  orgValueChange() {
    this.NoofdaysCount();
  }
  leaveToValueChange() {
    this.NoofdaysCount();
  }

  sessionevent2() {


    var date1 = this.pipe.transform(this.modelFormData.get('leaveFrom').value, 'MM-dd-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('leaveTo').value, 'MM-dd-yyyy');
    //var momentVariable = moment(date, 'MM-DD-YYYY');  
    //let str = date.toDateString();  
    var session1 = this.modelFormData.get('session1').value
    var session2 = this.modelFormData.get('session2').value

    if (!this.commonService.checkNullOrUndefined(date1)) {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getnoofdayscount);
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['days'])) {
                this.modelFormData.patchValue
                  ({
                    leaveDays: res.response['days']
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


  getTableDataonempcodechangevent() {
    const obj = this.getProductByProductCodeArray.find(x => x.id === this.modelFormData.value.empCode[0].id);
    this.modelFormData.patchValue({
      empName: obj ? obj.text : null
    });
    this.spinner.show();
    const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatList, this.modelFormData.value.empCode[0].id);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.leaveTypeatList = res.response['leavetypesList'];
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
        res => {
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.leaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }


  getEmployeeList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getEmployeeListUrl = String.Join('/', this.apiConfigService.getEmployeeList, user.companyCode);
    this.apiService.apiGetRequest(getEmployeeListUrl).subscribe(
      res => {
        this.spinner.hide();
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['emplist'])) {
              this.getProductByProductCodeArray = res.response['emplist'];
            }
          }
        }
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
      leaveTo: this.commonService.formatDate(this.modelFormData.get('leaveTo').value),
      leaveFrom: this.commonService.formatDate(this.modelFormData.get('leaveFrom').value)
    });
    this.formData.item = this.modelFormData.value;
    this.formData.item.empCode = this.formData.item.empCode[0].id;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}

