import { Injectable } from '@angular/core';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
   providedIn: 'root'
})

export class ApiConfigService {

   constructor(private environment: RuntimeConfigService) { }

   // login Url
   loginUrl = `${this.environment.runtimeConfig.serverUrl}Auth/login`;
  //loginUrl = 'http://localhost:5000/api/Auth/login';
   logoutUrl = `${this.environment.runtimeConfig.serverUrl}Auth/logout`;
   getBranchesForUser = `${this.environment.runtimeConfig.serverUrl}Auth/GetBranchesForUser`;
   //getBranchesForUser = 'http://localhost:5000/api/Auth/GetBranchesForUser';
   getComponentInfo = `${this.environment.runtimeConfig.serverUrl}Settings/GetComponentInfo`;
   
   getAuthentication = `${this.environment.runtimeConfig.serverUrl}Common/GetAuthentication`;
   
   // Common
   getprimeryList = `${this.environment.runtimeConfig.serverUrl}PrimaryCostElementsCreation/GetPrimaryCostElementsCreationList`;
   getprcList = `${this.environment.runtimeConfig.serverUrl}Common/GetPrimaryCostElementList`;
   getMaterialListforcostunits = `${this.environment.runtimeConfig.serverUrl}Common/GetMaterialListForCostunits`;
   gethsnsacList = `${this.environment.runtimeConfig.serverUrl}Common/GetHSNSACList`;
   getGoodsreceiptDataList = `${this.environment.runtimeConfig.serverUrl}Common/GetGoodsReceiptList`;
   getinspectioncheckList = `${this.environment.runtimeConfig.serverUrl}Common/GetInspectiondetailsList`;
   getinspectionnoList = `${this.environment.runtimeConfig.serverUrl}Common/GetInspectionnoList`;
   getBusienessPartnersAccList = `${this.environment.runtimeConfig.serverUrl}BusienessPartnerAccount/GetBusienessPartnerAccountList`;
   gettinglotNumbers = `${this.environment.runtimeConfig.serverUrl}GoodsReceipt/GetLotNumber`;
   getpodetailsList = `${this.environment.runtimeConfig.serverUrl}Common/GetPOdetailsList`;
   getpurchasenoList = `${this.environment.runtimeConfig.serverUrl}Common/GetPurchaseOrdernoList`;
   getJobworkList = `${this.environment.runtimeConfig.serverUrl}Common/GetJobworkList`;
   getquotationnoList = `${this.environment.runtimeConfig.serverUrl}Common/GetQuotationnoList`;
   getSaleOrderList  = `${this.environment.runtimeConfig.serverUrl}Common/GetSaleOrderList`;
   getSaleOrders  = `${this.environment.runtimeConfig.serverUrl}Common/GetSaleOrder`;
   getsaleOrdernoListe  = `${this.environment.runtimeConfig.serverUrl}Common/GetsaleOrdernoListe`;
   getsaleOrdernoList  = `${this.environment.runtimeConfig.serverUrl}Common/GetsaleOrdernoList`;
   getSaleOrderData   = `${this.environment.runtimeConfig.serverUrl}Common/GetSaleOrderData`;
   getProdSaleOrderList   = `${this.environment.runtimeConfig.serverUrl}Common/GetProdSaleOrderList`;
   getCommitmentList = `${this.environment.runtimeConfig.serverUrl}QCParamConfig/GetCommitmentItemList`;
   getCommitmentLists = `${this.environment.runtimeConfig.serverUrl}CommitmentItem/GetCommitmentItemList`;
   getfundcenterList = `${this.environment.runtimeConfig.serverUrl}FundCenter/GetFundCenterList`;
   getWCList = `${this.environment.runtimeConfig.serverUrl}Common/GetWorkcenterList`;
   getFormulaList = `${this.environment.runtimeConfig.serverUrl}Formulas/GetFormulasList`;
   getreqdetailsList = `${this.environment.runtimeConfig.serverUrl}Common/GetMaterialreqDetailsList`;
   getreqList = `${this.environment.runtimeConfig.serverUrl}Common/GetMaterialreqList`;
   getmomenttypeList = `${this.environment.runtimeConfig.serverUrl}Movementtype/GetMovementtypeList`;
   getordernolist = `${this.environment.runtimeConfig.serverUrl}OrderType/GetOrderTypeList`;
   getwbselement = `${this.environment.runtimeConfig.serverUrl}Common/GetWbsList`;
   getbatchList = `${this.environment.runtimeConfig.serverUrl}BatchMaster/GetBatchMasterList`;
   getCostUnitListList = `${this.environment.runtimeConfig.serverUrl}CreationOfCostUnits/GetCreationOfCostUnitsList`;
   getcostnumberseriesList = `${this.environment.runtimeConfig.serverUrl}Common/GetCostingNumberSeriesList`;
   getcostofobjectList = `${this.environment.runtimeConfig.serverUrl}Common/GetCostingObjectTypeList`;
   getsecondelementList = `${this.environment.runtimeConfig.serverUrl}Common/GetCostingSecondaryList`;
   getdepartmentList = `${this.environment.runtimeConfig.serverUrl}Common/GetDepartmentList`;
   getttingobjectNumbers = `${this.environment.runtimeConfig.serverUrl}CreationOfCostUnits/GetObjectNumber`;
   getMaterialtypeList = `${this.environment.runtimeConfig.serverUrl}MaterialTypes/GetMaterialTypesList`;
   getttingmaterialNumbers = `${this.environment.runtimeConfig.serverUrl}MaterialMaster/GetMaterialNumber`;
   getuomList = `${this.environment.runtimeConfig.serverUrl}Common/GetUOMList`;
   getmaterialdata = `${this.environment.runtimeConfig.serverUrl}Common/GetMaterialMasterList`;
   getModelPatternList = `${this.environment.runtimeConfig.serverUrl}ModelPattern/GetModelPatternList`;
   getmsizeList = `${this.environment.runtimeConfig.serverUrl}MaterialSize/GetMaterialSizeList`;
   getmaterialgroupList = `${this.environment.runtimeConfig.serverUrl}MaterialGroups/GetMaterialGroupsList`;
   getMaterialList = `${this.environment.runtimeConfig.serverUrl}Common/GetMaterialList`;
   getStList = `${this.environment.runtimeConfig.serverUrl}StorageLocation/GetStorageLocation`;
   getpurchaseOrderTypeList = `${this.environment.runtimeConfig.serverUrl}Purchaseordertype/GetPurchaseordertypeList`;
   getPurchaseorderNumberList = `${this.environment.runtimeConfig.serverUrl}PurchaseOrderNumberRange/GetPurchaseOrderNumberRangeList`;
   getQuotationNumberRangeList = `${this.environment.runtimeConfig.serverUrl}QuotationNumberRange/GetQuotationNumberRangeList`;
   getnumberRangeList = `${this.environment.runtimeConfig.serverUrl}RequisitionNumberRange/GetRequisitionNumberRangeList`;
   getPurchasingtypeList = `${this.environment.runtimeConfig.serverUrl}Purchasingtype/GetPurchaseTypeList`;
   getPurchaseGroupList = `${this.environment.runtimeConfig.serverUrl}Purchasinggroups/GetPurchasinggroupsList`;
   getlanguageList = `${this.environment.runtimeConfig.serverUrl}Common/GetLanguageList`;
   getRegionsList = `${this.environment.runtimeConfig.serverUrl}Common/GetRegionList`;
   getCountrysList = `${this.environment.runtimeConfig.serverUrl}Common/GetCountrysList`;
   getcurrencyList = `${this.environment.runtimeConfig.serverUrl}Common/GetCurrencyList`;
   getstatesList = `${this.environment.runtimeConfig.serverUrl}Common/GetStatesList`;
   getCompanyList = `${this.environment.runtimeConfig.serverUrl}Common/GetCompanyList`;
   getcostingunitsList = `${this.environment.runtimeConfig.serverUrl}Common/GetCostUnitList`;
   getEmployeeList = `${this.environment.runtimeConfig.serverUrl}Common/GetEmployeeList`;
   getPlantsList = `${this.environment.runtimeConfig.serverUrl}Common/GetPlantsList`;
   getlocationsList = `${this.environment.runtimeConfig.serverUrl}Common/GetLocationsList`;
   getBranchList = `${this.environment.runtimeConfig.serverUrl}Common/GetBranchList`;
   getVoucherTypesList = `${this.environment.runtimeConfig.serverUrl}Common/GetVoucherTypesList`;
   getvochersseriesList = `${this.environment.runtimeConfig.serverUrl}Common/GetVouchersSeriesList`;
   getTaxTransactionsList = `${this.environment.runtimeConfig.serverUrl}Common/GetTaxTransactionsList`;
   gettaxrateList = `${this.environment.runtimeConfig.serverUrl}Common/GetTaxRateList`;
   getTDSRateList = `${this.environment.runtimeConfig.serverUrl}Common/GetTDSRateList`;
   getBusienessPartnersGroupsList = `${this.environment.runtimeConfig.serverUrl}Common/GetBusienessPartnersGroupsList`;
   getAssetsClassList = `${this.environment.runtimeConfig.serverUrl}Common/GetAssetsClassList`;
   getAssetsBlockList = `${this.environment.runtimeConfig.serverUrl}Common/GetAssetsBlockList`;
   getAccountsKeyList = `${this.environment.runtimeConfig.serverUrl}Common/GetAccountsKeyList`;
   getBankMastersList = `${this.environment.runtimeConfig.serverUrl}Common/GetBankMastersList`;
   getPaymentsTermsList = `${this.environment.runtimeConfig.serverUrl}Common/GetPaymentsTermsList`;
   getGLAccountListbyCatetory = `${this.environment.runtimeConfig.serverUrl}Common/GLAccountListbyCatetory`;
   getGLAccountsList = `${this.environment.runtimeConfig.serverUrl}Common/GetGLAccountsList`;
   getProfitCentersList = `${this.environment.runtimeConfig.serverUrl}Common/GetProfitCentersList`;
   getProfitCenters = `${this.environment.runtimeConfig.serverUrl}ProfitCenter/GetProfitCenters`;
   getCostCentersList = `${this.environment.runtimeConfig.serverUrl}Common/GetCostCentersList`;
   getCostCenters = `${this.environment.runtimeConfig.serverUrl}CostCenter/GetCostCenters`;
   getTaxRatesList = `${this.environment.runtimeConfig.serverUrl}TaxRates/GetTaxRatesList`;
   getBPList = `${this.environment.runtimeConfig.serverUrl}Common/GetBPList`;
   getCustomerList = `${this.environment.runtimeConfig.serverUrl}Common/GetCustomerList`;
   getpurchaseinvoiceList = `${this.environment.runtimeConfig.serverUrl}Common/GetPurchaseInvoiceList`;
   getAssetMasterList = `${this.environment.runtimeConfig.serverUrl}Common/GetMainAssetMasterList`;
   getSubAssetMasterList = `${this.environment.runtimeConfig.serverUrl}Common/GetSubAssetMasterList`;
   getFieldsConfig = `${this.environment.runtimeConfig.serverUrl}Common/GetFieldsConfig`;
   getUserPermissions = `${this.environment.runtimeConfig.serverUrl}Common/GetUserPermissions`;
   getLotSeriesUrlList = `${this.environment.runtimeConfig.serverUrl}LotSeries/GetLotSeriesList`;
   getGRNSeriesList = `${this.environment.runtimeConfig.serverUrl}GoodsReceiptNoteNumberSeries/GetGoodsReceiptNoteNumberSeriesList`;
   getMRNSeriesList = `${this.environment.runtimeConfig.serverUrl}MaterialRequisitionNoteNumberSeries/GetMaterialRequisitionNoteNumberSeriesList`;
   getMaterialSeriesList = `${this.environment.runtimeConfig.serverUrl}MaterialNumberRangeSeries/GetMaterialNumberRangeSeriesList`;
   getGINSeriesList = `${this.environment.runtimeConfig.serverUrl}GoodsIssueNoteNumberSeries/GetGoodsIssueNoteNumberSeriesList`;
   getHsnSacList = `${this.environment.runtimeConfig.serverUrl}HsnSac/GetHsnSacList`;
   getLeaveTypeatListforlob = `${this.environment.runtimeConfig.serverUrl}Common/GetLeaveTypeList`;
   //************************ IMG General  ****************************************/
   getCurrencyList = `${this.environment.runtimeConfig.serverUrl}Currency/GetCurrencyList`;
   getLanguageList = `${this.environment.runtimeConfig.serverUrl}Language/GetLanguageList`;
   getCompanysList = `${this.environment.runtimeConfig.serverUrl}Company/GetCompanysList`;
   getSegmentList = `${this.environment.runtimeConfig.serverUrl}Segment/GetSegmentList`;
   getProfitCenterList = `${this.environment.runtimeConfig.serverUrl}ProfitCenter/GetProfitCenterList`;
   getBranchesList = `${this.environment.runtimeConfig.serverUrl}Branches/GetBranchesList`;
   getDivisionsList = `${this.environment.runtimeConfig.serverUrl}Division/GetDivisionsList`;
   getfunctionaldeptList = `${this.environment.runtimeConfig.serverUrl}FunctionalDepartment/GetFunctionalDepartment`;
   GetCostCenterList = `${this.environment.runtimeConfig.serverUrl}CostCenter/GetCostCenterList`;
   getplantList = `${this.environment.runtimeConfig.serverUrl}Plant/GetPlant`;
   getlocationList = `${this.environment.runtimeConfig.serverUrl}Location/GetLocationList`;
   registerdepreciationcodeList = `${this.environment.runtimeConfig.serverUrl}Depreciationcode/RegisterDepreciationcode`;
   getdepreciationcodeDetail = `${this.environment.runtimeConfig.serverUrl}Depreciationcode/GetDepreciationcodeDetail`;
   registerpaymenttermsList = `${this.environment.runtimeConfig.serverUrl}PaymentTerms/RegisterPaymentTerms`;
   getpaymenttermDetail = `${this.environment.runtimeConfig.serverUrl}PaymentTerms/GetPaymentTermsDetail`;
   //mainasset
   registermainAssetsList = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/RegisterMainAssetMaster`;
   getMainAssetsDetail = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/GetMainAssetsDetail`;
   //subasset
   registerSubAssetsList = `${this.environment.runtimeConfig.serverUrl}SubAssets/RegisterSubAssetsdatas`;
   getSubAssetsDetail = `${this.environment.runtimeConfig.serverUrl}SubAssets/GetSubAssetsDetail`;
   //updateSubAssetsList= `${this.environment.runtimeConfig.serverUrl}SubAssets/UpdateSubAssetsList`;
   deleteSubAssetsList = `${this.environment.runtimeConfig.serverUrl}SubAssets/DeleteSubAssetsList`;
   ///************************ Accounting ************************** */
   getLedgerList = `${this.environment.runtimeConfig.serverUrl}Ledger/GetLedgerList`;
   getvocherclassList = `${this.environment.runtimeConfig.serverUrl}VoucherClass/GetVoucherClassList`;
   getDepreciationAreasList = `${this.environment.runtimeConfig.serverUrl}DepreciationAreas/GetDepreciationAreasList`;
   getAssetClassList = `${this.environment.runtimeConfig.serverUrl}AssetClass/GetAssetClassList`;
   getTaxTypesList = `${this.environment.runtimeConfig.serverUrl}TaxTypes/GetTaxTypesList`;
   subgrouplist = `${this.environment.runtimeConfig.serverUrl}AssignGLaccounttoSubGroup/GetGLUnderSubGroupList`;
   getTaxTransactionList = `${this.environment.runtimeConfig.serverUrl}TaxTransaction/GetTaxTransactionList`;
   getTDStypeList = `${this.environment.runtimeConfig.serverUrl}TDStype/GetTDStypeList`;
   getIncomeTypeList = `${this.environment.runtimeConfig.serverUrl}IncomeType/GetIncomeTypeList`;
   getGLAccountList = `${this.environment.runtimeConfig.serverUrl}GLAccount/GetGLAccountList`;
   getaccountNumber = `${this.environment.runtimeConfig.serverUrl}GLAccount/GetaccountNumberList`;
   getDepreciationcodeList = `${this.environment.runtimeConfig.serverUrl}Depreciationcode/GetDepreciationcodeList`;
   getAccountNamelist = `${this.environment.runtimeConfig.serverUrl}GLAccUnderSubGroup/GetAccountNamelist`;
   getGLUnderGroupList = `${this.environment.runtimeConfig.serverUrl}GLAccUnderSubGroup/GetAccountGrouplist`;
   getglAccgrpList = `${this.environment.runtimeConfig.serverUrl}GLAccUnderSubGroup/GetGLAccountGrouplist`;
   getAccountSubGrouplist = `${this.environment.runtimeConfig.serverUrl}GLAccUnderSubGroup/GetAccountSubGrouplist`;
   getNumberRangeList = `${this.environment.runtimeConfig.serverUrl}NumberRange/GetNumberRangeList`;
   getPartnerTypeList = `${this.environment.runtimeConfig.serverUrl}PartnerType/GetPartnerTypeList`;
   getChartOfAccountList = `${this.environment.runtimeConfig.serverUrl}ChartOfAccount/GetChartOfAccountList`;
   getAccountKeyList = `${this.environment.runtimeConfig.serverUrl}AccountKey/GetAccountKeyList`;
   getSubAssetsList = `${this.environment.runtimeConfig.serverUrl}SubAssets/GetSubAssetsList`;
   GetListsforMainAsset = `${this.environment.runtimeConfig.serverUrl}SubAssets/GetMainAsset`;
   getStructurekeyList = `${this.environment.runtimeConfig.serverUrl}AssignGLaccounttoSubGroup/GetStructurekeyList`;
   getbpNumbers = `${this.environment.runtimeConfig.serverUrl}BusienessPartnerAccount/GetBPtNumberList`;
   getttingbpNumbers = `${this.environment.runtimeConfig.serverUrl}BusienessPartnerAccount/GetBPtNumber`;
   getttingbpNames = `${this.environment.runtimeConfig.serverUrl}BusienessPartnerAccount/GetBPtName`;
   getBusienessPartnerAccount = `${this.environment.runtimeConfig.serverUrl}BusienessPartnerAccount/GetBusienessPartnerAccount`;

   getMainAssetMasterList = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/GetMainAssetMasterList`;
   getAssetnumber = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/GetAssetNumber`;
   getasetnos = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/GettingAssetNumber`;
   getttinasNames = `${this.environment.runtimeConfig.serverUrl}MainAssetMaster/GettingAssetName`;
   getBusienessTransactionTypeList = `${this.environment.runtimeConfig.serverUrl}BusienessTransactionType/GetBusienessTransactionTypeList`;
   //AssetBegningAcqusition
   registeraqsnList = `${this.environment.runtimeConfig.serverUrl}AssetBegningAcqusition/RegisterAssetBegningAcqusition`;
   updateAssetBegningAcqusition = `${this.environment.runtimeConfig.serverUrl}AssetBegningAcqusition/UpdateAssetBegningAcqusition`;
   getAqsnDetail = `${this.environment.runtimeConfig.serverUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionDetail`;
   getAcquisitionDetailsList = `${this.environment.runtimeConfig.serverUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionDetailsList`;
   getacquisitionlist = `${this.environment.runtimeConfig.serverUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionList`;

   /**************************** Settings ********************************************************* */
    getRoles = `${this.environment.runtimeConfig.serverUrl}Auth/getRoles`;
   //getRoles = 'http://localhost:5000/api/Auth/getRoles';
   getParentMenus = `${this.environment.runtimeConfig.serverUrl}Auth/getParentMenu`;
   //getParentMenus = 'http://localhost:5000/api/Auth/getParentMenu';
    getMenuList = `${this.environment.runtimeConfig.serverUrl}Auth/getMenuList`;
   //getMenuList = 'http://localhost:5000/api/Auth/getMenuList';
   giveAccess = `${this.environment.runtimeConfig.serverUrl}Auth/GiveAccess`;
   //giveAccess = 'http://localhost:5000/api/Auth/GiveAccess';
   getMenuUrl = `${this.environment.runtimeConfig.serverUrl}Auth/getMenu`;
   //getMenuUrl = 'http://localhost:5000/api/Auth/getMenu';
    getrolelist = `${this.environment.runtimeConfig.serverUrl}UserCreation/GetRoleList`;
    getUserCreation = `${this.environment.runtimeConfig.serverUrl}UserCreation/GetUserCreation`;
   //getrolelist = 'http://localhost:5000/api/UserCreation/GetRoleList';




   /******************************* Cash Bank ****************************************************** */
   addCashBank = `${this.environment.runtimeConfig.serverUrl}Transactions/AddCashBank`;
   getCashBankDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetCashBankDetail`;
   getCashBankMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetCashBankMaster`;
   getVoucherNumber = `${this.environment.runtimeConfig.serverUrl}Transactions/GetVoucherNumber`;
   returnCashBank = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnCashBank`;
   getDiscount = `${this.environment.runtimeConfig.serverUrl}Transactions/GetDiscount`;

   /******************************* Journal ****************************************************** */
   addJournal = `${this.environment.runtimeConfig.serverUrl}Transactions/AddJournal`;
   getJVDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJVDetail`;
   getJVMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJVMaster`;

   /******************************* Invoice & Memo ****************************************************** */
   addInvoiceMemo = `${this.environment.runtimeConfig.serverUrl}Transactions/AddInvoiceMemo`;
   getIMDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetIMDetail`;
   getIMMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetIMMaster`;

   /******************************* Asset Purchase & Sale ****************************************************** */
   addPSIMAsset = `${this.environment.runtimeConfig.serverUrl}Transactions/AddPSIMAsset`;
   getPSIMAssetDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPSIMAssetDetail`;
   getPSIMAssetMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPSIMAssetMaster`;
   /******************************* Asset Transfer ****************************************************** */
   getAssettransferDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetAssetTransferDetail`;
   addAssettransfer = `${this.environment.runtimeConfig.serverUrl}Transactions/AddAssetTransfer`;
   getAssettransferMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetAssetTransferMaster`;

   /******************************* Payment Receipts ****************************************************** */
   getPaymentsReceiptsDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPaymentsReceiptsDetail`;
   addPaymentsReceipts = `${this.environment.runtimeConfig.serverUrl}Transactions/AddPaymentsReceipts`;
   getPaymentsreceiptsMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPaymentsReceiptsMaster`;

   /*******************************BOM ****************************************************** */
   addBOM = `${this.environment.runtimeConfig.serverUrl}BillOfMaterial/AddBOM`;
   getBOMDetail = `${this.environment.runtimeConfig.serverUrl}BillOfMaterial/GetBomDetail`;
   getBOMMaster = `${this.environment.runtimeConfig.serverUrl}BillOfMaterial/GetBOMMasters`;
   getBOMNumber = `${this.environment.runtimeConfig.serverUrl}BillOfMaterial/GetVoucherNumber`;
   returnBOM = `${this.environment.runtimeConfig.serverUrl}BillOfMaterial/ReturnCashBank`;

   /*******************************Goods Issue ****************************************************** */
   addGoodsissue = `${this.environment.runtimeConfig.serverUrl}Transactions/AddGoodsissue`;
   getGoodsissueDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsissueDetail`;
   getGoodsissueDetails = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsissueDetails`;
   getGoodsissueMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsissue`;
   returnGoodsissue = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnGoodsissue`;
   getTagsissueDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetTagsissueDetail`;
   getQCissueDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQCissueDetail`;

   /*******************************Material Requisition ****************************************************** */
   addmareq = `${this.environment.runtimeConfig.serverUrl}Transactions/AddMaterialRequisition`;
   getmreqDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetMaterialRequisitionDetail`;
   getmreqMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetMaterialRequisition`;
   getProductionissue = `${this.environment.runtimeConfig.serverUrl}Transactions/GetProductionissue`;
   returnmreq = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnMaterialRequisition`;
   getQCConfigDetail = `${this.environment.runtimeConfig.serverUrl}StandardRate/GetQCConfigDetail`;
   getStandardRateList = `${this.environment.runtimeConfig.serverUrl}StandardRate/GetStandardRateList`;
   registerQCResults = `${this.environment.runtimeConfig.serverUrl}StandardRate/RegisterQCResults`;
   getSaleOrderDetailbymaterialcode = `${this.environment.runtimeConfig.serverUrl}StandardRate/GetSaleOrderDetailbymaterialcode`;

   /******************************* Work Center Creation ****************************************************** */
   //getPaymentsReceiptsDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPaymentsReceiptsDetail`;
   addWCr = `${this.environment.runtimeConfig.serverUrl}WorkCenterCreation/RegisterWorkCenterCreation`;
   //getPaymentsreceiptsMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPaymentsReceiptsMaster`;

   /******************************* Routing****************************************************** */
   getroutingfileDetail = `${this.environment.runtimeConfig.serverUrl}RoutingFile/GetRoutingFileDetail`;
   addrouting = `${this.environment.runtimeConfig.serverUrl}RoutingFile/RegisterRoutingFile`;
   //getPaymentsreceiptsMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPaymentsReceiptsMaster`;
   /******************************* Task****************************************************** */
   getaskDetail = `${this.environment.runtimeConfig.serverUrl}Tasks/GetTaskDetail`;
   addtask = `${this.environment.runtimeConfig.serverUrl}Tasks/RegisterTasks`;
   updateTasks = `${this.environment.runtimeConfig.serverUrl}Tasks/UpdateTasks`;
   /*******************************Purchase Requisition ****************************************************** */
   addpurchasereq = `${this.environment.runtimeConfig.serverUrl}Transactions/AddPurchaseRequisition`;
   getpurchasereqDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseRequisitionDetail`;
   getpurchasereqMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseRequisition`;
   returnpurchasereq = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnPurchaseRequisition`;

   /*******************************Supplier Requisition ****************************************************** */
   addsupplierreq = `${this.environment.runtimeConfig.serverUrl}Transactions/AddSourceSupply`;
   getsupplierDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSourceSupplyDetail`;
   getsupplierreqMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSourceSupply`;
   returnsupplierreq = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnSourceSupply`;
   /*******************************Supplier Quotation ****************************************************** */
   addsupplierqs = `${this.environment.runtimeConfig.serverUrl}Transactions/AddQuotationSupplier`;
   getsupplierqsDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQuotationSupplierDetail`;
   getsupplierqsMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQuotationSupplier`;
   returnsupplierqs = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnQuotationSupplier`;

   /*******************************Supplier Quotation ****************************************************** */
   addquotationanalysis = `${this.environment.runtimeConfig.serverUrl}Transactions/AddQuotationAnalysis`;
   getquotationanalysisDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQuotationAnalysisDetail`;
   getquotationanalysisMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQuotationAnalysis`;
   returnquotationanalysis = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnQuotationAnalysis`;
   /*******************************Purchase Order ****************************************************** */
   saveimage = `${this.environment.runtimeConfig.serverUrl}Transactions/UploadFile`;
   addpurchaseorder = `${this.environment.runtimeConfig.serverUrl}Transactions/AddPurchaseOrder`;
   getpurchaseorderDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseOrderDetail`;
   getpurchaseorderMaster = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseOrder`;
   returnpurchaseorder = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnPurchaseOrder`;
   getPurchaseOrderApproveList = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseOrderApproveList`;
   
   /*******************************Goods Receipt ****************************************************** */
   addgoodsreceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/AddGoodsReceipt`;
   getgoodsreceiptDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsReceiptDetail`;
   getgoodsreceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsReceipt`;
   returngoodsreceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnGoodsReceipt`;
   getGoodsReceiptApproval = `${this.environment.runtimeConfig.serverUrl}Transactions/GetGoodsReceiptApproval`;

   /*******************************Inspection Check ****************************************************** */
   addinspectioncheck = `${this.environment.runtimeConfig.serverUrl}Transactions/AddInpectionCheck`;
   getinspectioncheckDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetInspectionCheckDetail`;
   getinspectioncheck = `${this.environment.runtimeConfig.serverUrl}Transactions/GetInspectionCheck`;
   returninspectioncheck = `${this.environment.runtimeConfig.serverUrl}Transactions/ReturnInpectionCheck`;
   /*******************************Invoice Verification  ****************************************************** */
   addinvoice = `${this.environment.runtimeConfig.serverUrl}Transactions/AddInvoiceverificationDetail`;
   getinvoiceDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetInvoiceverificationDetail`;
   getQCReportDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetQCReportDetail`;
   getPurchaseOrderData = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseOrderData`;

   /*******************************PrimeryCost****************************************************** */
   addpccost = `${this.environment.runtimeConfig.serverUrl}PrimaryCostElementsCreation/UpdatePcost`;
   
   registerEmployee = `${this.environment.runtimeConfig.serverUrl}Employee/RegisterEmployee`;
   updateEmployee = `${this.environment.runtimeConfig.serverUrl}Employee/UpdateEmployee`;

   getDesignationsList = `${this.environment.runtimeConfig.serverUrl}Designation/GetDesignationsList`;

   //LeaveTypes

   getLeaveTypeatLists = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveType/GetLeaveTypeList`;
   registerLeaveTypes = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveType/RegisterLeaveType`;
   updateLeaveTypes = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveType/UpdateLeaveType`;
   deleteLeaveTypes = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveType/DeleteLeaveType`;

   //LeaveRequest

   getnoofdayscount = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/Getnoofdayscount`;
   getEmpCode = `${this.environment.runtimeConfig.serverUrl}Common/GetEmployeeCode`;
   getEmpName = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/GetEmpName`;
   updateLeaveRequests = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/UpdateLeaveapplying`;
   getLeaveTypeatList = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/GetLeavetpesList`;
   getLeaveRequestList = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
   //getLeaveRequestList = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
   registerLeaveRequests = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveRequest/RegisterLeaveapplying`;


   //Applyod
   applyodRequestList = `${this.environment.runtimeConfig.serverUrl}Selfservice/Applyod/GetApplyodDetailsList`;
   registerodRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/Applyod/RegisterApplyOddataDetails`;
   updateapplyodRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/Applyod/UpdateApplyod`;

   //Advance
   applyadvanceRequestList = `${this.environment.runtimeConfig.serverUrl}Selfservice/Advance/GetApplyAdvanceDetailsList`;
   registeradvanceRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/Advance/RegisterApplyAdvancedataDetails`;
   updateapplyadvanceRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/Advance/UpdateAdvancedataDetails`;
   getAdvancetypeList = `${this.environment.runtimeConfig.serverUrl}Selfservice/Advance/GetAdvancedataDetailslist`;

   //PermissionRequest
   permissionRequestList = `${this.environment.runtimeConfig.serverUrl}Selfservice/PermissionRequest/GetPermissionApplDetailsList`;
   registerpermissionRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/PermissionRequest/RegisterPermissionapplying`;
   updatepermissionRequest = `${this.environment.runtimeConfig.serverUrl}Selfservice/PermissionRequest/UpdatePermissionapplying`;

   //PT Master
   getPTList = `${this.environment.runtimeConfig.serverUrl}payroll/PTMaster/GetPTList`;
   registerPT = `${this.environment.runtimeConfig.serverUrl}payroll/PTMaster/RegisterPT`;
   updatePT = `${this.environment.runtimeConfig.serverUrl}payroll/PTMaster/UpdatePT`;
   deletePT = `${this.environment.runtimeConfig.serverUrl}payroll/PTMaster/DeletePT`;

   // Component Master
   getComponentsList = `${this.environment.runtimeConfig.serverUrl}payroll/ComponentMaster/GetComponentsList`;
   registerComponent = `${this.environment.runtimeConfig.serverUrl}payroll/ComponentMaster/RegisterComponent`;
   getConfigurationList = `${this.environment.runtimeConfig.serverUrl}Common/GetConfigurationList`;
   updateComponent = `${this.environment.runtimeConfig.serverUrl}payroll/ComponentMaster/UpdateComponent`;
   deleteComponent = `${this.environment.runtimeConfig.serverUrl}payroll/ComponentMaster/DeleteComponent`;

    // Structure Creation
    getStructuresList = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/GetStructuresList`;
    registerStructure = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/RegisterStructure`;
    updateStructure = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/UpdateStructure`;
    deleteStructure = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/DeleteStructure`;
    getStructureComponentsList = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/GetComponentsList`;
    getPFList = `${this.environment.runtimeConfig.serverUrl}payroll/StructureCreation/GetPFList`;

   //PF Master
   getPfComponentsList = `${this.environment.runtimeConfig.serverUrl}Component/GetcomponentTypesList`;
   getPfList = `${this.environment.runtimeConfig.serverUrl}payroll/PFMaster/GetPFList`;
   registerPF = `${this.environment.runtimeConfig.serverUrl}payroll/PFMaster/RegisterPF`;
   updatePF = `${this.environment.runtimeConfig.serverUrl}payroll/PFMaster/UpdatePF`;
   deletePF = `${this.environment.runtimeConfig.serverUrl}payroll/PFMaster/DeletePF`;

   //approvaltype
   getempList = `${this.environment.runtimeConfig.serverUrl}Selfservice/ApprovalType/GetEmployeesList`;
   getapprovaltypeList = `${this.environment.runtimeConfig.serverUrl}Selfservice/ApprovalType/GetApprovalTypesList`;
   registerapprovaltype = `${this.environment.runtimeConfig.serverUrl}Selfservice/ApprovalType/RegisterApprovalType`;
   updateapprovaltype = `${this.environment.runtimeConfig.serverUrl}Selfservice/ApprovalType/UpdateApprovalType`;
   deleteapprovaltype = `${this.environment.runtimeConfig.serverUrl}Selfservice/ApprovalType/DeleteApprovalType`;


   //CTC Breakup
   getCTCList = `${this.environment.runtimeConfig.serverUrl}payroll/CTCBreakup/GetCTCList`;
   getStructureList = `${this.environment.runtimeConfig.serverUrl}Common/GetStructuresList`;
   getPFTypeList = `${this.environment.runtimeConfig.serverUrl}Common/GetPFList`;
   getpfTypesList = `${this.environment.runtimeConfig.serverUrl}PFMaster/GetpfTypesList`;
   getPTSlabList = `${this.environment.runtimeConfig.serverUrl}Common/GetPTList`;
   getptTypesList = `${this.environment.runtimeConfig.serverUrl}PTMaster/GetptTypesList`;
   getctcEmployeeList = `${this.environment.runtimeConfig.serverUrl}CTC/GetEmployeeList`;
   getStructures = `${this.environment.runtimeConfig.serverUrl}CTC/GetStructures`;
   getctcComponentsList = `${this.environment.runtimeConfig.serverUrl}payroll/ComponentMaster/GetComponentsList`;
   getctcDetailList = `${this.environment.runtimeConfig.serverUrl}CTC/GetctcDetailList`;
   
   //Leaveopeningbalance

   getLeaveTypeatListforlop = `${this.environment.runtimeConfig.serverUrl}masters/LeaveBalances/GetLeavetpeList`;
   getLeaveopeningbalanceList = `${this.environment.runtimeConfig.serverUrl}masters/LeaveBalances/GetLeaveBalancesList`;
   registerLeaveopeningbalance = `${this.environment.runtimeConfig.serverUrl}masters/LeaveBalances/RegisterLeaveBalancesList`;
   updateLeaveopeningbalance = `${this.environment.runtimeConfig.serverUrl}masters/LeaveBalances/UpdateLeaveBalancesList`;
   deleteLeaveopeningbalance = `${this.environment.runtimeConfig.serverUrl}masters/LeaveBalances/DeleteLeaveBalancesList`;

   getCashAccBranchesList = `${this.environment.runtimeConfig.serverUrl}gl/AsignmentCashAccBranch/GetBranchesList`;
   getCompaniesList = `${this.environment.runtimeConfig.serverUrl}gl/VoucherType/GetCompaniesList`;

   // opening balance
   getOpeningBalanceList = `${this.environment.runtimeConfig.serverUrl}/masters/OpeningBalance/GetOpeningBalanceList`;
   getObBranchesList = `${this.environment.runtimeConfig.serverUrl}/masters/OpeningBalance/GetBranchesList`;
   getObVoucherNo = `${this.environment.runtimeConfig.serverUrl}/masters/OpeningBalance/GetVoucherNo`;
   getPaymentType = `${this.environment.runtimeConfig.serverUrl}/masters/OpeningBalance/GetPaymentType`;
   registerOpeningBalance = `${this.environment.runtimeConfig.serverUrl}/masters/OpeningBalance/RegisterOpeningBalance`;

   getBPAccountLedgerList = `${this.environment.runtimeConfig.serverUrl}transactions/BankPayment/GetAccountLedgerList`;

   // Stock Excess
   getStockexcessList = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetStockexcessList`;
   getStockExcessBranchesList = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetBranchesList`;
   getstockexcessNo = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetstockexcessNo`;
   getStockExcessCostCentersList = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetCostCentersList`;
   getProductListsforStockexcessList = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetProductLists`;
   registerStockexcess = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/RegisterStockexcess`;
   getStockExcessDetailsList = `${this.environment.runtimeConfig.serverUrl}transactions/StockExcess/GetStockExcessDetailsList`;

   // ******************************** sales *********************************
   getInvoiceList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetInvoiceList`;
   getCashPartyAccountList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetCashPartyAccountList`;
   getCustomerGstNumList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetCustomerGstNumList`;
   getBillingBranchesList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetBranchesList`;
   getCashPartyAccount = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetCashPartyAccount`;
   getmemberNames = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetmemberNames`;
   getAccountBalance = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetAccountBalance`;
   generateBillNo = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GenerateBillNo`;
   getProductByProductCode = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetProductByProductCode`;
   getProductByProductName = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetProductByProductName`;
   getBillingDetailsRcd = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetBillingDetailsRcd`;
   registerInvoice = `${this.environment.runtimeConfig.serverUrl}sales/Billing/RegisterInvoice`;
   getStateList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GeStateList`;
   getSelectedState = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GeSelectedState`;
   getVechiels = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetVechiels`;
   getInvoiceDeatilList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetInvoiceDeatilList`;
   getPupms = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetPupms`;
   generateSalesReturnInvNo = `${this.environment.runtimeConfig.serverUrl}transaction/SalesReturn/GenerateSalesReturnInvNo`;
   registerInvoiceReturn = `${this.environment.runtimeConfig.serverUrl}transaction/SalesReturn/RegisterInvoiceReturn`;
   getInvoiceReturnDetail = `${this.environment.runtimeConfig.serverUrl}transaction/SalesReturn/GetInvoiceReturnDetail`;
   getInvoiceGetInvoiceReturnList = `${this.environment.runtimeConfig.serverUrl}transaction/SalesReturn/GetInvoiceReturnList`;
   getmemberNamesByCode = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetmemberNamesByCode`;
   getInvoiceDeatilListsaleorder = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetInvoiceDeatilListsaleorder`;

   getStockTransferPrintReportData = `${this.environment.runtimeConfig.serverUrl}Reports/StockTransferPrintReport/GetStockTransferPrintReportData`;
   employeeattendance = `${this.environment.runtimeConfig.serverUrl}Reports/Employeeattendance`;
   eemployeeAttendanceChange = `${this.environment.runtimeConfig.serverUrl}Reports/EemployeeAttendanceChange`;
   addAttendance = `${this.environment.runtimeConfig.serverUrl}Transactions/AddAttendance`;

   //  stock Transfer
   generateStockTranfNo = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GenerateStockTranfNo`;
   geProductsByName = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GeProductsByName`;
   geProductsByCode = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GeProductsByCode`;
   getStockTransferDetailsSection = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GetStockTransferDetailsSection`;
   getLtrs = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GetLtrs`;
   registerStockTransfer = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/RegisterStockTransfer`;
   getStockTransferList = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GetStockTransferList`;
   getStockTransferDetilsaRecords = `${this.environment.runtimeConfig.serverUrl}transaction/StockTransfer/GetStockTransferDetilsaRecords`;

   //AdvanceApproval
   getAdvanceApplDetailsList = `${this.environment.runtimeConfig.serverUrl}Selfservice/AdvanceApproval/GetAdvanceApprovalApplDetailsList`;
   RegisterAdvanceApprovalDetails = `${this.environment.runtimeConfig.serverUrl}Selfservice/AdvanceApproval/RegisterAdvanceApprovalDetails`;

   //VehicleApproval
   getVehicleApplDetailsList = `${this.environment.runtimeConfig.serverUrl}Selfservice/VehicleApproval/GetVehicleApprovalApplDetailsList`;
   RegisterVehicleApprovalDetails = `${this.environment.runtimeConfig.serverUrl}Selfservice/VehicleApproval/RegisterVehicleApprovalDetails`;

   //OdApproval
   getOdApplDetailsList = `${this.environment.runtimeConfig.serverUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;
   RegisterOdApprovalDetails = `${this.environment.runtimeConfig.serverUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;

   //Permission RequestApproval
   getPermissionrqstApplDetailsList = `${this.environment.runtimeConfig.serverUrl}Selfservice/PermissionApproval/GetPermissionApprovalApplDetailsList`;
   RegisterPermissionrqstApprovalDetails = `${this.environment.runtimeConfig.serverUrl}Selfservice/PermissionApproval/RegisterPermissionApprovalDetails`;

   // Leave Approval
   getLeaveApplDetailsList = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveApproval/GetLeaveApplDetailsList`;
   RegisterLeaveApprovalDetails = `${this.environment.runtimeConfig.serverUrl}Selfservice/LeaveApproval/RegisterLeaveApprovalDetails`;
  
   getSaleOrder = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSaleOrder`;
   getSaleOrderDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSaleOrderDetail`;
   getPurchaseRequisitionDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseRequisitionDetail`;
   addSaleOrder = `${this.environment.runtimeConfig.serverUrl}Transactions/AddSaleOrder`;
   getSaleOrderDetailPO = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSaleOrderDetailPO`;

   getSaleOrderNumber = `${this.environment.runtimeConfig.serverUrl}Transactions/GetSaleOrderNumber`;
   getPurchaseOrderNumber = `${this.environment.runtimeConfig.serverUrl}Transactions/GetPurchaseOrderNumber`;
   uploadFile = `${this.environment.runtimeConfig.serverUrl}Transactions/UploadFile`;
   getFile = `${this.environment.runtimeConfig.serverUrl}Transactions/GetFile`;

   addProductionissue = `${this.environment.runtimeConfig.serverUrl}Transactions/AddProductionissue`;

   getProductionStatus = `${this.environment.runtimeConfig.serverUrl}Transactions/GetProductionStatus`;

   getPRList = `${this.environment.runtimeConfig.serverUrl}Common/GetPRList`;
   getBOMList = `${this.environment.runtimeConfig.serverUrl}Common/GetBOMList`;
   getFormList = `${this.environment.runtimeConfig.serverUrl}Common/GetFormList`;

   registerStandardRate = `${this.environment.runtimeConfig.serverUrl}StandardRate/RegisterStandardRate`;
   
   getInspectionDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetInspectionDetail`;
   getInspectionCheckDetailbySaleorder = `${this.environment.runtimeConfig.serverUrl}Transactions/GetInspectionCheckDetailbySaleorder`;
   deletePurchaseOrder = `${this.environment.runtimeConfig.serverUrl}Common/DeletePurchaseOrder`;

   deleteBomDetail = `${this.environment.runtimeConfig.serverUrl}Common/DeleteBomDetail`;

   savePurchaseOrder = `${this.environment.runtimeConfig.serverUrl}Transactions/SavePurchaseOrder`;
   saveGoodsReceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/SaveGoodsReceipt`;
   
   getInvoiceData = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetInvoiceData`;
   getInvoiceDetailList = `${this.environment.runtimeConfig.serverUrl}sales/Billing/GetInvoiceDetailList`;
   
   getJobWork = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJobWork`;
   addJobWork = `${this.environment.runtimeConfig.serverUrl}Transactions/AddJobWork`;
   getJobworkDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJobworkDetail`;
   
   getJWReceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJWReceipt`;
   addJWReceipt = `${this.environment.runtimeConfig.serverUrl}Transactions/AddJWReceipt`;
   getJWReceiptDetail = `${this.environment.runtimeConfig.serverUrl}Transactions/GetJWReceiptDetail`;
   getJobWorkDetails = `${this.environment.runtimeConfig.serverUrl}Common/GetJobWorkDetails`;
   updateProductionStatus = `${this.environment.runtimeConfig.serverUrl}Transactions/UpdateProductionStatus`;

   getOrdersvsSales = `${this.environment.runtimeConfig.serverUrl}Reports/GetOrdersvsSales`;

   getEmpPresent = `${this.environment.runtimeConfig.serverUrl}Reports/GetEmpPresent`;
   gLsubAccountListbyCatetory = `${this.environment.runtimeConfig.serverUrl}Common/GLsubAccountListbyCatetory`;

   getBomDetail = `${this.environment.runtimeConfig.serverUrl}Common/GetBomDetail`;
   
   registerAttendanceProcess = `${this.environment.runtimeConfig.serverUrl}AttendanceProcess/RegisterAttendanceProcess`;
}
