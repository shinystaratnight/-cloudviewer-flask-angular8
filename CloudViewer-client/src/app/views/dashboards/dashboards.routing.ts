import { Routes } from '@angular/router';

import { DashboardMainComponent } from './mainDashboard/dashboard-main.component';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboards/mainDashboard', // 'home'
        pathMatch: 'full'
    },
    {
        path: 'mainDashboard',
        component: DashboardMainComponent,
        data: { title: 'Map', breadcrumb: 'Map' }
    },
    {
        path: 'assetDashboard',
        component: AssetDashboardComponent,
        data: { title: 'List', breadcrumb: 'List' }
    }

];
