import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';
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
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-standardrateoutput',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TableComponent, TypeaheadModule, NgMultiSelectDropDownModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './standardrateoutput.component.html',
  styleUrls: ['./standardrateoutput.component.scss']
})

export class StandardRateComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  formData: FormGroup;
  formData1: FormGroup;

  tableData = [];
  instruments = [];
  materialList = [];
  msizeList = [];
  qnoList = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'paramName',
    textField: 'paramName',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };


  Type: Type[] =
    [
      { value: 'Balancing', viewValue: 'Balancing' },
      { value: 'Inspection', viewValue: 'Inspection' },
    ];

  routeEdit = '';


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
      { value: 'Crusher Eqipments', viewValue: 'Crusher Eqipments' },
      { value: 'Plates', viewValue: 'Plates' },
      { value: 'Fastners', viewValue: 'Fastners' },
      { value: 'Brought out', viewValue: 'Brought out' },
      { value: 'ISA', viewValue: 'ISA' },
      { value: 'ISMC', viewValue: 'ISMC' },
      { value: 'ISF', viewValue: 'ISF' },
      { value: 'ISB', viewValue: 'ISB' },
      { value: 'RUBBERS', viewValue: 'RUBBERS' },
      { value: 'SMLS PIPES', viewValue: 'SMLS PIPES' },
    ];

  QCConfigDetailData: any[] = [];
  citemList: any[] = [];

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
      materialCode: [null, Validators.required],
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
      action: [[
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
]],
      index: 0
    });

  }

  get formControls() { return this.formData.controls; }

  ngOnInit() {
    this.getmaterialData();
    this.getMaterialSizeTableData();
    this.getCommitmentLists();
    this.getBOMList();
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
      this.getCommitmentList('edit');
    }
  }

  getMaterialSizeTableData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getmsizeList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
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

  getBOMList() {
    const companyUrl = String.Join('/', this.apiConfigService.getBOMList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.qnoList = res.response['BOMList'];
            }
          }
          this.getmaterialData();
        });
  }


  getCommitmentList(flag) {
    this.tableData = [];
    if (this.tableComponent) {
      this.tableComponent.defaultValues();
    }
    const bomUrl = String.Join('/', flag == 'edit' ? this.apiConfigService.getQCConfigDetail : this.apiConfigService.getCommitmentList, flag == 'edit' ? encodeURIComponent(this.routeEdit) : encodeURIComponent(flag));
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
                  id: this.routeEdit ? s.id : 0,
                  instrument: s.instrument,
                  action: this.routeEdit ? 
                          [
                            { id: 'Edit', type: 'edit' }
                          ] : [
                            { id: 'Edit', type: 'edit' },
                            { id: 'Delete', type: 'delete' }
                          ],
                  index: index + 1
                })
              })
              this.QCConfigDetailData = arr1;
              this.tableData = arr1;
              this.getCommitmentParameterList();
            }
          }
        });
  }

  getCommitmentParameterList() {
    const bomUrl = String.Join('/', this.apiConfigService.getCommitmentList, this.formData.value.type);
    this.apiService.apiGetRequest(bomUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.citemList = res.response['citemList'].filter((c: any) => !this.QCConfigDetailData.some((q: any) => q.parameter == c.paramName));
            }
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

    if (!this.formData1.value.spec && !this.formData1.value.minValue && !this.formData1.value.maxValue && !this.formData1.value.uom && !this.formData1.value.instrument) {
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
      let fObj = this.formData1.value;
      fObj.parameter = fObj.parameter[0].paramName
      if (this.formData1.value.index == 0) {
        data.push(fObj);
      } else {
        data = data.map((res: any) => res = res.index == fObj.index ? fObj : res);
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
      action: [
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
],
      id: 0
    });
  }


  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      let item = { ...value.item };
      if (typeof item.parameter == 'string') {
        item.parameter = [{ paramName: item.parameter }]
      }
      this.formData1.patchValue(item);
    }
  }

  back() {
    this.router.navigate(['dashboard/transaction/standardrateoutput'])
  }

  save() {
    if (this.tableData.length == 0 || this.formData.invalid || !(this.tableData.some((t: any) => t.changed))) {
      return;
    }
    this.addSaleOrder();
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
