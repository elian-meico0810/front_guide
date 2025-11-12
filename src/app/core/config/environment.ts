export class Environment {
  // URL base de la API
  static readonly API_BASE_URL = 'api';

  // Endpoints específicos
  static readonly USERS = `${Environment.API_BASE_URL}/users/obtener/`;
  static readonly ROLES = `${Environment.API_BASE_URL}/roles/`;
  static readonly GUIAS = `${Environment.API_BASE_URL}/guias/`;

  // Endpoints de obtener planillas 
  static readonly INFO_GUIAS = `${Environment.API_BASE_URL}/gestionGuias/obtener-planilla-detalles/`;
  static readonly DETAILS_GUIDE = `${Environment.API_BASE_URL}/planilla-detalle/obtener-detalle-guia`;

  // Crear registro de consignaciones
  static readonly SEND_CONSIGNACIONES = `${Environment.API_BASE_URL}/consignaciones/crear/`;
  static readonly GET_ALL_CONSIGNACIONES  = `${Environment.API_BASE_URL}/consignaciones/obtener-consignaciones/`;
  static readonly GET_GROUP_PARAMETROS  = `${Environment.API_BASE_URL}/consignaciones/group-paramtros/`;
  static readonly DELETE_CONSIGNACIONES = `${Environment.API_BASE_URL}/consignaciones/eliminar`;
  static readonly VIEW_IMAGE_AZURE = `${Environment.API_BASE_URL}/consignaciones/public-azure/`;
  static readonly TOTALS_STATIC_GUIDE =  `${Environment.API_BASE_URL}/planilla-detalle/obtener-total-guias/`;
  
}
