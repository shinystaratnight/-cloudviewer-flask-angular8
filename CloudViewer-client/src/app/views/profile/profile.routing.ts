import { Routes } from '@angular/router';

import { ProfileViewComponent } from './profile-view/profile-view.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { JwtComponent } from './jwt/jwt.component';
import { FleetComponent } from './fleet/fleet.component';


export const ProfileRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboards/mainDashboard', // 'home'
        pathMatch: 'full'
    },
    {
        path: 'overview',
        component: ProfileViewComponent,
        data: { title: 'Overview', breadcrumb: 'Overview' }
    },
    {
        path: 'settings',
        component: AccountSettingsComponent,
        data: { title: 'Change Phone Number', breadcrumb: 'Change Phone Number' }
    },
    {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: { title: 'Change Password', breadcrumb: 'Change Password' }
    },
    {
        path: 'jwt',
        component: JwtComponent,
        data: { title: 'JWT Token', breadcrumb: 'JWT Token' }
    },
    {
        path: 'fleet',
        component: FleetComponent,
        data: { title: 'Fleets', breadcrumb: 'Fleets' }
    }

];
