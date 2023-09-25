import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
  }

  createUser(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
    .then(_ => {
      if(this.auth.error == null) {
        this.goTo('/dashboard')
      }
    });
  }

  goTo(url: string): void {
    this.router.navigate([url]);
  }
}
