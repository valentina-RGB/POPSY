import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { HistorialEntrada } from '../../types/historialEntradas';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import EditEntry from './EditEntry'; // Asegúrate de tener este componente
import Skeleton from '@mui/material/Skeleton';

const EntriesList: React.FC = () => {
  const [entries, setEntries] = useState<HistorialEntrada[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efecto para obtener las entradas del historial
  useEffect(() => {
    fetchEntries();
  }, []);

  // Función que realiza la petición a la API
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/historial_entradas');
      if (response && response.data) {
        setEntries(response.data);
      } else {
        console.error('Respuesta inválida de la API:', response);
      }
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación de una entrada
  const handleDeleteEntry = (id: number) => {
    toast((t) => (
      <span>
        ¿Estás seguro de que deseas eliminar esta entrada?
        <div className="tw-mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id); // Cierra el toast
              toast.promise(
                api.delete(`/historial_entradas/${id}`), // Eliminar entrada
                {
                  loading: 'Eliminando entrada...',
                  success: '¡La entrada ha sido eliminada!',
                  error: 'Hubo un problema al eliminar la entrada.',
                }
              ).then(() => {
                fetchEntries(); // Actualiza la lista después de eliminar
              });
            }}
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Cierra el toast
            className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2"
          >
            Cancelar
          </button>
        </div>
      </span>
    ));
  };

  // Definición de las columnas
  const columns = useMemo<MRT_ColumnDef<HistorialEntrada>[]>( 
    () => [
      {
        accessorKey: 'ID_insumo',
        header: 'ID Insumo',
      },
      {
        accessorFn: (row) => row.Insumo?.descripcion_insumo || 'N/A',
        id: 'descripcion_insumo',
        header: 'Descripción del Insumo',
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        Cell: ({ cell }) => Math.floor(cell.getValue<number>()),  // Elimina los decimales
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha de Entrada',
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return date.toLocaleDateString();  // Formateo adecuado de la fecha
        },
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <div className="tw-flex tw-justify-center tw-gap-2">
            {/* Botón para editar */}
            <button
              onClick={() => navigate(`/editar-entrada/${row.original.ID_entrada}`)}
              className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faEdit} title="Editar" />
            </button>

            {/* Botón para eliminar */}
            <button
              onClick={() => handleDeleteEntry(row.original.ID_entrada)}
              className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faTrash} title="Eliminar" />
            </button>
          </div>
        ),
      }
    ],
    [entries],
  );

  return (
    <section className="tw-rounded-lg mb-3 mb-lg-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <h1 className="page-heading">Historial de Entradas</h1>

      {/* Botón para volver a la página de insumos */}
      <button
        onClick={() => navigate('/insumos')}
        className="tw-mb-4 tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded-full hover:tw-bg-blue-600 tw-transition"
      >
        Volver a Insumos
      </button>

       {/* Skeleton Loader cuando loading es true */}
       {loading ? (
        <div className="w-full max-w-md mx-auto p-9">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-48 mt-6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-64 mt-4" />
          <Skeleton className="h-4 w-4/5 mt-4" />
        </div>
      ) : (
        <MaterialReactTable columns={columns} data={entries} />
      )}
    </div>
    </section>
  );
};

export default EntriesList;
