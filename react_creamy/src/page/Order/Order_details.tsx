import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Package, DollarSign } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Insumo {
  ID_insumo: number;
  descripcion_insumo: string;
  precio: number;
  Adiciones_Insumos: {
    cantidad: number;
    sub_total: number;
  };
}

interface Adicion {
  cantidad: number;
  total: number;
  Insumos: Insumo[];
}

interface Producto {
  ID_producto: number;
  nombre: string;
  precio_neto: number;
  Producto_Pedido: {
    cantidad: number;
    sub_total: number;
  }[];
  Adiciones?: Adicion[];
}

interface Order {
  ID_pedido: number;
  fecha: Date;
  precio_total: number;
  ID_estado_pedido: number;
  ProductosLista: Producto[];
}

const PedidoDetalles = () => {
  // Obtener el parámetro 'id' de la URL
  const { id } = useParams<{ id: string }>();

  // Si no se encuentra el id, mostrar un mensaje de error
  if (!id) {
    return <div>Error: El ID del pedido es necesario.</div>;
  }

  return <OrderDetail orderId={id} />;
};

const OrderDetail = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState<Order>({
    ID_pedido: 0,
    fecha: new Date(),
    precio_total: 0,
    ID_estado_pedido: 1,
    ProductosLista: [],
  });
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price = 0) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  const getOrderStatus = (statusId: number) => {
    const statuses: { [key: number]: { label: string; color: string } } = {
      1: { label: 'Pendiente', color: 'bg-yellow-500' },
      2: { label: 'En Proceso', color: 'bg-blue-500' },
      3: { label: 'Completado', color: 'bg-green-500' },
      4: { label: 'Cancelado', color: 'bg-red-500' },
    };
    return statuses[statusId as keyof typeof statuses] || { label: 'Desconocido', color: 'bg-gray-500' };
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3300/pedidos/${orderId}`);
        const orderData = response.data;

        // Convertir fecha a Date si es necesario
        orderData.fecha = new Date(orderData.fecha);

        setOrder(orderData);
        setError(null);
      } catch (error) {
        console.error('Error al obtener el pedido:', error);
        setError('Error al cargar el pedido. Inténtalo más tarde.');
      }
    };

    fetchOrder();
  }, [orderId]);

  const status = getOrderStatus(order.ID_estado_pedido);
  const productos = order.ProductosLista || [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Pedido #{order.ID_pedido}
            </CardTitle>
            <Badge className={`${status.color} text-white`}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha del pedido</p>
                <p className="font-medium">{formatDate(order.fecha.toString())}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total productos</p>
                <p className="font-medium">{productos.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total pedido</p>
                <p className="font-medium">{formatPrice(order.precio_total)}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Producto</th>
                  <th className="text-right py-3 px-4 font-semibold">Precio unitario</th>
                  <th className="text-right py-3 px-4 font-semibold">Cantidad</th>
                  <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                  <th className="text-right py-3 px-4 font-semibold">Adiciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.ID_producto} className="border-b">
                    <td className="py-3 px-4 font-medium">{producto.nombre}</td>
                    <td className="text-right py-3 px-4">{formatPrice(producto.precio_neto)}</td>
                    <td className="text-right py-3 px-4">{producto.Producto_Pedido[0]?.cantidad}</td>
                    <td className="text-right py-3 px-4">{formatPrice(producto.Producto_Pedido[0]?.sub_total)}</td>
                    <td className="text-right py-3 px-4">
                      {producto.Adiciones?.map((adicion, index) => (
                        <div key={index}>
                          <div>
                            <strong>{formatPrice(adicion.total)}</strong> (Insumos: {adicion.Insumos.length})
                          </div>
                          <ul>
                            {adicion.Insumos.map((insumo) => (
                              <li key={insumo.ID_insumo}>
                                {insumo.descripcion_insumo}: {formatPrice(insumo.Adiciones_Insumos.sub_total)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatPrice(order.precio_total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PedidoDetalles;
