import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CreateInsumoProps {
  onClose: () => void;
}

const CreateInsumo: React.FC<CreateInsumoProps> = ({ onClose }) => {
  const [descripcionInsumo, setDescripcionInsumo] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [tipoInsumo, setTipoInsumo] = useState<number | string>('');
  const [stockMin, setStockMin] = useState<number | string>('0');
  const [stockMax, setStockMax] = useState<number | string>('0');
  const [tiposInsumo, setTiposInsumo] = useState<
    Array<{ ID_tipo_insumo: number; descripcion_tipo: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isStockDisabled, setIsStockDisabled] = useState(false);
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

  useEffect(() => {
    if (tipoInsumo === '2') {
      setIsStockDisabled(true);
      setStockMin('0');
      setStockMax('0');
      setPrecio(0);
    } else {
      setIsStockDisabled(false);
    }
  }, [tipoInsumo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcionInsumo || (!precio && tipoInsumo !== '2') || !tipoInsumo) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const precioFinal = tipoInsumo === '2' ? 0 : Number(precio);

      await api.post('/insumos', {
        descripcion_insumo: descripcionInsumo,
        precio: precioFinal,
        ID_tipo_insumo: Number(tipoInsumo),
        estado_insumo: 'A', // Estado predeterminado
        stock: {
          stock_min: Number(stockMin),
          stock_max: Number(stockMax),
          stock_actual: 0,
        },
      });
      toast.success('Insumo agregado correctamente.');
      onClose(); // Cierra el modal
    } catch (error: any) {
      console.error('Error al agregar el insumo:', error);
      setError(
        'Error al agregar el insumo: ' +
        (error.response?.data?.message || 'Error desconocido')
      );
      toast.error('Hubo un problema al agregar el insumo.');
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-4 tw-text-gray-800">
          Agregar Insumo
        </h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label
              htmlFor="descripcion"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-600"
            >
              Descripción del Insumo*
            </label>
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
            <label
              htmlFor="precio"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-600"
            >
              Precio*
            </label>
            <input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => {
                if (tipoInsumo !== '2') {
                  setPrecio(e.target.value);
                }
              }}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              placeholder="Precio del insumo"
              required
              disabled={tipoInsumo === '2'} // Desactiva el campo si tipoInsumo es 2
            />

          </div>
          <div className="tw-mb-4">
            <label
              htmlFor="tipoInsumo"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-600"
            >
              Tipo de Insumo*
            </label>
            <select
              id="tipoInsumo"
              value={tipoInsumo}
              onChange={(e) => setTipoInsumo(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
            >
              <option value="" disabled>
                Selecciona un tipo de insumo
              </option>
              {tiposInsumo.map((tipo) => (
                <option
                  key={tipo.ID_tipo_insumo}
                  value={tipo.ID_tipo_insumo}
                >
                  {tipo.descripcion_tipo}
                </option>
              ))}
            </select>
          </div>
          {tipoInsumo === '2' && (
            <p className="tw-text-yellow-600 tw-text-sm tw-mb-4">
              Este tipo de insumo no requiere stock mínimo ni máximo.
            </p>
          )}
          <div className="tw-mb-4">
            <label
              htmlFor="stockMin"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-600"
            >
              Stock Mínimo
            </label>
            <input
              id="stockMin"
              type="number"
              value={stockMin}
              onChange={(e) => setStockMin(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-transition"
              placeholder="Stock mínimo"
              required
              disabled={isStockDisabled}
            />
          </div>
          <div className="tw-mb-4">
            <label
              htmlFor="stockMax"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-600"
            >
              Stock Máximo
            </label>
            <input
              id="stockMax"
              type="number"
              value={stockMax}
              onChange={(e) => setStockMax(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              placeholder="Stock máximo"
              required
              disabled={isStockDisabled}
            />
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
