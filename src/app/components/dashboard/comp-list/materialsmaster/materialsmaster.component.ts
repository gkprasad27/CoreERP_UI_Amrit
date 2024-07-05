import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { StandardRateOComponent } from './standard-rate-o/standard-rate-o.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

interface Valuation {
  value: string;
  viewValue: string;
}

interface Classification {
  value: string;
  viewValue: string;
}
interface Taxable {
  value: string;
  viewValue: string;
}
interface Schedule {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-materialsmaster',
  templateUrl: './materialsmaster.component.html',
  styleUrls: ['./materialsmaster.component.scss']
})

export class MaterialMasterComponent implements OnInit, OnDestroy {

  @ViewChild(StandardRateOComponent) standardRateOComponent: StandardRateOComponent;

  modelFormData: FormGroup;
  formData: any;
  companyList: any;
  employeesList: any;
  stateList: any;
  ptypeList: any;
  pcgroupList: any;
  countrysList: any;
  mpatternList: any;
  msizeList: any;
  matypeList: any;
  magroupList: any;
  glList: any;
  controlAccountList: any;
  bpgLists: any;
  bpaNum: any;
  bpname: any;
  divisionsList: any;
  isSubmitted: boolean;
  valuation: Valuation[] =
    [
      { value: 'LIFO', viewValue: 'LIFO' },
      { value: 'FIFO', viewValue: 'FIFO' },
      { value: 'MWA', viewValue: 'Moving Weighted Average' },
      { value: 'Standard', viewValue: 'Standard Price' }
    ];
  classification: Classification[] =
    [
      { value: 'Supply of Goods', viewValue: 'Supply of Goods' },
      { value: 'Supply of service', viewValue: 'Supply of service' },
      { value: 'Composite', viewValue: 'Composite' }
    ];

  taxable: Taxable[] =
    [
      { value: 'Taxable', viewValue: 'Taxable' },
      { value: 'Non Taxable', viewValue: 'Non Taxable' },
      { value: 'Exempted u/s 11 of CGST', viewValue: 'Exempted u/s 11 of CGST' },
      { value: 'Exempted u/s of IGST', viewValue: 'Exempted u/s of IGST' },
      { value: 'Nil rated', viewValue: 'Nil rated' }
    ];
  schedule: Schedule[] =
    [
      { value: '2.5% (Schedule I)', viewValue: '2.5% (Schedule I)' },
      { value: '6% (Schedule II)', viewValue: '6% (Schedule II)' },
      { value: '9% (Schedule III)', viewValue: '9% (Schedule III)' },
      { value: '14% (Schedule IV)', viewValue: '14% (Schedule IV)' },
      { value: '1.5 % (Schedule V)', viewValue: '1.5 % (Schedule V)' },
      { value: '0.125% (Schedule VI)', viewValue: '0.125% (Schedule VI)' }
    ];

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'description',
    textField: 'description',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  plantsList: any;
  PCGroupsList: any;
  UomList: any;
  materialnum: any;
  hsnsacList: any;

  fileList: any;
  materialCode: any
  customerList: any[] = [];
  qnoList: any[] = [];

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {

    this.modelFormData = this.formBuilder.group({
      company: [null],
      plant: [null],
      materialType: [null],
      materialCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [null],
      materialGroup: [null],
      size: [null],
      dimentions: [null],
      modelPattern: [null],
      uom: [null],
      division: [null],
      grossWeight: [null],
      ouom: [null],
      netWeight: [null],
      purchasingGroup: [null],
      purchaseOrderText: [null],
      minLevel: [null],
      maxLevel: [null],
      reOrderLevel: [null],
      dangerLevel: [null],
      economicOrderQty: [null],
      reorderPoint: [null],
      valuation: [null],
      openingQty: [null],
      closingQty: [null],
      qtyvalues: [null],
      transferPrice: [null],
      hsnsac: [null],
      classification: [null],
      taxable: [null],
      fileUpload: [null],
      schedule: [null],
      chapter: [null],
      netWeightUom: [null],
      openingPrice: [null],
      openingValue: [null],
      closingPrice: [null],
      closingValue: [null],

      customerName: [null],
      bom: [null],
      // bomName: [null],

      goodsServiceDescription: null,
      partDragNo: null,
      dragRevNo: null
    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.materialCode = this.formData.item.materialCode

      this.modelFormData.patchValue({
        uom: this.formData.item.uom ? +this.formData.item.uom : null,
        ouom: this.formData.item.ouom ? +this.formData.item.ouom : null,
        netWeightUom: this.formData.item.netWeightUom ? +this.formData.item.netWeightUom : null,
        modelPattern: this.formData.item.modelPattern ? [{ description: this.formData.item.modelPattern }] : null
      })
      this.modelFormData.controls['materialCode'].disable();
    }
  }

  ngOnInit() {
    this.getPlantData();
    this.getTableData();
    this.getMaterialTypeData();
    this.getMaterialGroupTableData();
    this.getMaterialSizeTableData();
    this.getModelPatternList();
    this.getpurchasingGroupList();
    this.getdivisionList();
    this.getuomTypeData();
    this.gethsnsacList();
    this.getCustomerList();
    // this.getBOMList();
  }

  calculation() {
    let total = 0;
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('openingQty').value) &&
      !this.commonService.checkNullOrUndefined(this.modelFormData.get('openingPrice').value) &&
      this.modelFormData.get('openingQty').value != ''
      && this.modelFormData.get('openingPrice').value != '') {
      if (total = (parseInt(this.modelFormData.get('openingQty').value) * parseInt(this.modelFormData.get('openingPrice').value))) {
        this.modelFormData.patchValue({
          openingValue: total
        });
      }
    }
  }
  closingqtycalculation() {
    let total = 0;
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('closingQty').value) &&
      !this.commonService.checkNullOrUndefined(this.modelFormData.get('closingPrice').value) &&
      this.modelFormData.get('closingQty').value != ''
      && this.modelFormData.get('closingPrice').value != '') {
      if (total = (parseInt(this.modelFormData.get('closingQty').value) * parseInt(this.modelFormData.get('closingPrice').value))) {
        this.modelFormData.patchValue({
          closingValue: total
        });
      }
    }
  }
  getmaterialNumberData() {
    //this.gettingbpgroupname();
    const getmateriallist = String.Join('/', this.apiConfigService.getttingmaterialNumbers,
      this.modelFormData.get('materialType').value);
    this.apiService.apiGetRequest(getmateriallist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialnum = res.response['materialnum'];
              // this.modelFormData.patchValue({
              //   materialCode: this.materialnum
              // });
            }
          }
          this.spinner.hide();
        });
  }
  getuomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;

          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.UomList = res.response['UOMList'];
            }
          }
          this.spinner.hide();
        });
  }
  getTableData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }
  getPlantData() {
    const getPlantTypeUrl = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getPlantTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantsList = res.response['plantsList'];
            }
          }
          this.spinner.hide();
        });
  }
  getMaterialTypeData() {
    const getMaterialTypeUrl = String.Join('/', this.apiConfigService.getMaterialtypeList);
    this.apiService.apiGetRequest(getMaterialTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.matypeList = res.response['matypeList'];
            }
          }
          this.spinner.hide();
        });
  }
  getMaterialGroupTableData() {
    const getMaterialGroupUrl = String.Join('/', this.apiConfigService.getmaterialgroupList);
    this.apiService.apiGetRequest(getMaterialGroupUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.magroupList = res.response['magroupList'];
            }
          }
          this.spinner.hide();
        });
  }
  getMaterialSizeTableData() {
    const gettsizeGroupsUrl = String.Join('/', this.apiConfigService.getmsizeList);
    this.apiService.apiGetRequest(gettsizeGroupsUrl)
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
  getModelPatternList() {
    const getmpList = String.Join('/', this.apiConfigService.getModelPatternList);
    this.apiService.apiGetRequest(getmpList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mpatternList = res.response['mpatternList'];
            }
          }
          this.spinner.hide();
        });
  }
  getpurchasingGroupList() {
    const getpurchasingGroupList = String.Join('/', this.apiConfigService.getPurchaseGroupList);
    this.apiService.apiGetRequest(getpurchasingGroupList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.PCGroupsList = res.response['PCGroupsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getdivisionList() {
    const getdivisionList = String.Join('/', this.apiConfigService.getDivisionsList);
    this.apiService.apiGetRequest(getdivisionList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.divisionsList = res.response['divisionsList'];
            }
          }
          this.spinner.hide();
        });
  }
  gethsnsacList() {
    const gethsnsacList = String.Join('/', this.apiConfigService.gethsnsacList);
    this.apiService.apiGetRequest(gethsnsacList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.hsnsacList = res.response['HSNSACList'];
            }
          }
          this.spinner.hide();
        });
  }

  getCustomerList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const costCenUrl = String.Join('/', this.apiConfigService.getCustomerList, obj.companyCode);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpList'];
              const data = resp.length && resp.filter((t: any) => t.bptype == 'Customer');

              this.customerList = data;
              if (this.formData.item) {
                this.modelFormData.patchValue({
                  customerName: this.formData.item.customerCode ? this.customerList.find((c: any) => c.id == this.formData.item.customerCode).text : '',
                })
              }
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
              this.modelFormData.patchValue({
                bomName: this.formData.item.bom ? this.qnoList.find((c: any) => c.bomnumber == this.formData.item.bom).bomName : ''
              })
            }
          }
        });
  }


  get formControls() { return this.modelFormData.controls; }

  emitFilesList(event: any) {
    this.fileList = event[0];
  }

  save() {
    this.standardRateOComponent.save();
    if (this.modelFormData.invalid) {
      this.isSubmitted = true;
      return;
    }
  
    // if(flag) {
    this.modelFormData.controls['materialCode'].enable();
    this.formData.item = this.modelFormData.value;
    if (this.formData.item.modelPattern && (typeof this.formData.item.modelPattern != 'string')) {
      this.formData.item.modelPattern = this.formData.item.modelPattern[0].description;
    }

    this.formData.item.fileUpload = this.fileList ? this.fileList.name.split('.')[0] : '';
    this.formData.item.customerCode = this.modelFormData.value.customerName ? this.customerList.find((c: any) => c.text == this.modelFormData.value.customerName).id : '';
    // this.formData.item.bom = this.modelFormData.value.bomName ? this.qnoList.find((c: any) => c.bomName == this.modelFormData.value.bomName).bomnumber : '';
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      if (this.fileList) {
        this.uploadFile();
      } else {
        this.router.navigate(['/dashboard/master/materialsmaster']);
      }
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['materialCode'].disable();
    }
    // }
  }


  uploadFile() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList.name.split('.')[0]);
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
          }
        }
        this.router.navigate(['/dashboard/master/materialsmaster']);
      });
  }

  downLoadFile(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.name);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  cancel() {
    this.router.navigate(['/dashboard/master/materialsmaster']);
  }

  ngOnDestroy() {
    this.addOrEditService.editData = null;
  }
}
