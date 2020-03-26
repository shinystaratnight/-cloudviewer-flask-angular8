import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileRoutes } from './profile.routing';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { JwtComponent } from './jwt/jwt.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { FleetComponent } from './fleet/fleet.component';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(ProfileRoutes)
  ],
  declarations: [AccountSettingsComponent, AccountSettingsComponent, ChangePasswordComponent, JwtComponent, ProfileViewComponent, FleetComponent]
})
export class ProfileModule { }
