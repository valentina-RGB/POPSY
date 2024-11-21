import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Insumo } from '../../types/insumos';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faBoxOpen, faToggleOn, faToggleOff, faEye } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import AddInsumo from './CreateInsumo';
import EditInsumo from './EditInsumo';
import AddEntry from './AddEntry';
import InsumoDetails from './InsumoDetails';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

Modal.setAppElement('#root');

const InsumosList: React.FC = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'entry' | 'detail' | null>(null);
  const [selectedInsumoId, setSelectedInsumoId] = useState<number | null>(null);
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      const response = await api.get('/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleEdit = (id: number) => {
    setSelectedInsumoId(id);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    toast((t) => (
      <span>
        ¿Seguro que quieres eliminar este insumo?
        <div className="tw-mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.promise(
                api.delete(`/insumos/${id}`), // Promesa para eliminar el insumo
                {
                  loading: 'Eliminando insumo...',
                  success: '¡El insumo ha sido eliminado!',
                  error: 'Hubo un problema al eliminar el insumo.',
                }
              ).then(() => {
                fetchInsumos(); // Actualiza la lista después de eliminar
              });
            }}
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2"
          >
            Cancelar
          </button>
        </div>
      </span>
    ));
  };


  const handleToggleEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'A' ? 'D' : 'A';

    try {
      await api.put(`/insumos/${id}`, { estado_insumo: nuevoEstado });
      setInsumos(insumos.map(insumo =>
        insumo.ID_insumo === id ? { ...insumo, estado_insumo: nuevoEstado } : insumo
      ));
      toast.success('El estado del insumo ha sido actualizado.');
    } catch (error) {
      console.error('Error al cambiar el estado del insumo:', error);
      toast.error('Hubo un problema al cambiar el estado del insumo.');
    }
  };

  const handleAddInsumo = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleAddEntry = (id: number) => {
    setSelectedInsumoId(id);
    setModalType('entry');
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: number) => {
    setSelectedInsumoId(id);
    setModalType('detail');
    setIsModalOpen(true);
  };

  const handleGoToHistorial = (id: number) => {
    navigate(`/historial-entradas/${id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedInsumoId(null);
  };

  const handleModalCloseAndFetch = async () => {
    handleCloseModal();
    await fetchInsumos(); // Actualiza la lista después de agregar/editar entrada
  };

  const columns = useMemo<MRT_ColumnDef<Insumo>[]>(
    () => [
      {
        accessorKey: 'descripcion_insumo',
        header: 'Nombre',
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
        accessorKey: 'precio',
        header: 'Precio',
        Cell: ({ cell }) => {
          const valor = cell.getValue<number>();
          return valor !== undefined
            ? new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
              }).format(valor)
            : "No definido";
        },
      },
     
      {
        accessorKey: 'stock.stock_actual',
        header: 'Cantidad',
        Cell: ({ cell }) => {
          const stockActual = cell.getValue<number>(); // Accede al valor de stock_actual
          return stockActual !== undefined ? stockActual : 'N/A'; // Verifica si el valor es válido
        },
      },
      {
        accessorKey: 'estado_insumo',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'A' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_insumo, cell.getValue<string>())}
              className="tw-ml-2 tw-text-gray-700 tw-transition-colors hover:tw-text-gray-900"
            >
              <FontAwesomeIcon
                icon={cell.getValue<string>() === 'A' ? faToggleOn : faToggleOff}
                className="tw-text-2xl"
              />
            </button>
          </div>
        ),
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
              onClick={() => handleEdit(row.original.ID_insumo)}
              className="tw-group tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon 
                icon={faEdit} 
                className="tw-transition-transform tw-group-hover:tw-rotate-12"
                title="Editar" 
              />
            </motion.button>
      
            {/* Botón para eliminar */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(row.original.ID_insumo)}
              className="tw-group tw-bg-red-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon 
                icon={faTrash} 
                className="tw-transition-transform tw-group-hover:tw-rotate-6"
                title="Eliminar" 
              />
            </motion.button>
      
            {/* Botón para agregar entrada */}
            <button
              onClick={() => handleAddEntry(row.original.ID_insumo)}
              className="tw-group tw-bg-green-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-green-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon 
                icon={faBoxOpen} 
                className="tw-transition-transform tw-group-hover:tw-scale-110"
                title="Agregar entrada" 
              />
            </button>
      
            {/* Botón para ver detalles */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewDetails(row.original.ID_insumo)}
              className="tw-group tw-bg-gray-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon 
                icon={faEye} 
                className="tw-transition-transform tw-group-hover:tw-scale-110"
                title="Ver detalles" 
              />
            </motion.button>
          </div>
        ),
      }

    ],
    [insumos],
  );

  return (
    <section className="tw-rounded-lg mb-3 mb-lg-5 p-6 bg-white border  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="tw-p-3  tw-min-h-screen">
        <h1 className="page-heading">Insumos</h1>

        {/* Action Buttons with Hover Effects */}
        <div 
          className="tw-mb-6 tw-flex tw-space-x-4"
        >
          {/* Buttons with motion hover effects */}
          <button 
            onClick={handleAddInsumo} 
            className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-6 tw-py-3 tw-flex tw-items-center tw-gap-2 tw-shadow-md tw-transition-all"
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar Insumo
          </button>
          
          <button 
            onClick={() => navigate('/historial-entradas')} 
            className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-6 tw-py-3 tw-flex tw-items-center tw-gap-2 tw-shadow-md tw-transition-all"
          >
            <FontAwesomeIcon icon={faBoxOpen} /> Ver Historial
          </button>
        </div>

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
            data={insumos}
            muiTablePaperProps={{
              sx: tableStyles
            }}
            enableRowSelection
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
      </div>
    </section>
  );

};

export default InsumosList;