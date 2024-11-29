export interface Insumo {

  

    ID_insumo: number;

    descripcion_insumo: string;

    estado_insumo: string;

    precio: number;

    cantidad: number;

    stock?: {

      stock_actual: number;

    };

    tipo_insumo?: {

      descripcion_tipo_insumo: string;

    };

  }