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
    MatCheckboxModule,
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
import { ElimsAdminRoutes } from './elims_admin.routing';
import { ElimsAdminService } from './elims_admin.service';

// Component specific entries
import { UsersListComponent } from './users/user-list/user-list.component';
import { RequestsComponent } from './users/requests/requests.component';
import { CompaniesComponent } from './Company/companies/companies.component';
import { DistrictsComponent } from './Company/districts/districts.component';
import { RolesComponent } from './roles/roles.component';
import { AssetsComponent } from './assets/assets.component';

// Entry Components
import { CompanyTablePopupComponent } from './Company/companies/company-table-popup/company-table-popup.component';
import { DistrictsTablePopupComponent } from './Company/districts/districts-table-popup/districts-table-popup.component';

// Auto Added

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
        MatCheckboxModule,
        AgmCoreModule.forRoot({ apiKey: 'AIzaSyCT-5kibsHElB99VnPQc-wM4sdkqv855UU' }),
        HighchartsChartModule,
        RouterModule.forChild(ElimsAdminRoutes),
        TooltipModule,
    ],
    declarations: [
        UsersListComponent,
        RequestsComponent,
        CompaniesComponent,
        DistrictsComponent,
        RolesComponent,
        AssetsComponent,
        CompanyTablePopupComponent,
        DistrictsTablePopupComponent,
    ],
    providers: [ElimsAdminService],
    entryComponents: [CompanyTablePopupComponent, DistrictsTablePopupComponent]
})
export class ElimsAdminModule { }
