import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatInputModule, MatProgressBar, MatButton, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ProfileService } from '../profile.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  @ViewChild(MatProgressBar, {static: false}) progressBar: MatProgressBar;

  myForm: FormGroup
  constructor(
    private ProfileService: ProfileService,
    public confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
    ) {}
  password_current = new FormControl();

  ngOnInit() {
    const password_current = new FormControl('', Validators.required);
    const password_new = new FormControl('', Validators.required);
    const password_confirm = new FormControl('', [CustomValidators.equalTo(password_new),Validators.required]);

     this.myForm = new FormGroup({
      password_current: password_current,
      password_new: password_new,
      password_confirm: password_confirm,
     });

  }

  onSubmit(){
    const FormData = this.myForm.value
    console.log(FormData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    // this.router.navigateByUrl('/dashboards/mainDashboard');

    this.ProfileService.ChangePassword(FormData).subscribe(res => {
      // location.href = '/dashboards/mainDashboard';
      // this.confirmService.confirm({title: "Password Changed", message: " "});
      
      this.snack.open('Password Changed', 'OK', { duration: 4000 })
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
    });

  }

}
