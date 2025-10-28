import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseAPI, UserData, UserDataDirectorioActivo } from '@core/interfaces/base/responseApi.interface';
import { HttpBaseService } from '@core/services/http-base.service';
import { HttpBaseAppService } from '@core/services/http-base-app.service';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'api/usuarios/getUsuarioDirectorioActivo/';
  private apiUrlgetUsuarios = 'api/users/obtener/';
  private apiUrlgetUsuario = 'api/users/getUser/';
  private apiUrlSaveUsuario = 'api/users/crear/';
  private apiUrlEditUsuario = 'api/users/actualizar/';
  snackBar = inject(MatSnackBar);

  constructor(
    private httpBase: HttpBaseService,
    private httpBaseApp: HttpBaseAppService
  ) { }

  ngOnInit(): void {

  }

  getUsuarios(): Observable<UserData[]> {
    return this.httpBaseApp.get<ResponseAPI<UserData[]>>(this.apiUrlgetUsuarios).pipe(
      map((response: ResponseAPI<UserData[]>) => response.data),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  getUsuario(user_id: number): Observable<{ usuario: any; empresas: any[] }> {
    const body = { user_id: user_id };
    return this.httpBaseApp.post<ResponseAPI<any>>(this.apiUrlgetUsuario, body).pipe(
      map((response: ResponseAPI<any>) => ({
        usuario: response.data,
        empresas: response.data.Empresas,
      })),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  saveUsuario(Usuario: any): Observable<any> {
    const body = { Usuario: Usuario };
    return this.httpBaseApp.post<ResponseAPI<any>>(this.apiUrlSaveUsuario, body).pipe(
      map((response: ResponseAPI<any>) => response.data),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  editUsuario(Usuario: any): Observable<any> {
    const body = { Usuario: Usuario };
    return this.httpBaseApp.put<ResponseAPI<any>>(this.apiUrlEditUsuario, body).pipe(
      map((response: ResponseAPI<any>) => response.data),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  EliminarUsuario(idUsuario: number): Observable<boolean> {
    const body = { id: idUsuario };
    return this.httpBaseApp.deleteMethod<ResponseAPI<{ estado: boolean }>>(`api/users/${idUsuario}/eliminar/`).pipe(
      map((response: ResponseAPI<{ estado: boolean }>) => response.data.estado),
      catchError((error) => {
        console.error('Error al cambiar el estado del usuario', error);
        return throwError(() => error);
      })
    );
  }

}
