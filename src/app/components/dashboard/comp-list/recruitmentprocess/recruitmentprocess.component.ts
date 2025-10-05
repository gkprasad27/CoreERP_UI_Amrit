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
import { FileUploadComponent } from '../../../../reuse-components/file-upload/file-upload.component';

@Component({
  selector: 'app-recruitmentprocess',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, TableComponent, FileUploadComponent],
  templateUrl: './recruitmentprocess.component.html',
  styleUrls: ['./recruitmentprocess.component.scss'],
  providers: [DatePipe]
})
export class RecruitmentProcessComponent implements OnInit {


  modelFormData: FormGroup;
  modelFormData1: FormGroup;
  modelFormData2: FormGroup;
  modelFormData3: FormGroup;

  formData: any;

  companyList: any[] = [];
  companiesList: any[] = [];
  // branchesList: any[] = [];
  bankList: any[] = [];
  employeesList: any[] = [];
  designationsList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  stateList1: any[] = [];
  educationList: any[] = ['Graduate', 'Under Graduate', 'Post Graduate'];
  educationTypeList: any[] = ['Full Time', 'Part Time'];
  educationGapList: any[] = ['Yes', 'No'];
  carrierGapList: any[] = ['Yes', 'No'];

  genderList
  fileList: any;
  fileList1: any;

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
      // branchCode: [''],
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

      id: 0,
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
      educationGapFrom: [''],
      educationGapTo: [''],
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
    if (this.modelFormData.get('employeeCode').value) {
      this.allApis1();
    }
  }


  allApis() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getCompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    // const getBranchesList = String.Join('/', this.apiConfigService.getBranchesList);
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    const getBankMastersList = String.Join('/', this.apiConfigService.getBankMastersList);
    const getDesignationsList = String.Join('/', this.apiConfigService.getDesignationsList);
    const getCountryList = String.Join('/', this.apiConfigService.getCountryList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getCompanyList),
        // this.apiService.apiGetRequest(getBranchesList),
        this.apiService.apiGetRequest(getEmployeeList),
        this.apiService.apiGetRequest(getBankMastersList),
        this.apiService.apiGetRequest(getDesignationsList),
        this.apiService.apiGetRequest(getCountryList),
      ]).subscribe(([companyList, employeeList, bankMastersList, designationsList, countrysList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(companyList) && companyList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(companyList.response)) {
            this.companiesList = companyList.response['companiesList'];
          }
        }

        // if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
        //   if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
        //     this.branchesList = branchesList.response['branchesList'];
        //   }
        // }

        if (!this.commonService.checkNullOrUndefined(employeeList) && employeeList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(employeeList.response)) {
            this.employeesList = employeeList.response['emplist'];
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

        if (!this.commonService.checkNullOrUndefined(countrysList) && countrysList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(countrysList.response)) {
            this.countryList = countrysList.response['countryList'];
          }
        }

      });
    });
  }

  allApis1() {

    const getAddressList = String.Join('/', this.apiConfigService.getAddressListR, this.modelFormData.get('employeeCode').value);
    const getEducationList = String.Join('/', this.apiConfigService.getEducationListR, this.modelFormData.get('employeeCode').value);
    const getExperianceList = String.Join('/', this.apiConfigService.getExperianceListR, this.modelFormData.get('employeeCode').value);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getAddressList),
        this.apiService.apiGetRequest(getEducationList),
        this.apiService.apiGetRequest(getExperianceList),
      ]).subscribe(([addressList, educationList, experianceList]) => {

        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(addressList) && addressList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(addressList.response)) {
            this.modelFormData1.patchValue(addressList.response['AddressList']);
            if (this.modelFormData1.value.country) {
              this.onCountryChange();
            }
            if (this.modelFormData1.value.pCountry) {
              this.onPCountryChange();
            }
          }
        }

        if (!this.commonService.checkNullOrUndefined(educationList) && educationList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(educationList.response)) {
            if (educationList.response['EducationList'] && educationList.response['EducationList'].length) {
              educationList.response['EducationList'].forEach((s: any, index: number) => {
                s.dubQty = s.qty;
                s.index = index + 1;
                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ];
              })
              this.tableData = educationList.response['EducationList'];
            }
          }
        }

        if (!this.commonService.checkNullOrUndefined(experianceList) && experianceList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(experianceList.response)) {
            if (experianceList.response['experienceList'] && experianceList.response['experienceList'].length) {
              experianceList.response['experienceList'].forEach((s: any, index: number) => {
                s.dubQty = s.qty;
                s.index = index + 1;
                s.action = [
                  { id: 'Edit', type: 'edit' },
                  { id: 'Delete', type: 'delete' }
                ];
              })
              this.tableData1 = experianceList.response['experienceList'];
            }
          }
        }

      });
    });
  }


  onPCountryChange() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getStatesList, this.modelFormData1.value.pCountry);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stateList1 = res.response['StatesList'];
            }
          }
        });
  }

  onCountryChange() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getStatesList, this.modelFormData1.value.country);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stateList = res.response['StatesList'];
            }
          }
        });
  }


  downLoadFile(event: any, flag = false) {
    const url = String.Join('/', this.apiConfigService.getFile, flag ? event.item[event.action] : event.name);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  emitFilesList(event: any) {
    this.fileList = event[0];
  }

  emitFilesList1(event: any) {
    this.fileList1 = event[0];
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
  }

  saveForm() {
    if (this.modelFormData2.invalid) {
      return;
    }
    this.modelFormData2.patchValue({
      highlight: true,
      changed: true,
    });
    let fObj = this.modelFormData2.value;
    fObj.attachment = this.fileList ? this.fileList.name.split('.')[0] : '';

    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.modelFormData2.value.index == 0) {
      fObj.index = data ? (data.length + 1) : 1;
      data = [fObj, ...data];
    } else {
      data = data.map((res: any) => res = res.index == fObj.index ? fObj : res);
    }
    setTimeout(() => {
      this.tableData = data;
      this.resetForm();
    });
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      if (value.item.id) {
        this.deleteItem(value.item);
      } else {
        this.tableComponent.defaultValues();
        this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
      }
    } else {
      this.modelFormData2.patchValue(value.item);
      this.fileList = { name: value.item.attachment };
      this.modelFormData2.enable();
    }
  }

  deleteItem(item: any) {
    const obj = {
      description: 'Are you sure you want to delete?'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const deleteEducation = String.Join('/', this.apiConfigService.deleteEducationR, item.id);
        this.apiService.apiDeleteRequest(deleteEducation).subscribe(response => {
          this.spinner.hide();
          if (response.status === StatusCodes.pass) {
            this.tableComponent.defaultValues();
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
  }

  saveForm1() {
    if (this.modelFormData3.invalid) {
      return;
    }
    this.modelFormData3.patchValue({
      highlight: true,
      changed: true,
    });

    let fObj = this.modelFormData3.value;
    fObj.attachment = this.fileList1 ? this.fileList1.name.split('.')[0] : '';

    let data: any = this.tableData1;
    this.tableData1 = null;
    this.tableComponent.defaultValues();
    if (this.modelFormData3.value.index == 0) {
      fObj.index = data ? (data.length + 1) : 1;
      data = [fObj, ...data];
    } else {
      data = data.map((res: any) => res = res.index == fObj.index ? fObj : res);
    }
    setTimeout(() => {
      this.tableData1 = data;
      this.resetForm();
    });
  }

  editOrDeleteEvent1(value) {
    if (value.action === 'Delete') {
      if (value.item.id) {
        this.deleteItem(value.item);
      } else {
        this.tableComponent.defaultValues();
        this.tableData1 = this.tableData1.filter((res: any) => res.index != value.item.index);
      }
    } else {
      this.modelFormData3.patchValue(value.item);
      this.fileList1 = { name: value.item.attachment };
      this.modelFormData3.enable();
    }
  }

  deleteItem1(item: any) {
    const obj = {
      description: 'Are you sure you want to delete?'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const deleteExperiance = String.Join('/', this.apiConfigService.deleteExperianceR, item.id);
        this.apiService.apiDeleteRequest(deleteExperiance).subscribe(response => {
          this.spinner.hide();
          if (response.status === StatusCodes.pass) {
            this.tableComponent.defaultValues();
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

    formData = this.modelFormData.getRawValue();
    formData.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'dd-MM-yyyy') : '';
    formData.joiningDate = this.modelFormData.get('joiningDate').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'dd-MM-yyyy') : '';
    formData.releavingDate = this.modelFormData.get('releavingDate').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'dd-MM-yyyy') : '';

    const addCashBank = String.Join('/', this.apiConfigService.registerEmployeeR);
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
    const addCashBank = String.Join('/', this.apiConfigService.updateEmployeeR);

    let formData: any = {};

    formData = this.modelFormData.getRawValue();
    formData.dob = this.modelFormData.get('dob').value ? this.datepipe.transform(this.modelFormData.get('dob').value, 'yyyy-MM-dd') : '';
    formData.joiningDate = this.modelFormData.get('joiningDate').value ? this.datepipe.transform(this.modelFormData.get('joiningDate').value, 'yyyy-MM-dd') : '';
    formData.releavingDate = this.modelFormData.get('releavingDate').value ? this.datepipe.transform(this.modelFormData.get('releavingDate').value, 'yyyy-MM-dd') : '';

    this.apiService.apiUpdateRequest(addCashBank, formData).subscribe(
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

    if (this.formData.action == "Edit" && this.modelFormData1.value.id) {
      this.update1();
      return
    }

    let formData: any = {};
    formData = this.modelFormData1.getRawValue();
    formData.empCode = this.modelFormData.get('employeeCode').value;

    const addCashBank = String.Join('/', this.apiConfigService.registerEmployeeAddressR);
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

    const addCashBank = String.Join('/', this.apiConfigService.updateAddressR);

    let formData: any = {};
    formData = this.modelFormData1.getRawValue();
    formData.empCode = this.modelFormData.get('employeeCode').value;

    this.apiService.apiUpdateRequest(addCashBank, formData).subscribe(
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

    arr.forEach((a: any) => {
      a.empCode = this.modelFormData.get('employeeCode').value;
      a.yearofPassing = a.yearofPassing ? this.datepipe.transform(a.yearofPassing, 'MM-dd-yyyy') : '';
      a.educationGapFrom = a.educationGapFrom ? this.datepipe.transform(a.educationGapFrom, 'MM-dd-yyyy') : '';
      a.educationGapTo = a.educationGapTo ? this.datepipe.transform(a.educationGapTo, 'MM-dd-yyyy') : '';
    })

    const registerEducation = String.Join('/', this.apiConfigService.registerEducationR);
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

    arr.forEach((a: any) => {
      a.empCode = this.modelFormData.get('employeeCode').value;
      a.fromDate = a.fromDate ? this.datepipe.transform(a.fromDate, 'MM-dd-yyyy') : '';
      a.toDate = a.toDate ? this.datepipe.transform(a.toDate, 'MM-dd-yyyy') : '';
      a.carrierGapFrom = a.carrierGapFrom ? this.datepipe.transform(a.carrierGapFrom, 'MM-dd-yyyy') : '';
      a.carrierGapTo = a.carrierGapTo ? this.datepipe.transform(a.carrierGapTo, 'MM-dd-yyyy') : '';
    })

    const registerExperiance = String.Join('/', this.apiConfigService.registerExperianceR);
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


  cancel() {
    this.router.navigate(['dashboard/master/employee'])
  }

}

