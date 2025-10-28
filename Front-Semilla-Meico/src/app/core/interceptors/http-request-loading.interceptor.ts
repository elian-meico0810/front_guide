import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

export const httpRequestLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _spinnerService = inject(NgxSpinnerService);
  _spinnerService.show();
  return next(req).pipe(finalize(() => _spinnerService.hide()));
};
