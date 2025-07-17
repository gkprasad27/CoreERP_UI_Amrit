import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditService } from '../add-or-edit.service';
import { AlertService } from '../../../../services/alert.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-leaveopeningbalance',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NgMultiSelectDropDownModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './leaveopeningbalance.component.html',
  styleUrls: ['./leaveopeningbalance.component.scss']
})
export class LeaveopeningbalanceComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  LeaveTypeatList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];

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
  
  constructor(
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LeaveopeningbalanceComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.modelFormData = this.formBuilder.group({
      empCode: [null, [Validators.required]],
      // '', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(0), Validators.maxLength(4)]],
      year: [(new Date()).getFullYear()],
      leaveCode: ['', [Validators.required, Validators.minLength(2)]],
      opbal: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(0), Validators.maxLength(3)]],
      used: [null],
      userId: [null],
      timeStamp: [null],
      balance: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(0), Validators.maxLength(3)]],
      remarks: [null],
      compCode: [null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {


      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();

    }

  }

  ngOnInit() {
    this.getTableData();
    this.getCompanyData();
    this.getEmployeeList();
  }

  getEmployeeList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeListUrl = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeListUrl).subscribe(
      res => {
        this.spinner.hide();
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['emplist'])) {
              this.getProductByProductCodeArray = res.response['emplist'];
              const empCode = this.getProductByProductCodeArray.find(x => x.id === this.formData.item?.empCode);
              this.modelFormData.patchValue({
                empCode: empCode ? [{ id: empCode.id, text: empCode.text }] : null
              });
            }
          }
        }
      });
  }

  getTableData() {
    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.spinner.show();
    const getLeaveTypeUrl = String.Join('/', this.apiConfigService.getLeaveTypeatListforlob, user.companyCode);
    this.apiService.apiGetRequest(getLeaveTypeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.LeaveTypeatList = res.response['leaveTypeList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }
  get formControls() { return this.modelFormData.controls; }

  getCompanyData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getCompanyUrl = String.Join('/', this.apiConfigService.getLeaveTypeatListforlob, user.companyCode);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['leaveTypeList'];
            }
          }
          this.spinner.hide();
        });
  }
  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['empCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.formData.item.empCode = this.formData.item.empCode[0].id;
    this.dialogRef.close(this.formData);
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
