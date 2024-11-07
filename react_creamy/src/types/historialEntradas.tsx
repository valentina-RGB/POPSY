
export interface Insumo {
    descripcion_insumo: string;
  }
  
  export interface HistorialEntrada {
    ID_entrada: number;
    ID_insumo: number;
    cantidad: number;
    fecha: string;  
    Insumo: Insumo;  
  }