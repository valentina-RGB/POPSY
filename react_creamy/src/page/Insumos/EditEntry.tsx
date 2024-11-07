import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

interface EditEntryProps {
  id: number;  // ID de la entrada a editar
  onClose: () => void;  // Función para cerrar el modal
}

const EditEntry: React.FC<EditEntryProps> = ({ id, onClose }) => {
  const [cantidad, setCantidad] = useState<string>('');
  
  useEffect(() => {
    const fetchEntrada = async () => {
      try {
        const response = await api.get(`/historial_entradas/${id}`);
        setCantidad(response.data.cantidad);
      } catch (error) {
        console.error('Error al obtener la entrada:', error);
      }
    };

    fetchEntrada();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cantidadNumerica = Number(cantidad);
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      toast.error('Por favor ingrese una cantidad válida.');
      return;
    }

    try {
      await api.put(`/historial_entradas/${id}`, { cantidad: cantidadNumerica });
      onClose();  // Cierra el modal
      toast.success('La entrada ha sido actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la entrada:', error);
      toast.error('No se pudo actualizar la entrada.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tw-p-4">
      <h2 className="tw-text-lg tw-font-bold">Editar Entrada</h2>

      <label className="tw-block tw-mt-4">
        Cantidad:
        <input
          type="text"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="tw-w-full tw-mt-2 tw-p-2 tw-border tw-border-gray-300 tw-rounded"
        />
      </label>

      <div className="tw-flex tw-justify-end tw-mt-4">
        <button
          type="submit"
          className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={onClose}
          className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition-all tw-duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditEntry;
