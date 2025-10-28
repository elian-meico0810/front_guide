import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "@core/components/snackbar/snackbar.component";
import { catchError, throwError } from "rxjs";

export const httpRequestHandlerErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 400:
          console.error("Unauthorized request: error:", err.message);
          break;
        case 403:
          console.error("Unauthorized request:", err);
          snackBar.openFromComponent(SnackbarComponent, {
            data: {
              message: 'No tienes permisos para realizar esta acción',
              type: 'error'
            },
            duration: 3000,
            panelClass: 'custom-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          break;
        case 404:
          const errorMs = err.error.message || "Conflicto en la solicitud.";
            return throwError(() => new Error(errorMs));

        case 500:
          snackBar.open(err.error.message, "X", {
            verticalPosition: "bottom",
            horizontalPosition: "right",
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          break;

        case 409:
          const errorMsg = err.error.message || "Conflicto en la solicitud.";
          return throwError(() => new Error(errorMsg));


        default:
          snackBar.open("Se ha presentado un error procesando la solicitud.", "", {
            verticalPosition: "bottom",
            horizontalPosition: "right",
            duration: 3000,
          });
          break;
      }

      if (err.status >= 500) {
        // Handle 5xx HTTP error codes
        console.error("HTTP error:", err.error.message);
        return throwError(() => null);
      }
      return throwError(() => err.error.message);
    })
  );
};
