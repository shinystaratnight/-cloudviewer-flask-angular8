import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';
import * as Highcharts from 'highcharts';
import { subscriptionARN } from 'aws-sdk/clients/sns';

export class FacilityObject {
  Name: string;
  Level: string;
  Percent: string;
  assetId: number;
  deviceId: number;
  pointId: number;
  PercentPoints: number[];
  constructor() { };
}

// @Injectable({
// providedIn: 'root'
// })

@Injectable()
export class ManageService {

  private baseURL: string;
  charts = [];
  defaultOptions: Highcharts.Options = {
    chart: {
      renderTo: null,
      backgroundColor: null,
      borderWidth: 0,
      type: 'area',
      margin: [2, 0, 2, 0],
      width: 120,
      height: 20,
      style: {
        overflow: 'visible'
      },
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      labels: {
        enabled: false
      },
      title: {
        text: null
      },
      startOnTick: false,
      endOnTick: false,
      tickPositions: []
    },
    yAxis: {
      endOnTick: false,
      startOnTick: false,
      labels: {
        enabled: false
      },
      title: {
        text: null
      },
      tickPositions: [0]
    },
    legend: {
      enabled: false
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      headerFormat: '',
      pointFormat: '<b>{point.y}</b>%'
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        marker: {
          radius: 1,
          states: {
            hover: {
              radius: 2
            }
          }
        },
      },
      column: {
        negativeColor: '#910000',
        borderColor: 'silver'
      }
    },
  };

  constructor(
    private http: HttpClient,
    public domainService: DomainServiceService,
  ) {
    this.baseURL = domainService.getBaseURL();
  }

  getAllRequests_api(): Observable<any> {
    return this.http.get(this.baseURL + 'requests');
  }

  getAllUsers_api(): Observable<any> {
    return this.http.get(this.baseURL + 'getlistallusers');
  }

  getAllCompanies_api(): Observable<any> {
    return this.http.get(this.baseURL + 'companies');
  }

  getAllDistricts_api(CustomerID: any): Observable<any> {
    return this.http.get(this.baseURL + 'elims_admin/users/getdistrictsforcust/' + CustomerID);
  }

  postApproveUser_api(UserID: any, CompanyID: any, DistrictID: any, AccessLevel: any): Observable<any> {

    let obj: object = new Object();
    obj['registrationID'] = UserID;
    obj['districtID'] = DistrictID;
    obj['companyID'] = CompanyID;
    obj['accessLevel'] = AccessLevel;
    obj['status'] = 'approve';
    return this.http.post(this.baseURL + 'elimsadmin/approveuser', obj);
  }

  getFacilityAll(): Observable<any> {
    return this.http.get(this.baseURL + 'manage/facilities');
  }

  getFacility(id: any): Observable<any> {
    return this.http.get(this.baseURL + 'manage/facilitydetail/' + id);
  }

  getFacilitySparkLine(facilityObject: FacilityObject): Observable<any[]> {
    let arrObs: Observable<any>[] = Array();

    for (let i = -7; i < 0; i++) {
      const day = 24 * 60 * 60 * 1000;
      const date = new Date();
      date.setDate(date.getDate() + i);
      let put = {
        "assetId": facilityObject.assetId,
        "deviceId": facilityObject.deviceId,
        "pointId": facilityObject.pointId,
        "start": `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`,
        "end": `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:00`,
      }
      arrObs.push(this.http.put(this.baseURL + 'analytics/gethistforpoint', put));
    }

    // forkjoin?
    const sub = forkJoin(arrObs);

    return sub;
  }


  //
  //
  // CHARTS
  createChart(container, data: string) {

    const arrData: string[] = data.split(',');
    const arrIntData: number[] = arrData.map(parseFloat);
    const opts = this.defaultOptions;

    //    const e: HTMLElement = document.createElement('div');
    //    container.appendChild(e);

    opts.chart.renderTo = container;

    const copy = { ...opts };

    copy.series = [{
      type: 'line',
      data: arrIntData,
    }];

    // const merged = { series, ...opts };
    const chart = new Highcharts.Chart(copy);

  }
}














