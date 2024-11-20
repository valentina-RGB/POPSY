import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Clock 
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type Addition = {
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
  Insumos: Addition[];
};

type ProductPedido = {
  ID_producto_pedido: number;
  ID_pedido: number;
  ID_producto: number;
  cantidad: number;
  precio_neto: number;
  sub_total: number;
  Adiciones?: Adicion[];
};

type Product = {
  ID_producto: number;
  nombre: string;
  precio_neto: number;
  Producto_Pedido: ProductPedido[];
};

type Order = {
  ID_pedido: number;
  fecha: string;
  ID_estado_pedido: number;
  precio_total: number;
  ProductosLista: Product[];
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3300/pedidos/${id}`);
        setOrder(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error as Error);
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
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
    const statuses = {
      1: { label: 'Pendiente', color: 'bg-amber-500', icon: Clock },
      2: { label: 'En Proceso', color: 'bg-blue-500', icon: ShoppingCart },
      3: { label: 'Completado', color: 'bg-green-500', icon: ShoppingCart },
      4: { label: 'Cancelado', color: 'bg-red-500', icon: ShoppingCart },
    };
    return statuses[statusId as keyof typeof statuses] || { label: 'Desconocido', color: 'bg-gray-500', icon: ShoppingCart };
  };

  const toggleProductExpand = (productId: number) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId as keyof typeof prev],
    }));
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
          className="text-2xl font-bold text-blue-500"
        >
          Cargando detalles del pedido...
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-red-500"
      >
        Error al cargar los detalles del pedido
      </motion.div>
    );
  }

  const status = getOrderStatus(order!.ID_estado_pedido);
  const StatusIcon = status.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4"
    >
      <Card className="shadow-lg">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-b flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Pedido #{order!.ID_pedido}</h2>
            <Badge 
              className={`${status.color} text-white flex items-center space-x-2`}
            >
              <StatusIcon className="h-4 w-4" />
              <span>{status.label}</span>
            </Badge>
          </div>
        </motion.div>

        <div className="p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            {[
              { icon: Calendar, label: 'Fecha del pedido', value: formatDate(order!.fecha) },
              { icon: Package, label: 'Total productos', value: order!.ProductosLista.length },
              { icon: DollarSign, label: 'Total pedido', value: formatPrice(order!.precio_total) }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
                className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg"
              >
                <item.icon className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {order?.ProductosLista && order.ProductosLista.length > 0 ? (
              order!.ProductosLista.map((producto: Product, index: number) => {
                const productoPedido = producto.Producto_Pedido;
                const isExpanded = expandedProducts[producto.ID_producto as keyof typeof expandedProducts];

                return (
                  <motion.div
                    key={producto.ID_producto}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    className="mb-4 border rounded-lg overflow-hidden"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => toggleProductExpand(producto.ID_producto)}
                    >
                      <div>
                        <h3 className="font-bold text-lg">{producto.nombre}</h3>
                        <p className="text-sm text-gray-500">
                          {productoPedido[0].cantidad} x {formatPrice(producto.precio_neto)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="mr-4 font-bold text-blue-600">
                          {formatPrice(productoPedido[0].sub_total)}
                        </p>
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-4 bg-gray-50 border-t"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Detalles del Producto</h4>
                              <p>Cantidad: {productoPedido[0].cantidad}</p>
                              <p>Subtotal: {formatPrice(productoPedido[0].sub_total)}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Adiciones</h4>
                              {/* Add similar logic for displaying additions */}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-4"
              >
                No hay productos en este pedido.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderDetail;