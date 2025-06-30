import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fileupload-preview',
  imports: [ CommonModule ],
  templateUrl: './fileupload-preview.component.html',
  styleUrls: ['./fileupload-preview.component.scss']
})
export class FileuploadPreviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FileuploadPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
  }

}
