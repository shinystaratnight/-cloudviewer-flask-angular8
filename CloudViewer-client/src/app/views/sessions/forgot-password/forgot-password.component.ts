import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service.service';
import { UnAuthService } from '@services/un-auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild(MatProgressBar, {static: false}) progressBar: MatProgressBar;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  
  ForgotPassword: FormGroup
  
  constructor(private Auth: AuthService, private UnAuth: UnAuthService) { }

  ngOnInit() {
    this.ForgotPassword = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }


  submitEmail() {
    
    const resetData = this.ForgotPassword.value;
    console.log(resetData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    this.UnAuth.forgot_password(resetData);
  }
}
