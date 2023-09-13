import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-assignglaccount',
  templateUrl: './assignglaccount.component.html',
  styleUrls: ['./assignglaccount.component.scss']
})

export class AssignGLaccounttoSubGroupComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glAccgrpList: any;
  subaccList: any;
  glList: any;
  structkeyList: any;
  fromGlList = [];
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
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      glgroup: [null],
      subAccount: [null],
      fromGl: [null],
      toGl: [null]
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        fromGl: [this.formData.item['fromGl']]
      });
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.geStructurekeyData();
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
    this.modelFormData.controls['code'].enable();

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
