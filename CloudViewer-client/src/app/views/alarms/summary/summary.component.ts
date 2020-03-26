import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AlarmsService } from '../alarms.service';
import { MatProgressBar, MatButton } from '@angular/material';
import { Subscription, Observable, merge, forkJoin, zip } from 'rxjs';
import { GlobalService } from '@services/global-service/global-service.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  public myForm: FormGroup;

  public items_filtered: any[];
  public items: any[] = Array();

  private AlarmRows: any[] = Array();
  public arrAssetList: any[] = Array();
  public arrAssetData: any[] = Array();
  public arrAssetPoints: any[] = Array();

  public arrAlarmTypes: any[] = Array();
  public getItemSub: Subscription;

  constructor(
    private alarmsService: AlarmsService,
    private globalService: GlobalService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {

    this.myForm = this.fb.group({
      filterText: [''],
    });

    this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
  }

  RefreshAlarms(arrAlarms: any[]) {

    // Clear the list of active alarms
    this.items = Array();

    // now we need to check and see what data we have for each alarm
    if (arrAlarms.length > 0) {

      arrAlarms.forEach((alarm, i, arr) => {

        // change the format of the alarm number
        arrAlarms[i]['uniqueAlarmId_nice'] = alarm.uniqueAlarmId;

        // see if we have a timestamp, if so convert to JS format
        if (arrAlarms[i]['timestamp'] == null) {
          arrAlarms[i]['timestamp'] = 1550000000 * 1000; // Early 2019
        } else {
          arrAlarms[i]['timestamp'] = new Date(arrAlarms[i]['timestamp']);
        }

      });

      // set items list to be the active alarms
      this.items = arrAlarms;

      this.items.forEach((item, index, arr) => {

        const arrmatchingAsset = this.arrAssetList.filter(Asset => (Asset.id === item.assetId));
        const matchingAsset = arrmatchingAsset[0];

        if (matchingAsset) {
          this.items[index] = { ...this.items[index], ...matchingAsset };
        }

        // no need for this now
        // this.items = this.items.filter(e => e.active === true);
      });
    }

    this.updateFilter(false);
    this.progressBar.mode = 'determinate';
  }

  updateFilter(event?) {
    this.cdr.markForCheck();

    // copy Items list to filered list.....into a new, unreferenced array
    this.items_filtered = this.items.slice();

    // make sure we have data
    if (this.items_filtered.length == 0) return true;

    // no filter text
    let items_filter = this.myForm.controls['filterText'].value;
    if (items_filter == '') return true;

    items_filter = items_filter.toLowerCase();

    let columns = Object.keys(this.items_filtered[0]);

    // Removes last "$$index" from "column"
    // columns.splice(columns.length - 1);

    // if nothing, return    
    if (!columns.length) return;

    this.items_filtered = this.items_filtered.filter(function (row) {
      for (let i = 0; i <= columns.length; i++) {
        if (row[columns[i]] && row[columns[i]].toString().toLowerCase().indexOf(items_filter) > -1) {
          return true;
        }
      }
      // return false;
    });

  }

  ngOnInit() {
    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.alarmsService.getAssetsList_api();
    sub = obs.subscribe(data => {

      // save asset to asset list
      this.arrAssetList = data;

      // data.forEach(element => {
      //   arrObs.push(this.getAlarmsForAsset(element.id, arrAlarms));
      // });

      // let obsFJ: Observable<any>;
      // obsFJ = forkJoin(arrObs)

      // obsFJ.subscribe(val => {
      //   this.progressBar.mode = 'determinate';
      //   this.cdr.markForCheck();
      // });

      // run once to get us started
      this.RefreshAlarms(this.globalService.arrAlarms);
    });
  }



}
