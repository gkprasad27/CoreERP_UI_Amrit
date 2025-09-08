import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';

@Component({
    selector: 'app-lotwisematerial',
    imports: [CommonModule, ReactiveFormsModule, TypeaheadModule, NonEditableDatepicker, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './lotwisematerial.component.html',
    styleUrls: ['./lotwisematerial.component.scss']
})
export class LotwisematerialComponent {

    modelFormData: FormGroup;

    formData: any;

    materialList: any[] = [];
    bpaList: any[] = [];

    plantsList: any;
    porangeList: any;
    porderList: any;
    lotList: any;
    matypeList: any;
    constructor(public commonService: CommonService,
        private addOrEditService: AddOrEditService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<LotwisematerialComponent>,
        private spinner: NgxSpinnerService,
        private apiConfigService: ApiConfigService,
        private apiService: ApiService,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

        this.modelFormData = this.formBuilder.group({
            id: [''],
            materialcode: [''],
            receivedQty: [''],
            rejectedQty: [''],
            invoiceNo: [''],
            vendor: [''],
            receivedDate: [''],
            amount: [''],
        });


        this.formData = { ...data };
        if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
            this.modelFormData.patchValue(this.formData.item);
        }

    }

    ngOnInit() {
        this.allApis();
    }


    allApis() {
        let obj = JSON.parse(localStorage.getItem("user"));
        const getmaterialdata = String.Join('/', this.apiConfigService.getmaterialdata, obj.companyCode);
        const getBusienessPartnersAccList = String.Join('/', this.apiConfigService.getBusienessPartnersAccList, obj.companyCode);

        // Use forkJoin to run both APIs in parallel
        import('rxjs').then(rxjs => {
            rxjs.forkJoin([
                this.apiService.apiGetRequest(getmaterialdata),
                this.apiService.apiGetRequest(getBusienessPartnersAccList),

            ]).subscribe(([materialdata, busienessPartnersAccList]) => {
                this.spinner.hide();

                if (!this.commonService.checkNullOrUndefined(materialdata) && materialdata.status === StatusCodes.pass) {
                    if (!this.commonService.checkNullOrUndefined(materialdata.response)) {
                        this.materialList = materialdata.response['mmasterList'];
                    }
                }
                if (!this.commonService.checkNullOrUndefined(busienessPartnersAccList) && busienessPartnersAccList.status === StatusCodes.pass) {
                    if (!this.commonService.checkNullOrUndefined(busienessPartnersAccList.response)) {
                        const resp = busienessPartnersAccList.response['bpaList'];
                        const data = resp.length && resp.filter((t: any) => t.bpTypeName == 'Vendor');
                        this.bpaList = data;
                    }
                }

            });
        });
    }

    get formControls() { return this.modelFormData.controls; }

    save() {
        if (this.modelFormData.invalid) {
            return;
        }
        this.formData.item = this.modelFormData.value;
        this.addOrEditService[this.formData.action](this.formData, (res) => {
            this.dialogRef.close(this.formData);
        });
        if (this.formData.action == 'Edit') {
            // this.modelFormData.controls['lotSeries'].disable();
        }
    }

    cancel() {
        this.dialogRef.close();
    }

}
