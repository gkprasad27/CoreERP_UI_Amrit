import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-inspection-preview',
  templateUrl: './inspection-preview.component.html',
  styleUrls: ['./inspection-preview.component.scss']
})
export class InspectionPreviewComponent {

  data: any;

  date = new Date();

  constructor() {
   const obj = localStorage.getItem('inspectionPrintData');
   const newO = JSON.parse(obj);
   this.data = newO;
  }


  print() {
    // this.spinner.show();
    // setTimeout(() => {
      let DATA: any = document.getElementById('inspectionPrintData');
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(DATA.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
      // html2canvas(DATA).then((canvas: any) => {
      //   // let fileWidth = 208;
      //   // let fileHeight = 279.4;
      //   // let fileHeight = (canvas.height * fileWidth) / canvas.width;
      //   const FILEURI = canvas.toDataURL('image/png');
      //   let PDF = new jsPDF('p', 'mm', 'a4');
      //   let position = 0;
      //   var width = PDF.internal.pageSize.getWidth();
      //   var height = PDF.internal.pageSize.getHeight();
      //   PDF.addImage(FILEURI, 'PNG', 0, position, width, height);
      //   PDF.save(`${this.data.heading}.pdf`);
      //   this.spinner.hide();
      // });
    // });
  }

}
