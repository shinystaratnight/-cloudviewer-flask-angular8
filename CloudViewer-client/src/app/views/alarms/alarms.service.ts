import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

@Injectable()
export class AlarmsService {
    baseURL: string;

    constructor(
        private http: HttpClient,
        public domainService: DomainServiceService
    ) {
        this.baseURL = domainService.getBaseURL();
    }

    getAssetsList_api(): Observable<any> {
        return this.http.get(this.baseURL + 'manage/assets');
    }

    getAssetsDetailsList_api(assetId: number): Observable<any> {
        return this.http.get(this.baseURL + 'manage/assetdetail/' + assetId);
    }

    getAlarmTypes_api(): Observable<any> {
        return this.http.get(this.baseURL + 'manage/assets/alarms/getalarmtypes');
    }

    getAlarmLevels_api(): Observable<any> {
        return this.http.get(this.baseURL + 'alarms/getalarmlevels');
    }

    getAlarmsListForAsset_api(Asset: Number): Observable<any> {
        let obj: Object = new Object();
        obj['assetId'] = Asset;

        return this.http.put(this.baseURL + 'manage/assets/alarms/getalarmlistforasset', obj);
    }

    removeAlarmAsset_api(assetId: Number, deviceId: Number, pointId: Number, alarmId: Number): Observable<any> {
        let obj: Object = new Object();
        obj['assetId'] = assetId;
        obj['deviceId'] = deviceId;
        obj['pointId'] = pointId;
        obj['alarmId'] = alarmId;

        return this.http.put(this.baseURL + 'manage/assets/alarms/deletealarm', obj);
    }

    addAlarmAsset_api(assetId: Number, deviceId: string, pointId: string, alarmName: string, alarmText: string, alarmSetpoint: Number, alarmType: string, alarmLevel: Number): Observable<any> {
        let obj: Object = new Object();
        obj['assetId'] = assetId;
        obj['deviceId'] = parseInt(deviceId);
        obj['pointId'] = parseInt(pointId);
        obj['alarmName'] = alarmName;
        obj['alarmText'] = alarmText;
        obj['alarmSetpoint'] = alarmSetpoint;
        obj['alarmType'] = alarmType;
        obj['alarmLevel'] = alarmLevel;

        return this.http.post(this.baseURL + 'manage/assets/alarms/addalarm', obj);
    }

    editAlarmAsset_api(assetId: Number, deviceId: string, pointId: string, alarmName: string, alarmText: string, alarmSetpoint: Number, alarmType: string, alarmId: Number, alarmLevel: Number): Observable<any> {
        let obj: Object = new Object();
        obj['assetId'] = assetId;
        obj['deviceId'] = parseInt(deviceId);
        obj['pointId'] = parseInt(pointId);
        obj['alarmName'] = alarmName;
        obj['alarmText'] = alarmText;
        obj['alarmSetpoint'] = alarmSetpoint;
        obj['alarmType'] = alarmType;
        obj['alarmId'] = alarmId;
        obj['alarmLevel'] = alarmLevel;

        return this.http.put(this.baseURL + 'manage/assets/alarms/editalarm', obj);
    }
}
