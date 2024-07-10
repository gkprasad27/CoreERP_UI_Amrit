import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';



@Component({
  selector: 'app-wbdse',
  templateUrl: './wbdse.component.html',
  styleUrls: ['./wbdse.component.scss']
})

export class WorkBreakDownStructureComponent implements OnInit {
  modelFormData: FormGroup;
  formData: any;
  employeesList: any;
  cotList: any;
  UomList: any;
  deptList: any;
  objectum: any;
  costunitList: any;
  wbsList: any;

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WorkBreakDownStructureComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      costUnit: [null],
      wbscode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [null],
      responsiblePerson: [null],
      deliverables: [null],
      risk: [null],
      mileStones: [null],
      additionalInformation: [null],
      approvals: [null],
      duration: [null],
      startDate: [null],
      endDate: [null],
      underWbs: [null],

    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['wbscode'].disable();
    }

  }

  ngOnInit() {

    this.getcostunitData();
  }

  getcostunitData() {
    const getcostunittypeUrl = String.Join('/', this.apiConfigService.getCostUnitListList);
    this.apiService.apiGetRequest(getcostunittypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
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
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UOMList'];
            }
          }
          this.getwdseData();
        });
  }
  getwdseData() {
    const getwdseUrl = String.Join('/', this.apiConfigService.getwbselement);
    this.apiService.apiGetRequest(getwdseUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.wbsList = res.response['wbsList'];
            }
          }
          this.getDepartmentData();
        });
  }
  getDepartmentData() {
    const getdepteUrl = String.Join('/', this.apiConfigService.getdepartmentList);
    this.apiService.apiGetRequest(getdepteUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.deptList = res.response['deptList'];
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
    this.modelFormData.controls['wbscode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['wbscode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
