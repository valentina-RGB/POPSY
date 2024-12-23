import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Insumo } from '../../types/insumos';
import { toast } from 'react-hot-toast';

interface EditInsumoProps {
  id: number;
  onClose: () => void;
}

const EditInsumo: React.FC<EditInsumoProps> = ({ id, onClose }) => {
  const [insumo, setInsumo] = useState<Insumo | null>(null);
  const [descripcionInsumo, setDescripcionInsumo] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [tipoInsumo, setTipoInsumo] = useState<number | string>('');
  const [tiposInsumo, setTiposInsumo] = useState<Array<{ ID_tipo_insumo: number, descripcion_tipo: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [stockMin, setStockMin] = useState<number | string>('0');
const [stockMax, setStockMax] = useState<number | string>('0');
const [isStockDisabled, setIsStockDisabled] = useState(false);
  const [isPrecioDisabled, setIsPrecioDisabled] = useState(false); // Estado para controlar si el precio está desactivado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await api.get(`/insumos/${id}`);
        setInsumo(response.data);
        setDescripcionInsumo(response.data.descripcion_insumo);
        setPrecio(response.data.precio);
        setTipoInsumo(response.data.ID_tipo_insumo);
  
        // Verificar si stock existe antes de acceder a sus propiedades
        if (response.data.stock) {
          setStockMin(response.data.stock.stock_min || '0'); // Valor predeterminado en caso de null/undefined
          setStockMax(response.data.stock.stock_max || '0');
        } else {
          setStockMin('0');
          setStockMax('0');
        }
  
        // Controlar la desactivación de campos según el tipo de insumo
        if (response.data.ID_tipo_insumo === 2) {
          setIsPrecioDisabled(true);
          setIsStockDisabled(true);
        }
      } catch (error) {
        console.error('Error al obtener el insumo:', error);
        setError('Error al cargar el insumo.');
      }
    };
  
    const fetchTiposInsumo = async () => {
      try {
        const response = await api.get('/tipoInsumos');
        setTiposInsumo(response.data);
      } catch (error) {
        console.error('Error al obtener los tipos de insumo:', error);
        setError('Error al cargar los tipos de insumos.');
      }
    };
  
    if (id) {
      fetchInsumo();
      fetchTiposInsumo();
    }
  }, [id]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!descripcionInsumo || !precio || !tipoInsumo) {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    const confirmEdit = await toast.promise(
      new Promise((resolve, reject) => {
        toast((t) => (
          <span>
            ¿Estás seguro de que quieres actualizar este insumo?
            <div className="tw-mt-4 tw-flex tw-justify-center">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="tw-mr-2 tw-bg-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
              >
                Sí
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  reject(false);
                }}
                className="tw-bg-red-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
              >
                No
              </button>
            </div>
          </span>
        ), {
          duration: Infinity,
        });
      }),
      {
        loading: 'Esperando confirmación...',
        success: 'Insumo actualizado correctamente!',
        error: 'Actualización cancelada',
      }
    );
  
    if (!confirmEdit) return;
  
    try {
      const payload = {
        descripcion_insumo: descripcionInsumo,
        ID_tipo_insumo: Number(tipoInsumo),
        precio: isPrecioDisabled ? 0 : Number(precio),
        stock: {
          stock_min: isStockDisabled ? 0 : Number(stockMin),
          stock_max: isStockDisabled ? 0 : Number(stockMax),
        }
      };
  
      await api.put(`/insumos/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      toast.success('El insumo se ha actualizado correctamente.');
      onClose();
      navigate('/Insumos');
    } catch (error: any) {
      console.error('Error al editar el insumo:', error.response?.data || error.message);
      toast.error(`No se pudo actualizar el insumo. Error: ${error.response?.data?.message || error.message}`);
    }
  };
  if (!insumo) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-6 tw-text-gray-800">Editar Insumo</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="descripcion" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
              Descripción del Insumo*
            </label>
            <input
              id="descripcion"
              type="text"
              value={descripcionInsumo}
              onChange={(e) => setDescripcionInsumo(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              placeholder="Descripción del insumo"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="precio" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Precio*</label>
            <input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              placeholder="Precio del insumo"
              required
              disabled={isPrecioDisabled} // Desactiva el campo si el tipo de insumo es 2
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="tipoInsumo" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">Tipo de Insumo*</label>
            <select
              id="tipoInsumo"
              value={tipoInsumo}
              onChange={(e) => {
                setTipoInsumo(e.target.value);
                if (e.target.value === '2') {
                  setIsPrecioDisabled(true); // Desactiva el campo de precio si el tipo es 2
                } else {
                  setIsPrecioDisabled(false);
                }
              }}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
            >
              <option value="" disabled>Selecciona un tipo de insumo</option>
              {tiposInsumo.length > 0 ? (
                tiposInsumo.map(tipo => (
                  <option key={tipo.ID_tipo_insumo} value={tipo.ID_tipo_insumo}>
                    {tipo.descripcion_tipo}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay tipos de insumo disponibles</option>
              )}
            </select>
          </div>
          <div className="tw-mb-4">
  <label htmlFor="stockMin" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
    Stock Mínimo
  </label>
  <input
    id="stockMin"
    type="number"
    value={stockMin}
    onChange={(e) => setStockMin(e.target.value)}
    className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-transition"
    placeholder="Stock mínimo"
    disabled={isStockDisabled}
  />
</div>
<div className="tw-mb-4">
  <label htmlFor="stockMax" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
    Stock Máximo
  </label>
  <input
    id="stockMax"
    type="number"
    value={stockMax}
    onChange={(e) => setStockMax(e.target.value)}
    className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
    placeholder="Stock máximo"
    disabled={isStockDisabled}
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
              className="tw-mr-4 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-lg hover:tw-bg-green-600 tw-transition"
            >
              Actualizar Insumo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInsumo;
