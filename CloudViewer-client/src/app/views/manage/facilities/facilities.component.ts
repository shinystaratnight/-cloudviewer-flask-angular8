import { NgModule, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ManageService } from '../../manage/manage.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { AgGridModule } from '@ag-grid-community/angular';
import { AllCommunityModules } from '@ag-grid-community/all-modules';

import { GlobalService } from '@services/global-service/global-service.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  // https://www.ag-grid.com/angular-grid/
  modules = AllCommunityModules;
  private gridApi;
  private gridColumnApi;
  public rowClassRules;

  myForm: FormGroup;
  public items: any[];
  public items_filtered: any[];

  public columns = [
    { headerName: 'ID', sortable: true },
    { headerName: 'Name', sortable: true },
    { headerName: 'lat', sortable: true },
    { headerName: 'lng', sortable: true },
    { headerName: 'LastUpdate', sortable: true },
    { headerName: 'term', sortable: true },
  ];

  constructor(
    private snack: MatSnackBar,
    private manageService: ManageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {

    this.setup();

    this.myForm = this.fb.group({
      filterText: [''],
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
  }

  setup() {
    let obs = this.manageService.getFacilityAll();
    let getItemSub = obs.subscribe(data => {
      this.items = data;
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
      this.updateFilter(false);
    })
    return obs;
  }

  ngOnInit() {
  }

  updateFilter(event) {

    this.autoSizeAll();
    // copy Items list to filered list.....into a new, unreferenced array
    this.items_filtered = this.items.slice();

    // no filter text
    let items_filter = this.myForm.controls['filterText'].value;
    if (items_filter == '') { return true };

    items_filter = items_filter.toLowerCase();

    let columns = Object.keys(this.items_filtered[0]);

    // if nothing, return
    if (!columns.length) { return false };

    this.items_filtered = this.items_filtered.filter(function (row) {
      for (let i = 0; i <= columns.length; i++) {
        if (row[columns[i]] && row[columns[i]].toString().toLowerCase().indexOf(items_filter) > -1) {
          return true;
        }
      }
      return false;
    });

    this.cdr.markForCheck();
  }

  autoSizeAll() {
    if (this.gridColumnApi === undefined) { return false }
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }


  viewDetails(row) {
    this.router.navigate(['../detail/' + row.id], { relativeTo: this.route }).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    });
  }


}
