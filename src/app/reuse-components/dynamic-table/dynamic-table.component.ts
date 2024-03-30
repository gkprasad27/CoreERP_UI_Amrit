import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AddOrEditService } from '../../components/dashboard/comp-list/add-or-edit.service';
import { RuntimeConfigService } from '../../services/runtime-config.service';
import { CommonService } from '../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {


  @Output() emitColumnChanges = new EventEmitter();

  @Input() set tableObJect(res) {
    if (!this.commonService.checkNullOrUndefined(res)) {
      this.tableData = [res.tableData];
      this.formControl = res.formControl;
      if (res.routeParam) {
        this.routeParam = res.routeParam;
      }
      this.tableForm = this.formBuilder.group(this.formControl);
      this.setTableData();
    }
  }

  @Input() set dynamicTableUpdate(res) {
    if (!this.commonService.checkNullOrUndefined(res)) {
      this.dataSource = new MatTableDataSource();
      if (res.type == 'editValue') {
        let editData = this.formalTableData(res.data);
        editData.push(this.tableData[0])
        this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(editData)));
      } else if (res.type == 'edit') {
        this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(this.formalTableData(res.data))));
      } else if (res.type == 'reset') {
        this.setTableData();
      } else if (res.type == 'add') {
        if (res.data.length) {
          this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(res.data)));
          (this.isDropdown) ? this.setFocus() : this.setCurrentFocus();
        } else {
          this.dataSource = new MatTableDataSource();
        }
      }
      this.spinner.hide();
      this.cdr.detectChanges();
    }
  }

  dataSource: MatTableDataSource<any>;
  keys = [];
  tableData = [];
  columnDefinitions = [];
  routeParam: any;
  tableForm: FormGroup;
  formControl = new FormControl();
  id: any;
  index: any;
  data: any;
  isDropdown = false;

  @Input() addNew = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public runtimeConfigService: RuntimeConfigService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    addOrEditService: AddOrEditService
  ) {
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
    });
  }




  formalTableData(list) {
    const data = [];
    for (let l = 0; l < list.length; l++) {
      const obj = JSON.parse(JSON.stringify(this.tableData[0]))
      for (let t in obj) {
        obj[t].value = list[l][t];
        obj[t].type = obj[t].type ? obj[t].type : 'none';
      }
      data.push(obj);
    }
    return data;
  }

  deleteRow(i, flag) {
    if (!flag) {
      if (this.dataSource.data.length == 1) {
        return;
      }
      this.dataSource.data = this.dataSource.data.filter((value, index, array) => {
        return index !== i;
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }
  }

  ngOnInit(): void {
  }

  setTypeAheadValue(val, col, indx) {
    this.dataSource.data[indx][col].value = val;
    this.formControlValid(col, this.dataSource.data[indx][col], val, indx);
  }

  dropdownSettings  = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };


  setBackgroundClass(element: any) {
    return 'lightred'
  }

  formControlValid(col, val, data, indx) {
    
    if (col == 'checkAll') {
      this.enableControls(val, data);
    }
    this.id = col;
    this.index = indx;
    this.data = data;
    this.isDropdown = (this.dataSource.data[indx][col].type == 'dropdown') ? true : false;
    if (!this.commonService.checkNullOrUndefined(data)) {
      if (this.checkPrimary(col, data, val, indx)) {
        this.dataSource.data[indx][col].value = '';
        this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(this.dataSource.data)));
        return;
      }
      if ((this.dataSource.data.length - 1) === indx) {
        this.tableForm.patchValue({
          [col]: data
        });
      }
      this.dataSource.data[indx][col].value = data;
      if (this.addNew && Object.keys(this.tableForm.value).length && this.tableForm.valid && (this.dataSource.data.length - 1) == indx) {
        this.dataSource.data.push(JSON.parse(JSON.stringify(this.tableData[0])));
        this.tableForm = this.formBuilder.group(this.formControl);
      }
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.emitColumnChanges.emit({ column: col, index: indx, data: this.dataSource.data });
    }
  }

  checkPrimary(col, data, val, indx) {
    if (!this.commonService.checkNullOrUndefined(val[col].primary) && this.dataSource.data.length > 1) {
      for (let d = 0; d < this.dataSource.data.length; d++) {
        if (this.dataSource.data[d][col].value == data && d != indx) {
          return true;
        }
      }
    }
    return false;
  }


  enableControls(res, flag) {
    for (const prop in res) {
      if (prop != 'checkAll') {
        res[prop].disabled = res[prop].fieldEnable ? flag ? false : true : true
      }
    }
    return res;
  }


  setTableData() {
    // let data = [];
    // if (!this.commonService.checkNullOrUndefined(this.dataSource)) {
    //   data = (!this.commonService.checkNullOrUndefined(this.dataSource.data.length)) ? this.dataSource.data : this.tableData;
    // } else {
    //   data = this.tableData;
    // }
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(this.tableData)));
      }
      this.keys = [];
      const col = [];
      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key, disabled: this.tableData[0][key].disabled ? this.tableData[0][key].disabled : false, hide: this.tableData[0][key].hide });
      }
      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: cols.hide, disabled: cols.disabled
        };
        col.push(obj);
      });
      this.columnDefinitions = [];

      if (!this.routeParam) {
        this.routeParam = this.router.url.split('/').pop();
      }
      // tslint:disable-next-line:forin
      for (let key in this.runtimeConfigService.tableColumnsData[this.routeParam]) {
        for (let c = 0; c < col.length; c++) {
          if (key == col[c].def && !col[c].hide) {
            this.columnDefinitions.push(col[c]);
          }
        }
      }

    }
  }

  getDisplayedColumns(): string[] {
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      return this.columnDefinitions.map(cd => cd.def);
    }
    return null;
  }

  setCurrentFocus() {
    this.commonService.setFocus(this.id + this.index);
  }

  setFocus(id?, indx?, data?) {
    this.data = this.commonService.checkNullOrUndefined(data) ? this.data : data;
    if (this.checkValue()) {
      let flag = false;
      let nextId = '';
      this.id = this.commonService.checkNullOrUndefined(id) ? this.id : id;
      this.index = this.commonService.checkNullOrUndefined(indx) ? this.index : indx;
      // tslint:disable-next-line:forin
      for (let c = 0; c < this.columnDefinitions.length; c++) {
        if (flag && !this.columnDefinitions[c].disabled && this.columnDefinitions[c].def != 'delete') {
          nextId = this.columnDefinitions[c].def;
          break;
        }
        if (this.id == this.columnDefinitions[c].def) {
          flag = true;
        }
      }
      if (nextId == '') {
        for (let c = 0; c < this.columnDefinitions.length; c++) {
          if (!this.columnDefinitions[c].disabled) {
            nextId = this.columnDefinitions[c].def;
            this.index = this.index + 1;
            break;
          }
        }
      }
      this.commonService.setFocus(nextId + this.index);
    }
  }

  checkValue() {
    if (this.isDropdown) {
      if (this.commonService.checkNullOrUndefined(this.data) && this.isDropdown) {
        return false;
      }
    }
    return true;
  }

  setClass(element: any) {
    if (element.result && element.result.condition == 'inspection' && element.result.value) {
      let spec = element.spec.value;

      if((element.parameter.value == "Hardness") && element.spec.value) {
        spec = element.spec.value.trim().split('-');
        if ((+element.result.value) < (+spec[0]) || ((+element.result.value) > (+spec[1]))) {
          return element.result.addClass;
        }
      }


      if(element.parameter.value && (element.parameter.value.trim() == "TLB Bore" || element.parameter.value.trim() == "Key Wey Width" || element.parameter.value.trim() == "Key Way Width") && element.spec.value) {
        spec = element.spec.value.trim().split(' ')[0];
      }
      const str = element.minValue.value && element.minValue.value.includes('±') ? element.minValue.value.split('±')[1] : '';
      if (str && (((+element.result.value) < ((+spec) - (+str))) || ((+element.result.value) > ((+spec) + (+str))))) {
        return element.result.addClass;
      }

      const str1 = element.minValue.value && element.minValue.value.includes('+') ? element.minValue.value.split('+')[1] : '';
      if (str1 && (((+element.result.value) < (+spec)) || ((+element.result.value) > ((+spec) + (+str1))))) {
        return element.result.addClass;
      }

      const str2 = element.minValue.value && element.minValue.value.includes('≤') ? element.minValue.value.split('≤')[1] : '';
      if (str2 && (((+element.result.value) > (+str2)))) {
        return element.result.addClass;
      }

    }
    return ''
  }


}
