import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule,
  MatSelectModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from '@ag-grid-community/angular';

import { SharedModule } from '../../shared/shared.module';

import { DashboardMainComponent } from './mainDashboard/dashboard-main.component';
import { DashboardRoutes } from './dashboards.routing';

// For Google Maps to work
import { AgmCoreModule } from '@agm/core';

import { DashboardService } from './dashboard.service';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';

// import {RouterModule} from '@angular/router';

import { AssetsService } from '../manage/assets/assets.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatGridListModule,
    MatSlideToggleModule,
    SharedModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    TranslateModule,
    SharedPipesModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCT-5kibsHElB99VnPQc-wM4sdkqv855UU' }),
    RouterModule.forChild(DashboardRoutes),
    AgGridModule.withComponents([]),
  ],
  declarations: [DashboardMainComponent, AssetDashboardComponent],
  providers: [
    DashboardService,
    AssetsService,
  ],
})
export class DashboardsModule { }
