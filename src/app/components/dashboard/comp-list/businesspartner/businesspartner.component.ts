import { Component, OnInit, OnDestroy } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { Router, ActivatedRoute } from '@angular/router';

interface TaxClassification {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-businesspartner',
  templateUrl: './businesspartner.component.html',
  styleUrls: ['./businesspartner.component.scss']
})

export class BusienessPartnerAccountComponent implements OnInit, OnDestroy {
  modelFormData: FormGroup;
  formData: any;
  companyList: any;
  employeesList: any;
  stateList: any;
  ptypeList: any;
  regionsList: any;
  countrysList: any;
  ptermsList: any;
  bpgList: any;
  tdsList: any;
  tdsratesList: any;
  glList: any;
  controlAccountList: any;
  bpgLists: any;
  bpaNum: any;
  bpname: any;

  taxClassification: TaxClassification[] =
    [
      { value: 'Registered', viewValue: 'Registered' },
      { value: 'UnRegistered', viewValue: 'UnRegistered' }
    ];

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {

    this.modelFormData = this.formBuilder.group({
      code: [null],
      name: [null],
      bpnumber: [null],
      bptype: [null],
      search: [null],
      address: [null],
      address1: [null],
      location: [null],
      city: [null],
      state: [null],
      region: [null],
      country: [null],
      email: [null],
      phone: [null],
      mobile: [null],
      gstno: [null],
      panno: [null],
      tanno: [null],
      taxClassification: [null],
      company: [null],
      controlAccount: [null],
      paymentTerms: [null],
      tdstype: [null],
      tdsrate: [null],
      baseAmount: [null],
      obligationFrom: [null],
      obligationTo: [null],
      bankKey: [null],
      bankName: [null],
      bankAccountNo: [null],
      ifsccode: [null],
      swiftcode: [null],
      bankBranch: [null],
      bankBranchNo: [null],
      closingBalance: [null],
      contactPersion: [null],
      contactPersionMobile: [null],
      narration: [null],
      shiptoAddress1: [null],
      shiptoAddress2: [null],
      shiptoState: [null],
      shiptoCity: [null],
      shiptoZip: [null],
      shiptoPhone: [null],
      
      bpgroup: [null],
      ext: [null]
    });
    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['company'].disable();
      this.modelFormData.controls['bptype'].disable();
      this.modelFormData.controls['bpgroup'].disable();
    }
    this.modelFormData.controls['bpnumber'].disable();
  }

  ngOnInit() {
    this.getTableData();
    this.getstateList();
    this.getPaymenttermsList();
    this.getregionsList();
    this.getcountrysList();
    this.getptypeList();
    this.getEmployeesList();
    this.getTDSTableData();
    this.getTDSRateTableData();
  }

  onbpChange(flag = true) {
    this.controlAccountList = [];
    this.bpgLists = [];
    let data = this.ptypeList.find(res => res.code == this.modelFormData.controls.bptype.value);
    if (data) {
      this.controlAccountList = this.glList.filter(res => res.controlAccount == data.bpcategory);
      this.bpgLists = this.bpgList.filter(res => res.bptype == data.code);
      if (flag) {
        this.modelFormData.patchValue({
          bpgroup: '',
          bpnumber: ''
        })
      }
    }

  }

  gettingbpgroupname() {
    const getAccountSubGrouplist = String.Join('/', this.apiConfigService.getttingbpNames,
      this.modelFormData.get('bpgroup').value);
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpname = res.response['bpname'];
              this.modelFormData.patchValue({
                ext: this.bpname
              });
            }
          }
          this.spinner.hide();
        });
  }

  getBPNumberData() {
    this.gettingbpgroupname();
    this.modelFormData.patchValue({
      bpnumber: ''
    });
    const getAccountSubGrouplist = String.Join('/', this.apiConfigService.getttingbpNumbers,
      this.modelFormData.get('bpgroup').value);
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              this.bpaNum = res.response['bpaNum'];
              this.modelFormData.patchValue({
                bpnumber: this.bpaNum
              });
            }
          }
          this.spinner.hide();
        });
  }

  getGLAccountData() {
    const getGLAccountUrl = String.Join('/', this.apiConfigService.getGLAccountsList);
    this.apiService.apiGetRequest(getGLAccountUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'];
            }
          }
          this.getPartnerGroupsTableData();
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

  getTDSTableData() {
    const getTDSUrl = String.Join('/', this.apiConfigService.getTDStypeList);
    this.apiService.apiGetRequest(getTDSUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tdsList = res.response['tdsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getTDSRateTableData() {
    const getTDSRateUrl = String.Join('/', this.apiConfigService.getTDSRateList);
    this.apiService.apiGetRequest(getTDSRateUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tdsratesList = res.response['tdsratesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getPartnerGroupsTableData() {
    const gettPartnerGroupsUrl = String.Join('/', this.apiConfigService.getBusienessPartnersGroupsList);
    this.apiService.apiGetRequest(gettPartnerGroupsUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpgList = res.response['bpgList'];
              if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
                this.onbpChange(false);
              }
            }
          }
          this.spinner.hide();
        });
  }

  getPaymenttermsList() {
    const getpmList = String.Join('/', this.apiConfigService.getPaymentsTermsList);
    this.apiService.apiGetRequest(getpmList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.ptermsList = res.response['ptermsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getregionsList() {
    const getRegionsList = String.Join('/', this.apiConfigService.getRegionsList);
    this.apiService.apiGetRequest(getRegionsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.regionsList = res.response['RegionList'];
            }
          }
          this.spinner.hide();
        });
  }

  getcountrysList() {
    const getCountrysList = String.Join('/', this.apiConfigService.getCountrysList);
    this.apiService.apiGetRequest(getCountrysList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.countrysList = res.response['CountryList'];
            }
          }
          this.spinner.hide();
        });
  }

  getstateList() {
    const getstateList = String.Join('/', this.apiConfigService.getstatesList);
    this.apiService.apiGetRequest(getstateList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.stateList = res.response['StatesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getptypeList() {
    const getcurrencyList = String.Join('/', this.apiConfigService.getPartnerTypeList);
    this.apiService.apiGetRequest(getcurrencyList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.ptypeList = res.response['ptypeList'];
            }
          }
          this.getGLAccountData();
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['employeesList'];
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
    this.modelFormData.controls['bpnumber'].enable();
    this.modelFormData.controls['company'].enable();
    this.modelFormData.controls['bptype'].enable();
    this.modelFormData.controls['bpgroup'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.router.navigate(['/dashboard/master/businesspartner']);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['bpnumber'].disable();
      this.modelFormData.controls['company'].disable();
      this.modelFormData.controls['bptype'].disable();
      this.modelFormData.controls['bpgroup'].disable();
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/master/businesspartner']);
  }

  ngOnDestroy() {
    this.addOrEditService.editData = null;
  }
}