import { NgModule, Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GlobalService } from '@services/global-service/global-service.service';
import { ElimsAdminService } from '../../elims_admin.service';
import { egretAnimations } from '@shared/animations/egret-animations';

export enum enumAccessLevel {
  'Crew Member' = 1,
  'Company Manager' = 2,
  'ELIMS Field Tech' = 3,
  'ELIMS Admin' = 4,
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: egretAnimations,
})
export class UsersListComponent implements OnInit {

  public Users_Requested: any[];
  public Users_Current: any[];
  public Company_dropdown: any[];
  public District_dropdown: any[] = Array();
  public Access_dropdown: any[] = Array();

  constructor(
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private snack: MatSnackBar,
    private elimsAdminService: ElimsAdminService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {

    this.FetchAllData();
  }

  FetchAllData() {
    let obs: Observable<any>[] = Array();

    // for the dropdowns
    obs.push(this.elimsAdminService.getAllRequests_api());
    obs.push(this.elimsAdminService.getAllCompanies_api());
    obs.push(this.elimsAdminService.getAllUsers_api());

    forkJoin(obs).subscribe(data => this.FillForm(data));
  }

  FillForm(data) {

    this.Users_Requested = data[0]['registration requests'];
    this.Company_dropdown = data[1]['customers']; //.filter(company => company.epCustomerID !== null);
    this.Users_Current = data[2].map(user => { user['strAccessLevel'] = enumAccessLevel[user.accessLevel]; return user; });

    this.cdr.markForCheck();
  }

  onChange_company(Event) {
    // get Id
    const rowid = parseInt(Event.source.id.split('_')[1]);

    const thisUser = this.Users_Requested.filter(user => user.id === rowid);
    const CompanyId = thisUser[0]['companySet'] = Event.source.value;

    // not a really great way to unset in array
    thisUser[0]['districtSet'] = false;
    thisUser[0]['accessSet'] = false; 

    let obs: Observable<any>;
    obs = this.elimsAdminService.getAllDistricts_api(CompanyId);
    obs.subscribe(data => this.PopulateDistricts(data, rowid));

    this.PopulateAccess(rowid, CompanyId);

    return true;
  }

  PopulateDistricts(data, rowid) {
    this.District_dropdown[rowid] = data;
  }

  PopulateAccess(rowid, CompanyID) {
    if (CompanyID === 6) {
      // ELIMS
      this.Access_dropdown[rowid] = [{name: 'ELIMS Field Tech', value: 3}, {name: 'ELIMS Admin', value: 4 }];
    } else {
      this.Access_dropdown[rowid] = [{name: 'Crew Member', value: 1}, {name: 'Company Manager', value: 2 }];
    }
  }

  onChange_district(Event) {
    // get Id
    const id = parseInt(Event.source.id.split('_')[1]);

    const thisUser = this.Users_Requested.filter(user => user.id === id);
    thisUser[0]['districtSet'] = Event.source.value;

    return true;
  }

  onChange_access(Event) {
    // get Id
    const id = parseInt(Event.source.id.split('_')[1]);

    const thisUser = this.Users_Requested.filter(user => user.id === id);
    thisUser[0]['accessSet'] = Event.source.value;

    return true;
  }

  buttonDisabled(row) {

    const thisUser = this.Users_Requested.filter(user => user.id === row.id);

    if (thisUser[0]['companySet'] && thisUser[0]['districtSet'] && thisUser[0]['accessSet']) return false;

    return true;
  }

  getDistrict_dropdown(id) {
    
    //if (id in this.District_dropdown) {
    return this.District_dropdown[id];
    // } else {
    //   return false;
    // }
  }

  ApproveUser(row) {
    
    const thisUser = this.Users_Requested.filter(user => user.id === row.id);

    const CompanyID = thisUser[0]['companySet'];
    const DistrictID = thisUser[0]['districtSet'];
    const accessLevel = thisUser[0]['accessSet'];

    let obs: Observable<any>;
    obs = this.elimsAdminService.postApproveUser_api(row.id, CompanyID, DistrictID, accessLevel);
    obs.subscribe(data => this.FetchAllData());
  }


  ngOnInit() {

  }

}
