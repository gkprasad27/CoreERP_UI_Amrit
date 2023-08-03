import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

interface printText {
  value: string;
  viewValue: string;
}
interface Natureoforder {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-ordertype',
  templateUrl: './ordertype.component.html',
  styleUrls: ['./ordertype.component.scss']
})

export class OrderTypeComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  printText: printText[] =
    [
      { value: 'Job order', viewValue: 'Job order' },
      { value: 'Production Order', viewValue: 'Production Order' },
      { value: 'Work Order', viewValue: 'Work Order' }
    ];
  Natureoforder: Natureoforder[] =
    [
      { value: 'Final', viewValue: 'Final' },
      { value: 'Sub-assembly', viewValue: 'Sub-assembly' },
      { value: 'Components/parts', viewValue: 'Components/parts' }
    ];
  costunitList: any;
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OrderTypeComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      orderType: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      printText: [null],
      natureofOrder: [null],
      numberSeriesFrom: [null],
      costUnit: [null],
      numberSeriesTo: [null]

    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['orderType'].disable();
    }

  }

  ngOnInit() {
    this.getCostUnitList();
  }
  getCostUnitList() {
    const voucherClassList = String.Join('/', this.apiConfigService.getCostUnitListList);
    this.apiService.apiGetRequest(voucherClassList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
            }
          }
          this.spinner.hide();
        });
  }

  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['orderType'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['orderType'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
