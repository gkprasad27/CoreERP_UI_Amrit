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
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-dispatchdetails',
  templateUrl: './dispatchdetails.component.html',
  styleUrls: ['./dispatchdetails.component.scss']
})
export class DispatchdetailsComponent {
  modelFormData: FormGroup;
  formData: any;

  getInvoiceList: any[] = [];
  getInvoiceListData: any[] = [];

  fileList: any;


  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'saleOrderNo',
    textField: 'saleOrderNo',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };



  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private datepipe: DatePipe,
    public dialogRef: MatDialogRef<DispatchdetailsComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
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
    
      this.modelFormData.patchValue({
        saleOrder: [{ saleOrderNo: this.formData.item.saleOrder }],
      })
      this.getInvoiceListApi(false);
      // this.modelFormData.controls['languageCode'].disable();
    }

  }


  ngOnInit() {
    this.getInvoiceData();
  }

  get formControls() { return this.modelFormData.controls; }


  getInvoiceData() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getInvoiceData, obj.companyCode);
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

  invoiceNoDetail() {

    const obj = this.getInvoiceListData.find((i: any) => i.invoiceNo == this.modelFormData.value.invoiceNumber);
    this.modelFormData.patchValue({
      poNumber: obj.poNumber,
      // invoiceNumber: obj.invoiceNo
    })
  }


  getInvoiceListApi(flag = true) {
    if (flag) {
      this.modelFormData.patchValue({
        poNumber: '',
        invoiceNumber: ''
      })
    }
    const url = String.Join('/', this.apiConfigService.getInvoiceList, this.modelFormData.value.saleOrder[0].saleOrderNo);
    this.apiService.apiGetRequest(url)
      .subscribe(
        res => {
          if (res) {
            this.spinner.hide();

            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                this.getInvoiceListData = res.response.InvoiceData;
              }
            }
          }
        });
  }


  downLoad() {
    const url = String.Join('/', this.apiConfigService.getFile, this.modelFormData.get('imageURL').value);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }


  emitFilesList(event: any) {
    this.fileList = event[0];
  }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    // this.modelFormData.controls['languageCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.formData.item.lrDate = this.modelFormData.get('lrDate').value ? this.datepipe.transform(this.modelFormData.get('lrDate').value, 'yyyy-MM-dd') : '';
    this.formData.item.imageURL = this.fileList ? this.fileList.name.split('.')[0] : '';
  
    if (typeof this.formData.item.saleOrder != 'string') {
      this.formData.item.saleOrder = this.formData.item.saleOrder[0].saleOrderNo;
    }

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