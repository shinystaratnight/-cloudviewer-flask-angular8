import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatInputModule, MatProgressBar, MatButton } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';

export enum enumAccessLevel {
  'Crew Member' = 1,
  'Company Manager' = 2,
  'ELIMS Field Tech' = 3,
  'ELIMS Admin' = 4,
}


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  // @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  public getItemSub: Subscription;

  public items: any[];

  myForm: FormGroup;
  // {
  //   "id": 3,
  //   "name": "test",
  //   "email": "test@user.com",
  //   "access level": 1,
  //   "company ID": 1046,
  //   "district ID": 9,
  //   "phone": "2222222228"
  // }

  id: FormControl;
  name: FormControl;
  email: FormControl;
  accessLevel: FormControl;
  CompanyID: FormControl;
  companyName: FormControl;
  districtID: FormControl;
  phone: FormControl;
  private fb: FormBuilder;
  public data: any;

  constructor(
    private ProfileService: ProfileService,
    private cdr: ChangeDetectorRef,

  ) {
    this.myForm = new FormGroup({

    });

  }

  public getItems() {
    let obs = this.ProfileService.GetProfile();
    this.getItemSub = obs.subscribe(data => {
      this.buildItemForm(data)
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
    })
    return obs;
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.id = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.name = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.email = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.accessLevel = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.CompanyID = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.companyName = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.districtID = this.fb.control({ value: '', disabled: true }, [Validators.required]);
    this.phone = this.fb.control({ value: '', disabled: true }, [Validators.required]);

    this.myForm = new FormGroup({
      id: this.id,
      name: this.name,
      email: this.email,
      accessLevel: this.accessLevel,
      CompanyID: this.CompanyID,
      CompanyName: this.companyName,
      districtID: this.districtID,
      phone: this.phone,
    });

    this.getItems();
  }

  buildItemForm(DataIn) {
    // this.StateDataList = DataIn.StateDataList;
    // this.StatusDataList = DataIn.StatusDataList;
    // this.WellSiteDataList = DataIn.WellSiteDataList;
    //this.itemForm = this.fb.group();

    
    // DataIn.map(objectMap =>{
    //   // this.id.value(DataIn.id);
    //   
    //   if(this[objectMap.name]){
    //     this[objectMap.name].value(objectMap);
    //   }
    // });
    this.id.setValue(DataIn.id);
    this.name.setValue(DataIn.name);
    this.email.setValue(DataIn.email);
    this.accessLevel.setValue(enumAccessLevel[DataIn.accessLevel]);
    this.CompanyID.setValue(DataIn.CompanyID);
    this.companyName.setValue(DataIn.companyName);
    this.districtID.setValue(DataIn.districtID);
    this.phone.setValue(this.FormatPhone(DataIn.phone));
  }

  onSubmit() {

  }

  FormatPhone(phone: String) {
    let text = phone;
    text = text.replace(/[^0-9.]/g, "");
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
    return text;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
}

