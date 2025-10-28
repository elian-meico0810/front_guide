import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SnackbarComponent } from '@core/components/snackbar/snackbar.component';
import { LoginService } from 'src/app/modules/seguridad/pages/login/services/login-service.service';
import { environment } from 'src/environments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    snackBar = inject(MatSnackBar);
    constructor(
        private router: Router,
        private loginservice: LoginService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        if (this.loginservice.isAutenticated()) {

            const requiredPermission = route.data['requiredPermission'];
            const JWT = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').JWT;
            if (JWT) {
                if (await this.loginservice.verifyPermissions(requiredPermission)) {
                    return true;
                } else {
                    if (!await this.loginservice.verifyPermissions('0001')) {
                        this.router.navigate(['/acceso-denegado']);
                        return false;
                    }

                    const previousUrl = localStorage.getItem('previousUrl');
                    if (previousUrl) {
                        this.router.navigate([previousUrl]);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                    this.snackBar.openFromComponent(SnackbarComponent, {
                        data: {
                            message: 'No tienes permisos para realizar esta acción',
                            type: 'error'
                        },
                        duration: 3000,
                        panelClass: 'custom-snackbar',
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                    return false;
                }
            } else {
                this.loginservice.LoadPermissions(this.loginservice.GetToken());
                return false;
            }
        } else {
            this.loginservice.AutenticacionMicrosoft();
            return false;
        }
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
