import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';  // Importa react-hot-toast

interface CreateInsumoProps {
  onClose: () => void;
}

const CreateInsumo: React.FC<CreateInsumoProps> = ({ onClose }) => {
  const [descripcionInsumo, setDescripcionInsumo] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [tipoInsumo, setTipoInsumo] = useState<number | string>('');
  const [tiposInsumo, setTiposInsumo] = useState<Array<{ ID_tipo_insumo: number, descripcion_tipo: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposInsumo = async () => {
      try {
        const response = await api.get('/tipoInsumos');
        setTiposInsumo(response.data);
      } catch (error) {
        console.error('Error fetching types of insumos:', error);
        setError('Error al cargar los tipos de insumos.');
      }
    };

    fetchTiposInsumo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcionInsumo || !precio || !tipoInsumo) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      await api.post('/insumos', {
        descripcion_insumo: descripcionInsumo,
        precio: Number(precio),
        ID_tipo_insumo: Number(tipoInsumo),
        estado_insumo: 'A' 
      });
      toast.success('Insumo agregado correctamente.');
      onClose(); 
    } catch (error: any) {
      console.error('Error al agregar el insumo:', error);
      setError('Error al agregar el insumo: ' + (error.response?.data?.message || 'Error desconocido'));
      toast.error('Hubo un problema al agregar el insumo.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-4 tw-text-gray-800">Agregar Insumo</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="descripcion" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Descripción del Insumo</label>
            <input
              id="descripcion"
              type="text"
              value={descripcionInsumo}
              onChange={(e) => setDescripcionInsumo(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-transition"
              placeholder="Descripción del insumo"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="precio" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Precio</label>
            <input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              placeholder="Precio del insumo"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="tipoInsumo" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Tipo de Insumo</label>
            <select
              id="tipoInsumo"
              value={tipoInsumo}
              onChange={(e) => setTipoInsumo(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
            >
              <option value="" disabled>Selecciona un tipo de insumo</option>
              {tiposInsumo.map(tipo => (
                <option key={tipo.ID_tipo_insumo} value={tipo.ID_tipo_insumo}>{tipo.descripcion_tipo}</option>
              ))}
            </select>
          </div>
          <div className="tw-flex tw-justify-end">
            <button
              type="submit"
              className="tw-mr-4 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-lg hover:tw-bg-green-600 tw-transition"
            >
              Agregar Insumo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-300 tw-transition"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInsumo;
