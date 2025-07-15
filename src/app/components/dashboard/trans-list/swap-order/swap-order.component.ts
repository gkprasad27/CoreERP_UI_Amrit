import { Component } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-swap-order',
    imports: [CommonModule, MatSelectModule, MatCardModule, ReactiveFormsModule, TranslateModule, MatButtonModule],
    templateUrl: './swap-order.component.html',
    styleUrls: ['./swap-order.component.scss']
})
export class SwapOrderComponent {

    formData: FormGroup;

    saleOrders: any[] = [];

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
            fromSaleOrder: ['', Validators.required],
            toSaleOrder: ['', Validators.required],
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
                    this.apiService.apiPostRequest(this.apiConfigService.getSwapOrder, this.formData.value).subscribe(response => {
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
