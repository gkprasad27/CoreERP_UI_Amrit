import { Component, OnInit, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';
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
import { TableComponent } from '../../../../reuse-components/table/table.component';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, TableComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [DatePipe]
})
export class EmployeeComponent implements OnInit {


  modelFormData: FormGroup;
  modelFormData1: FormGroup;
  modelFormData2: FormGroup;
  modelFormData3: FormGroup;

  formData: any;

  companyList: any[] = [];
  companiesList: any[] = [];
  branchesList: any[] = [];
  bankList: any[] = [];
  employeesList: any[] = [];
  designationsList: any[] = [];

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;
  tableData: any[] = [];
  tableData1: any[] = [];

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
    this.formProperties();
  }

  formProperties() {
    this.modelFormData = this.formBuilder.group({
      branchId: [''],
      // employeeId: [0],
      employeeCode: ['', Validators.required],
      companyCode: ['', Validators.required],
      branchCode: [''],
      designationId: ['', Validators.required],
      employeeName: ['', Validators.required],
      dob: [''],
      maritalStatus: [''],
      gender: ['', Validators.required],
      qualification: ['', Validators.required],
      address: [''],
      phoneNumber: [''],
      mobileNumber: ['', Validators.required],
      email: [''],
      joiningDate: ['', Validators.required],
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
      aadharNumber: ['', Validators.required],
      recomendedBy: [''],
      reportedBy: [''],
      approvedBy: [''],

      pfNumber: [''],
      esiNumber: [''],

    });

    this.modelFormData1 = this.formBuilder.group({

      empCode: [''],
      pAddress1: [''],
      pAddress: [''],
      pCity: [''],
      pState: [''],
      pZip: [''],
      pLocation: [''],
      pCountry: [''],
      address: [''],
      address1: [''],
      city: [''],
      state: [''],
      zip: [''],
      location: [''],
      country: [''],

    });

    this.modelFormData2 = this.formBuilder.group({

      empCode: [''],
      qualification: [''],
      education: [''],
      percentage: [''],
      yearofPassing: [''],
      inistituateName: [''],
      university: [''],
      educationType: [''],
      specialization: [''],
      attachment: [''],
      educationGap: [''],
      remarks: [''],
      educationGapReasion: [''],

      highlight: false,
      changed: false,
      action: [[
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]],
      index: 0,
      id: 0

    });

    this.modelFormData3 = this.formBuilder.group({

      empCode: [''],
      companyName: [''],
      fromDate: [''],
      toDate: [''],
      totalExp: [''],
      reasionforleft: [''],
      attachment: [''],
      carrierGap: [''],
      carrierGapReasion: [''],
      carrierGapFrom: [''],
      carrierGapTo: [''],
      carrierGapDays: [''],
      designation: [''],

      highlight: false,
      changed: false,
      action: [[
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]],
      index: 0,
      id: 0

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
    this.allApis();
  }


  allApis() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getCompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    const getBranchesList = String.Join('/', this.apiConfigService.getBranchesList);
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    const getBankMastersList = String.Join('/', this.apiConfigService.getBankMastersList);
    const getDesignationsList = String.Join('/', this.apiConfigService.getDesignationsList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getCompanyList),
        this.apiService.apiGetRequest(getBranchesList),
        this.apiService.apiGetRequest(getEmployeeList),
        this.apiService.apiGetRequest(getBankMastersList),
        this.apiService.apiGetRequest(getDesignationsList),


      ]).subscribe(([companyList, branchesList, employeeList, bankMastersList, designationsList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(companyList) && companyList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(companyList.response)) {
            this.companiesList = companyList.response['companiesList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.branchesList = branchesList.response['branchesList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(employeeList) && employeeList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(employeeList.response)) {
            this.employeesList = employeeList.response['employeeList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(bankMastersList) && bankMastersList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(bankMastersList.response)) {
            this.bankList = bankMastersList.response['bankList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(designationsList) && designationsList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(designationsList.response)) {
            this.designationsList = designationsList.response['designationsList'];
          }
        }

      });
    });
  }

  get formControls() { return this.modelFormData.controls; }


  resetForm() {
    this.modelFormData2.reset();
    this.modelFormData2.patchValue({
      index: 0,
      action: [
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]
    });
    this.modelFormData2.disable();
  }

  saveForm() {
    if (this.modelFormData2.invalid) {
      return;
    }
    this.modelFormData2.patchValue({
      highlight: true,
      changed: true,
    });
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.modelFormData2.value.index == 0) {
      this.modelFormData2.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.modelFormData2.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.modelFormData2.value.index ? this.modelFormData2.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
      this.resetForm();
    });
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      if (value.item.id) {
        this.deleteItem(value.item);
      } else {
        this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
      }
      this.modelFormData2.disable();
    } else {
      this.modelFormData2.patchValue(value.item);
      this.modelFormData2.enable();
    }
  }

  deleteItem(item: any) {
    const obj = {
      description: 'Are you sure you want to delete?'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const deleteEducation = String.Join('/', this.apiConfigService.deleteEducation, item.id);
        this.apiService.apiDeleteRequest(deleteEducation).subscribe(response => {
          this.spinner.hide();
          if (response.status === StatusCodes.pass) {
            this.tableData = this.tableData.filter((res: any) => res.index != item.index);
          }
        });
      }
    })
  }


  resetForm1() {
    this.modelFormData3.reset();
    this.modelFormData3.patchValue({
      index: 0,
      action: [
        { id: 'Edit', type: 'edit' },
        { id: 'Delete', type: 'delete' }
      ]
    });
    this.modelFormData3.disable();
  }

  saveForm1() {
    if (this.modelFormData3.invalid) {
      return;
    }
    this.modelFormData3.patchValue({
      highlight: true,
      changed: true,
    });
    let data: any = this.tableData1;
    this.tableData1 = null;
    this.tableComponent.defaultValues();
    if (this.modelFormData3.value.index == 0) {
      this.modelFormData3.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.modelFormData3.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.modelFormData3.value.index ? this.modelFormData3.value : res);
    }
    setTimeout(() => {
      this.tableData1 = data;
      this.resetForm();
    });
  }

  editOrDeleteEvent1(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      if (value.item.id) {
        this.deleteItem(value.item);
      } else {
        this.tableData1 = this.tableData1.filter((res: any) => res.index != value.item.index);
      }
      this.modelFormData3.disable();
    } else {
      this.modelFormData3.patchValue(value.item);
      this.modelFormData3.enable();
    }
  }

  deleteItem1(item: any) {
    const obj = {
      description: 'Are you sure you want to delete?'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const deleteExperiance = String.Join('/', this.apiConfigService.deleteExperiance, item.id);
        this.apiService.apiDeleteRequest(deleteExperiance).subscribe(response => {
          this.spinner.hide();
          if (response.status === StatusCodes.pass) {
            this.tableData1 = this.tableData1.filter((res: any) => res.index != item.index);
          }
        });
      }
    })
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }

    // this.modelFormData.controls['employeeId'].enable();
    if (this.formData.action == "Edit") {
      this.update();
      return;
    }

    let formData: any = {};

    formData = this.modelFormData.value.getRawValue();
    formData.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'dd-MM-yyyy') : '';
    formData.joiningDate = this.modelFormData.get('joiningDate').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'dd-MM-yyyy') : '';
    formData.releavingDate = this.modelFormData.get('releavingDate').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'dd-MM-yyyy') : '';

    const addCashBank = String.Join('/', this.apiConfigService.registerEmployee);
    this.apiService.apiPostRequest(addCashBank, formData).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee Created Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update() {
    const addCashBank = String.Join('/', this.apiConfigService.updateEmployee);

    this.formData.item = this.modelFormData.value.getRawValue();
    this.formData.item.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'yyyy-MM-dd') : '';
    this.formData.item.joiningDate = this.modelFormData.get('joiningDate').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'yyyy-MM-dd') : '';
    this.formData.item.releavingDate = this.modelFormData.get('releavingDate').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'yyyy-MM-dd') : '';

    this.apiService.apiUpdateRequest(addCashBank, this.formData.item).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  save1() {
    if (this.modelFormData1.invalid) {
      return;
    }

    if (this.modelFormData.invalid) {
      this.alertService.openSnackBar('Please Fill Employee Details', Static.Close, SnackBar.error);
      return;
    }

    if (this.formData.action == "Edit") {
      this.update1();
      return
    }

    let formData: any = {};
    formData = this.modelFormData1.value.getRawValue();
    formData.empCode = this.modelFormData.get('employeeCode').value;

    const addCashBank = String.Join('/', this.apiConfigService.registerEmployeeAddress);
    this.apiService.apiPostRequest(addCashBank, formData).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee Details Updated Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update1() {

    const addCashBank = String.Join('/', this.apiConfigService.updateAddress);

    let formData: any = {};
    formData = this.modelFormData1.value.getRawValue();
    formData.empCode = this.modelFormData.get('employeeCode').value;

    this.apiService.apiUpdateRequest(addCashBank, this.formData.item).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Employee Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }


  save2() {


    if (this.modelFormData.invalid) {
      this.alertService.openSnackBar('Please Fill Employee Details', Static.Close, SnackBar.error);
      return;
    }

    let arr = this.tableData.filter((t: any) => t.changed)
    if (this.tableData.length == 0 || arr.length == 0) {
      this.alertService.openSnackBar('Add Or Update One Education Details', Static.Close, SnackBar.error);
      return;
    }

    if (this.formData.action == "Edit") {
      this.update2(arr);
      return
    }

    arr.forEach((a: any) => a.empCode = this.modelFormData.get('employeeCode').value)

    const registerEducation = String.Join('/', this.apiConfigService.registerEducation);
    this.apiService.apiPostRequest(registerEducation, arr).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Education Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update2(items) {

    const addCashBank = String.Join('/', this.apiConfigService.updateEducation);
    items.forEach((a: any) => a.empCode = this.modelFormData.get('employeeCode').value);

    this.apiService.apiUpdateRequest(addCashBank, items).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Education Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }


  save3() {

    if (this.modelFormData.invalid) {
      this.alertService.openSnackBar('Please Fill Employee Details', Static.Close, SnackBar.error);
      return;
    }

    let arr = this.tableData1.filter((t: any) => t.changed)
    if (this.tableData1.length == 0 || arr.length == 0) {
      this.alertService.openSnackBar('Add Or Update One Experience Details', Static.Close, SnackBar.error);
      return;
    }

    if (this.formData.action == "Edit") {
      this.update2(arr);
      return
    }

    arr.forEach((a: any) => {
      a.empCode = this.modelFormData.get('employeeCode').value;
      a.fromDate = a.fromDate ? this.datepipe.transform(a.fromDate, 'MM-dd-yyyy') : '';
      a.toDate = a.toDate ? this.datepipe.transform(a.toDate, 'MM-dd-yyyy') : '';
      a.carrierGapFrom = a.carrierGapFrom ? this.datepipe.transform(a.carrierGapFrom, 'MM-dd-yyyy') : '';
      a.carrierGapTo = a.carrierGapTo ? this.datepipe.transform(a.carrierGapTo, 'MM-dd-yyyy') : '';
    })

    const registerExperiance = String.Join('/', this.apiConfigService.registerExperiance);
    this.apiService.apiPostRequest(registerExperiance, arr).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Experience Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  update3(items) {

    const addCashBank = String.Join('/', this.apiConfigService.updateExperiance);
    
    items.forEach((a: any) => {
      a.empCode = this.modelFormData.get('employeeCode').value;
      a.fromDate = a.fromDate ? this.datepipe.transform(a.fromDate, 'MM-dd-yyyy') : '';
      a.toDate = a.toDate ? this.datepipe.transform(a.toDate, 'MM-dd-yyyy') : '';
      a.carrierGapFrom = a.carrierGapFrom ? this.datepipe.transform(a.carrierGapFrom, 'MM-dd-yyyy') : '';
      a.carrierGapTo = a.carrierGapTo ? this.datepipe.transform(a.carrierGapTo, 'MM-dd-yyyy') : '';
    })

    this.apiService.apiUpdateRequest(addCashBank, items).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Experience Details Updated Successfully..', Static.Close, SnackBar.success);
            // this.router.navigate(['/dashboard/master/employee']);
          }
          this.spinner.hide();
        }
      });
  }

  cancel() {
    this.router.navigate(['dashboard/master/employee'])
  }

}

