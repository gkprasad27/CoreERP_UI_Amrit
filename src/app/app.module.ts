import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedImportModule } from './shared/shared-import';

import { NavbarComponent, TableComponent, DeleteItemComponent, ReportTableComponent,ReportsInnerTableComponent ,SearchFilterTableComponent, PrintComponent } from './reuse-components/index';
import {
  DashboardComponent, LoginComponent, SidebarComponent, NotFoundComponent
} from './components/index';
import {
  GeneralledgerComponent, AccountsGroupComponent,NoSeriesComponent,TaxMasterComponent,
  SubGroupComponent, UndersubGroupComponent, TaxgroupsComponent, TaxstructuresComponent,
  GlAccountsComponent, GlSubcodeComponent, TaxIntegrationComponent, CashAccToBranchesComponent,
  AccToAccClassComponent, VoucherTypesComponent,PartnerTypeComponent,PartnerCreationComponent
} from './components/dashboard/generalledger/index';
import {
  InventoryComponent, BrandModelComponent, SizesComponent, AccountingClassComponent,UnitComponent,
  BrandComponent, NumberAssignmentComponent, MaterialGroupsComponent,ProductpackingComponent,ProductComponent
}
  from './components/dashboard/Inventory/index';

import {
  CompanyComponent, MastersComponent, BranchesComponent,DepartmentComponent, DivisionComponent,DesignationComponent,
  SegmentComponent, ProfitCenterComponent,  CostCenterComponent,
   EmployeeInBranchComponent, EmployeeComponent,
   TanksComponent, PumpComponent, 
 MSHSDRatesComponent
} from './components/dashboard/masters/index';

import {
  PayrollComponent,
  LeaveopeningbalancesComponent,
  LeavetypesComponent,
  StructureCreationComponent, 
  PTMasterComponent, ComponentMasterComponent,
  PFMasterComponent, CTCBreakupComponent, SalaryProcessComponent
} from './components/dashboard/payroll/index';

import {
  SelfserviceComponent, LeavetypeComponent, ApplyodComponent,PermissionRequestComponent,PermissionApprovalsComponent,ApprovalTypeComponent, VehicleRequisitionsComponent,VehicleApprovalsComponent,AdvanceComponent,LeaveRequestComponent,LeaveopeningbalanceComponent,LeaveApprovalComponent,odApprovalComponent,advanceApprovalComponent
  
} from './components/dashboard/selfservice/index';

import {
  SalesComponent, SalesInvoiceComponent, SalesReturnComponent,StocktransferComponent , SalesReturnViewComponent, CreateBillComponent, CreateStockTransferComponent, PurchaseComponent, PurchaseCreateComponent
} from './components/dashboard/sales/index';

import {
  TransactionsComponent, CashPaymentComponent, CreateCashpaymentComponent, CashReceiptComponent,
  CreateCashreceiptComponent, BankPaymentComponent, CreateBankpaymentComponent, BankReceiptComponent,
  CreateBankreceiptComponent,JournalVoucherComponent,CreateJournalvoucherComponent,
   CreateStockissuesComponent , StockissuesComponent, CreateStockreceiptsComponent, StockreceiptsComponent
   ,CreateStockshortsComponent, StockshortComponent, CreateOilconversionsComponent, OilconversionComponent,PackageconversionComponent,
    StockExcessComponent,CreateStockExcessComponent,MeterReadingComponent
} from './components/dashboard/transactions/index';

import {
  RolesprevilagesComponent,  SettingsComponent
} from './components/dashboard/settings/index';

import { RuntimeConfigService } from './services/runtime-config.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FocusOnEnterDirective } from './directives/focus-on-enter.directive';

import { BsDropdownModule, TypeaheadModule } from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PurchaseReturnComponent } from './components/dashboard/sales/purchase-return/purchase-return.component';
import { PurchaseReturnViewComponent } from './components/dashboard/sales/purchase-return/purchase-return-view/purchase-return-view.component';

import { ReportsComponent } from './components/dashboard/reports/index';
import { MemberMasterComponent } from './components/dashboard/masters/member-master/member-master.component';
import { VehicleComponent } from './components/dashboard/masters/member-master/vehicle/vehicle.component';
import { TokenInterceptor } from './token-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GiftMasterComponent} from'./components/dashboard/masters/member-master/Giftmaster/giftmaster.component';
  import { from } from 'rxjs';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FocusOnEnterDirective,
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    NotFoundComponent,
    TableComponent, DeleteItemComponent,
    GeneralledgerComponent, AccountsGroupComponent,
    SubGroupComponent, UndersubGroupComponent,
    GlAccountsComponent, GlSubcodeComponent, TaxIntegrationComponent, CashAccToBranchesComponent,
    AccToAccClassComponent, VoucherTypesComponent,
    InventoryComponent, BrandModelComponent, SizesComponent, AccountingClassComponent,UnitComponent,
    BrandComponent, NumberAssignmentComponent, MaterialGroupsComponent,ProductpackingComponent,
    CompanyComponent, MastersComponent, BranchesComponent, DepartmentComponent, DivisionComponent,DesignationComponent,
    SegmentComponent, ProfitCenterComponent,  CostCenterComponent,
    NoSeriesComponent, PartnerTypeComponent, EmployeeInBranchComponent, EmployeeComponent,PartnerCreationComponent,
    TaxMasterComponent,  TanksComponent, PumpComponent, 
    TaxgroupsComponent, TaxstructuresComponent,
    PayrollComponent,
    LeaveopeningbalancesComponent,
    //LeaveopeningbalanceComponent,
    //selfserviceComponent,
    SelfserviceComponent,
    LeavetypeComponent,
    LeaveopeningbalanceComponent,
    LeavetypesComponent, ApplyodComponent, PermissionRequestComponent, PermissionApprovalsComponent, ApprovalTypeComponent, AdvanceComponent, VehicleRequisitionsComponent, VehicleApprovalsComponent,
    LeaveRequestComponent, PTMasterComponent, ComponentMasterComponent,
    StructureCreationComponent, LeaveApprovalComponent, odApprovalComponent,advanceApprovalComponent,
    PFMasterComponent, CTCBreakupComponent, SalaryProcessComponent,
    SalesComponent, SalesInvoiceComponent, SalesReturnComponent, CreateBillComponent, SalesReturnViewComponent,
    TransactionsComponent, CashPaymentComponent, CreateCashpaymentComponent, CashReceiptComponent,
    CreateCashreceiptComponent, BankPaymentComponent, CreateBankpaymentComponent,BankReceiptComponent,
    CreateBankreceiptComponent,JournalVoucherComponent,CreateJournalvoucherComponent,
    RolesprevilagesComponent, SettingsComponent, StocktransferComponent, CreateStockTransferComponent, PurchaseComponent, PurchaseCreateComponent, PurchaseReturnComponent, PurchaseReturnViewComponent,
    ReportTableComponent,ReportsInnerTableComponent, ReportsComponent, SearchFilterTableComponent,
    CreateStockissuesComponent , StockissuesComponent, CreateStockreceiptsComponent, StockreceiptsComponent
    ,CreateStockshortsComponent, StockshortComponent, CreateOilconversionsComponent, OilconversionComponent,
    PrintComponent,PackageconversionComponent,MSHSDRatesComponent,StockExcessComponent,CreateStockExcessComponent,MeterReadingComponent,ProductComponent,MemberMasterComponent, VehicleComponent,GiftMasterComponent
  ],
  imports: [
    AppRoutingModule,
    SharedImportModule,
    NgxDaterangepickerMd.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    RuntimeConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (environment: RuntimeConfigService) => () => environment.loadRuntimeConfig(),
      multi: true,
      deps: [RuntimeConfigService, HttpClientModule]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    GeneralledgerComponent, AccountsGroupComponent,
    SubGroupComponent, UndersubGroupComponent,
    GlAccountsComponent, GlSubcodeComponent, TaxIntegrationComponent, CashAccToBranchesComponent,
    AccToAccClassComponent, VoucherTypesComponent,
    DeleteItemComponent, InventoryComponent, BrandModelComponent,UnitComponent, SizesComponent, AccountingClassComponent,
    BrandComponent, NumberAssignmentComponent, MaterialGroupsComponent,ProductpackingComponent,
    CompanyComponent, BranchesComponent, DepartmentComponent, DivisionComponent,DesignationComponent,
    SegmentComponent, ProfitCenterComponent, CostCenterComponent,
    NoSeriesComponent, PartnerTypeComponent, EmployeeInBranchComponent, EmployeeComponent,PartnerCreationComponent,
    TaxMasterComponent,  TanksComponent, PumpComponent, 
    TaxgroupsComponent, TaxstructuresComponent,
    LeaveopeningbalancesComponent,
   // LeaveopeningbalanceComponent,
    LeavetypeComponent,
    LeaveopeningbalanceComponent,
    LeavetypesComponent,
    ApplyodComponent, PermissionRequestComponent, PermissionApprovalsComponent, ApprovalTypeComponent, AdvanceComponent, VehicleRequisitionsComponent, VehicleApprovalsComponent,
    LeaveRequestComponent,
    PTMasterComponent, ComponentMasterComponent,
    StructureCreationComponent, LeaveApprovalComponent,odApprovalComponent,advanceApprovalComponent,
    PFMasterComponent, CTCBreakupComponent, SalaryProcessComponent,CashPaymentComponent, CreateCashpaymentComponent, CashReceiptComponent,
    CreateCashreceiptComponent, BankPaymentComponent, CreateBankpaymentComponent,BankReceiptComponent,CreateBankreceiptComponent,
    JournalVoucherComponent,CreateJournalvoucherComponent,
    ReportsInnerTableComponent, SearchFilterTableComponent,
    PrintComponent,PackageconversionComponent,MSHSDRatesComponent,StockExcessComponent,CreateStockExcessComponent,MeterReadingComponent,ProductComponent,
    // MemberMasterComponent, VehicleComponent
  ]
})
export class AppModule { }
