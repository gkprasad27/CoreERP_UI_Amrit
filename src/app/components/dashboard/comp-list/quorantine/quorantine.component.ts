import { Component, Inject, Optional } from '@angular/core';
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
import { ApiService } from '../../../../services/api.service';
import { AddOrEditService } from '../add-or-edit.service';
import { String } from 'typescript-string-operations';
import { StatusCodes } from '../../../../enums/common/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-quorantine',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './quorantine.component.html',
  styleUrls: ['./quorantine.component.scss']
})
export class QuorantineComponent {

  modelFormData: FormGroup;
  formData: any;

  getInvoiceDetail: any[] = [];
  getInvoiceDetailData: any;

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<QuorantineComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      tag: ['', [Validators.required]],
      itemCode: [''],
      qcRefNo: [''],
      invoiceNumber: [''],
      saleOrderNo: [''],
      custoMer: [''],
      customerName: [''],
      custmerPO: [''],
    });
    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['tag'].disable();
    }

  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }


  tagNameChange() {
    const obj = this.getInvoiceDetailData['invoiceDetailsList'].find((i: any) => i.tagname == this.modelFormData.value.tag);
    this.modelFormData.patchValue({
      itemCode: obj?.materialCode,
      qcRefNo: obj?.qcRefNo,
      invoiceNumber: obj?.invoiceNo,
      saleOrderNo: obj?.saleorder,
      custoMer: this.getInvoiceDetailData['invoiceMasterList']?.customerName,
      customerName: this.getInvoiceDetailData['invoiceMasterList']?.custName,
      custmerPO: this.getInvoiceDetailData['invoiceMasterList']?.poNumber,
    })  
  }

  getInvoiceDetailList(value) {
  if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getInvoiceDetailList, value);
      this.apiService.apiGetRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              this.spinner.hide();
              if (!this.commonService.checkNullOrUndefined(response.response['invoiceDetailsList'])) {
                this.getInvoiceDetail = response.response['invoiceDetailsList'];
                this.getInvoiceDetailData = response.response;
              }
            }
          }

        });
    } else {
      this.getInvoiceDetail = [];
    }
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['tag'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['tag'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
