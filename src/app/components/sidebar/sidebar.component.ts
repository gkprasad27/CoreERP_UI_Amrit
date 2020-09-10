import {Component, HostBinding, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { isNullOrUndefined } from 'util';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarComponent implements OnInit {


  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
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

    if (!isNullOrUndefined(item.children)) {
      this.commonService.parentItem = item.route;

    }
    if (!item.children || !item.children.length) {
      this.commonService.routeParam = item.route;
      const route = String.Join('/', 'dashboard', item.screenType, item.route  );
      this.router.navigate([ route ]);
      this.commonService.toggleSidebar();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
