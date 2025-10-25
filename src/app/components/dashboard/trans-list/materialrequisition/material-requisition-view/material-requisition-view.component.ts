import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { AlertService } from '../../../../../services/alert.service';
import { StatusCodes } from '../../../../../enums/common/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-material-requisition-view',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, NgMultiSelectDropDownModule, TranslateModule, TableComponent, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './material-requisition-view.component.html',
  styleUrls: ['./material-requisition-view.component.scss']
})
export class MaterialRequisitionViewComponent {


  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'text',
    textField: 'text',
    enableCheckAll: true,
    allowSearchFilter: true
  };

  formData: FormGroup;

  tableData = [];

  materialPrintData = [];

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
      this.formData.patchValue({
        allocatedPerson: [{ text: value.item.allocatedPerson }],
      })
    }
  }

  print() {
    this.materialPrintData = this.tableData;
    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('materialPrintData').innerHTML;
      w.document.body.innerHTML = html;
      this.materialPrintData = [];
      w.print();
    }, 1000);
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
    const formValue = this.formData.value;
    formValue.allocatedPerson = formValue.allocatedPerson && formValue.allocatedPerson.length ? formValue.allocatedPerson[0].text : null;
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (formValue.index == 0) {
      this.formData.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [formValue, ...data];
    } else {
      data = data.map((res: any) => res = res.index == formValue.index ? { ...res, ...formValue } : res);
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
