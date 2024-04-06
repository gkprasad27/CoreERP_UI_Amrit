import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddOrEditService } from '../add-or-edit.service';

interface Month {
  value: string;
  viewValue: string;
}

interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-salaryprocess',
  templateUrl: './salaryprocess.component.html',
  styleUrls: ['./salaryprocess.component.scss']
})
export class SalaryProcessComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  structureList: any;
  displayedColumns: string[] = ['branchCode'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  month : Month[]=
  [
    { value: '01', viewValue: 'Jan' },
    { value: '02', viewValue: 'Feb' },
    { value: '03', viewValue: 'Mar' },
    { value: '04', viewValue: 'Apr' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'Aug' },
    { value: '09', viewValue: 'Sep' },
    { value: '10', viewValue: 'Oct' },
    { value: '11', viewValue: 'Nov' },
    { value: '12', viewValue: 'Dec' }
  ];

  year : Year[]=
  [
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' }
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    public route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<SalaryProcessComponent>,
    private addOrEditService: AddOrEditService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      // structureName: [null],
      // emp_Code: [''],
      sal_Month: [''],
      sal_Year: ['']
    });
    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
  }

  checkDates(group: FormGroup) {
    if(group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid:true }
    }
    return null;
  }

  ngOnInit() {
    this.getStructureList();
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

 cancel() {
  this.dialogRef.close();
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    
  }

}
