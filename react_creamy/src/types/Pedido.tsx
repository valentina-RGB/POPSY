// export interface Pedido {
//     ID_pedido: number;
//     fecha:Date;
//     ID_clientes: number;
//     precio_total: string;
//     ID_estado_pedido: number;
// }


type Insumo = {
    ID_insumo: number;
    descripcion_insumo: string;
    precio: number;
    Adiciones_Insumos: {
      cantidad: number;
      sub_total: number;
    };
  };
  
  
  type Adicion = {
    cantidad: number;
    total: number;
    Insumos: Insumo[];
  };
  
  type ProductoPedido = {
    ID_producto_pedido: number;
    ID_pedido: number;
    ID_producto: number;
    cantidad: number;
    precio_neto: number;
    sub_total: number;
    Adiciones: Adicion[];
  };
  
  type Producto = {
    ID_producto: number;
    nombre: string;
    precio_neto: number;
    Producto_Pedido: ProductoPedido[];
  };
  
export interface Pedido  {
    ID_pedido: number;
    fecha: string;
    precio_total: number;
    ID_estado_pedido: number;
    ProductosLista: Producto[];
  }