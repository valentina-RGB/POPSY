import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  IceCream,
  Cone,
  X,
  Tag
} from "lucide-react";

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

type ProductoVenta = {
  ID_producto_venta: number;
  ID_venta: number;
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
  Producto_Venta: ProductoVenta[];
};

type Venta = {
  ID_venta: number;
  fecha: string;
  precio_total: number;
  ID_estado_venta: number;
  ProductosLista: Producto[];
};

const Ventas_Detalles = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://creamy-soft.onrender.com/ventas/${id}`);
        setVenta(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("No pudimos cargar los detalles de tu orden de helados");
        setIsLoading(false);
      }
    };

    fetchVenta();
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
    return (
      <div className="tw-text-center tw-mt-6 tw-flex tw-justify-center tw-items-center tw-space-x-2">
        <IceCream className="animate-pulse text-pink-400" />
        <span className="tw-text-gray-600">Cargando tu orden de helados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-mt-6 tw-bg-red-50 tw-p-4 tw-rounded-lg">
        <X className="tw-mx-auto tw-text-red-500 tw-mb-2" />
        <p className="tw-text-red-800">{error}</p>
      </div>
    );
  }




  return (
    <div className="tw-max-w-4xl tw-mx-auto tw-p-6 tw-min-h-screen tw-flex tw-flex-col">
      <div className="tw-bg-white tw-shadow-2xl tw-rounded-3xl tw-p-8 tw-border-2 tw-border-pink-100">
        {/* Order Header */}
        <div className="tw-mb-6 tw-pb-4 tw-border-b-2 tw-border-pink-200">
        <div className="tw-flex tw-justify-between tw-items-center">
          <div className="tw-flex tw-items-center">
            <Cone className="tw-mr-3 tw-text-amber-500 tw-w-8 tw-h-8" />
            <h1 className="tw-text-3xl tw-font-bold tw-text-pink-700">
              Orden #{venta?.ID_venta}
            </h1>
          </div>
          <div className="tw-text-right">
            <p className="tw-text-gray-600">
              Fecha: {new Date(venta!.fecha).toLocaleString("es-ES")}
            </p>
            <p className="tw-text-2xl tw-font-bold tw-text-pink-600">
              Total: {formatPrice(venta!.precio_total)}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="tw-space-y-4 tw-max-h-[60vh] tw-overflow-y-auto tw-pr-2 tw-scrollbar-thin tw-scrollbar-thumb-pink-300 tw-scrollbar-track-pink-50">
        <h2 className="tw-text-2xl tw-font-semibold tw-text-pink-700 tw-mb-4">
            Detalles de los Helados
          </h2>
          {venta?.ProductosLista.map((producto) => (
            <div
            key={producto.ID_producto}
            className="tw-bg-pink-100/50 tw-rounded-2xl tw-p-4 tw-hover:bg-pink-100/80 tw-transition-all"
          >
             <div
              className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer"
              onClick={() => toggleExpand(producto.ID_producto)}
            >
                <div>
                <h3 className="tw-text-xl tw-font-bold tw-text-pink-800 tw-flex tw-items-center">
                  <IceCream className="tw-mr-2 tw-text-amber-500" />
                  {producto.nombre}
                </h3>
                <p className="tw-text-pink-600">
                  Precio unitario: {formatPrice(producto.precio_neto)}
                </p>
              </div>
              <Tag
                className={`tw-w-6 tw-h-6 ${
                  expandedProducts.includes(producto.ID_producto)
                    ? "tw-text-pink-600 tw-rotate-45"
                    : "tw-text-pink-400"
                } tw-transition-transform`}
              />
              </div>

              {/* Expanded Product Details */}
              {expandedProducts.includes(producto.ID_producto) && (
                <div className="mt-4 space-y-3 tw-transition-all tw-duration-300">
                  {producto.Producto_Venta.map((venta) => (
                    <div
                      key={venta.ID_producto_venta}
                      className="tw-bg-white tw-rounded-xl tw-p-4 tw-shadow-md tw-border tw-border-pink-200 tw-mb-4"
                      >
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                        <div className="tw-flex tw-items-center tw-space-x-2">
                          <Cone className="tw-text-amber-500" />
                          
                        </div>
                        <span className="tw-text-lg tw-font-bold tw-text-pink-600">
                          Subtotal: {formatPrice(venta.sub_total)}
                        </span>
                      </div>

                      {/* Additions */}
                      {venta.Adiciones.length > 0 && (
                        <div className="tw-mt-4 tw-pt-4 tw-border-t tw-border-pink-200">
                          <h4 className="tw-text-lg tw-font-semibold tw-text-pink-800 tw-mb-3">
                            Adiciones
                          </h4>
                          {venta.Adiciones.map((adicion, idx) => (
                            <div
                              key={idx}
                              className=" tw-rounded-lg tw-p-3 mb-3 tw-last:mb-0"
                            >
                              <div className="tw-flex tw-justify-between tw-items-center">
                               
                                <span className="tw-font-bold tw-text-pink-600">
                                  Total: {formatPrice(adicion.total)}
                                </span>
                              </div>

                              {/* Supplies/Ingredients */}
                              {adicion.Insumos.length > 0 && (
                                <div className="tw-mt-3">
                                  <h5 className="tw-text-pink-600 tw-font-medium tw-mb-2">
                                    Ingredientes Adicionales
                                  </h5>
                                  <div className="tw-overflow-x-auto">
                                    <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow-sm">
                                      <thead className="tw-bg-pink-100">
                                        <tr className="tw-text-pink-700">
                                          <th className="tw-p-2 text-left">Ingrediente</th>
                                          <th className="tw-p-2 text-right">Cantidad</th>
                                          <th className="tw-p-2 text-right">Precio</th>
                                          <th className="tw-p-2 text-right">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {adicion.Insumos.map((insumo) => (
                                          <tr
                                            key={insumo.ID_insumo}
                                            className="tw-border-t tw-border-pink-200 tw-hover:bg-pink-50"
                                          >
                                            <td className="tw-p-2 tw-text-pink-800">
                                              {insumo.descripcion_insumo}
                                            </td>
                                            <td className="tw-p-2 tw-text-right tw-text-pink-700">
                                              {insumo.Adiciones_Insumos.cantidad}
                                            </td>
                                            <td className="tw-p-2 tw-text-right tw-text-pink-700">
                                              {formatPrice(insumo.precio)}
                                            </td>
                                            <td className="tw-p-2 tw-text-right font-bold tw-text-pink-600">
                                              {formatPrice(insumo.Adiciones_Insumos.sub_total)}
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
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Ventas_Detalles;