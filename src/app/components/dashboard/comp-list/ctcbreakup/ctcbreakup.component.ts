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
import { AddOrEditService } from '../add-or-edit.service';
import { ActivatedRoute, Router } from '@angular/router';
;
@Component({
  selector: 'app-ctcbreakup',
  templateUrl: './ctcbreakup.component.html',
  styleUrls: ['./ctcbreakup.component.scss']
})
export class CTCBreakupComponent implements OnInit {
  structure: any;
  ctc: any;
  modelFormData: FormGroup;
  structureList: any;
  filteredOptions: any;
  displayedColumns: string[] = ['componentCode', 'componentName', 'EarnDednAmount', 'duration', 'specificMonth'];
  GetEmployeeListArray: [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  formData: any;
  routeEdit = '';

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private addOrEditService: AddOrEditService,
    // public dialogRef: MatDialogRef<CTCBreakupComponent>,
  ) {
    this.modelFormData = this.formBuilder.group({
      empCode: [null],
      effectFrom: [null],
      structureName: [null],
      id: 0,
      ctc: [null]
    });
    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
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

  getctcDetailList() {
    const qsDetUrl = String.Join('/', this.apiConfigService.getctcDetailList, this.modelFormData.value.empCode);
    this.apiService.apiGetRequest(qsDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response['ctcDetailList'] && res.response['ctcDetailList'].length) {
              const data = [...this.dataSource.data];
              data.forEach((d: any) => {
                const obj = res.response['ctcDetailList'].find((s: any) => s.componentCode == d.componentCode);
                if (obj) {
                  d.EarnDednAmount = obj.earnDednAmount
                }
              })
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
            }
              // this.tableData = res.response['ctcDetailList'];
          }
        });
       
  }
  
  getStructures() {
    const getStructuresUrl = String.Join('/', this.apiConfigService.getStructures, this.modelFormData.value.structureName, this.modelFormData.value.ctc);
    this.apiService.apiGetRequest(getStructuresUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response['structureList'] && res.response['structureList'].length) {
              const data = [...this.dataSource.data];
              data.forEach((d: any) => {
                const obj = res.response['structureList'].find((s: any) => s.componentCode == d.componentCode);
                if (obj) {
                  d.EarnDednAmount = obj.amount
                }
              })
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
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
              
              if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
                this.getctcDetailList();
              }
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
    const arr = this.dataSource.data.filter((d: any) => d.EarnDednAmount)
    const obj = {
      item: {
        structure:{
          structureName:this.modelFormData.value.structureName,
          ctc:this.modelFormData.value.ctc,
          empcode:this.modelFormData.value.empCode,
          effectfrom:this.modelFormData.value.effectFrom,
          id:this.modelFormData.value.id,
        },
        components: arr
      }
    }
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](obj, (res) => {
      if (res) {
        this.router.navigate(['/dashboard/master/CTCBreakup']);
      }
    });
  }
  cancel() {
    this.router.navigate(['dashboard/master/CTCBreakup'])

    // this.dialogRef.close();
  }

}
