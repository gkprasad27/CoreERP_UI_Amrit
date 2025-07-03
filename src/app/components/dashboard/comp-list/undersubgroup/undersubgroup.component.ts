import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { AddOrEditService } from '../add-or-edit.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-undersubgroup',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule ],
  templateUrl: './undersubgroup.component.html',
  styleUrls: ['./undersubgroup.component.scss']
})

export class UndersubGroupComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glAccgrpList: any;
  getAccSubGrpList: any;
  glAccNameList: any;

  structkeyList: any;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<UndersubGroupComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      accountGroupId: [null, [Validators.required]],
      accountGroupName: [null, [Validators.required]],
      nature: [null, [Validators.required]],
      narration: [null],
      affectGrossProfit: [null],
      groupUnder: [null],
      Undersubaccount: [null],
      isDefault: [false],
      note: [null],
      structureType: [null],
      structureKey: [null],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        isDefault: this.formData.item['isDefault'] == 1 ? true : false
      })
      this.modelFormData.controls['accountGroupId'].disable();
    }
    this.getGLUnderGroupList();
    this.getAccountNamelist();
    this.geStructurekeyData();
  }

  ngOnInit() {
    this.getglAccgrpList();
  }

  getglAccgrpList() {
    const getglAccgrpList = String.Join('/', this.apiConfigService.getglAccgrpList);
    this.apiService.apiGetRequest(getglAccgrpList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccgrpList = res.response['GLAccGroupList'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountNamelist() {
    this.glAccNameList = [];
    if (!this.formData.item) {
      this.modelFormData.patchValue({
        groupUnder: ''
      })
    }
    const getAccountNamelist = String.Join('/', this.apiConfigService.getAccountNamelist, this.modelFormData.get('nature').value);
    this.apiService.apiGetRequest(getAccountNamelist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccNameList = res.response['GetAccountNamelist'];
            }
          }
          this.spinner.hide();
        });
  }

  getGLUnderGroupList() {
    const getGLUnderGroupList = String.Join('/', this.apiConfigService.getGLUnderGroupList, this.modelFormData.get('groupUnder').value);
    this.apiService.apiGetRequest(getGLUnderGroupList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.getAccSubGrpList = res.response['GetAccountSubGrouplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountSubGrouplist() {
    const getAccountSubGrouplist = String.Join('/', this.apiConfigService.getAccountSubGrouplist,
      this.modelFormData.get('groupName').value);
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glAccNameList = res.response['GLAccSubGroupList'];
            }
          }
          this.spinner.hide();
        });
  }

  geStructurekeyData() {
    const geStructurekeynUrl = String.Join('/', this.apiConfigService.getStructurekeyList);
    this.apiService.apiGetRequest(geStructurekeynUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.structkeyList = res.response['structkeyList'];
            }
          }
        });
  }


  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['accountGroupId'].enable();
    this.modelFormData.patchValue({
      isDefault: this.modelFormData.get('isDefault').value ? 1 : 0
    })
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['accountGroupId'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
