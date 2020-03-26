import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainServiceService {
  prodHostURL = 'https://otr_api.elims.com/';
  environment = environment;

  // localHostURL = 'https://otr_api.elims.com/';
  // localHostURL = 'https://otr_api_dev.elims.com/';
  localHostURL = 'http://localhost:5000/';
  // localHostURL = 'https://otr_api_test.elims.com/';

  constructor() { }

  getBaseURL() {
    if (isDevMode()) {
      return this.localHostURL;
    } else {
      if (this.environment.branch === 'development') {
        return 'https://otr_api_dev.elims.com/';
      } else if (this.environment.branch === 'test') {
        return 'https://otr_api_test.elims.com/';
      } else if (this.environment.branch === 'master') {
        return 'https://otr_api.elims.com/';
      }

      return 'https://otr_api.elims.com/';
    }
  }
}
