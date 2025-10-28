import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ETypeContent } from '@core/enum/type-content.enum';
import { ObjParam } from '@core/interfaces/base/obj-param.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseAppService {

  /**
   * Propiedad que especifica el webApi
   */
  private _backendUrl = environment.apiAppUrl;

  /**
   * Propiedad que define el timezone
   */
  private _timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


  /**
   * Metodo constructor del compnenete
   * @param _httpClient Cliente Http
   */
  constructor(private _httpClient: HttpClient) { }

  /**
   * Metodo GET utilizado para enviar peticiones al webApi
   * @param url que define el WebApi que será consumido
   * @param httpParams Array de objetos con los parametros
   * @param httpHeaders Array de objetos con los parametros
   * @param typeContent Define el tipo de contenido
   * @returns observable con la respuesta del webApi
   */
  public get<T>(
    url: string,
    httpParams: Array<ObjParam> = [],
    httpHeaders: Array<ObjParam> = [],
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    const urlApi = this._backendUrl + url;
    let params: HttpParams = this._obtenerHttpParams(httpParams);
    let headers: HttpHeaders = this._obtenerHttpHeaders(httpHeaders);
    headers = this._agregarTypeContent(headers, typeContent);
    headers = this._agregarTimeZone(headers);
    return this._httpClient.get<T>(urlApi, { params, headers });
  }

  /**
   * Metodo POST para enviar peticiones al webApi
   * @param url que define el WebApi que será consumido
   * @param bodyParams define los body params
   * @param httpParams Array de objetos con los parametros
   * @param httpHeaders Array de objetos con los parametros
   * @param typeContent Define el tipo de contenido
   * @returns un observable con la respuesta del webApi
   */
  public post<T>(
    url: string,
    bodyParams: any = null,
    httpParams: Array<ObjParam> = [],
    httpHeaders: Array<ObjParam> = [],
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    const urlApi = this._backendUrl + url;
    let params: HttpParams = this._obtenerHttpParams(httpParams);
    let headers: HttpHeaders = this._obtenerHttpHeaders(httpHeaders);
    headers = this._agregarTypeContent(headers, typeContent);
    headers = this._agregarTimeZone(headers);
    return this._httpClient.post<T>(urlApi, bodyParams, { params, headers });
  }

  /**
   * Metodo PUT para enviar peticiones al webApi
   * @param url que define el WebApi que será consumido
   * @param bodyParams define los body params
   * @param httpParams Array de objetos con los parametros
   * @param httpHeaders Array de objetos con los parametros
   * @param typeContent Define el tipo de contenido
   * @returns un observable con la respuesta del webApi
   */
  public put<T>(
    url: string,
    bodyParams: any = null,
    httpParams: Array<ObjParam> = [],
    httpHeaders: Array<ObjParam> = [],
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    const urlApi = this._backendUrl + url;
    let params: HttpParams = this._obtenerHttpParams(httpParams);
    let headers: HttpHeaders = this._obtenerHttpHeaders(httpHeaders);
    headers = this._agregarTypeContent(headers, typeContent);
    headers = this._agregarTimeZone(headers);
    return this._httpClient.put<T>(urlApi, bodyParams, { params, headers });
  }

  /**
   * Metodo DELETE para enviar peticiones al webApi
   * @param url que define el WebApi que será consumido
   * @param httpParams Array de objetos con los parametros
   * @param httpHeaders Array de objetos con los parametros
   * @returns un observable con la respuesta del webApi
   */
  public deleteMethod<T>(
    url: string,
    httpParams: Array<ObjParam> = [],
    httpHeaders: Array<ObjParam> = [],
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    const urlApi = this._backendUrl + url;
    let params: HttpParams = this._obtenerHttpParams(httpParams);
    let headers: HttpHeaders = this._obtenerHttpHeaders(httpHeaders);
    headers = this._agregarTypeContent(headers, typeContent);
    headers = this._agregarTimeZone(headers);
    return this._httpClient.delete<T>(urlApi, { params, headers });
  }

  /**
   * Metodo para obtener los http params
   * @param objParams Array de objetos campo valor
   */
  private _obtenerHttpParams(objParams: Array<ObjParam> = []): HttpParams {
    let params: HttpParams = new HttpParams();
    if (objParams) objParams.forEach((param: any) => params = params.append(param.campo, param.valor));
    return params;
  }

  /**
   * Metodo para obtener los headers
   * @param objParams Array de objetos campo valor
   */
  private _obtenerHttpHeaders(objParams: Array<ObjParam> = []): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    if (objParams) objParams.forEach((param: any) => headers = headers.append(param.campo, param.valor));
    return headers;
  }

  /**
   * Metodo para agregar el type content a las peticiones
   * @param headers Instancia de httpHeaders
   * @param typeContent Tipo de contenido
   */
  private _agregarTypeContent(headers: HttpHeaders, typeContent: string): HttpHeaders {
    return typeContent ? headers.append('content-type', typeContent) : headers;
  }

  /**
   * Metodo para agregar el timezome a las peticiones
   * @param headers Instancia de httpHeaders
   */
  private _agregarTimeZone(headers: HttpHeaders): HttpHeaders {
    return headers.append('ZonaHoraria', this._timezone);
  }
}
