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
import { CommonService } from '../../../services/common.service';
import { PrimaryService } from './primary.service';
@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.scss']
})

export class PrimaryComponent implements OnInit {

  @ViewChild("dynamicTabs", { read: ViewContainerRef }) dynamicTabs: ViewContainerRef;

  params: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    // public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private primaryService: PrimaryService,
    private commonService: CommonService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {
    activatedRoute.params.subscribe(params => {
      this.params = params.id;
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //This pieces of code adds dynamic component ( Just trust me for now  )
    if (!this.commonService.checkNullOrUndefined(this.params)) {
      let resolver = this.componentFactoryResolver.resolveComponentFactory(this.primaryService.getDynComponents(this.params).component);
      this.dynamicTabs.createComponent(resolver);
      this.cdr.detectChanges();
    }
  }




}
