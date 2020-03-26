import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable, interval } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { GoogleMapsAPIWrapper } from '@agm/core'
import { GlobalService } from '@services/global-service/global-service.service';
import { isDevMode } from '@angular/core';

declare var google: any;

@Component({
  selector: 'dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
  animations: egretAnimations
})
export class DashboardMainComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  // Google Maps items
  zoom = 4;
  mapCenter = {
    lat: 38.27312,
    lng: -98.582187
  }

  public numWellSites: number = 0;
  public numFacilities: number = 0;

  public numOTRInAlarmLow: number = 0;
  public numOTRInAlarmMid: number = 0;
  public numOTRInAlarmHigh: number = 0;

  public numFacilitiesInAlarm: number = 0;
  public numInStandBy: number = 0;
  public numGettingChemicals: number = 0;
  public numGoingToWellSite: number = 0;
  public numAtWellSite: number = 0;
  public Markers: any[] = Array();

  public sub: Subscription[] = new Array();
  public latlngbounds: any; //google.maps.LatLngBounds;
  private MapObject: any; //google.maps.Map;

  private arrRawMarkers: object[] = new Array();

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
  ) {
    this.globalService.obs.subscribe(data => {
      this.PaintMarkersAlarm(data.Alarms);
      this.PaintMarkersAssetLocations(data.Assets);
    });

    // let obsInterval = interval(50);
    // const subscribe = obsInterval.subscribe(val => this.moveMarker_test());

  }

  AddMarkerToMap(objData, MapObject) {

    // make sure we have cords
    if (objData['latitude'] === null || objData['longitude'] === null) return;

    let MarkerPosition: object = { lat: objData['latitude'], lng: objData['longitude'] };
    let strInfoWindow: string = "";
    let IconSrc: string = "";
    let strDetail: string = "";
    let strType: string = "";
    let zIndex: Number = 0;


    // States
    // 1-Standby
    // 2-Picking up chemicals
    // 3-Going to well site
    // 4-At well site

    if (objData.assetType == 'wellsite') {
      this.numWellSites++;
      IconSrc = '/assets/images/icons/OilDerrick.png';
      strType = 'Well Site';
      strDetail = '<p><a href="/manage/wellsiteModify/' + objData['id'] + '">Modify Well Site</a></p>';
      zIndex = 0;
    } else if (objData.assetType === 'facility') {
      this.numFacilities++;
      IconSrc = '/assets/images/icons/facility.png';
      strType = 'Facility';
      zIndex = 0;
    } else if (objData.assetType === 'otr') {
      strDetail = '<p><a href="/manage/detail/' + objData['id'] + '">View Asset Detail</a></p>';
      strType = 'OTR';

      // Status Window
      if (objData.chemical == 'null' || objData.chemical == null) objData.chemical = 'Not Specified';
      if (objData.wellSiteName == 'null' || objData.wellSiteName == null) objData.wellSiteName = 'Not Assigned';
      // strInfoWindow += '<b>Status:</b> ' + objData.state + '<br />';
      strInfoWindow += '<b>Chemical:</b> ' + objData.chemical + '<br />';
      strInfoWindow += '<b>Wellsite:</b> ' + objData.wellSiteName + '<br />';
      zIndex = 100;

      if (objData.state === 1) { // In Stand By
        this.numInStandBy++;
        IconSrc = '/assets/images/icons/Truck1_Stripes.png';
        // } else if (objData.state == 2) { // Picking up chemical
        //   this.numGettingChemicals++;
        //   IconSrc = '/assets/images/icons/Truck1_Orange.png';
      } else if (objData.state === 3) { // Going To Well Site
        this.numGoingToWellSite++;
        IconSrc = '/assets/images/icons/Truck1_Blue.png';
      } else if (objData.state === 4) { // At Well Site
        this.numAtWellSite++;
        IconSrc = '/assets/images/icons/Truck1_Green.png';
      }
    }
    const strFullName = objData.assetType + '.' + objData['name'];

    // Build InfoWindow
    if (strType === 'OTR') {
      for (let key in objData) {
        if (objData.hasOwnProperty(key)) {
          if (key == 'points' && objData[key]) {
            objData[key].forEach((dataObject) => {
              // this.objTablePoints[dataObject.deviceName + '.' + dataObject.pointName] = dataObject.currVal;
              if (dataObject.pointName == 'percent') {
                strInfoWindow += '<b>' + dataObject.deviceName + '.Percent:</b> ' + dataObject.currVal + '%<br />';
              }
              if (dataObject.pointName == 'level') {
                strInfoWindow += '<b>' + dataObject.deviceName + '.Level:</b> ' + dataObject.currVal + ' gal<br />';
              }
            })
          } else {
            // if (key == 'name') strInfoWindow += '<b>Name:</b> '+ objData[key]+ '<br />';
          }
        }
      }
    } else if (strType === 'Well Site') {
      if (objData.state === 10) {
        strInfoWindow += '<b>Pending</b><br />';
      } else if (objData.state === 11) {
        strInfoWindow += '<b>In Progress</b><br />';
      } else if (objData.state === 12) {
        strInfoWindow += '<b>Complete</b><br />';
      }

    }

    const contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">' + objData['name'].toUpperCase() + ' ' + strType + '</h1>' +
      '<div id="bodyContent">' +
      '<p>' + strInfoWindow + '</p>' +
      strDetail +
      '</div>' +
      '</div>';

    let mapsInfoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    const IconWithID = IconSrc + '?' + objData['id'];

    let marker = new google.maps.Marker({ id: objData['id'], position: MarkerPosition, map: MapObject, icon: IconWithID, iconDefault: IconSrc, strType: strType, state: objData.state, fullName: strFullName, zIndex: zIndex, zIndex_default: zIndex });

    // add info window to marker
    marker.addListener('click', function () {
      mapsInfoWindow.open(MapObject, marker);
    });

    this.Markers.push(marker);

    // extend bound for this marker
    this.latlngbounds.extend(marker.position);

  }

  PaintMarkersAlarm(Alarms: any[]) {
    if (this.Markers.length) {

      this.numOTRInAlarmLow =
        this.numOTRInAlarmMid =
        this.numOTRInAlarmHigh =
        this.numFacilitiesInAlarm =
        this.numWellSites =
        this.numFacilities =
        this.numInStandBy =
        this.numGettingChemicals =
        this.numGoingToWellSite =
        this.numAtWellSite = 0;

      this.Markers.forEach((Marker, index, arr) => {
        let isAlarming = 0;

        // sort alarms so low priority (3) are first

        Alarms.sort(
          function (a, b) {
            return b.alarmLevel - a.alarmLevel
          });

        Alarms.forEach((Alarm, indexAlarm, arrAlarm) => {
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
              this.numOTRInAlarmHigh++;
            } else if (isAlarming === 2) {
              arr[index].setIcon('/assets/images/icons/Truck1_Orange.png' + '?' + arr[index]['id']);
              this.numOTRInAlarmMid++;
            } else if (isAlarming === 1) {
              arr[index].setIcon('/assets/images/icons/Truck1_Yellow.png' + '?' + arr[index]['id']);
              this.numOTRInAlarmLow++;
            }

          } else {
            arr[index].setIcon('/assets/images/icons/facility_alarm.gif' + '?' + arr[index]['id']);
            this.numFacilitiesInAlarm++;
          }
          arr[index].setZIndex(arr[index]['zIndex_default'] + 10);

        } else {
          arr[index].setIcon(arr[index]['iconDefault'] + '?' + arr[index]['id']);
          arr[index].setZIndex(arr[index]['zIndex_default']);

          if (Marker.strType === 'OTR') {
            if (arr[index].state === 1) { // In Stand By
              this.numInStandBy++;
            } else if (arr[index].state === 2 || arr[index].state === 3) { // Picking up chemical // Going To Well Site
              this.numGettingChemicals++;
              this.numGoingToWellSite++;
            } else if (arr[index].state === 4) { // At Well Site
              this.numAtWellSite++;
            }
          } else if (Marker.strType === 'Facility') {
            this.numFacilities++;
          } else if (Marker.strType === 'Well Site') {
            this.numWellSites++;
          }

        }
      });
    }

    // make sure we repaint
    this.cdr.markForCheck();
  }

  PaintMarkersAssetLocations(Assets) {
    if (this.Markers.length) {

      this.Markers.filter(Marker => { return Marker.strType == 'OTR' }).forEach((Marker, index, arr) => {
        Assets.forEach((Asset, indexAsset, arrAsset) => {

          if (Asset.id === Marker.id) {
            let lat_new: number = Asset.latitude;
            let lng_new: number = Asset.longitude;

            if (isDevMode()) {
              // Add noise to new points to test map
              lat_new = Asset.latitude + (Math.random() - .5);
              lng_new = Asset.longitude + (Math.random() - .5);
            }

            this.SetNewMarkerPosition(Marker, lat_new, lng_new);
          }
        });
      });

      // make sure we repaint
      this.cdr.markForCheck();
    }
  }

  SetNewMarkerPosition(Marker: any /*google.maps.Marker*/, lat_new: number, lng_new: number) { // curRotation?
    const pos = Marker.getPosition();
    const lat: number = pos.lat();
    const lng: number = pos.lng();

    if (lat != lat_new || lng != lng_new) {

      Marker.setPosition({ lat: lat_new, lng: lng_new });

      const icon = Marker.getIcon();
      const eleImgUnderMap = document.querySelectorAll('agm-map img');

      eleImgUnderMap.forEach(element => {
        if (element['__src__'] == icon) {
          // we have the correct element
          let Rotate = (Math.random() * 360);
          if (Math.abs(lat - lat_new) > .0001 || Math.abs(lng - lng_new) > .0001) {
            // check has moved by .0001
            Rotate = this.getBearing(lat, lng, lat_new, lng_new);
          } else {
            Rotate = 90;
          }
          this.RotateImg(element, Rotate);

          // this.RotateImg(element, curRotation);
        }
      });

      // extend bound for this marker
      this.latlngbounds.extend({ lat: lat_new, lng: lng_new });
      this.MapObject.setCenter(this.latlngbounds.getCenter());
      this.MapObject.fitBounds(this.latlngbounds);

      // adjust zoom back
      // const zoom = this.MapObject.getZoom();
      // this.MapObject.setZoom(zoom - 1);
    }

  }

  /*
   * Use Haversine formula to Calculate distance (in km) between two points specified by
   * latitude/longitude (in numeric degrees)
   *
   * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
   *       Sky and Telescope, vol 68, no 2, 1984
   *       http://www.census.gov/cgi-bin/geo/gisfaq?Q5.1
   *
   * example usage from form:
   *   result.value = LatLon.distHaversine(lat1.value.parseDeg(), long1.value.parseDeg(),
   *                                       lat2.value.parseDeg(), long2.value.parseDeg());
   * where lat1, long1, lat2, long2, and result are form fields
   */

  distHaversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    function toRad(num: number): number { return num * Math.PI / 180; };
    const R: number = 6371; // earth's mean radius in km
    const dLat: number = toRad(lat2 - lat1);
    const dLon: number = toRad(lon2 - lon1);
    lat1 = toRad(lat1), lat2 = toRad(lat2);

    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d: number = R * c;
    return d;
  }

  /*
 * calculate (initial) bearing between two points
 *
 * from: Ed Williams' Aviation Formulary, http://williams.best.vwh.net/avform.htm#Crs
 */
  getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
    function toDeg(num: number) { return num * 180 / Math.PI; } // convert radians to degrees (signed)
    function toRad(num: number): number { return num * Math.PI / 180; };
    function toBrng(num: number) { return (toDeg(num) + 360) % 360; } // convert radians to degrees (as bearing: 0...360)

    lat1 = toRad(lat1); lat2 = toRad(lat2);
    const dLon: number = toRad(lon2 - lon1);

    const y: number = Math.sin(dLon) * Math.cos(lat2);
    const x: number = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return toBrng(Math.atan2(y, x));
  }

  // public curRotation = 0;

  // moveMarker_test() {
  //   this.Markers.filter(Marker => { return Marker.strType == 'OTR' }).forEach((Marker, index, arr) => {

  //     const pos = Marker.getPosition();
  //     // const lat: number = pos.lat() - (Math.random() * 1) + .5;
  //     // const lng: number = pos.lng() - (Math.random() * .5);
  //     const lat: number = pos.lat() + .00001;
  //     const lng: number = pos.lng() + .00001;

  //     this.curRotation += 5;
  //     if (this.curRotation > 360) this.curRotation -= 360;
  //     this.SetNewMarkerPosition(Marker, lat, lng, this.curRotation);
  //     //this.SetNewMarkerPosition(Marker, lat, lng, 320);
  //   });
  // }

  RotateImg(element: any, Rotate: number) {
    let flip: String = 'scaleY(1)';

    Rotate -= 90;
    if (Rotate < 0) Rotate += 360; // make sure we're in bounds

    if (Rotate > 90 && Rotate < 270) {
      flip = 'scaleY(-1)'; // flip top to bottom

      // take care of rotation translation for flipped image
      Rotate = Rotate - (Rotate - 180) * 2;

      if (Rotate > 360) Rotate -= 360; // make sure we're in bounds
      if (Rotate < 0) Rotate += 360; // make sure we're in bounds
    }

    const Rotate_int: any = Rotate.toFixed(0); // dec messing up the rotate

    element.setAttribute('style', 'transform: ' + flip + ' rotate(' + Rotate_int + 'deg);');
  }

  onMapReady(MapObject: any /*google.maps.Map*/) {

    this.latlngbounds = new google.maps.LatLngBounds();

    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.dashboardService.getDashboardItems_api();

    let join = forkJoin(
      obs,
      // this.globalService.obs,
    );

    sub = join.subscribe(data => {

      const Markers = data[0];

      Markers.forEach(element => {
        // Save for later
        this.arrRawMarkers.push(element);
        // add marker to map
        this.AddMarkerToMap(element, MapObject);
      });

      this.progressBar.mode = 'determinate';
      MapObject.setCenter(this.latlngbounds.getCenter());
      MapObject.fitBounds(this.latlngbounds);
      // see if we have any alarms back, otherwise it will wait for the normal callback
      this.PaintMarkersAlarm(this.globalService.arrAlarms);
      this.cdr.markForCheck();
    });

    // save map object
    this.MapObject = MapObject;

    // bounds listener to zoom out map by one
    // let zoomChangeBoundsListener =
    // google.maps.event.addListener(this.MapObject, 'bounds_changed', function(event) {
    //     google.maps.event.removeListener(zoomChangeBoundsListener);
    //     this.MapObject.setZoom( Math.min( 10, this.MapObject.getZoom() )  - 1 );
    // });

    // add to clean up list
    this.sub.push(sub);

  }

  ngOnInit() {

  }

}
