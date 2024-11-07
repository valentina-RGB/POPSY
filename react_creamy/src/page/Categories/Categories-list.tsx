import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash, faPlus, faSignInAlt, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';  
import Modal from 'react-modal';
import { Categoria } from '../../types/Categoria';
import AddCategories from './categories-add';
import EditCategoria from './categories-edit';
import CategoriaDetail from './categories-details';
import Skeleton from '@mui/material/Skeleton';


Modal.setAppElement('#root');

const Categories: React.FC = () => {
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
    toast.promise(api.delete(`categorias/${id}`),
      {
        loading: 'Eliminando categoría...',
        success: '¡La categorpia ha sido eliminada!',
        error: 'Hubo un problema al eliminar la categoría.',
      }
    ).then(() => {
      fetchCategorias(); // Actualiza la lista después de eliminar
    });
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
      },
      {
        accessorKey: 'descripcion',
        header: 'Nombre',
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
            <button onClick={() => handleModal('edit',row.original.ID_categoria)} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(row.original.ID_categoria)} className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              onClick={() => handleModal('detail',row.original.ID_categoria)}
              className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
            </button>
           
            </div>
        ),
      },
    ], [handleToggleEstado, handleDelete]);

  return (
    <>
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
         
         <h1 className="page-heading">Categorías</h1>
         <button onClick={()=>handleModal('add')} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
           <FontAwesomeIcon icon={faPlus} /> Agregar categoría
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
        <MaterialReactTable columns={columns} data={categorias} />
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
       </div>
    </>
  );
};

export default Categories;