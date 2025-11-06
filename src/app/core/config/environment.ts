export class Environment {
  // URL base de la API
  static readonly API_BASE_URL = 'http://127.0.0.1:8000/api';

  // Endpoints específicos
  static readonly USERS = `${Environment.API_BASE_URL}/users/obtener/`;
  static readonly ROLES = `${Environment.API_BASE_URL}/roles/`;
  static readonly GUIAS = `${Environment.API_BASE_URL}/guias/`;


  static readonly INFO_GUIAS = `${Environment.API_BASE_URL}/gestionGuias/obtener-planilla-detalles/`;
}
