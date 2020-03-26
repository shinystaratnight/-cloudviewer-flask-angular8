import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
    MatSelectModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { TranslateModule } from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';

// For Google Maps to work
import { AgmCoreModule } from '@agm/core';

// High Charts
import { HighchartsChartModule } from 'highcharts-angular';

// Routing and Services
import { AlarmsRoutes } from './alarms.routing';
import { AlarmsService} from './alarms.service';

// Component specific entries
import { AlarmsComponent } from './alarms/alarms.component';

// Entry Components
import { PopupComponent } from './alarms/ngx-table-popup/ngx-table-popup.component';
import { AssetTablePopupComponent2 } from './alarms/asset-table-popup/asset-table-popup.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  imports: [
        CommonModule,
        ReactiveFormsModule,
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
        AgmCoreModule.forRoot({apiKey: 'AIzaSyCT-5kibsHElB99VnPQc-wM4sdkqv855UU'}),
        HighchartsChartModule,
        RouterModule.forChild(AlarmsRoutes),
    ],
  declarations: [AlarmsComponent, PopupComponent, AssetTablePopupComponent2, SummaryComponent],
  providers: [AlarmsService],
  entryComponents: [PopupComponent, AssetTablePopupComponent2],
})
export class AlarmsModule { }
