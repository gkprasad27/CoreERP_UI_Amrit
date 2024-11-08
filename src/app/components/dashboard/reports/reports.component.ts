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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TableComponent } from 'src/app/reuse-components/table/table.component';
import { AttendanceProcessComponent } from '../comp-list/attendance-process/attendance-process.component';
import { SalaryProcessComponent } from '../comp-list/salaryproces/salaryprocess.component';
import { Static } from 'src/app/enums/common/static';
import { EmployeeAttendanceComponent } from '../comp-list/employee-attendance/employee-attendance.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
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

  data: any;

  submitted = false;

  routeParam: any;

  date = new Date();

  salaryProcessData: any = [];

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

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private environment: RuntimeConfigService,
    private apiConfigService: ApiConfigService,
    public commonService: CommonService,
    private formBuilder: FormBuilder,
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
          this.getEmployeesList();
          break;
      }
      this.reset();
      this.getParameters(params.id);
    });
  }

  searchProcess() {
    this.tableData = null;
    this.tableComponent.defaultValues();
    const costCenUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}`);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
              if (this.routeParam == 'AttendanceProcess') {
                res.response[this.getComponentData.listName].forEach((a: any) => {
                  a.action = 'edit';
                })
              }
              this.tableData = res.response[this.getComponentData.listName];
            }
          }
        });
  }

  salarySearch() {
    const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
    const costCenUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `Ledger/SalaryProcess/${new Date(this.modelFormData.value.selected).getMonth() + 1}/${new Date(this.modelFormData.value.selected).getFullYear()}/${this.modelFormData.value.companyCode ? this.modelFormData.value.companyCode : '-1'}/${obj ? obj.id : '-1'}`);
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
    const addCompanyUrl = String.Join('', this.environment.runtimeConfig.serverUrl, this.getComponentData.registerUrl);
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
        data: value,
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
              element.action = 'edit';
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
      selected: [null, [Validators.required]],
      fromDate: [null],
      toDate: [null],
    });
    this.setValidator();
  }


  setValidator() {

    if (this.routeParam == 'stockvaluation' || this.routeParam != 'pendingpurchaseorders' || this.routeParam != 'pendingsales' || this.routeParam == 'pendingjobworkreport') {
      this.modelFormData.controls['selected'].removeValidators(Validators.required);
      this.modelFormData.controls['selected'].updateValueAndValidity();
    } else {
      this.modelFormData.controls['selected'].addValidators(Validators.required);
      this.modelFormData.controls['selected'].updateValueAndValidity();
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
    this.setValidator();
  }

  search() {
    if (this.modelFormData.invalid) {
      this.submitted = true;
      return;
    }
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.value.selected) && this.modelFormData.value.selected.start) {
      this.modelFormData.patchValue({
        fromDate: this.commonService.formatDateValue(this.modelFormData.value.selected.start.$d),
        toDate: this.commonService.formatDateValue(this.modelFormData.value.selected.end.$d, 1)
      });
    }
    this.print();
  }

  tableButtonEvent(event: any) {
    if(this.routeParam == 'AttendanceProcess') {
      const dialogRef = this.dialog.open(EmployeeAttendanceComponent, {
        width: '80%',
        height: '80vh',
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
              element.action = 'edit';
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
    let getUrl
    if (this.routeParam == 'stockvaluation' || this.routeParam == 'pendingpurchaseorders' || this.routeParam == 'pendingsales' || this.routeParam == 'pendingjobworkreport') {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.companyCode}`);
    } else if (this.routeParam == 'salesanalysis' || this.routeParam == 'materialinward') {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}/${(this.modelFormData.value.customerCode && this.modelFormData.value.customerCode.length) ? this.modelFormData.value.customerCode[0].id : '-1'}/${this.modelFormData.value.materialCode ? this.modelFormData.value.materialCode : '-1'}`);
    } else if (this.routeParam == 'VendorPayments' || this.routeParam == 'CustomerPayments') {
      const obj = this.bpgLists.find((d: any) => d.text == this.modelFormData.value.partyAccount);
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}/${(this.modelFormData.value.status) ? 'Y' : 'N'}/${this.modelFormData.value.bpcategory ? this.modelFormData.value.bpcategory : '-1'}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'employeeotreport' || this.routeParam == 'employeeattendance') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'AttendanceProcess') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `Reports/GetAttendanceProcess/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode ? this.modelFormData.value.companyCode : '-1'}/${obj ? obj.id : '-1'}`);
    } else if (this.routeParam == 'salaryprocess') {
      const obj = this.employeesList.find((d: any) => d.text == this.modelFormData.value.employee);
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `Reports/GetPayslip/${new Date(this.modelFormData.value.selected).getMonth() + 1}/${new Date(this.modelFormData.value.selected).getFullYear()}/${this.modelFormData.value.companyCode ? this.modelFormData.value.companyCode : '-1'}/${obj ? obj.id : '-1'}`);
    } else {
      getUrl = String.Join('', this.environment.runtimeConfig.serverUrl, `${this.getComponentData.url}/${this.modelFormData.value.fromDate}/${this.modelFormData.value.toDate}/${this.modelFormData.value.companyCode}`);
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
            } else if (this.routeParam == 'AttendanceProcess') {
              this.tableData = null;
              this.tableComponent.defaultValues();
              if (!this.commonService.checkNullOrUndefined(res.response) && res.response[this.getComponentData.listName] && res.response[this.getComponentData.listName].length) {
                res.response[this.getComponentData.listName].forEach((a: any) => {
                  a.action = 'edit';
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
                  Object.keys(this.environment.tableColumnsData[this.routeParam]).forEach(col => {
                    if (this.routeParam == 'employeeotreport' && col != 'staffid' && col != 'employeename' && col != 'otHrMin') {
                      col = col.substring(1);
                    }
                    let nObj: any;
                    if ((obj[col] instanceof Array)) {
                      let arr = [];
                      obj[col].forEach(key => {
                        Object.keys(this.environment.tableColumnsData[this.routeParam][col]).forEach(col1 => {
                          arr.push({ val: key[col1], label: col1, type: this.environment.tableColumnsData[this.routeParam][key] });
                        })
                      })
                      nObj = { val: arr, label: col, type: this.environment.tableColumnsData[this.routeParam][col] };
                    } else {
                      nObj = { val: obj[col], label: col, type: this.environment.tableColumnsData[this.routeParam][col] };
                    }
                    cols.push(nObj);
                  })
                  keys.push(cols);
                });
                const obj = this.companyList.find((c: any) => c.id == this.modelFormData.value.companyCode);
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


  salaryProcessPrint(data: any) {
    const arr = [];
    data.Payslip.forEach((p: any) => {
      const attendances = data.Attendance.filter((a: any) => a.employeeCode == p.employeeCode);
      const ots = data.OT.find((o: any) => o.employeename == p.employeeName);
      attendances.forEach((at: any) => {
        const day = new Date(at.attndate).getDate();
          at.dayH = ots ? ots[day]: '';
          at.day = day;
          at.logintime = at.logintime ? new Date(at.logintime).toLocaleTimeString() : '-';
          at.logouttime = at.logouttime ? new Date(at.logouttime).toLocaleTimeString(): '-';
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

  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

}