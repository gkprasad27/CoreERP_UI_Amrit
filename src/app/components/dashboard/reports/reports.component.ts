import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { String } from 'typescript-string-operations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBar, StatusCodes } from '../../../enums/common/common';
import { AlertService } from '../../../services/alert.service';
import { RuntimeConfigService } from '../../../services/runtime-config.service';
import { ApiConfigService } from '../../../services/api-config.service';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AttendanceProcessComponent } from '../comp-list/attendance-process/attendance-process.component';
import { SalaryProcessComponent } from '../comp-list/salaryproces/salaryprocess.component';
import { EmployeeAttendanceComponent } from '../comp-list/employee-attendance/employee-attendance.component';
import { TableComponent } from '../../../reuse-components/table/table.component';
import { Static } from '../../../enums/common/static';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../directives/format-datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, TypeaheadModule, TableComponent, TranslateModule, MatSelectModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, NgMultiSelectDropDownModule, MatSlideToggleModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})

export class ReportsComponent {

  tableData: any;
  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  getComponentData: any;

  modelFormData: FormGroup;

  companyList: any[] = [];
  customerList: any[] = [];
  materialList: any[] = [];
  bpTypeList: any[] = [];
  bpList: any[] = [];
  bpgLists: any[] = [];
  employeesList: any[] = [];
  vendorList: any[] = [];
  data: any;

  submitted = false;

  routeParam: any;

  date = new Date();

  salaryProcessData: any = [];
  consolidatedpaysData: any = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  fromYear: any[] = [new Date().getFullYear()-1, new Date().getFullYear()];
  fromMonth: any[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  toYear: any[] = [new Date().getFullYear()-1, new Date().getFullYear()];
  toMonth: any[] = [1,2,3,4,5,6,7,8,9,10,11,12];

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private runtimeConfigService: RuntimeConfigService,
    private apiConfigService: ApiConfigService,
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private router: Router
  ) {
    this.model();
    this.getcompaniesList();
    this.getmaterialData();
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
      this.commonService.routeParam = params.id;
      switch (this.routeParam) {
        case 'salesanalysis':
          this.getCustomerList();
          break;
        case 'materialinward':
          this.getsuppliercodeList();
          break;
        case 'VendorPayments':
        case 'CustomerPayments':
          this.getPartnerTypeList();
          break;
        case 'employeeotreport':
        case 'employeeattendance':
        case 'AttendanceProcess':
        case 'salaryprocess':
        case 'employeeabsentreport':
          this.getEmployeesList();
          break;
        case 'salesgst':
          this.getCustomerList();
          break;
        case 'purchaseanalysis':
          this.getsuppliercodeList();
          break;
        case 'purchasegst':
          this.getsuppliercodeList();
          break;
        case 'pendingsales':
          this.getCustomerList();
          break;
        case 'pendingpurchaseorders':
          this.getsuppliercodeList();
          break;
        case 'pendingjobworkreport':
          this.getsuppliercodeList();
          break;
      }
      this.reset();
      this.getParameters(params.id);
    });
  }

  searchProcess() {
    this.tableData = null;
    this.tableComponent.defaultValues();
    const costCenUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}`);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
              if (this.routeParam == 'AttendanceProcess') {
                res.response[this.getComponentData.listName].forEach((a: any) => {
                  a.action = [
                    { id: 'Edit', type: 'edit' }
                  ];
                })
              }
              this.tableData = res.response[this.getComponentData.listName];
            }
          }
        });
  }

  salarySearch() {
    const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
    const costCenUrl = String.Join('', environment.baseUrl, `Ledger/SalaryProcess/${new Date(this.modelFormData.value.selected).getMonth() + 1}/${new Date(this.modelFormData.value.selected).getFullYear()}/${this.modelFormData.controls.companyCode.value ? this.modelFormData.controls.companyCode.value : '-1'}/${obj ? obj.id : '-1'}`);
    this.apiService.apiPostRequest(costCenUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.alertService.openSnackBar(res.response, Static.Close, SnackBar.error);
            }
          }
        });
  }

  save() {
    const addCompanyUrl = String.Join('', environment.baseUrl, this.getComponentData.registerUrl);
    this.apiService.apiPostRequest(addCompanyUrl, this.tableData)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
            }
          }
          this.spinner.hide();
        });

  }


  editOrDeleteEvent(value) {
    if (value.action === 'Edit') {
      let comp;
      switch (this.getComponentData.formName) {
        case 'AttendanceProcess':
          comp = AttendanceProcessComponent;
          break;
        case 'salaryprocess':
          comp = SalaryProcessComponent;
          break;
        default:
          break;
      }
      const dialogRef = this.dialog.open(comp, {
     
      width: '80%',
        height: '80vh',
      position: { top: '5%', left: '10%' },
        data: value,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!this.commonService.checkNullOrUndefined(result)) {
          if (result) {
            let arr = [...this.tableData];
            this.tableData = null;
            this.tableComponent.defaultValues();
            arr = arr.map(element => {
              if (element.emp_Code == result.emp_Code) {
                element = result;
              }
              element.action = [
                { id: 'Edit', type: 'edit' }
              ];
              return element;
            });
            this.tableData = arr;
          }
          // this.print();
        }
      });
    }
  }


  getColSpan(keys: any) {
    return (keys.val instanceof Array) ? Object.keys(keys['val'][0]).length + 1 : '1'
  }

  getRowSpan(keys: any) {
    return (keys.val instanceof Array) ? '1' : '2'
  }

  isArray(keys: any) {
    return (keys.val instanceof Array)
  }

  model() {
    this.modelFormData = this.formBuilder.group({
      companyCode: [null, []],
      customerCode: ['-1'],
      materialCode: ['-1'],
      employee: ['-1'],
      companyName: [null],
      bpcategory: [true],
      partyAccount: [true],
      status: [true],
      selected: [null],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      fromYear: [''],
      toYear: [''],
      fromMonth: [''],
      toMonth: [''],
      vendorCode: ['-1']
    });
    this.modelFormData.controls['companyCode'].disable();
    this.setValidator();
  }

  setValidator() {
    if (this.routeParam == 'salaryprocess') {
      this.modelFormData.controls['selected'].addValidators(Validators.required);
      this.modelFormData.controls['selected'].updateValueAndValidity();
      this.modelFormData.controls['fromDate'].removeValidators(Validators.required);
      this.modelFormData.controls['fromDate'].updateValueAndValidity();
      this.modelFormData.controls['toDate'].removeValidators(Validators.required);
      this.modelFormData.controls['toDate'].updateValueAndValidity();
    } else {
      if (this.routeParam == 'stockvaluation' || this.routeParam != 'pendingpurchaseorders' || this.routeParam != 'pendingsales' || this.routeParam == 'pendingjobworkreport') {
        this.modelFormData.controls['fromDate'].removeValidators(Validators.required);
        this.modelFormData.controls['fromDate'].updateValueAndValidity();
        this.modelFormData.controls['toDate'].removeValidators(Validators.required);
        this.modelFormData.controls['toDate'].updateValueAndValidity();
      } else {
        this.modelFormData.controls['fromDate'].addValidators(Validators.required);
        this.modelFormData.controls['fromDate'].updateValueAndValidity();
        this.modelFormData.controls['toDate'].addValidators(Validators.required);
        this.modelFormData.controls['toDate'].updateValueAndValidity();
      }
    }
    if(this.routeParam == 'employeeabsentreport') {
      this.modelFormData.controls['fromYear'].addValidators(Validators.required);
      this.modelFormData.controls['fromYear'].updateValueAndValidity();
      this.modelFormData.controls['toYear'].addValidators(Validators.required);
      this.modelFormData.controls['toYear'].updateValueAndValidity();
      this.modelFormData.controls['fromMonth'].addValidators(Validators.required);
      this.modelFormData.controls['fromMonth'].updateValueAndValidity();
      this.modelFormData.controls['toMonth'].addValidators(Validators.required);
      this.modelFormData.controls['toMonth'].updateValueAndValidity();
    }
  }

  getcompaniesList() {
    const getcompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getcompanyList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
            }
          }
        });
  }

  getCustomerList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const costCenUrl = String.Join('/', this.apiConfigService.getCustomerList, obj.companyCode);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpList'];
              const data = resp.length && resp.filter((t: any) => t.bptype == 'Customer');
              this.customerList = data;
            }
          }
        });
  }

  getsuppliercodeList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getsuppliercodeList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList, obj.companyCode);
    this.apiService.apiGetRequest(getsuppliercodeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const resp = res.response['bpaList'];
              const data = resp.length && resp.filter((t: any) => t.bpTypeName == 'Vendor').map((d: any) => { return { id: d.bpnumber, text: d.name } });
              this.customerList = data;
            }
          }
        });
  }

  getParameters(id) {
    const getUrl = String.Join('/', this.apiConfigService.getComponentInfo, id);
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getComponentData = res.response;
            }
          }
        });
  }

  getPartnerTypeList() {
    const costCenUrl = String.Join('/', this.apiConfigService.getPartnerTypeList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpTypeList = res.response['ptypeList'];
            }
          }
          this.getbpList();
        });
  }

  getbpList() {
    const costCenUrl = String.Join('/', this.apiConfigService.getBPList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpList = res.response['BPList'];
            }
          }
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
            }
          }
        });
  }

  onbpChange() {
    this.bpgLists = [];
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('bpcategory').value)) {
      let data = this.bpTypeList.find(res => res.code == this.modelFormData.get('bpcategory').value);
      this.bpgLists = this.bpList.filter(res => res.bptype == data.code);
    }
  }

  ngOnInit() {
  }

  reset() {
    this.modelFormData.reset();
    let obj = JSON.parse(localStorage.getItem("user"));
    this.modelFormData.patchValue({ companyCode: obj.companyCode  });
    this.setValidator();
  }

  search() {
    if (this.modelFormData.invalid) {
      this.submitted = true;
      return;
    }
    this.print();
  }

  tableButtonEvent(event: any) {
    if (this.routeParam == 'AttendanceProcess') {
      const dialogRef = this.dialog.open(EmployeeAttendanceComponent, {
       
      width: '80%',
        height: '80vh',
      position: { top: '5%', left: '10%' },
        data: {
          fromDate: this.modelFormData.value.fromDate,
          toDate: this.modelFormData.value.toDate,
          company: event.item.compCode,
          empCode: event.item.emp_Code,
          employeeName: event.item.employeename,
        },
        panelClass: 'custom-dialog-container',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!this.commonService.checkNullOrUndefined(result)) {
          if (result) {
            let arr = [...this.tableData];
            this.tableData = null;
            this.tableComponent.defaultValues();
            arr = arr.map(element => {
              if (element.emp_Code == result.emp_Code) {
                element = result;
              }
              element.action = [
                { id: 'Edit', type: 'edit' }
              ];
              return element;
            });
            this.tableData = arr;
          }
          // this.print();
        }
      });
    }
  }

  print() {
    let fromDate = '';
    let toDate = '';
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.value.fromDate)) {
      fromDate = this.commonService.formatDateValue(this.modelFormData.value.fromDate),
        toDate = this.commonService.formatDateValue(this.modelFormData.value.toDate)
    }
    let getUrl;
    if (this.routeParam == 'pendingjobworkreport') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.vendorCode && this.modelFormData.value.vendorCode.length) ? this.modelFormData.value.vendorCode[0].id : '-1'}`);
    } else if (this.routeParam == 'salesanalysis' || this.routeParam == 'materialinward' || this.routeParam == 'purchaseanalysis') {
      const encodedMaterialCode = this.modelFormData.value.materialCode ? encodeURIComponent(this.modelFormData.value.materialCode) : '-1';
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.customerCode && this.modelFormData.value.customerCode.length) ? this.modelFormData.value.customerCode[0].id : '-1'}/${encodedMaterialCode}`);
    } else if (this.routeParam == 'VendorPayments' || this.routeParam == 'CustomerPayments') {
      const obj = this.bpgLists.find((d: any) => d.text == this.modelFormData.value.partyAccount);
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.status) ? 'Y' : 'N'}/${this.modelFormData.value.bpcategory ? this.modelFormData.value.bpcategory : '-1'}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'employeeotreport' || this.routeParam == 'employeeattendance') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'AttendanceProcess') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', environment.baseUrl, `Reports/GetAttendanceProcess/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value ? this.modelFormData.controls.companyCode.value : '-1'}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'salaryprocess') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', environment.baseUrl, `Reports/GetPayslip/${new Date(this.modelFormData.value.selected).getMonth() + 1}/${new Date(this.modelFormData.value.selected).getFullYear()}/${this.modelFormData.controls.companyCode.value ? this.modelFormData.controls.companyCode.value : '-1'}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'salesgst') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.customerCode && this.modelFormData.value.customerCode.length) ? this.modelFormData.value.customerCode[0].id : '-1'}`);
    } else if (this.routeParam == 'purchasegst') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.vendorCode && this.modelFormData.value.vendorCode.length) ? this.modelFormData.value.vendorCode[0].id : '-1'}`);
    } else if (this.routeParam == 'stockvaluation') {
      // Encode only if materialCode exists, otherwise use '-1'
      const encodedMaterialCode = this.modelFormData.value.materialCode ? encodeURIComponent(this.modelFormData.value.materialCode) : '-1';
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.modelFormData.controls.companyCode.value}/${encodedMaterialCode}`);
    } else if (this.routeParam == 'pendingsales') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.customerCode && this.modelFormData.value.customerCode.length) ? this.modelFormData.value.customerCode[0].id : '-1'}`);
    } else if (this.routeParam == 'pendingpurchaseorders') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.modelFormData.controls.companyCode.value}/${(this.modelFormData.value.vendorCode && this.modelFormData.value.vendorCode.length) ? this.modelFormData.value.vendorCode[0].id : '-1'}`);
    } else if (this.routeParam == 'consolidatedpayslip') {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.datepipe.transform(this.modelFormData.value.selected, 'yyyy-MM-dd')}`);
    } else if (this.routeParam == 'employeeabsentreport') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromYear}/${this.modelFormData.value.fromMonth}/${this.modelFormData.value.toYear}/${this.modelFormData.value.toMonth}/${obj ? obj.id : '-1'}`);
    }
    else {
      getUrl = String.Join('', environment.baseUrl, `${this.getComponentData.url}/${fromDate}/${toDate}/${this.modelFormData.controls.companyCode.value}`);
    }
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (this.routeParam == 'salaryprocess') {
              this.salaryProcessData = [];
              if (!this.commonService.checkNullOrUndefined(res.response) && res.response.hasOwnProperty('Payslip')) {
                this.salaryProcessPrint(res.response);
              }
            } else if (this.routeParam == 'consolidatedpayslip') {
              this.consolidatedpaysData = [];
              if (!this.commonService.checkNullOrUndefined(res.response) && res.response.hasOwnProperty('GCP')) {
                this.consolidatedpayslip(res.response);
              }
            } else if (this.routeParam == 'AttendanceProcess') {
              this.tableData = null;
              this.tableComponent.defaultValues();
              if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
                res.response[this.getComponentData.listName].forEach((a: any) => {
                  a.action = [
                    { id: 'Edit', type: 'edit' }
                  ];
                  a.button = 'Open';
                })
                this.tableData = res.response[this.getComponentData.listName];
              }
            } else {
              if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
                const keys = [];
                const tableResp = res.response[this.getComponentData.listName];
                if (res.response[this.getComponentData.totals] && res.response[this.getComponentData.totals].length) {
                  tableResp.push(res.response[this.getComponentData.totals][0]);
                }
                tableResp.forEach(obj => {
                  const cols = [];
                  Object.keys(this.runtimeConfigService.tableColumnsData[this.routeParam]).forEach(col => {
                    if (this.routeParam == 'employeeotreport' && col != 'staffid' && col != 'employeename' && col != 'otHrMin') {
                      col = col.substring(1);
                    }
                    let nObj: any;
                    if ((obj[col] instanceof Array)) {
                      let arr = [];
                      obj[col].forEach(key => {
                        Object.keys(this.runtimeConfigService.tableColumnsData[this.routeParam][col]).forEach(col1 => {
                          arr.push({ val: key[col1], label: col1, type: this.runtimeConfigService.tableColumnsData[this.routeParam][key] });
                        })
                      })
                      nObj = { val: arr, label: col, type: this.runtimeConfigService.tableColumnsData[this.routeParam][col] };
                    } else {
                      nObj = { val: obj[col], label: col, type: this.runtimeConfigService.tableColumnsData[this.routeParam][col] };
                    }
                    cols.push(nObj);
                  })
                  keys.push(cols);
                });
                const obj = this.companyList.find((c: any) => c.id == this.modelFormData.controls.companyCode.value);
                this.modelFormData.patchValue({
                  companyName: obj.text
                })
                this.data = keys;
                setTimeout(() => {
                  var w = window.open();
                  var html = document.getElementById('printData').innerHTML;
                  w.document.body.innerHTML = html;
                  this.data = null;
                  w.print();
                }, 50);

              }
            }
          }
        });

  }

  consolidatedpayslip(data: any) {
    this.consolidatedpaysData = data.GCP;
    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('consolidatedpays').innerHTML;
      w.document.body.innerHTML = html;
      this.consolidatedpaysData = [];
      w.print();
    }, 50);
  }

  salaryProcessPrint(data: any) {
    const arr = [];
    data.Payslip.forEach((p: any) => {
      const attendances = data.Attendance.filter((a: any) => a.employeeCode == p.employeeCode);
      const ots = data.OT.find((o: any) => o.employeename == p.employeeName);
      attendances.forEach((at: any) => {
        const day = new Date(at.attndate).getDate();
        at.dayH = ots ? ots[day] : '';
        at.day = day;
        at.logintime = at.logintime ? new Date(at.logintime).toLocaleTimeString() : '-';
        at.logouttime = at.logouttime ? new Date(at.logouttime).toLocaleTimeString() : '-';
      })
      const obj = {
        ...p,
        year: new Date(this.modelFormData.value.selected).getFullYear(),
        month: (new Date(this.modelFormData.value.selected)).toLocaleString('default', { month: 'long' }).toUpperCase(),
        attendances: attendances
      }
      arr.push(obj);
    })
    this.salaryProcessData = arr;
    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('salaryProcess').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 50);
  }


onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input?.files || input.files.length !== 1) {
    console.warn('Please upload exactly one file.');
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target?.result) return;

    const data = new Uint8Array(e.target.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    /* ----- FIND B2B SHEET ----- */

    const sheetName = workbook.SheetNames.find(
      s => s.trim().toLowerCase() === 'b2b'
    );

    if (!sheetName) {
      console.warn('B2B sheet not found.');
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: ''
    });

    if (!rows.length) return;

    /* ----- AUTO HEADER DETECTION ----- */

    let parentHeaderIndex = rows.findIndex(r =>
      r.join(' ').toLowerCase().includes('gstin of supplier') &&
      r.join(' ').toLowerCase().includes('invoice details')
    );

    if (parentHeaderIndex === -1) {
      console.warn('Header row not detected.');
      return;
    }

    const childHeaderIndex = parentHeaderIndex + 1;

    const parentRow = rows[parentHeaderIndex] || [];
    const childRow = rows[childHeaderIndex] || [];

    const headerRow: string[] = parentRow.map((p, i) =>
      (childRow[i] || p || '').toString().trim()
    );

    const dataStartIndex = childHeaderIndex + 1;

    /* ----- HELPERS ----- */

    const clean = (h: string) =>
      h.toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/₹/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // const num = (v: any) =>
    //   isNaN(parseFloat(v))
    //     ? 0
    //     : parseFloat(v.toString().replace(/,/g, ''));

    // const date = (v: any): string => {
    //   let parsed: Date | null = null;

    //   // Excel numeric date
    //   if (typeof v === 'number') {
    //     const d = XLSX.SSF.parse_date_code(v);
    //     if (d) {
    //       parsed = new Date(d.y, d.m - 1, d.d);
    //     }
    //   }

    //   // If already dd-mm-yyyy
    //   else if (typeof v === 'string' && v.includes('-')) {
    //     const parts = v.split('-');
    //     if (parts.length === 3) {
    //       const day = parseInt(parts[0], 10);
    //       const month = parseInt(parts[1], 10) - 1;
    //       const year = parseInt(parts[2], 10);

    //       parsed = new Date(year, month, day);
    //     }
    //   }

    //   // Other valid formats
    //   else if (v) {
    //     const temp = new Date(v);
    //     if (!isNaN(temp.getTime())) {
    //       parsed = temp;
    //     }
    //   }

    //   if (!parsed || isNaN(parsed.getTime())) return '';

    //   const day = parsed.getDate().toString().padStart(2, '0');
    //   const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
    //   const year = parsed.getFullYear();

    //   return `${day}-${month}-${year}`;
    // };

    const map = (h: string): string | null => {
      const s = clean(h);

      if (s === 'gstin of supplier') return 'GSTNumber';
      if (s === 'trade legal name of the supplier') return 'SupplierName';
      if (s === 'invoice number') return 'InvoiceNumber';
      if (s === 'invoice type') return 'InvoiceType';
      if (s === 'invoice date') return 'InvoiceDate';
      if (s === 'invoice value') return 'InvoiceValue';
      if (s === 'place of supply') return 'PlaceofSupply';
      if (s === 'reverse charge') return 'SupplyAttractReverseCharge';
      if (s === 'rate') return 'GSTRate';
      if (s === 'taxable value') return 'TaxableValue';
      if (s === 'igst') return 'IGST';
      if (s === 'cgst') return 'CGST';
      if (s === 'sgst') return 'SGST';
      if (s === 'cess') return 'Cess';
      if (s === 'gstr 1 iff gstr 1a 5 filing status') return 'GSTRFillingStatus';
      if (s === 'gstr 1 iff gstr 1a 5 filing date') return 'GSTRFillingDate';
      if (s === 'gstr 1 iff gstr 1a 5 filing period') return 'GSTRFillingPeriod';
      if (s === 'gstr 3b filing status') return 'GSTR3BFillingStatus';
      if (s === 'amendment made if any') return 'AmmendementMade';
      if (s === 'tax period in which amended') return 'AmendedTaxPeriod';
      if (s === 'effective date of cancellation') return 'CancellationDate';
      if (s === 'irn') return 'IRN';
      if (s === 'irn date') return 'IRNDate';
      if (s === 'source') return 'Source';

      return null;
    };

    /* ----- DEFAULT STRUCTURE ----- */

    const defaultRow = {
      GSTNumber: '',
      SupplierName: '',
      InvoiceNumber: '',
      InvoiceType: '',
      InvoiceDate: null,
      InvoiceValue: 0,
      PlaceofSupply: '',
      SupplyAttractReverseCharge: '',
      GSTRate: 0,
      TaxableValue: 0,
      IGST: 0,
      CGST: 0,
      SGST: 0,
      Cess: 0,
      GSTRFillingStatus: '',
      GSTRFillingDate: null,
      GSTRFillingPeriod: '',
      GSTR3BFillingStatus: '',
      AmmendementMade: '',
      AmendedTaxPeriod: '',
      CancellationDate: null,
      Source: '',
      IRN: '',
      IRNDate: null
    };

    /* ----- HEADER MAP ----- */

    const headerMap: Record<number, string> = {};

    headerRow.forEach((h, i) => {
      const key = map(h);
      if (key) headerMap[i] = key;
    });

    /* ----- DATA PARSING ----- */

    const result: any[] = [];

    for (let r = dataStartIndex; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.every(c => c === '')) continue;

      let data = JSON.parse(localStorage.getItem("user"));
      const obj: any = { company: data.companyCode, addWho: data.userName, editWho: data.userName, addDate: new Date(), editDate: new Date(), ...defaultRow };

      Object.keys(headerMap).forEach(i => {
        const key = headerMap[+i];
        const val = row[+i];

        // if (['InvoiceDate', 'IRNDate','CancellationDate'].includes(key)) {
        //   obj[key] = date(val);
        // } 
        // if (['InvoiceValue','TaxableValue','IGST','CGST','SGST','Cess','GSTRate'].includes(key)) {
        //   obj[key] = num(val);
        // } 
        // else {
          obj[key] = val?.toString().trim() || '';
        // }
      });

      // ✅ Only push rows where InvoiceNumber exists AND GSTRate > 0
      if (obj.GSTRate > 0) {
        result.push(obj);
      }
    }

    this.tableData = result;

    console.log('Filtered Data (Rate > 0):', this.tableData);
  };

  reader.readAsArrayBuffer(input.files[0]);
}

  saveExcel() {
    if(!this.tableData || !this.tableData.length) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const registerInvoiceUrl = String.Join('/', this.apiConfigService.GSTUpload);
    const requestObj = { code: user.userName, Dtl: this.tableData };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('GST Upload Successfully..', Static.Close, SnackBar.success);
            //this.branchFormData.reset();
          }
          this.reset();

          this.spinner.hide();

        }
      });
  }

  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

}