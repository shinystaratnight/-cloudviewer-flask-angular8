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
import { SharedModule } from '../../shared/shared.module';

import { TooltipModule } from 'ng2-tooltip-directive';

// For Google Maps to work
import { AgmCoreModule } from '@agm/core';

// High Charts
import { HighchartsChartModule } from 'highcharts-angular';

// Routing and Services
import { AnalyticsRoutes } from './analytics.routing';
import { AnalyticsService } from './analytics.service';

// Component specific entries
import { TrendingComponent } from './trending/trending.component';

// Entry Components

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
        HighchartsChartModule,
        RouterModule.forChild(AnalyticsRoutes),
        TooltipModule,
    ],
    declarations: [
        TrendingComponent,
        ],
    providers: [AnalyticsService],
    entryComponents: []
})
export class AnalyticsModule { }
