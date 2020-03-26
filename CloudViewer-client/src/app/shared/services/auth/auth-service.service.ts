import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { DomainServiceService } from '@services/domain-service.service';
import { map } from 'rxjs/operators';
//import { O } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL: string
  userAccessLevel: number;

  constructor(private http: HttpClient, public domainService: DomainServiceService) {
    this.baseURL = domainService.getBaseURL();
  }

  getToken() {
    const token_encoded = localStorage.getItem('token');
    return token_encoded;
  }

  loggedIn() {
    const token_encoded = localStorage.getItem('token');
    const jwtHelper = new JwtHelperService();

    // if the token is blank, we're not logged in
    if(token_encoded === '') return false;

    // this will fail if the token is bad
    let IsValid;
    try {
      IsValid = !jwtHelper.isTokenExpired(token_encoded);
    }
    catch (err) {
      // Bad token
      // clear token from local storage
      localStorage.removeItem('token');
      return false;
    }
    return (IsValid);
  }

  loggedInAsAdmin() {
    if (this.loggedIn()) {
      return this.isFieldTech();
    }
    return false;
  }

  isEngineer() {
    const level = this.GetAccessLevel();
    if (this.loggedIn()) {
      if (level === 2) {
        return true;
      }
    }
    return false;
  }

  isFieldTech() {
    const level = this.GetAccessLevel();
    if (this.loggedIn()) {
      if (level === 3) {
        return true;
      }
    }
    return false;
  }

  HasWritePermissions() {
    return this.isFieldTech() || this.isEngineer();
  }

  SetAccessLevel(level: number) {
    this.userAccessLevel = level;
  }

  GetAccessLevel() {
    const level = parseInt(localStorage.getItem('accessLevel'));
    return level;
  }


}
