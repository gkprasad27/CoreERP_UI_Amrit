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
import { AddOrEditService } from '../add-or-edit.service';

interface formulaType {
  value: string;
  viewValue: string;
}

interface operatorType {
  value: string;
  viewValue: string;
}

interface formula {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-formulas',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.scss']
})

export class FormulasComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;

  formulaType: formulaType[] =
    [
      { value: 'Scheduling', viewValue: 'Scheduling' },
      { value: 'Capacity', viewValue: 'Capacity' },
      { value: 'Cost calculation', viewValue: 'Cost calculation' }
    ];

  operatorType: operatorType[] =
    [
      { value: '+', viewValue: '+' },
      { value: '*', viewValue: '*' },
      { value: '-', viewValue: '-' },
      { value: '/', viewValue: '/' },
      { value: '(', viewValue: '(' },
      { value: ')', viewValue: ')' }

    ];

  formula: formula[] =
    [
      { value: 'Activity Quantity Per Unit', viewValue: 'Activity Quantity Per Unit' },
      { value: 'Operation Quantity', viewValue: 'Operation Quantity' },
      { value: 'Base Quantity', viewValue: 'Base Quantity' },
      { value: 'Spilt (Operation)', viewValue: 'Spilt (Operation)' },
      { value: 'Resource Output', viewValue: 'Resource Output' },
      { value: 'Base Output', viewValue: 'Base Output' },
      { value: 'Quantity to be Produced', viewValue: 'Quantity to be Produced' },
      { value: 'Actual Hours Worked', viewValue: 'Actual Hours Worked' },
      { value: 'Available Hours', viewValue: 'Available Hours' },
      { value: 'Down Time', viewValue: 'Down Time' },
      { value: 'Break Time', viewValue: 'Break Time' },
      { value: 'Actual Rate Of Production', viewValue: 'Actual Rate Of Production' },
      { value: 'Standard Rate Of Production', viewValue: 'Standard Rate Of Production' }
    ];

  constructor(private commonService: CommonService,
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormulasComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      formulaKey: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      formulaType: [null],
      formula: [''],
      formulaBar: [''],
      operatorType: ['']
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['formulaKey'].disable();
    }
  }

  ngOnInit() {
    this.modelFormData.controls['formulaBar'].disable();
  }

  get formControls() { return this.modelFormData.controls; }

  contactFormula(event) {
    this.modelFormData.patchValue({
      formulaBar: this.modelFormData.get('formulaBar').value + (!this.commonService.checkNullOrUndefined(event.value) ? event.value : '')
    })
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['formulaKey'].enable();
    this.modelFormData.controls['formulaBar'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['formulaKey'].disable();
      this.modelFormData.controls['formulaBar'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
