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

interface CostUnit {
  value: string;
  viewValue: string;
}
interface PerUnitCost {
  value: string;
  viewValue: string;
}
interface Manufacturing {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-costunits',
  templateUrl: './costunits.component.html',
  styleUrls: ['./costunits.component.scss']
})

export class CreationOfCostUnitsComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  matypeList: any;
  cotList: any;
  costunit: CostUnit[] =
    [
      //{ value: 'Fixed list', viewValue: ' Fixed list' },
      { value: 'Product', viewValue: 'Product' },
      { value: 'Job', viewValue: 'Job' },
      { value: 'Contract', viewValue: 'Contract' },
      { value: 'Project', viewValue: 'Project' }
    ];
  perunitcost: PerUnitCost[] =
    [
      { value: 'Per Unit', viewValue: 'Per Unit' },
      { value: 'Order', viewValue: 'Order' },
      { value: 'Batch', viewValue: 'Batch' },
      { value: 'Period', viewValue: 'Period' },
      { value: 'Product', viewValue: 'Product' },
      { value: 'Order/batch', viewValue: 'Order/batch' },
      { value: 'Period/batch', viewValue: 'Period/batch' },
      { value: 'Any', viewValue: 'Any' }
    ];
  manufacturing: Manufacturing[] =
    [
      //{ value: 'Fixed list', viewValue: ' Fixed list' },
      { value: 'Final product(finished)', viewValue: 'Final product(finished)' },
      { value: 'Sub-assembly', viewValue: 'Sub-assembly' },
      { value: 'Components/parts', viewValue: 'Components/parts' }

    ];
  objectum: any;
  materialList: any;


  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreationOfCostUnitsComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      objectType: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      objectNumber: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      description: [null],
      costUnitType: [null],
      perUnitCostBy: [null],
      manufacturingType: [null],
      material: [null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['objectNumber'].disable();
    }

  }


  ngOnInit() {
    this.getcostofobjecttypeData();
    this.getmaterialData();
  }

  getobjectNumberData() {
    const getobjectlist = String.Join('/', this.apiConfigService.getttingobjectNumbers,
      this.modelFormData.get('objectType').value);
    this.apiService.apiGetRequest(getobjectlist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.objectum = res.response['objectno'];
              this.modelFormData.patchValue({
                objectNumber: this.objectum
              });
            }
          }
          this.spinner.hide();
        });
  }

  getcostofobjecttypeData() {
    const getcostofobjecttypeUrl = String.Join('/', this.apiConfigService.getcostofobjectList);
    this.apiService.apiGetRequest(getcostofobjecttypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              //this.cotList = res.response['cotList'];
              this.cotList = res.response['cotList'].filter(resp => resp.usage == 'Cost unit');
            }
          }
          this.spinner.hide();
        });
  }

  getmaterialData() {

    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialListforcostunits);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['mtypeList'];

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
    this.modelFormData.controls['objectNumber'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['objectNumber'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
