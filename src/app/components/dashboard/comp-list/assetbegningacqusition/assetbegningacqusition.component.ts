import { Component, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { SnackBar } from '../../../../enums/common/common';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker'

@Component({
  selector: 'app-assetbegningacqusition',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, DynamicTableComponent, NonEditableDatepicker, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './assetbegningacqusition.component.html',
  styleUrls: ['./assetbegningacqusition.component.scss']
})

export class AssetBegningAcqusitionComponent implements OnInit {

  sendDynTableData: any;

  modelFormData: FormGroup;
  tableFormData: FormGroup;
  routeEdit = '';
  tableData = [];
  dynTableProps = this.tablePropsFunc()
  isSubmitted = false;
  formData: any;
  taxcodeList: any;
  taxaccList: any;
  tdsList: any;
  nrrList: any;
  companyList: any;
  saList: any;
  mamList: any;
  dpareaList: any;

  constructor(public commonService: CommonService,
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
      acquisitionCost: [null],
      acquisitionDate: [null],
      code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      mainAssetDescription: [null],
      mainAssetNo: [null],
      subAssetDescription: [null],
      subAssetNo: [null],
      depreciationArea: [null]

    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  tablePropsFunc() {
    return {
      tableData: {

        depreciationArea: {
          value: null, type: 'dropdown', list: this.dpareaList, id: 'code', text: 'description',
          disabled: false, displayMul: true
        },
        accumulatedDepreciation: {
          value: null, type: 'text', width: 150, maxLength: 10
        },
        id: {
          value: 0, type: 'text', width: 150, maxLength: 10, disabled: true, hide: true
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },

      formControl: {
        id: ['0'],
        depreciationArea: [null,],
        accumulatedDepreciation: [null, [Validators.required]]
      }
    }
  }

  ngOnInit() {
    this.getmainassetclassTableData();
    this.getSubassetList();
    this.getdepreciationAreaList();
  }
  getdepreciationAreaList() {
    const getlocList = String.Join('/', this.apiConfigService.getDepreciationAreasList);
    this.apiService.apiGetRequest(getlocList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dpareaList = res.response['dpareaList'];

            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getAqsnDetail(this.routeEdit);
          }
        });
  }

  getSubassetList() {
    const getplantList = String.Join('/', this.apiConfigService.getSubAssetsList);
    this.apiService.apiGetRequest(getplantList)
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

  getmainassetclassTableData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getMainAssetMasterList);
    this.apiService.apiGetRequest(getCompanyUrl)
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

  getAqsnDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getAqsnDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.patchValue(res.response['AqsnMasters']);
              this.sendDynTableData = { type: 'edit', data: res.response['AqsnDetail'] };
            }
          }
        });
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  get formControls() { return this.modelFormData.controls; }



  save() {
    if (this.modelFormData.invalid) {
      if (!this.tableData.length) {
        this.alertService.openSnackBar('Please fill all mandidatory fields', Static.Close, SnackBar.success);
      }
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.tableData = this.commonService.formatTableData(this.tableData);
    this.saveBeingAcquisition();

  }
  reset() {
    this.tableData = [];
    this.modelFormData.reset();
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }
  saveBeingAcquisition() {
    const addCashBank = String.Join('/', this.apiConfigService.registeraqsnList);
    const requestObj = { mainaqsnHdr: this.modelFormData.value, mainaqsnDetail: this.tableData  };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('BeingAcquisition created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['/dashboard/master/assetbegningacqusition']);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  cancel() {
    this.router.navigate(['/dashboard/master/assetbegningacqusition']);
  }

}
