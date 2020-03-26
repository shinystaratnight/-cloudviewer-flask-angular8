import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { WellsitesComponent } from './wellsites/wellsites.component';
import { WellsiteModifyComponent } from './wellsites/wellsite-modify/wellsite-modify.component';
import { WellsiteFilesComponent } from './wellsites/wellsite-files/wellsite-files.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { FacilityDetailComponent } from './facilities/facility-detail/facility-detail.component';

export const ManageRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboards/mainDashboard', // 'home'
        pathMatch: 'full'
    },
    {
        path: 'assets',
        component: AssetsComponent,
        data: { title: 'Assets', breadcrumb: 'Assets' },
        // children: [
        // ]
    },
    {
        path: 'detail/:id',
        component: AssetDetailComponent,
        data: { title: 'Asset Details', breadcrumb: 'Asset Details' }
    },
    {
        path: 'wellsites',
        component: WellsitesComponent,
        data: { title: 'Well Sites', breadcrumb: 'Well Sites' }
    },
    {
        path: 'wellsiteModify/:id',
        component: WellsiteModifyComponent,
        data: { title: 'Modify Well Sites', breadcrumb: 'Modify Well Sites' }
    },
    {
        path: 'wellsiteFiles/:id',
        component: WellsiteFilesComponent,
        data: { title: 'Modify Well Files', breadcrumb: 'Modify Well Files' }
    },
    {
        path: 'facilities',
        component: FacilitiesComponent,
        data: { title: 'Facilities', breadcrumb: 'Facilities' }
    },
    {
        path: 'facilities/:id',
        component: FacilityDetailComponent,
        data: { title: 'Facility Detail', breadcrumb: 'Facility Detail' }
    },


    // {
    //     path: 'wells',
    //     component: WellsComponent,
    //     data: {title: 'wells', breadcrumb: "Wells"}
    // }

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