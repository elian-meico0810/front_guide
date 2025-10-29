import { Component, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { LoginService } from "./modules/seguridad/pages/login/services/login-service.service";
import { environment } from "src/environments/enviroments";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private loginService: LoginService) {
    // Escuchar cambios de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        localStorage.setItem('auxRoute', event.url);
      }

      if (event instanceof NavigationEnd) {
        localStorage.setItem('previousUrl', event.urlAfterRedirects);
      }
    });
  }

  denied: boolean = false;

  ngOnInit(): void { }

  title = "meico-app-template";

  IsAuthenticated() {
    return this.loginService.isAutenticated();
  }

  HavePermissions() {
    if (this.loginService.isAutenticated()) {
      const userInfo = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}');
      const JWT = userInfo.JWT

      if (JWT) {
        if (!this.loginService.verifyPermissions("0001")) {
          this.denied = true;
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  }
}
