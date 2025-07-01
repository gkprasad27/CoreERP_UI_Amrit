import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
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
import { AlertService } from '../../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { Static } from '../../../../enums/common/static';
import { SnackBar } from '../../../../enums/common/common';


interface Methodofdepreciation {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-depreciationcode',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, DynamicTableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './depreciationcode.component.html',
  styleUrls: ['./depreciationcode.component.scss']
})
export class DepreciationcodeComponent implements OnInit {

  sendDynTableData: any;

  routeEdit = '';
  tableData = [];
  dynTableProps = this.tablePropsFunc()
  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;

  Methodofdepreciation: Methodofdepreciation[] =
    [
      { value: 'Straight line', viewValue: 'Straight line' },
      { value: 'Written down value', viewValue: 'Written down value' },
      { value: 'Useful life ', viewValue: 'Useful life' }
    ];
  tablePropsFunc() {
    return {
      tableData: {
        yearsupto: {
          value: null, type: 'text', width: 150
        },
        monthupto: {
          value: null, type: 'text', width: 150
        },
        rateupto: {
          value: null, type: 'text', width: 150
        },

        delete: {
          type: 'delete',
          newObject: true
        }
      },

      formControl: {
        yearsupto: [null,],
        monthupto: [null,],
        rateupto: [null, [Validators.required]]
        //ext: [null,]
      }
    }
  }



  constructor(
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public route: ActivatedRoute,
    private commonService: CommonService
  ) {

    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

    // @Optional() is used to prevent error if no data is passed
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      depreciationMethod: [null],
      purchaseWithin: [null],
      rate: [null],
      upto1Years: [null],
      upto1Months: [null],
      upto1Rate: [null],
      upto2Years: [null],
      upto2Months: [null],
      upto2Rate: [null],
      upto3Years: [null],
      upto3Months: [null],
      upto3Rate: [null],
      upto4Years: [null],
      upto4Months: [null],
      upto4Rate: [null],
      maxDepreciationAmount: [null],
      maxDepreciationRate: [null],

    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
  }

  getdepreciationDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getdepreciationcodeDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.modelFormData.setValue(res.response['DepreciationcodeMasters']);
              this.sendDynTableData = { type: 'edit', data: res.response['DepreciationcodeDetail'] };
              //this.modelFormData.disable();
            }
          }
        });
  }

  ngOnInit() {
    if (this.routeEdit != '') {
      this.getdepreciationDetail(this.routeEdit);
    }
  }

  get formControls() { return this.modelFormData.controls; }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  save() {
    this.tableData = this.commonService.formatTableData(this.tableData);
    this.savedepreciationcode();
  }

  cancel() {
    this.router.navigate(['/dashboard/master/depreciationcode']);
  }
  reset() {
    this.tableData = [];
    this.modelFormData.reset();
    //this.formData.controls['subAssetNumber'].disable();
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }
  savedepreciationcode() {
    const addCashBank = String.Join('/', this.apiConfigService.registerdepreciationcodeList);
    const requestObj = { depreciationcodeHdr: this.modelFormData.value, depreciationcodeDetail: this.tableData };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Depreciationcode created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();

        }
      });
  }
}
