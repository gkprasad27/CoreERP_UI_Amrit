import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jobworkmaterialreceiving',
  templateUrl: './jobworkmaterialreceiving.component.html',
  styleUrls: ['./jobworkmaterialreceiving.component.scss']
})
export class JobworkmaterialreceivingComponent {

  formData: FormGroup;
  formData1: FormGroup;
  routeEdit = '';

  tableData = [];
  materialCodeList = [];
  perChaseOrderList = [];


  dynTableProps: any;
  sendDynTableData: any;
  grnDate: any;
  // header props
  porderList = [];
  companyList = [];
  plantList = [];
  branchList = [];
  profitCenterList = [];
  employeesList = [];
  movementList = [];
  stlocList = [];
  materialList = [];
  getJobworkListData: any;
  podetailsList: any;
  bpaList: any;

  fileList: any;
  fileList1: any;
  // url: string;
  // url1: string;


  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private httpClient: HttpClient,
    public commonService: CommonService,
    public route: ActivatedRoute,
    private router: Router) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit(): void {
    this.formDataGroup();
    this.getpurchaseOrderTypeData();
  }
  approveOrReject(event) {
    if (event) {
      this.formData.patchValue({
        qualityCheck: "Accpt",
        reject: null
      });
    } else {
      this.formData.patchValue({
        qualityCheck: null,
        reject: "Reject"
      });
    }
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      companyName: [null],
      profitCenter: [null, Validators.required],
      jobWorkNumber: [null, Validators.required],

      vendor: [null],
      VendorGSTN: [null],
      receivedDate: [null, Validators.required],
      vehicleNo: [null, Validators.required],
      receivedBy: [null, Validators.required],
      lotNo: ['', Validators.required],
      totalAmount: [''],
      invoiceNumber: [''],

      id: 0,

      documentURL: [''],
      invoiceURL: [''],

      addWho: [null],
      addDate: [null],
      editWho: [null],
      editDate: [null],

    });


    this.formData1 = this.formBuilder.group({
      rejectQty: [''],
      receivedQty: ['', Validators.required],
      materialCode: ['', Validators.required],
      materialName: [''],
      weight: [''],
      purchaseOrderNumber: [''],
      description: [''],
      heatNumber: [''],
      qty: [''],
      pendingQty: [''],
      id: [0],
      highlight: false,
      type: [''],
      action: 'editDelete',
      index: 0
    });
  }


  resetForm() {
    this.formData1.reset();
    this.formData1.patchValue({
      index: 0,
      id: 0,
      action: 'editDelete'
    });
  }

  // companyChange() {
  //   const obj = this.companyList.find((c: any) => c.id == this.formData.value.company);
  //   this.formData.patchValue({
  //     companyName: obj.text
  //   })
  // }

  // profitChange() {
  //   const obj = this.profitCenterList.find((c: any) => c.code == this.formData.value.profitCenter);
  //   this.formData.patchValue({
  //     profitcenterName: obj.text
  //   })
  // }

  saveForm() {
    if (this.formData1.invalid) {
      return;
    }
    this.formData1.patchValue({
      type: '',
      highlight: true
    })
    let data: any = this.tableData;
    data = (data && data.length) ? data : [];
    let qtyT = 0
    data.forEach((t: any) => {
      if (t.materialCode == this.formData1.value.materialCode) {
        qtyT = qtyT + (this.formData1.value.index == t.index ? ((+this.formData1.value.receivedQty) + (+this.formData1.value.rejectQty)) : ((+t.receivedQty) + (+t.rejectQty)))
      }
    })
    // const remainigQ = this.formData1.value.qty - qtyT;
    if (this.formData1.value.qty < qtyT) {
      this.alertService.openSnackBar("You can't recevie more Quantity", Static.Close, SnackBar.error);
      return;
    }
    this.tableData = null;
    this.tableComponent.defaultValues();
    if (this.formData1.value.index == 0) {
      this.formData1.patchValue({
        index: data ? (data.length + 1) : 1
      });
      data = [this.formData1.value, ...data];
    } else {
      data = data.map((res: any) => res = res.index == this.formData1.value.index ? this.formData1.value : res);
    }
    setTimeout(() => {
      this.tableData = data;
    });
    this.resetForm();
  }

  editOrDeleteEvent(value) {
    if (value.action === 'Delete') {
      this.tableComponent.defaultValues();
      this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
    } else {
      this.formData1.patchValue(value.item);
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

  downLoadFile1(event: any) {
    const url = String.Join('/', this.apiConfigService.getFile, event.name);
    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          window.open(response.response, '_blank');
        });
  }

  tablePropsFunc() {
    return {
      tableData: {
        checkAll:
        {
          value: false, type: 'checkbox'
        },

        materialCode: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.materialList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        description: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
        },
        poqty: {
          value: null, type: 'number', width: 75, maxLength: 15, disabled: true,
        },
        receivedQty: {
          value: null, type: 'number', width: 75, maxLength: 15, disabled: true, fieldEnable: true
        },
        plant: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.plantList, id: 'plantCode', text: 'plantname', displayMul: true, width: 100
        },
        storageLocation: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.stlocList, id: 'code', text: 'name', displayMul: true, width: 100
        },
        profitCenter: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.profitCenterList, id: 'code', text: 'description', displayMul: true, width: 100
        },
        project: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
        },
        branch: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          //value: null, type: 'dropdown', list: this.branchList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        movementType: {
          value: null, type: 'text', width: 75, maxLength: 15, disabled: true,
          // value: null, type: 'dropdown', list: this.movementList, id: 'code', text: 'description', displayMul: true, width: 100, 
        },
        lotNo: {
          value: null, type: 'number', width: 100, maxLength: 50, fieldEnable: true
        },
        lotDate: {
          value: null, type: 'datepicker', width: 100, fieldEnable: true
        },
        delete: {
          type: 'delete', width: 10
        }
      },

      formControl: {
        materialCode: [null, [Validators.required]],
      }
    };
  }

  grndatechange() {
    if (this.tableData.length) {
      this.tableData.map(resp => resp.lotDate.value === this.formData.get('grndate').value)
      // this.sendDynTableData = { type: 'add', data: this.tableData };
    }
  }

  ponoselect() {

    const getJobWorkDetailsUrl = String.Join('/', this.apiConfigService.getJobWorkDetails, this.formData.value.jobWorkNumber);
    this.apiService.apiGetRequest(getJobWorkDetailsUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          if (response && response.response.JWDList && response.response.JWDList.length) {
            response.response.JWDList.forEach((d: any, index: number) => {
              d.action = '',
                d.index = index + 1
            })
            this.materialCodeList = response.response.JWDList;
            this.formData1.patchValue({
              qty: '',
              weight: '',
            })
            this.tableData = null;
          }
          const obj = this.getJobworkListData.find(resp => resp.id == this.formData.get('jobWorkNumber').value);
          this.formData.patchValue({
            vendor: obj.text,
            vendorGSTN: obj.gstNo
          })

        })

  }

  materialCodeChange() {
    const obj = this.materialCodeList.find((p: any) => p.materialCode == this.formData1.value.materialCode);
    let pendingQty = 0;
    this.tableData && this.tableData.forEach((t: any) => {
      if (t.materialCode == this.formData1.value.materialCode) {
        pendingQty = pendingQty + t.receivedQty
      }
    })
    this.formData1.patchValue({
      qty: obj ? obj.qty : '',
      weight: obj ? obj.weight : '',
      materialName: obj ? obj.materialName : '',
      pendingQty: obj.qty - pendingQty
    })
  }

  getpurchaseOrderTypeData() {
    const getpurchaseOrderTypeUrl = String.Join('/', this.apiConfigService.getpurchaseOrderTypeList);
    this.apiService.apiGetRequest(getpurchaseOrderTypeUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.porderList = res.response['porderList'];
            }
          }
          this.getCompanyList();
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
            }
          }
          this.getpodetailsList();
        });
  }
  getpodetailsList() {
    const getpodetailsListUrl = String.Join('/', this.apiConfigService.getpodetailsList);
    this.apiService.apiGetRequest(getpodetailsListUrl)
      .subscribe(
        response => {
          const res = response;
          console.log(res);
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.podetailsList = res.response['podetailsList'];
            }
          }
          this.getJobworkList();
        });
  }
  getJobworkList() {
    const poUrl = String.Join('/', this.apiConfigService.getJobworkList);
    this.apiService.apiGetRequest(poUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getJobworkListData = res.response['JobWorkList'];
            }
          }
          this.getProfitcenterData();
        });
  }
  // getsuppliercodeList() {
  //   const getsuppliercodeList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList);
  //   this.apiService.apiGetRequest(getsuppliercodeList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         console.log(res);
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.bpaList = res.response['bpaList'];
  //             this.bpaList = res.response['bpaList'].filter(resp => resp.bpTypeName == 'Vendor')

  //           }
  //         }
  //         this.getplantList();
  //       });
  // }

  // getplantList() {
  //   const getplantList = String.Join('/', this.apiConfigService.getplantList);
  //   this.apiService.apiGetRequest(getplantList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.plantList = res.response['plantList'];
  //           }
  //         }
  //         this.getBranchList();
  //       });
  // }

  // getBranchList() {
  //   const branchUrl = String.Join('/', this.apiConfigService.getBranchList);
  //   this.apiService.apiGetRequest(branchUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.branchList = res.response['branchsList'];
  //           }
  //         }
  //         this.getProfitcenterData();
  //       });
  // }

  getProfitcenterData() {
    const getpcUrl = String.Join('/', this.apiConfigService.getProfitCentersList);
    this.apiService.apiGetRequest(getpcUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }
          this.getEmployeesList()
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
          if (this.routeEdit != '') {
            this.getJWReceiptDetail(this.routeEdit);
          }
          // this.getmaterialData();
        });
  }


  // getMomentTypeList() {
  //   const MomentTypeList = String.Join('/', this.apiConfigService.getmomenttypeList);
  //   this.apiService.apiGetRequest(MomentTypeList)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.movementList = res.response['movementList'];
  //           }
  //         }
  //         this.getstorageLocationData();
  //       });
  // }

  // getstorageLocationData() {
  //   const getstorageUrl = String.Join('/', this.apiConfigService.getStList);
  //   this.apiService.apiGetRequest(getstorageUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
  //           if (!this.commonService.checkNullOrUndefined(res.response)) {
  //             this.stlocList = res.response['stlocList'];
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
          // this.dynTableProps = this.tablePropsFunc();
          // if (this.routeEdit != '') {
          //   this.getJWReceiptDetail(this.routeEdit);
          // }
        });
  }

  getJWReceiptDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getJWReceiptDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.formData.patchValue(res.response['jwMasterlist']);
              if(this.formData.value.receivedBy) {
                this.formData.patchValue({
                  receivedBy: this.employeesList.find((e: any) => e.id == this.formData.value.receivedBy).text
                  // jobWorkNumber: +res.response['jwMasterlist'].jobWorkNumber
                })
              }
              // if (this.formData.value.documentURL) {
              //   this.downLoad(this.formData.value.documentURL, 'document');
              // }
              // if (this.formData.value.invoiceURL) {
              //   this.downLoad(this.formData.value.invoiceURL, 'invoice');
              // }
              this.perChaseOrderList = []
              res.response['jwDetail'].forEach((d: any, index: number) => {
                const obj = {
                  materialCode: d.materialCode ? d.materialCode : '',
                  materialName: d.materialName ? d.materialName : '',
                  weight: d.weight ? d.weight : '',
                  // pendingQty: (d.qty - d.receivedQty),
                  purchaseOrderNumber: d.purchaseOrderNumber ? d.purchaseOrderNumber : '',
                  rejectQty: d.rejectQty ? d.rejectQty : '',
                  qty: d.qty ? d.qty : '',
                  lotNo: d.lotNo ? d.lotNo : '',
                  documentURL: d.documentURL ? d.documentURL : '',
                  invoiceURL: d.invoiceURL ? d.invoiceURL : '',
                  supplierReferenceNo: d.supplierReferenceNo ? d.supplierReferenceNo : '',
                  supplierRefno: d.supplierRefno ? d.supplierRefno : '',
                  receivedDate: d.receivedDate ? d.receivedDate : '',
                  receivedQty: d.receivedQty ? d.receivedQty : '',
                  description: d.description ? d.description : '',
                  heatNumber: d.heatNumber ? d.heatNumber : '',
                  type: 'edit',
                  // action: 'editDelete',
                  index: index + 1
                }
                this.perChaseOrderList.push(obj)
              })
              this.tableData = this.perChaseOrderList;
              // const arr = this.podetailsList.filter(resp => !this.perChaseOrderList.some((p: any) => p.materialCode == resp.materialCode));
              // const unique = [...new Set(arr.map(item => item.materialCode))];
              // this.materialCodeList = this.podetailsList;
              this.materialCodeList = this.podetailsList.filter(resp => resp.purchaseOrderNumber == this.formData.get('jobWorkNumber').value);
              this.formData.controls.jobWorkNumber.disable();
              this.formData.controls.company.disable();
              this.formData.controls.vendor.disable();
              this.formData.controls.profitCenter.disable();
              this.tableData && this.tableData.forEach((t: any) => {
                let pendingQty = 0;
                const obj = this.materialCodeList.find((p: any) => p.materialCode == t.materialCode);
                if (obj) {
                  pendingQty = pendingQty + t.receivedQty
                  pendingQty = obj.qty - pendingQty

                  if (pendingQty == 0) {
                    this.materialCodeList = this.materialCodeList.filter((p: any) => p.materialCode != t.materialCode);
                  }
                }
              })
            }
          }
        });
  }
  getLotNumData(row) {

    const getlotnos = String.Join('/', this.apiConfigService.gettinglotNumbers, row.data[row.index].materialCode.value);
    this.apiService.apiGetRequest(getlotnos)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              row.data[row.index].lotNo.value = res.response['lotNum']
              //row.data[row.index].lotDate.value =JSON.stringify(this.grnDate);
              // this.sendDynTableData = { type: 'add', data: row.data };
              // this.tableData = row.data;
            }
          }
          //this.spinner.hide();
        });

  }

  emitColumnChanges(data) {
    this.tableData = data.data;
    if (data.column == 'checkAll') {
      if (data.data[data.index].checkAll.value) {
        this.getLotNumData(data);
      }

    }

  }



  back() {
    this.router.navigate(['dashboard/transaction/jobworkmaterialreceiving'])
  }

  save() {
    // this.tableData = this.commonService.formatTableData(this.tableData, 0);
    if (this.tableData.length == 0 && this.formData.invalid) {
      return;
    }
    this.addJWReceipt();
  }

  addJWReceipt() {
    this.formData.controls.jobWorkNumber.enable();
    this.formData.controls.company.enable();
    this.formData.controls.vendor.enable();
    this.formData.controls.profitCenter.enable();
    const arr = this.tableData.filter((d: any) => !d.type);
    const addJWReceipt = String.Join('/', this.apiConfigService.addJWReceipt);
    const formData = this.formData.value;
    formData.receivedDate = this.formData.get('receivedDate').value ? this.datepipe.transform(this.formData.get('receivedDate').value, 'MM-dd-yyyy') : '';
    formData.documentURL = this.fileList ? this.fileList.name.split('.')[0] : '';
    formData.invoiceURL = this.fileList1 ? this.fileList1.name.split('.')[0] : '';
    if(this.formData.value.receivedBy) {
      formData.receivedBy = this.employeesList.find((e: any) => e.text == this.formData.value.receivedBy).id;
    }
    const requestObj = { grHdr: formData, grDtl: arr };
    this.apiService.apiPostRequest(addJWReceipt, requestObj).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (this.fileList) {
              this.uploadFile();
            } else {
              this.router.navigateByUrl('dashboard/transaction/jobworkmaterialreceiving');
            }
            this.alertService.openSnackBar('Goods Receipt created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
        }
      });
  }

  emitFilesList(event: any) {
    this.fileList = event[0];
  }
  emitFilesList1(event: any) {
    this.fileList1 = event[0];
  }

  uploadFile() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList.name.split('.')[0]);
    const formData = new FormData();
    formData.append("file", this.fileList);

    return this.httpClient.post<any>(addsq, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
        if (this.fileList1) {
          this.uploadFile1();
        } else {
          this.router.navigateByUrl('dashboard/transaction/jobworkmaterialreceiving');
        }
      });
  }

  uploadFile1() {
    const addsq = String.Join('/', this.apiConfigService.uploadFile, this.fileList1.name.split('.')[0]);
    const formData = new FormData();
    formData.append("file", this.fileList1);

    return this.httpClient.post<any>(addsq, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Quotation Supplier created Successfully..', Static.Close, SnackBar.success);
          }
        }
        this.router.navigateByUrl('dashboard/transaction/jobworkmaterialreceiving');
      });
  }

  // downLoad(id: any, flag: string) {
  //   const url = String.Join('/', this.apiConfigService.getFile, id);
  //   this.apiService.apiGetRequest(url)
  //     .subscribe(
  //       response => {
  //         this.spinner.hide();
  //         if (flag == 'document') {
  //           this.url = response.response;
  //         } else {
  //           this.url1 = response.response;
  //         }
  //       });
  // }


  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returngoodsreceipt, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    // this.sendDynTableData = { type: 'reset', data: this.tableData };
  }

}
