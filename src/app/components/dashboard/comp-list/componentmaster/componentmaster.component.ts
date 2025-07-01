import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../services/alert.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';


interface specificMonth {
  value: string;
  viewValue: string;
}
interface duration {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-componentmaster',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './componentmaster.component.html',
  styleUrls: ['./componentmaster.component.scss']
})

export class ComponentMasterComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  configureList: any;
  companyList: any;

  duration: duration[] =
    [
      { value: 'Quarterly ', viewValue: 'Quarterly ' },
      { value: 'Half-Yearly ', viewValue: 'Half-Yearly ' },
      { value: 'Annually', viewValue: 'Annually' }
    ];

  months: specificMonth[] =
    [
      { value: 'January', viewValue: 'January' },
      { value: 'February', viewValue: 'February' },
      { value: 'March', viewValue: 'March' },
      { value: 'April', viewValue: 'April' },
      { value: 'May', viewValue: 'May' },
      { value: 'June', viewValue: 'June' },
      { value: 'July', viewValue: 'July' },
      { value: 'August', viewValue: 'August' },
      { value: 'September', viewValue: 'September' },
      { value: 'Octomber', viewValue: 'Octomber' },
      { value: 'November', viewValue: 'November' },
      { value: 'December', viewValue: 'December' }

    ];
  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ComponentMasterComponent>,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      componentCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      componentName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      componentType: [null],
      active: [null],
      remarks: [null],
      companyCode: [null],
      amount: [null],
      percentage: [null],
      duration: [null],
      specificMonth: [null]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['componentCode'].disable();
    }

  }

  ngOnInit() {
    this.getConfigurationList();
    this.getCompanyData();
  }

  getCompanyData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getConfigurationList() {
    const getConfigurationList = String.Join('/', this.apiConfigService.getConfigurationList);
    this.apiService.apiGetRequest(getConfigurationList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.configureList = res.response['ConfigurationList'];
            }
          }
          this.spinner.hide();
        });
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['componentCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
