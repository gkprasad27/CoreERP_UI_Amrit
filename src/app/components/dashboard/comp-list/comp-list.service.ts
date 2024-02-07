import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { CompanyComponent } from './company/company.component';
import { BranchesComponent } from './branches/branches.component';
import { CostCenterComponent } from './cost-center/cost-center.component';
import { LanguageComponent } from './language/language.component';
import { CurrencyComponent } from './currency/currency.component';
import { CountryComponent } from './country/country.component';
import { RegionComponent } from './region/region.component';
import { StateComponent } from './state/state.component';
import { UOMComponent } from './sizes/sizes.component';
import { SegmentComponent } from './segment/segment.component';
import { ProfitCenterComponent } from './profit-center/profit-center.component';
import { DivisionComponent } from './division/division.component';
import { FunctionalDepartmentComponent } from './functionaldepatment/functionaldepartment.component';
import { PlantsComponent } from './plants/plants.component';
import { LocationsComponent } from './location/location.component';
import { SalesDepartmentComponent } from './salesdepartment/salesdepartment.component';
import { DistributionchannelsComponent } from './distributionchannel/distributionchannel.component';
import { SalesofficeComponent } from './salesoffice/salesoffice.component';
import { SalesGroupComponent } from './salesgroup/salesgroup.component';
import { MaintenceAreaComponent } from './maintencearea/maintencearea.component';
import { PurchaseDepartmentComponent } from './purchasedepartment/purchasedepartment.component';
import { StorageLocationsComponent } from './storagelocation/storagelocation.component';
import { ErpUsersComponent } from './erpuser/erpuser.componet';
import { LedgerComponent } from './ledger/ledger.component';
import { OpenLedgerComponent } from './openledger/openledger.component';
import { VoucherClassComponent } from './voucherclass/voucherclass.component';
import { VoucherTypesComponent } from './vouchertypes/vouchertypes.component';
import { VoucherSeriesComponents } from './voucherseries/voucherseries.component';
import { AssignmentVoucherSeriestoVoucherTypesComponent } from './assignmentvoucherseriestovouchertype/assignmentvoucherseriestovouchertype.component';
import { TaxRatesComponents } from './taxrates/taxrates.component';
import { TaxTransactionComponent } from './taxtransaction/taxtransaction.component';
import { TaxIntegrationComponent } from './taxintegration/taxintegration.component';
import { AssignmentoftaxaccountstotaxcodesComponent } from './assignmentoftaxaccountstotaxcodes/assignmentoftaxaccountstotaxcodes.component';
import { HsnSacComponent } from './hsnsac/hsnsac.component';
import { TDSComponent } from './tdstype/tdstype.component';
import { IncomeTypeComponent } from './incometypes/incometypes.component';
import { TdsRatesComponent } from './tdsrates/tdsrates.component';
import { PostingComponent } from './posting/posting.component';
import { AccountsGroupComponent } from './accountsgroup/accountsgroup.component';
import { UndersubGroupComponent } from './undersubgroup/undersubgroup.component';
import { AccountchartComponent } from './chartofaccount/chartofaccount.component';
import { PartnerTypesComponent } from './partnertype/partnertype.component';
import { AssignmentChartAccounttoCompanyComponent } from './AssignmentChartAccounttoCompany/AssignmentChartAccounttoCompany.component';
import { BusienessPartnerGroupsComponent } from './partnergroup/partnergroup.component';
import { NumberRangeComponent } from './numberrange/numberrange.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AlternateControlAccountComponent } from './AlternateControlAccount/AlternateControlAccount.component';
import { DepreciationareasComponent } from './Depreciationareas/Depreciationareas.component';
import { AssetClassComponent } from './AssetClass/AssetClass.component';
import { AssetBlockComponent } from './assetblock/assetblock.component';
import { PaymentTermsComponent } from './paymentterms/paymentterms.component';
import { AssetNumberRangeComponent } from './assetnumberrange/assetnumberrange.component';
import { AseetClassToAssetBlockComponent } from './AssignmentAssetClasstoAssetBlock/AssignmentAssetClasstoAssetBlock.component';
import { AssetTransactionTypeComponent } from './assettransactiontypes/assettransactiontypes.component';
import { AccountKeyComponent } from './accountkey/accountkey.component';
import { BankMasterComponent } from './bankmaster/bankmaster.component';
import { AssignmentAccountKeytoAssetClassComponent } from './AssignmentsAccountKeytoAssetClass/AssignmentsAccountKeytoAssetClass.component';
import { DepreciationcodeComponent } from './depreciationcode/depreciationcode.component';
import { BusienessPartnerAccountComponent } from './businesspartner/businesspartner.component';
import { GLAccountComponent } from './glaccount/glaccount.component';
import { MainAssetMasterComponent } from './mainassetmasters/mainassetmasters.component';
import { SubAssetsComponent } from './subassets/subassets.component';
import { AssignGLaccounttoSubGroupComponent } from './assignglaccount/assignglaccount.component';
import { GLSubAccountComponent } from './glsubaccount/glsubaccount.component';
import { AssetBegningAcqusitionComponent } from './assetbegningacqusition/assetbegningacqusition.component';
import { BusienessTransactionTypeComponent } from './businesstransactiontypes/businesstransactiontypes.component';
import { AssetBegningAccumulatedDepreciationComponent } from './assetbegningaccumulateddepreciation/assetbegningaccumulateddepreciation.component';
import { PurchasinggroupsComponent } from './purchasinggroups/purchasinggroups.component';
import { PurchasingpersonComponent } from './purchasingperson/purchasingperson.component';
import { RequisitionNumberRangeComponent } from './requisitionnumberrange/requisitionnumberrange.component';
import { RequisitionAssignmentComponent } from './requisitionassignment/requisitionassignment.component';
import { PurchasingtypeComponent } from './purchasingtype/purchasingtype.component';
import { QuotationNumberRangeComponent } from './quotationnumberrange/quotationnumberrange.component';
import { QuotationAssignmentComponent } from './quotationnumberassignment/quotationnumberassignment.component';
import { PurchaseordertypeComponent } from './purchaseordertype/purchaseordertype.component';
import { SupplierTermsandconditionsComponent } from './suppliertermsandconditions/suppliertermsandconditions.component';
import { PurchaseOrderNumberRangeComponent } from './purchaseordernumberrange/purchaseordernumberrange.component';
import { PurchaseOrderAssignmentComponent } from './purchaseordernumberassignment/purchaseordernumberassignment.component';
import { StoresTypeComponent } from './storetypes/storetypes.component';
import { RejectionReasonsComponent } from './rejectionreasons/rejectionreasons.component';
import { MovementtypeComponent } from './movementtype/movementtype.component';
import { LotSeriesComponent } from './lotseries/lotseries.component';
import { StoresAssignmentComponent } from './lotseriesassignment/lotseriesassignment.component';
import { GoodsReceiptNoteNumberSeriesComponent } from './grnnumberseries/grnnumberseries.component';
import { GoodsReceiptNoteAssignmentComponent } from './grnnoassignment/grnnoassignment.component';
import { GoodsIssueNoteNumberSeriesComponent } from './ginnumberseries/ginnumberseries.component';
import { GoodsIssueNoteAssignmentComponent } from './ginassignment/ginassignment.component';
import { MaterialRequisitionNoteNumberSeriesComponent } from './mrnnumberseries/mrnnumberseries.component';
import { MaterialRequisitionNoteAssignmentComponent } from './mrnassignment/mrnassignment.component';
import { MaterialGroupsComponent } from './materialgroups/materialgroups.component';
import { MaterialTypesComponent } from './materialtypes/materialtypes.component';
import { ModelPatternComponent } from './modelpattern/modelpattern.component';
import { MaterialNumberRangeComponent } from './materialnumberrange/materialnumberrange.component';
import { MaterialNumberAsssignmentComponent } from './materialassignment/materialassignment.component';
import { BinsCreationComponent } from './binscreation/binscreation.component';
import { PurchaseRequisitionNumberRangeComponent } from './purchaserequisitionnumberrange/purchaserequisitionnumberrange.component';
import { MaterialSizeComponent } from './materialsize/materialsize.component';
import { MaterialMasterComponent } from './materialsmaster/materialsmaster.component';
import { PrimaryCostElementsCreationComponent } from './primarycostelement/primarycostelement.component';
import { SecondaryCostElementsCreationComponent } from './secondarycostelement/secondarycostelement.component';
import { CoastingActivitiesComponent } from './activities/activities.component';
import { CostingKeyFiguresComponent } from './keyfigures/keyfigures.component';
import { CostingObjectTypesComponent } from './costobjecttypes/costobjecttypes.component';
import { CostingObjectNumberSeriesComponent } from './costobjectnumberseries/costobjectnumberseries.component';
import { AssignmentOfNumberSeriesToObjectTypesComponent } from './assignnumberseries/assignnumberseries.component';
import { CreationOfCostUnitsComponent } from './costunits/costunits.component';
import { BatchMasterComponent } from './batchmaster/batchmaster.component';
import { OrderTypeComponent } from './ordertype/ordertype.component';
import { ProcessComponent } from './process/process.component';
import { DownTimeReasonComponent } from './downtimereasons/downtimereasons.component';
import { StandardRateComponent } from './standardrateoutput/standardrateoutput.component';
import { FormulasComponent } from './formulas/formulas.component';
import { CommitmentItemComponent } from './commitmentitem/commitmentitem.component';
import { FundCenterComponent } from './fundcenter/fundcenter.component';
import { WorkBreakDownStructureComponent } from './wbdse/wbdse.component';
import { TasksComponent } from './tasks/tasks.component';
import { RoutingFileComponent } from './routingfile/routingfile.component';
import { WorkCenterCreationComponent } from './workcentercreation/workcentercreation.component';
import { InvoiceverificationComponent } from './invoiceverification/invoiceverification.component';
import { EmployeeComponent } from './employee/employee.component';
import { LeavetypeComponent } from './leavetype/leavetype.component';
import { LeaveopeningbalanceComponent } from './leaveopeningbalance/leaveopeningbalance.component';
import { LeaveRequestComponent } from './leaverequest/leaverequest.component';
import { ApplyodComponent } from './applyod/applyod.component';
import { AdvanceComponent } from './advance/advance.component';
import { ComponentMasterComponent } from './componentmaster/componentmaster.component';
import { CTCBreakupComponent } from './ctcbreakup/ctcbreakup.component';
import { VehicleRequisitionsComponent } from './vehiclerequisition/vehiclerequisition.component';
import { PermissionRequestComponent } from './permissionrequest/permissionrequest.component';
import { PFMasterComponent } from './pfmaster/pfmaster.component';
import { PTMasterComponent } from './ptmaster/ptmaster.component';
import { ApprovalTypeComponent } from './approvaltype/approvaltype.component';
import { OpeningBalanceComponent } from './openingBalance/openingBalance.component';
import { advanceApprovalComponent } from './advanceapproval/advanceapproval.component';
import { VehicleApprovalsComponent } from './vehicleapproval/vehicleapproval.component';
import { odApprovalComponent } from './odapproval/odapproval.component';
import { PermissionApprovalsComponent } from './permissionapproval/permissionapproval.component';
import { LeaveApprovalComponent } from './leaveapproval/leaveapproval.component';
import { DesignationComponent } from './designation/designation.component';
import { HolidayComponent } from './holiday/holiday.component';
import { StructureCreationComponent } from './structurecreation/structurecreation.component';
import { DispatchdetailsComponent } from './dispatchdetails/dispatchdetails.component';
import { SalaryProcessComponent} from './salaryproces/salaryprocess.component';
import { QuorantineComponent } from './quorantine/quorantine.component';
import { CAPAdetailsComponent } from './capadetails/capadetails.component';
import { QcparamconfigurationComponent } from './qcparamconfiguration/qcparamconfiguration.component';
@Injectable({
  providedIn: 'root'
})
export class CompListService {
  dynamicComp = { component: null, tableUrl: null, list: null, editKey: null, searchCol: null };
  // dynamicComp = { component: null };

  constructor(
    private apiConfigService: ApiConfigService) { }

  getDynComponents(data) {
    switch (data) {

      case 'assignglaccount':
        this.dynamicComp.component = AssignGLaccounttoSubGroupComponent;
        return this.dynamicComp.component;
        break;
      case 'glsubaccount':
        this.dynamicComp.component = GLSubAccountComponent;
        return this.dynamicComp.component;
        break;
      case 'assetbegningacqusition':
        this.dynamicComp.component = AssetBegningAcqusitionComponent;
        return this.dynamicComp.component;
        break;
      case 'businesstransactiontypes':
        this.dynamicComp.component = BusienessTransactionTypeComponent;
        return this.dynamicComp.component;
        break;
      case 'assetbegningaccumulateddepreciation':
        this.dynamicComp.component = AssetBegningAccumulatedDepreciationComponent;
        return this.dynamicComp.component;
        break;
      case 'company':
        this.dynamicComp.component = CompanyComponent;
        return this.dynamicComp.component;
        break;

      case 'branches':
        this.dynamicComp.component = BranchesComponent;
        return this.dynamicComp.component;
        break;
      case 'costcenter':
        this.dynamicComp.component = CostCenterComponent;
        return this.dynamicComp.component;
        break;
      case 'language':
        this.dynamicComp.component = LanguageComponent;
        return this.dynamicComp.component;
        break;
      case 'currency':
        this.dynamicComp.component = CurrencyComponent;
        return this.dynamicComp.component;
        break;
      case 'country':
        this.dynamicComp.component = CountryComponent;
        return this.dynamicComp.component;
        break;
      case 'region':
        this.dynamicComp.component = RegionComponent;
        return this.dynamicComp.component;
        break;
      case 'state':
        this.dynamicComp.component = StateComponent;
        return this.dynamicComp.component;
        break;
      case 'sizes':
        this.dynamicComp.component = UOMComponent;
        return this.dynamicComp.component;
        break;
      case 'segment':
        this.dynamicComp.component = SegmentComponent;
        return this.dynamicComp.component;
        break;
      case 'profitCenter':
        this.dynamicComp.component = ProfitCenterComponent;
        return this.dynamicComp.component;
        break;
      case 'division':
        this.dynamicComp.component = DivisionComponent;
        return this.dynamicComp.component;
        break;
      case 'functionaldepatment':
        this.dynamicComp.component = FunctionalDepartmentComponent;
        return this.dynamicComp.component;
        break;
      case 'plant':
        this.dynamicComp.component = PlantsComponent;
        return this.dynamicComp.component;
        break;
        break;
      case 'location':
        this.dynamicComp.component = LocationsComponent;
        return this.dynamicComp.component;
        break;
      case 'salesdepartment':
        this.dynamicComp.component = SalesDepartmentComponent;
        return this.dynamicComp.component;
        break;
      case 'distributionchannel':
        this.dynamicComp.component = DistributionchannelsComponent;
        return this.dynamicComp.component;
        break;
      case 'salesoffice':
        this.dynamicComp.component = SalesofficeComponent;
        return this.dynamicComp.component;
        break;
      case 'salesgroup':
        this.dynamicComp.component = SalesGroupComponent;
        return this.dynamicComp.component;
        break;
      case 'maintenancearea':
        this.dynamicComp.component = MaintenceAreaComponent;
        return this.dynamicComp.component;
        break;
      case 'purchasedepartment':
        this.dynamicComp.component = PurchaseDepartmentComponent;
        return this.dynamicComp.component;
        break;
      case 'storagelocation':
        this.dynamicComp.component = StorageLocationsComponent;
        return this.dynamicComp.component;
        break;
      case 'erpuser':
        this.dynamicComp.component = ErpUsersComponent;
        return this.dynamicComp.component;
        break;
      case 'ledger':
        this.dynamicComp.component = LedgerComponent;
        return this.dynamicComp.component;
        break;
      case 'openledger':
        this.dynamicComp.component = OpenLedgerComponent;
        return this.dynamicComp.component;
        break;
      case 'voucherclass':
        this.dynamicComp.component = VoucherClassComponent;
        return this.dynamicComp.component;
        break;
      case 'vouchertype':
        this.dynamicComp.component = VoucherTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'voucherseries':
        this.dynamicComp.component = VoucherSeriesComponents;
        return this.dynamicComp.component;
        break;
      case 'assignmentofvoucherseriestovouchertype':
        this.dynamicComp.component = AssignmentVoucherSeriestoVoucherTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'taxrates':
        this.dynamicComp.component = TaxRatesComponents;
        return this.dynamicComp.component;
        break;
      case 'taxtransactions':
        this.dynamicComp.component = TaxTransactionComponent;
        return this.dynamicComp.component;
        break;
      case 'taxtypes':
        this.dynamicComp.component = TaxIntegrationComponent;
        return this.dynamicComp.component;
        break;
      case 'assignmentoftaxaccountstotaxcodes':
        this.dynamicComp.component = AssignmentoftaxaccountstotaxcodesComponent;
        return this.dynamicComp.component;
        break;
      case 'hsnsac':
        this.dynamicComp.component = HsnSacComponent;
        return this.dynamicComp.component;
        break;
      case 'tdstypes':
        this.dynamicComp.component = TDSComponent;
        return this.dynamicComp.component;
        break;
      case 'incometypes':
        this.dynamicComp.component = IncomeTypeComponent;
        return this.dynamicComp.component;
        break;
      case 'tdsrates':
        this.dynamicComp.component = TdsRatesComponent;
        return this.dynamicComp.component;
        break;
      case 'posting':
        this.dynamicComp.component = PostingComponent;
        return this.dynamicComp.component;
        break;
      case 'accountgroup':
        this.dynamicComp.component = AccountsGroupComponent;
        return this.dynamicComp.component;
        break;
      case 'glsubgroups':
        this.dynamicComp.component = UndersubGroupComponent;
        return this.dynamicComp.component;
        break;
      case 'accountchart':
        this.dynamicComp.component = AccountchartComponent;
        return this.dynamicComp.component;
        break;
      case 'AssignmentChartAccounttoCompany':
        this.dynamicComp.component = AssignmentChartAccounttoCompanyComponent;
        return this.dynamicComp.component;
        break;
      case 'partnertype':
        this.dynamicComp.component = PartnerTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'partnergroup':
        this.dynamicComp.component = BusienessPartnerGroupsComponent;
        return this.dynamicComp.component;
        break;
      case 'numberrange':
        this.dynamicComp.component = NumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'assignment':
        this.dynamicComp.component = AssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'AlternateControlAccount':
        this.dynamicComp.component = AlternateControlAccountComponent;
        return this.dynamicComp.component;
        break;
      case 'Depreciationareas':
        this.dynamicComp.component = DepreciationareasComponent;
        return this.dynamicComp.component;
        break;
      case 'AssetClass':
        this.dynamicComp.component = AssetClassComponent;
        return this.dynamicComp.component;
        break;
      case 'assetblock':
        this.dynamicComp.component = AssetBlockComponent;
        return this.dynamicComp.component;
        break;

      case 'paymentterms':
        this.dynamicComp.component = PaymentTermsComponent;
        return this.dynamicComp.component;
        break;

      case 'assetnumberrange':
        this.dynamicComp.component = AssetNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'AssignmentAssetClasstoAssetBlock':
        this.dynamicComp.component = AseetClassToAssetBlockComponent;
        return this.dynamicComp.component;
        break;
      case 'assettransactiontypes':
        this.dynamicComp.component = AssetTransactionTypeComponent;
        return this.dynamicComp.component;
        break;
      case 'accountkey':
        this.dynamicComp.component = AccountKeyComponent;
        return this.dynamicComp.component;
        break;
      case 'AssignmentsAccountKeytoAssetClass':
        this.dynamicComp.component = AssignmentAccountKeytoAssetClassComponent;
        return this.dynamicComp.component;
        break;
      case 'bankmaster':
        this.dynamicComp.component = BankMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'depreciationcode':
        this.dynamicComp.component = DepreciationcodeComponent;
        return this.dynamicComp.component;
        break;
      case 'glaccount':
        this.dynamicComp.component = GLAccountComponent;
        return this.dynamicComp.component;
        break;
      case 'businesspartner':
        this.dynamicComp.component = BusienessPartnerAccountComponent;
        return this.dynamicComp.component;
        break;
      case 'mainassetmaster':
        this.dynamicComp.component = MainAssetMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'subassets':
        this.dynamicComp.component = SubAssetsComponent;
        return this.dynamicComp.component;
        break;
      case 'purchasinggroups':
        this.dynamicComp.component = PurchasinggroupsComponent;
        return this.dynamicComp.component;
        break;
      case 'purchasingperson':
        this.dynamicComp.component = PurchasingpersonComponent;
        return this.dynamicComp.component;
        break;
      case 'requisitionnumberrange':
        this.dynamicComp.component = RequisitionNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'requisitionnumberassignment':
        this.dynamicComp.component = RequisitionAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'quotationnumberrange':
        this.dynamicComp.component = QuotationNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'quotationnumberassignment':
        this.dynamicComp.component = QuotationAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'purchaseordertype':
        this.dynamicComp.component = PurchaseordertypeComponent;
        return this.dynamicComp.component;
        break;

      case 'suppliertermsandconditions':
        this.dynamicComp.component = SupplierTermsandconditionsComponent;
        return this.dynamicComp.component;
        break;
      case 'purchaseordernumberrange':
        this.dynamicComp.component = PurchaseOrderNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'purchaseordernumberassignment':
        this.dynamicComp.component = PurchaseOrderAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'storetypes':
        this.dynamicComp.component = StoresTypeComponent;
        return this.dynamicComp.component;
        break;
      case 'rejectionreasons':
        this.dynamicComp.component = RejectionReasonsComponent;
        return this.dynamicComp.component;
        break;
      case 'movementtype':
        this.dynamicComp.component = MovementtypeComponent;
        return this.dynamicComp.component;
        break;
      case 'lotseries':
        this.dynamicComp.component = LotSeriesComponent;
        return this.dynamicComp.component;
        break;
      case 'lotseriesassignment':
        this.dynamicComp.component = StoresAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'grnnumberseries':
        this.dynamicComp.component = GoodsReceiptNoteNumberSeriesComponent;
        return this.dynamicComp.component;
        break;
      case 'grnnoassignment':
        this.dynamicComp.component = GoodsReceiptNoteAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'purchasingtype':
        this.dynamicComp.component = PurchasingtypeComponent;
        return this.dynamicComp.component;
        break;
      case 'ginnumberseries':
        this.dynamicComp.component = GoodsIssueNoteNumberSeriesComponent;
        return this.dynamicComp.component;
        break;
      case 'ginassignment':
        this.dynamicComp.component = GoodsIssueNoteAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'mrnnumberseries':
        this.dynamicComp.component = MaterialRequisitionNoteNumberSeriesComponent;
        return this.dynamicComp.component;
        break;
      case 'mrnassignment':
        this.dynamicComp.component = MaterialRequisitionNoteAssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'materialgroups':
        this.dynamicComp.component = MaterialGroupsComponent;
        return this.dynamicComp.component;
        break;
      case 'materialtypes':
        this.dynamicComp.component = MaterialTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'modelpattern':
        this.dynamicComp.component = ModelPatternComponent;
        return this.dynamicComp.component;
        break;
      case 'materialnumberrange':
        this.dynamicComp.component = MaterialNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'materialassignment':
        this.dynamicComp.component = MaterialNumberAsssignmentComponent;
        return this.dynamicComp.component;
        break;
      case 'purchaserequisitionnumberrange':
        this.dynamicComp.component = PurchaseRequisitionNumberRangeComponent;
        return this.dynamicComp.component;
        break;
      case 'binscreation':
        this.dynamicComp.component = BinsCreationComponent;
        return this.dynamicComp.component;
        break;
      case 'materialsize':
        this.dynamicComp.component = MaterialSizeComponent;
        return this.dynamicComp.component;
        break;
      case 'materialsmaster':
        this.dynamicComp.component = MaterialMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'primarycostelement':
        this.dynamicComp.component = PrimaryCostElementsCreationComponent;
        return this.dynamicComp.component;
        break;
      case 'secondarycostelement':
        this.dynamicComp.component = SecondaryCostElementsCreationComponent;
        return this.dynamicComp.component;
        break;
      case 'activities':
        this.dynamicComp.component = CoastingActivitiesComponent;
        return this.dynamicComp.component;
        break;
      case 'keyfigures':
        this.dynamicComp.component = CostingKeyFiguresComponent;
        return this.dynamicComp.component;
        break;
      case 'costobjecttypes':
        this.dynamicComp.component = CostingObjectTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'costobjectnumberseries':
        this.dynamicComp.component = CostingObjectNumberSeriesComponent;
        return this.dynamicComp.component;
        break;
      case 'assignnumberseries':
        this.dynamicComp.component = AssignmentOfNumberSeriesToObjectTypesComponent;
        return this.dynamicComp.component;
        break;
      case 'costunits':
        this.dynamicComp.component = CreationOfCostUnitsComponent;
        return this.dynamicComp.component;
        break;
      case 'batchmaster':
        this.dynamicComp.component = BatchMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'ordertype':
        this.dynamicComp.component = OrderTypeComponent;
        return this.dynamicComp.component;
        break;
      case 'process':
        this.dynamicComp.component = ProcessComponent;
        return this.dynamicComp.component;
        break;
      case 'downtimereasons':
        this.dynamicComp.component = DownTimeReasonComponent;
        return this.dynamicComp.component;
        break;
      // case 'standardrateoutput':
      //   this.dynamicComp.component = StandardRateComponent;
      //   return this.dynamicComp.component;
      //   break;
      case 'formulas':
        this.dynamicComp.component = FormulasComponent;
        return this.dynamicComp.component;
        break;
      case 'commitmentitem':
        this.dynamicComp.component = CommitmentItemComponent;
        return this.dynamicComp.component;
        break;
      case 'qcparamconfiguration':
        this.dynamicComp.component = QcparamconfigurationComponent;
        return this.dynamicComp.component;
        break;
      case 'fundcenter':
        this.dynamicComp.component = FundCenterComponent;
        return this.dynamicComp.component;
        break;
      case 'wbdse':
        this.dynamicComp.component = WorkBreakDownStructureComponent;
        return this.dynamicComp.component;
        break;
      case 'tasks':
        this.dynamicComp.component = TasksComponent;
        return this.dynamicComp.component;
        break;
      case 'routingfile':
        this.dynamicComp.component = RoutingFileComponent;
        return this.dynamicComp.component;
        break;
      case 'workcentercreation':
        this.dynamicComp.component = WorkCenterCreationComponent;
        return this.dynamicComp.component;
        break;
      case 'invoiceverification':
        this.dynamicComp.component = InvoiceverificationComponent;
        return this.dynamicComp.component;
        break;
      case 'employee':
        this.dynamicComp.component = EmployeeComponent;
        return this.dynamicComp.component;
        break;
      case 'leavetype':
        this.dynamicComp.component = LeavetypeComponent;
        return this.dynamicComp.component;
        break;
      case 'leaveopeningbalance':
        this.dynamicComp.component = LeaveopeningbalanceComponent;
        return this.dynamicComp.component;
        break;
      case 'Leaverequest':
        this.dynamicComp.component = LeaveRequestComponent;
        return this.dynamicComp.component;
        break;
      case 'applyod':
        this.dynamicComp.component = ApplyodComponent;
        return this.dynamicComp.component;
        break;
      case 'advance':
        this.dynamicComp.component = AdvanceComponent;
        return this.dynamicComp.component;
        break;
      case 'componentmaster':
        this.dynamicComp.component = ComponentMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'CTCBreakup':
        this.dynamicComp.component = CTCBreakupComponent;
        return this.dynamicComp.component;
        break;
      case 'vehiclerequisition':
        this.dynamicComp.component = VehicleRequisitionsComponent;
        return this.dynamicComp.component;
        break;
      case 'permissionrequest':
        this.dynamicComp.component = PermissionRequestComponent;
        return this.dynamicComp.component;
        break;
      case 'ptmaster':
        this.dynamicComp.component = PTMasterComponent;
        return this.dynamicComp.component;
        break;
      case 'pfmaster':
        this.dynamicComp.component = PFMasterComponent;
        return this.dynamicComp.component;
      case 'approvaltype':
        this.dynamicComp.component = ApprovalTypeComponent;
        return this.dynamicComp.component;
      case 'openingBalance':
        this.dynamicComp.component = OpeningBalanceComponent;
        return this.dynamicComp.component;
      case 'advanceApproval':
        this.dynamicComp.component = advanceApprovalComponent;
        return this.dynamicComp.component;
      case 'vehicleapproval':
        this.dynamicComp.component = VehicleApprovalsComponent;
        return this.dynamicComp.component;
      case 'odApproval':
        this.dynamicComp.component = odApprovalComponent;
        return this.dynamicComp.component;
      case 'permissionapproval':
        this.dynamicComp.component = PermissionApprovalsComponent;
        return this.dynamicComp.component;
      case 'leaveApproval':
        this.dynamicComp.component = LeaveApprovalComponent;
        return this.dynamicComp.component;
      case 'designation':
        this.dynamicComp.component = DesignationComponent;
        return this.dynamicComp.component;
      case 'holiday':
        this.dynamicComp.component = HolidayComponent;
        return this.dynamicComp.component;
      case 'structurecreation':
        this.dynamicComp.component = StructureCreationComponent;
        return this.dynamicComp.component;
        break;
      case 'dispatchdetails':
        this.dynamicComp.component = DispatchdetailsComponent;
        return this.dynamicComp.component;
        break;
        case 'salaryprocess':
        this.dynamicComp.component = SalaryProcessComponent;
        return this.dynamicComp.component;
        break;
        case 'quorantine':
        this.dynamicComp.component = QuorantineComponent;
        return this.dynamicComp.component;
        break;
        case 'CAPAdetails':
        this.dynamicComp.component = CAPAdetailsComponent;
        return this.dynamicComp.component;
        break;
      default:
    }
  }
}
