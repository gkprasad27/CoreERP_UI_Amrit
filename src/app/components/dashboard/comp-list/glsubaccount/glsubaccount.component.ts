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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-glsubaccount',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatAutocompleteModule ],
  templateUrl: './glsubaccount.component.html',
  styleUrls: ['./glsubaccount.component.scss']
})

export class GLSubAccountComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glList: any;
  filteredGlList: any[] = [];
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GLSubAccountComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: ['0'],
      glsubCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      glsubName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      glaccount: [null]

    });


    this.formData = { ...data };

  }

  ngOnInit() {
    this.getGLAccountData();
    this.modelFormData.get('glaccount')?.valueChanges.subscribe(value => {
      this.filterGlList(value);
    });
  }

  patchFormData() {
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['glsubCode'].disable();
    }
  }
  getGLAccountData() {
    const getGLAccountUrl = String.Join('/', this.apiConfigService.getGLAccountList);
    this.apiService.apiGetRequest(getGLAccountUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = res.response['glList'];
              this.patchFormData();
            }
          }
        });
  }

  filterGlList(value: any) {
    if (!value || value.trim() === '') {
      this.filteredGlList = [];
      return;
    }
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    this.filteredGlList = this.glList.filter((item: any) =>
      item.accountNumber.toLowerCase().includes(filterValue) ||
      item.glaccountName.toLowerCase().includes(filterValue)
    );
  }

  onGlClick(autocomplete: any) {
    if (this.modelFormData.get('glaccount')?.value === '' || !this.modelFormData.get('glaccount')?.value) {
      this.filteredGlList = this.glList;
    }
    autocomplete.openPanel();
  }

  get formControls() { return this.modelFormData.controls; }

  displayGl = (value: any) => {
    if (!value || !this.glList) {
      return '';
    }
    const item = this.glList.find((gl: any) => gl.accountNumber === value);
    return item ? `${item.accountNumber} - ${item.glaccountName}` : value;
  };

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['glsubCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['glsubCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
