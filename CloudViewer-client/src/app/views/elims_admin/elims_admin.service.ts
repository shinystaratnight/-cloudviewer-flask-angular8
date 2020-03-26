import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomainServiceService } from '@services/domain-service.service';

// @Injectable({
// providedIn: 'root'
// })

@Injectable()
export class ElimsAdminService {
  items: any[];

  private baseURL: string;

  constructor(
    private http: HttpClient,
    public domainService: DomainServiceService,
  ) {
    this.baseURL = domainService.getBaseURL();
  }

  getAllRequests_api(): Observable<any> {
    return this.http.get(this.baseURL + 'requests');
  }

  getAllUsers_api(): Observable<any> {
    return this.http.get(this.baseURL + 'getlistallusers');
  }

  getAllCompanies_api(): Observable<any> {
    return this.http.get(this.baseURL + 'companies');
  }

  getAllDistricts_api(CustomerID: any): Observable<any> {
    return this.http.get(this.baseURL + 'elims_admin/users/getdistrictsforcust/' + CustomerID);
  }

  postApproveUser_api(UserID: any, CompanyID: any, DistrictID: any, AccessLevel: any): Observable<any> {
    
    let obj: object = new Object();
    obj['registrationID'] = UserID;
    obj['districtID'] = DistrictID;
    obj['companyID'] = CompanyID;
    obj['accessLevel'] = AccessLevel;
    obj['status'] = 'approve';
    return this.http.post(this.baseURL + 'elimsadmin/approveuser', obj);
  }

  getCustomers_api(): Observable<any> {
    return this.http.get(this.baseURL + 'companies');
  }

  addCustomer_api(data: any): Observable<any> {
    return this.http.post(this.baseURL + 'company/' + data.CompanyName, data);
  }

  updateCustomer_api(data: any): Observable<any> {
    data.customerName = data.CompanyName;
    return this.http.put(this.baseURL + 'company/' + data.name, data);
  }

  removeCustomer_api(data: any): Observable<any> {
    return this.http.delete(this.baseURL + 'company/' + data.name);
  }

  // Districts
  getDistricts_api(): Observable<any> {
    return this.http.get(this.baseURL + 'districts');
  }

  getDistrictsForCustomer_api(): Observable<any> {
    return this.http.get(this.baseURL + 'districts');
  }

  addDistricts_api(data: any): Observable<any> {
    data.customerID = data.Company;
    data.comment = data.Comment;
    return this.http.post(this.baseURL + 'district/' + data.DistrictName, data);
  }

  updateDistricts_api(data: any): Observable<any> {
    data.customerID = data.Company;
    data.comment = data.Comment;
    return this.http.put(this.baseURL + 'district/' + data.DistrictName, data);
  }

  // Assets

  getItems_api(): Observable<any> {
    return this.http.get(this.baseURL + 'elims_admin/assets/getallassets');
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

  updateItem_api(body: string): Observable<any> {
    return this.http.post(this.baseURL + 'elims_admin/assets/updateasset', body);
  }

  addItem_api(body: string): Observable<any> {
    
    return this.http.post(this.baseURL + 'elims_admin/assets/addasset', body);
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
