import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlarmsService } from '../alarms.service';
import { PopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { AssetTablePopupComponent2 } from './asset-table-popup/asset-table-popup.component';
import { GlobalService } from '@services/global-service/global-service.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss'],
  animations: egretAnimations,
  //entryComponents: [PopupComponent],
})
export class AlarmsComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  itemPluralMapping = {
    'Alarm': {
      '=0': 'Unset',
      '=1': 'Low',
      '=2': 'Medium',
      '=3': 'High',
    },
  };

  myForm: FormGroup;
  public items: any[] = Array();
  public items_filtered: any[] = Array();

  public sub: Subscription[] = new Array();

  public arrAssetList: any[] = Array();
  public arrAssetData: any[] = Array();
  public arrAssetPoints: any[] = Array();
  public arrAlarmTypes: any[] = Array();
  public arrAlarmPriorities: object[] = Array();
  public getItemSub: Subscription;

  constructor(
    private alarmsService: AlarmsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private globalService: GlobalService,
    private fb: FormBuilder,
  ) {
    this.myForm = this.fb.group({
      filterText: [''],
    });

    this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
  }

  updateFilter(event?) {

    this.cdr.markForCheck();

    // copy Items list to filered list.....into a new, unreferenced array
    this.items_filtered = this.items.slice();

    this.items_filtered

    // make sure we have data
    if (!this.items_filtered || this.items_filtered.length == 0) return true;

    // no filter text
    let items_filter = this.myForm.controls['filterText'].value;
    if (items_filter == '') return true;

    items_filter = items_filter.toLowerCase();

    // this is a nested table...

    this.items_filtered.forEach((element, index, arr) => {

      let columns = Object.keys(this.items_filtered[index][0]);

      // Removes last "$$index" from "column"
      // columns.splice(columns.length - 1);

      // if nothing, return
      if (!columns.length) return;

      this.items_filtered[index] = this.items_filtered[index].filter(function (row) {
        for (let i = 0; i <= columns.length; i++) {
          if (row[columns[i]] && row[columns[i]].toString().toLowerCase().indexOf(items_filter) > -1) {
            return true;
          }
        }
        // return false;
      });
    });

  }

  ngOnInit() {
    let arrObs: Observable<any>[] = Array();
    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.alarmsService.getAssetsList_api();
    sub = obs.subscribe(data => {

      data.forEach(element => {
        arrObs.push(this.getAlarmsForAsset(element.id));
        this.items[element.id] = Array(); // so we don't have Cannot read prop errors
        this.items_filtered[element.id] = Array(); // so we don't have Cannot read prop errors
        this.arrAssetList.push(element.id);
        this.getDetailsForAsset(element.id)
        this.arrAssetData[element.id] = element;
      });

      let obsFJ: Observable<any>;
      obsFJ = forkJoin(arrObs)

      obsFJ.subscribe(val => {
        this.progressBar.mode = 'determinate';
        this.updateFilter();
        this.cdr.markForCheck();
      });
    });

    // Now get alarm Types
    obs = this.alarmsService.getAlarmTypes_api();
    sub = obs.subscribe(data => {
      data.forEach(obj => {
        this.arrAlarmTypes.push(obj.name);
      });
    });

    // Now get alarm LEVELS (Priority)
    obs = this.alarmsService.getAlarmLevels_api();
    sub = obs.subscribe(data => {
      data.forEach(obj => {
        this.arrAlarmPriorities.push({ Priority: obj.level, Name: obj.name });
      });
    });

  }

  RefreshAlarms(arrAlarms: any[]) {


    //    arrAlarms.forEach(alarm => {
    //      if (this.items[alarm.assetId] === undefined) {
    //        this.items[alarm.assetId] = Array();
    //        this.items_filtered[alarm.assetId] = Array(); // so we don't have Cannot read prop errors
    //      }
    //    });


    if (this.items && this.items.length && arrAlarms.length) {

      this.arrAssetList.forEach((Asset, index, arr) => {
        this.items[Asset].forEach((AssetAlarm, index, arr) => {
          arr[index]['Alarm'] = false; // turn off alarm, if it's on
          arrAlarms.forEach(ActiveAlarm => {
            const arrName = ActiveAlarm.pointName.split('.');
            if (AssetAlarm.uniqueAlarmId === ActiveAlarm.uniqueAlarmId) {
              // we have a real alarm
              arr[index]['Alarm'] = true;
            }
          });
        });
      });

      this.updateFilter();
      this.cdr.markForCheck();
    }
  }


  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getAlarmsForAsset(ID: number) {
    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.alarmsService.getAlarmsListForAsset_api(ID);
    sub = obs.subscribe(data => {
      this.items[ID] = data;
      this.updateFilter();
    })

    return obs;
  }

  getDetailsForAsset(ID: number) {
    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.alarmsService.getAssetsDetailsList_api(ID);
    sub = obs.subscribe(data => {
      this.arrAssetPoints[ID] = Array();
      data.points.forEach(objPoint => {
        let obj: Object = new Object();
        obj['Name'] = objPoint.deviceName + '.' + objPoint.pointName;
        obj['Value'] = objPoint.deviceId + '.' + objPoint.pointId;
        this.arrAssetPoints[ID].push(obj);
      });
    })
    return obs;
  }

  openPopUp(data: any = {}, isNew?, extraAssetData?) {

    if (extraAssetData) {
      data = { ...data, ...extraAssetData };
    }
    // if we're editing, we need to set the value for alarmDeviceAndSensor
    if (!isNew) {
      data['alarmDeviceAndSensor'] = data.deviceId + '.' + data.pointId;
    }
    let arrPoints = this.arrAssetPoints[data.id];
    let title = isNew ? 'Add Alarm' : 'Update Alarm';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, arrAlarmTypes: this.arrAlarmTypes, arrAlarmPriorities: this.arrAlarmPriorities, arrPoints: arrPoints }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();

        if (isNew) {
          let arr = res.alarmDeviceAndSensor.split(".");
          this.alarmsService.addAlarmAsset_api(res.id, arr[0], arr[1], res.alarmName, res.alarmText, res.alarmSetpoint, res.alarmType, res.alarmLevel)
            .subscribe(data => {
              let obs = this.getAlarmsForAsset(res.id);
              obs.subscribe(data => {
                this.loader.close();
                this.snack.open('Alarm added!', 'OK', { duration: 4000 })
                this.cdr.markForCheck();
              });
            })
        } else {
          let arr = res.alarmDeviceAndSensor.split(".");
          this.alarmsService.editAlarmAsset_api(res.id, arr[0], arr[1], res.alarmName, res.alarmText, res.alarmSetpoint, res.alarmType, res.alarmId, res.alarmLevel)
            .subscribe(data => {
              let obs = this.getAlarmsForAsset(res.id);
              obs.subscribe(data => {
                this.loader.close();
                this.snack.open('Alarm updated!', 'OK', { duration: 4000 })
                this.cdr.markForCheck();
              });
            })
        }
      })
  }

  deleteItem(row, extraAssetData) {
    row = { ...row, ...extraAssetData };
    this.confirmService.confirm({ message: `Delete ${row.alarmName} Alarm for ${row.pointName}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.alarmsService.removeAlarmAsset_api(row.assetId, row.deviceId, row.pointId, row.alarmId)
            .subscribe(data => {
              let obs = this.getAlarmsForAsset(row.assetId);
              obs.subscribe(data => {
                this.loader.close();
                this.snack.open('Alarm deleted!', 'OK', { duration: 4000 })
                this.cdr.markForCheck();
              });
            })
        }
      })
  }

}

