import { Routes, RouterModule } from '@angular/router';

import { AlarmsComponent } from './alarms/alarms.component';
import { SummaryComponent } from './summary/summary.component';

export const AlarmsRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboards/mainDashboard', // 'home'
        pathMatch: 'full'
    },
    {
        path: 'alarms',
        component: AlarmsComponent,
        data: { title: 'Alarm Configuration', breadcrumb: 'Alarm Configuration' }
    },
    {
        path: 'summary',
        component: SummaryComponent,
        data: { title: 'Active Alarm Summary', breadcrumb: 'Active Alarm Summary' }
    }

];

// RouterModule.forRoot(
//   AlarmsRoutes,
//   { enableTracing: true } // <-- debugging purposes only
// )