import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS, NonEditableDatepicker } from '../../../../directives/format-datepicker';
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-materialissue',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, NonEditableDatepicker, NgMultiSelectDropDownModule, TypeaheadModule, TableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './materialissue.component.html',
  styleUrls: ['./materialissue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})
export class MaterialissueComponent {

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  data: any;

  date = new Date()
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    allowSearchFilter: true
  };


  // form control
  formData: FormGroup;
  formData1: FormGroup;
  companyList = [];
  tableData: any[] = [];


  // header props
  materialList = [];
  employeesList: any;
  routeEdit = '';
  http: any;

  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private datepipe: DatePipe
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
  }


  formDataGroup() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.formData = this.formBuilder.group({

      id: [0],
      company: [null, Validators.required],
      companyName: [null],
      addWho: user.userName,
      editWho: user.userName,
      issuedDate: [null],
      issuedFrom:[null],
      issuedTo:[null],
      materialCode: [''],
      status:[null],
      narration:[null],
      materialIssueId:[0]
    });


    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
    
      qty: ['', Validators.required],
      id: [0],
      stockQty: [0],
      materialName: [''],
      highlight: false,
      action: [
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
],
      index: 0
    });
  }
  public mmasterListData: EventEmitter<any[]> = new EventEmitter<any[]>();
  
  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: [
  { id: 'Edit', type: 'edit' },
  { id: 'Delete', type: 'delete' }
],
      id: 0
    });
  }

  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      highlight: true
    });
    
    let data: any = this.tableData;
    this.tableData = null;
    this.tableComponent.defaultValues();
    const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode)
    if (this.formData1.value.index == 0 && !obj) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      if (this.formData1.value.index == 0) {
        data.forEach((res: any) => { if (res.materialCode == this.formData1.value.materialCode) { (res.qty = res.qty + this.formData1.value.qty) } });
      } else {
        data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
      }
     
    }
    setTimeout(() => {
      this.tableData = data;
      console.log("Table Data:", this.tableData);
    });
    this.resetForm();
  }

  
  materialChange() {
    this.materialList = [];
    this.mmasterListData.emit([]);
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        let obj = JSON.parse(localStorage.getItem("user"));
        const voucherClassList = String.Join('/', this.apiConfigService.getMaterialList, obj.companyCode, this.formData1.value.materialCode);
        this.apiService.apiGetRequest(voucherClassList)
        .subscribe(((response: any) => {
              this.spinner.hide();
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.materialList = res.response['mmasterList'];
                  this.mmasterListData.emit(res.response['mmasterList']);
                }
              }
            })
      )  
      }

    editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.deleteRecord(value);
    } else {
      this.formData1.patchValue(value.item);
    }
  }
 

  deleteRecord(value) {
    const obj = {
      item: {
        materialCode: value.item.materialCode
      },
      primary: 'materialCode'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const jvDetUrl = String.Join('/', this.apiConfigService.deletePurchaseOrder, value.item.id);
        this.apiService.apiDeleteRequest(jvDetUrl)
          .subscribe(
            response => {
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.tableComponent.defaultValues();
                  this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    })
  }


  getCompanyList() {
    const companyUrl = String.Join('/', this.apiConfigService.getCompanysList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
              this.spinner.hide();
            }
          }
          this.getEmployeesList();
        });
  }

  getEmployeesList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.employeesList = res.response['emplist'];
              this.spinner.hide();
            }
          }
          this.getMaterialIssueDetail();
        });
  }

  EmpChange(event?: any) {
    const obj = this.employeesList.find((c: any) => c.id == (event ? event.id : this.formData.value.issuedFrom));
       if (!event) {
      this.formData.patchValue({
        issuedFrom: [{ id: obj.id, text: obj.text }]
      })
    }
  }

  EmpChange1(event?: any) {
    const obj = this.employeesList.find((c: any) => c.id == (event ? event.id : this.formData.value.issuedTo));
       if (!event) {
      this.formData.patchValue({
        issuedTo: [{ id: obj.id, text: obj.text }]
      })
    }
  }

  downLoadFile(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.item[event.action]);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  
  getMaterialIssueDetail() {
    const qsDetUrl = String.Join('/', this.apiConfigService.getMaterialIssueDetail, this.routeEdit);
    this.apiService.apiGetRequest(qsDetUrl).subscribe(response => {
      this.spinner.hide();
      const res = response;
      if (res && res.status === StatusCodes.pass && res.response) {
        this.formData.patchValue(res.response['materialIssueMasters']);
  
        if (res.response['materialIssueDetails'] && res.response['materialIssueDetails'].length) {
           
          res.response['materialIssueDetails'].forEach((detail: any, index: number) => {
            const materialObj = this.materialList.find((m: any) => m.id == detail.materialCode);
            if (materialObj) {
              detail.materialName = materialObj.text;
              detail.stockQty = materialObj.availQTY;
              detail.materialCode = { materialCode: materialObj.id, materialName: materialObj.text };
            }
            detail.action = 'editDelete';
            detail.index = index + 1;
          });
  
          this.tableData = res.response['materialIssueDetails'];
          this.EmpChange();
          this.EmpChange1();
        }
      }
    });
  }
  

 
  emitColumnChanges(data) {
    this.tableData = data.data;
  }

  materialCodeChange() {
    const obj = this.materialList.find((m: any) => m.id == this.formData1.value.materialCode);
    this.formData1.patchValue({
      weight: obj.netWeight,
      stockQty: obj.availQTY,
      materialName: obj.text,

    })
    if (!obj.netWeight) {
      this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
    }

  }



  back() {
    this.router.navigate(['dashboard/transaction/materialissue'])
  }

  save() {
    if (this.tableData.length == 0 || this.formData.invalid) {
      return;
    }
    this.addMaterialIssue();
  }

  addMaterialIssue() {
    const addsq = String.Join('/', this.apiConfigService.addMaterialIssue);
    const obj = this.formData.value;
    obj.issuedDate = obj.issuedDate ? this.datepipe.transform(obj.issuedDate, 'MM-dd-yyyy') : '';
    obj.issuedFrom = this.formData.value.issuedFrom[0].id;
    obj.issuedTo = this.formData.value.issuedTo[0].id;
    const arr = this.tableData;
    const requestObj = { miHdr: this.formData.value, miDtl: arr };
    this.apiService.apiPostRequest(addsq, requestObj).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Material Issue created Successfully..', Static.Close, SnackBar.success);
            this.back();
          }
        }
      });
  }

  print() {
    let formObj = this.formData.value;
    if (this.companyList.length) {
      const cObj = this.companyList.find((c: any) => c.companyCode == formObj.company);
      formObj['address'] = {
        companyName: cObj.companyName,
        address: cObj.address,
        address1: cObj.address1,
        city: cObj.city,
        stateName: cObj.stateName,
        pin: cObj.pin,
        phone: cObj.phone,
        email: cObj.email,
      }
    }
    // if (this.bpaList.length) {
    //   const str = (this.formData.value.vendor && this.formData.value.vendor) ? this.formData.value.vendor[0].id : ''
    //   const bpaObj = this.bpaList.find((c: any) => c.bpnumber == str);
    //   formObj['vAddress'] = {
    //     name: bpaObj.name,
    //     address: bpaObj.address,
    //     address1: bpaObj.address1,
    //     city: bpaObj.city,
    //     stateName: bpaObj.stateName,
    //     pin: bpaObj.pin,
    //     phone: bpaObj.phone,
    //     email: bpaObj.email,
    //     gstno: bpaObj.gstno,
    //   }
    // }
    // if (this.profitCenterList.length) {
    //   const cObj = this.profitCenterList.find((c: any) => c.code == formObj.profitCenter);
    //   formObj['pAddress'] = {
    //     name: cObj.name,
    //     address: cObj.address1,
    //     address1: cObj.address2,
    //     city: cObj.city,
    //     stateName: cObj.stateName,
    //     pin: cObj.pin,
    //     phone: cObj.phone,
    //     email: cObj.email,
    //     gstno: cObj.gstNo,
    //   }
    // }
    let list = [...this.tableData];
    list = [...list, ...this.setArray(list.length)];
    const obj = {
      heading: 'Material Issue',
      headingObj: formObj,
      detailArray: list,
      headingObj1: { ...this.formData1.value, ...this.formData.value }
    }

    this.data = obj;

    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('printData').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 1000);

  }

  setArray(length: number) {
    let newArr = [];
    if (length < 10) {
      for (let i = 0; i < (10 - length); i++) {
        newArr.push({})
      }
    }
    return newArr;
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
  }




}
