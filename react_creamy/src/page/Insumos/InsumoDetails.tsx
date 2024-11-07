import React, { useEffect, useState } from 'react';
import api from '../../api/api';

interface InsumoDetailsProps {
  id: number;
  onClose: () => void;
}

interface Insumo {
  ID_insumo: number;
  descripcion_insumo: string;
  precio: number;
  estado_insumo: string;
  stock: {
    stock_actual: number;
    stock_min: number;
    stock_max: number;
  };
}

const InsumoDetails: React.FC<InsumoDetailsProps> = ({ id, onClose }) => {
  const [insumo, setInsumo] = useState<Insumo | null>(null);

  useEffect(() => {
    const fetchInsumoDetails = async () => {
      try {
        const response = await api.get(`/insumos/${id}/detalle`);
        setInsumo(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del insumo:', error);
      }
    };

    fetchInsumoDetails();
  }, [id]);

  if (!insumo) {
    return <div className="tw-text-center tw-text-gray-600">Cargando detalles...</div>;
  }

  return (
    <div className="tw-p-0 tw-flex tw-items-center tw-justify-center">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl  tw-w-full tw-max-w-md">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-5 tw-text-gray-800">Detalles del Insumo</h2>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Nombre:</span>
          <span className="tw-text-gray-900">{insumo.descripcion_insumo}</span>
        </div>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Precio:</span>
          <span className="tw-text-gray-900">${insumo.precio.toFixed(2)}</span>
        </div>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Estado:</span>
          <span className={`tw-font-semibold ${insumo.estado_insumo === 'A' ? 'tw-text-green-600' : 'tw-text-red-600'}`}>
            {insumo.estado_insumo === 'A' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Stock Actual:</span>
          <span className="tw-text-gray-900">{insumo.stock.stock_actual}</span>
        </div>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Stock Mínimo:</span>
          <span className="tw-text-gray-900">{insumo.stock.stock_min}</span>
        </div>
        <div className="tw-mb-6 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Stock Máximo:</span>
          <span className="tw-text-gray-900">{insumo.stock.stock_max}</span>
        </div>
        <div className="tw-flex tw-justify-end">
          <button
            onClick={onClose}
            className="tw-bg-gray-500 tw-text-white tw-rounded-lg tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsumoDetails;
