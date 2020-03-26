import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

// export enum enumAccessLevel {
//     'Crew Member' = 1,
//     'Company Manager' = 2,
//     'ELIMS Field Tech' = 3,
//     'ELIMS Admin' = 4,
// }

@Injectable({
    providedIn: 'root',
})
export class GlobalService {
    private baseURL: string;
    private obsInterval: Observable<any>;
    public arrAlarms: Array<any>;
    public arrAssets: Array<any>;

    // public obs
    public obs: Observable<any>;
    public observers: any[] = Array();


    constructor(
        private http: HttpClient,
        public domainService: DomainServiceService
    ) {
        this.baseURL = domainService.getBaseURL();

        // setup global public obs
        this.obs = new Observable((observer) => {
            // Sub
            this.observers.push(observer);

            // Unsub
            return {
                unsubscribe() {
                    if (this.observers.length) {
                        this.observers = this.observers.filter(ea => ea !== observer)
                    }
                }
            };
        });


        // Set up refresh
        this.obsInterval = interval(1000 * 60);
        const subscribe = this.obsInterval.subscribe(val => this.MainInterval());

        // run once for page refresh
        this.MainInterval();
    }

    MainInterval() {
        const token_encoded = localStorage.getItem('token');
        if (token_encoded !== '') {

            // clear array
            this.arrAlarms = Array();
            this.arrAssets = Array();
            let obs: Observable<any>;
            let sub: Subscription;
            let obj: Object = new Object();
            obs = forkJoin(
                this.http.put(this.baseURL + 'alarms/getactivealarms', obj),
                this.http.get(this.baseURL + 'manage/assets'),
            );

            sub = obs.subscribe(data => {
                

                const getActiveAlarms = data[0];
                if (getActiveAlarms && getActiveAlarms.length) {
                    getActiveAlarms.forEach(element => {
                        this.arrAlarms.push(element);
                    });

                    // sort alarms so low priority (1) are first

                    this.arrAlarms.sort(
                        function (a, b) {
                            return a.alarmLevel - b.alarmLevel
                        });

                }

                const getAssets = data[1];
                if (getAssets && getAssets.length) {
                    getAssets.forEach(element => {
                        this.arrAssets.push(element);
                    });
                }

                this.observers.forEach(observer => {
                    observer.next({ Alarms: this.arrAlarms, Assets: this.arrAssets });
                });


            });
        }
    }

}
