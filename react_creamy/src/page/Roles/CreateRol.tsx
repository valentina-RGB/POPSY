import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CreateRolProps {
  onClose: () => void;
}

const AddRol: React.FC<CreateRolProps> = ({ onClose }) => {
  const [descripcionRol, setDescripcionRol] = useState('');
  const [permisos, setPermisos] = useState([]); // Para almacenar los permisos del API
  const [selectedPermisos, setSelectedPermisos] = useState<number[]>([]); // Permisos seleccionados
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Llamada a la API para obtener los permisos
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await api.get('/permiso');
        setPermisos(response.data); 
      } catch (error) {
        console.error('Error al obtener los permisos:', error);
        setError('No se pudieron cargar los permisos');
      }
    };

    fetchPermisos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcionRol || selectedPermisos.length === 0) {
      setError('Por favor, completa todos los campos y selecciona al menos un permiso.');
      return;
    }
    try {
      const rolToCreate = {
        descripcion: descripcionRol,
        estado_rol: 'D',
        ID_permisos: selectedPermisos, 
      }
      console.log(rolToCreate);
      await api.post('/roles', rolToCreate);
      toast.success('Rol agregado correctamente.');
      onClose(); // Cierra el modal y actualiza la lista
    } catch (error: any) {
      console.error('Error al agregar el rol:', error);
      setError('Error al agregar el rol: ' + (error.response?.data?.message || 'Error desconocido'));
      toast.error('Hubo un problema al agregar el rol.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-4 tw-text-gray-800">Agregar Rol</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="descripcion" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
              Descripción del Rol
            </label>
            <input
              id="descripcion"
              type="text"
              value={descripcionRol}
              onChange={(e) => setDescripcionRol(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-transition"
              placeholder="Descripción del rol"
              required
            />
          </div>

          <div className="tw-mb-4">
            <label htmlFor="Permiso" className="tw-block tw-text-sm tw-font-medium tw-text-gray-600">
              Tipo de Permiso
            </label>
            <div className="tw-mt-2">
              {permisos.length > 0 ? (
                permisos.map((permiso) => (
                  <div key={permiso.ID_permiso} className="tw-flex tw-items-center tw-mb-2">
                    <input
                      type="checkbox"
                      id={`permiso-${permiso.ID_permiso}`}
                      value={permiso.ID_permiso}
                      checked={selectedPermisos.includes(permiso.ID_permiso)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermisos([...selectedPermisos, permiso.ID_permiso]);
                        } else {
                          setSelectedPermisos(
                            selectedPermisos.filter(id => id !== permiso.ID_permiso)
                          );
                        }
                      }}
                      className="tw-h-4 tw-w-4 tw-text-blue-500 tw-border-gray-300 focus:tw-ring-blue-400"
                    />
                    <label htmlFor={`permiso-${permiso.ID_permiso}`} className="tw-ml-2 tw-text-sm tw-text-gray-700">
                      {permiso.descripcion}
                    </label>
                  </div>
                ))
              ) : (
                <p className="tw-text-gray-600">Cargando permisos...</p>
              )}
            </div>
          </div>

          <div className="tw-flex tw-justify-end">
            <button
              type="submit"
              className="tw-mr-4 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-lg hover:tw-bg-green-600 tw-transition"
            >
              Agregar Rol
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

export default AddRol;
