import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, TranslatePipe, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  openMenu = false;
  loginUser: any;
  showExpandButtons: any;


  @Input() set showExpandButton(val: string) {
    this.loginUser = JSON.parse(localStorage.getItem('user'));
    this.showExpandButtons = val;
  }

  constructor(
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,

  ) { }

  ngOnInit() {
  }

  logout() {
    const logoutUrl = String.Join('/', this.apiConfigService.logoutUrl, this.loginUser.seqId);
    this.apiService.apiGetRequest(logoutUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (!this.commonService.checkNullOrUndefined(res.response)) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      });
  }

  openSetting() {
    this.router.navigateByUrl('/dashboard/setting');
  }

  openCloseMemu() {
    if (this.openMenu) {
      this.commonService.toggleSidebar();
      this.openMenu = false;
    } else {
      this.commonService.toggleSidebar();
      this.openMenu = true;
    }
  }
}
