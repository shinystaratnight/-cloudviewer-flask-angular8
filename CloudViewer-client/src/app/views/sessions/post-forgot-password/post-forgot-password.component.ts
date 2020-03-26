import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service.service';
import { UnAuthService } from '@services/un-auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-forgot-password',
  templateUrl: './post-forgot-password.component.html',
  styleUrls: ['./post-forgot-password.component.scss']
})
export class PostForgotPasswordComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild(MatButton, { static: false }) submitButton: MatButton;

  ForgotPassword: FormGroup
  key: string;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private Auth: AuthService,
    private UnAuth: UnAuthService,
  ) { }

  ngOnInit() {
    this.ForgotPassword = new FormGroup({
      key: new FormControl('', []),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    })

    // read from query string
    this.key = this._Activatedroute.snapshot.paramMap.get('key');

  }


  submitEmail() {

    // call lookup on api
    // update password form
    // save and redirect to sign in

    debugger;
    const resetData = this.ForgotPassword.value;
    console.log(resetData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    this.UnAuth.forgot_password(resetData);
  }
}

