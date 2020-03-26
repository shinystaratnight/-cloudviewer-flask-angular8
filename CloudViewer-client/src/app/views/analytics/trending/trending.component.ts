import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { GoogleMapsAPIWrapper } from '@agm/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GlobalService } from '@services/global-service/global-service.service';
import { AnalyticsService } from '../analytics.service';
import { Moment } from 'moment';


@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class TrendingComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild('chart', { static: false }) chart: Highcharts.Chart;
  @ViewChild('ShowFullScreenGraph_el', { static: false }) ShowFullScreenGraph_el: any;
  @ViewChild('HideFullScreenGraph_el', { static: false }) HideFullScreenGraph_el: any;

  public sub: Subscription[] = new Array();
  private id: Number;
  public AssetName: string = '';
  public objTableData: Object = new Object();
  public objTablePoints: Object = new Object();
  public TableData: any;
  public TablePoints: any;
  public PointsList: any[] = Array();
  public PointsList_Filtered: any[];

  public endDate: Date = new Date();
  public startDate: Date = new Date();

  // Graph types
  seriesTypes: { [key: string]: string } = {
    line: 'column',
    column: 'scatter',
    scatter: 'spline',
    spline: 'line'
  };

  // HighCharts
  chartsInstance: Highcharts.Chart;
  chart_series: object[] = Array();
  Highcharts: typeof Highcharts = Highcharts;
  optFromInput: Highcharts.Options = {
    title: { 'text': '' },
    series: [{
      data: [],
      type: 'line'
    }]
  };

  GraphData: Object;

  updateFromInput: boolean = false;
  dateForm: FormGroup;

  FilterForm: FormGroup;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
    private fb: FormBuilder,
  ) {

    this.FilterForm = this.fb.group({
      filterText: [''],
    });

    // Dates
    const dt = new Date();
    this.startDate.setDate(dt.getDate() - 30);
    this.endDate.setDate(dt.getDate());

    this.dateForm = new FormGroup({
      startDate: new FormControl(this.startDate),
      endDate: new FormControl(this.endDate),
    });

    // let obs_startDate: Observable<Date> = new BehaviorSubject<Date>(this.startDate);
    // obs_startDate.subscribe(data => this.GraphDateChanged);
    // let obs_endDate: Observable<Date> = new BehaviorSubject<Date>(this.endDate);
    // obs_endDate.subscribe(data => this.GraphDateChanged);

    //
    //
    //
    this.get_Assets();
    // this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
    // this.globalService.obs.subscribe(data => {
    //   this.RefreshAlarms(data.Alarms);
    //   this.PaintMarkersAssetLocations(data.Assets);
    // });

    // Graph Setup
    this.GraphData = new Object();
    this.GraphData['title'] = { 'text': '' };

    this.GraphData['chart'] = {
      'zoomType': 'xy'
    };

    this.GraphData['xAxis'] = {
      'type': 'datetime',
      'labels': {
        format: '{value:%e %b}',
      },
      minTickInterval: 86400000, // one day
    };
    this.GraphData['tooltip'] = {
      crosshairs: true,
      shared: true
    };

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });

    // this.GraphData['yAxis'] = {
    //   title: {
    //     text: 'Level'
    //   }
    // };

    this.GraphData['series'] = Array();

  }

  GraphDateChanged() {

    
    this.chart_series.forEach(series => {
      const strID = `${series['id']}-${series['name']}`;
      this.removePointToGraph(strID);
      this.addPointToGraph(strID);
    });
  }

  // get Assets list
  get_Assets() {
    this.analyticsService.getAssets_api().subscribe(Assets => this.load_Assets(Assets));
  }

  // process Asset List
  load_Assets(Assetdata: Object[]) {
    
    this.analyticsService.getAssetPoints_api()
      .subscribe(AssetPoints => this.load_AssetPoints(AssetPoints));
  }

  load_AssetPoints(Assets: any) {
    
    this.PointsList = Array();
    if (Assets !== null) {
      Assets.forEach(Asset => {
        const AssetName = Asset['assetName'];
        Asset['devicePoints'].forEach(AssetPoint => {
          AssetPoint['AssetName'] = AssetName;
          AssetPoint['DisplayName'] = `${AssetName}.${AssetPoint['deviceName']}.${AssetPoint['pointName']}`;
          AssetPoint['ids'] = `${Asset['assetId']}.${AssetPoint['deviceId']}.${AssetPoint['pointId']}-${AssetPoint['DisplayName']}`;
          AssetPoint['Checked'] = false;
          this.PointsList.push(AssetPoint);
        });
      });
    }

    // filtering the list
    this.TextFilter();

    // mark this page ready
    this.progressBar.mode = 'determinate';
    this.cdr.markForCheck();
  }

  TextFilter() {
    
    const arrChecked = this.PointsList.filter(item => {
      return (item.Checked === true)
    })

    this.PointsList_Filtered = this.PointsList.filter(item => {
      return (item.Checked === false)
    })

    // copy Items list to filered list.....into a new, unreferenced array
    // this.items_filtered = this.items.slice();


    // no filter text
    let items_filter = this.FilterForm.controls['filterText'].value;
    if (items_filter !== '') {
      items_filter = items_filter.toLowerCase();

      // filter for text
      this.PointsList_Filtered = this.PointsList_Filtered.filter(item => {
        return (item.DisplayName.toLowerCase().indexOf(items_filter) > -1)
      })
    }

    // add back checked entries
    this.PointsList_Filtered = this.PointsList_Filtered.concat(arrChecked);

  }

  onFilterChange(event) {

    const id: any = event.currentTarget.id;
    const checked: any = event.currentTarget.checked;

    // check the PointsList_Filtered
    const thisPoint = this.PointsList.filter(item => {
      return (item.ids === id)
    })
    thisPoint[0]['Checked'] = checked;

    this.TextFilter();

    // and and remove the point
    if (checked) {
      this.addPointToGraph(id);
    } else {
      this.removePointToGraph(id);
    }

    event.currentTarget.checked = !event.currentTarget.checked;
  }

  addPointToGraph(id) {

    const arrParts = id.split('-');
    const strID = arrParts.shift();
    const arrId = strID.split('.');
    const PointName = arrParts.join('-');

    const AssetId = arrId[0];
    const deviceId = arrId[1];
    const pointId = arrId[2];

    // Get Ticks list
    const DateTicks: Date[] = this.getDatesInRange(this.startDate, this.endDate);
    let arrPoints: any[] = Array();
    let arrTimes: String[] = Array();

    let startDate: Date | Moment = this.dateForm.controls['startDate'].value;
    if ('toDate' in startDate) {
      startDate = startDate.toDate();
    }

    let endDate: Date | Moment = this.dateForm.controls['endDate'].value;
    if ('toDate' in endDate) {
      endDate = endDate.toDate();
    }

    let obs2 = this.analyticsService.getAssetPointDetail_api(AssetId, deviceId, pointId, startDate, endDate);
    let sub2 = obs2.subscribe(data2 => {
      data2.forEach((objReturned: Object) => {
        // this is a datapoint for the graph

        const AnyDate: Date = new Date();
        const date_withTimeZoneAdjustment: Number = (objReturned['time'] * 1000) - (AnyDate.getTimezoneOffset() * 60 * 1000)

        const arr = new Array(date_withTimeZoneAdjustment, objReturned['val']);
        arrPoints.push(arr);
      });

      // Add Axis first
      const opposite: boolean = (this.chartsInstance.yAxis.length % 2 === 0)
      this.chartsInstance.addAxis({
        title: {
          text: PointName,
        },
        opposite: opposite,
      });

      const yAxis_Index = this.chartsInstance.yAxis.length - 1;
      let objNewLine: any = Object();
      objNewLine['id'] = strID;
      objNewLine['name'] = PointName;
      objNewLine['data'] = arrPoints;
      objNewLine['yAxis'] = yAxis_Index;

      // save series data for removal later
      this.chart_series.push(objNewLine);

      // add to actual graph
      this.chartsInstance.addSeries(objNewLine);

      // grab from graph
      // const chartsInstance_series = this.chartsInstance.series.filter(series => { return series['name'] === PointName });

      // Set yAxis label color to match series color
      // this.chartsInstance.yAxis[yAxis_Index].userOptions.labels.style.color = chartsInstance_series[0]['color'];
      // this.chartsInstance.yAxis[yAxis_Index].userOptions['labels']['style']['color'] = this.chartsInstance.yAxis[yAxis_Index].options['lineColor'];

      // mark for update
      this.updateFromInput = true;
      this.chartsInstance.reflow();
      this.cdr.markForCheck();

    });
  }

  removePointToGraph(id) {
    const arrParts = id.split('-');
    const strID = arrParts.shift();
    const arrId = strID.split('.');
    const PointName = arrParts.join('-');

    const AssetId = arrId[0];
    const deviceId = arrId[1];
    const pointId = arrId[2];

    //const seriesToRemove = this.chart_series.filter(series => { return series['id'] === strID });
    const axisToRemove = this.chartsInstance.yAxis.filter(axis => { return (axis['axisTitle']['textStr'] === PointName) });
    axisToRemove[0].remove(true);

    // Remove Axis
    // const yAxisToRemove = seriesToRemove[0]['yAxis'];
    // this.chartsInstance.yAxis[yAxisToRemove].remove(true);

    // remove this from the series
    this.chart_series = this.chart_series.filter(series => { return series['id'] !== strID });

    // Series -- not needed once axis is removed
    // const chartsInstance_seriesToRemove = this.chartsInstance.series.filter(series => { return series['name'] === PointName });
    // chartsInstance_seriesToRemove[0].remove(true);
  }

  // Demonstrate chart instance
  logChartInstance(chart: Highcharts.Chart) {
    this.chartsInstance = chart;
    // console.log('Chart instance: ', chart);
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
    let monthNames: string[] = [
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

  ShowFullScreenGraph() {
    this.chart['el']['nativeElement'].classList.toggle('RegularChart');
    this.chart['el']['nativeElement'].classList.toggle('modal');
    this.ShowFullScreenGraph_el['_elementRef']['nativeElement'].classList.toggle('hidden');
    this.HideFullScreenGraph_el['_elementRef']['nativeElement'].classList.toggle('hidden');
    this.chartsInstance.reflow();
  }

  HideFullScreenGraph() {
    this.chart['el']['nativeElement'].classList.toggle('RegularChart');
    this.chart['el']['nativeElement'].classList.toggle('modal');
    this.ShowFullScreenGraph_el['_elementRef']['nativeElement'].classList.toggle('hidden');
    this.HideFullScreenGraph_el['_elementRef']['nativeElement'].classList.toggle('hidden');
    this.chartsInstance.reflow();
  }

  AmIChecked(id) {
    // check the PointsList_Filtered
    const thisPoint = this.PointsList_Filtered.filter(item => {
      return (item.ids === id)
    })
    return thisPoint[0]['Checked'];
  }

  isCheckedCSS(row) {
    if (row.Checked) {
      return { 'RowChecked': true };
    }
  }


  ngOnInit() {
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
