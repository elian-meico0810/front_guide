export interface card {
    Nombre: string;
    Grupo: string;
    Ruta: string;
    Origen: string;
    Descripcion: string;
    Icono: string;
  }
  
  export interface ApiResponse {
    statusCode: number;
    data: card[];  
    message: string;
    success: boolean;
  }