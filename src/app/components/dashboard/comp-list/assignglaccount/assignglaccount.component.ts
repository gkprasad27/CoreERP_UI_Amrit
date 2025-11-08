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
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';


interface Nature {
  value: string;
  Description: string;
}

@Component({
  selector: 'app-assignglaccount',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './assignglaccount.component.html',
  styleUrls: ['./assignglaccount.component.scss']
})

export class AssignGLaccounttoSubGroupComponent implements OnInit {

    nature: Nature[] =
    [
      { value: 'Plus Balance', Description: 'Plus Balance' },
      { value: 'Minus Balance', Description: 'Minus Balance' },
      { value: 'Both Balance', Description: 'Both Balance' }
    ];

  modelFormData: FormGroup;
  formData: any;
  glAccgrpList: any;
  subaccList: any;
  glList: any;
  structkeyList: any;
  fromGlList = [];
  companyList: any[] = [];
  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AssignGLaccounttoSubGroupComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: [null],
      compCode: [null, Validators.required],
      glgroup: [null],
      subAccount: [null],
      fromGl: [null],
      toGl: [null],
      nature: [null],
       ext1:[null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        fromGl: [this.formData.item['fromGl']]
      });
      this.modelFormData.controls['compCode'].disable();
    }
  }

  ngOnInit() {
    this.geStructurekeyData();
    this.getcompaniesList();
  }

  clearDropdown(contrl) {
    this.modelFormData.patchValue({
      [contrl]: null
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
          this.getSubacclist();
        });
  }

  
  getSubacclist() {
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('glgroup').value)) {
      const getAccountNamelist = String.Join('/', this.apiConfigService.subgrouplist, this.modelFormData.get('glgroup').value);
      this.apiService.apiGetRequest(getAccountNamelist)
        .subscribe(
          response => {
            this.spinner.hide();
            const res = response;
            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                this.subaccList = res.response['GetAccountNamelist'];
              }
            }
            this.getGLaccData();
          });
    } else {
      this.getGLaccData();
    }
  }

  getGLaccData() {
    const getdptcnUrl = String.Join('/', this.apiConfigService.getGLAccountListbyCatetory);
    this.apiService.apiGetRequest(getdptcnUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.glList = this.filterGlList(res.response['glList']);
            }
          }
          this.getglAccgrpList();
        });
  }


  // Check data with grid and listdata(Filter combobox data)
  filterGlList(glArray) {
    let glList = [];
    for (let g = 0; g < glArray.length; g++) {
      if (this.formData.tableData && !this.formData.tableData.filter(res => res.fromGl == glArray[g]['id']).length) {
        glList.push(glArray[g]);
      };
      if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
        if (this.formData.item['fromGl'] == glArray[g]['id']) {
          glList.push(glArray[g]);
        }
      }
    }
    return glList;
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
              if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
                this.onGroupChange();
              }
            }
          }
          this.spinner.hide();
        });
  }

   getcompaniesList() {
    const getcompanyList = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(getcompanyList)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.spinner.hide();
        });
  }
  onGroupChange() {
    this.fromGlList = [];
    if (this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue({
        fromGl: null
      });
    }
    let glGrp = this.glAccgrpList.find(res => res.groupName == this.modelFormData.get('glgroup').value)
    this.fromGlList = this.glList.filter(res => res.accGroup == glGrp.groupCode)
  }





  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['compCode'].enable();

    let array = [];
    this.formData.item = { ...this.modelFormData.value };
    this.formData.item.fromGl.forEach((res) => {
      this.formData.item['fromGl'] = res;
      array.push({ ...this.formData.item });
    })
    this.formData.item = { "GLS": array };
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
