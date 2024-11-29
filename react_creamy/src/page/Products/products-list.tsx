import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import { Producto } from '../../types/Producto';
import AddProductos from './products-add';
import ProductosDetail from './products-details';
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



Modal.setAppElement('#root');

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'add' | 'edit' | 'entry' | 'detail' | null; id: number | null }>({ type: null, id: null });
  const [loading, setLoading] = useState(true);
 

  const fetchProducto = async (): Promise<void> => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };


  const handleModal = (type: 'add' | 'edit' | 'entry' | 'detail', id: number | null = null) => {
    setModalConfig({ type, id });
    setIsModalOpen(true);
  };

  
  const handleToggleEstado = useCallback(async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'D' ? 'A' : 'D'
    try {
      await api.put(`/productos/${id}`, { estado_productos: nuevoEstado });
      setProductos(productos.map(pro => pro.ID_producto === id ? { ...pro, estado_productos: nuevoEstado } : pro
      ));
      toast.success('El estado del producto ha sido actualizado.');
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      toast.error('Hubo un problema al cambiar el estado del producto.');
    }

  }, [productos]);

  const handleDelete = useCallback(async (id: number) => {
    const toastId = toast(
      <div>
        <p>¿Estás seguro de que quieres eliminar el producto?</p>
        <div>
          <button
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
            onClick={async () => {
              // Confirmar el cambio
              toast.dismiss(toastId); // Cerrar el toast con el ID
              try {
                await api.delete(`/productos/${id}`)               
                toast.success('El producto a sido eliminado con éxito.');
                fetchProducto()

              } catch (error) {
                console.error(
                  "Error al cambiar el estado del pedido:",
                  error
                );
                toast.error(
                  "Hubo un problema al cambiar el estado del pedido."
                );
              }
            }}
          >
            Confirmar
          </button>
          <button
            className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2"
            onClick={() => toast.dismiss(toastId)} // Cierra el toast sin hacer nada
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        duration: 8000 // Duración del toast para dar tiempo a responder
      }
    );
    return; // Salimos aquí para no proceder con el cambio automático 
  },[]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({type:null, id:null});
    fetchProducto(); 
  };

  useEffect(() => {
    fetchProducto(); // Actualiza la lista después de eliminar
  },[]);

const columns = useMemo<MRT_ColumnDef<Producto>[]>(

    () => [
      {
        accessorKey: 'ID_producto',
        header: '#',
      },
      {
        accessorKey: 'nombre',
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
        accessorKey: 'precio_neto',
        header: 'Precio',
        Cell: ({ cell }) => {
          const valor = cell.getValue<number>();
          return (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="tw-text-green-700 tw-font-bold"
            >
              {valor !== undefined
                ? new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0
                }).format(valor)
                : "No definido"}
            </motion.span>
          );
        },
      },
      {
        accessorKey: 'estado_productos',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'D' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Agotado' : 'Disponible'}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_producto, cell.getValue<string>())}
              className="tw-ml-2 tw-text-gray-700 tw-transition-colors hover:tw-text-gray-900"
            >
              <FontAwesomeIcon
                icon={cell.getValue<string>() === 'D' ? faToggleOn : faToggleOff}
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
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModal('edit', row.original.ID_producto)}
              className="tw-group tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="tw-transition-transform tw-group-hover:tw-rotate-12"
                title="Editar"
              />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(row.original.ID_producto)}
              className="tw-group tw-bg-red-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400 focus:tw-ring-opacity-75">
              <FontAwesomeIcon
                icon={faTrash}
                className="tw-transition-transform tw-group-hover:tw-rotate-6"
                title="Eliminar"
              />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModal('detail', row.original.ID_producto)}
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
      },
    ], [handleToggleEstado, handleDelete]);

  return (
    <section className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5">
      <motion.div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6">
      <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">
        Productos
      </h1>
      <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-6 tw-flex tw-space-x-4"
        >
        <button
         onClick={() => handleModal('add')}
          className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
          <FontAwesomeIcon icon={faPlus} />
           Agregar producto
        </button>
        </motion.div>
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
            data={productos}
            muiTablePaperProps={{
              sx: tableStyles
            }}
            enableColumnOrdering
            enableGlobalFilter
            positionToolbarAlertBanner="bottom"
          // Optional: Add row hover and click animations          
          />
        )}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-w-full tw-max-w-3xl tw-max-h-full tw-overflow-y-auto tw-mx-auto"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
        >
          {modalConfig.type === 'add' && <AddProductos id={0} onClose={handleCloseModal} />}
          {modalConfig.type === 'edit' && modalConfig.id !== null && <AddProductos id={modalConfig.id} onClose={handleCloseModal} />}
          {modalConfig.type === 'detail' && modalConfig.id !== null && <ProductosDetail id={modalConfig.id} onClose={handleCloseModal} />}
        </Modal>
      </motion.div>
    </section>
  );
};

export default Productos;