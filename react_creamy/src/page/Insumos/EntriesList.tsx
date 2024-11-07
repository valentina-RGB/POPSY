import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { HistorialEntrada } from '../../types/historialEntradas';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import EditEntry from './EditEntry'; // Asegúrate de tener este componente
import DeleteEntry from './DeleteEntry'; // Asegúrate de tener este componente
import Skeleton from '@mui/material/Skeleton';


Modal.setAppElement('#root');

const EntriesList: React.FC = () => {
  const [entries, setEntries] = useState<HistorialEntrada[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Efecto para obtener las entradas del historial
  useEffect(() => {
    fetchEntries();
  }, []);
  const [loading, setLoading] = useState(true);

  // Función que realiza la petición a la API
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/historial_entradas'); // Asegúrate de que la URL sea correcta
      if (response && response.data) {
        setEntries(response.data);
      } else {
        console.error('Respuesta inválida de la API:', response);
      }
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (id: number) => {
    setSelectedEntryId(id);
    setModalType('edit');
    setIsModalOpen(true);
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (id: number) => {
    setSelectedEntryId(id);
    setModalType('delete');
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedEntryId(null);
  };

  // Función para actualizar la lista después de editar o eliminar
  const handleModalCloseAndFetch = async () => {
    handleCloseModal();
    await fetchEntries(); // Actualiza la lista después de agregar/editar/eliminar
  };

  // Función para manejar la eliminación de una entrada
  const handleDeleteEntry = async (id: number) => {
    try {
      await api.delete(`/historial_entradas/${id}`); 
      await fetchEntries(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
    }
  };

  // Definición de las columnas
  const columns = useMemo<MRT_ColumnDef<HistorialEntrada>[]>(
    () => [
      {
        accessorKey: 'ID_insumo',
        header: 'ID Insumo',
      },
      {
        accessorFn: (row) => row.Insumo?.descripcion_insumo || 'N/A',  // Acceso a la descripción dentro del objeto "Insumo"
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
              onClick={() => handleEdit(row.original.ID_entrada)}
              className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faEdit} title="Editar" />
            </button>

            {/* Botón para eliminar */}
            <button
              onClick={() => handleDelete(row.original.ID_entrada)}
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
    <section className="mb-3 mb-lg-5 pt-5">
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
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
          {/* Aquí usas el Skeleton para el título */}
          <Skeleton className="h-6 w-52" />
          
          {/* Usas Skeleton para los diferentes campos que imitarán las filas de la tabla */}
          <Skeleton className="h-4 w-48 mt-6" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-64 mt-4" />
          <Skeleton className="h-4 w-4/5 mt-4" />
        </div>
      ) : (
        <MaterialReactTable columns={columns} data={entries} />
      )}
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
        {modalType === 'edit' && selectedEntryId !== null && <EditEntry id={selectedEntryId} onClose={handleModalCloseAndFetch} />}
        {modalType === 'delete' && selectedEntryId !== null && (
          <DeleteEntry 
            id={selectedEntryId} 
            onClose={handleCloseModal} 
            onDelete={handleDeleteEntry} 
          />
        )}
      </Modal>
    </div>
    </section>
  );
};

export default EntriesList;
