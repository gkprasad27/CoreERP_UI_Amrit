import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from 'src/app/reuse-components';
import { CommonService } from 'src/app/services/common.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { SnackBar, StatusCodes } from 'src/app/enums/common/common';
import { Static } from 'src/app/enums/common/static';

@Component({
  selector: 'app-material-requisition-view',
  templateUrl: './material-requisition-view.component.html',
  styleUrls: ['./material-requisition-view.component.scss']
})
export class MaterialRequisitionViewComponent {


  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  formData: FormGroup;

  tableData = [];

  constructor(public commonService: CommonService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<MaterialRequisitionViewComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

      this.formDataGroup();
  }

  formDataGroup() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.formData = this.formBuilder.group({

      allocatedPerson: [null],
      mechine: [null],
      startDate: [null],
      endDate: [null],
      workStatus: [null],
      
      productionPlanDate: [null],
      productionTargetDate: [null],
      highlight: false,
      action: 'edit',
      index: 0
    });
  }

  ngOnInit() {
    this.getCommitmentList();
  }

  getCommitmentList() {
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    const url = String.Join('/', this.apiConfigService.getProductionStatus, this.data.row.saleOrderNumber, this.data.row.materialCode, this.data.row.productionTag);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              response.response.tagsDetailStatus.forEach((d: any, index: number) => {
                d.action = 'edit',
                  d.index = index + 1
              })
              this.tableData = res.response.tagsDetailStatus;
            }
          }
        });
  }

  
  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData.patchValue(value.item);
    }
  }

  resetForm() {
    this.formData.reset();
    this.formData.patchValue({
      index: 0,
      action: 'edit'
    });
  };

  saveForm() {
    if (this.formData.invalid) {
      return;
    }
    this.formData.patchValue({
      type: '',
      highlight: true
    })
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.formData.value.index == 0) {
      this.formData.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.formData.value.index ? { ...res, ...this.formData.value } : res);
    }
    setTimeout(() => {
      this.tableData = data;
    });
    this.resetForm();
  }

  save() {
    const url = String.Join('/', this.apiConfigService.updateProductionStatus);
    const requestObj = { prodissueetails : this.tableData };
    this.apiService.apiPostRequest(url, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          this.spinner.hide();
          this.back();
        }
      });
  }

  back() {
    this.dialogRef.close();
  }

}
