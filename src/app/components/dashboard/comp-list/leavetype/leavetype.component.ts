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
import { TranslatePipe } from '@ngx-translate/core';
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

@Component({
  selector: 'app-leavetype',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './leavetype.component.html',
  styleUrls: ['./leavetype.component.scss']
})
export class LeavetypeComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  // apiConfigService: any;
  // apiService: any;
  companyList: any;


  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LeavetypeComponent>,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      leaveCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      companyCode: [null],
      companyName: [null],
      id: 0,
      leaveMinLimit: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(1), Validators.maxLength(4)]],
      leaveMaxLimit: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(1), Validators.maxLength(4)]],
      leaveName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(2), Validators.maxLength(40)]],

    });

    //leaveCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
    //leaveName: ['', [Validators.required, Validators.minLength(2)]],
    //leaveMaxLimit: [null],
    //ext1: [null],
    //leaveMinLimit: [null],
    //companyCode: [null],
    //active: [null],
    //addDate: [null],
    //branchCode: [null],
    //remarks: [null],
    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    this.getCompanyData();
  }


 
  get formControls() { return this.modelFormData.controls; }

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
  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    
  }

  cancel() {
    this.dialogRef.close();
  }

}
