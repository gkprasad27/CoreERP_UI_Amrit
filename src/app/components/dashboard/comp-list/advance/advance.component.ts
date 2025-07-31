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


@Component({
  selector: 'app-advance',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, NgMultiSelectDropDownModule],
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})

export class AdvanceComponent implements OnInit {


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

  employeesList: any[] = [];
  advanceList: any[] = [];

  modelFormData: FormGroup;
  formData: any;

  isSubmitted = false;

  getProductByProductCodeArray = [];

  EmpName: any;
  //pipe = new DatePipe('en-US');
  //now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AdvanceComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      employeeId: [null],
      advanceType: [null],
      advanceAmount: [null],
      applyDate: [null],
      approveDate: [null],
      reason: [null],
      recommendedBy: [null],
      approvedBy: [null],
      status: [null],
      balance: [null],
      deductedAmount: [null]
    });



    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);


      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    // const user = JSON.parse(localStorage.getItem('user'));
    //this.getTableData();
    // this.modelFormData.patchValue({
    //   employeeId: user.userName
    // });
    this.allApis();
    // this.getProductByProductCode(user.userName);
  }


  allApis() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    const getAdvancetypeList = String.Join('/', this.apiConfigService.getAdvancetypeList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getEmployeeList),
        this.apiService.apiGetRequest(getAdvancetypeList),

      ]).subscribe(([emplist, advancesList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(emplist) && emplist.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(emplist.response)) {
            this.employeesList = emplist.response['emplist'];
            debugger
            if (!this.commonService.checkNullOrUndefined(this.formData.item) && this.formData.item.employeeId) {
              const selectedEmployee = this.employeesList.find(emp => emp.id === this.formData.item.employeeId);
              if (selectedEmployee) {
                this.modelFormData.patchValue({
                  employeeId: [{ id: selectedEmployee.id, text: selectedEmployee.text }],
                })
              }
            }
          }
        }

        if (!this.commonService.checkNullOrUndefined(advancesList) && advancesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(advancesList.response)) {
            this.advanceList = advancesList.response['advancesList'];
          }
        }

      });
    });
  }

  // getProductByProductCode(value) {

  //   if (!this.commonService.checkNullOrUndefined(value) && value != '') {
  //     const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getEmpCode);
  //     this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
  //       response => {
  //         const res = response.body;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             if (!this.commonService.checkNullOrUndefined(res.response['Empcodes'])) {
  //               this.getProductByProductCodeArray = res.response['Empcodes'];
  //               this.spinner.hide();
  //             }
  //           }
  //         }

  //       });
  //   } else {
  //     this.getProductByProductCodeArray = [];
  //   }
  // }


  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.formData.item.employeeId = this.formData.item.employeeId[0].id;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

