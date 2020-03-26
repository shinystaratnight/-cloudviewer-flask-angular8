import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from '@services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'dashboards/mainDashboard', // 'home'
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
    data: { title: 'Portal' }
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboards',
        loadChildren: () => import('./views/dashboards/dashboards.module').then(m => m.DashboardsModule),
        data: { title: 'Dashboards', breadcrumb: 'Dashboard' }
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'User Profile', breadcrumb: 'User Profile' }
      },
      {
        path: 'manage',
        loadChildren: () => import('./views/manage/manage.module').then(m => m.ManageModule),
        data: { title: 'Manage', breadcrumb: 'Manage' }
      },
      {
        path: 'alarms',
        loadChildren: () => import('./views/alarms/alarms.module').then(m => m.AlarmsModule),
        data: { title: 'Alarms', breadcrumb: 'Alarms' }
      },
      {
        path: 'analytics',
        loadChildren: () => import('./views/analytics/analytics.module').then(m => m.AnalyticsModule),
        data: { title: 'Analytics', breadcrumb: 'Analytics' }
      },
      {
        path: 'ELIMSAdmin',
        loadChildren: () => import('./views/elims_admin/elims_admin.module').then(m => m.ElimsAdminModule),
        data: { title: 'ELIMS Admin', breadcrumb: 'ELIMS Admin' }
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/sessions/404'
  }
];

// RouterModule.forRoot(
//   rootRouterConfig,
//   { enableTracing: true } // <-- debugging purposes only
// )

