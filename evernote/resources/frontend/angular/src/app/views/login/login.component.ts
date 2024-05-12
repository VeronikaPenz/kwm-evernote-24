import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Router} from "@angular/router";
import {FormErrorComponent} from "../../components/form-error/form-error.component";
import {MessageService} from "primeng/api";

interface Response {
  access_token: string;
}

@Component({
  selector: 'en-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormErrorComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup
  loginEmail: string
  loginPassword: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private ms: MessageService,
  ) {
    this.loginEmail = '';
    this.loginPassword = '';
    this.loginForm = this.fb.group({
      email: [this.loginEmail, [
        Validators.required,
        Validators.email
      ]],
      password: [this.loginPassword, [
        Validators.required
      ]]
    });
  }

  async login() {
    const val = this.loginForm.value;
    if (val.email && val.password) {
      try {
        await this.authService.login(val.email, val.password).then((res) => {
          this.authService.setSessionStorage((res as Response).access_token);
          this.router.navigateByUrl("/");
        });
      } catch (e) {
        console.error('API error:', e);
        this.ms.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Please check your credentials.',
        });
      }
    }
  }


}
