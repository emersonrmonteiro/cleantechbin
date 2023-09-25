import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
  }

  emailSignin(email: string, password: string) {
    this.auth.emailSignin(email, password).then(_ => this.goTo('/dashboard'));
  }

  googleSignin(){
    this.auth.googleSignin().then(_ => this.goTo('/dashboard'));
  }

  goTo(url: string): void {
    this.router.navigate([url]);
  }
}
