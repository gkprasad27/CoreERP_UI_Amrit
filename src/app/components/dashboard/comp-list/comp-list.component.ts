import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { String } from 'typescript-string-operations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from '../../../enums/common/common';
import { DeleteItemComponent } from '../../../reuse-components/delete-item/delete-item.component';
import { TableComponent } from '../../../reuse-components/table/table.component';
import { AlertService } from '../../../services/alert.service';
import { SnackBar } from '../../../enums/common/common';
import { CompListService } from './comp-list.service';
import { ApiConfigService } from '../../../services/api-config.service';
import { AddOrEditService } from './add-or-edit.service';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-comp-list',
  imports: [CommonModule, TableComponent],
  templateUrl: './comp-list.component.html',
  styleUrls: ['./comp-list.component.scss']
})
export class CompListComponent implements OnInit, OnDestroy {

  tableData: any;
  addOrUpdateData: any;
  tableUrl: any;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private compListService: CompListService,
    private apiConfigService: ApiConfigService,
    private addOrEditService: AddOrEditService,
    private commonService: CommonService,
    private router: Router
  ) {
    activatedRoute.params.subscribe(params => {
      this.commonService.routeParam = params.id
      this.getTableParameters(params.id);
      if (!this.commonService.checkNullOrUndefined(this.tableComponent)) {
        this.tableComponent.defaultValues();
      }
    });
  }

  getTableParameters(id) {
    const getUrl = String.Join('/', this.apiConfigService.getComponentInfo, id);
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tableUrl = res.response;
              this.addOrEditService.tableParameters = res.response;
              if (!this.commonService.checkNullOrUndefined(this.tableUrl)) {
                this.getTableData();
              }
            }
          }
        });
  }

  getTableData() {
    let getUrl = ''
    if (this.tableUrl.url == "MaterialMaster/GetMaterialMasterList" || this.tableUrl.url == "BusienessPartnerAccount/GetBusienessPartnerAccountList"
      || this.tableUrl.url == "Employee/GetEmployeeList" || this.tableUrl.url == "Common/GetPOQList" || this.tableUrl.url == "Common/GetRejectionList") {
      let obj = JSON.parse(localStorage.getItem("user"));
      getUrl = String.Join('', environment.baseUrl, this.tableUrl.url, `/${obj.companyCode}`);
    } else if ((this.tableUrl.url == "Dispatch/GetDispatchList" && this.commonService.routeParam == 'dispatchstatus')) {
      let obj = JSON.parse(localStorage.getItem("user"));
      getUrl = String.Join('', environment.baseUrl, this.tableUrl.url, `/${obj.userName}`);
    } else {
      getUrl = String.Join('', environment.baseUrl, this.tableUrl.url);
    }
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              const data = res.response[this.tableUrl.listName];
              if (this.tableUrl.url == "Common/GetPOQList") {
                data.forEach(element => {
                  element.link = element.approvalStatus !== 'Pending Approval' ? 'Po Created' : '';
                });
              }
              this.tableData = data;
            }
          }
          this.spinner.hide();
        });
  }

  onLinkEmitEvent(value) {
    if (this.tableUrl.url == "Common/GetPOQList") {
      if (value.action === 'link') {
        this.router.navigate(['dashboard/transaction', 'purchaseorder', 'Edit', { value: 'purchaseOrderNo_' + value.item.saleOrderNo }]);
      }
    }
  }

  ngOnInit() {
  }

  addOrUpdateEvent(value) {
    if (value.action === 'Delete') {
      this.deleteRecord(value);
    } else {
      if (this.tableUrl.tabScreen == 'True') {
        this.addOrEditService.editData = value;
        if (value.action == 'Add') {
          this.router.navigate([this.activatedRoute.snapshot['_routerState'].url, value.action]);
        } else if (value.action == 'Edit') {
          this.router.navigate([this.activatedRoute.snapshot['_routerState'].url, value.action, { value: value.item[this.tableUrl.primaryKey] }]);
        }
      } else {
        value.tableData = this.tableData;
        const dialogRef = this.dialog.open(this.compListService.getDynComponents(this.tableUrl.formName), {
          
      width: '80%',
        height: '80vh',
      position: { top: '5%', left: '10%' },
          data: value,
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (!this.commonService.checkNullOrUndefined(result)) {
            this.tableComponent.defaultValues();
            this.getTableData();
          }
        });

      }
    }
  }

  deleteRecord(value) {
    value.primary = this.tableUrl.delete;
    const dialogRef = this.dialog.open(DeleteItemComponent, {
     
      width: '80%',
        height: '80vh',
      position: { top: '5%', left: '10%' },
      data: value,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.commonService.checkNullOrUndefined(result)) {
        this.spinner.show();
        const deleteUrl = String.Join('', environment.baseUrl, this.tableUrl.deleteUrl);
        const deleteParamUrl = String.Join('/', deleteUrl, result.item[this.tableUrl.primaryKey]);
        this.apiService.apiDeleteRequest(deleteParamUrl, result.item)
          .subscribe(
            response => {
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.tableComponent.defaultValues();
                  this.getTableData();
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    });

  }

  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

}