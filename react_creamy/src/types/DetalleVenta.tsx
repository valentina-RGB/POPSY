// Ejemplo de la interfaz DetalleVenta
export interface DetalleVenta {
  ID_venta: number;
  fecha: string;
  ID_cliente: number;
  precio_total: number;
  ID_estado_venta: number;
  Cliente?: {
    ID_cliente: number;
    estado_cliente: string;
    correo_electronico: string;
    documento: number;
    nombre: string;
    direccion: string;
  };
  Productos?: Array<{
    ID_producto: number;
    descripcion: string;
    precio_neto: number;
    estado_producto: string;
    ID_tipo_productos: number;
    ID_categorias: number | null;
    imagen: string;
    Producto_Ventas: {
      cantidad: number;
      precio: number;
    };
  }>;
  Estado_venta?: {
    ID_estado_venta: number;
    descripcion: string;
    estado: string;
  };
}
