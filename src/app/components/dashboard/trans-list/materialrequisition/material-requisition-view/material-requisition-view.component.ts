import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { AlertService } from '../../../../../services/alert.service';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { Static } from '../../../../../enums/common/static';

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
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '../../../../../reuse-components/table/table.component';
import { NonEditableDatepicker } from '../../../../../directives/format-datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material-requisition-view',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TableComponent, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
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
      action: [
  { id: 'Edit', type: 'edit' }
],
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
                d.action = [
  { id: 'Edit', type: 'edit' }
],
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
      action: [
  { id: 'Edit', type: 'edit' }
]
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
