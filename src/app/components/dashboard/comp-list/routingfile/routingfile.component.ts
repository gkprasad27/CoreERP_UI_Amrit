import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicTableComponent } from '../../../../reuse-components/dynamic-table/dynamic-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddOrEditService } from '../add-or-edit.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-routingfile',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, DynamicTableComponent, NonEditableDatepicker, TypeaheadModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './routingfile.component.html',
  styleUrls: ['./routingfile.component.scss']
})


export class RoutingFileComponent implements OnInit {

  modelFormData: FormGroup;
  sendRoutingDynTableData: any;
  sendActivityDynTableData: any;
  sendMaterialAssDynTableData: any;
  sendToolsEquipmentDynTableData: any;

  routeEdit = '';
  formData: any;
  companyList = [];
  plantList: any;
  costunitList: any;
  matypeList: any;
  ordertypeList: any;
  costCenterList: any;
  uomList: any;

  dynTablePropsRouting = this.tablePropsRoutingFunc();
  dynTablePropsActivity: any;
  dynTablePropsMaterialAss: any;
  dynTablePropsToolsEquipment: any;

  routingTableData = [];
  activityTableData = [];
  materialAssTableData = [];
  equipmentTableData = [];
  formulaList: any;
  wcList: any;
  dynTableroutingTableData: void;
  constructor(
    private addOrEditService: AddOrEditService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    public commonService: CommonService,
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
    this.getCompanyList();
  }



  tablePropsActivityFunc() {
    return {
      tableData: {
        workCenter: {
          value: null, type: 'dropdown', list: this.wcList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        costCenter: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'code', text: 'costCenterName',
          disabled: false, displayMul: true
        },
        standardValue: {
          value: null, type: 'text', width: 150
        },
        uom: {
          value: null, type: 'dropdown', list: this.uomList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        formula: {
          value: null, type: 'dropdown', list: this.formulaList, id: 'formulaKey', text: 'description',
          disabled: false, displayMul: true
        },
        activity: {
          value: null, type: 'toggle', width: 150
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        workCenter: [null, [Validators.required]]
      }
    }
  }

  tablePropsRoutingFunc() {
    return {
      tableData: {
        operation: {
          value: null, type: 'text', width: 150
        },
        subOperation: {
          value: null, type: 'text', width: 150
        },

        workCenter: {
          value: null, type: 'dropdown', list: this.wcList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        baseQuantity: {
          value: null, type: 'text', width: 150
        },
        operationUnit: {
          value: null, type: 'text', width: 150
        },

        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        operation: [null, [Validators.required]]
      }
    }
  }

  tablePropsMaterialAssFunc() {
    return {
      tableData: {
        material: {
          value: null, type: 'dropdown', list: this.matypeList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        description: {
          value: null, type: 'text', width: 150
        },
        qty: {
          value: null, type: 'text', width: 150
        },
        uom: {
          value: null, type: 'dropdown', list: this.uomList, id: 'id', text: 'text',
          disabled: false, displayMul: true
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        material: [null, [Validators.required]]
      }
    }
  }

  tablePropsToolsEquipmentFunc() {
    return {
      tableData: {
        toolsEqupment: {
          value: null, type: 'text', width: 150
        },
        description: {
          value: null, type: 'text', width: 150
        },
        numbers: {
          value: null, type: 'text', width: 150
        },
        delete: {
          type: 'delete',
          newObject: true
        }
      },
      formControl: {
        toolsEqupment: [null, [Validators.required]]
      }
    }
  }

  emitColumnRoutingData(data) {
    this.routingTableData = data.data;
  }

  emitColumnActivityData(data) {
    this.activityTableData = data.data;
  }

  emitColumnMaterialAssData(data) {
    this.materialAssTableData = data.data;
  }

  emitColumnToolsEquipmentData(data) {
    this.equipmentTableData = data.data;
  }



  formDataGroup() {
    this.modelFormData = this.formBuilder.group({
      company: [null, [Validators.required]],
      plant: null,
      costUnit: null,
      material: null,
      orderNumber: null,
      saleOrder: null,
      saleDocument: null,
      routingKey: null,
      description: null,
      creationDate: null,
      version: null
    })
    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
  }

  getCompanyList() {
    const companyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];

            }
          }
          this.getplantsList();
        });
  }
  getplantsList() {
    const getplantsList = String.Join('/', this.apiConfigService.getPlantsList);
    this.apiService.apiGetRequest(getplantsList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.plantList = res.response['plantsList'];

            }
          }
          this.getordernumberData();
        });
  }
  getordernumberData() {
    const getorderelementUrl = String.Join('/', this.apiConfigService.getordernolist);
    this.apiService.apiGetRequest(getorderelementUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.ordertypeList = res.response['ordertypeList'];
            }
          }
          this.getcostunitsData();
        });
  }
  getcostunitsData() {
    const getsecondelementUrl = String.Join('/', this.apiConfigService.getcostingunitsList);
    this.apiService.apiGetRequest(getsecondelementUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costunitList = res.response['costunitList'];
            }
          }
          this.getmaterialData();
        });
  }
  getmaterialData() {
    const getmaterialUrl = String.Join('/', this.apiConfigService.getMaterialList);
    this.apiService.apiGetRequest(getmaterialUrl)
      .subscribe(
        response => {
          const res = response;

          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.matypeList = res.response['materialList'];
            }
          }
          this.getUomTypeData();
        });
  }
  getUomTypeData() {
    const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
    this.apiService.apiGetRequest(getuomTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.uomList = res.response['UOMList'];
            }
          }
          this.getWCList();
        });
  }
  getWCList() {
    const getWCListurl = String.Join('/', this.apiConfigService.getWCList);
    this.apiService.apiGetRequest(getWCListurl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.wcList = res.response['wcList'];
            }
          }
          this.getFormulaList();
        });
  }
  getFormulaList() {
    const getformulaUrl = String.Join('/', this.apiConfigService.getFormulaList);
    this.apiService.apiGetRequest(getformulaUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formulaList = res.response['formulaList'];
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costCenterList = res.response['costcenterList'];
            }
          }
          if (this.routeEdit != '') {
            this.getreceiptpaymentDetail(this.routeEdit);
          }
          this.dynTablePropsRouting = this.tablePropsRoutingFunc();
          this.dynTablePropsActivity = this.tablePropsActivityFunc();
          this.dynTablePropsMaterialAss = this.tablePropsMaterialAssFunc();
          this.dynTablePropsToolsEquipment = this.tablePropsToolsEquipmentFunc();

          this.spinner.hide();
        });
  }

  reset() {
    this.routingTableData = [];
    this.activityTableData = [];
    this.materialAssTableData = [];
    this.equipmentTableData = [];
    this.modelFormData.reset();
    this.sendRoutingDynTableData = { type: 'reset', data: [] };
    this.sendActivityDynTableData = { type: 'reset', data: [] };
    this.sendMaterialAssDynTableData = { type: 'reset', data: [] };
    this.sendToolsEquipmentDynTableData = { type: 'reset', data: [] };
  }

  save() {
    const routingTableData = this.commonService.formatTableData(this.routingTableData);
    const activityTableData = this.commonService.formatTableData(this.activityTableData);
    const materialAssTableData = this.commonService.formatTableData(this.materialAssTableData);
    const equipmentTableData = this.commonService.formatTableData(this.equipmentTableData);
    const obj = {
      routingDetail: routingTableData, activityDetail: activityTableData,
      materialDetail: materialAssTableData, equipmentDetail: equipmentTableData
    }
    this.saverouting(obj);
  }

  saverouting(obj) {
    const addrouting = String.Join('/', this.apiConfigService.addrouting);
    const requestObj = {
      routeHdr: this.modelFormData.value, routingDetail: obj.routingDetail,
      activityDetail: obj.activityDetail, materialDetail: obj.materialDetail, equipmentDetail: obj.equipmentDetail,
    };
    this.apiService.apiPostRequest(addrouting, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Routing File created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }



  getreceiptpaymentDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getroutingfileDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.sendRoutingDynTableData = { type: 'edit', data: res.response['routebasicDetail'] };
              this.sendActivityDynTableData = { type: 'edit', data: res.response['activityDetail'] };
              this.sendMaterialAssDynTableData = { type: 'edit', data: res.response['materialDetail'] };
              this.sendToolsEquipmentDynTableData = { type: 'edit', data: res.response['toolsequpmentDetail'] };
              this.modelFormData.disable();

            }
          }
        });
  }

  back() {
    this.router.navigate(['dashboard/master/routingfile']);
  }

}
