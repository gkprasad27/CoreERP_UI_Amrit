import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';
import { String } from 'typescript-string-operations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConfigService } from '../../services/api-config.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  form: FormGroup;

  loginUrlData: any;

  isSubmitted = false;

  showOtp = false;
  ramdomNumber = Math.floor(Math.random() * 1000000)

  constructor(
    public translate: TranslateService,
    private apiConfigService: ApiConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private http: HttpClient,
    private commonService: CommonService
  ) {
    commonService.showNavbar.next(false);
  }

  // form model
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      langSelect: ['english', Validators.required]
    });
    this.form = this.formBuilder.group({
      otp: ['', Validators.required],
    });
  }

  // Language Preference
  setLang(lang) {
    localStorage.setItem(Static.DefaultLang, lang.toLowerCase());
    this.translate.use(lang.toLowerCase());
    this.translate.currentLang = lang;
  }

  onotp() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.otp != this.ramdomNumber) {
      this.alertService.openSnackBar('Invalid Otp', Static.Close, SnackBar.error);
    } else {
      this.setRoute();
    }
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loginAPICall();
  }

  loginAPICall() {
    // // this.spinner.show();
    const requestObj = { UserName: this.loginForm.get('username').value, Password: this.loginForm.get('password').value };
    const getLoginUrl = String.Join('/', this.apiConfigService.loginUrl);
    this.apiService.apiPostRequest(getLoginUrl, requestObj)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.loginUrlData = res.response;
              this.otpApi();
            }
          } else {
            this.spinner.hide();
          }
        });
  }

  otpApi() {
    this.getList()
      .subscribe(
        response => {
          this.spinner.hide();
          this.showOtp = true;
        });
  }

  getList(): Observable<any> {
    const getLoginUrl = `https://dlt.fastsmsindia.com/messages/sendSmsApi?username=AMTpower&password=AMTpower@&drout=3&senderid=AMTHYD&intity_id=1201171169797828072&template_id=1207171644087137963&numbers=${9666756333}&language=en&message=Hello,%20${this.ramdomNumber}%20is%20your%20OTP%20to%20Access%20AMT%20ERP.%20-AMT%20Power%20Transmission`
    return this.http.get<any>(getLoginUrl);
  }

  setRoute() {
    //  this.getBranchesForUser(res.response['User']);
    localStorage.setItem('Token', JSON.stringify(this.loginUrlData['Token']));
    this.authService.login(this.loginUrlData.User);
    this.router.navigate(['dashboard']);
  }

  getBranchesForUser(obj) {
    const getBranchesForUserUrl = String.Join('/', this.apiConfigService.getBranchesForUser, obj.seqId);
    this.apiService.apiGetRequest(getBranchesForUserUrl).subscribe(
      response => {
        const res = response;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            if (!this.commonService.checkNullOrUndefined(res.response['Branches'])) {
              obj.branchCode = res.response['Branches'][0];
              localStorage.setItem('branchList', JSON.stringify(res.response['Branches']));
              this.authService.login(obj);
              this.alertService.openSnackBar(Static.LoginSussfull, Static.Close, SnackBar.success);
              this.router.navigate(['dashboard']);
              this.spinner.hide();
            }
          }
          this.spinner.hide();
        }
      });
  }


  get formControls() { return this.loginForm.controls; }

}
