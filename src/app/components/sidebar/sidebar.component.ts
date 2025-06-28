import { Component, HostBinding, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { String } from 'typescript-string-operations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule, MatIconModule, MatListModule ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @Input() item: any;
  @Input() depth: number;

  constructor(public commonService: CommonService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.commonService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: any) {

    if (!this.commonService.checkNullOrUndefined(item.children)) {
      this.commonService.parentItem = item.route;

    }
    if (!item.children || !item.children.length) {
      this.commonService.routeParam = item.route;
      const route = String.Join('/', 'dashboard', item.screenType, item.route);
      this.router.navigate([route]);
      this.commonService.toggleSidebar();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
