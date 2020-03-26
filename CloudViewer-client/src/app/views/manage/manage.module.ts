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
import { ManageRoutes } from './manage.routing';
import { AssetsService } from './assets/assets.service';
import { WellsitesService } from './wellsites/wellsites.service';
import { ManageService } from './manage.service';

// Component specific entries
import { AssetsComponent } from './assets/assets.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { WellsitesComponent } from './wellsites/wellsites.component';
import { WellsiteModifyComponent } from './wellsites/wellsite-modify/wellsite-modify.component';
import { WellsComponent } from './wells/wells.component';
import { WellUpdatePopupComponent } from './wells/well-update-popup/well-update-popup.component';

// Entry Components
import { AssetTablePopupComponent } from './assets/asset-table-popup/asset-table-popup.component';
import { WellsiteFilesComponent } from './wellsites/wellsite-files/wellsite-files.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { FacilityDetailComponent } from './facilities/facility-detail/facility-detail.component';

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
        RouterModule.forChild(ManageRoutes),
        TooltipModule,
    ],
    declarations: [
        AssetsComponent,
         AssetDetailComponent,
         AssetTablePopupComponent,
         WellsitesComponent,
         WellsiteModifyComponent,
         WellsComponent,
         WellUpdatePopupComponent,
         WellsiteFilesComponent,
         FacilitiesComponent,
         FacilityDetailComponent,
        ],
    providers: [AssetsService, WellsitesService, ManageService],
    entryComponents: [AssetTablePopupComponent]
})
export class ManageModule { }
