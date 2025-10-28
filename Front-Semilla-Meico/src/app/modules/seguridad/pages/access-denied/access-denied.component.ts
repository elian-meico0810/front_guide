import { Component } from '@angular/core';
import { LoginService } from '../login/services/login-service.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css'
})
export class AccessDeniedComponent {

  constructor(private loginService: LoginService) {

  }

  goHome() {
    this.loginService.logout();
  }
}
