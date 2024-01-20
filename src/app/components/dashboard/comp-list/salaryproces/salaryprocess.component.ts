import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' }
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,

  ) {

    this.modelFormData = this.formBuilder.group({
      emp_Code: [''],
      sal_Month: [''],
      sal_Year: ['']
    });
  }

  checkDates(group: FormGroup) {
    if(group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid:true }
    }
    return null;
  }

  ngOnInit() {
  }
  
 cancel() {

  }

  save() {
    
  }

}
