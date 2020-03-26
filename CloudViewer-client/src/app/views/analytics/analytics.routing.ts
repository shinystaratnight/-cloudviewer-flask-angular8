import { Routes, RouterModule } from '@angular/router';
import { TrendingComponent } from './trending/trending.component';

export const AnalyticsRoutes: Routes = [
  {
    path: '',
    redirectTo: '/analytics/trending', // 'home'
    pathMatch: 'full'
  },
  {
    path: 'trending',
    component: TrendingComponent,
    data: { title: 'Trending', breadcrumb: 'Trending' },
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