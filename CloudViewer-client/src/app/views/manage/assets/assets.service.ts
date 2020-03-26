import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

@Injectable()
export class AssetsService {
    items: any[];
    baseURL: string;

    constructor(
        private http: HttpClient,
        public domainService: DomainServiceService
    ) {
        this.baseURL = domainService.getBaseURL();
    }

    getItems_api(): Observable<any> {
        return this.http.get(this.baseURL + 'manage/assets');
    }

    getWellSites_api(): Observable<any> {
        return this.http.get(this.baseURL + 'manage/wellsitelist');
    }

    getAssetDetail_api(id: Number): Observable<any> {
        return this.http.get(this.baseURL + 'manage/assetdetail/' + id);
    }

    getAssetPoints_api(id: Number): Observable<any> {
        return this.http.get(this.baseURL + 'analytics/getpointssimple');
    }

    getAssetPointDetail_api(AssetID, DeviceID, PointID, StartDate: Date, EndDate: Date): Observable<any> {

        let obj: Object = new Object();
        obj['assetId'] = parseInt(AssetID);
        obj['deviceId'] = parseInt(DeviceID);
        obj['pointId'] = parseInt(PointID);
        obj['start'] = StartDate.toISOString().slice(0, 19).replace('T', ' ');
        obj['end'] = EndDate.toISOString().slice(0, 19).replace('T', ' ');

        return this.http.put(this.baseURL + 'analytics/gethistforpoint', obj);
    }

    updateItem_api(dialogRef, data, item): Observable<any> {
        let body = {
            "name": dialogRef.componentInstance.AssetName.value,
            "status": dialogRef.componentInstance.Status.value,
            "state": dialogRef.componentInstance.State.value,
            "activeWellsiteID": dialogRef.componentInstance.WellSites.value,
            "chemical": dialogRef.componentInstance.Chemical.value,
        };
        return this.http.put(this.baseURL + 'manage/assetdetail/' + data.id, body);
    }

    updateItem(id, item) {
        this.items = this.items.map(i => {
            
            if (i.id === id) {
                return Object.assign({}, i, item);
            }
            return i;
        })
        // return of(this.items.slice()).pipe(delay(1000));
        return this.items;
    }

}
