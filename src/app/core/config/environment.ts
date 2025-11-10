export class Environment {
  // URL base de la API
  static readonly API_BASE_URL = 'api';

  // Endpoints específicos
  static readonly USERS = `${Environment.API_BASE_URL}/users/obtener/`;
  static readonly ROLES = `${Environment.API_BASE_URL}/roles/`;
  static readonly GUIAS = `${Environment.API_BASE_URL}/guias/`;

  // Endpoints de obtener planillas 
  static readonly INFO_GUIAS = `${Environment.API_BASE_URL}/gestionGuias/obtener-planilla-detalles/`;

  // Crear registro de consignaciones
  static readonly SEND_CONSIGNACIONES = `${Environment.API_BASE_URL}/consignaciones/crear/`;
}
