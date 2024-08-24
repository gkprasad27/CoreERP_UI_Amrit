import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { SnackBar, StatusCodes } from 'src/app/enums/common/common';
import { Static } from 'src/app/enums/common/static';

@Component({
  selector: 'app-balance-certificate',
  templateUrl: './balance-certificate.component.html',
  styleUrls: ['./balance-certificate.component.scss']
})
export class BalanceCertificateComponent {

  tableData = [];
  dynTableProps = this.tablePropsFunc()
  sendDynTableData: any;


  constructor(public commonService: CommonService,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<BalanceCertificateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.getSaleOrderDetailbymaterialcode();
  }

  tablePropsFunc() {
    return {
      tableData: {
        parameter: {
          value: null,  width: 150
        },
        result: {
          value: 0, type: 'text'
        },
        id: {
          value: 0, width: 150
        }
      },

      formControl: {
        result: ['']
      },
      routeParam: 'inspectioncheck'
    }
  }

  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  reset() {
    this.tableData = [];
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

  getCommitmentList(list: any[]) {
    this.tableData = [];
    const url = String.Join('/', this.apiConfigService.getCommitmentList, this.data.materialCode, this.data.productionTag, 'Balancing');
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              let arr = [];
              res.response.citemList.forEach((s: any, index: number) => {
                const obj = list.find((l: any) => s.description == l.parameter);
                arr.push({
                  parameter: s.description,
                  // action: 'edit',
                  result: obj ? obj.spec : s.result,
                  // index: index + 1
                  id: s.id ? s.id : 0,
                })
              })
              this.data['type'] = arr.every((t: any) => !t.result) ? 'new' : 'edit';
              this.dynTableProps = this.tablePropsFunc();
              this.sendDynTableData = { type: 'edit', data: arr };
            }
          }
        });
  }

  getSaleOrderDetailbymaterialcode() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const url = String.Join('/', this.apiConfigService.getSaleOrderDetailbymaterialcode, this.data.materialCode, this.data.productionTag, 'Balancing',this.data.bomKey,obj.companyCode);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getCommitmentList(res.response.QCConfigDetail);
            }
          }
        });
  }


  save() {
    if (!this.tableData.length) {
      this.alertService.openSnackBar('Please fill atleast one result', Static.Close, SnackBar.success);
      return;
    }
    this.registerQCResults();
  }

  registerQCResults() {
    this.data['inspectionType'] = 'Balancing';
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
