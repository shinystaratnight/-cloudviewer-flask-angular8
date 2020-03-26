import { ManageService, FacilityObject } from '../../../manage/manage.service';
import { Component, OnInit, AfterContentInit, AfterContentChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable, merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalService } from '@services/global-service/global-service.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.scss'],
  animations: egretAnimations,
})
export class FacilityDetailComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  public sub: Subscription[] = new Array();
  private id: number;
  public FacilityName = '';
  // public objTableData: Object = new Object();
  public objFacilityObject: FacilityObject[] = new Array();
  public TableData: any;
  public TablePoints: any[];

  displayedColumns_TableData: string[] = ['Property Name', 'Property Value'];
  displayedColumns_TablePoint: string[] = ['Point Name', 'Point Value'];
  // dataSource = ELEMENT_DATA;

  objFromInput: Object;

  updateFromInput: boolean = false;

  // Demonstrate chart instance
  logChartInstance(chart: Highcharts.Chart) {
    chart.reflow();
    console.log('Chart instance: ', chart);
  }

  ngOnInit() {

  }

  constructor(
    private _Activatedroute: ActivatedRoute,
    public manageService: ManageService,
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
  ) {
    this.id = parseInt(this._Activatedroute.snapshot.paramMap.get('id'));
    this.FacilityName = 'Facility ' + this.id;
    this.GetFacilityDetails();
    // this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
    // this.globalService.obs.subscribe(data => {
    //   this.RefreshAlarms(data.Alarms);
    //   this.PaintMarkersAssetLocations(data.Assets);
    // });

  }

  GetFacilityDetails() {

    this.manageService.getFacility(this.id).subscribe(data => {

      this.TablePoints = data.points;
      this.FacilityName = data.name + ' Facility';
      this.RunData(data);
    });


  }

  // PaintMarkersAssetLocations(any: any) {
  //   // not using this yet.
  // }

  // RefreshAlarms(arrAlarms: any[]) {
  //   // debugger;
  //   if (false) {
  //     if (this.TablePoints) {
  //       // debugger;
  //       // Clear all alarms
  //       this.TablePoints.forEach((Point, index, arr) => {
  //         arr[index]['Alarm'] = false;
  //       });

  //       // set alarms for alarming points
  //       this.TablePoints.forEach((Point, index, arr) => {
  //         arrAlarms.forEach(Alarm => {
  //           const arrName = Alarm.pointName.split('.');
  //           if (this.FacilityName == arrName[1]) {
  //             if (Point.Name == arrName[2] + '.' + arrName[3]) {
  //               // we have a real alarm
  //               arr[index]['Alarm'] = true;
  //               arr[index]['AlarmSetPoint'] = Alarm.setpoint;
  //             }
  //           }
  //         });
  //       });
  //     }
  //   }
  // }

  // isAlarming(row) {
  //   if (row.Alarm) {
  //     return { 'alarming': true };
  //   }
  // }

  // getToolTip(row) {
  //   let str: String
  //   if (row.LastUpdate !== undefined && row.LastUpdate !== '') {
  //     str = 'Last Update: ' + formatDate(row.LastUpdate, 'M/dd/yy H:mm Z', 'en');
  //     if (row.Alarm) {
  //       str = str + '<br />Alarm Set at: ' + row.AlarmSetPoint
  //     }
  //   } else {
  //     str = 'Unknown';
  //   }
  //   return str;
  // }

  // getDatesInRange(startDate: Date, endDate: Date) {
  //   var dates: Date[] = Array();
  //   var currentDate: Date = startDate;
  //   var addDays = function (days) {
  //     var date = new Date(this.valueOf());
  //     date.setDate(date.getDate() + days);
  //     return date;
  //   };
  //   while (currentDate <= endDate) {
  //     // dates.push(this.formatDate_ToDate(currentDate));
  //     dates.push(currentDate);
  //     currentDate = addDays.call(currentDate, 1);
  //   }
  //   return dates;
  // };

  formatDate_ToDate(date: Date) {
    var d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  formatDate_MonthIndexToMonth(MonthIndex: string) {
    var monthNames: string[] = [
      'January', 'February', 'March',
      'April', 'May", "June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];
    const intMonthIndex = parseInt(MonthIndex);

    return monthNames[intMonthIndex];
  }
  formatDate_MonthDay(date: Date) {
    var d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate()
      ;

    if (day.length < 2)
      day = '0' + day;

    return [this.formatDate_MonthIndexToMonth(month), day].join(' ');
  }


  RunData(data) {

    let TableData = new Array();
    let TablePoints = new Array();

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == 'points') {
          data[key].forEach((dataObject) => {

            let facilityObject: FacilityObject;
            this.objFacilityObject.forEach((Facility) => {
              if (Facility.Name === dataObject.deviceName) {
                facilityObject = Facility;
              }
            });

            if (facilityObject === undefined) {
              facilityObject = new FacilityObject();
              facilityObject.Name = dataObject.deviceName;
              facilityObject.assetId = this.id;
              facilityObject.deviceId = dataObject.deviceId;
              this.objFacilityObject.push(facilityObject);
            }

            if (dataObject.pointName === 'level') {
              facilityObject.Level = dataObject.currVal.toFixed(2);
            }

            if (dataObject.pointName === 'percent') {
              facilityObject.Percent = dataObject.currVal.toFixed(2);
              facilityObject.pointId = dataObject.pointId;

              // get historical data
              this.manageService.getFacilitySparkLine(facilityObject).subscribe(
                arrdata => {
                  debugger;
                  const arrNumbers = [];
                  arrdata.forEach(data => {
                    let val: number;
                    if (data.length > 0) {
                      val = data[0].val;
                    }
                    if (val === undefined) { val = 0; }
                    arrNumbers.push(val);

                    arrNumbers.push(dataObject.currVal);
                    facilityObject.PercentPoints = arrNumbers;
                  });

                  setTimeout(() => {
                    this.DrawCharts();
                    this.progressBar.mode = 'determinate';
                  }, 500);

                  this.cdr.markForCheck();
                }
              );
            }
          });
        } else {
          // if (key == 'name') this.AssetName = data[key];

        }

      }

    }


    this.objFacilityObject = this.objFacilityObject.filter((Facility) => {
      return (Facility.Percent !== undefined)
    });


  }

  ngAfterContentChecked() {
    // this.chart.reflow();
    window.dispatchEvent(new Event('resize'));
  }

  ngAfterContentInit() {

  }

  ngAfterViewChecked() {
    // debugger;
    // alert("JS Alert from Angular");
    // myLocalModule.showNotification('From Angular');
    // myLocalModule.initMap()
    //
    // this.progressBar.mode = 'determinate';
    // showNotification("Hello from Angular");
  }

  ngOnDestroy() {
    this.sub.forEach((Subscription) => {
      Subscription.unsubscribe;
    });
  }

  DrawCharts() {
    // create charts
    const els: any = document.getElementsByClassName('chartme');
    for (let el of els) {
      const chart = el.getElementsByClassName('chart')[0];
      const data = el.getElementsByClassName('hide')[0];
      this.manageService.createChart(chart, data.innerText);
    }
  }

}
