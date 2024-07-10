import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddOrEditService } from '../add-or-edit.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  modelFormData: FormGroup;
  sendRoutingDynTableData: any;
  routeEdit = '';
  formData: any;
  costCenterList: any;
  personList: any;
  wbsElementList: any;
  materialList: any;
  materialCodeList: any;
  routingTableData = [];
  resourceList = [{ id: 'Machine', text: 'Machine' },
  { id: 'Labour', text: 'Labour' }, { id: 'Persons', text: 'Persons' },
  { id: 'Material ', text: 'Material ' }]

  dynTablePropsRouting: any;

  formulaList: any;
  wcList: any;
  dynTableroutingTableData: void;
  constructor(
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit(): void {
    this.formDataGroup();
    this.getEmployeeList();
  }

  tablePropsRoutingFunc() {
    return {
      tableData: {
        resource: {
          value: null, type: 'dropdown', list: this.resourceList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        materialCode: {
          value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        qty: {
          value: null, type: 'text', width: 150
        },
        costCenter: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'code', text: 'costCenterName',
          disabled: false, displayMul: true
        },
        rate: {
          value: null, type: 'text', width: 150
        },
        activity: {
          value: null, type: 'text', width: 150
        },

        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        resource: [null, [Validators.required]]
      }
    }
  }

  emitColumnRoutingData(data) {
    this.routingTableData = data.data;
  }


  formDataGroup() {
    this.modelFormData = this.formBuilder.group({
      wbselement: [null],
      taskNumber: [null],
      description: [null],
      immediatePrecedessors: [null],
      successorTask: [null],
      timeNeeded: [null],
      period: [null],
      earlyStart: [null],
      earlyFinish: [null],
      lateStart: [null],
      lateFinish: [null],
      forwardTotal: [null],
      backwardTotal: [null],
      person: [null],
      risk: [null],
    })
    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
    if (this.routeEdit) {
      this.modelFormData.controls['taskNumber'].disable();
    }
  }

  getEmployeeList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getemployeeUrl = String.Join('/', this.apiConfigService.getEmployeeList, obj.companyCode);
    this.apiService.apiGetRequest(getemployeeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.personList = res.response['emplist'];
            }
          }
          this.getWbselementList();
        });
  }
  getWbselementList() {
    const getwbselementUrl = String.Join('/', this.apiConfigService.getwbselement);
    this.apiService.apiGetRequest(getwbselementUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.wbsElementList = res.response['wbsList'];
            }
          }
          this.getmaterialList();
        });
  }
  getmaterialList() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.materialList = res.response['materialList'];
            }
          }
          this.getCostCenterData();
        });
  }



  getCostCenterData() {
    const getccUrl = String.Join('/', this.apiConfigService.GetCostCenterList);
    this.apiService.apiGetRequest(getccUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costCenterList = res.response['costcenterList'];
            }
          }
          this.dynTablePropsRouting = this.tablePropsRoutingFunc();
          if (this.routeEdit != '') {
            this.gettaskDetail(this.routeEdit);
          }
          this.spinner.hide();
        });
  }

  reset() {
    this.routingTableData = [];
    this.modelFormData.reset();
    this.sendRoutingDynTableData = { type: 'reset', data: [] };
  }

  save() {
    this.routingTableData = this.commonService.formatTableData(this.routingTableData);
    if (this.routeEdit) {
      this.updatetask();
    } else {
      this.savetask();
    }
  }

  savetask() {
    const addrouting = String.Join('/', this.apiConfigService.addtask);
    const requestObj = {
      taskHdr: this.modelFormData.value, taskDetail: this.routingTableData,
    };
    this.apiService.apiPostRequest(addrouting, requestObj).subscribe(
      response => {
        const res = response;
        this.routingTableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Task created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

  updatetask() {
    const obj = this.modelFormData.value;
    obj['taskNumber'] = this.modelFormData.controls.taskNumber.value;
    const addrouting = String.Join('/', this.apiConfigService.updateTasks);
    const requestObj = {
      taskHdr: obj, taskDetail: this.routingTableData,
    };
    this.apiService.apiUpdateRequest(addrouting, requestObj).subscribe(
      response => {
        const res = response;
        this.routingTableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Task created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }



  gettaskDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getaskDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          console.log(res.response['taskMastersDetail']);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.sendRoutingDynTableData = { type: 'edit', data: res.response['taskMastersDetail'] };

              // this.modelFormData.disable();

            }
          }
        });
  }

  back() {
    this.router.navigate(['dashboard/master/tasks'])
  }

}
