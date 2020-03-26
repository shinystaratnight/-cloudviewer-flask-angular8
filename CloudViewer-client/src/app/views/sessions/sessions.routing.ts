import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ErrorComponent } from "./error/error.component";
import { PostSignupLandingComponent } from "./post-signup-landing/post-signup-landing.component";
import { PostForgotPasswordComponent } from "./post-forgot-password/post-forgot-password.component";
import { AccountResetComponent } from "./account-reset/account-reset.component";

export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "signup",
        component: SignupComponent,
        data: { title: "Signup" }
      },
      {
        path: "GoodSignup",
        component: PostSignupLandingComponent,
        data: { title: "Good Signup" }
      },
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Signin" }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot password" }
      },
      {
        path: "forgot-password-email",
        component: PostForgotPasswordComponent,
        data: { title: "Forgot password" }
      },
      {
        path: "reset/:key",
        component: AccountResetComponent,
        data: { title: "Reset password" }
      },
      {
        path: "lockscreen",
        component: LockscreenComponent,
        data: { title: "Lockscreen" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      }
    ]
  }
];
