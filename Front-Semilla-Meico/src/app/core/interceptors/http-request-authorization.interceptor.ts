import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppStore } from '../store/app.store';
import { environment } from 'src/environments/enviroments';

export const httpRequestAuthorizationInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const authToken = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').JWT ?? '';
  let store = inject(AppStore);
  let authReq = req.clone()
  if (!req.url.includes('auth')) {

    try {

      let expiracionToken = JSON.parse(atob(authToken.split('.')[1])).exp;
      let fechaActualEnSegundos = Math.floor(Date.now() / 1000);
      let tiempoRestanteSession = expiracionToken - fechaActualEnSegundos;

      if (tiempoRestanteSession <= 0) {
        store.closeSession();
        window.location.href = 'seguridad/login';
      }

      // Clone the request and add the authorization header      
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          TransactionId: Date.now().toPrecision(),
        },
      });

      // Pass the cloned request with the updated header to the next handler
    } catch (e) { }
  } else {

    try {
      authReq = req.clone({
        setHeaders: {
          idEmpresa: '1',
          idAplicacion: environment.idAplicacion
        },
      });

    } catch (e) {

    }
  }


  return next(authReq);
};
