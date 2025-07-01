import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-save-item',
  imports: [ CommonModule, TranslatePipe, TranslateModule, MatDividerModule ],
  templateUrl: './save-item.component.html',
  styleUrls: ['./save-item.component.scss']
})
export class SaveItemComponent {

  saveData: any;
  tableUrl: any;

  constructor(
    public dialogRef: MatDialogRef<SaveItemComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.saveData = { ...data };
  }

  doAction() {
    this.dialogRef.close('save');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
