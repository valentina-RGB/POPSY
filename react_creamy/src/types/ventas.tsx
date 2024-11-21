interface Venta {
  ID_venta: number;
  fecha: string; // ISO string para fechas
  cliente: string | null;
  precio_total: number | null;
  ID_estado_venta: number;
  ProductosLista?: Producto[]; // Relación con productos
}

interface Producto {
  ID_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface VentasProps {
  ventas: Venta[]; // Lista de ventas para mostrar
}