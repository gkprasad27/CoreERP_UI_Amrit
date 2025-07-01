import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-item',
  imports: [ CommonModule, TranslatePipe, TranslateModule, MatDividerModule ],
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent  {

  deleteData: any;
  tableUrl: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteItemComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

      this.deleteData = {...data};
  }

  doAction() {
           this.dialogRef.close(this.deleteData);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
