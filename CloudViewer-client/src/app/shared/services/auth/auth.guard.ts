import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import {DomainServiceService} from '../domain-service.service';
// import {HttpClient} from '@angular/common/http';
import { AuthService } from './auth-service.service';


@Injectable()
export class AuthGuard implements CanActivate {
  private isAuthenticated = false; // Set this value dynamically

  constructor(private authService: AuthService) {
    console.log('constructor for authGuard called');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('authGuard.canActivate called');
    this.isAuthenticated = this.authService.loggedIn();

    if (this.isAuthenticated) {
      return true;
    }
    // this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url });
    // force hard reload

    location.href = '/sessions/signin?returnUrl=' + state.url;
    return false;
  }
}
