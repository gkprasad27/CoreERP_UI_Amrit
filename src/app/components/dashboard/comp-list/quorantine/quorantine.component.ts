import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { AddOrEditService } from '../add-or-edit.service';
import { String } from 'typescript-string-operations';
import { StatusCodes } from 'src/app/enums/common/common';

@Component({
  selector: 'app-quorantine',
  templateUrl: './quorantine.component.html',
  styleUrls: ['./quorantine.component.scss']
})
export class QuorantineComponent {

  modelFormData: FormGroup;
  formData: any;

  getInvoiceDetail: any[] = [];

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
      tagName: ['', [Validators.required]],
      product: [''],
      QCRefNo: [''],
      invoiceNumber: [''],
      saleOrder: [''],
      custoMer: [''],
      custmerPO: [''],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    this.getInvoiceDetailList();
  }

  get formControls() { return this.modelFormData.controls; }

  getInvoiceDetailList() {
    const getInvoiceDetailList = String.Join('/', this.apiConfigService.getInvoiceDetailList);
    this.apiService.apiGetRequest(getInvoiceDetailList)
      .subscribe(
        response => {
          if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
            debugger
            if (!this.commonService.checkNullOrUndefined(response.response)) {
              this.getInvoiceDetail = response.response['invoiceDetailsList'];
            }
          }
          this.spinner.hide();
        });
  }

  tagNameChange() {
    const obj = this.getInvoiceDetail.find((i: any) => i.materialCode == this.modelFormData.value.tagName);
    this.modelFormData.patchValue({
      product: obj?.materialCode,
      QCRefNo: obj?.qcRefNo,
      invoiceNumber: obj?.invoiceNo,
      saleOrder: obj?.saleorder,
      custoMer: obj?.custoMer,
      custmerPO: obj?.custmerPO,
    })
    // if (!this.commonService.checkNullOrUndefined(value) && value != '') {
    //   const getProductByProductCodeUrl = String.Join('/', this.apiConfigService.getEmpCode);
    //   this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
    //     response => {
    //       const res = response.body;
    //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
    //         if (!this.commonService.checkNullOrUndefined(res.response)) {
    //           if (!this.commonService.checkNullOrUndefined(res.response['Empcodes'])) {
    //             this.getProductByProductCodeArray = res.response['Empcodes'];
    //             this.spinner.hide();
    //           }
    //         }
    //       }

    //     });
    // } else {
    //   this.getProductByProductCodeArray = [];
    // }
  }

  save() {
    debugger
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
