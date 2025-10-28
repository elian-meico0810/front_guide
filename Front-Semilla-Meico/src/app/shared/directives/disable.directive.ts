import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { LoginService } from 'src/app/modules/seguridad/pages/login/services/login-service.service';

@Directive({
  selector: '[disableHasPermission]',
})
export class DisableHasPermissionDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private loginService: LoginService) {

  }
  /**
   * Habilita o inhabilita una funcionalidad al usuario, dependiendo
   * dependiendo si el usuario tiene o no los permisos necesario
   */
  @Input() set disableHasPermission(permission: string) {
    this.loginService.verifyPermissions(permission).then((hasPermission) => {
      if (!hasPermission) {
        this.disableElement();
      }
    });
  }

  private disableElement() {
    const element = this.elementRef.nativeElement;

    this.renderer.setProperty(element, 'disabled', true);
    this.renderer.setStyle(element, 'pointer-events', 'none');
    this.renderer.setStyle(element, 'opacity', '0.5');
  }

}
