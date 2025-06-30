import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, ComponentRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CompListService } from '../comp-list.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicTableComponent } from '../../../../reuse-components/dynamic-table/dynamic-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-comp-tabs',
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './comp-tabs.component.html',
  styleUrls: ['./comp-tabs.component.scss']
})
export class CompTabsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("dynamicTabs", { read: ViewContainerRef }) dynamicTabs: ViewContainerRef;

  params: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private compListService: CompListService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService
  ) {
    activatedRoute.params.subscribe(params => {
      this.params = params.id;
      this.commonService.routeParam = params.id
      // this.getTableParameters(params.id);
      // if (!this.commonService.checkNullOrUndefined(this.tableComponent)) {
      //   this.tableComponent.defaultValues();
      // }
    });
  }

  ngOnInit() {

  }
  
  ngAfterViewInit() {
    //This pieces of code adds dynamic component ( Just trust me for now  )
    let resolver = this.componentFactoryResolver.resolveComponentFactory(this.compListService.getDynComponents(this.params));
    this.dynamicTabs.createComponent(resolver);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
      this.cdr.detach();
      this.commonService.routeParam = null;
  }

}
