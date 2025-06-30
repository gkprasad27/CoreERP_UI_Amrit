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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-capadetails',
  imports: [ CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule ],
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
    private datepipe: DatePipe,
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
      saleOrderNo : [null],
      custmerPO : [null],

      addDate: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      customerName: [''],

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

      defectCause : [null],
      defectCasuseDate : [null],
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
      custVerificationResp : [null],


    });

    this.formData = { ...this.addOrEditService.editData };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
  }

  ngOnInit() {
  }

  save() {
    this.modelFormData.patchValue({
      addDate: new Date(),
    })
    this.addOrEditService[this.formData.action]({ item: this.modelFormData.value }, (res) => {
      if (res) {
        this.router.navigate(['/dashboard/master/CAPAdetails']);
      }
    });
  }


  cancel() {
    this.router.navigate(['/dashboard/master/CAPAdetails']);
  }

  data: any;
  print() {
    this.data = this.modelFormData.value;
    setTimeout(() => {
      var w = window.open();
      var html = document.getElementById('printData').innerHTML;
      w.document.body.innerHTML = html;
      this.data = null;
      w.print();
    }, 1000);
  }



}
