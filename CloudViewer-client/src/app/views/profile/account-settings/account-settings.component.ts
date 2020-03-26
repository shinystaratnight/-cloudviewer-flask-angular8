import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatInputModule, MatProgressBar, MatButton, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  @ViewChild(MatProgressBar, {static: false}) progressBar: MatProgressBar;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  public getItemSub: Subscription;
  public sub_putFormValues: Subscription;

  public items: any[];

  myForm: FormGroup;
 
  phone: FormControl;
  private fb: FormBuilder;
  public data: any;

   constructor(
     private ProfileService : ProfileService,
     private cdr: ChangeDetectorRef,
     private snack: MatSnackBar,

  ) { 
      this.myForm = new FormGroup({

    });

  }
  
  public getItems() {
    let obs = this.ProfileService.GetProfile();
    this.getItemSub = obs.subscribe( data => {
      this.buildItemForm(data)
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
    })
    return obs;
  }

  public putFormValues() {
    
    const FormData = this.myForm.value
    
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    let obs = this.ProfileService.ChangeProfile(FormData);
    this.sub_putFormValues = obs.subscribe( data => {

      this.snack.open('Phone Number Changed', 'OK', { duration: 4000 })
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
    })
    return obs;
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.phone = this.fb.control({value: '', disabled: false}, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]);
    
    this.myForm = new FormGroup({
      phone: this.phone,
    });

    this.getItems();
  }

   buildItemForm(DataIn) {
    this.phone.setValue(this.FormatPhone(DataIn.phone));
  }
 
  onSubmit(){
    let obs = this.putFormValues();
  }

  FormatPhone(phone: String) {
    let text = phone;
    if(text){
      text = text.replace(/[^0-9.]/g, "");
      text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
    }
    return text;
  }

  FormatPhone_keyup(event){
    this.phone.setValue(this.FormatPhone(event.currentTarget.value));
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
}
