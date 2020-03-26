import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { DomainServiceService } from './domain-service.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnAuthService {
  baseURL: string

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  userAccessLevel: number;

  constructor(private http: HttpClient, public domainService: DomainServiceService) {
    this.baseURL = domainService.getBaseURL();
  }

  validateUsernameNotInUse(username: String) {
    if (username) {
      return this.http.get(this.baseURL + 'validate/' + username);
    } else {
      return of();
    }
  }

  login(model: any) {
    return this.http.post(this.baseURL + 'login', model);
  }

  logout() {
    const model: object = Object();
    return this.http.post(this.baseURL + 'logout', model);
  }

  register(model: any) {
    return this.http.post(this.baseURL + 'register', model)
  }

  forgot_password(model: any) {
    return this.http.post(this.baseURL + 'AccountReset', model)
      .subscribe({
        next(response: any) {
          location.href = '/sessions/forgot-password-email';
        },
        error(msg) { console.log('Error: ', msg); }
      });
  }

  forgot_password_key(model: any) {
    return this.http.put(this.baseURL + 'AccountReset', model)
      .subscribe({
        next(response: any) {
          location.href = '/sessions/signin';
        },
        error(msg) { console.log('Error: ', msg); }
      });
  }

}