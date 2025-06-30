import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
import { RuntimeConfigService } from './services/runtime-config.service';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavbarComponent } from './reuse-components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNavbar: any;

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
