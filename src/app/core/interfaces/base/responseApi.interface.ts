export interface ResponseAPI<T> {
    statusCode: string;
    data: T,
    message: string,
    success: boolean
}

export interface UserData {
    id: number,
    celular: string,
    area: string,
    cargo: string,
    ciudad: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    nombre: string,
    correo: string,
    estado: boolean,
    created_by: number,
    updated_by: number,
    deleted_by: number
}

export interface UserDataDirectorioActivo {
    id: string,
    Nombre: string,
    Correo: string,
    Usuario: string,
    Area: string,
    Cargo: string,
    Ubicación: string,
    Ciudad: string,
    País: string,
    Código_Empleado: string,
    Celular: string,
    Empresa: string,
    Jefe: string,
    Estado: Boolean,
    Foto: string
}





