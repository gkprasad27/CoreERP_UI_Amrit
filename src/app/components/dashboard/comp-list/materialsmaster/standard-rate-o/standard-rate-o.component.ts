import { Component, Inject, Optional, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../../add-or-edit.service';
import { TableComponent } from 'src/app/reuse-components';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Static } from 'src/app/enums/common/static';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-standard-rate-o',
  templateUrl: './standard-rate-o.component.html',
  styleUrls: ['./standard-rate-o.component.scss']
})
export class StandardRateOComponent {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  @Input() materialCode: number

  formData: FormGroup;
  formData1: FormGroup;

  tableData = [];
  instruments = [];
  materialList = [];
  msizeList = [];

  Type: Type[] =
    [
      { value: 'Balancing', viewValue: 'Balancing' },
      { value: 'Inspection', viewValue: 'Inspection' },
    ];

  routeEdit = '';

  isEdit = false;


ProductType: Type[] =
  [
    { value: 'Pulley', viewValue: 'Pulley' },
    { value: 'Taperlock Bush', viewValue: 'Taperlock Bush' },
    { value: 'Adapter', viewValue: 'Adapter' },
    { value: 'Coupling', viewValue: 'Coupling' },
    { value: 'Belts', viewValue: 'Belts' },
    { value: 'Forgings', viewValue: 'Forgings' },
    { value: 'Castings', viewValue: 'Castings' },
    { value: 'Flanges', viewValue: 'Flanges' },
    { value: 'Plates', viewValue: 'Plates' },
  ];

  QCConfigDetailData: any[] = [];

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    private alertService: AlertService,

  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

    this.formData = this.formBuilder.group({
      code: [null, Validators.required],
      type: [null, Validators.required],
      product: [''],
      materialCode: [null],
    });

    this.formData1 = this.formBuilder.group({
      parameter: [''],
      uom: [''],
      uomName: [''],
      spec: [''],
      minValue: [''],
      maxValue: [''],
      instrument: [''],
      highlight: false,
      changed: true,
      id: [0],
      action: 'editDelete',
      index: 0
    });

  }

  get formControls() { return this.formData.controls; }

  ngOnInit() {
    this.getmaterialData();
    this.getMaterialSizeTableData();
    this.getCommitmentLists();
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
      this.getCommitmentList('edit');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.materialCode) {
      this.formData.patchValue({
        materialCode: changes.materialCode.currentValue,
        code: changes.materialCode.currentValue,
      })
    }
  }

  getMaterialSizeTableData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getmsizeList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.msizeList = res.response['msizeList'];
            }
          }
          this.spinner.hide();
        });
  }

  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
            }
          }
        });
  }

  onProductChange() {
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    const arr = this.QCConfigDetailData.filter((l: any) => l.product == this.formData.value.product);
    this.tableData = arr;
  }

  getCommitmentLists() {
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    const bomUrl = String.Join('/', this.apiConfigService.getCommitmentLists, 'instruments');
    this.apiService.apiGetRequest(bomUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
                this.instruments = res.response.citemList;
            }
          }
        });
  }

  getCommitmentList(flag) {
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    const bomUrl = String.Join('/', flag == 'edit' ? this.apiConfigService.getQCConfigDetail : this.apiConfigService.getCommitmentList, flag == 'edit' ? this.routeEdit : flag);
    this.apiService.apiGetRequest(bomUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              let arr = [];
              let arr1 = [];
              if (flag == 'edit') {
                this.isEdit = true;
                this.formData.patchValue(res.response.QCConfigDetailMaster);
                arr = res.response['QCConfigDetail'];
                this.formData.disable();
              } else {
                arr = res.response['citemList'];
              }
              arr.forEach((s: any, index: number) => {
                arr1.push({
                  parameter: flag == 'edit' ? s.parameter : s.paramName,
                  uom: s.uom,
                  uomName: s.uomName,
                  spec: s.spec,
                  minValue: s.minValue,
                  product: s.product,
                  maxValue: s.maxValue,
                  changed: false,
                  id: this.isEdit ? s.id : 0,
                  instrument: s.instrument,
                  action: this.routeEdit ? 'edit' : 'editDelete',
                  index: index + 1
                })
              })
              this.QCConfigDetailData = arr1;
              this.tableData = arr1;
            }
          } else {
            this.isEdit = false;
          }
        });
  }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true,
      changed: true,
    });

    if(!this.formData1.value.spec && !this.formData1.value.minValue && !this.formData1.value.maxValue && !this.formData1.value.uom && !this.formData1.value.instrument) {
      this.formData1.patchValue({
        changed: false,
        highlight: false,
      });

    }


    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode)
    const objU = this.msizeList.find((d: any) => d.unitId == this.formData1.value.uom)
    this.formData1.patchValue({
      uomName: objU ? objU.unitName : ''
    });
    if (this.formData1.value.index == 0 && !obj) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      if (this.formData1.value.index == 0) {
        // data.forEach((res: any) => { if (res.materialCode == this.formData1.value.materialCode) { (res.qty = res.qty + this.formData1.value.qty) } });
      } else {
        data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
      }
    }
    setTimeout(() => {
      this.tableData = data;
    });
    this.resetForm();
  }

  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete',
      id: 0
    });
  }


  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData1.patchValue(value.item);
    }
  }

  back() {
    this.router.navigate(['dashboard/transaction/standardrateoutput'])
  }

  save() {
    if (this.tableData.length == 0 || this.formData.invalid || !(this.tableData.some((t: any) => t.changed))) {
      return false;
    }
    this.addSaleOrder();
    return true;
  }

  addSaleOrder() {
    const addsq = String.Join('/', this.apiConfigService.registerStandardRate);
    const arr = this.tableData.filter((d: any) => d.changed);

    const requestObj = { qcdHdr: this.formData.value, qcdDtl: arr };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/transaction/standardrateoutput'])
          }
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
  }

}
