import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig, MatInputModule } from '@angular/material';

// import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { suppressScrollX: true };

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth/auth-http-interceptor.interceptor';
import { TooltipModule } from 'ng2-tooltip-directive';

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
  MatSelectModule,
  MatCheckboxModule,
  MatDialogModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { AppComponent } from './app.component';
import { AgGridModule } from '@ag-grid-community/angular';


import { ErrorHandlerService } from './shared/services/error-handler.service';
import { PhoneValidatorDirective } from './shared/validators/phone-validator.directive';

import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { IsNumberDirective } from './shared/validators/is-number.directive';
import { FlexibleDialogComponent } from './shared/flexible-dialog/flexible-dialog.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  imports: [
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    // PerfectScrollbarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(
      rootRouterConfig,
      { useHash: false }
    ),
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
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,

    FlexLayoutModule,
    NgxDatatableModule,
    SharedPipesModule,
    ReactiveFormsModule,
    TooltipModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [
    AppComponent,
    PhoneValidatorDirective,
    IsNumberDirective,
    FlexibleDialogComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    // { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  entryComponents: [FlexibleDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
