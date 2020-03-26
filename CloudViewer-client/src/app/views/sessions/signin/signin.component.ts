import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service.service';
import { UnAuthService } from '@services/un-auth-service.service';
import { Router } from '@angular/router';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild(MatButton, { static: false }) submitButton: MatButton;
  model: any = {};

  signinForm: FormGroup;

  constructor(
    private authService: AuthService,
    private UnAuthService: UnAuthService,
    private router: Router,
    public confirmService: AppConfirmService,
  ) { }

  ngOnInit() {
    // make sure all accounts are logged out when viewing this page
    this.UnAuthService.logout().subscribe(e => this.clearLocal());

    // make sure an manually clear, just in case we're already logged out
    this.clearLocal();

    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    })
  }

  clearLocal() {
    localStorage.setItem('token', '');
    localStorage.setItem('username', '');
    localStorage.setItem('accessLevel', '');
    localStorage.setItem('customerID', '0');
    localStorage.setItem('userID', '');
  }

  signin(event) {
    event.preventDefault();

    const signinData = this.signinForm.value
    console.log(signinData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    // this.router.navigateByUrl('/dashboards/mainDashboard');

    this.UnAuthService.login(signinData).subscribe(
      (function (response) {
        function getParameterByName(name) {
          let url = window.location.href;
          name = name.replace(/[\[\]]/g, '\\$&');
          var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        const user = response;
        if (user && user.access_token) {
          localStorage.setItem('token', user.access_token);
          const jwtHelper = new JwtHelperService();

          const decodedToken = jwtHelper.decodeToken(user.access_token);
          localStorage.setItem('username', decodedToken.user_claims.hello);
          localStorage.setItem('accessLevel', decodedToken.user_claims.accessLevel);
          localStorage.setItem('customerID', decodedToken.user_claims.customerID);
          localStorage.setItem('userID', decodedToken.user_claims.userID);

          // Add AWS ID and Secret
          localStorage.setItem('AWS_ID', decodedToken.user_claims.AWS_ID);
          localStorage.setItem('AWS_SECRET', decodedToken.user_claims.AWS_SECRET);
          
          // redirect
          let returnUrl = getParameterByName('returnUrl');
          if (returnUrl != null && returnUrl != '') {
            location.href = returnUrl;
          } else {
            location.href = '/dashboards/mainDashboard';
          }

        } else {
          this.confirmService.confirm({ title: 'Error Logging in', message: ' ' });

          // reset for new login attempt
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
        }
      }).bind(this)
    );

  }
}
