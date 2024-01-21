import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SnackBar } from 'src/app/enums/common/common';
import { Static } from 'src/app/enums/common/static';
import { AlertService } from 'src/app/services/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadPreviewComponent } from './fileupload-preview/fileupload-preview.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {


  @ViewChild('myFileInput') myFileInput: any;


  @Input() id = '';
  @Input() multiple = false;
  @Input() type = ''
  @Input() fileExtension = ['pdf'];
  @Input() fileUploadMessage: string;


  @Output() emitFilesList = new EventEmitter();
  @Output() emitImage = new EventEmitter();
  @Output() clearUploadedFile = new EventEmitter();
  @Output() uploadFile = new EventEmitter();

  fileList: any = [];

  @Input() set oldFileList(value: any) {
    if (value && typeof value == 'string' && value != 'null' && value != 'NULL' && value != 'Null') {
      // for(let o = 0; o < value.length; o++) {
      let obj = {
        name: this.getFileName(value),
        image: value
      }
      this.fileList.push(obj)
      // }
    } else if (!value) {
      this.fileList = []
    }
  }

  constructor(private commonService: CommonService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  getFileExtension(file: any) {
    return file && file.split('.').pop();
  }
  openFile(filePath: any) {
    if (filePath?.image) {
      this.uploadFile.emit(filePath);
      // window.open(domain + filePath?.image, "_blank");
    } else {
      this.showImage(filePath);
    }
  }

  showImage(file: any) {
    let fileType = this.getFileExtension(file.name)
    if (file && (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg')) {
      var reader = new FileReader();
      reader.readAsDataURL(file); // read file as data url
      // reader.onload = (event: any) => { // called once readAsDataURL is completed
      //   this.commonService.openDialog({ template: FileuploadPreviewComponent, width: '800px', data: event.target.result }, (el: any) => { })
      // }
    }
  }



  getFileName(file: any) {
    return file && file.split('/').pop();
  }

  onSelectFilebase(inputValue: any): void {
    let data = [...inputValue.target.files];
    for (let f = 0; f < data.length; f++) {
      if (this.fileExtension.length && !this.fileExtension.includes(this.getFileExtension(data[f].name).toLowerCase())) {
        this.alertService.openSnackBar(`Please upload ${this.fileExtension}`, Static.Close, SnackBar.success);
        this.myFileInput.nativeElement.value = '';
        return;
      }
      if (Math.round((data[f].size / 1024)) > 6000) {
        this.alertService.openSnackBar('The maximum supported file size 5 MB', Static.Close, SnackBar.success);
        this.myFileInput.nativeElement.value = '';
        return
      }
    };
    if (!this.multiple) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e: any) => {
        let url = e.target.result;
        var content = url.split(",");
        this.emitImage.emit(content);
      };
      myReader.readAsDataURL(data[0]);
    }
    this.fileList = data;
    this.emitFilesList.emit(data);
    this.myFileInput.nativeElement.value = '';
  }

  clearFile(i: any) {
    this.fileList = this.fileList.filter((res: any, index: any) => index != i);
    this.clearUploadedFile.emit(i)
  }

}
