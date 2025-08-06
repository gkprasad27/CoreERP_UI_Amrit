import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from '../../../../enums/common/static';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-employee',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [ DatePipe ]
})
export class EmployeeComponent implements OnInit {


  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  companiesList: any;
  branchesList: any;
  bankList: any;
  employeesList: any;
  designationsList: any;


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private router: Router,
    private datepipe: DatePipe,
    private addOrEditService: AddOrEditService) {

    this.modelFormData = this.formBuilder.group({
      branchId: [''],
      // employeeId: [0],
      employeeCode: ['', Validators.required],
      companyCode: [''],
      branchCode: [''],
      designationId: [''],
      employeeName: [''],
      dob: [''],
      maritalStatus: [''],
      gender: [''],
      qualification: [''],
      address: [''],
      phoneNumber: [''],
      mobileNumber: [''],
      email: [''],
      joiningDate: [''],
      releavingDate: [''], //
      isActive: ['true'],
      narration: [''],
      bloodGroup: [''],
      passportNo: [''],
      accessCardNumber: [''], //
      bankName: [''],
      bankAccountNumber: [''],
      employeeType: [''], //
      ifscCode: [''], //
      panNumber: [''],
      aadharNumber: [''],
      recomendedBy: [''],
      reportedBy: [''],
      approvedBy: [''],

      pfNumber: [''],
      esiNumber: [''],

    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        designationId: this.formData.item.designationId ? +this.formData.item.designationId : 0
      });
      this.modelFormData.controls['employeeCode'].disable();
      // this.modelFormData.controls['employeeId'].disable();
    }

  }

  ngOnInit() {
    this.getcompanyData();
    this.getbranchList();
    this.getEmployeesList();
    this.getBankData();
    this.getDesignationsList();
  }

  getcompanyData() {
    const getompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getompanyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companiesList = res.response['companiesList'];
            }
          }
        });
  }

  getbranchList() {
    const getbranchList = String.Join('/', this.apiConfigService.getBranchesList);
    this.apiService.apiGetRequest(getbranchList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.branchesList = res.response['branchesList'];
            }
          }
        });
  }


  getBankData() {
    const getbankUrl = String.Join('/', this.apiConfigService.getBankMastersList);
    this.apiService.apiGetRequest(getbankUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bankList = res.response['bankList'];
            }
          }
          this.spinner.hide();
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getDesignationsList() {
    const getDesignationsList = String.Join('/', this.apiConfigService.getDesignationsList);
    this.apiService.apiGetRequest(getDesignationsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.designationsList = res.response['designationsList'];
            }
          }
          this.spinner.hide();
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
    this.formData.item = this.modelFormData.value;
    this.modelFormData.controls['employeeCode'].enable();

    this.formData.item.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'dd-MM-yyyy') : '';
    this.formData.item.joiningDate = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'dd-MM-yyyy') : '';
    this.formData.item.releavingDate = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'dd-MM-yyyy') : '';

    // this.modelFormData.controls['employeeId'].enable();
    if (this.formData.action == "Edit") {
      this.update();
      return
    }
    const addCashBank = String.Join('/', this.apiConfigService.registerEmployee);
    this.apiService.apiPostRequest(addCashBank, this.formData.item).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update() {
    const addCashBank = String.Join('/', this.apiConfigService.updateEmployee);

    this.formData.item = this.modelFormData.value;
    this.formData.item.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'yyyy-MM-dd') : '';
    this.formData.item.joiningDate = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'yyyy-MM-dd') : '';
    this.formData.item.releavingDate = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'yyyy-MM-dd') : '';

    this.apiService.apiUpdateRequest(addCashBank, this.formData.item).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  cancel() {
    this.router.navigate(['dashboard/master/employee'])
  }

}

