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
  companyList: any;
  PfList: any;
  PtList: any;
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
      effectFrom: [null, Validators.required],
      pfType: [null, Validators.required],
      ptSlab: [null, Validators.required],
      id: 0,
      ctc: [null, Validators.required],
      companyCode: [null],
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
    // this.getStructureList();
    // this.getctcComponentsList();
    this.getPFTypeList();
    this.getCompanyData();

  }
  getCompanyData() {
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

  getPFTypeList() {
    const getPfList = String.Join('/', this.apiConfigService.getpfTypesList);
    this.apiService.apiGetRequest(getPfList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.PfList = res.response['PFTypesList'];
            }
          }
          this.getPTSlabList();
          this.spinner.hide();
        });
  }

  getPTSlabList() {
    const getPtList = String.Join('/', this.apiConfigService.getptTypesList);
    this.apiService.apiGetRequest(getPtList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.PtList = res.response['PTTypesList'];
            }
          }
          if (this.routeEdit) {
            this.getctcComponentsList();
          }
          this.spinner.hide();
        });
  }

  // getctcDetailList() {
  //   const qsDetUrl = String.Join('/', this.apiConfigService.getctcDetailList, this.modelFormData.value.empCode);
  //   this.apiService.apiGetRequest(qsDetUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response) && res.response['ctcDetailList'] && res.response['ctcDetailList'].length) {
  //             const data = [...this.dataSource.data];
  //             data.forEach((d: any) => {
  //               const obj = res.response['ctcDetailList'].find((s: any) => s.componentCode == d.componentCode);
  //               if (obj) {
  //                 d.EarnDednAmount = obj.earnDednAmount
  //               }
  //             })
  //             this.dataSource = new MatTableDataSource(data);
  //             this.dataSource.paginator = this.paginator;
  //           }
  //             // this.tableData = res.response['ctcDetailList'];
  //         }
  //       });

  // }

  // getStructures() {
  //   const getStructuresUrl = String.Join('/', this.apiConfigService.getStructures, this.modelFormData.value.structureName, this.modelFormData.value.ctc);
  //   this.apiService.apiGetRequest(getStructuresUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response) && res.response['structureList'] && res.response['structureList'].length) {
  //             const data = [...this.dataSource.data];
  //             data.forEach((d: any) => {
  //               const obj = res.response['structureList'].find((s: any) => s.componentCode == d.componentCode);
  //               if (obj) {
  //                 d.EarnDednAmount = obj.amount
  //               }
  //             })
  //             this.dataSource = new MatTableDataSource(data);
  //             this.dataSource.paginator = this.paginator;
  //           }
  //         }
  //         this.spinner.hide();
  //       });
  // }

  getctcComponentsList() {
    
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    if (this.modelFormData.invalid) {
      return;
    }
    const getctcComponentsListUrl = String.Join('/', this.apiConfigService.getPfComponentsList);
    this.apiService.apiGetRequest(getctcComponentsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              const arr = res.response['ComponentTypesList'];

              arr.forEach(element => {
                if (element.componentName == "Basic") {
                  element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                }
                if (element.componentName == "PF") {
                  const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                  if ((+this.modelFormData.value.ctc) / 12 < obj.amount) {
                    element.EarnDednAmount = (((+this.modelFormData.value.ctc) * obj.employeeContribution) / 100);
                  }
                  else {
                    // const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                    element.EarnDednAmount = (12 * ((+obj.amount) * obj.employeeContribution) / 100);
                  }
                }
                if (element.componentName == "Employer PF") {
                  const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                  if ((+this.modelFormData.value.ctc) / 12 < obj.amount) {
                    element.EarnDednAmount = (((+this.modelFormData.value.ctc) * obj.employerContribution) / 100);
                  }
                  else {
                    // const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                    element.EarnDednAmount = (12 * ((+obj.amount) * obj.employerContribution) / 100);
                  }
                }
                if (element.componentName == "PT") {
                  const obj = this.PtList.find((p: any) => p.ptslab == this.modelFormData.value.ptSlab)
                  if ((+this.modelFormData.value.ctc) / 12 < obj.ptlowerLimit) {
                    element.EarnDednAmount = 0;
                  }
                  else {
                    element.EarnDednAmount = (12 * obj.ptamt);
                  }

                }
                if (element.componentName == "ESI") {
                  
                  if ((+this.modelFormData.value.ctc) / 12 < element.amount) {
                    element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                  } else {
                    element.EarnDednAmount = 0;
                  }
                }
                if (element.componentName == "Employer ESI") {
                  
                  if ((+this.modelFormData.value.ctc) / 12 < element.amount) {
                    element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                  } else {
                    element.EarnDednAmount = 0;
                  }
                }
                // if (element.componentName == "ESI") {
                //   if ((((+this.modelFormData.value.ctc) * element.percentage) / 100) / 12 < element.amount) {
                //     element.EarnDednAmount =  (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                //   } else {
                //     element.EarnDednAmount = 0;
                //   }
                // }
              });

              this.dataSource = new MatTableDataSource(res.response['ComponentTypesList']);
              this.dataSource.paginator = this.paginator;

              // if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
              // this.getctcDetailList();
              // }
            }
          }
          this.spinner.hide();
        });
  }

  onCompanyChange(companyCode: string) {
    if (companyCode) {
      this.getctcEmployeeList(this.modelFormData.value.empCode, this.modelFormData.value.companyCode);  // Fetch employees based on company
    } else {
      this.GetEmployeeListArray = [];  // Reset employee list if no company is selected
    }
  }
  

  // getctcEmployeeList(value) {
  //   if (!this.commonService.checkNullOrUndefined(value) && value != '') {
  //     const getctcEmployeeListUrl = String.Join('/', this.apiConfigService.getctcEmployeeList, value);
  //     this.apiService.apiGetRequest(getctcEmployeeListUrl).subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             if (!this.commonService.checkNullOrUndefined(res.response['EmployeeList']) && res.response['EmployeeList'].length) {
  //               this.GetEmployeeListArray = res.response['EmployeeList'];
  //             } else {
  //               this.GetEmployeeListArray = [];
  //             }
  //           }
  //           this.spinner.hide();
  //         }
  //       });
  //   } else {
  //     this.GetEmployeeListArray = [];
  //   }
  // }

  getctcEmployeeList(empCode: string, companyCode: string) {
    if (!this.commonService.checkNullOrUndefined(empCode) && empCode !== '' &&
        !this.commonService.checkNullOrUndefined(companyCode) && companyCode !== '') {
      
      const getctcEmployeeListUrl = String.Join('/', this.apiConfigService.getctcEmployeeList, empCode, companyCode);
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
    const arr = this.dataSource.data.filter((d: any) => d.EarnDednAmount !== undefined && d.EarnDednAmount !== null);
    const obj = {
      item: {
        structure: {
          // structureName: this.modelFormData.value.structureName,
          ctc: this.modelFormData.value.ctc,
          empcode: this.modelFormData.value.empCode,
          effectfrom: this.modelFormData.value.effectFrom,
          id: this.modelFormData.value.id,
          pftype: this.modelFormData.value.pfType,
          ptslab: this.modelFormData.value.ptSlab,
          companyCode:this.modelFormData.value.companyCode
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
