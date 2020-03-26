import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service.service';
import { UnAuthService } from '@services/un-auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-reset',
  templateUrl: './account-reset.component.html',
  styleUrls: ['./account-reset.component.scss']
})
export class AccountResetComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild(MatButton, { static: false }) submitButton: MatButton;

  ForgotPassword: FormGroup
  key: string;
  angForm: FormGroup;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private Auth: AuthService,
    private UnAuth: UnAuthService,
  ) { }

  ngOnInit() {
    debugger
    // read from query string
    this.key = this._Activatedroute.snapshot.paramMap.get('key');

    this.ForgotPassword = new FormGroup({
      key: new FormControl(this.key, []),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    })

  }


  submit(event) {
    event.preventDefault();

    // call lookup on api
    // update password form
    // save and redirect to sign in

    debugger;
    const resetData = this.ForgotPassword.value;

    console.log(resetData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    this.UnAuth.forgot_password_key(resetData);
  }
}

