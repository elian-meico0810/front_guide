import { Inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SeguridadService } from '../../modulos/seguridad/servicios/seguridad.service';

export const validatePermissionUserGuard: CanActivateFn = (route, state) => {
  const seguridadService = Inject(SeguridadService);
  return true;
};
