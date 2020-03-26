import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GlobalService } from '@services/global-service/global-service.service';
import { WellsitesService } from '../wellsites.service';

@Component({
  selector: 'app-wellsite-modify',
  templateUrl: './wellsite-modify.component.html',
  styleUrls: ['./wellsite-modify.component.scss']
})
export class WellsiteModifyComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  myForm: FormGroup;
  id: String;
  public IsEdit: boolean;
  public ShowForm: boolean = false;

  public WellSiteName: string = "";
  public arr_States: object[];
  public arr_Districts: object[];

  constructor(
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private snack: MatSnackBar,
    private wellsiteService: WellsitesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {

    let obs: Observable<any>[] = Array();

    // for the dropdowns
    obs.push(this.wellsiteService.getAllWellSite_States_api());
    obs.push(this.wellsiteService.getAllWellSite_Districts_api());

    this.id = this._Activatedroute.snapshot.paramMap.get('id');
    if (this.id === 'new') {
      this.WellSiteName = 'New Well Site';
      this.IsEdit = false;
    } else {
      this.WellSiteName = 'Modify Well Site #' + this.id;
      this.IsEdit = true;
      obs.push(this.wellsiteService.getWellSiteDetails_api(this.id));
    }

    forkJoin(obs).subscribe(data => this.FillForm(data));

    // Add the dynamic side of the form
    this.myForm = this.fb.group({
      // "jobID": 500455, --system
      // "customerID": 11, --JWT
      // "districtID": 34, --Pass 1 for now
      districtID: [''],
      // "orderNumber": "RPES1336", -- Text
      orderNumber: [''],
      // "wellName": "Petro Hunt- Brenna 152-96-22A-27-6H", -- Text
      wellName: [''],
      // "jobLocation": "Keene (McKenzie County)", -- Text
      jobLocation: [''],
      // "fracCrew": "Rock Pile/Bravo", "OTR"
      fracCrew: [''],
      // "fieldTech": "lluna", "OTR"
      fieldTech: [''],
      // "tankCount": 7, Pass 1
      tankCount: [''],
      jobState: [''],
      // "jobStatus": "Complete", "Pending"
      jobStatus: [''],
      // "memo": "From Watford City take hwy. 23 east towards New To", -- Text (long)
      memo: [''],
      // "postedToJob": "", ""
      postedToJob: [''],
      // "requestedBy": "Robert Grunden", -- Text
      requestedBy: [''],
      // "createdBy": "lluna", -- Text
      createdBy: [''],
      // "scheduledStartDate": "2013-10-13T00:00:00", -- Datetime
      scheduledStartDate: [''],
      // "scheduledEndDate": "2013-10-16T00:00:00", -- Datetime
      scheduledEndDate: [''],
      // "tankDeliveryDate": "2013-10-13T00:00:00", -- Datetime
      tankDeliveryDate: [''],
      // "dateCreated": "2013-10-14T03:44:53.343000", -- Datetime
      dateCreated: [''],
      // "custRecDelivery": false, -- False
      custRecDelivery: [''],
      // "termID": 403, -- 0
      termID: [''],
      // "stage": 5, -- 0
      stage: [''],
      // "tankEnable": 0, -- 0
      tankEnable: [''],
      // "gpsLat": 47.99253463745117, --text:Number
      gpsLat: [''],
      // "gpsLong": -102.92423248291016, --text:Number
      gpsLong: [''],
      // "jobStart": "2013-10-14T03:48:51", -- Datetime
      jobStart: [''],
      // "jobEnd": "2013-10-18T09:12:19", -- Datetime
      jobEnd: [''],
    });
  }

  FillForm(data) {

    this.arr_States = data[0];
    this.arr_Districts = data[1];

    if (this.IsEdit) {
      Object.keys(data[2]).forEach((KeyName, index, arr) => {
        if (this.myForm.controls[KeyName]) {
          this.myForm.controls[KeyName].setValue(data[2][KeyName]);
        }
      });
    }

    this.ShowForm = true;
    this.progressBar.mode = 'determinate';
    this.cdr.markForCheck();
  }

  submit() { // form submit
    let objUpdate: object = new Object();

    Object.keys(this.myForm.controls).forEach(KeyName => {

      let name: string = '';
      let value: any = '';

      if (KeyName === '') {
        name = KeyName;
        value = this.myForm.controls[KeyName].value;
      } else if (KeyName === 'gpsLat') {
        name = KeyName;
        value = parseFloat(this.myForm.controls[KeyName].value);
      } else if (KeyName === 'gpsLong') {
        name = KeyName;
        value = parseFloat(this.myForm.controls[KeyName].value);
      } else if (KeyName === 'dateCreated' || KeyName === 'scheduledEndDate' || KeyName === 'scheduledStartDate' || KeyName === 'tankDeliveryDate') {
        name = KeyName;
        value = this.myForm.controls[KeyName].value;

        if (value.hasOwnProperty('format')) {
          value = value.format('YYYY-MM-DDTHH:MM:SS');
        }

      } else {
        name = KeyName;
        value = this.myForm.controls[KeyName].value;
        if (value === null) value = '';
      }

      if (name != '') {
        objUpdate[name] = value;
      }

    });

    if (this.IsEdit) {
      this.wellsiteService.setWellSiteDetails_api(this.id, objUpdate).subscribe(data => {
        this.router.navigate(['/manage', 'wellsites', { id: this.id, action: 'edited' }]);
      });
    } else {
      this.wellsiteService.createWellSiteDetails_api(objUpdate).subscribe(data => {
        this.router.navigate(['/manage', 'wellsites', { action: 'created' }]);
      });
    }

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.id == 'new') {
      this.progressBar.mode = 'determinate';
    }
  }

}
