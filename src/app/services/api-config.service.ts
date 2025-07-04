import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
   providedIn: 'root'
})

export class ApiConfigService {

   constructor() { }

   // login Url
   loginUrl = `${environment.baseUrl}Auth/login`;
  //loginUrl = 'http://localhost:5000/api/Auth/login';
   logoutUrl = `${environment.baseUrl}Auth/logout`;
   getBranchesForUser = `${environment.baseUrl}Auth/GetBranchesForUser`;
   //getBranchesForUser = 'http://localhost:5000/api/Auth/GetBranchesForUser';
   getComponentInfo = `${environment.baseUrl}Settings/GetComponentInfo`;
   
   getAuthentication = `${environment.baseUrl}Common/GetAuthentication`;
   
   // Common
   getprimeryList = `${environment.baseUrl}PrimaryCostElementsCreation/GetPrimaryCostElementsCreationList`;
   getprcList = `${environment.baseUrl}Common/GetPrimaryCostElementList`;
   getMaterialListforcostunits = `${environment.baseUrl}Common/GetMaterialListForCostunits`;
   gethsnsacList = `${environment.baseUrl}Common/GetHSNSACList`;
   getGoodsreceiptDataList = `${environment.baseUrl}Common/GetGoodsReceiptList`;
   getinspectioncheckList = `${environment.baseUrl}Common/GetInspectiondetailsList`;
   getinspectionnoList = `${environment.baseUrl}Common/GetInspectionnoList`;
   getBusienessPartnersAccList = `${environment.baseUrl}BusienessPartnerAccount/GetBusienessPartnerAccountList`;
   gettinglotNumbers = `${environment.baseUrl}GoodsReceipt/GetLotNumber`;
   getpodetailsList = `${environment.baseUrl}Common/GetPOdetailsList`;
   getpurchasenoList = `${environment.baseUrl}Common/GetPurchaseOrdernoList`;
   getJobworkList = `${environment.baseUrl}Common/GetJobworkList`;
   getquotationnoList = `${environment.baseUrl}Common/GetQuotationnoList`;
   getSaleOrderList  = `${environment.baseUrl}Common/GetSaleOrderList`;
   getSaleOrderApprovedList  = `${environment.baseUrl}Common/GetSaleOrderApprovedList`;
   getSaleOrders  = `${environment.baseUrl}Common/GetSaleOrder`;
   getsaleOrdernoListe  = `${environment.baseUrl}Common/GetsaleOrdernoListe`;
   getsaleOrdernoList  = `${environment.baseUrl}Common/GetsaleOrdernoList`;
   getSaleOrderData   = `${environment.baseUrl}Common/GetSaleOrderData`;
   getProdSaleOrderList   = `${environment.baseUrl}Common/GetProdSaleOrderList`;
   getCommitmentList = `${environment.baseUrl}QCParamConfig/GetCommitmentItemList`;
   getCommitmentLists = `${environment.baseUrl}CommitmentItem/GetCommitmentItemList`;
   getfundcenterList = `${environment.baseUrl}FundCenter/GetFundCenterList`;
   getWCList = `${environment.baseUrl}Common/GetWorkcenterList`;
   getFormulaList = `${environment.baseUrl}Formulas/GetFormulasList`;
   getreqdetailsList = `${environment.baseUrl}Common/GetMaterialreqDetailsList`;
   getreqList = `${environment.baseUrl}Common/GetMaterialreqList`;
   getmomenttypeList = `${environment.baseUrl}Movementtype/GetMovementtypeList`;
   getordernolist = `${environment.baseUrl}OrderType/GetOrderTypeList`;
   getwbselement = `${environment.baseUrl}Common/GetWbsList`;
   getbatchList = `${environment.baseUrl}BatchMaster/GetBatchMasterList`;
   getCostUnitListList = `${environment.baseUrl}CreationOfCostUnits/GetCreationOfCostUnitsList`;
   getcostnumberseriesList = `${environment.baseUrl}Common/GetCostingNumberSeriesList`;
   getcostofobjectList = `${environment.baseUrl}Common/GetCostingObjectTypeList`;
   getsecondelementList = `${environment.baseUrl}Common/GetCostingSecondaryList`;
   getdepartmentList = `${environment.baseUrl}Common/GetDepartmentList`;
   getttingobjectNumbers = `${environment.baseUrl}CreationOfCostUnits/GetObjectNumber`;
   getMaterialtypeList = `${environment.baseUrl}MaterialTypes/GetMaterialTypesList`;
   getttingmaterialNumbers = `${environment.baseUrl}MaterialMaster/GetMaterialNumber`;
   getuomList = `${environment.baseUrl}Common/GetUOMList`;
   getmaterialdata = `${environment.baseUrl}Common/GetMaterialMasterList`;
   getModelPatternList = `${environment.baseUrl}ModelPattern/GetModelPatternList`;
   getmsizeList = `${environment.baseUrl}MaterialSize/GetMaterialSizeList`;
   getmaterialgroupList = `${environment.baseUrl}MaterialGroups/GetMaterialGroupsList`;
   getMaterialList = `${environment.baseUrl}Common/GetMaterialList`;
   getStList = `${environment.baseUrl}StorageLocation/GetStorageLocation`;
   getpurchaseOrderTypeList = `${environment.baseUrl}Purchaseordertype/GetPurchaseordertypeList`;
   getPurchaseorderNumberList = `${environment.baseUrl}PurchaseOrderNumberRange/GetPurchaseOrderNumberRangeList`;
   getQuotationNumberRangeList = `${environment.baseUrl}QuotationNumberRange/GetQuotationNumberRangeList`;
   getnumberRangeList = `${environment.baseUrl}RequisitionNumberRange/GetRequisitionNumberRangeList`;
   getPurchasingtypeList = `${environment.baseUrl}Purchasingtype/GetPurchaseTypeList`;
   getPurchaseGroupList = `${environment.baseUrl}Purchasinggroups/GetPurchasinggroupsList`;
   getlanguageList = `${environment.baseUrl}Common/GetLanguageList`;
   getRegionsList = `${environment.baseUrl}Common/GetRegionList`;
   getCountrysList = `${environment.baseUrl}Common/GetCountrysList`;
   getcurrencyList = `${environment.baseUrl}Common/GetCurrencyList`;
   getstatesList = `${environment.baseUrl}Common/GetStatesList`;
   getCompanyList = `${environment.baseUrl}Common/GetCompanyList`;
   getcostingunitsList = `${environment.baseUrl}Common/GetCostUnitList`;
   getEmployeeList = `${environment.baseUrl}Common/GetEmployeeList`;
   getPlantsList = `${environment.baseUrl}Common/GetPlantsList`;
   getlocationsList = `${environment.baseUrl}Common/GetLocationsList`;
   getBranchList = `${environment.baseUrl}Common/GetBranchList`;
   getVoucherTypesList = `${environment.baseUrl}Common/GetVoucherTypesList`;
   getvochersseriesList = `${environment.baseUrl}Common/GetVouchersSeriesList`;
   getTaxTransactionsList = `${environment.baseUrl}Common/GetTaxTransactionsList`;
   gettaxrateList = `${environment.baseUrl}Common/GetTaxRateList`;
   getTDSRateList = `${environment.baseUrl}Common/GetTDSRateList`;
   getBusienessPartnersGroupsList = `${environment.baseUrl}Common/GetBusienessPartnersGroupsList`;
   getAssetsClassList = `${environment.baseUrl}Common/GetAssetsClassList`;
   getAssetsBlockList = `${environment.baseUrl}Common/GetAssetsBlockList`;
   getAccountsKeyList = `${environment.baseUrl}Common/GetAccountsKeyList`;
   getBankMastersList = `${environment.baseUrl}Common/GetBankMastersList`;
   getPaymentsTermsList = `${environment.baseUrl}Common/GetPaymentsTermsList`;
   getGLAccountListbyCatetory = `${environment.baseUrl}Common/GLAccountListbyCatetory`;
   getGLAccountsList = `${environment.baseUrl}Common/GetGLAccountsList`;
   getProfitCentersList = `${environment.baseUrl}Common/GetProfitCentersList`;
   getProfitCenters = `${environment.baseUrl}ProfitCenter/GetProfitCenters`;
   getCostCentersList = `${environment.baseUrl}Common/GetCostCentersList`;
   getCostCenters = `${environment.baseUrl}CostCenter/GetCostCenters`;
   getTaxRatesList = `${environment.baseUrl}TaxRates/GetTaxRatesList`;
   getBPList = `${environment.baseUrl}Common/GetBPList`;
   getCustomerList = `${environment.baseUrl}Common/GetCustomerList`;
   getpurchaseinvoiceList = `${environment.baseUrl}Common/GetPurchaseInvoiceList`;
   getAssetMasterList = `${environment.baseUrl}Common/GetMainAssetMasterList`;
   getSubAssetMasterList = `${environment.baseUrl}Common/GetSubAssetMasterList`;
   getFieldsConfig = `${environment.baseUrl}Common/GetFieldsConfig`;
   getUserPermissions = `${environment.baseUrl}Common/GetUserPermissions`;
   getLotSeriesUrlList = `${environment.baseUrl}LotSeries/GetLotSeriesList`;
   getGRNSeriesList = `${environment.baseUrl}GoodsReceiptNoteNumberSeries/GetGoodsReceiptNoteNumberSeriesList`;
   getMRNSeriesList = `${environment.baseUrl}MaterialRequisitionNoteNumberSeries/GetMaterialRequisitionNoteNumberSeriesList`;
   getMaterialSeriesList = `${environment.baseUrl}MaterialNumberRangeSeries/GetMaterialNumberRangeSeriesList`;
   getGINSeriesList = `${environment.baseUrl}GoodsIssueNoteNumberSeries/GetGoodsIssueNoteNumberSeriesList`;
   getHsnSacList = `${environment.baseUrl}HsnSac/GetHsnSacList`;
   getLeaveTypeatListforlob = `${environment.baseUrl}Common/GetLeaveTypeList`;
   //************************ IMG General  ****************************************/
   getCurrencyList = `${environment.baseUrl}Currency/GetCurrencyList`;
   getLanguageList = `${environment.baseUrl}Language/GetLanguageList`;
   getCompanysList = `${environment.baseUrl}Company/GetCompanysList`;
   getSegmentList = `${environment.baseUrl}Segment/GetSegmentList`;
   getProfitCenterList = `${environment.baseUrl}ProfitCenter/GetProfitCenterList`;
   getBranchesList = `${environment.baseUrl}Branches/GetBranchesList`;
   getDivisionsList = `${environment.baseUrl}Division/GetDivisionsList`;
   getfunctionaldeptList = `${environment.baseUrl}FunctionalDepartment/GetFunctionalDepartment`;
   GetCostCenterList = `${environment.baseUrl}CostCenter/GetCostCenterList`;
   getplantList = `${environment.baseUrl}Plant/GetPlant`;
   getlocationList = `${environment.baseUrl}Location/GetLocationList`;
   registerdepreciationcodeList = `${environment.baseUrl}Depreciationcode/RegisterDepreciationcode`;
   getdepreciationcodeDetail = `${environment.baseUrl}Depreciationcode/GetDepreciationcodeDetail`;
   registerpaymenttermsList = `${environment.baseUrl}PaymentTerms/RegisterPaymentTerms`;
   getpaymenttermDetail = `${environment.baseUrl}PaymentTerms/GetPaymentTermsDetail`;
   //mainasset
   registermainAssetsList = `${environment.baseUrl}MainAssetMaster/RegisterMainAssetMaster`;
   getMainAssetsDetail = `${environment.baseUrl}MainAssetMaster/GetMainAssetsDetail`;
   //subasset
   registerSubAssetsList = `${environment.baseUrl}SubAssets/RegisterSubAssetsdatas`;
   getSubAssetsDetail = `${environment.baseUrl}SubAssets/GetSubAssetsDetail`;
   //updateSubAssetsList= `${environment.baseUrl}SubAssets/UpdateSubAssetsList`;
   deleteSubAssetsList = `${environment.baseUrl}SubAssets/DeleteSubAssetsList`;
   ///************************ Accounting ************************** */
   getLedgerList = `${environment.baseUrl}Ledger/GetLedgerList`;
   getvocherclassList = `${environment.baseUrl}VoucherClass/GetVoucherClassList`;
   getDepreciationAreasList = `${environment.baseUrl}DepreciationAreas/GetDepreciationAreasList`;
   getAssetClassList = `${environment.baseUrl}AssetClass/GetAssetClassList`;
   getTaxTypesList = `${environment.baseUrl}TaxTypes/GetTaxTypesList`;
   subgrouplist = `${environment.baseUrl}AssignGLaccounttoSubGroup/GetGLUnderSubGroupList`;
   getTaxTransactionList = `${environment.baseUrl}TaxTransaction/GetTaxTransactionList`;
   getTDStypeList = `${environment.baseUrl}TDStype/GetTDStypeList`;
   getIncomeTypeList = `${environment.baseUrl}IncomeType/GetIncomeTypeList`;
   getGLAccountList = `${environment.baseUrl}GLAccount/GetGLAccountList`;
   getaccountNumber = `${environment.baseUrl}GLAccount/GetaccountNumberList`;
   getDepreciationcodeList = `${environment.baseUrl}Depreciationcode/GetDepreciationcodeList`;
   getAccountNamelist = `${environment.baseUrl}GLAccUnderSubGroup/GetAccountNamelist`;
   getGLUnderGroupList = `${environment.baseUrl}GLAccUnderSubGroup/GetAccountGrouplist`;
   getglAccgrpList = `${environment.baseUrl}GLAccUnderSubGroup/GetGLAccountGrouplist`;
   getAccountSubGrouplist = `${environment.baseUrl}GLAccUnderSubGroup/GetAccountSubGrouplist`;
   getNumberRangeList = `${environment.baseUrl}NumberRange/GetNumberRangeList`;
   getPartnerTypeList = `${environment.baseUrl}PartnerType/GetPartnerTypeList`;
   getChartOfAccountList = `${environment.baseUrl}ChartOfAccount/GetChartOfAccountList`;
   getAccountKeyList = `${environment.baseUrl}AccountKey/GetAccountKeyList`;
   getSubAssetsList = `${environment.baseUrl}SubAssets/GetSubAssetsList`;
   GetListsforMainAsset = `${environment.baseUrl}SubAssets/GetMainAsset`;
   getStructurekeyList = `${environment.baseUrl}AssignGLaccounttoSubGroup/GetStructurekeyList`;
   getbpNumbers = `${environment.baseUrl}BusienessPartnerAccount/GetBPtNumberList`;
   getttingbpNumbers = `${environment.baseUrl}BusienessPartnerAccount/GetBPtNumber`;
   getttingbpNames = `${environment.baseUrl}BusienessPartnerAccount/GetBPtName`;
   getBusienessPartnerAccount = `${environment.baseUrl}BusienessPartnerAccount/GetBusienessPartnerAccount`;

   getMainAssetMasterList = `${environment.baseUrl}MainAssetMaster/GetMainAssetMasterList`;
   getAssetnumber = `${environment.baseUrl}MainAssetMaster/GetAssetNumber`;
   getasetnos = `${environment.baseUrl}MainAssetMaster/GettingAssetNumber`;
   getttinasNames = `${environment.baseUrl}MainAssetMaster/GettingAssetName`;
   getBusienessTransactionTypeList = `${environment.baseUrl}BusienessTransactionType/GetBusienessTransactionTypeList`;
   //AssetBegningAcqusition
   registeraqsnList = `${environment.baseUrl}AssetBegningAcqusition/RegisterAssetBegningAcqusition`;
   updateAssetBegningAcqusition = `${environment.baseUrl}AssetBegningAcqusition/UpdateAssetBegningAcqusition`;
   getAqsnDetail = `${environment.baseUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionDetail`;
   getAcquisitionDetailsList = `${environment.baseUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionDetailsList`;
   getacquisitionlist = `${environment.baseUrl}AssetBegningAcqusition/GetAssetBegningAcqusitionList`;

   /**************************** Settings ********************************************************* */
    getRoles = `${environment.baseUrl}Auth/getRoles`;
   //getRoles = 'http://localhost:5000/api/Auth/getRoles';
   getParentMenus = `${environment.baseUrl}Auth/getParentMenu`;
   //getParentMenus = 'http://localhost:5000/api/Auth/getParentMenu';
    getMenuList = `${environment.baseUrl}Auth/getMenuList`;
   //getMenuList = 'http://localhost:5000/api/Auth/getMenuList';
   giveAccess = `${environment.baseUrl}Auth/GiveAccess`;
   //giveAccess = 'http://localhost:5000/api/Auth/GiveAccess';
   getMenuUrl = `${environment.baseUrl}Auth/getMenu`;
   //getMenuUrl = 'http://localhost:5000/api/Auth/getMenu';
    getrolelist = `${environment.baseUrl}UserCreation/GetRoleList`;
    getUserCreation = `${environment.baseUrl}UserCreation/GetUserCreation`;
   //getrolelist = 'http://localhost:5000/api/UserCreation/GetRoleList';




   /******************************* Cash Bank ****************************************************** */
   addCashBank = `${environment.baseUrl}Transactions/AddCashBank`;
   getCashBankDetail = `${environment.baseUrl}Transactions/GetCashBankDetail`;
   getCashBankMaster = `${environment.baseUrl}Transactions/GetCashBankMaster`;
   getVoucherNumber = `${environment.baseUrl}Transactions/GetVoucherNumber`;
   returnCashBank = `${environment.baseUrl}Transactions/ReturnCashBank`;
   getDiscount = `${environment.baseUrl}Transactions/GetDiscount`;

   /******************************* Journal ****************************************************** */
   addJournal = `${environment.baseUrl}Transactions/AddJournal`;
   getJVDetail = `${environment.baseUrl}Transactions/GetJVDetail`;
   getJVMaster = `${environment.baseUrl}Transactions/GetJVMaster`;

   /******************************* Invoice & Memo ****************************************************** */
   addInvoiceMemo = `${environment.baseUrl}Transactions/AddInvoiceMemo`;
   getIMDetail = `${environment.baseUrl}Transactions/GetIMDetail`;
   getIMMaster = `${environment.baseUrl}Transactions/GetIMMaster`;

   /******************************* Asset Purchase & Sale ****************************************************** */
   addPSIMAsset = `${environment.baseUrl}Transactions/AddPSIMAsset`;
   getPSIMAssetDetail = `${environment.baseUrl}Transactions/GetPSIMAssetDetail`;
   getPSIMAssetMaster = `${environment.baseUrl}Transactions/GetPSIMAssetMaster`;
   /******************************* Asset Transfer ****************************************************** */
   getAssettransferDetail = `${environment.baseUrl}Transactions/GetAssetTransferDetail`;
   addAssettransfer = `${environment.baseUrl}Transactions/AddAssetTransfer`;
   getAssettransferMaster = `${environment.baseUrl}Transactions/GetAssetTransferMaster`;

   /******************************* Payment Receipts ****************************************************** */
   getPaymentsReceiptsDetail = `${environment.baseUrl}Transactions/GetPaymentsReceiptsDetail`;
   addPaymentsReceipts = `${environment.baseUrl}Transactions/AddPaymentsReceipts`;
   getPaymentsreceiptsMaster = `${environment.baseUrl}Transactions/GetPaymentsReceiptsMaster`;

   /*******************************BOM ****************************************************** */
   addBOM = `${environment.baseUrl}BillOfMaterial/AddBOM`;
   getBOMDetail = `${environment.baseUrl}BillOfMaterial/GetBomDetail`;
   getBOMMaster = `${environment.baseUrl}BillOfMaterial/GetBOMMasters`;
   getBOMNumber = `${environment.baseUrl}BillOfMaterial/GetVoucherNumber`;
   returnBOM = `${environment.baseUrl}BillOfMaterial/ReturnCashBank`;

   /*******************************Goods Issue ****************************************************** */
   addGoodsissue = `${environment.baseUrl}Transactions/AddGoodsissue`;
   getGoodsissueDetail = `${environment.baseUrl}Transactions/GetGoodsissueDetail`;
   getGoodsissueDetails = `${environment.baseUrl}Transactions/GetGoodsissueDetails`;
   getGoodsissueMaster = `${environment.baseUrl}Transactions/GetGoodsissue`;
   returnGoodsissue = `${environment.baseUrl}Transactions/ReturnGoodsissue`;
   getTagsissueDetail = `${environment.baseUrl}Transactions/GetTagsissueDetail`;
   getQCissueDetail = `${environment.baseUrl}Transactions/GetQCissueDetail`;

   /*******************************Goods Issue Approval ****************************************************** */
   addGoodsissueApproval = `${environment.baseUrl}Transactions/AddGoodsIssueApproval`;
   getGoodsissueDetailsApproval = `${environment.baseUrl}Transactions/GetGoodsissueDetailsApproved`;

   /*******************************Material Requisition ****************************************************** */
   addmareq = `${environment.baseUrl}Transactions/AddMaterialRequisition`;
   getmreqDetail = `${environment.baseUrl}Transactions/GetMaterialRequisitionDetail`;
   getmreqMaster = `${environment.baseUrl}Transactions/GetMaterialRequisition`;
   getProductionissue = `${environment.baseUrl}Transactions/GetProductionissue`;
   returnmreq = `${environment.baseUrl}Transactions/ReturnMaterialRequisition`;
   getQCConfigDetail = `${environment.baseUrl}StandardRate/GetQCConfigDetail`;
   getStandardRateList = `${environment.baseUrl}StandardRate/GetStandardRateList`;
   registerQCResults = `${environment.baseUrl}StandardRate/RegisterQCResults`;
   getSaleOrderDetailbymaterialcode = `${environment.baseUrl}StandardRate/GetSaleOrderDetailbymaterialcode`;

   /******************************* Work Center Creation ****************************************************** */
   //getPaymentsReceiptsDetail = `${environment.baseUrl}Transactions/GetPaymentsReceiptsDetail`;
   addWCr = `${environment.baseUrl}WorkCenterCreation/RegisterWorkCenterCreation`;
   //getPaymentsreceiptsMaster = `${environment.baseUrl}Transactions/GetPaymentsReceiptsMaster`;

   /******************************* Routing****************************************************** */
   getroutingfileDetail = `${environment.baseUrl}RoutingFile/GetRoutingFileDetail`;
   addrouting = `${environment.baseUrl}RoutingFile/RegisterRoutingFile`;
   //getPaymentsreceiptsMaster = `${environment.baseUrl}Transactions/GetPaymentsReceiptsMaster`;
   /******************************* Task****************************************************** */
   getaskDetail = `${environment.baseUrl}Tasks/GetTaskDetail`;
   addtask = `${environment.baseUrl}Tasks/RegisterTasks`;
   updateTasks = `${environment.baseUrl}Tasks/UpdateTasks`;
   /*******************************Purchase Requisition ****************************************************** */
   addpurchasereq = `${environment.baseUrl}Transactions/AddPurchaseRequisition`;
   getpurchasereqDetail = `${environment.baseUrl}Transactions/GetPurchaseRequisitionDetail`;
   getpurchasereqMaster = `${environment.baseUrl}Transactions/GetPurchaseRequisition`;
   returnpurchasereq = `${environment.baseUrl}Transactions/ReturnPurchaseRequisition`;

   /*******************************Supplier Requisition ****************************************************** */
   addsupplierreq = `${environment.baseUrl}Transactions/AddSourceSupply`;
   getsupplierDetail = `${environment.baseUrl}Transactions/GetSourceSupplyDetail`;
   getsupplierreqMaster = `${environment.baseUrl}Transactions/GetSourceSupply`;
   returnsupplierreq = `${environment.baseUrl}Transactions/ReturnSourceSupply`;
   /*******************************Supplier Quotation ****************************************************** */
   addsupplierqs = `${environment.baseUrl}Transactions/AddQuotationSupplier`;
   getsupplierqsDetail = `${environment.baseUrl}Transactions/GetQuotationSupplierDetail`;
   getsupplierqsMaster = `${environment.baseUrl}Transactions/GetQuotationSupplier`;
   returnsupplierqs = `${environment.baseUrl}Transactions/ReturnQuotationSupplier`;

   /*******************************Supplier Quotation ****************************************************** */
   addquotationanalysis = `${environment.baseUrl}Transactions/AddQuotationAnalysis`;
   getquotationanalysisDetail = `${environment.baseUrl}Transactions/GetQuotationAnalysisDetail`;
   getquotationanalysisMaster = `${environment.baseUrl}Transactions/GetQuotationAnalysis`;
   returnquotationanalysis = `${environment.baseUrl}Transactions/ReturnQuotationAnalysis`;
   /*******************************Purchase Order ****************************************************** */
   saveimage = `${environment.baseUrl}Transactions/UploadFile`;
   addpurchaseorder = `${environment.baseUrl}Transactions/AddPurchaseOrder`;
   getpurchaseorderDetail = `${environment.baseUrl}Transactions/GetPurchaseOrderDetail`;
   getpurchaseorderMaster = `${environment.baseUrl}Transactions/GetPurchaseOrder`;
   returnpurchaseorder = `${environment.baseUrl}Transactions/ReturnPurchaseOrder`;
   getPurchaseOrderApproveList = `${environment.baseUrl}Transactions/GetPurchaseOrderApproveList`;
   
   /*******************************Goods Receipt ****************************************************** */
   addgoodsreceipt = `${environment.baseUrl}Transactions/AddGoodsReceipt`;
   getgoodsreceiptDetail = `${environment.baseUrl}Transactions/GetGoodsReceiptDetail`;
   getgoodsreceipt = `${environment.baseUrl}Transactions/GetGoodsReceipt`;
   returngoodsreceipt = `${environment.baseUrl}Transactions/ReturnGoodsReceipt`;
   getGoodsReceiptApproval = `${environment.baseUrl}Transactions/GetGoodsReceiptApproval`;

   /*******************************Inspection Check ****************************************************** */
   addinspectioncheck = `${environment.baseUrl}Transactions/AddInpectionCheck`;
   getinspectioncheckDetail = `${environment.baseUrl}Transactions/GetInspectionCheckDetail`;
   getinspectioncheck = `${environment.baseUrl}Transactions/GetInspectionCheck`;
   returninspectioncheck = `${environment.baseUrl}Transactions/ReturnInpectionCheck`;
   /*******************************Invoice Verification  ****************************************************** */
   addinvoice = `${environment.baseUrl}Transactions/AddInvoiceverificationDetail`;
   getinvoiceDetail = `${environment.baseUrl}Transactions/GetInvoiceverificationDetail`;
   getQCReportDetail = `${environment.baseUrl}Transactions/GetQCReportDetail`;
   getPurchaseOrderData = `${environment.baseUrl}Transactions/GetPurchaseOrderData`;

   /*******************************PrimeryCost****************************************************** */
   addpccost = `${environment.baseUrl}PrimaryCostElementsCreation/UpdatePcost`;
   
   registerEmployee = `${environment.baseUrl}Employee/RegisterEmployee`;
   updateEmployee = `${environment.baseUrl}Employee/UpdateEmployee`;

   getDesignationsList = `${environment.baseUrl}Designation/GetDesignationsList`;

   //LeaveTypes

   getLeaveTypeatLists = `${environment.baseUrl}Selfservice/LeaveType/GetLeaveTypeList`;
   registerLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/RegisterLeaveType`;
   updateLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/UpdateLeaveType`;
   deleteLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/DeleteLeaveType`;

   //LeaveRequest

   getnoofdayscount = `${environment.baseUrl}Selfservice/LeaveRequest/Getnoofdayscount`;
   getEmpCode = `${environment.baseUrl}Common/GetEmployeeCode`;
   getEmpName = `${environment.baseUrl}Selfservice/LeaveRequest/GetEmpName`;
   updateLeaveRequests = `${environment.baseUrl}Selfservice/LeaveRequest/UpdateLeaveapplying`;
   getLeaveTypeatList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeavetpesList`;
   getLeaveRequestList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
   //getLeaveRequestList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
   registerLeaveRequests = `${environment.baseUrl}Selfservice/LeaveRequest/RegisterLeaveapplying`;


   //Applyod
   applyodRequestList = `${environment.baseUrl}Selfservice/Applyod/GetApplyodDetailsList`;
   registerodRequest = `${environment.baseUrl}Selfservice/Applyod/RegisterApplyOddataDetails`;
   updateapplyodRequest = `${environment.baseUrl}Selfservice/Applyod/UpdateApplyod`;

   //Advance
   applyadvanceRequestList = `${environment.baseUrl}Selfservice/Advance/GetApplyAdvanceDetailsList`;
   registeradvanceRequest = `${environment.baseUrl}Selfservice/Advance/RegisterApplyAdvancedataDetails`;
   updateapplyadvanceRequest = `${environment.baseUrl}Selfservice/Advance/UpdateAdvancedataDetails`;
   getAdvancetypeList = `${environment.baseUrl}Selfservice/Advance/GetAdvancedataDetailslist`;

   //PermissionRequest
   permissionRequestList = `${environment.baseUrl}Selfservice/PermissionRequest/GetPermissionApplDetailsList`;
   registerpermissionRequest = `${environment.baseUrl}Selfservice/PermissionRequest/RegisterPermissionapplying`;
   updatepermissionRequest = `${environment.baseUrl}Selfservice/PermissionRequest/UpdatePermissionapplying`;

   //PT Master
   getPTList = `${environment.baseUrl}payroll/PTMaster/GetPTList`;
   registerPT = `${environment.baseUrl}payroll/PTMaster/RegisterPT`;
   updatePT = `${environment.baseUrl}payroll/PTMaster/UpdatePT`;
   deletePT = `${environment.baseUrl}payroll/PTMaster/DeletePT`;

   // Component Master
   getComponentsList = `${environment.baseUrl}payroll/ComponentMaster/GetComponentsList`;
   registerComponent = `${environment.baseUrl}payroll/ComponentMaster/RegisterComponent`;
   getConfigurationList = `${environment.baseUrl}Common/GetConfigurationList`;
   updateComponent = `${environment.baseUrl}payroll/ComponentMaster/UpdateComponent`;
   deleteComponent = `${environment.baseUrl}payroll/ComponentMaster/DeleteComponent`;

    // Structure Creation
    getStructuresList = `${environment.baseUrl}payroll/StructureCreation/GetStructuresList`;
    registerStructure = `${environment.baseUrl}payroll/StructureCreation/RegisterStructure`;
    updateStructure = `${environment.baseUrl}payroll/StructureCreation/UpdateStructure`;
    deleteStructure = `${environment.baseUrl}payroll/StructureCreation/DeleteStructure`;
    getStructureComponentsList = `${environment.baseUrl}payroll/StructureCreation/GetComponentsList`;
    getPFList = `${environment.baseUrl}payroll/StructureCreation/GetPFList`;

   //PF Master
   getPfComponentsList = `${environment.baseUrl}Component/GetcomponentTypesList`;
   getPfList = `${environment.baseUrl}payroll/PFMaster/GetPFList`;
   registerPF = `${environment.baseUrl}payroll/PFMaster/RegisterPF`;
   updatePF = `${environment.baseUrl}payroll/PFMaster/UpdatePF`;
   deletePF = `${environment.baseUrl}payroll/PFMaster/DeletePF`;

   //approvaltype
   getempList = `${environment.baseUrl}Selfservice/ApprovalType/GetEmployeesList`;
   getapprovaltypeList = `${environment.baseUrl}Selfservice/ApprovalType/GetApprovalTypesList`;
   registerapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/RegisterApprovalType`;
   updateapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/UpdateApprovalType`;
   deleteapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/DeleteApprovalType`;


   //CTC Breakup
   getCTCList = `${environment.baseUrl}payroll/CTCBreakup/GetCTCList`;
   getStructureList = `${environment.baseUrl}Common/GetStructuresList`;
   getPFTypeList = `${environment.baseUrl}Common/GetPFList`;
   getpfTypesList = `${environment.baseUrl}PFMaster/GetpfTypesList`;
   getPTSlabList = `${environment.baseUrl}Common/GetPTList`;
   getptTypesList = `${environment.baseUrl}PTMaster/GetptTypesList`;
   getctcEmployeeList = `${environment.baseUrl}CTC/GetEmployeeList`;
   getStructures = `${environment.baseUrl}CTC/GetStructures`;
   getctcComponentsList = `${environment.baseUrl}payroll/ComponentMaster/GetComponentsList`;
   getctcDetailList = `${environment.baseUrl}CTC/GetctcDetailList`;
   
   //Leaveopeningbalance

   getLeaveTypeatListforlop = `${environment.baseUrl}masters/LeaveBalances/GetLeavetpeList`;
   getLeaveopeningbalanceList = `${environment.baseUrl}masters/LeaveBalances/GetLeaveBalancesList`;
   registerLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/RegisterLeaveBalancesList`;
   updateLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/UpdateLeaveBalancesList`;
   deleteLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/DeleteLeaveBalancesList`;

   getCashAccBranchesList = `${environment.baseUrl}gl/AsignmentCashAccBranch/GetBranchesList`;
   getCompaniesList = `${environment.baseUrl}gl/VoucherType/GetCompaniesList`;

   // opening balance
   getOpeningBalanceList = `${environment.baseUrl}/masters/OpeningBalance/GetOpeningBalanceList`;
   getObBranchesList = `${environment.baseUrl}/masters/OpeningBalance/GetBranchesList`;
   getObVoucherNo = `${environment.baseUrl}/masters/OpeningBalance/GetVoucherNo`;
   getPaymentType = `${environment.baseUrl}/masters/OpeningBalance/GetPaymentType`;
   registerOpeningBalance = `${environment.baseUrl}/masters/OpeningBalance/RegisterOpeningBalance`;

   getBPAccountLedgerList = `${environment.baseUrl}transactions/BankPayment/GetAccountLedgerList`;

   // Stock Excess
   getStockexcessList = `${environment.baseUrl}transactions/StockExcess/GetStockexcessList`;
   getStockExcessBranchesList = `${environment.baseUrl}transactions/StockExcess/GetBranchesList`;
   getstockexcessNo = `${environment.baseUrl}transactions/StockExcess/GetstockexcessNo`;
   getStockExcessCostCentersList = `${environment.baseUrl}transactions/StockExcess/GetCostCentersList`;
   getProductListsforStockexcessList = `${environment.baseUrl}transactions/StockExcess/GetProductLists`;
   registerStockexcess = `${environment.baseUrl}transactions/StockExcess/RegisterStockexcess`;
   getStockExcessDetailsList = `${environment.baseUrl}transactions/StockExcess/GetStockExcessDetailsList`;

   // ******************************** sales *********************************
   getSaleOrderApproveList = `${environment.baseUrl}Transactions/GetSaleOrderApproveList`;
   getInvoiceList = `${environment.baseUrl}sales/Billing/GetInvoiceList`;
   getCashPartyAccountList = `${environment.baseUrl}sales/Billing/GetCashPartyAccountList`;
   getCustomerGstNumList = `${environment.baseUrl}sales/Billing/GetCustomerGstNumList`;
   getBillingBranchesList = `${environment.baseUrl}sales/Billing/GetBranchesList`;
   getCashPartyAccount = `${environment.baseUrl}sales/Billing/GetCashPartyAccount`;
   getmemberNames = `${environment.baseUrl}sales/Billing/GetmemberNames`;
   getAccountBalance = `${environment.baseUrl}sales/Billing/GetAccountBalance`;
   generateBillNo = `${environment.baseUrl}sales/Billing/GenerateBillNo`;
   getProductByProductCode = `${environment.baseUrl}sales/Billing/GetProductByProductCode`;
   getProductByProductName = `${environment.baseUrl}sales/Billing/GetProductByProductName`;
   getBillingDetailsRcd = `${environment.baseUrl}sales/Billing/GetBillingDetailsRcd`;
   registerInvoice = `${environment.baseUrl}sales/Billing/RegisterInvoice`;
   getStateList = `${environment.baseUrl}sales/Billing/GeStateList`;
   getSelectedState = `${environment.baseUrl}sales/Billing/GeSelectedState`;
   getVechiels = `${environment.baseUrl}sales/Billing/GetVechiels`;
   getInvoiceDeatilList = `${environment.baseUrl}sales/Billing/GetInvoiceDeatilList`;
   getPupms = `${environment.baseUrl}sales/Billing/GetPupms`;
   generateSalesReturnInvNo = `${environment.baseUrl}transaction/SalesReturn/GenerateSalesReturnInvNo`;
   registerInvoiceReturn = `${environment.baseUrl}transaction/SalesReturn/RegisterInvoiceReturn`;
   getInvoiceReturnDetail = `${environment.baseUrl}transaction/SalesReturn/GetInvoiceReturnDetail`;
   getInvoiceGetInvoiceReturnList = `${environment.baseUrl}transaction/SalesReturn/GetInvoiceReturnList`;
   getmemberNamesByCode = `${environment.baseUrl}sales/Billing/GetmemberNamesByCode`;
   getInvoiceDeatilListsaleorder = `${environment.baseUrl}sales/Billing/GetInvoiceDeatilListsaleorder`;

   getStockTransferPrintReportData = `${environment.baseUrl}Reports/StockTransferPrintReport/GetStockTransferPrintReportData`;
   employeeattendance = `${environment.baseUrl}Reports/Employeeattendance`;
   eemployeeAttendanceChange = `${environment.baseUrl}Reports/EemployeeAttendanceChange`;
   addAttendance = `${environment.baseUrl}Transactions/AddAttendance`;

   //  stock Transfer
   generateStockTranfNo = `${environment.baseUrl}transaction/StockTransfer/GenerateStockTranfNo`;
   geProductsByName = `${environment.baseUrl}transaction/StockTransfer/GeProductsByName`;
   geProductsByCode = `${environment.baseUrl}transaction/StockTransfer/GeProductsByCode`;
   getStockTransferDetailsSection = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferDetailsSection`;
   getLtrs = `${environment.baseUrl}transaction/StockTransfer/GetLtrs`;
   registerStockTransfer = `${environment.baseUrl}transaction/StockTransfer/RegisterStockTransfer`;
   getStockTransferList = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferList`;
   getStockTransferDetilsaRecords = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferDetilsaRecords`;

   //AdvanceApproval
   getAdvanceApplDetailsList = `${environment.baseUrl}Selfservice/AdvanceApproval/GetAdvanceApprovalApplDetailsList`;
   RegisterAdvanceApprovalDetails = `${environment.baseUrl}Selfservice/AdvanceApproval/RegisterAdvanceApprovalDetails`;

   //VehicleApproval
   getVehicleApplDetailsList = `${environment.baseUrl}Selfservice/VehicleApproval/GetVehicleApprovalApplDetailsList`;
   RegisterVehicleApprovalDetails = `${environment.baseUrl}Selfservice/VehicleApproval/RegisterVehicleApprovalDetails`;

   //OdApproval
   getOdApplDetailsList = `${environment.baseUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;
   RegisterOdApprovalDetails = `${environment.baseUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;

   //Permission RequestApproval
   getPermissionrqstApplDetailsList = `${environment.baseUrl}Selfservice/PermissionApproval/GetPermissionApprovalApplDetailsList`;
   RegisterPermissionrqstApprovalDetails = `${environment.baseUrl}Selfservice/PermissionApproval/RegisterPermissionApprovalDetails`;

   // Leave Approval
   getLeaveApplDetailsList = `${environment.baseUrl}Selfservice/LeaveApproval/GetLeaveApplDetailsList`;
   RegisterLeaveApprovalDetails = `${environment.baseUrl}Selfservice/LeaveApproval/RegisterLeaveApprovalDetails`;
  
   getSaleOrder = `${environment.baseUrl}Transactions/GetSaleOrder`;
   getSaleOrderDetail = `${environment.baseUrl}Transactions/GetSaleOrderDetail`;
   getPurchaseRequisitionDetail = `${environment.baseUrl}Transactions/GetPurchaseRequisitionDetail`;
   addSaleOrder = `${environment.baseUrl}Transactions/AddSaleOrder`;
   getSaleOrderDetailPO = `${environment.baseUrl}Transactions/GetSaleOrderDetailPO`;

   getSaleOrderNumber = `${environment.baseUrl}Transactions/GetSaleOrderNumber`;
   getPurchaseOrderNumber = `${environment.baseUrl}Transactions/GetPurchaseOrderNumber`;
   uploadFile = `${environment.baseUrl}Transactions/UploadFile`;
   getFile = `${environment.baseUrl}Transactions/GetFile`;

   addProductionissue = `${environment.baseUrl}Transactions/AddProductionissue`;

   getProductionStatus = `${environment.baseUrl}Transactions/GetProductionStatus`;

   getPRList = `${environment.baseUrl}Common/GetPRList`;
   getBOMList = `${environment.baseUrl}Common/GetBOMList`;
   getFormList = `${environment.baseUrl}Common/GetFormList`;

   registerStandardRate = `${environment.baseUrl}StandardRate/RegisterStandardRate`;
   
   getInspectionDetail = `${environment.baseUrl}Transactions/GetInspectionDetail`;
   getInspectionCheckDetailbySaleorder = `${environment.baseUrl}Transactions/GetInspectionCheckDetailbySaleorder`;
   deletePurchaseOrder = `${environment.baseUrl}Common/DeletePurchaseOrder`;

   deleteBomDetail = `${environment.baseUrl}Common/DeleteBomDetail`;

   savePurchaseOrder = `${environment.baseUrl}Transactions/SavePurchaseOrder`;
   saveGoodsReceipt = `${environment.baseUrl}Transactions/SaveGoodsReceipt`;
   saveSaleOrderApproval = `${environment.baseUrl}Transactions/SaveSaleOrderApproval`;
   
   getInvoiceData = `${environment.baseUrl}sales/Billing/GetInvoiceData`;
   getInvoiceDetailList = `${environment.baseUrl}sales/Billing/GetInvoiceDetailList`;
   
   getJobWork = `${environment.baseUrl}Transactions/GetJobWork`;
   addJobWork = `${environment.baseUrl}Transactions/AddJobWork`;
   getJobworkDetail = `${environment.baseUrl}Transactions/GetJobworkDetail`;

   getMaterialIssue = `${environment.baseUrl}Transactions/GetMaterialIssue`;
   addMaterialIssue = `${environment.baseUrl}Transactions/AddMaterialIssue`;
   getMaterialIssueDetail = `${environment.baseUrl}Transactions/GetMaterialIssueDetail`;
   
   getJWReceipt = `${environment.baseUrl}Transactions/GetJWReceipt`;
   addJWReceipt = `${environment.baseUrl}Transactions/AddJWReceipt`;
   getJWReceiptDetail = `${environment.baseUrl}Transactions/GetJWReceiptDetail`;
   getJobWorkDetails = `${environment.baseUrl}Common/GetJobWorkDetails`;
   updateProductionStatus = `${environment.baseUrl}Transactions/UpdateProductionStatus`;

   getOrdersvsSales = `${environment.baseUrl}Reports/GetOrdersvsSales`;

   getEmpPresent = `${environment.baseUrl}Reports/GetEmpPresent`;
   gLsubAccountListbyCatetory = `${environment.baseUrl}Common/GLsubAccountListbyCatetory`;

   getBomDetail = `${environment.baseUrl}Common/GetBomDetail`;
   
   registerAttendanceProcess = `${environment.baseUrl}AttendanceProcess/RegisterAttendanceProcess`;

   getSourceSupplyDetailByMaterial = `${environment.baseUrl}Transactions/GetSourceSupplyDetailByMaterial`;

}
