import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-subassets',
  templateUrl: './subassets.component.html',
  styleUrls: ['./subassets.component.scss']
})

export class SubAssetsComponent implements OnInit {

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
  mamList: any;
  maList: any;
  assetList: any;
  plantList: any;
  segmentList: any;
  divisionsList: any;
  branchesList: any;
  profitCenterList: any;
  acckeyList: any;
  locationList: any;
  dpareaList: any;
  dpList: any;
  companyList: any;
  massetlist: any;
  _stockissueHdr: any;
  saList: any;

  tablePropsFunc() {
    return {
      tableData: {

        depreciationCode: {
          value: null, type: 'dropdown', list: this.dpList, id: 'code', text: 'description', disabled: false, displayMul: true
        },
        depreciationRate: {
          value: null, type: 'text', width: 150, maxLength: 10
        },
        depreciationArea: {
          value: null, type: 'dropdown', list: this.dpareaList, id: 'code', text: 'description', disabled: false, displayMul: true
        },

        depreciationStartDate: {
          value: null, type: 'datepicker', disabled: false
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },

      formControl: {
        depreciationRate: [null,],
        depreciationCode: [null,],
        depreciationArea: [null,],
        depreciationStartDate: [null, [Validators.required]]
      }
    }
  }

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    public route: ActivatedRoute,
  ) {

    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

    this.modelFormData = this.formBuilder.group({
      subAssetNumber: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      mainAssetNo: [null],
      accountKey: [null],
      materialNo: [null],
      serialNumber: [null],
      quantity: [null],
      branch: [null],
      profitCenter: [null],
      segment: [null],
      division: [null],
      plant: [null],
      location: [null],
      room: [null],
      supplier: [null],
      acquisitionDate: [null],
      usefullLifeInDays: [null],
      usefulLifeInYears: [null],
      depreciationData: [null],
      depreciationArea: [null],
      mainAssetName: [null],
      accountKeyName: [null],
      branchName: [null],
      profitCenterName: [null],
      segmentName: [null],
      divisionName: [null],
      plantName: [null],
      depreciationDataName: [null],
      depreciationAreaName: [null],
      locationName: [null],
      depreciationCode: [null],
      depreciationStartDate: [null]

    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['subAssetNumber'].disable();
    }

  }

  ngOnInit() {
    this.getmainassetclassTableData();
    this.getassetclassTableData();
    this.getaccountkeyList();
    this.getsegmentList();
    this.getprofitCenterList();
    this.getdivisionList();
    this.getplantList();
    this.getLocationList();
    this.getdepreciationAreaTableData();
    this.getmainassetnumTableData();
    this.getsubassetData();
  }


  getsubassetDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getSubAssetsDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.setValue(res.response['SubassetMasters']);
              this.sendDynTableData = { type: 'editValue', data: res.response['SubassetDetail'] };
            }
          }
        });
  }
  getmainassetclassTableData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getMainAssetMasterList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mamList = res.response['mamList'];
              this.dynTableProps = this.tablePropsFunc();
            }
          }
          this.spinner.hide();
        });
  }
  getdepreciationCodeTableData() {
    const getdepreciationCodeUrl = String.Join('/', this.apiConfigService.getDepreciationcodeList);
    this.apiService.apiGetRequest(getdepreciationCodeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dpList = res.response['dpList'];
              this.dynTableProps = this.tablePropsFunc();
            }
          }
        });
  }
  getdepreciationAreaTableData() {
    const getdepreciationAreaUrl = String.Join('/', this.apiConfigService.getDepreciationAreasList);
    this.apiService.apiGetRequest(getdepreciationAreaUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dpareaList = res.response['dpareaList'];
              this.dynTableProps = this.tablePropsFunc();
            }
          }
          this.spinner.hide();
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getsubassetDetail(this.routeEdit);
          }
        });
    this.getdepreciationCodeTableData();
  }
  getmainassetnumTableData() {
    const getdepreciationAreaUrl = String.Join('/', this.apiConfigService.getMainAssetMasterList);
    this.apiService.apiGetRequest(getdepreciationAreaUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.mamList = res.response['mamList'];
            }
          }
          this.spinner.hide();
        });
  }
  getsubassetData() {
    const getdepreciationAreaUrl = String.Join('/', this.apiConfigService.getSubAssetsList);
    this.apiService.apiGetRequest(getdepreciationAreaUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.saList = res.response['saList'];
            }
          }
          this.spinner.hide();
        });
  }
  getchartAccount(value) {
    const getInvoiceDeatilListUrl = String.Join('/', this.apiConfigService.GetListsforMainAsset, this.modelFormData.get('mainAssetNo').value);
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.patchValue(res.response);
              this.spinner.hide();
            }
          }
        }
      });
    this.modelFormData.patchValue({
    });
  }
  getassetclassTableData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getAssetClassList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.assetList = res.response['assetList'];
            }
          }
          this.spinner.hide();
        });
  }
  getaccountkeyList() {
    const getackeyList = String.Join('/', this.apiConfigService.getAccountKeyList);
    this.apiService.apiGetRequest(getackeyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.acckeyList = res.response['acckeyList'];
            }
          }
        });
    this.getbranchList();
  }
  getbranchList() {
    const getbranchList = String.Join('/', this.apiConfigService.getBranchesList);
    this.apiService.apiGetRequest(getbranchList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.branchesList = res.response['branchesList'];
            }
          }
          this.spinner.hide();
        });
  }
  getprofitCenterList() {
    const getprofitCentersList = String.Join('/', this.apiConfigService.getProfitCenterList);
    this.apiService.apiGetRequest(getprofitCentersList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }
          this.spinner.hide();
        });
  }
  getsegmentList() {
    const getsegmentList = String.Join('/', this.apiConfigService.getSegmentList);
    this.apiService.apiGetRequest(getsegmentList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.segmentList = res.response['segmentList'];
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
  getplantList() {
    const getplantList = String.Join('/', this.apiConfigService.getplantList);
    this.apiService.apiGetRequest(getplantList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantList = res.response['plantList'];
            }
          }
          this.spinner.hide();
        });
  }
  getLocationList() {
    const getlocList = String.Join('/', this.apiConfigService.getlocationList);
    this.apiService.apiGetRequest(getlocList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.locationList = res.response['locationList'];
            }
          }
          this.spinner.hide();
        });
  }
  emitColumnChanges(data) {
    this.tableData = data.data;
  }
  assigndata(row) {
    if (row.column == 'depreciationCode') {
      const code = row.data[row.index]['depreciationCode'].list.find(res => res.code == row.data[row.index]['depreciationCode'].value);
      if (!this.commonService.checkNullOrUndefined(code)) {
        row.data[row.index].depreciationRate.value = code.rate;
        this.sendDynTableData = { type: 'add', data: row.data };
      }
    }
  }


  get formControls() { return this.modelFormData.controls; }

  // emitTableData(data) {
  //   this.tableData = data;
  // }

  save() {
    this.tableData = this.commonService.formatTableData(this.tableData);
    this.saveSubassets();
  }

  cancel() {
    this.router.navigate(['/dashboard/master/subassets']);
  }

  reset() {
    this.tableData = [];
    this.modelFormData.reset();
    this.sendDynTableData = { type: 'reset', data: this.tableData };

  }
  saveSubassets() {
    const addCashBank = String.Join('/', this.apiConfigService.registerSubAssetsList);
    const requestObj = { subasstHdr: this.modelFormData.value, subassetDetail: this.tableData };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('SubAssets created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

}
