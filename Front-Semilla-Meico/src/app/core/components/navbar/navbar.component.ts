import { Component, OnInit, inject } from '@angular/core';
import { AppStore, User } from '../../store/app.store';
import { LoginService } from 'src/app/modules/seguridad/pages/login/services/login-service.service';
import { environment } from 'src/environments/enviroments';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  readonly store = inject(AppStore);
  public userLogin: User = {
    email: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Email || '',
    FirstName: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Name || '',
    Permissions: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').JWT || '',
    userName: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').userName || '',
    Foto: '',
  };
  public visible: boolean = true;
  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.userFoto$.subscribe(foto => {
      this.userLogin.Foto = foto;
    });

    this.loginService.user$.subscribe(user => {
      if (user) {
        this.userLogin = user;
      }
    });

    this.loginService.checkRedirectCallback();
    this.loginService.handleMsalEvents();
  }

  Logout() {
    this.loginService.logout();
  }

  OnChangeAccount(){
    this.loginService.ChangeAccount();
  }
}
