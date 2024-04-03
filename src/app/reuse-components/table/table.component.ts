import {
  Component, OnInit, ViewChild, Input, OnChanges,
  ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, HostListener
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { User } from '../../models/common/user';
import { TranslateService } from '@ngx-translate/core';
import { RuntimeConfigService } from '../../services/runtime-config.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  /** control for the selected bank for multi-selection */
  public tableMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public tableMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();

  @Input() tableData: any;
  @Output() addOrUpdateEvent = new EventEmitter();
  @Output() onEditEmit = new EventEmitter();
  @Output() editOrDeleteEvent = new EventEmitter();
  @Output() onLinkEmitEvent = new EventEmitter();
  @Output() tableCheckboxEvent = new EventEmitter();
  @Output() tableButtonEvent = new EventEmitter();
  @Input() addOrUpdateData: any;
  @Input() showFilters = true;
  @Input() showButtons = true;
  @Input() routerParam = '';

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  highlightedRows = [];
  columnDefinitions = [];
  filterColData = [];
  doubleClick = 0;
  keys = [];
  user: User;
  @Input() routeParam: any;
  tableIndex: any;

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private runtimeConfigService: RuntimeConfigService,
    public commonService: CommonService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
    });
  }

  defaultValues() {
    this.dataSource = new MatTableDataSource();
    this.highlightedRows = [];
    this.columnDefinitions = [];
    this.filterColData = [];
    this.keys = [];
  }

  setIndex(row, i) {
    this.tableIndex = i;
    this.highlightedRows = [];
    this.highlightedRows.push(row);
  }

  onLink(action: any, element: any) {
    this.onLinkEmitEvent.emit({ action: action, item: element });
  }

  tableCheckboxCheck(flag: any, element: any) {
    this.tableCheckboxEvent.emit({ flag: flag, item: element });
  }

  checkboxAllCheck(flag: any) {
    let data = this.dataSource.data;
    data.forEach((d: any) => d.checkbox = flag.checked);
    this.dataSource = new MatTableDataSource(data);
    this.tableCheckboxEvent.emit({ flag: flag, item: 'All' });
  }

  tableButtonCheck(flag: any, element: any) {
    this.tableButtonEvent.emit({ flag: flag, item: element });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.highlightedRows.length) {
      if (event.keyCode == 40) {
        this.tableIndex = this.tableIndex + 1;
      } else if (event.keyCode == 38) {
        this.tableIndex = this.tableIndex - 1;
      }
      this.setIndex(this.dataSource.data[this.tableIndex], this.tableIndex);
    }
  }

  openDialog(val, row?) {
    let data;
    if (!this.commonService.checkNullOrUndefined(row)) {
      data = { action: val, item: row };
      this.highlightedRows = [row];
    }
    else {
      data = { action: val, item: this.highlightedRows[0] };
    }

    if (data.action === 'Delete' && this.highlightedRows.length) {
      this.addOrUpdateEvent.emit(data);
    }
    else if (data.action === 'Edit' && this.highlightedRows.length && this.commonService.userPermission.canEdit) {
      this.addOrUpdateEvent.emit(data);
    }
    else if (data.action === 'Add') {
      data.item = null;
      this.addOrUpdateEvent.emit(data);
    }
  }

  onEditClick(row: any) {
    this.onEditEmit.emit(row);
  }


  ngOnChanges() {
    this.highlightedRows = [];
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.dataSource = new MatTableDataSource(this.tableData);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    }
    if (!this.commonService.checkNullOrUndefined(this.dataSource)) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (!this.commonService.checkNullOrUndefined(this.tableData) && this.tableData.length > 0) {
      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key });
      }
      const col = [];
      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: true
        };
        col.push(obj);
      });

      // this.translate.get(this.routeParam).subscribe(res => {
      // let key;
      // tslint:disable-next-line: forin
      if(!this.routeParam) {
        this.routeParam = this.routerParam
      }
      for (const key in this.runtimeConfigService.tableColumnsData[this.routeParam]) {
        // tslint:disable-next-line: prefer-for-of
        if (this.runtimeConfigService.tableColumnsData[this.routeParam][key] == 'Date') {
          this.formatDate(key)
        }
        if (this.runtimeConfigService.tableColumnsData[this.routeParam][key] == 'DateTime') {
          this.formatDateTime(key)
        }
        for (let c = 0; c < col.length; c++) {
          if (key == col[c].def) {
            this.columnDefinitions.push(col[c]);
          }
        }
      }
      console.log(this.columnDefinitions);
      // });
    }


    if (!this.commonService.checkNullOrUndefined(this.tableData) && this.tableData.length > 0) {
      this.filteredTableMulti.next(this.columnDefinitions.slice());
      this.tableMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterBanksMulti();
        });
    }

  }

  formatDate(col) {
    this.tableData.map(res => !this.commonService.checkNullOrUndefined(res[col]) ? res[col] = this.commonService.formatDateValue(res[col]) : '');
  }

  formatDateTime(col) {
    this.tableData.map(res => !this.commonService.checkNullOrUndefined(res[col]) ? res[col] = this.commonService.formatReportDate(res[col]) : '');
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  protected filterBanksMulti() {
    if (!this.columnDefinitions) {
      return;
    }
    let search = this.tableMultiFilterCtrl.value;
    if (!search) {
      this.filteredTableMulti.next(this.columnDefinitions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTableMulti.next(
      this.columnDefinitions.filter(bank => bank.def.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredTableMulti.pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.tableMultiCtrl.patchValue(val);
        } else {
          this.tableMultiCtrl.patchValue([]);
        }
      });
  }

  checkboxCheck(index) {
    this.filterColData[index] = {
      def: this.filterColData[index].def,
      label: this.filterColData[index].label, hide: !this.filterColData[index].hide
    };
  }

  saveChanges() {
    this.columnDefinitions = this.filterColData.slice(0);
    this.filterColData = [];
  }

  filterData() {
    this.filterColData = [];
    this.filterColData = this.columnDefinitions.slice(0);
  }

  cancleChanges() {
    this.filterColData = [];
    this.filterColData = this.columnDefinitions.slice(0);
  }

  ngOnInit() {
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getDisplayedColumns(): string[] {
    if (!this.commonService.checkNullOrUndefined(this.tableData)) {
      return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    }
    return null;
  }

  ngOnDestroy() {
    this.tableData = [];
  }

  editOrDelete(action: string, item: any) {
    this.editOrDeleteEvent.emit({ action: action, item: item });
  }

  getCount(name) {
    return this.dataSource && this.dataSource.data.filter(o => o.status === name).length;
  }

}
