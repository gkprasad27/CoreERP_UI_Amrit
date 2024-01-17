import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddOrEditService } from '../add-or-edit.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from 'src/app/enums/common/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dispatchdetails',
  templateUrl: './dispatchdetails.component.html',
  styleUrls: ['./dispatchdetails.component.scss']
})
export class DispatchdetailsComponent {
  modelFormData: FormGroup;
  formData: any;

  getInvoiceList: any[] = [];

  fileList: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<DispatchdetailsComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
debugger
    this.modelFormData = this.formBuilder.group({
      id: 0,
      saleOrder: ['', [Validators.required]],
      poNumber: [''],
      invoiceNumber: [''],
      lrNumber: [''],
      lrDate: [''],
      transporter: [''],
      boxes: [''],
      imageURL: ['']
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      // this.modelFormData.controls['languageCode'].disable();
    }

  }
  

  ngOnInit() {
    this.getInvoiceData();
  }

  get formControls() { return this.modelFormData.controls; }


  getInvoiceData() {
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getInvoiceData);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getInvoiceList = res.response['InvoiceList'];
            }
          }
        });
  }

  getsaleOrderDetail() {
    const obj = this.getInvoiceList.find((i: any) => i.saleOrderNo == this.modelFormData.value.saleOrder);
    this.modelFormData.patchValue({
      poNumber: obj.poNumber,
      invoiceNumber: obj.invoiceNo
    })
  }


  downLoad() {
    debugger
    const url = String.Join('/', this.apiConfigService.getFile, this.formData.get('imageURL').value);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }


  emitFilesList(event: any) {
    debugger
    this.fileList = event[0];
  }


  save() {
    debugger
    if (this.modelFormData.invalid) {
      return;
    }
    // this.modelFormData.controls['languageCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.uploadFile();
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      // this.modelFormData.controls['languageCode'].disable();
    }
  }



  uploadFile() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList ? this.fileList.name.split('.')[0] : '');
    const formData = new FormData();
    formData.append("file", this.fileList);

    return this.httpClient.post<any>(addsq, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            // this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
        // this.router.navigate(['/dashboard/transaction/saleorder'])
      });
  }


  cancel() {
    this.dialogRef.close();
  }

}