import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

@Injectable()
export class WellsitesService {

    private baseURL: string;

    constructor(
        private http: HttpClient,
        public domainService: DomainServiceService,
    ) {
        this.baseURL = domainService.getBaseURL();
    }

    getAllWellSites_api(): Observable<any> {
        return this.http.get(this.baseURL + 'manage/wellsitelist');
    }
    
    getAllWellSite_States_api(): Observable<any> {
        return this.http.get(this.baseURL + 'job/getwellsitestates');
    }

    getAllWellSite_Districts_api(): Observable<any> {
        return this.http.get(this.baseURL + 'districts/customerdistricts');
    }

    getWellSiteDetails_api(id: any): Observable<any> {
        return this.http.get(this.baseURL + 'job/' + id);
    }

    setWellSiteDetails_api(id: any, updateObj: object): Observable<any> {
        return this.http.put(this.baseURL + 'job/' + id, updateObj);
    }
     
    createWellSiteDetails_api(updateObj: object): Observable<any> {
        return this.http.post(this.baseURL + 'job/1', updateObj);
    }
}
