import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash, faPlus,faToggleOn, faToggleOff, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';  
import Modal from 'react-modal';
import { Categoria } from '../../types/Categoria';
import AddCategories from './categories-add';
import EditCategoria from './categories-edit';
import CategoriaDetail from './categories-details';
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

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'add' | 'edit' | 'entry'|'detail'|'imagen'| null; id: number | null }>({ type: null, id: null });


  const [loading, setLoading] = useState(true);

  
  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };


  const handleModal = (type: 'add' | 'edit'|'detail'|'entry'|'imagen' , id: number | null = null) => {
    setModalConfig({type, id});
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async(id: number)=>{
    const toastId = toast(
      <div>
        <p>¿Estás seguro de que quieres eliminar la categoría?</p>
        <div>
          <button
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
            onClick={async () => {
              // Confirmar el cambio
              toast.dismiss(toastId); // Cerrar el toast con el ID
              try {
                await api.delete(`/categorias/${id}`)
                toast.success(
                  '¡La categoría ha sido eliminada correctamente!.'
                );
                fetchCategorias(); 
              } catch (error) {
                console.error(
                  "Error al eliminar la categoría",
                  error
                );
                toast.error(
                  "Hubo un problema al eliminar la categoría."
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
        duration: 8000, // Duración del toast para dar tiempo a responder
      }
    );
   // Actualiza la lista después de eliminar
     return; // Salimos aquí para no proceder con el cambio automático
  },[]);

  const handleToggleEstado = useCallback (async(id: number, estadoActual: string) =>{
    const nuevoEstado = estadoActual === 'A' ? 'D' : 'A';

    try {
      await api.put(`/categorias/${id}`, { estado_categoria: nuevoEstado });
      setCategorias(categorias.map(cat => cat.ID_categoria === id ? { ...cat, estado_categoria: nuevoEstado } : cat

      ));
      toast.success('El estado de la categoría ha sido actualizado.');
    } catch (error) {
      console.error('Error al cambiar el estado de la categoría:', error);
      toast.error('Hubo un problema al cambiar el estado de la categoría.');
    }
  },[categorias]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({type:null, id:null});
    fetchCategorias(); 
  };




  useEffect(() => {
    fetchCategorias(); 
  }, []);

  const columns  = useMemo<MRT_ColumnDef<Categoria>[]> (
    
    ()  => [
      {
        accessorKey: 'ID_categoria',
        header: '#',
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
        accessorKey: 'descripcion',
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
        accessorKey: 'estado_categoria',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'A' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_categoria, cell.getValue<string>())}
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
        accessorKey: 'imagen',
        header: 'Imagen',
        Cell: ({ row }) => (
          <button 
          onClick={() => handleModal('imagen', row.original.ID_categoria)} 
          className="tw-bg-gray-300 tw-text-gray-80 tw-text-white tw-rounded-full tw-p-3 tw-shadow-lg tw-hover:bg-blue-600 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-justify-center tw-w-12 tw-h-12"
        >
          <img 
            src={`http://localhost:3300${row.original.imagen}`} 
            alt="Imagen categoría" 
            className="tw-w-8 tw-h-8 tw-object-cover tw-rounded-full"
          />
        </button>
      
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
              onClick={() => handleModal('edit',row.original.ID_categoria)}
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
        onClick={() => handleDelete(row.original.ID_categoria)}
        className="tw-group tw-bg-red-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400 focus:tw-ring-opacity-75"
      >
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
        onClick={() => handleModal('detail',row.original.ID_categoria)}

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
    <section
     
      className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5"
    >
     <motion.div
        className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6"
      >
         
    <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">Categorías</h1>
    <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-1 tw-flex tw-space-x-4"
        >
    
         <button onClick={()=>handleModal('add')} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
           <FontAwesomeIcon icon={faPlus} /> Agregar categoría
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
            data={categorias}
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
           className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
           overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
         >
           {modalConfig.type === 'add' && <AddCategories onClose={handleCloseModal} />}
           {modalConfig.type === 'edit' && modalConfig.id !== null && <EditCategoria id={modalConfig.id} onClose={handleCloseModal} />}
           {modalConfig.type === 'detail' && modalConfig.id !== null && <CategoriaDetail id={modalConfig.id} onClose={handleCloseModal} />}
           {modalConfig.type === 'imagen' && modalConfig.id !== null && <CategoriaDetail id={modalConfig.id} onClose={handleCloseModal} />}
         </Modal>
       </motion.div>
       </section>
  );
};

export default Categorias;