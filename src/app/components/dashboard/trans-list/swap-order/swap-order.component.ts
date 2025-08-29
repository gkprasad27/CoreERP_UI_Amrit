import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TableComponent } from '../../../../reuse-components/table/table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-swap-order',
    imports: [CommonModule, TypeaheadModule, MatCardModule, ReactiveFormsModule, TranslateModule, MatButtonModule, MatSlideToggleModule, MatFormFieldModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, TableComponent],
    templateUrl: './swap-order.component.html',
    styleUrls: ['./swap-order.component.scss']
})
export class SwapOrderComponent {

    formData: FormGroup;
    formData1: FormGroup;

    saleOrders: any[] = [];
    getSaleOrderDetail: any;

    tableData = [];
    @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;


    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private apiConfigService: ApiConfigService,
        private commonService: CommonService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private alertService: AlertService
    ) {
        this.formData = this.fb.group({
            swapType: [true, Validators.required],
            fromSaleOrder: ['', Validators.required],
            toSaleOrder: ['', Validators.required],
        });

        this.formData1 = this.fb.group({
            qty: ['', Validators.required],
            checkQty: [''],
            id: [0],
            highlight: false,

            "saleOrderNo": [''],
            "status": [''],
            "materialCode": [''],
            "materialName": [''],
            "mainComponent": [''],
            "billable": [''],
            "bomKey": [''],

            changed: true,
            checkbox: [''],
            action: [[
                { id: 'Edit', type: 'edit' }
            ]],
            index: 0
        });
    }

    ngOnInit() {
        this.allApis();
    }

    allApis() {
        let obj = JSON.parse(localStorage.getItem("user"));
        const getSaleOrderList = String.Join('/', this.apiConfigService.getSaleOrderData, obj.companyCode);
        import('rxjs').then(rxjs => {
            rxjs.forkJoin([
                this.apiService.apiGetRequest(getSaleOrderList),
            ]).subscribe(([supplierRes]) => {
                this.spinner.hide();

                if (!this.commonService.checkNullOrUndefined(supplierRes) && supplierRes.status === StatusCodes.pass) {
                    if (!this.commonService.checkNullOrUndefined(supplierRes.response)) {
                        this.saleOrders = supplierRes.response['BPList']
                    }
                }

            });
        });
    }

    onSwapTypeChange() {
        if (this.formData.value.fromSaleOrder && this.formData.value.swapType === false) {
            if (this.tableComponent) {
                this.tableComponent.defaultValues();
            }
            this.tableData = [];
            this.resetForm();
            const getMenuUrl = String.Join('/', this.apiConfigService.getSaleOrderDetail, this.formData.value.fromSaleOrder);
            this.apiService.apiGetRequest(getMenuUrl)
                .subscribe(
                    response => {
                        this.spinner.hide();
                        const res = response;
                        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
                            if (!this.commonService.checkNullOrUndefined(res.response)) {
                                this.getSaleOrderDetail = res.response;
                                res.response['SaleOrderDetails'].forEach((s: any, index: number) => {
                                    s.action = [
                                        { id: 'Edit', type: 'edit' }
                                    ];
                                    s.checkQty = s.qty;
                                    s.checkbox = false;
                                    s.index = index + 1;
                                })
                                this.tableData = res.response['SaleOrderDetails'];
                            }
                        }
                    });
        }
    }


    editOrDeleteEvent(value) {
        if (value.action === 'Delete') {
            this.tableComponent.defaultValues();
            this.tableData = this.tableData.filter((res: any) => res.index != value.item.index);
        } else {
            this.formData1.patchValue(value.item);
        }
    }


    tableCheckboxEvent(event: any) {
        this.tableData.forEach((res: any) => res.checkbox = (event.item == 'All' ? event.flag.checked : ((res.index == event.item.index) ? event.flag.checked : res.checkbox)));
    }

    saveForm() {
        if (this.formData1.invalid) {
            return;
        }
        if (this.formData1.value.qty > this.formData1.value.checkQty) {
            this.alertService.openSnackBar('Quantity cannot be greater than original quantity', Static.Close,
                SnackBar.error);
            return;
        }
        this.formData1.patchValue({
            highlight: true,
            changed: true
        })
        let data: any = this.tableData;
        data = (data && data.length) ? data : [];
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

    resetForm() {
        this.formData1.reset();
        this.formData1.patchValue({
            index: 0,
            action: [
                { id: 'Edit', type: 'edit' },
            ],
            id: 0
        });
    }

    back() {
        this.router.navigate(['dashboard/transaction/swaporder'])
    }


    reset() {
        this.formData.reset();
    }

    swap() {
        if (this.formData.valid) {
            if (this.formData.value.fromSaleOrder === this.formData.value.toSaleOrder) {
                this.alertService.openSnackBar('From and To Sale Orders cannot be the same', Static.Close, SnackBar.error);
                return;
            }
            const obj = {
                description: 'Are you sure you want to swap the orders?'
            }
            this.commonService.deletePopup(obj, (flag: any) => {
                if (flag) {
                    const swapOrderUrl = String.Join('/', this.apiConfigService.swapOrder, this.formData.value.swapType ? 'Full' : 'Partial', this.formData.value.fromSaleOrder, this.formData.value.toSaleOrder);
                    const arr = this.tableData.filter((d: any) => d.checkbox);
                    const requestObj = { grHdr: this.formData.value.swapType ? {} : this.getSaleOrderDetail.SaleOrderMasters, grDtl: this.formData.value.swapType ? [] : arr };
                    this.apiService.apiPostRequest(swapOrderUrl, requestObj).subscribe(response => {
                        this.spinner.hide();
                        if (response.status === StatusCodes.pass) {
                            this.alertService.openSnackBar('Swap successful', Static.Close, SnackBar.success);
                            this.reset();
                        } else {
                            this.alertService.openSnackBar('Swap failed', Static.Close, SnackBar.error);
                        }
                    });
                }
            })
        }
    }

}
