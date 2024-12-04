export const calculateStockStatus = (current: number, min: number, max: number): string => {
    if (current <= 0) return 'Agotado'; // Stock actual es 0 o menor
    if (current < min) return 'Crítico'; // Stock actual menor al mínimo
    if (current < max / 2) return 'Bajo'; // Stock actual menor a la mitad del máximo
    return 'Normal'; // Stock en nivel adecuado
  };

  // src/utils/calculateOrderTotal.ts

export const calculateOrderTotal = (productosAgregados: any[]): number => {
  return productosAgregados.reduce((sum, producto) => {
    // Calcular el total de todas las adiciones de este producto
    const totalAdiciones = producto.Producto_Pedido.reduce((accPedido: number, pedido: any) => {
      const subtotalAdiciones = pedido.Adiciones.reduce(
        (accAdicion: number, adicion: { total: number }) => accAdicion + adicion.total,
        0
      );
      return accPedido + subtotalAdiciones;
    }, 0);

    // Calcular el total del producto (precio * cantidad total del producto)
    const cantidadTotalProducto = producto.Producto_Pedido.reduce(
      (accCantidad: number, pedido: { cantidad: number }) => accCantidad + pedido.cantidad,
      0
    );
    const totalProducto = producto.precio_neto * cantidadTotalProducto;

    // Sumar total del producto y total de las adiciones
    return sum + totalProducto + totalAdiciones;
  }, 0);
};
