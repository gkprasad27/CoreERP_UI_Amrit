import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
import { AddOrEditService } from '../add-or-edit.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonEditableDatepicker } from '../../../../directives/format-datepicker';

@Component({
  selector: 'app-offerletter',
  imports: [ CommonModule, ReactiveFormsModule, NonEditableDatepicker, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule ],
  templateUrl: './offerletter.component.html',
  styleUrl: './offerletter.component.scss',
  providers: [DatePipe]
})
export class OfferletterComponent {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;

  statusList: any[] = ['1st Round', '2nd Round', 'Screening', 'HR Round', 'Manager Round', 'System Test', 'Written Test', 'Selected', 'On Hold', 'Rejected'];
  jobTypeList: any[] = ['Permanent', 'PartTime', 'Daily vaiges', 'Contrat'];

  constructor(public commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    public dialogRef: MatDialogRef<OfferletterComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      empCode: [null, [Validators.required]],
      role: [''],
      jobType: [''],
      reporting: [''],
      empName: [''],
      designation: [''],
      cTC: [''],
      offerValid: [''],
      effectiveFrom: [''],
      status: [''],
      remarks: [''],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['empCode'].disable();
    }
  }
  
  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    // this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.getRawValue();
    this.formData.item.offerValid = this.formData.item.offerValid ? this.datepipe.transform(this.formData.item.offerValid, 'MM-dd-yyyy') : '';
    this.formData.item.effectiveFrom = this.formData.item.effectiveFrom ? this.datepipe.transform(this.formData.item.effectiveFrom, 'MM-dd-yyyy') : '';

    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
