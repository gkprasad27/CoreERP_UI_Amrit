import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
import { TableComponent } from 'src/app/reuse-components';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface BomType {
  value: string;
  viewValue: string;
}
interface LevelType {
  value: string;
  viewValue: string;
}
interface Level {
  value: string;
  viewValue: string;
}
interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class BillOfMaterialComponent implements OnInit {

  sendDynTableData: any;

  formData: FormGroup;
  formData1: FormGroup;

  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  materialList = [];
  routeEdit = '';
  bpList = [];
  tableData = [];
  dynTableProps: any;
  bpgLists: any;
  companyList = [];
  UomList = [];
  voucherClassList = [];
  voucherTypeList = [];
  natureofTransactionList = ['Receipts', 'Payment'];
  accountList = [];
  qnoList = [];
  filterQnoList = [];

  accountFilterList = [];
  glAccountList = [];
  // level = [{ id: '0', text: '0' }, { id: '1', text: '1' }, { id: '2', text: '2' }, { id: '3', text: '3' },
  // { id: '4', text: '4' }, { id: '5', text: '5' }, { id: '6', text: '6' },
  // { id: '7', text: '7' }, { id: '8', text: '8' }, { id: '9', text: '9' }, { id: '10', text: '10' }
  // ];
  maftype = [{ id: 'Sub Assembly', text: 'Sub Assembly' },
  { id: 'Raw Material', text: 'Raw Material' }];

  // type = [{ id: 'BOM', text: 'BOM' }, { id: 'Item', text: 'Item' }]

  profitCenterList = [];
  bpTypeList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  purchaseinvoice = [];
  amount = [];
  date = [];
  mmasterList = [];
  BomType: BomType[] =
    [
      { value: 'Engineering BOM', viewValue: 'Engineering BOM' },
      { value: 'Sale Order BOM', viewValue: 'Sale Order BOM' },
      { value: 'Production BOM', viewValue: 'Production BOM' },
      { value: 'Service BOM', viewValue: 'Service BOM' },
      { value: 'Maintenance BOM', viewValue: 'Maintenance BOM' },
      { value: 'Purchasing BOM', viewValue: 'Purchasing BOM' }
    ];

  // LevelType: LevelType[] =
  //   [
  //     { value: 'Single', viewValue: 'Single' },
  //     { value: 'Multiple', viewValue: 'Multiple' }
  //   ];

  plantList: any;
  costunitList: any;
  employeesList: any;
  batchmasterList: any;

  public mmasterListData: EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  onbpChange() {
    this.bpgLists = [];

  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
    this.getSaleOrderList();

    

    // this.formData.controls['material'].disable();
  }

  // costunitSelect() {
  //   const object = this.costunitList.find(res => res.objectNumber === this.formData.get('costUnit').value)
  //   this.formData.patchValue({
  //     material: !this.commonService.checkNullOrUndefined(object) ? object.material : null
  //   })
  // }

  onValueChange() {
        this.mmasterList = [];
        this.mmasterListData.emit([])
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        let obj = JSON.parse(localStorage.getItem("user"));
        const voucherClassList = String.Join('/', this.apiConfigService.getMaterialList, obj.companyCode, this.formData1.value.materialCode);
        this.http.get(voucherClassList, options)
        .subscribe(((response: any) => {
              this.spinner.hide();
              const res = response;
              console.log(res);
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.mmasterList = res.response['mmasterList'];
                  this.mmasterListData.emit(res.response['mmasterList']);
                }
              }
            })
      )  
    }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      amount: [''],
      profitcenterName: [''],
      companyName: [null],
      bomtype: ['', Validators.required],
      // saleOrder: ['', Validators.required],
      bomnumber: [null, [Validators.required]],
      description: [null, [Validators.required]],
      profitCenter: ['', Validators.required],
      // product: ['', Validators.required],
      // materialCode: [''],
      // materialName: [''],
      // saleOrder: [null],
    });
    this.formData1 = this.formBuilder.group({
      materialCode: ['', Validators.required],
      qty: ['', Validators.required],
      // rate: ['', Validators.required],
      netWeight: [''],
      hsnsac: [''],
      //amount: [''],
      description: [''],
      // availableQty: [''],
      materialName: [''],

      mainComponent: [true],
      billable: [true],

      highlight: false,
      // amount: ['', Validators.required],
      id: [0],
      action: 'editDelete',
      index: 0
    });
    // this.checkTransType();
  }

  getSaleOrderList() {
    let obj = JSON.parse(localStorage.getItem("user"));
    const getSaleOrderUrl = String.Join('/', this.apiConfigService.getSaleOrderList, obj.companyCode);
    this.apiService.apiGetRequest(getSaleOrderUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.qnoList = res.response['BPList'];
            }
          }
        });
  }

  profitCenterChange() {
    this.filterQnoList = this.qnoList.filter((q: any) => q.profitCenter == this.formData.value.profitCenter);

  }

  saleOrderChange() {
    const getsaleOrdernoListe = String.Join('/', this.apiConfigService.getsaleOrdernoListe, this.formData.value.saleOrder);
    this.apiService.apiGetRequest(getsaleOrdernoListe)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response) && res.response.saleordernoList.length) {
              this.formData.patchValue({
                materialCode: res.response.saleordernoList[0].materialCode,
                materialName: res.response.saleordernoList[0].materialName,
              })

            }
          }
        });

  }

  tablePropsFunc() {
    return {
      tableData: {


        // bomLevel: {
        //   value: null, type: 'dropdown', list: this.level, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        component: {
          value: null, type: 'dropdown', list: this.mmasterList, id: 'id', text: 'text', displayMul: false, width: 100
        },
        // description: {
        //   value: null, type: 'text', width: 100, maxLength: 50
        // },

        manufacturingType: {
          value: null, type: 'dropdown', list: this.maftype, id: 'id', text: 'text', displayMul: false, width: 100
        },
        // type: {
        //   value: null, type: 'dropdown', list: this.type, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        // aboveLevel: {
        //   value: null, type: 'dropdown', list: this.level, id: 'id', text: 'text', displayMul: false, width: 100
        // },

        qty: {
          value: null, type: 'number', width: 75
        },
        // uom: {
        //   value: null, type: 'dropdown', list: this.UomList, id: 'id', text: 'text', displayMul: false, width: 100
        // },
        delete: {
          type: 'delete', width: 10
        }
      },

      formControl: {
        uom: [null, [Validators.required]]
      }
    };
  }


  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      action: 'editDelete',
      mainComponent: true,
      billable: true,
      id: 0
    });
  }

  // companyChange() {
  //   const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
  //   this.formData.patchValue({
  //     companyName: obj.text
  //   })
  // }

  // profitChange() {
  //   const obj = this.profitCenterList.find((c: any) => c.id == this.formData.value.profitCenter);
  //   this.formData.patchValue({
  //     profitcenterName: obj.text
  //   })
  // }

  // onProductChange() {
  //   const obj = this.mmasterList.find((c: any) => c.id == this.formData.value.product);
  //   this.formData.patchValue({
  //     materialName: obj.text
  //   })
  // }

  saveForm() {

    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      // amount: (+this.formData1.value.qty) * (+this.formData1.value.rate) * (+this.formData1.value.netWeight),
      highlight: true
    })

    let data: any = this.tableData || [];
    this.tableData = null;
    this.tableComponent.defaultValues();
    // const obj = data.find((d: any) => d.materialCode == this.formData1.value.materialCode);
    let form = this.formData1.value;
    form.billable = this.formData1.value.billable ? 'Y' : 'N'
    form.mainComponent = this.formData1.value.mainComponent ? 'Y' : 'N'
    if (this.formData1.value.index == 0) {
      // this.formData1.patchValue({
      form.index = data ? (data.length + 1) : 1,
        // });
        data = [form, ...data];
    } else {
      // if (this.formData1.value.index == 0) {
      //   data.forEach((res: any) => { if (res.material == this.formData1.value.material) { (res.qty = res.qty + this.formData1.value.qty) } });
      // } else {
      data = data.map((res: any) => res = res.index == form.index ? form : res);
      // }
    }
    setTimeout(() => {
      this.tableData = data;
      //   this.calculate();
    });
    this.resetForm();
  }

  calculate() {
    this.formData.patchValue({
      amount: 0,
    })
    this.tableData && this.tableData.forEach((t: any) => {
      this.formData.patchValue({
        amount: this.formData.value.amount + t.amount,
      })
    })
  }


  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.deleteBomDetail(value.item);
    } else {
      const val = { ...value.item };
      val.billable = val.billable == 'Y' ? true : false,
        val.mainComponent = val.mainComponent == 'Y' ? true : false,
        this.formData1.patchValue(val);
    }
  }


  deleteBomDetail(item: any) {
    const obj = {
      item: {
        materialCode: item.materialCode
      },
      primary: 'materialCode'
    }
    this.commonService.deletePopup(obj, (flag: any) => {
      if (flag) {
        const jvDetUrl = String.Join('/', this.apiConfigService.deleteBomDetail, item.id);
        this.apiService.apiDeleteRequest(jvDetUrl)
          .subscribe(
            response => {
              const res = response;
              if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                if (!this.commonService.checkNullOrUndefined(res.response)) {
                  this.tableComponent.defaultValues();
                  this.tableData = this.tableData.filter((res: any) => res.index != item.index);
                  this.calculate();
                  this.resetForm();
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    })

  }


  materialCodeChange() {
    const obj = this.mmasterList.find((m: any) => m.id == this.formData1.value.materialCode);

    this.formData1.patchValue({
      netWeight: obj.netWeight,
      hsnsac: obj.hsnsac,
      // availableQty: obj.availQTY,
      description: obj ? obj.text : '',
      materialName: obj ? obj.text : ''
    })
    // if (!obj.netWeight) {
    //   this.alertService.openSnackBar('Net Weight has not provided for selected material..', Static.Close, SnackBar.error);
    // }

  }

  getbomDetail(val) {
    const bomUrl = String.Join('/', this.apiConfigService.getBOMDetail, val);
    this.apiService.apiGetRequest(bomUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['bomMasters']);
              // this.sendDynTableData = { type: 'edit', data: res.response['bomDetail'] };
              this.formData.disable();
              // this.costunitSelect();
              //this.accountSelect();
              let arr = [];
              res.response['bomDetail'].forEach((s: any, index: number) => {

                // const mObj = this.mmasterList.find((m: any) => m.id == s.materialCode);
                const obj = {
                  materialCode: s.materialCode ? s.materialCode : '',
                  qty: s.qty ? s.qty : '',
                  // rate: s.rate ? s.rate : '',
                  netWeight: s.netWeight ? s.netWeight : '',
                  hsnsac: s.hsnsac ? s.hsnsac : '',
                  id: s.id ? s.id : '',
                  // amount: s.amount ? s.amount : '',
                  materialName: s.materialName ? s.materialName : '',
                  billable: s.billable ? s.billable : '',
                  mainComponent: s.mainComponent ? s.mainComponent : '',
                  // availableQty: mObj.availQTY ? mObj.availQTY : '',
                  // amount: s.amount ? s.amount : '',
                  action: 'editDelete',
                  index: index + 1,
                }
                arr.push(obj);
              })
              this.tableData = arr;
              // this.onbpChange();
            }
          }
        });
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
              this.formData.patchValue({
                company: this.companyList.length ? this.companyList[0].id : null
              })
              //this.companyChange();
            }
          }
          this.getprofircenterData();
        });
  }


  getprofircenterData() {
    const getprofircenterData = String.Join('/', this.apiConfigService.getProfitCentersList);
    this.apiService.apiGetRequest(getprofircenterData)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }
          // this.getMaterialList();
          if (this.routeEdit != '') {
            this.getbomDetail(this.routeEdit);
          }
        });
  }
  // getplantData() {
  //   const getplantUrl = String.Join('/', this.apiConfigService.getPlantsList);
  //   this.apiService.apiGetRequest(getplantUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.plantList = res.response['plantsList'];
  //           }
  //         }
  //         this.getCostUnitList();
  //       });
  // }

  // getCostUnitList() {
  //   const voucherClassList = String.Join('/', this.apiConfigService.getCostUnitListList);
  //   this.apiService.apiGetRequest(voucherClassList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.costunitList = res.response['costunitList'];
  //           }
  //         }
  //         this.getMaterialList();
  //       });
  // }

  // getMaterialList() {
  // let obj = JSON.parse(localStorage.getItem("user"));
  // const voucherClassList = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
  // this.apiService.apiGetRequest(voucherClassList)
  //   .subscribe(
  //     response => {
  //       this.spinner.hide();
  //       const res = response;
  //       console.log(res);
  //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //         if (!this.commonService.checkNullOrUndefined(res.response)) {
  //           this.mmasterList = res.response['mmasterList'];
  //         }
  //       }
  // if (this.routeEdit != '') {
  //   this.getbomDetail(this.routeEdit);
  // }
  // this.getEmployeesList();
  // });
  // }


  // getEmployeesList() {
  //   const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
  //   this.apiService.apiGetRequest(getEmployeeList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.employeesList = res.response['emplist'];
  //           }
  //         }
  //         this.getprofircenterData();
  //       });
  // }
  // getBatchList() {
  //   const getbatchList = String.Join('/', this.apiConfigService.getbatchList);
  //   this.apiService.apiGetRequest(getbatchList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.batchmasterList = res.response['batchmasterList'];
  //           }
  //         }
  //         this.getmaterialData();
  //       });
  // }

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

          // this.getuomTypeData();
        });
  }

  // getuomTypeData() {
  //   const getuomTypeUrl = String.Join('/', this.apiConfigService.getuomList);
  //   this.apiService.apiGetRequest(getuomTypeUrl)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         const res = response;

  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.UomList = res.response['UOMList'];
  //           }
  //         }
  //         this.dynTableProps = this.tablePropsFunc();
  //         if (this.routeEdit != '') {
  //           this.getbomDetail(this.routeEdit);
  //         }
  //       });
  // }



  // voucherTypeSelect() {
  //   const record = this.voucherTypeList.find(res => res.voucherTypeId == this.formData.get('voucherType').value)
  //   this.formData.patchValue({
  //     voucherClass: !this.commonService.checkNullOrUndefined(record) ? record.voucherClass : null
  //   })
  // }



  // emitColumnChanges(data) {
  //   this.tableData = data.data;
  //   if (data.column == 'adjustmentAmount') {
  //     //this.loopTableData(data);
  //     this.checkAjectAmount(true)
  //   }
  //   if (data.column == 'checkAll') {
  //     //this.getDiscount(data);
  //   }

  // }

  materialChange() {
    const obj = this.mmasterList.some((m: any) => m.id == this.formData1.value.materialCode);
    if (!obj) {
      this.formData1.patchValue({
        materialCode: ''
      })
    }
  }


  back() {
    this.router.navigate(['dashboard/transaction/bom'])
  }

  // checkAjectAmount(flag = false) {

  //   return true;
  // }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData);
    if (this.tableData.length == 0) {
      return;
    }
    this.savebom();
  }

  // return() {
  //   const addCashBank = String.Join('/', this.apiConfigService.returnBOM, this.routeEdit);
  //   this.apiService.apiGetRequest(addCashBank).subscribe(
  //     response => {
  //       const res = response;
  //       if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //         if (!this.commonService.checkNullOrUndefined(res.response)) {
  //           this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
  //         }
  //         this.spinner.hide();
  //       }
  //     });
  // }

  reset() {

    this.tableData = null;
    this.tableComponent.defaultValues();
    this.formData.reset();
    this.formData1.reset();
    // this.formData.controls['material'].disable();
    this.sendDynTableData = { type: 'reset', data: this.tableData };
  }


  savebom() {
    //this.formData.controls['bomnumber'].enable();
    //this.formData.controls['material'].enable();

    const addbom = String.Join('/', this.apiConfigService.addBOM);
    const requestObj = { bomHdr: this.formData.value, bomDtl: this.tableData };
    this.apiService.apiPostRequest(addbom, requestObj).subscribe(
      response => {
        const res = response;
        this.tableData = [];
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('BOM created Successfully..', Static.Close, SnackBar.success);
            this.router.navigate(['dashboard/transaction/bom'])
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }
}
