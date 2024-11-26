import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event, NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemComponent } from '../reuse-components/delete-item/delete-item.component';

declare var require: any
const FileSaver = require('file-saver');

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  appDrawer: any;
  parentItem: any;
  currentUrl = new BehaviorSubject<string>(undefined);
  selectedInput: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  showNavbar = new BehaviorSubject<boolean>(null);
  routeParam: string;
  routeConfig = <any>{};
  userPermission = <any>{};

  constructor(
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,

  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  downloadFile(data) {
    const arrayBuffer = this.base64ToArrayBuffer(data.fileContents);
    this.createAndDownloadBlobFile(arrayBuffer, data.fileDownloadName.split('.').slice(0, -1).join('.'), data.fileDownloadName.split('.').pop());
    // FileSaver.saveAs(data, 'sdfsd');

  }

  createAndDownloadBlobFile(body, filename, extension = 'pdf') {
    const blob = new Blob([body]);
    const fileName = `${filename}.${extension}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  formatTableData(data, flag = 1) {
    const array = [];
    for (let t = 0; t < data.length; t++) {
      const object = {};
      for (let prop in data[t]) {
        prop != 'delete' ? object[prop] = data[t][prop].value : null
        if (prop == 'checkAll') {
          object['check'] = (prop == 'checkAll') ? data[t][prop].value : true
        }
        if (data[t][prop].type == 'checkbox') {
          object[prop] = object[prop] ? 1 : 0
        }
      }
      if ((data.length - flag) != t) {
        if (object.hasOwnProperty('check')) {
          if (object['check']) {
            delete object['check'];
            delete object['checkAll'];
            array.push(object);
          }
        } else {
          array.push(object);
        }
      }
    }
    return array;
  }

  getLangConfig(): any {
    this.http.get('../../assets/app-lang-config.json').subscribe(
      data => {
        const langConfig = data;
        localStorage.setItem('langConfig', JSON.stringify(langConfig));
        this.languageConfig();
      },
      (error: HttpErrorResponse) => {
        // this.toastr.error("Failed to load language config data");
      }
    );
  }

  languageConfig() {
    const languageConfiguration: any = JSON.parse(localStorage.getItem('langConfig'));
    if (!this.checkNullOrUndefined(languageConfiguration)) {
      this.translate.addLangs(languageConfiguration.langagues);
      this.translate.setDefaultLang('english');
      if (localStorage.getItem('defaultLang')) {
        this.translate.use(localStorage.getItem('defaultLang'));
      } else {
        const browserLang = this.translate.getBrowserLang();
        const defaultLang = browserLang.match(/english|telugu|hindi/) ? browserLang : 'english';
        localStorage.setItem('defaultLang', defaultLang);
        this.translate.use(localStorage.getItem('defaultLang'));
      }
    }

  }


  formatDate(event) {
    const time = new Date();
    // tslint:disable-next-line: one-variable-per-declaration
    const date = new Date(event),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2),
      hours = ('0' + time.getHours()).slice(-2),
      minutes = ('0' + time.getMinutes()).slice(-2),
      seconds = ('0' + time.getSeconds()).slice(-2);
    return `${[mnth, day, date.getFullYear()].join('-')} ${[hours, minutes, seconds].join(':')}`;
  }

  formatDateValue(event, day1?) {
    if (!event) {
      return '';
    }
    const time = new Date();
    // tslint:disable-next-line: one-variable-per-declaration
    if (day1) {
      var d = new Date(event);
      d.setDate(d.getDate() - day1);
      event = d;
    }

    const date = new Date(event),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2)
    return `${[date.getFullYear(), mnth, day].join('-')}`;
  }


  formatReportDate(event) {
    var time = new Date();
    var date = new Date(event),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2),
      hours = ("0" + time.getHours()).slice(-2),
      minutes = ("0" + time.getMinutes()).slice(-2),
      seconds = ("0" + time.getSeconds()).slice(-2);
    return `${[date.getFullYear(), mnth, day].join("/")} ${[hours, minutes, seconds].join(":")}`
  }

  formatDate1(event) {
    var date = new Date(event),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return `${[date.getFullYear(), mnth, day].join("/")}`
  }

  formatReportTime(event) {
    var date = new Date(event),
      hours = ("0" + date.getHours()).slice(-2),
      minutes = ("0" + date.getMinutes()).slice(-2)
    return `${[hours, minutes].join(":")}`
  }


  public toggleSidebar() {
    if (!this.checkNullOrUndefined(this.appDrawer)) {
      this.appDrawer.toggle();
    }
  }


  //To Set Focus
  setFocus(id) {
    window.setTimeout(function () {
      let inputElement = <HTMLInputElement>document.getElementById(id);
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }

  //Object Comparsion
  IsObjectsMatch(mainObject: any, cloneObject: any) {
    return (JSON.stringify(mainObject) === JSON.stringify(cloneObject));
  }



  // to check null or undefined
  checkNullOrUndefined(val) {
    if (val === null || val === undefined || Number.isNaN(val)) {
      return true;
    } else {
      return false;
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  deletePopup(data, callBack: any) {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '1024px',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      callBack(result);
    });

  }

  convertNumberToWords(data) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    var amount = data.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    var value: any = "";

    if (n_length <= 9) {
      var n_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

}
