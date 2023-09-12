import { Component, OnInit, OnDestroy, Optional, Inject } from '@angular/core';
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

  plantsList: any;
  PCGroupsList: any;
  UomList: any;
  materialnum: any;
  hsnsacList: any;

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {

    this.modelFormData = this.formBuilder.group({
      company: [null],
      plant: [null],
      materialType: [null],
      materialCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      description: [null],
      materialGroup: [null],
      size: [null],
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
      schedule: [null],
      chapter: [null],
      netWeightUom: [null],
      openingPrice: [null],
      openingValue: [null],
      closingPrice: [null],
      closingValue: [null],
      goodsServiceDescription: null
    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        uom: this.formData.item.uom ? +this.formData.item.uom : null,
        ouom: this.formData.item.ouom ? +this.formData.item.ouom : null,
        netWeightUom: this.formData.item.netWeightUom ? +this.formData.item.netWeightUom : null,
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
              this.modelFormData.patchValue({
                materialCode: this.materialnum
              });
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


  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      this.isSubmitted = true;
      return;
    }
    this.modelFormData.controls['materialCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.router.navigate(['/dashboard/master/materialsmaster']);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['materialCode'].disable();
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/master/materialsmaster']);
  }

  ngOnDestroy() {
    this.addOrEditService.editData = null;
  }
}
