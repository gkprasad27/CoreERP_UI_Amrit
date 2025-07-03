import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiConfigService } from '../../../services/api-config.service';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';
import { SnackBar, StatusCodes } from '../../../enums/common/common';
import { Static } from '../../../enums/common/static';
import { NgxSpinnerService } from 'ngx-spinner';
import { String } from 'typescript-string-operations';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-rolesprevilages',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, 
    MatPaginator, MatTableModule, MatCardModule, MatSelectModule, MatCheckboxModule ],
  templateUrl: './rolesprevilages.component.html',
  styleUrls: ['./rolesprevilages.component.scss']
})
export class RolesprevilagesComponent implements OnInit, OnDestroy {

  formData: FormGroup;
  roleArray = [];
  parentMenu = [];
  actualData = [];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['ext4', 'active', 'canAdd', 'canEdit', 'canDelete'];

  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    route: ActivatedRoute

  ) {
    this.commonService.routeParam = route.snapshot.routeConfig.path;
    this.formData = this.formBuilder.group({
      role: [null],
      parentMenu: [null]
    });
    this.formData.controls['parentMenu'].disable();

  }

  ngOnInit() {
    this.GetRoles();
    this.GetParentMenus();
  }

  GetRoles() {
    const getRolesUrl = this.apiConfigService.getRoles;
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.roleArray = res.response['Roles'];
          }
        }
        this.spinner.hide();
      });
  }

  onRuleChange(data) {
    this.reset();
    this.formData.patchValue({
      role: data.value
    })
    this.formData.controls['parentMenu'].enable();
  }

  GetParentMenus() {
    const getRolesUrl = this.apiConfigService.getParentMenus;
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.parentMenu = res.response['ParentMenus'];
          }
        }
        this.spinner.hide();
      });
  }

  selectedParentMenu() {
    const getRolesUrl = String.Join('/', this.apiConfigService.getMenuList, this.formData.get('role').value,
      this.formData.get('parentMenu').value);
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.actualData = res.response.map(x => ({ ...x }));
            this.dataSource = new MatTableDataSource(res.response.map(x => ({ ...x })));
            this.dataSource.paginator = this.paginator;
          }
        }
        this.spinner.hide();
      });
  }


  checkboxCheck(event, column) {
    if (!this.commonService.checkNullOrUndefined(this.dataSource)) {
      this.dataSource.data = this.dataSource.data.map(val => {
        val[column] = event.checked;
        return val;
      });
    }
  }

  save() {
    let filterData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      let filterValue = this.actualData.filter(res => res.operationCode == this.dataSource.data[d]['operationCode']);
      if (filterValue.length) {
        if (!this.commonService.IsObjectsMatch(filterValue[0], this.dataSource.data[d])) {
          filterData.push(this.dataSource.data[d]);
        }
      }
    }

    const getAccessUrl = String.Join('/', this.apiConfigService.giveAccess, this.formData.get('role').value);
    this.apiService.apiPostRequest(getAccessUrl, filterData).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(Static.LoginSussfull, Static.Close, SnackBar.success);
            this.reset();
          }
        }
        this.spinner.hide();
      });

  }

  reset() {
    this.formData.reset();
    this.dataSource = undefined;
    this.formData.controls['parentMenu'].disable();
  }

  ngOnDestroy(): void {
    this.commonService.routeParam = null;
  }

}

