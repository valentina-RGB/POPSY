import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import {ChevronDown, ChevronUp, Calendar,Package, DollarSign, ShoppingCart, Clock, Plus, } from "lucide-react";



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

type Pedido = {
  ID_pedido: number;
  fecha: string;
  precio_total: number;
  ID_estado_pedido: number;
  ProductosLista: Producto[];
};

const Pedidos_Detalles = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3300/pedidos/${id}`);
        setPedido(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Error al cargar los detalles del pedido");
        setIsLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.2,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100 
      }
    }
  };

  const toggleExpand = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  

  if (isLoading) {
    return <div className="text-center mt-6">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-500">{error}</div>;
  }

  const orderStatus: { [key: number]: { label: string; color: string; icon: React.ComponentType<{ className?: string }> } } = {
    1: { label: "Pendiente", color: "bg-amber-500", icon: Clock },
    2: { label: "En Proceso", color: "bg-blue-500", icon: ShoppingCart },
    3: { label: "Completado", color: "bg-green-500", icon: ShoppingCart },
    4: { label: "Cancelado", color: "bg-red-500", icon: ShoppingCart },
  };

  const status = orderStatus[pedido!.ID_estado_pedido];
  const StatusIcon = status.icon;

  return (
    <div className="tw-max-w-3xl tw-mx-auto tw-p-6 tw-space-y-8">
      {/* Contenedor principal */}
      <div className="tw-bg-white tw-p-6 tw-shadow-lg tw-rounded-2xl tw-border tw-border-gray-100">
        {/* Encabezado del pedido */}
        <div className="tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-6">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
            <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900">
              Pedido #{pedido?.ID_pedido}
            </h1>
            <Badge
              className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium tw-transition-all tw-duration-300 tw-ease-in-out tw-transform tw-hover:scale-105 ${status.color}`}
            >
              <StatusIcon className="tw-h-4 tw-w-4 tw-mr-1 tw-inline-block" />
              {status.label}
            </Badge>
          </div>
          <div className="tw-mt-4 tw-flex tw-justify-between tw-text-gray-600 tw-text-sm">
            <div className="tw-flex tw-items-center tw-space-x-2">
              <Calendar className="tw-h-4 tw-w-4 tw-text-gray-400" />
              <span className="tw-text-gray-700">{new Date(pedido!.fecha).toLocaleString("es-ES")}</span>
            </div>
            <div className="tw-flex tw-items-center tw-space-x-2">
              <DollarSign className="tw-h-4 tw-w-4 tw-text-gray-400" />
              <span className="tw-font-semibold tw-text-gray-800">{formatPrice(pedido!.precio_total)}</span>
            </div>
          </div>
        </div>
  
        {/* Productos */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4 tw-pl-1">Productos</h2>
          {pedido?.ProductosLista.map((producto) => (

            <motion.div
              key={producto.ID_producto}
              variants={itemVariants}
              className="tw-border tw-rounded-lg tw-p-4 tw-mb-4 tw-bg-gray-50 tw-hover:bg-gray-100 tw-transition-all tw-duration-300 tw-ease-in-out tw-group"
            >
               <div
                className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer tw-select-none"
                onClick={() => toggleExpand(producto.ID_producto)}
              >
                <div>
                  <h3 className="tw-font-bold tw-text-gray-800 tw-group-hover:text-blue-600 tw-transition-colors tw-duration-300">
                    {producto.nombre}
                  </h3>
                  <p className="tw-text-gray-500 tw-text-sm">
                    Precio unitario: {formatPrice(producto.precio_neto)}
                  </p>
                </div>
                {expandedProducts.includes(producto.ID_producto) ? (
                  <ChevronUp className="tw-h-5 tw-w-5 tw-text-gray-500 tw-group-hover:text-blue-600 tw-transition-colors tw-duration-300" />
                ) : (
                  <ChevronDown className="tw-h-5 tw-w-5 tw-text-gray-500 tw-group-hover:text-blue-600 tw-transition-colors tw-duration-300" />
                )}
              </div>
  
              {/* Detalles del producto */}
              {expandedProducts.includes(producto.ID_producto) && (
                <div className="tw-mt-4 tw-space-y-4 tw-animate-fade-in">
                  {producto.Producto_Pedido.map((pedido) => (
                    <div
                      key={pedido.ID_producto_pedido}
                      className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-shadow-sm"
                    >
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                        <p className="tw-text-gray-700">
                          <strong>Cantidad:</strong> {pedido.cantidad}
                        </p>
                        <p className="tw-text-gray-800 tw-font-semibold">
                          <strong>Subtotal:</strong>{" "}
                          {formatPrice(pedido.sub_total)}
                        </p>
                      </div>
  
                      {/* Adiciones */}
                      {pedido.Adiciones.length > 0 && (
                        <div className="tw-mt-4 tw-border-t tw-border-gray-200 tw-pt-4">
                          <h4 className="tw-font-semibold tw-text-gray-700 tw-mb-3">
                            Adiciones
                          </h4>
                          {pedido.Adiciones.map((adicion, idx) => (
                            <div
                              key={idx}
                              className="tw-border-b tw-border-gray-200 tw-pb-4 tw-mb-4 tw-last:border-b-0"
                            >
                              <div className="tw-flex tw-justify-between tw-items-center">
                                <p className="tw-text-gray-700">
                                  <strong>Cantidad:</strong> {adicion.cantidad}
                                </p>
                                <p className="tw-text-gray-800 tw-font-semibold">
                                  <strong>Total:</strong>{" "}
                                  {formatPrice(adicion.total)}
                                </p>
                              </div>
  
                              {/* Insumos */}
                              {adicion.Insumos.length > 0 && (
                                <div className="tw-mt-3">
                                  <h5 className="tw-text-gray-600 tw-text-sm tw-font-medium tw-mb-2">
                                    Insumos:
                                  </h5>
                                  <div className="tw-overflow-x-auto">
                                    <table className="tw-w-full tw-text-left tw-text-sm tw-border tw-border-gray-200 tw-rounded-lg tw-overflow-hidden">
                                      <thead className="tw-bg-gray-100">
                                        <tr className="tw-text-gray-600">
                                          <th className="tw-py-2 tw-px-3">Insumo</th>
                                          <th className="tw-py-2 tw-px-3">Cantidad</th>
                                          <th className="tw-py-2 tw-px-3">Precio</th>
                                          <th className="tw-py-2 tw-px-3">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {adicion.Insumos.map((insumo) => (
                                          <tr
                                            key={insumo.ID_insumo}
                                            className="tw-border-t tw-border-gray-200 tw-hover:bg-gray-50 tw-transition-colors"
                                          >
                                            <td className="tw-py-2 tw-px-3 tw-text-gray-800">
                                              {insumo.descripcion_insumo}
                                            </td>
                                            <td className="tw-py-2 tw-px-3 tw-text-gray-700">
                                              {insumo.Adiciones_Insumos.cantidad}
                                            </td>
                                            <td className="tw-py-2 tw-px-3 tw-text-gray-700">
                                              {formatPrice(insumo.precio)}
                                            </td>
                                            <td className="tw-py-2 tw-px-3 tw-text-gray-800 tw-font-semibold">
                                              {formatPrice(
                                                insumo.Adiciones_Insumos.sub_total
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
  
  
  
};

export default Pedidos_Detalles;
