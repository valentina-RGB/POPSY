
import api from "../../api/api";


type Insumo_adicion = {
    ID_insumo: number;
    descripcion_insumo: string;
    ID_tipo_insumo: number;
    estado_insumo: string;
    precio: number;
    Adiciones_Insumos: {
      cantidad: number;
      total: number;
    };
  };

  type Producto = {
    ID_producto: number | null;
    nombre: string;
    cantidad: number;
    estado_productos:string;
    precio_neto: number;
    stock_bola: number;
    Producto_Pedido: {
        cantidad: number;
        sub_total: number;
      Adiciones: {
        id_adicion: number
        cantidad: number,
        total: number,
        Insumos: Insumo_adicion[]
      }[]
    }[]
  
  };


export const convertirPedido = async (id: number) => {
      try{
        const pedido = await api.get(`/pedidos/${id}`);	

        const data = pedido.data;
        const lista = {
            fecha: data.fecha,
            ID_clientes: 1,
            precio_total: Number(data.precio_total),
            ID_estado_venta: 1,
            ProductosLista: (data.ProductosLista || []).map((producto: Producto) => {
              return {
                ID_producto: producto.ID_producto,
                nombre: producto.nombre,
                cantidad: producto.Producto_Pedido?.reduce((acc, Producto_Venta) => acc + Producto_Venta.cantidad, 0) || 0,
                precio_neto: producto.precio_neto,
                estado_productos: "D",
                Producto_Venta: (producto.Producto_Pedido|| []).map((Producto_Venta) => ({
                  ...Producto_Venta,
                  cantidad: Producto_Venta.cantidad,
                  sub_total: Producto_Venta.sub_total,
                  Adiciones: ( Producto_Venta.Adiciones || []).map((adicion) => ({
                    cantidad: adicion.cantidad,
                    total: adicion.total,
                    Insumos: (adicion.Insumos || []).map((insumo) => ({
                      ID_insumo: insumo.ID_insumo,
                      descripcion_insumo: insumo.descripcion_insumo,
                      ID_tipo_insumo: insumo.ID_tipo_insumo,
                      estado_insumo: insumo.estado_insumo,
                      precio: insumo.precio,
                      Adiciones_Insumos: {
                        cantidad: insumo.Adiciones_Insumos?.cantidad || 0,
                        total: insumo.Adiciones_Insumos?.total || 0,
                      },
                    })),
                  })),
                })),
              };
            }),  
          };
          console.log('LISTA', lista );

          // CREAR VENTA
           await api.post(`/ventas`, lista);
      }catch(e){
        console.log('ERROR', e);
      }      
    }    