export interface Rol {
    ID_rol(ID_rol: any): void;
    // [x: string]: Key | null | undefined;

    id_rol: number;
    descripcion: string;
    estado_rol: string;
    permisos: string;
  }