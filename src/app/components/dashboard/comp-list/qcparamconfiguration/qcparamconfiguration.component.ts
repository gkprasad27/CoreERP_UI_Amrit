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

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-qcparamconfiguration',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './qcparamconfiguration.component.html',
  styleUrls: ['./qcparamconfiguration.component.scss']
})
export class QcparamconfigurationComponent {

  modelFormData: FormGroup;
  formData: any;

  Type: Type[] =
    [
      { value: 'Balancing', viewValue: 'Balancing' },
      { value: 'Inspection', viewValue: 'Inspection' },
      { value: 'Instruments', viewValue: 'Instruments' },
    ];
  ProductType: Type[] =
    [
      { value: 'Pulley', viewValue: 'Pulley' },
      { value: 'Taperlock Bush', viewValue: 'Taperlock Bush' },
      { value: 'Adapter', viewValue: 'Adapter' },
      { value: 'Coupling', viewValue: 'Coupling' },
      { value: 'Belts', viewValue: 'Belts' },
      { value: 'Forgings', viewValue: 'Forgings' },
      { value: 'Castings', viewValue: 'Castings' },
      { value: 'Flanges', viewValue: 'Flanges' },
      { value: 'Plates', viewValue: 'Plates' },
      { value: 'ISA', viewValue: 'ISA' },
      { value: 'ISMC', viewValue: 'ISMC' },
      { value: 'ISF', viewValue: 'ISF' },
      { value: 'ISB', viewValue: 'ISB' },
      { value: 'RUBBERS', viewValue: 'RUBBERS' },
      { value: 'SMLS PIPES', viewValue: 'SMLS PIPES' },
    ];
  constructor(public commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<QcparamconfigurationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: [0],
      paramName : [null, Validators.required],
      sortOrder  : [null],
      product : [null],
      type: [null, Validators.required]
    });


    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['id'].disable();
    }

  }

  ngOnInit() {
  }


  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['id'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['id'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
