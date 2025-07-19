import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { String } from 'typescript-string-operations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { AlertService } from '../../../../../services/alert.service';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { Static } from '../../../../../enums/common/static';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '../../../../../reuse-components/table/table.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vendor-material-list',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, TableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './vendor-material-list.component.html',
  styleUrls: ['./vendor-material-list.component.scss']
})
export class VendorMaterialListComponent {

  tableData = [];

  constructor(public commonService: CommonService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    public route: ActivatedRoute,
    public router: Router,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<VendorMaterialListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.getVendorMaterialList();
  }

  getVendorMaterialList() {
    this.tableData = [];
    // You may need to update the API endpoint and params as per your backend
    // const url = String.Join('/', this.apiConfigService.getSourceSupplyDetailByMaterial, this.data.item.materialCode);
    const encodedMaterialCode = encodeURIComponent(this.data.item.materialCode);
    const url = [this.apiConfigService.getSourceSupplyDetailByMaterial, encodedMaterialCode].join('/');

    this.apiService.apiGetRequest(url)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.tableData = res.response.ssDetail || [];
            }
          }
        });
  }

  back() {
    this.dialogRef.close();
  }

  addOrUpdateEvent(value) {
    this.dialogRef.close(value);
  }

}
