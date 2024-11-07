import React from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/api';

interface DeleteEntryProps {
  id: number;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

const DeleteEntry: React.FC<DeleteEntryProps> = ({ id, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(id);
      toast.success('Entrada eliminada con éxito');
      onClose();
    } catch (error) {
      toast.error('Error al eliminar la entrada');
      console.error('Error al eliminar la entrada:', error);
    }
  };

  return (
    <div className="tw-p-6">
      <h2 className="tw-text-xl">¿Estás seguro de que deseas eliminar esta entrada?</h2>
      <div className="tw-flex tw-justify-end tw-mt-4">
        <button
          onClick={handleDelete}
          className="tw-bg-red-500 tw-text-white tw-py-2 tw-px-4 tw-rounded mr-2 hover:tw-bg-red-600"
        >
          Eliminar
        </button>
        <button
          onClick={onClose}
          className="tw-bg-gray-500 tw-text-white tw-py-2 tw-px-4 tw-rounded hover:tw-bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteEntry;
