import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedImportModule } from './shared/shared-import';

import {
  CompListComponent, CompanyComponent, BranchesComponent, CostCenterComponent, LanguageComponent, CurrencyComponent, CountryComponent, RegionComponent, StateComponent, UOMComponent,
  SegmentComponent, ProfitCenterComponent, DivisionComponent, FunctionalDepartmentComponent, PlantsComponent, LocationsComponent, SalesDepartmentComponent, DistributionchannelsComponent,
  SalesofficeComponent, SalesGroupComponent, MaintenceAreaComponent, PurchaseDepartmentComponent, StorageLocationsComponent, ErpUsersComponent, LedgerComponent,
  OpenLedgerComponent, VoucherClassComponent, VoucherTypesComponent, VoucherSeriesComponents, AssignmentVoucherSeriestoVoucherTypesComponent, TaxRatesComponents, TaxTransactionComponent,
  TaxIntegrationComponent, AssignmentoftaxaccountstotaxcodesComponent, HsnSacComponent, TDSComponent, IncomeTypeComponent, TdsRatesComponent, PostingComponent, AccountsGroupComponent,
  UndersubGroupComponent, AccountchartComponent, AssignmentChartAccounttoCompanyComponent, PartnerTypesComponent, BusienessPartnerGroupsComponent, NumberRangeComponent, AssignmentComponent,
  AssetClassComponent, AccountKeyComponent, PaymentTermsComponent, AlternateControlAccountComponent, DepreciationareasComponent, AssetBlockComponent, AssetNumberRangeComponent, AseetClassToAssetBlockComponent,
  AssetTransactionTypeComponent, StoresTypeComponent, AssignmentAccountKeytoAssetClassComponent, BankMasterComponent
  , DepreciationcodeComponent, GLAccountComponent, BusienessPartnerAccountComponent, MainAssetMasterComponent, SubAssetsComponent, RequisitionAssignmentComponent,

  AssignGLaccounttoSubGroupComponent, GLSubAccountComponent, PurchasinggroupsComponent, PurchasingtypeComponent,
  PurchasingpersonComponent, RequisitionNumberRangeComponent, PurchaseordertypeComponent,
  QuotationNumberRangeComponent, QuotationAssignmentComponent, PurchaseOrderAssignmentComponent, SupplierTermsandconditionsComponent,
  BusienessTransactionTypeComponent, AssetBegningAccumulatedDepreciationComponent,
  AssetBegningAcqusitionComponent, PurchaseOrderNumberRangeComponent, GoodsReceiptNoteNumberSeriesComponent,
  RejectionReasonsComponent, MovementtypeComponent, LotSeriesComponent, StoresAssignmentComponent,
  GoodsReceiptNoteAssignmentComponent, MaterialTypesComponent, MaterialGroupsComponent,
  MaterialRequisitionNoteAssignmentComponent, MaterialRequisitionNoteNumberSeriesComponent,
  GoodsIssueNoteAssignmentComponent, GoodsIssueNoteNumberSeriesComponent, BinsCreationComponent, PurchaseRequisitionNumberRangeComponent,
  ModelPatternComponent, MaterialNumberRangeComponent, MaterialNumberAsssignmentComponent, ProcessComponent,
  MaterialSizeComponent, MaterialMasterComponent, PrimaryCostElementsCreationComponent, CreationOfCostUnitsComponent, BatchMasterComponent, OrderTypeComponent,
  SecondaryCostElementsCreationComponent, CoastingActivitiesComponent,
  CostingKeyFiguresComponent, WorkCenterCreationComponent,
  AssignmentOfNumberSeriesToObjectTypesComponent, CommitmentItemComponent, FundCenterComponent, WorkBreakDownStructureComponent,
  CostingObjectTypesComponent, CostingObjectNumberSeriesComponent, FormulasComponent,
  StandardRateComponent, DownTimeReasonComponent, TasksComponent, InvoiceverificationComponent, RoutingFileComponent, VehicleRequisitionsComponent,
  PTMasterComponent, PFMasterComponent, PermissionRequestComponent, CTCBreakupComponent, ComponentMasterComponent, 
  AdvanceComponent, ApplyodComponent, LeaveRequestComponent, LeaveopeningbalanceComponent, LeavetypeComponent, ApprovalTypeComponent, OpeningBalanceComponent, VehicleApprovalsComponent, advanceApprovalComponent, odApprovalComponent, PermissionApprovalsComponent, LeaveApprovalComponent, DesignationComponent,
  StructureCreationComponent,
  HolidayComponent,SalaryProcessComponent, QuorantineComponent, CAPAdetailsComponent, QcparamconfigurationComponent, StandardRateOComponent, AttendanceProcessComponent, EmployeeAttendanceComponent
} from './components/dashboard/comp-list/index';

import {
  CashbankComponent, JournalComponent, GoodsissueComponent, MemoinvoiceComponent, SourceOfSupplyComponent, InspectioncheckComponent, InspectionPreviewComponent,
  QuotationAnalysisComponent, QuotationSupplierComponent, PurchasingComponent, PurchaseOrderComponent, ReceiptOfGoodsComponent,
  ReceiptspaymentsComponent, BillOfMaterialComponent, MaterialrequisitionComponents, PurchasesaleassetComponent, SaleassetComponent,SampleRequisitionFormComponent,SampleServiceComponent, StockExcessComponent, CreateStockExcessComponent, CreateStockTransferComponent, StocktransferComponent, SalesorderComponent,
  PreviewComponent, SalesInvoiceComponent, PoHistoryComponent, JobworkmaterialissueComponent, JobworkmaterialreceivingComponent
} from './components/dashboard/trans-list/index';

import { NavbarComponent, TableComponent, DeleteItemComponent, SearchFilterTableComponent, TransTableComponent, DynamicTableComponent, AutocompleteComponent, SaveItemComponent, FileUploadComponent } from './reuse-components/index';
import {
  DashboardComponent, LoginComponent, SidebarComponent, NotFoundComponent
} from './components/index';

import { RolesprevilagesComponent, TransListComponent, PrimaryComponent } from './components/dashboard/index';

import { PrimaryCostElementComponent } from './components/dashboard/primary/index';

import { CompTabsComponent } from './components/dashboard/comp-list/comp-tabs/index';

import { RuntimeConfigService } from './services/runtime-config.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FocusOnEnterDirective } from './directives/focus-on-enter.directive';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { TokenInterceptor } from './token-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { from } from 'rxjs';
import { MaxlengthDirective } from './directives/maxlength.directive';
import { NonEditableDatepicker } from './directives/format-datepicker';
import { EmployeeComponent } from './components/dashboard/comp-list/employee/employee.component';
import { DatePipe } from '@angular/common';
import { InspectionComponent } from './components/dashboard/trans-list/inspectioncheck/inspection/inspection.component';
import { BalanceCertificateComponent } from './components/dashboard/trans-list/inspectioncheck/balance-certificate/balance-certificate.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MaterialRequisitionViewComponent } from './components/dashboard/trans-list/materialrequisition/material-requisition-view/material-requisition-view.component';
import { DispatchdetailsComponent } from './components/dashboard/comp-list/dispatchdetails/dispatchdetails.component';
import { ReportsComponent } from './components/dashboard/reports/reports.component';
import { GraphsComponent } from './components/dashboard/graphs/graphs.component';
import { DashboardGraphComponent } from './components/dashboard/dashboard-graph/dashboard-graph.component';

//import { AccountKeyComponent } from './components/dashboard/comp-list/assetblock/accountkey/accountkey.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    // main

    // directives

    // pipes


    // component

    // component list
    BranchesComponent, CostCenterComponent, LanguageComponent, CurrencyComponent, CountryComponent, RegionComponent, StateComponent, UOMComponent,
    SegmentComponent, ProfitCenterComponent, DivisionComponent, FunctionalDepartmentComponent, PlantsComponent, LocationsComponent, SalesDepartmentComponent,
    DistributionchannelsComponent, SalesofficeComponent, SalesGroupComponent, MaintenceAreaComponent, PurchaseDepartmentComponent, StorageLocationsComponent,
    ErpUsersComponent, RolesprevilagesComponent, LedgerComponent, OpenLedgerComponent, VoucherClassComponent, VoucherTypesComponent, VoucherSeriesComponents,
    AssignmentVoucherSeriestoVoucherTypesComponent, TaxRatesComponents, TaxTransactionComponent, TaxIntegrationComponent, AssignmentoftaxaccountstotaxcodesComponent,
    HsnSacComponent, TDSComponent, IncomeTypeComponent, TdsRatesComponent, PostingComponent, AccountsGroupComponent, UndersubGroupComponent, AssignmentComponent,
    AccountchartComponent, CompanyComponent, PartnerTypesComponent, NumberRangeComponent, BusienessPartnerGroupsComponent, PaymentTermsComponent,
    AssetClassComponent, AccountKeyComponent, AlternateControlAccountComponent, DepreciationareasComponent, AssetBlockComponent, AssetNumberRangeComponent

    , AseetClassToAssetBlockComponent, AssetTransactionTypeComponent, StoresTypeComponent, PurchasingtypeComponent,
    AssignmentAccountKeytoAssetClassComponent, BankMasterComponent, DepreciationcodeComponent, GLAccountComponent, BusienessPartnerAccountComponent, MainAssetMasterComponent, SubAssetsComponent,
    AssignGLaccounttoSubGroupComponent, GLSubAccountComponent, PurchasinggroupsComponent, PurchasingpersonComponent, RequisitionAssignmentComponent, RequisitionNumberRangeComponent, PurchaseordertypeComponent, SupplierTermsandconditionsComponent,
    PurchaseOrderNumberRangeComponent, RejectionReasonsComponent, MovementtypeComponent, LotSeriesComponent,
    StoresAssignmentComponent, GoodsReceiptNoteNumberSeriesComponent, GoodsReceiptNoteAssignmentComponent, MaterialTypesComponent, MaterialGroupsComponent, MaterialRequisitionNoteAssignmentComponent, MaterialRequisitionNoteNumberSeriesComponent, GoodsIssueNoteAssignmentComponent,
    GoodsIssueNoteNumberSeriesComponent, BinsCreationComponent, PurchaseRequisitionNumberRangeComponent, BatchMasterComponent, OrderTypeComponent, ProcessComponent, PrimaryCostElementsCreationComponent, CreationOfCostUnitsComponent, CreationOfCostUnitsComponent, BatchMasterComponent, OrderTypeComponent, ProcessComponent, PrimaryCostElementsCreationComponent, CostingKeyFiguresComponent, CostingKeyFiguresComponent, CostingObjectTypesComponent,
    CostingObjectNumberSeriesComponent, StandardRateComponent, WorkCenterCreationComponent, InvoiceverificationComponent, RoutingFileComponent, TasksComponent, FormulasComponent, FundCenterComponent, CommitmentItemComponent, WorkBreakDownStructureComponent, CostingObjectTypesComponent, DownTimeReasonComponent, FundCenterComponent, DownTimeReasonComponent, WorkBreakDownStructureComponent, CommitmentItemComponent,
    RoutingFileComponent, FormulasComponent, WorkCenterCreationComponent, StandardRateComponent, CostingObjectNumberSeriesComponent, AssignmentOfNumberSeriesToObjectTypesComponent, CoastingActivitiesComponent, AssignmentOfNumberSeriesToObjectTypesComponent, CoastingActivitiesComponent, SecondaryCostElementsCreationComponent, SecondaryCostElementsCreationComponent, MaterialMasterComponent, MaterialMasterComponent, MaterialSizeComponent, MaterialSizeComponent, MaterialNumberAsssignmentComponent,
    ModelPatternComponent, MaterialNumberRangeComponent, QuotationNumberRangeComponent, PurchaseOrderAssignmentComponent, QuotationAssignmentComponent, BusienessTransactionTypeComponent, AssetBegningAccumulatedDepreciationComponent, AssetBegningAcqusitionComponent,
    CompTabsComponent,
    TransListComponent,
    TransTableComponent,
    SearchFilterTableComponent,
    CompListComponent,
    AppComponent,
    NavbarComponent,
    FocusOnEnterDirective,
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    NotFoundComponent,
    TableComponent, DeleteItemComponent, TaxIntegrationComponent, AssignmentoftaxaccountstotaxcodesComponent,
    HsnSacComponent, TDSComponent, IncomeTypeComponent, TdsRatesComponent, PostingComponent, AccountsGroupComponent, UndersubGroupComponent,
    AccountchartComponent, AssignmentChartAccounttoCompanyComponent, PartnerTypesComponent, BusienessPartnerGroupsComponent, NumberRangeComponent, AseetClassToAssetBlockComponent,
    AssignmentComponent, AssetClassComponent, AccountKeyComponent, PaymentTermsComponent, AlternateControlAccountComponent, DepreciationareasComponent, AssetBlockComponent,
    AssetNumberRangeComponent, AssetTransactionTypeComponent, StoresTypeComponent, AssignmentAccountKeytoAssetClassComponent,
    BankMasterComponent, DepreciationcodeComponent, GLAccountComponent, GLSubAccountComponent, PurchasinggroupsComponent, PurchasingpersonComponent, RequisitionAssignmentComponent, RequisitionNumberRangeComponent, PurchaseordertypeComponent, SupplierTermsandconditionsComponent,
    PurchaseOrderNumberRangeComponent, RejectionReasonsComponent, MovementtypeComponent, LotSeriesComponent,
    StoresAssignmentComponent, QuotationNumberRangeComponent, GoodsReceiptNoteNumberSeriesComponent, GoodsReceiptNoteAssignmentComponent, MaterialTypesComponent, MaterialGroupsComponent, MaterialRequisitionNoteAssignmentComponent, MaterialRequisitionNoteNumberSeriesComponent, GoodsIssueNoteAssignmentComponent, MaterialNumberRangeComponent, ModelPatternComponent,
    GoodsIssueNoteNumberSeriesComponent, BinsCreationComponent, PurchaseRequisitionNumberRangeComponent, MaterialNumberRangeComponent, MaterialNumberAsssignmentComponent,
    PurchaseOrderAssignmentComponent, QuotationAssignmentComponent, BusienessTransactionTypeComponent, AssetBegningAccumulatedDepreciationComponent, AssetBegningAcqusitionComponent,
    BusienessPartnerAccountComponent, AssignGLaccounttoSubGroupComponent, MainAssetMasterComponent, SubAssetsComponent,
    DynamicTableComponent, AutocompleteComponent, CashbankComponent,SampleRequisitionFormComponent, SampleServiceComponent, JournalComponent, MaterialRequisitionNoteAssignmentComponent, GoodsissueComponent, MemoinvoiceComponent, ReceiptspaymentsComponent, MaterialrequisitionComponents, BillOfMaterialComponent, MaxlengthDirective, PurchasesaleassetComponent,
    SaleassetComponent, RoutingFileComponent, SourceOfSupplyComponent, QuotationSupplierComponent, QuotationAnalysisComponent,
    PurchasingComponent, PurchaseOrderComponent, ReceiptOfGoodsComponent, InspectioncheckComponent, NonEditableDatepicker, PrimaryComponent, PrimaryCostElementComponent,
    //LeaveopeningbalanceComponent,
    //selfserviceComponent,
    EmployeeComponent,
    VehicleRequisitionsComponent, PTMasterComponent, PFMasterComponent, PermissionRequestComponent, CTCBreakupComponent, ComponentMasterComponent,
    AdvanceComponent, ApplyodComponent, LeaveRequestComponent, LeaveopeningbalanceComponent, LeavetypeComponent,
    
    ApprovalTypeComponent, OpeningBalanceComponent, StockExcessComponent, CreateStockExcessComponent,
    StocktransferComponent, CreateStockTransferComponent,
    SaveItemComponent, advanceApprovalComponent, VehicleApprovalsComponent, odApprovalComponent,
    PermissionApprovalsComponent, LeaveApprovalComponent,
    DesignationComponent,
    SalesorderComponent,
    FileUploadComponent,
    PreviewComponent,
    InspectionComponent,StructureCreationComponent, BalanceCertificateComponent, InspectionPreviewComponent, MaterialRequisitionViewComponent, SalesInvoiceComponent,
    SalesInvoiceComponent,
    PoHistoryComponent,
    HolidayComponent,
    DispatchdetailsComponent,SalaryProcessComponent, QuorantineComponent, CAPAdetailsComponent, ReportsComponent, QcparamconfigurationComponent, 
    StandardRateOComponent, JobworkmaterialreceivingComponent, JobworkmaterialissueComponent, GraphsComponent, DashboardGraphComponent, AttendanceProcessComponent, EmployeeAttendanceComponent
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
    {provide: LocationStrategy, useClass: HashLocationStrategy},
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
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    // component

    // component list
    BranchesComponent, CostCenterComponent, LanguageComponent, CurrencyComponent, CountryComponent, RegionComponent, StateComponent, UOMComponent,
    SegmentComponent, ProfitCenterComponent, DivisionComponent, FunctionalDepartmentComponent, PlantsComponent, LocationsComponent, SalesDepartmentComponent,
    DistributionchannelsComponent, SalesofficeComponent, SalesGroupComponent, MaintenceAreaComponent, PurchaseDepartmentComponent, StorageLocationsComponent,
    ErpUsersComponent, RolesprevilagesComponent, LedgerComponent, OpenLedgerComponent, VoucherClassComponent, VoucherTypesComponent, VoucherSeriesComponents,
    AssignmentVoucherSeriestoVoucherTypesComponent, TaxRatesComponents, TaxTransactionComponent, TaxIntegrationComponent,

    UndersubGroupComponent, TaxIntegrationComponent,
    DeleteItemComponent,
    CompanyComponent, VehicleRequisitionsComponent, PTMasterComponent, PFMasterComponent, PermissionRequestComponent, CTCBreakupComponent, ComponentMasterComponent,
    AdvanceComponent, ApplyodComponent, LeaveRequestComponent, LeaveopeningbalanceComponent, LeavetypeComponent, 
    // LeaveopeningbalanceComponent,

    // MemberMasterComponent, VehicleComponent
    ApprovalTypeComponent, OpeningBalanceComponent, StockExcessComponent, CreateStockExcessComponent, 
    StocktransferComponent, CreateStockTransferComponent,
    SaveItemComponent, advanceApprovalComponent, VehicleApprovalsComponent, odApprovalComponent,
    PermissionApprovalsComponent, LeaveApprovalComponent,

    DesignationComponent,
    SalesorderComponent,StructureCreationComponent, SalesInvoiceComponent, HolidayComponent,SalaryProcessComponent
  ]
})
export class AppModule { }
