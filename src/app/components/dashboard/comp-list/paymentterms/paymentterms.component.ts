import { Component, OnInit, Optional } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { AlertService } from '../../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { SnackBar } from '../../../../enums/common/common';
import { MatDialogRef } from '@angular/material/dialog';

interface Term {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-paymentterms',
  templateUrl: './paymentterms.component.html',
  styleUrls: ['./paymentterms.component.scss']
})

export class PaymentTermsComponent implements OnInit {

  modelFormData: FormGroup;
  sendDynTableData: any;

  routeEdit = '';
  tableData = [];
  dynTableProps = this.tablePropsFunc()
  isSubmitted = false;
  formData: any;
  taxcodeList: any;
  taxaccList: any;
  tdsList: any;
  incmList: any;

  pterm: Term[] =
    [
      { value: '1Day', viewValue: '1St Day' },
      { value: '2Day', viewValue: '2nd Day' },
      { value: '3ay', viewValue: '3rd Day' },
      { value: '4Day', viewValue: '4th Day' },
      { value: '5Day', viewValue: '5th Day' },
      { value: '6Day', viewValue: '6th Day' },
      { value: '7Day', viewValue: '7th Day' }
    ];
  companyList: any;



  tablePropsFunc() {
    return {
      tableData: {
        days: {
          value: null, type: 'text', width: 150
        },
        discount: {
          value: null, type: 'text', width: 150
        },


        delete: {
          type: 'delete',
          newObject: true
        }
      },

      formControl: {
        days: [null,],
        discount: [null, [Validators.required]]
        //ext: [null,]
      }
    }
  }



  constructor(
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public route: ActivatedRoute,
    private commonService: CommonService
  ) {

    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

    // @Optional() is used to prevent error if no data is passed
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],


    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  getpaymenttermDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getpaymenttermDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.setValue(res.response['PaymentTermMasters']);
              this.sendDynTableData = { type: 'editValue', data: res.response['PaymentTermDetail'] };
            }
          }
        });
  }

  ngOnInit() {
    if (this.routeEdit != '') {
      this.getpaymenttermDetail(this.routeEdit);
    }
  }

  get formControls() { return this.modelFormData.controls; }

  emitTableData(data) {
    this.tableData = data.data;
  }

  save() {
    this.savepaymentterms();
  }

  cancel() {
    this.router.navigate(['/dashboard/master/paymentterms']);
  }
  reset() {
    this.tableData = [];
    this.modelFormData.reset();
    //this.formData.controls['subAssetNumber'].disable();
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }
  savepaymentterms() {
    this.tableData = this.commonService.formatTableData(this.tableData);
    const addCashBank = String.Join('/', this.apiConfigService.registerpaymenttermsList);
    const requestObj = { paymentstrmsHdr: this.modelFormData.value, paymentstrmsDetail: this.tableData };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('paymentterms created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/paymentterms']);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }
}
