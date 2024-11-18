import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Insumo } from '../../types/insumos';
import { toast } from 'react-hot-toast';

interface AddEntryProps {
  id: number;  
  onClose: () => void;  
}

const AddEntry: React.FC<AddEntryProps> = ({ id, onClose }) => {
  const [insumo, setInsumo] = useState<Insumo | null>(null);
  const [cantidad, setCantidad] = useState<string>('');  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await api.get(`/insumos/${id}`);
        setInsumo(response.data);
      } catch (error) {
        console.error('Error al obtener el insumo:', error);
      }
    };

    fetchInsumo();
  }, [id]);

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // Solo permite números enteros positivos
    if (/^\d*$/.test(valor)) {
      setCantidad(valor);
    } else {
      toast.error('Por favor ingrese solo números enteros.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convierte el valor a número
    const cantidadNumerica = Number(cantidad);
    
    // Validación para valores enteros y positivos
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0 || !Number.isInteger(cantidadNumerica)) {
      toast.error('Por favor ingrese una cantidad válida y sin decimales.');
      return;
    }

    const limiteMaximo = 120;
    if (cantidadNumerica > limiteMaximo) {
      toast.error(`La cantidad supera el límite máximo permitido de ${limiteMaximo}.`);
      return;
    }

    try {
      await api.post(`/insumos/${id}/entradas`, { cantidad: cantidadNumerica });
      onClose(); 
      toast.success('La entrada del insumo se ha agregado exitosamente.');
      navigate('/Insumos'); 
    } catch (error) {
      console.error('Error al agregar la entrada:', error);
      toast.error('No se pudo agregar la entrada del insumo. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-4 tw-text-gray-800">Agregar Entrada</h2>
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="cantidad" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Cantidad</label>
            <input
              id="cantidad"
              type="text"
              value={cantidad}
              onChange={handleCantidadChange} 
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-transition"
              placeholder="Ingrese una cantidad"
            />
          </div>
        
          <div className="tw-flex tw-justify-end">
            <button
              type="button"
              onClick={onClose}
              className="tw-mr-4 tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-300 tw-transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="tw-bg-green-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-green-600 tw-transition tw-font-semibold"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntry;
