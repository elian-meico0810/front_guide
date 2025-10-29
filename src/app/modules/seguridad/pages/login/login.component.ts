import { Router } from '@angular/router';
import { LoginService } from './services/login-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private loginservice: LoginService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    if (this.loginservice.isAutenticated()) {
      this.router.navigate(['/usuarios']);
    }
  }

  Login() {
    this.loginservice.AutenticacionMicrosoft()
  }
}
