import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
// import { appPhoneValidator } from '../../../shared/validators/phone-validator.directive';
import { AuthService } from '@services/auth/auth-service.service';
import { UnAuthService } from '@services/un-auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild(MatButton, { static: false }) submitButton: MatButton;

  signupForm: FormGroup
  constructor(
    private Auth: AuthService,
     private UnAuthService: UnAuthService,
     private router: Router
     ) { }

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
      username: new FormControl(''
        , [Validators.required, Validators.minLength(3), this.UnAuthCheckUsername.bind(this)]
      , ),
      companyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: password,
      confirmPassword: confirmPassword,
      agreed: new FormControl('', (control: FormControl) => {
        const agreed = control.value;
        if (!agreed) {
          return { agreed: true }
        }
        return null;
      })
    });

    this.signupForm.controls['username'].setErrors({ usernameTaken: true });
    
  }

  UnAuthCheckUsername(control: AbstractControl) {
    const myObserver = {
      next: ret => {
        if (ret.message == 'user not found') {
          // this.signupForm.controls['username'].setErrors(null);
        } else {
          this.signupForm.controls['username'].setErrors({ usernameTaken: true }); // failed validation
        }
      }
    };

    // Execute with the observer object
    let Observable_UNCheck = this.UnAuthService.validateUsernameNotInUse(control.value);
    Observable_UNCheck.subscribe(myObserver);
    // return Observable_UNCheck;
  }

  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get username() { return this.signupForm.get('username'); }
  get companyName() { return this.signupForm.get('companyName'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  onSubmit() {
    const signupData = this.signupForm.value;
    console.log(signupData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    this.UnAuthService.register(signupData).subscribe(data => this.BackFromSignup(data));
  }

  BackFromSignup(data) {
    // for now assume no sign up trouble
    this.router.navigate(['/', 'sessions', 'GoodSignup']);
  }

  FormatPhone() {
    let text = this.signupForm.get('phone').value;
    text = text.replace(/[^0-9.]/g, "");
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
    this.signupForm.get('phone').setValue(text);
  }

}
