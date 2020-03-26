import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

@Injectable()
export class DashboardService {
    baseURL: string;

    constructor(
        private http: HttpClient,
        public domainService: DomainServiceService
    ){
        this.baseURL = domainService.getBaseURL();
    }
    
    getDashboardItems_api(): Observable<any> {
        return this.http.get(this.baseURL + 'dashboards/main');
    }
}
