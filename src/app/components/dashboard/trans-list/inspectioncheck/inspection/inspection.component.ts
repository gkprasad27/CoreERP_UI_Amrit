import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { AlertService } from '../../../../../services/alert.service';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { Static } from '../../../../../enums/common/static';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DynamicTableComponent } from '../../../../../reuse-components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inspection',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, DynamicTableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent {


  tableData = [];
  dynTableProps = this.tablePropsFunc()
  sendDynTableData: any;

  constructor(public commonService: CommonService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<InspectionComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.getCommitmentList();
  }

  tablePropsFunc() {
    return {
      tableData: {
        parameter: { value: null,  width: 150  },
        uomName: { value: null,  width: 150  },
        uom: { value: null,  width: 150, hide: true  },
        spec: { value: null,  width: 150  },
        minValue: { value: null,  width: 150  },
        // maxValue: { value: null,  width: 150  },
        instrument: { value: null,  width: 150  },
        result: { value: 0, type: 'text', addClass:"background-red", condition: 'inspection' },
        id: { value: 0, width: 150 }
      },
      formControl: {
        result: ['']
      },
      routeParam: 'standardrateoutput'
    }
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  reset() {
    this.tableData = [];
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  getCommitmentList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    this.tableData = [];
    const url = String.Join('/', this.apiConfigService.getSaleOrderDetailbymaterialcode, encodeURIComponent(this.data.materialCode), this.data.productionTag, 'Inspection',this.data.bomKey,obj.companyCode);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              let arr = [];
              res.response.QCConfigDetail.forEach((s: any, index: number) => {
                arr.push({
                  parameter: s.parameter,
                  uom: s.uom,
                  uomName: s.uomName,
                  spec: s.spec,
                  minValue: s.minValue,
                  id: s.id ? s.id : 0,
                  maxValue: s.maxValue,
                  instrument: s.instrument,
                  action: [
  { id: 'Edit', type: 'edit' }
],
                  result: s.result,
                  index: index + 1
                })
              })

              this.data['type'] = arr.every((t: any) => !t.result) ? 'new' : 'edit';
              this.dynTableProps = this.tablePropsFunc();
              this.sendDynTableData = { type: 'edit', data: arr };
            }
          }
        });
  }

  save() {
    if (!this.tableData.length) {
      this.alertService.openSnackBar('Please update atleast single value before saving', Static.Close, SnackBar.success);
      return;
    }
    this.registerQCResults();
  }

  registerQCResults() {
    this.data['inspectionType'] = 'Inspection';
    const arr = [];
    this.tableData.forEach((t: any) => {
      const keys = Object.keys(t);
      let obj = {};
      keys.forEach((k: any) => {
        obj = {
          ...obj,
          [k]: t[k].value
        }
      })
      obj
      arr.push(obj);
    })
    const addsq = String.Join('/', this.apiConfigService.registerQCResults);
    const requestObj = { qtyResult: arr, qtyDtl: [this.data] };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
            this.dialogRef.close();
          }
        }
      });
  }

  back() {
    this.dialogRef.close();
  }



}
