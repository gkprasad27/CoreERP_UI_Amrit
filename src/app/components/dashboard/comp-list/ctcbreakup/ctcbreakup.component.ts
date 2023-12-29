import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
;
@Component({
  selector: 'app-ctcbreakup',
  templateUrl: './ctcbreakup.component.html',
  styleUrls: ['./ctcbreakup.component.scss']
})
export class CTCBreakupComponent implements OnInit {
  modelFormData: FormGroup;
  structureList: any;
  filteredOptions: any;
  displayedColumns: string[] = ['componentCode', 'componentName', 'amount', 'duration', 'specificMonth'];
  GetEmployeeListArray:[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<CTCBreakupComponent>,
  ) {
    this.modelFormData = this.formBuilder.group({
      myControl: [null],
      effectFrom: [null],
      structureName: [null],
      ctc: [null]
    });

  }

  ngOnInit() {
    this.getStructureList();
    this.getctcComponentsList();
  }
  
  getStructureList() {
    const getStructureList = String.Join('/', this.apiConfigService.getStructureList);
    this.apiService.apiGetRequest(getStructureList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.structureList = res.response['structuresList'];
            }
          }
          this.spinner.hide();
        });
  }

  getctcComponentsList() {
    const getctcComponentsListUrl = String.Join('/', this.apiConfigService.getPfComponentsList);
    this.apiService.apiGetRequest(getctcComponentsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.dataSource = new MatTableDataSource(res.response['ComponentTypesList']);
              this.dataSource.paginator = this.paginator;
            }
          }
          this.spinner.hide();
        });
  }

  getctcEmployeeList(value) {
    if (!this.commonService.checkNullOrUndefined(value) && value != '') {
      const getctcEmployeeListUrl = String.Join('/', this.apiConfigService.getctcEmployeeList, value);
      this.apiService.apiGetRequest(getctcEmployeeListUrl).subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['EmployeeList']) && res.response['EmployeeList'].length) {
                this.GetEmployeeListArray = res.response['EmployeeList'];
              } else {
                this.GetEmployeeListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetEmployeeListArray = [];
    }
  }

  save() {

  }
  cancel() {
    this.dialogRef.close();
  }

}
