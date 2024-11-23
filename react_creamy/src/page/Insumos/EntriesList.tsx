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
import { motion, AnimatePresence } from 'framer-motion';

const tableStyles = {
  '& .MuiTableHead-root': {
    backgroundColor: '#f0f4f8',
    borderBottom: '2px solid #2c3e50',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(44, 62, 80, 0.05)',
    transition: 'background-color 0.3s ease',
  },
  '& .MuiTableCell-root': {
    fontFamily: "'Inter', sans-serif",
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
  }
};

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

  // Definición de las columnas
  const columns = useMemo<MRT_ColumnDef<HistorialEntrada>[]>( 
    () => [
      {
        accessorKey: 'ID_insumo',
        header: 'ID Insumo',
        Cell: ({ cell }) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="tw-font-semibold tw-text-gray-800"
          >
            {cell.getValue<number>()}
          </motion.div>
        ),
      },
      {
        accessorFn: (row) => row.Insumo?.descripcion_insumo || 'N/A',
        id: 'descripcion_insumo',
        header: 'Descripción del Insumo',
        Cell: ({ cell }) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="tw-font-semibold tw-text-gray-800"
          >
            {cell.getValue<string>()}
          </motion.div>
        ),
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        Cell: ({ cell }) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="tw-font-semibold tw-text-gray-800"
          >
            {cell.getValue<number>()}
          </motion.div>
        ),
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
            
          
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit(row.original.ID_entrada)}
              className="tw-group tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon 
          icon={faEdit} 
          className="tw-transition-transform tw-group-hover:tw-rotate-12"
          title="Editar" 
        />

            </motion.button>

            {/* Botón para eliminar */}
              {/* Botón para eliminar */}
              <motion.button
        whileHover={{ 
          scale: 1.1, 
          rotate: -5,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleDeleteEntry(row.original.ID_entrada)}
        className="tw-group tw-bg-red-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400 focus:tw-ring-opacity-75"
      >
        <FontAwesomeIcon 
          icon={faTrash} 
          className="tw-transition-transform tw-group-hover:tw-rotate-6"
          title="Eliminar" 
        />
      </motion.button>
          </div>
        ),
      }
    ],
    [entries],
  );

  return (
    <motion.section 
    transition={{ duration: 0.5 }}
    className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5"
  >
      <motion.div 
        className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6"
      >
      <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">Historial de Entradas</h1>
      <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-1 tw-flex tw-space-x-4"
        ></motion.div>

      {/* Botón para volver a la página de insumos */}
      <button
        onClick={() => navigate('/insumos')}
        className="tw-mb-6 tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded-full hover:tw-bg-blue-600 tw-transition"
      >
        Volver a Insumos
      </button>

       {/* Skeleton Loader cuando loading es true */}
       {loading ? (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tw-space-y-4"
            >
              {[...Array(5)].map((_, index) => (
                <Skeleton 
                  key={index} 
                  variant="rectangular" 
                  width="100%" 
                  height={60} 
                  sx={{ borderRadius: '12px' }} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <MaterialReactTable 
            columns={columns} 
            data={entries}
            muiTablePaperProps={{
              sx: tableStyles
            }}
            
            enableColumnOrdering
            enableGlobalFilter
            positionToolbarAlertBanner="bottom"
            // Optional: Add row hover and click animations
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }
            })}
          />
        )}
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
        {modalType === 'edit' && selectedEntryId !== null && <EditEntry id={selectedEntryId} onClose={handleModalCloseAndFetch} />}
        
      </Modal>
    </motion.div>
    </motion.section>
  );
};

export default EntriesList;
