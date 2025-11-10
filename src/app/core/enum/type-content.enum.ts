import { environment } from "src/environments/enviroments";

/**
 * Enumerable que define los tipos de contenido para las peticiones http
 */
export enum ETypeContent {
  applicationJson = 'application/json'
}

export enum TokenRute {
   TOKEN = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').JWT
}