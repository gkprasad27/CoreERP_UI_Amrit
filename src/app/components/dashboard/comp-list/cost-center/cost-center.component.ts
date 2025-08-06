import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
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
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface Function {
  value: string;
  viewValue: string;
}
interface Type {
  value: string;
  viewValue: string;
}
interface CostType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cost-center',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule ],
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})

export class CostCenterComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  employeesList: any;

  Function: Function[] =
    [
      { value: 'Manufacturing Operations', viewValue: 'Manufacturing Operations' },
      { value: 'Administration', viewValue: 'Administration' },
      { value: 'Personal', viewValue: 'Personal' },
      { value: 'Sales', viewValue: 'Sales' },
      { value: 'Distribution', viewValue: 'Distribution' },
      { value: 'Material Management', viewValue: 'Material Management' },
      { value: 'Research and Development', viewValue: 'Research and Development' }
    ];
  Type: Type[] =
    [
      { value: 'Process', viewValue: 'Process' },
      { value: 'Operation ', viewValue: 'Operation ' },
      { value: 'Service', viewValue: 'Service' }
    ];
  costType: CostType[] =
    [
      { value: 'Manufacturing Cost', viewValue: 'Manufacturing Cost' },
      { value: 'Non-Manufacturing ', viewValue: 'Non-Manufacturing ' },
      { value: 'Non Cost', viewValue: 'Non Cost' },
      { value: 'Capital Expenditure', viewValue: 'Capital Expenditure' }
    ];
  cotList: any;
  UomList: any;
  deptList: any;
  objectum: any;
  fdeptList: any;
  StatesList: any;

  constructor(public commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CostCenterComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      objectType: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]],
      code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      name: [null],
      functions: [null],
      type: [null],
      quantity: [null],
      department: [null],
      uom: [null],
      fromDate: [null],
      responsiblePerson: [null],
      costType: [null],
      address: [null],
      city: [null],
      state: [null],
      location: [null],
      email: [null],
      phone: [null],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {

    this.getcostofobjecttypeData();
  }
  getobjectNumberData() {
    const getobjectlist = String.Join('/', this.apiConfigService.getttingobjectNumbers,
      this.modelFormData.get('objectType').value);
    this.apiService.apiGetRequest(getobjectlist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.objectum = res.response['objectno'];
              this.modelFormData.patchValue({
                code: this.objectum
              });
            }
          }
          this.spinner.hide();
        });
  }
  getcostofobjecttypeData() {
    const getcostofobjecttypeUrl = String.Join('/', this.apiConfigService.getcostofobjectList);
    this.apiService.apiGetRequest(getcostofobjecttypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              //this.cotList = res.response['cotList'];
              this.cotList = res.response['cotList'].filter(resp => resp.usage == 'Cost center');
            }
          }
          this.getEmployeesList();
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
          this.getuomTypeData();
        });
  }
  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UOMList'];
            }
          }
          this.getDepartmentData();
        });
  }
  getDepartmentData() {
    const getdepteUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
    this.apiService.apiGetRequest(getdepteUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.fdeptList = res.response['fdeptList'];
            }
          }
          this.getStatetData();
        });
  }

  getStatetData() {
    const getdepteUrl = String.Join('/', this.apiConfigService.getstatesList);
    this.apiService.apiGetRequest(getdepteUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.StatesList = res.response['StatesList'];
            }
          }
          this.spinner.hide();
        });
  }

  approveOrReject(event) {
    if (event) {
      this.modelFormData.patchValue({
        quantity: "Accept",
        reject: null
      });
    } else {
      this.modelFormData.patchValue({
        quantity: null,
        reject: "Reject"
      });
    }
  }
  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['code'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
