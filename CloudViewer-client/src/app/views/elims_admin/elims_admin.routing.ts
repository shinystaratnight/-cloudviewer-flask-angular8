import { Routes, RouterModule } from '@angular/router';
// import { DefaultComponent } from './default/default.component';
import { UsersListComponent } from './users/user-list/user-list.component';
import { RequestsComponent } from './users/requests/requests.component';
import { CompaniesComponent } from './Company/companies/companies.component';
import { DistrictsComponent } from './Company/districts/districts.component';
import { AssetsComponent } from './assets/assets.component';
import { RolesComponent } from './roles/roles.component';


export const ElimsAdminRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboards/mainDashboard', // 'home'
        pathMatch: 'full'
    },
    {
        path: 'users',
        data: { title: 'View Users', breadcrumb: 'View Users' },
        children: [
            {
                path: '',
                redirectTo: 'user-list', // 'home'
                pathMatch: 'full'
            },
            {
                path: 'user-list',
                component: UsersListComponent,
                data: { title: 'View Users', breadcrumb: 'View Users' }
            },
            {
                path: 'requests',
                component: RequestsComponent,
                data: { title: 'User Requests', breadcrumb: 'User Requests' }
            }
        ]
    },
    {
        path: 'company',
        data: { title: 'Company', breadcrumb: 'Company' },
        children: [
            {
                path: '',
                redirectTo: 'companies',
                pathMatch: 'full'
            },
            {
                path: 'companies',
                component: CompaniesComponent,
                data: { title: 'Companies List', breadcrumb: 'Companies List' }
            },
            {
                path: 'districts',
                component: DistrictsComponent,
                data: { title: 'Districts', breadcrumb: 'Districts' }
            },
            {
                path: 'districts/:Company',
                component: DistrictsComponent,
                data: { title: 'Districts', breadcrumb: 'Districts' }
            }
        ]
    },
    {
        path: 'assets',
        component: AssetsComponent,
        data: { title: 'Assets', breadcrumb: 'Assets' }
    },
    {
        path: 'roles',
        component: RolesComponent,
        data: { title: 'Roles', breadcrumb: 'Roles' }
    }

];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(
//       ManageRoutes1,
//       { enableTracing: true } // <-- debugging purposes only
//     )
//     // other imports here
//   ],
// })
// export class ManageRoutes {}
