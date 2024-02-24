import { Component, Inject, AfterViewInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { RuntimeConfigService } from './services/runtime-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavbar : any;

  constructor(
    private commonService: CommonService,
    private runtimeConfigService: RuntimeConfigService

    ) {
    this.commonService.getLangConfig();
    commonService.showNavbar.subscribe(res => {
      this.showNavbar = res;
    })
    this.runtimeConfigService.getTableColumns();

  }

 }
