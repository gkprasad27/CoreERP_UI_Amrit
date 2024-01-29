import { Component, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { AddOrEditService } from '../add-or-edit.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-capadetails',
  templateUrl: './capadetails.component.html',
  styleUrls: ['./capadetails.component.scss']
})
export class CAPAdetailsComponent {

  formData: any;

  modelFormData: FormGroup;

  constructor(
    private apiConfigService: ApiConfigService,
    private commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private addOrEditService: AddOrEditService,
    private router: Router,
  ) {
    this.modelFormData = this.formBuilder.group({

      id: [],
      deadlineMonitorDate: [null],
      notificationNo : [null],
      notificationDate : [null],
      itemCode : [null],
      materialDescription : [null],
      complaintQty : [null],
      tag : [null],

      receivedParts : [null],
      receivedPartsDate : [null],

      analysisBugun : [null],
      analysisBugunDate : [null],

      defectCauseAcknowledge : [null],
      defectCauseAcknowledgeDate : [null],

      shortTermSol : [null],
      shortTermSolDate : [null],

      longTermSol : [null],
      longTermSolDate : [null],

      containmentReqd : [null],
      containmentReqdDate : [null],

      solutionInspected : [null],
      solutionInspectedDate : [null],

      decfectDescription : [null],
      defectCasuseResp : [null],

      shortTermSolution : [null],
      shortTermSolutionDate : [null],
      shortTermSolutionResp : [null],

      longTermSolution : [null],
      longTermSolutionDate : [null],
      longTermSolutionResp : [null],

      identificationOfDelvrdMaterial : [null],
      identificationOfDelvrdMaterialDate : [null],
      identificationOfDelvrdMaterialResp : [null],

      checkSuccessDelrdMaterail : [null],
      checkSuccessDelrdMaterailDate : [null],
      checkSuccessDelrdMaterailResp : [null],

      containmentAccess : [null],
      containmentAccessDate : [null],
      containmentAccessResp : [null],

      custVerification : [null],
      custVerificationDate : [null],


    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
  }

  ngOnInit() {
  }

  save() {
    this.addOrEditService[this.formData.action]({ item: this.modelFormData.value }, (res) => {
      if (res) {
        this.router.navigate(['/dashboard/master/CAPAdetails']);
      }
    });

  }


  cancel() {
    this.router.navigate(['/dashboard/master/CAPAdetails']);
  }


}
