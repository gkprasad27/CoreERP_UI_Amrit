import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS, NonEditableDatepicker } from '../../../../directives/format-datepicker';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-source-of-supply',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TypeaheadModule, NonEditableDatepicker, TableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './source-of-supply.component.html',
  styleUrls: ['./source-of-supply.component.scss'],
  providers: [ DatePipe]
})
export class SourceOfSupplyComponent implements OnInit {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  // form control
  formData: FormGroup;
  formData1: FormGroup;


  tableData: any[] = [];

  // header props

  materialList = [];
  costunitList = [];
  supplyCodeList = [];
  employeesList = [];
  msizeList = [];

  // details props
  // tableData = [];
  // dynTableProps: any;
  routeEdit = '';
  stateList: any;
  bpaList: any;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.allApis();
  }


  formDataGroup() {
    this.formData = this.formBuilder.group({
      supplierCode: [null, [Validators.required]],
      supplierName: [null],
      phone: [{ value: '', disabled: true }],
      mobile: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      place: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      transportMethod: [{ value: '', disabled: true }],
      deliveryTime: [null],
      contactPerson: [{ value: '', disabled: true }],
      narration: [null],
    });

    this.formData1 = this.formBuilder.group({
      materialCode: [''],
      description: [''],
      priceperUnit: [''],
      unit: [''],
      lastSupplyPrice: [''],
      lastSupplyOn: [''],
      ponumber: [''],
      podate: [''],
      deliveryDays: [''],
      paymentDueDays: [''],
      id: [0],
      highlight: false,
      action: [[
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
]],
      index: 0
    });
  }

  // apis
  allApis() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getsuppliercodeList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList, obj.companyCode);
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    const getmsizeList = String.Join('/', this.apiConfigService.getmsizeList);

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getsuppliercodeList),
        this.apiService.apiGetRequest(getmaterialUrl),
        this.apiService.apiGetRequest(getmsizeList)
      ]).subscribe(([supplierRes, materialRes, getmsizeRes]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(supplierRes) && supplierRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(supplierRes.response)) {
            this.bpaList = supplierRes.response['bpaList'].filter(resp => resp.bpTypeName == 'Vendor');
          }
        }

        if (!this.commonService.checkNullOrUndefined(materialRes) && materialRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(materialRes.response)) {
            this.materialList = materialRes.response['materialList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(getmsizeRes) && getmsizeRes.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(getmsizeRes.response)) {
            getmsizeRes.response['msizeList'] = getmsizeRes.response['msizeList'].map((m: any) => { m.unitId = +m.unitId; return m; });
            this.msizeList = getmsizeRes.response['msizeList'];
          }
        }

        if (this.routeEdit != '') {
            this.getSourceOfSupplyDetails(this.routeEdit);
        }

      });
    });
  }

  getSourceOfSupplyDetails(val) {
    this.tableData = null;
    this.tableComponent.defaultValues();
    const cashDetUrl = String.Join('/', this.apiConfigService.getsupplierDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['ssmasters']);
              res.response['ssDetail'].forEach((s: any, index: number) => {
                s.id = s.id ? s.id : 0;
                s.index = index + 1;
                s.action = [
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
];
              })
              this.tableData = [...res.response['ssDetail']];
            }
          }
        });
  }

  supplierCodeChange() {
    const selectedSupplier = this.bpaList.find(
      (supplier: any) => supplier.name === this.formData.value.supplierName
    );
    if (selectedSupplier) {
      this.formData.patchValue(selectedSupplier);
      this.formData.patchValue({
        supplierCode: selectedSupplier.bpnumber || null
      });
    }
  }

  materialCodehChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    if (obj)
      this.formData1.patchValue({
        description: obj.text,
      })
  }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true
    });
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode)
    if (this.formData1.value.index == 0 && !obj) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
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
      this.formData1.patchValue(value.item);
    }
  }


  save() {
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
    this.saveSourcesupply();
  }

  saveSourcesupply() {
    const addssapply = String.Join('/', this.apiConfigService.addsupplierreq);
    const allValues = this.formData.getRawValue();
    const arr = this.tableData;
    arr.forEach((a: any) => {
      a.podate = a.podate ? this.datepipe.transform(a.podate, 'MM-dd-yyyy') : '';
      a.lastSupplyOn = a.lastSupplyOn ? this.datepipe.transform(a.lastSupplyOn, 'MM-dd-yyyy') : '';
      a.id = this.routeEdit ? a.id : 0
    })
    const requestObj = { qsHdr: allValues, qsDtl: arr.filter((t: any) => t.highlight) };
    this.apiService.apiPostRequest(addssapply, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Source Supply created Successfully..', Static.Close, SnackBar.success);
          }
          this.back();
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.tableComponent.defaultValues();
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnsupplierreq, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
        }
      });
  }

  back() {
    this.router.navigate(['dashboard/transaction/sourceofsupply'])
  }



}