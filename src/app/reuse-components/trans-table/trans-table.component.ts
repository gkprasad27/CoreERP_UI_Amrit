import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RuntimeConfigService } from '../../services/runtime-config.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../../components/dashboard/comp-list/add-or-edit.service';
import { ApiConfigService } from '../../services/api-config.service';
import { ApiService } from '../../services/api.service';
import { StatusCodes, SnackBar } from '../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransListService } from '../../components/dashboard/trans-list/trans-list.service';
import { AlertService } from '../../services/alert.service';
import { Static } from '../../enums/common/static';
import { CommonService } from '../../services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-trans-table',
  templateUrl: './trans-table.component.html',
  styleUrls: ['./trans-table.component.scss']
})
export class TransTableComponent implements OnInit {
  selectedDate = { start: moment().add(0, 'day'), end: moment().add(0, 'day') };

  // route
  routeParam: any;

  // header props
  headerForm: FormGroup;

  // table props
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  columnDefinitions = [];
  highlightedRows = [];
  keys = [];
  tableData: any;


  defaultValues() {
    this.dataSource = new MatTableDataSource();
    this.highlightedRows = [];
    this.columnDefinitions = [];
    this.keys = [];
    this.tableData = [];
  }


  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    activatedRoute: ActivatedRoute,
    private runtimeConfigService: RuntimeConfigService,
    private router: Router,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private spinner: NgxSpinnerService,
    private transListService: TransListService,
    public commonService: CommonService,
    private alertService: AlertService
  ) {
    this.headerForm = this.formBuilder.group({
      selected: [null],
      FromDate: [null],
      ToDate: [null],
      searchCriteria: [null],
      companyCode: ''
    });
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
      this.defaultValues();
      this.reset();
    });
  }

  ngOnInit() {
  }

  search() {
    if (!this.commonService.checkNullOrUndefined(this.headerForm.value.selected)) {
      this.headerForm.patchValue({
        FromDate: this.commonService.formatDate(this.headerForm.value.selected.start.$d),
        ToDate: this.commonService.formatDate(this.headerForm.value.selected.end.$d)
      });
    }
    this.getTableList();
  }

  reset() {
    this.headerForm.reset();
    this.getTableList();
  }


  getTableList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    this.headerForm.patchValue({
      companyCode: obj.companyCode
    })
    const getInvoiceListUrl = String.Join('/', this.transListService.getDynComponents(this.routeParam).tableUrl);
    this.apiService.apiPostRequest(getInvoiceListUrl, this.headerForm.value).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response[this.transListService.getDynComponents(this.routeParam).list]) && res.response[this.transListService.getDynComponents(this.routeParam).list].length) {
            this.tableData = res.response[this.transListService.getDynComponents(this.routeParam).list];
          }
        } else if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.tableData = [];
        }
        this.tableDataFunc();
      });
  }

  openEditTrans(row) {
    this.addOrEditService.editData = 'Edit';
    this.router.navigate(['dashboard/transaction', this.routeParam, 'Edit', { value: row[this.transListService.getDynComponents(this.routeParam).editKey] }]);
  }

  newTransOpen() {
    this.addOrEditService.editData = 'New';
    this.router.navigate(['dashboard/transaction', this.routeParam, 'New']);
  }

  tableDataFunc() {
    this.highlightedRows = [];
    this.dataSource = new MatTableDataSource();

    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.dataSource = new MatTableDataSource(this.tableData);
      }
    }
    if (!this.commonService.checkNullOrUndefined(this.dataSource)) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (!this.commonService.checkNullOrUndefined(this.tableData) && this.tableData.length > 0 && this.routeParam != '') {

      const col = [];
      this.columnDefinitions = [];
      this.keys = [];

      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key });
      }

      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: true
        };
        col.push(obj);
      });

      for (let key in this.runtimeConfigService.tableColumnsData[this.routeParam]) {

        if (this.runtimeConfigService.tableColumnsData[this.routeParam][key] == 'Date') {
          this.formatDate(key);
        }
        // tslint:disable-next-line: prefer-for-of
        for (let c = 0; c < col.length; c++) {
          if (key == col[c].def) {
            this.columnDefinitions.push(col[c]);
          }
        }
      }

      if(this.routeParam == 'GoodsReceiptApproval' || this.routeParam == 'PurchaseorderApproval') {
        this.columnDefinitions.unshift({ def: "checkbox", hide : true, label : ""})
      }

      

    }




  }

  formatDate(col) {
    this.tableData.map(res => !this.commonService.checkNullOrUndefined(res[col]) ? res[col] = this.commonService.formatDateValue(res[col]) : '');
  }

  getDisplayedColumns(): string[] {
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    }
    return null;
  }

  selectRow(row, index) {
    console.log(row, index)
  }

  setClass(element: any) {
    if (this.routeParam == 'goodsreceipts') {
        return element.status == "Material Received" ? 'background-green' : '';
    }
    if (this.routeParam == 'saleorder') {
      if (new Date(element.dateofSupply) < new Date() && element.status != "Completed") {
        return 'background-red';
      }
      if (new Date(element.dateofSupply) < new Date() && element.status == "Completed") {
        return 'background-green';
      }
    }
    if (this.routeParam == 'purchaseorder') {
      if (new Date(element.deliveryDate) < new Date() && element.status != "Completed") {
        return 'background-red';
      }
      if (new Date(element.deliveryDate) < new Date() && element.status == "Completed") {
        return 'background-green';
      }
    }
    if (element.result && element.result.condition == 'inspection' && element.result.value) {
      if ((element.result.value < element.minValue.value) || (element.result.value > element.maxValue.value)) {
        return element.result.addClass;
      }
    }
    return ''
  }

  checkboxCheck(flag: any, element: any) {
    element.checked = flag.checked;
  }

  buttonClick(flag: string) {
    const user = JSON.parse(localStorage.getItem('user'));
    const registerInvoiceUrl = String.Join('/', this.routeParam == 'PurchaseorderApproval' ? this.apiConfigService.savePurchaseOrder: this.apiConfigService.saveGoodsReceipt);
    const requestObj = this.tableData.filter((f: any) => f.checked).map((t: any) => { return { ...t, approvalStatus: flag, approvedBy: user.userName, addWho: user.userName, editWho: user.userName }});
    this.apiService.apiPostRequest(registerInvoiceUrl, {dtl:requestObj}).subscribe(
      response => {
        if (!this.commonService.checkNullOrUndefined(response) && response.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(response.response)) {
            this.alertService.openSnackBar(`${flag} Completed`, Static.Close, SnackBar.success);
            this.reset();
          }
        }
      });
  }

}
