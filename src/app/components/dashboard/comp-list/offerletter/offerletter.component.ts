import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
import { AddOrEditService } from '../add-or-edit.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { of } from 'rxjs';

@Component({
  selector: 'app-offerletter',
  imports: [CommonModule, ReactiveFormsModule, TypeaheadModule, NonEditableDatepicker, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './offerletter.component.html',
  styleUrl: './offerletter.component.scss',
  providers: [DatePipe]
})
export class OfferletterComponent implements OnInit {

  newDate = new Date();

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;

  statusList: any[] = ['Accepted', 'Rejected', 'Cancelled', 'Hold'];
  jobTypeList: any[] = ['Permanent', 'PartTime', 'Daily vaiges', 'Contrat'];
  designationsList: any[] = [];
  employeesList: any[] = [];
  getEmploeebyCodeArray = [];

  constructor(public commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,

    public dialogRef: MatDialogRef<OfferletterComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      empCode: [null, [Validators.required]],
      role: [''],
      jobType: [''],
      reporting: [''],
      empName: [''],
      designation: [''],
      cTC: [''],
      offerValid: [''],
      effectiveFrom: [''],
      status: [''],
      remarks: [''],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['empCode'].disable();
    }
  }

  ngOnInit(): void {
    this.allApis();
  }

  allApis() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    const getDesignationsList = String.Join('/', this.apiConfigService.getDesignationsList);
    const getCompanysList = this.formData.item ? String.Join('/', this.apiConfigService.getCompanysList) : of(null); // Emits null if optional
    const getEmployeeListE = this.formData.item ? String.Join('/', this.apiConfigService.getEmployeeListE, obj.companyCode) : of(null); // Emits null if optional

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getEmployeeList),
        this.apiService.apiGetRequest(getDesignationsList),
                this.apiService.apiGetRequest(getCompanysList),

        this.apiService.apiGetRequest(getEmployeeListE)
      ]).subscribe(([employeeList, designationsList, companyList, employeeListE]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(employeeList) && employeeList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(employeeList.response)) {
            this.employeesList = employeeList.response['emplist'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(designationsList) && designationsList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(designationsList.response)) {
            this.designationsList = designationsList.response['designationsList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(companyList) && companyList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(companyList.response)) {
            const companiesList = companyList.response['companiesList'];
            this.formData.item.companyName = companiesList.find(x => x.companyCode === obj.companyCode)?.companyName || '';
          }
        }

        if (!this.commonService.checkNullOrUndefined(employeeListE) && employeeListE.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(employeeListE.response)) {
            // this.employeeListE = employeeListE.response['employeeListE'];
          }
        }

      });
    });
  }

  getEmploeebycode(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getEmploeebycodeUrl = String.Join('/', this.apiConfigService.getEmploeebycode, value);
      this.apiService.apiGetRequest(getEmploeebycodeUrl).subscribe(
        response => {
          this.spinner.hide();
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              if (!this.commonService.checkNullOrUndefined(response.response['EducationList'])) {
                this.getEmploeebyCodeArray = response.response['EducationList'];
                this.spinner.hide();
              }
            }
          }

        });
    } else {
      this.getEmploeebyCodeArray = [];
    }
  }

  onSearchChange(code) {
    this.modelFormData.patchValue({
      empName: code.item.name
    });
  }

  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    // this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.getRawValue();
    this.formData.item.offerValid = this.formData.item.offerValid ? this.datepipe.transform(this.formData.item.offerValid, 'MM-dd-yyyy') : '';
    this.formData.item.effectiveFrom = this.formData.item.effectiveFrom ? this.datepipe.transform(this.formData.item.effectiveFrom, 'MM-dd-yyyy') : '';

    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  offerLetterO: any;
  print() {
    this.offerLetterO = this.modelFormData.value;
    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('offerLetterO').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 1000);
  }

}
