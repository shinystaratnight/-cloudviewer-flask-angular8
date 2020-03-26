import { NgModule, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { AssetsService } from '../../manage/assets/assets.service';
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
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.scss']
})
export class AssetDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  // https://www.ag-grid.com/angular-grid/
  modules = AllCommunityModules;
  private gridApi;
  private gridColumnApi;
  public rowClassRules;

  myForm: FormGroup;
  public items: any[];
  public items_filtered: any[];

  public getItemSub: Subscription;
  public getWellsSub: Subscription;
  public MyText: String;
  public WellSiteList: any[];
  public columns = [
    { headerName: 'Name', sortable: true },
    { headerName: 'Level', sortable: true },
    { headerName: 'Active Wellsite', sortable: true }
  ];

  constructor(
    private snack: MatSnackBar,
    private assetService: AssetsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {


    this.setup();
    this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));

    this.myForm = this.fb.group({
      filterText: [''],
    });

    this.rowClassRules = {
      'alarming': 'Alarm == true'
    };

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
  }

  ifFilteredHasWellSite() {
    if (this.items_filtered === undefined) return false;
    if (this.items_filtered.length === 0) return false;
    return this.items_filtered[0].hasOwnProperty('activeWellsiteName');
  }


  setup() {
    this.getItems().subscribe(
      Items => {
        Items = Items.map(item => {
          // Clear all alarms
          item['Alarm'] = false;
          return item;
        });

        this.items = Items;
        // Now set the data table

        this.items.forEach((item, index, arr) => {
          const obs = this.assetService.getAssetDetail_api(item.id);
          const sub = obs.subscribe(data => {

            // set wellsite name
            arr[index]['activeWellsiteName'] = data.activeWellsiteName;

            // get level point
            const level = data.points.filter(point => point.pointName === 'level')[0];

            arr[index]['pointName'] = `${level.deviceName}.level`;
            arr[index]['Level'] = level.currVal;

            this.updateFilter(false); // in case there is an active filter
            this.cdr.markForCheck();
          });
        });

        this.progressBar.mode = 'determinate';
      }
    );
  }

  RefreshAlarms(arrAlarms: any[]) {

    this.items.forEach((item, index, arr) => {
      arr[index]['Alarm'] = false;
    });


    // set alarms for alarming points
    if (this.items && this.items.length) {
      this.items.forEach((Point, index, arr) => {

        arrAlarms.forEach(Alarm => {
          const arrName = Alarm.pointName.split('.');

          if (Point.name === arrName[1]) {

            if (Point.pointName !== undefined && Point.pointName === arrName[2] + '.' + arrName[3]) {
              // we have a real alarm
              arr[index]['Alarm'] = Alarm.alarmLevel;
              // arr[index]['AlarmSetPoint'] = Alarm.setpoint;
              this.updateFilter(false); // in case there is an active filter
              this.cdr.markForCheck();
            }
          }
        });
      });
    }
  }

  isAlarming(row) {
    if (row.Alarm) {
      if (row.Alarm === 3) return { 'alarming_3': true };
      if (row.Alarm === 2) return { 'alarming_2': true };
      if (row.Alarm === 1) return { 'alarming_1': true };
    } else {
      return { 'NotAlarming': true };
    }
  }

  getToolTip(row) {
    let str: String = 'Last Update: ' + formatDate(row.LastUpdate, 'M/dd/yy H:mm Z', 'en');
    if (row.Alarm) {
      str = str + '<br />Alarm Set at: ' + row.AlarmSetPoint
    }
    return str;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.progressBar.mode = 'indeterminate';
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

  public getItems() {
    let obs = this.assetService.getItems_api();
    this.getItemSub = obs.subscribe(data => {
      // this.items = data;
      // this.progressBar.mode = 'determinate';
      // this.cdr.markForCheck();
    })
    return obs;
  }

  public getWellSites() {
    let obs = this.assetService.getWellSites_api();
    this.getWellsSub = obs.subscribe(data => {
      this.WellSiteList = Array();
      let obj: any = new Object();
      obj.name = '';
      obj.id = '';
      this.WellSiteList.push(obj);

      let WellSites = data;
      WellSites.map(function (WellSite) {
        if (WellSite.name) {
          let obj: any = new Object();
          obj.name = WellSite.name;
          obj.id = WellSite.id;
          this.WellSiteList.push(obj);
        }
      }, this);

      // Sort Data
      function compare(a, b) {
        if (a.wellName < b.wellName) {
          return -1;
        }
        if (a.wellName > b.wellName) {
          return 1;
        }
        return 0;
      }

      this.WellSiteList.sort(compare);
      this.cdr.markForCheck();

    })
    return obs;
  }


  viewDetails(row) {
    this.router.navigate(['../detail/' + row.id], { relativeTo: this.route }).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    });
  }


}
