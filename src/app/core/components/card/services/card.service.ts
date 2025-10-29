import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/card.model';  // Importamos la nueva interfaz
import { environment } from 'src/environments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrlAplicaiconesViejas = `${environment.apiAuthUrl}/api/auth/obtener_aplicaciones_intranet`;
  private apiUrlAplicacionesNuevas = `${environment.apiAuthUrl}/auth/obtener_aplicaciones/`;

  constructor(private http: HttpClient) { }

  obtenerTarjetasAppviejas(token: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = { token };

    return this.http.post<ApiResponse>(this.apiUrlAplicaiconesViejas, body, { headers });
  }

  obtenerTarjetasAppNuevas(token: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = { token };

    return this.http.post<ApiResponse>(this.apiUrlAplicacionesNuevas, body, { headers });
  }
}