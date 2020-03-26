import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { DomainServiceService } from '@services/domain-service.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseURL: string
  userAccessLevel: number;

  constructor(
    private http: HttpClient,
    public domainService: DomainServiceService,
    ) {
    this.baseURL = domainService.getBaseURL();
  }

  ChangePassword(FormData) {
    // rework form data to match API
    let ApiFormData: any = new Object();
    ApiFormData.password = FormData['password_current'];
    ApiFormData.new_password = FormData['password_new'];
    ApiFormData.confirm_password = FormData['password_confirm'];

    return this.http.post(this.baseURL + 'myprofile/changepassword', ApiFormData);
  }

  ChangeProfile(FormData) {
    // rework form data to match API
    let ApiFormData: any = new Object();
    ApiFormData.phone = FormData['phone'];
    
    return this.http.put(this.baseURL + 'myprofile/profile', ApiFormData);
  }

  GetProfile() {
    // rework form data to match API
    return this.http.get(this.baseURL + 'myprofile/profile');
  }

  GetAllDistricts() {
    // rework from data to match API
    return this.http.get<any[]>(this.baseURL + 'myprofile/allAvailableDistricts');
  }

  GetSelectedDistricts() {
    // rework from data to match API
    return this.http.get<any[]>(this.baseURL + 'myprofile/showDistricts');
  }

  AddDistrict(id: number) {
    // rework from data to match API
    return this.http.put(this.baseURL + `myprofile/addDistrict/${id}`, null);
  }

  RemoveDistrict(id: number) {
    // rework from data to match API
    return this.http.put(this.baseURL + `myprofile/removeDistrict/${id}`, null);
  }
}
