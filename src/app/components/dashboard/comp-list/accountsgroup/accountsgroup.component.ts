import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
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
import { AddOrEditService } from '../add-or-edit.service';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { ApiService } from '../../../../services/api.service';

interface groupType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-accountsgroup',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './accountsgroup.component.html',
  styleUrls: ['./accountsgroup.component.scss']
})

export class AccountsGroupComponent  implements OnInit {
  modelFormData: FormGroup;
  formData: any;

  groupTypes: groupType[] =
  [
    { value: '1', viewValue: 'Balance Sheet' },
    { value: '2', viewValue: 'Profit & Loss Account' },
    { value: '3', viewValue: 'PL Appropriation accounts' },
    { value: '4', viewValue: 'Costing Internal purpose' },
  ];
  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    private alertService: AlertService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AccountsGroupComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {
      this.modelFormData  =  this.formBuilder.group({
        groupCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        groupName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        numberRangeFrom: [null],
        numberRangeTo: [null],
        groupType: [null],
        active: [null]
      });
      this.formData = {...data};
      if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['groupCode'].disable();
      }
  }

  ngOnInit() {

  }

  validationcode() {
    if (!this.commonService.checkNullOrUndefined(this.modelFormData.get('numberRangeFrom').value) &&
      !this.commonService.checkNullOrUndefined(this.modelFormData.get('numberRangeTo').value) && 
      this.modelFormData.get('numberRangeFrom').value != ''
      && this.modelFormData.get('numberRangeTo').value != '') {
      if (parseInt(this.modelFormData.get('numberRangeTo').value) <= parseInt(this.modelFormData.get('numberRangeFrom').value)) {
        this.alertService.openSnackBar("Enter correct Value", Static.Close, SnackBar.error);
      }
    }
  }
  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['groupCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['groupCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
