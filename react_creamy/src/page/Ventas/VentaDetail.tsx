import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { DetalleVenta } from '../../types/DetalleVenta';
import { toast } from 'react-hot-toast';

interface VentaDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  ventaId: number;
}
const VentaDetails: React.FC<{ id: number; onClose: () => void }> = ({ id, onClose }) => {
  const [venta, setVenta] = useState<DetalleVenta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentaDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get<DetalleVenta>(`/ventas/${id}`);
        setVenta(response.data);
      } catch (error) {
        setError('Error al obtener los detalles de la venta');
        toast.error('Error al obtener los detalles de la venta');
      } finally {
        setLoading(false);
      }
    };

    fetchVentaDetails();
  }, [id]);

  if (loading) {
    return <div className="tw-p-4 tw-text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="tw-p-4 tw-text-center tw-text-red-600">{error}</div>;
  }

  if (!venta) {
    return <div className="tw-p-4 tw-text-center">No se encontraron detalles de la venta.</div>;
  }

  const productos = venta.Productos || [];

  return (
    <div className="tw-p-6 tw-bg-white tw-rounded-lg tw-shadow-lg tw-max-w-3xl tw-mx-auto tw-space-y-4">
      
      <div className="tw-text-lg tw-font-semibold">Detalles de la Venta</div>
      <div className="tw-bg-gray-100 tw-p-4 tw-rounded-lg tw-shadow-sm">
        <div className="tw-text-sm tw-font-medium tw-text-gray-700">
          <strong>Cliente:</strong> {venta.Cliente?.nombre || 'N/A'}
        </div>
        <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
          <strong>Productos:</strong>
          <ul className="tw-list-disc tw-ml-5 tw-mt-2">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <li key={producto.ID_producto} className="tw-mb-1">
                  {producto.descripcion} - {producto.Producto_Ventas.cantidad} unidades - ${producto.Producto_Ventas.precio}
                </li>
              ))
            ) : (
              <li className="tw-text-gray-500">No hay productos asociados a esta venta</li>
            )}
          </ul>
        </div>
        <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
          <strong>Estado de Venta:</strong> {venta.Estado_venta?.descripcion || 'N/A'}
        </div>
        <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
          <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}
        </div>
        <div className="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
          <strong>Precio Total:</strong> ${venta.precio_total}
        </div>
      </div>
    </div>
  );
};

export default VentaDetails;
