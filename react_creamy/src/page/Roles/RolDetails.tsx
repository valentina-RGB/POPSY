import React, { useEffect, useState } from 'react';
import api from '../../api/api';

interface RolDetailsProps {
  id: number;
  onClose: () => void;
}

interface Rol {
  ID_insumo: number;
  descripcion: string;
  permisos: string;
}

const RolDetails: React.FC<RolDetailsProps> = ({ id, onClose }) => {
  const [rol, setRol] = useState<Rol | null>(null);

  useEffect(() => {
    const fetchRolDetails = async () => {
      try {
        const response = await api.get(`/roles/${id}/detalle`);
        setRol(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del rol:', error);
      }
    };

    fetchRolDetails();
  }, [id]);

  if (!rol) {
    return <div className="tw-text-center tw-text-gray-600">Cargando detalles...</div>;
  }

  return (
    <div className="tw-p-0 tw-flex tw-items-center tw-justify-center">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl  tw-w-full tw-max-w-md">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-5 tw-text-gray-800">Detalles del rol</h2>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Nombre:</span>
          <span className="tw-text-gray-900">{rol.descripcion}</span>
        </div>
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <span className="tw-text-gray-600">Stock Actual:</span>
          <span className="tw-text-gray-900">{rol.permisos}</span>
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

export default RolDetails;
