import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},
  {
    path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [

      { path: '', redirectTo: 'dashboardGraph', pathMatch: 'full' },
      { path: 'dashboardGraph', loadComponent: () => import('./components/dashboard/dashboard-graph/dashboard-graph.component').then(m => m.DashboardGraphComponent)},

      // standard screens
      { path: 'rolePrevilages/role', loadComponent: () => import('./components/dashboard/rolesprevilages/rolesprevilages.component').then(m => m.RolesprevilagesComponent)},

      // masters screen
      { path: 'master/:id/:id1',  loadComponent: () => import('./components/dashboard/comp-list/comp-tabs/comp-tabs.component').then(m => m.CompTabsComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'master/:id', loadComponent: () => import('./components/dashboard/comp-list/comp-list.component').then(m => m.CompListComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      // transation screens
      { path: 'transaction/:id/:id1', loadComponent: () => import('./components/dashboard/trans-list/trans-list.component').then(m => m.TransListComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'transaction/:id', loadComponent: () => import('./components/dashboard/trans-list/trans-list.component').then(m => m.TransListComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      { path: 'reports/:id', loadComponent: () => import('./components/dashboard/reports/reports.component').then(m => m.ReportsComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'graphs/:id', loadComponent: () => import('./components/dashboard/graphs/graphs.component').then(m => m.GraphsComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },

      { path: 'sales/:id/createStockTransfer', loadComponent: () => import('./components/dashboard/trans-list/stocktransfer/create-stock-transfer/create-stock-transfer.component').then(m => m.CreateStockTransferComponent), data: { title: 'Create Sale' }, canActivate: [AuthGuard] },
      { path: 'sales/:id/createStockTransfer/:id1', loadComponent: () => import('./components/dashboard/trans-list/stocktransfer/create-stock-transfer/create-stock-transfer.component').then(m => m.CreateStockTransferComponent), data: { title: 'Create Sale' }, canActivate: [AuthGuard] },
      { path: 'transactions/:id/createStockExcess', loadComponent: () => import('./components/dashboard/trans-list/stockexcess/create-stockexcess/create-stockexcess.component').then(m => m.CreateStockExcessComponent), data: { title: 'Create StockExcess' }, canActivate: [AuthGuard] },
      { path: 'transactions/:id/createStockExcess/:id1', loadComponent: () => import('./components/dashboard/trans-list/stockexcess/create-stockexcess/create-stockexcess.component').then(m => m.CreateStockExcessComponent), data: { title: 'Create StockExcess' }, canActivate: [AuthGuard] },
      
    //   // primary screens
      { path: 'primary/:id', loadComponent: () => import('./components/dashboard/primary/primary.component').then(m => m.PrimaryComponent), canActivate: [AuthGuard], resolve: { routeConfig: AuthGuard } },
      { path: 'preview', loadComponent: () => import('./components/dashboard/trans-list/purcahseorder/preview/preview.component').then(m => m.PreviewComponent) },
      { path: 'inspection-preview', loadComponent: () => import('./components/dashboard/trans-list/inspectioncheck/inspection-preview/inspection-preview.component').then(m => m.InspectionPreviewComponent)}
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
