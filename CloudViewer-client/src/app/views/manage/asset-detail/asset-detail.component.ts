import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { AssetsService } from '../assets/assets.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable, merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { GoogleMapsAPIWrapper } from '@agm/core'
import { GlobalService } from '@services/global-service/global-service.service';

// export interface Element {
//   Name: string;
//   Value: string;
// }
// const ELEMENT_DATA: Element[] = [
//   {Name: 'H', Value:"eight"},
// ];

export enum decodeState {
  'Standby' = 1,
  'Picking up chemical' = 2,
  'Going to wellsite' = 3,
  'At well site' = 4,
}

declare var google: any;
declare function showNotification(message: String): any;

// const myLocalModule = require('./asset-detail.js');

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss'],
  animations: egretAnimations,
  providers: [GoogleMapsAPIWrapper],
  encapsulation: ViewEncapsulation.None,
})
export class AssetDetailComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild('chart', { static: false }) chart: Highcharts.Chart;

  public sub: Subscription[] = new Array();
  private id: Number;
  public AssetName: string = '';
  public objTableData: Object = new Object();
  public objTablePoints: Object = new Object();
  public TableData: any;
  public TablePoints: any;

  // Graph types
  seriesTypes: { [key: string]: string } = {
    line: 'column',
    column: 'scatter',
    scatter: 'spline',
    spline: 'line'
  };

  // Google Maps
  public GoogleMap: any;
  public latlngbounds: any; //google.maps.LatLngBounds;
  public Markers: any[] = Array();
  // Google Maps items
  zoom = 4;
  mapCenter = {
    lat: 38.27312,
    lng: -98.582187
  }

  displayedColumns_TableData: string[] = ['Property Name', 'Property Value'];
  displayedColumns_TablePoint: string[] = ['Point Name', 'Point Value'];
  // dataSource = ELEMENT_DATA;

  // Google Maps items
  public latitude: number;
  public longitude: number;
  public AssetType: string;
  public AssetState: Number;

  // HighCharts
  Highcharts: typeof Highcharts = Highcharts;
  optFromInput: Highcharts.Options = {
    title: { 'text': '' },
    series: [{
      data: [],
      type: 'line'
    }]
  };

  objFromInput: Object;

  updateFromInput: boolean = false;

  // Demonstrate chart instance
  logChartInstance(chart: Highcharts.Chart) {
    chart.reflow();
    console.log('Chart instance: ', chart);
  }

  toggleSeriesType(index: number = 0) {

    this.optFromInput = this.objFromInput;
    this.optFromInput.series[index].type =
      this.seriesTypes[this.optFromInput.series[index].type || 'line'] as
      "column" | "scatter" | "spline" | "line";
    // nested change - must trigger update
    this.updateFromInput = true;
  }

  constructor(
    private _Activatedroute: ActivatedRoute,
    private assetService: AssetsService,
    private cdr: ChangeDetectorRef,
    private mapsWrapper: GoogleMapsAPIWrapper,
    private globalService: GlobalService,
  ) {
    this.mapsWrapper = mapsWrapper;
    this.id = parseInt(this._Activatedroute.snapshot.paramMap.get("id"));
    this.AssetName = "Asset # " + this.id;
    // this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
    this.globalService.obs.subscribe(data => {
      this.RefreshAlarms(data.Alarms);
      this.PaintMarkersAssetLocations(data.Assets);
    });
  }

  PaintMarkersAssetLocations(any: any) {
    // not using this yet.
  }

  RefreshAlarms(arrAlarms: any[]) {
    if (this.TablePoints) {

      // Clear all alarms
      this.TablePoints.forEach((Point, index, arr) => {
        arr[index]['Alarm'] = false;
      });

      // set alarms for alarming points
      this.TablePoints.forEach((Point, index, arr) => {
        arrAlarms.forEach(Alarm => {
          const arrName = Alarm.pointName.split('.');
          if (this.AssetName == arrName[1]) {
            if (Point.Name == arrName[2] + '.' + arrName[3]) {
              // we have a real alarm
              if (arr[index]['Alarm']) {
                arr[index]['Alarm'] = Math.max(arr[index]['Alarm'], Alarm.alarmLevel);
              } else {
                arr[index]['Alarm'] = Alarm.alarmLevel;
              }

              arr[index]['AlarmSetPoint'] = Alarm.setpoint;
            }
          }
        });
      });
    }





    // google maps marker

    if (this.Markers.length) {
      this.Markers.forEach((Marker, index, arr) => {
        let isAlarming = 0;
        arrAlarms.forEach((Alarm, indexAlarm, arrAlarm) => {
          const arrName = Alarm.pointName.split('.');
          if (arrName[0] + '.' + arrName[1] == Marker.fullName) {
            // low level only
            if (Alarm.alarmType === 'low') {
              isAlarming = Math.max(isAlarming, Alarm.alarmLevel);
            }
          }
        });

        if (isAlarming > 0) {
          if (Marker.strType === 'OTR') {
            // check for alarm Priority
            if (isAlarming === 3) {
              arr[index].setIcon('/assets/images/icons/Truck1_Red.png' + '?' + arr[index]['id']);
            } else if (isAlarming === 2) {
              arr[index].setIcon('/assets/images/icons/Truck1_Orange.png' + '?' + arr[index]['id']);
            } else if (isAlarming === 1) {
              arr[index].setIcon('/assets/images/icons/Truck1_Yellow.png' + '?' + arr[index]['id']);
            }
          } else {
            arr[index].setIcon('/assets/images/icons/facility_alarm.gif' + '?' + arr[index]['id']);
          }
          arr[index].setZIndex(arr[index]['zIndex_default'] + 10);

        } else {
          arr[index].setIcon(arr[index]['iconDefault'] + '?' + arr[index]['id']);
          arr[index].setZIndex(arr[index]['zIndex_default']);

          if (Marker.strType === 'OTR') {
            if (arr[index].state === 1) { // In Stand By
            } else if (arr[index].state === 2) { // Picking up chemical
            } else if (arr[index].state === 3) { // Going To Well Site
            } else if (arr[index].state === 4) { // At Well Site
            }
          } else {
          }

        }
      });
    }
  }

  isAlarming(row) {
    if (row.Alarm) {
      debugger;
      if (row.Alarm === 3) return { 'alarming_3': true };
      if (row.Alarm === 2) return { 'alarming_2': true };
      if (row.Alarm === 1) return { 'alarming_1': true };
    }
    return false;
  }

  getToolTip(row) {
    let str: String = 'Last Update: ' + formatDate(row.LastUpdate, 'M/dd/yy H:mm Z', 'en');
    if (row.Alarm) {
      str = str + '<br />Alarm Set at: ' + row.AlarmSetPoint
    }
    return str;
  }

  getDatesInRange(startDate: Date, endDate: Date) {
    var dates: Date[] = Array();
    var currentDate: Date = startDate;
    var addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= endDate) {
      // dates.push(this.formatDate_ToDate(currentDate));
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };

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



  /**
   * This event is fired when the google map is fully initialized.
   * You get the google.maps.Map instance as a result of this EventEmitter.
   @Output() mapReady: EventEmitter<any> = new EventEmitter<any>();
  */

  //  private agm_map: google.maps.Map;
  onMapReady(event: any) {
    this.GoogleMap = event;
    this.latlngbounds = new google.maps.LatLngBounds();
  }

  AddMarkerToMap(arrData) {

    let objData: object = new Object();
    arrData.forEach(element => {
      objData[element.Name] = element.Value;
    });

    const MarkerPosition: object = { lat: this.latitude, lng: this.longitude };
    let strInfoWindow: string = '';
    let IconSrc: string = '';
    let strOtrDetail: string = '';
    let strType: string = '';
    let zIndex: Number = 0;


    // States
    // 1-Standby
    // 2-Picking up chemicals
    // 3-Going to well site
    // 4-At well site

    if (this.AssetType === 'facility') {
      IconSrc = '/assets/images/icons/facility.png';
      strType = 'Facility';
      zIndex = 0;
    } else if (this.AssetType === 'otr') {
      strOtrDetail = '<p><a href="/manage/detail/' + objData['id'] + '">View Asset Detail</a></p>';
      strType = 'OTR';
      strInfoWindow += '<b>Status:</b> ' + objData['state'] + '<br />';
      zIndex = 100;

      if (this.AssetState === 1) { // In Stand By
        IconSrc = '/assets/images/icons/Truck1_Stripes.png';
      } else if (this.AssetState === 2 || this.AssetState === 3) { // Picking up chemical || // Going To Well Site
        IconSrc = '/assets/images/icons/Truck1_Blue.png';
      } else if (this.AssetState === 4) { // At Well Site
        IconSrc = '/assets/images/icons/Truck1_Green.png';
      }
    }
    const strFullName = this.AssetType + '.' + objData['name'];

    // // Build InfoWindow
    // for (let key in objData) {
    //   if (objData.hasOwnProperty(key)) {
    //     if (key == 'points') {
    //       objData[key].forEach((dataObject) => {
    //         // this.objTablePoints[dataObject.deviceName + '.' + dataObject.pointName] = dataObject.currVal;
    //         if (dataObject.pointName == 'percent') {
    //           strInfoWindow += '<b>' + dataObject.deviceName + '.Percent:</b> ' + dataObject.currVal + '%<br />';
    //         }
    //         if (dataObject.pointName == 'level') {
    //           strInfoWindow += '<b>' + dataObject.deviceName + '.Level:</b> ' + dataObject.currVal + ' gal<br />';
    //         }
    //       })
    //     } else {
    //       // if (key == 'name') strInfoWindow += '<b>Name:</b> '+ objData[key]+ '<br />';
    //     }
    //   }
    // }

    // var contentString = '<div id="content">' +
    //   '<div id="siteNotice">' +
    //   '</div>' +
    //   '<h1 id="firstHeading" class="firstHeading">' + objData['name'].toUpperCase() + ' ' + strType + '</h1>' +
    //   '<div id="bodyContent">' +
    //   '<p>' + strInfoWindow + '</p>' +
    //   strOtrDetail +
    //   '</div>' +
    //   '</div>';

    // var mapsInfoWindow = new google.maps.InfoWindow({
    //   content: contentString
    // });

    const IconWithID = IconSrc + '?' + objData['id'];

    const marker = new google.maps.Marker({
      id: objData['id'], position: MarkerPosition, map: this.GoogleMap,
      icon: IconWithID, iconDefault: IconSrc, strType: strType,
      state: objData['state'], fullName: strFullName,
      zIndex: zIndex, zIndex_default: zIndex
    });

    // // add info window to marker
    // marker.addListener('click', function () {
    //   mapsInfoWindow.open(this.GoogleMap, marker);
    // });

    this.Markers.push(marker);

    // extend bound for this marker
    this.latlngbounds.extend(marker.position);

    // recenter for this marker
    this.GoogleMap.setCenter(this.latlngbounds.getCenter());
    this.GoogleMap.fitBounds(this.latlngbounds);

    this.cdr.markForCheck();
  }

  ngOnInit() {
    // this.mapsWrapper;
    // window.addEventListener('load', (event: any) => { this.ready(); });

    let obs: Observable<any>;
    let sub: Subscription;

    let TableData = new Array();
    let TablePoints = new Array();
    obs = this.assetService.getAssetDetail_api(this.id);
    sub = obs.subscribe(data => {
      // Now set the data table

      // data.map( (Name, Value) =>{
      //   let obj;
      //   obj.Name = Name;
      //   obj.Value = Value;
      //   arrData.push(obj);
      // });

      this.objTableData = data;
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          if (key == 'points') {
            data[key].forEach((dataObject) => {
              this.objTablePoints[dataObject.deviceName + '.' + dataObject.pointName] = dataObject.currVal;
              if (dataObject.pointName == 'latitude' && dataObject.hasOwnProperty('currVal')) {
                dataObject.currVal = dataObject.currVal.toFixed(4);
              }
              if (dataObject.pointName == 'longitude' && dataObject.hasOwnProperty('currVal')) {
                dataObject.currVal = dataObject.currVal.toFixed(4);
              }
              if (dataObject.pointName == 'spVolts' && dataObject.hasOwnProperty('currVal')) {
                dataObject.currVal = dataObject.currVal.toFixed(2);
              }
              if (dataObject.pointName == 'bVolts' && dataObject.hasOwnProperty('currVal')) {
                dataObject.currVal = dataObject.currVal.toFixed(2);
              }
              let obj = {
                Name: dataObject.deviceName + '.' + dataObject.pointName,
                Value: dataObject.currVal,
                Alarm: '',
                LastUpdate: dataObject.lastUpdate
              };
              TablePoints.push(obj);
            })
          } else {
            if (key == 'name') this.AssetName = data[key];

            if (key == 'latitude') {
              this.latitude = data[key];
              // data[key] = data[key].toFixed(4);
              // latitude = dataObject.currVal;
            }
            if (key == 'longitude') {
              this.longitude = data[key];
              // data[key] = data[key].toFixed(4);
              // longitude = data[key];
            }
            if (key == 'assetType') {
              this.AssetType = data[key];
            }

            if (key == 'state') {

              // Save state first
              this.AssetState = data[key];

              // Decode State
              data[key] = decodeState[data[key]];

            }

            if (key !== 'state_number' && key !== 'activeWellsite' && key !== 'assetType' && key !== 'latitude' && key !== 'longitude') {
              let obj = {
                Name: key,
                Value: data[key],
              };

              TableData.push(obj);
            }

          }
        }
        this.zoom = 10;
      }


      // alert("JS Alert from Angular");
      this.TablePoints = TablePoints;
      this.TableData = TableData;

      // Add Marker
      this.AddMarkerToMap(this.TableData);

      this.cdr.markForCheck();

      // refresh Alarms on load
      this.RefreshAlarms(this.globalService.arrAlarms);
    })

    // add to clean up list
    this.sub.push(sub);

    //
    //
    //
    // Get Device and point Info
    let deviceId: any;
    let pointId: any;
    let LevelRan: boolean = false;

    obs = this.assetService.getAssetPoints_api(this.id);
    sub = obs.subscribe(data => {
      data.forEach((objReturned: Object) => {
        if (objReturned['assetId'] = this.id) {
          // this is the correct asset
          objReturned['devicePoints'].forEach((devicePoints) => {
            if (devicePoints['pointName'] == 'level' && !LevelRan) {
              LevelRan = true;
              // we have our keys.
              deviceId = devicePoints['deviceId'];
              pointId = devicePoints['pointId']

              //
              //
              //
              // Get level history
              let endDate: Date = new Date();
              let startDate: Date = new Date();
              // go back a month
              startDate.setMonth(startDate.getMonth() - 1);
              // Get Ticks list
              let DateTicks: Date[] = this.getDatesInRange(startDate, endDate);
              let arrPoints: any[] = Array();
              let arrTimes: String[] = Array();

              let obs2 = this.assetService.getAssetPointDetail_api(this.id, deviceId, pointId, startDate, endDate);
              let sub2 = obs2.subscribe(data2 => {

                data2.forEach((objReturned: Object) => {
                  // this is a datapoint for the graph


                  const AnyDate: Date = new Date();
                  //let date: string = formatDate(objReturned['time'] * 1000, 'M/dd/yy H:mm Z', 'en');
                  const date_withTimeZoneAdjustment: Number = (objReturned['time'] * 1000) - (AnyDate.getTimezoneOffset() * 60 * 1000)

                  const arr = new Array(date_withTimeZoneAdjustment, objReturned['val']);
                  arrPoints.push(arr);
                  // arrTimes.push(date.toString());
                })

                this.objFromInput = new Object();
                this.objFromInput['title'] = { "text": "Tank Level" };
                // this.objFromInput['subtitle'] = { "text": "(in gallons)" };
                this.objFromInput['yAxis'] = {
                  title: {
                    text: 'Gallons'
                  }
                };

                this.objFromInput['series'] = [
                  {
                    "name": "Tank Level",
                    "data": arrPoints,
                  }
                ];

                this.objFromInput['xAxis'] = {
                  // "categories": arrTimes,
                  "type": 'datetime',
                  "labels": {
                    format: '{value:%e %b}',
                  },
                  //tickPositions: DateTicks
                  minTickInterval: 86400000, // one day
                };

                this.objFromInput['chart'] = {
                  "zoomType": "xy"
                };

                this.optFromInput = this.objFromInput;
                this.updateFromInput = true;
                this.progressBar.mode = 'determinate';
                document.getElementById("Chart").style.display = 'block';
                this.cdr.markForCheck();

                // let div = document.getElementsByClassName("gm-style")[0];
                // let imgs = div.getElementsByTagName("IMG");
                // for (var element of imgs) {
                //   if(element.height == 64 && element.width == 64){
                //     element.className = 'RotateMe';
                //   }
                // };
              });

              // add to clean up list
              this.sub.push(sub2);

              //
              //
              //
              // End getAssetPointDetail_api

            }

          });
        }

      })
    });

    // add to clean up list
    this.sub.push(sub);

  }

  ngAfterContentChecked() {
    // this.chart.reflow();
    window.dispatchEvent(new Event('resize'));
  }

  ngAfterContentInit() {
  }

  ngAfterViewChecked() {

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


}
