import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TransTableComponent } from '../../../reuse-components/trans-table/trans-table.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ApiConfigService } from '../../../services/api-config.service';
import { RuntimeConfigService } from '../../../services/runtime-config.service';
import { AlertService } from '../../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { String } from 'typescript-string-operations';
import { StatusCodes } from '../../../enums/common/common';
import { TransListService } from './trans-list.service';
import { CommonService } from '../../../services/common.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-trans-list',
  imports: [ CommonModule, ReactiveFormsModule, TransTableComponent, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './trans-list.component.html',
  styleUrls: ['./trans-list.component.scss']
})

export class TransListComponent implements OnInit, OnDestroy {

  @ViewChild(TransTableComponent, { static: false }) transTableComponent: TransTableComponent;
  @ViewChild("dynamicTabs", { read: ViewContainerRef }) dynamicTabs: ViewContainerRef;

  params: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    // public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private apiConfigService: ApiConfigService,
    private transListService: TransListService,
    private commonService: CommonService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {
    activatedRoute.params.subscribe(params => {
      this.commonService.routeParam = params.id
      if (!this.commonService.checkNullOrUndefined(params.id1)) {
        this.params = params.id;
      } else {
        if (!this.commonService.checkNullOrUndefined(this.transTableComponent)) {
          this.transTableComponent.defaultValues();
        }
      }
    });
  }

  ngAfterViewInit() {
    //This pieces of code adds dynamic component ( Just trust me for now  )
    if (!this.commonService.checkNullOrUndefined(this.params)) {
      let resolver = this.componentFactoryResolver.resolveComponentFactory(this.transListService.getDynComponents(this.params).component);
      this.dynamicTabs.createComponent(resolver);
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.commonService.routeParam = null;
}

}
