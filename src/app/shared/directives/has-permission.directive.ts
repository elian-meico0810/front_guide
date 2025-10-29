import { Directive, ElementRef, Input } from '@angular/core';
import { LoginService } from 'src/app/modules/seguridad/pages/login/services/login-service.service';

@Directive({
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  private permissions: string[] = [];

  constructor(private elementRef: ElementRef, private loginService: LoginService) {

  }
  /**
   * Habilita o inhabilita una funcionalidad al usuario, dependiendo
   * dependiendo si el usuario tiene o no los permisos necesario
   */

  @Input() set hasPermission(permission: string) {
    this.loginService.verifyPermissions(permission).then((hasPermission) => {
      if (!hasPermission) {
        this.elementRef.nativeElement.remove();
      }
    });
  }
}
