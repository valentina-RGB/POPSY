import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const OrderDetail = () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 shadow-md rounded-md">
        {/* Encabezado del pedido */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Detalles del Pedido #{pedido?.ID_pedido}
            </h1>
            <Badge
              className={`${status.color} text-white py-1 px-4 rounded-lg flex items-center`}
            >
              <StatusIcon className="h-5 w-5 mr-2" />
              {status.label}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-500 h-5 w-5" />
              <p className="text-gray-500">
                Fecha: {new Date(pedido!.fecha).toLocaleString("es-ES")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-500 h-5 w-5" />
              <p className="text-gray-500">
                Total: {formatPrice(pedido!.precio_total)}
              </p>
            </div>
          </div>
        </div>
  
        {/* Sección de productos */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Productos</h2>
          {pedido?.ProductosLista.map((producto) => (
            <div
              key={producto.ID_producto}
              className="mb-4 border rounded-lg p-4 shadow-sm bg-gray-50"
            >
              {/* Información del producto */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(producto.ID_producto)}
              >
                <div>
                  <h3 className="font-semibold text-gray-700">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-500">
                    Precio unitario: {formatPrice(producto.precio_neto)}
                  </p>
                </div>
                {expandedProducts.includes(producto.ID_producto) ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>
  
              {/* Detalles del producto */}
              {expandedProducts.includes(producto.ID_producto) && (
                <div className="mt-4">
                  {producto.Producto_Pedido.map((pedido) => (
                    <div
                      key={pedido.ID_producto_pedido}
                      className="bg-white p-4 rounded-lg shadow-inner mb-4"
                    >
                      <p>
                        <strong>Cantidad:</strong> {pedido.cantidad}
                      </p>
                      <p>
                        <strong>Subtotal:</strong>{" "}
                        {formatPrice(pedido.sub_total)}
                      </p>
  
                      {/* Adiciones */}
                      {pedido.Adiciones.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Adiciones
                          </h4>
                          {pedido.Adiciones.map((adicion, idx) => (
                            <div
                              key={idx}
                              className="mb-4 border-t pt-4 border-gray-200"
                            >
                              <p>
                                <strong>Cantidad:</strong> {adicion.cantidad}
                              </p>
                              <p>
                                <strong>Total:</strong>{" "}
                                {formatPrice(adicion.total)}
                              </p>
  
                              {/* Insumos */}
                              {adicion.Insumos.length > 0 && (
                                <div className="mt-2">
                                  <h5 className="font-semibold text-gray-600">
                                    Insumos:
                                  </h5>
                                  <table className="w-full text-left mt-2 border-collapse border border-gray-200">
                                    <thead>
                                      <tr className="bg-gray-100 text-gray-700">
                                        <th className="p-2 border border-gray-200">
                                          Insumo
                                        </th>
                                        <th className="p-2 border border-gray-200">
                                          Cantidad
                                        </th>
                                        <th className="p-2 border border-gray-200">
                                          Precio
                                        </th>
                                        <th className="p-2 border border-gray-200">
                                          Subtotal
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {adicion.Insumos.map((insumo) => (
                                        <tr key={insumo.ID_insumo}>
                                          <td className="p-2 border border-gray-200">
                                            {insumo.descripcion_insumo}
                                          </td>
                                          <td className="p-2 border border-gray-200">
                                            {insumo.Adiciones_Insumos.cantidad}
                                          </td>
                                          <td className="p-2 border border-gray-200">
                                            {formatPrice(insumo.precio)}
                                          </td>
                                          <td className="p-2 border border-gray-200">
                                            {formatPrice(
                                              insumo.Adiciones_Insumos.sub_total
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default OrderDetail;
