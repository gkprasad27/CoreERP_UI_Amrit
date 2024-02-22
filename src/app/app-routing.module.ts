import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent, DashboardComponent, NotFoundComponent } from './components/index';
import { CompListComponent } from './components/dashboard/comp-list/comp-list.component';
import { RolesprevilagesComponent } from './components/dashboard/rolesprevilages/rolesprevilages.component';
import { TransListComponent } from './components/dashboard/trans-list/trans-list.component';
import { CompTabsComponent } from './components/dashboard/comp-list/comp-tabs/comp-tabs.component';
import { PrimaryComponent } from './components/dashboard/primary/primary.component';
import { CreateStockExcessComponent, CreateStockTransferComponent, InspectionPreviewComponent, PreviewComponent } from './components/dashboard/trans-list';
import { ReportsComponent } from './components/dashboard/reports/reports.component';
import { GraphsComponent } from './components/dashboard/graphs/graphs.component';
import { DashboardGraphComponent } from './components/dashboard/dashboard-graph/dashboard-graph.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [

      { path: '', redirectTo: 'dashboardGraph', pathMatch: 'full' },
      { path: 'dashboardGraph', component: DashboardGraphComponent },

      // standard screens
      { path: 'rolePrevilages/role', component: RolesprevilagesComponent },

      // masters screen
      { path: 'master/:id/:id1', component: CompTabsComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'master/:id', component: CompListComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      // transation screens
      { path: 'transaction/:id/:id1', component: TransListComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'transaction/:id', component: TransListComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      { path: 'reports/:id', component: ReportsComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'graphs/:id', component: GraphsComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      { path: 'sales/:id/createStockTransfer', component: CreateStockTransferComponent, data: { title: 'Create Sale' }, canActivate: [AuthGuard] },
      { path: 'sales/:id/createStockTransfer/:id1', component: CreateStockTransferComponent, data: { title: 'Create Sale' }, canActivate: [AuthGuard] },
      { path: 'transactions/:id/createStockExcess', component: CreateStockExcessComponent, data: { title: 'Create StockExcess' }, canActivate: [AuthGuard] },
      { path: 'transactions/:id/createStockExcess/:id1', component: CreateStockExcessComponent, data: { title: 'Create StockExcess' }, canActivate: [AuthGuard] },
      
      // primary screens
      { path: 'primary/:id', component: PrimaryComponent, canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'preview', component: PreviewComponent },
      { path: 'inspection-preview', component: InspectionPreviewComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
