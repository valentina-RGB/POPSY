import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff,faEye  } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';  
import Modal from 'react-modal';
import { Producto } from '../../types/Producto';
import AddProductos from './products-add';
import EditProductos from './products-edit';
import ProductosDetail from './products-details';
import Skeleton from '@mui/material/Skeleton';


Modal.setAppElement('#root');

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'add' | 'edit' | 'entry'|'detail'| null; id: number | null }>({ type: null, id: null });
  // const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [loading, setLoading] = useState(true);
  const fetchProducto = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };


  const handleModal = (type: 'add' | 'edit'|'entry'|'detail' , id: number | null = null) => {
    setModalConfig({type, id});
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async(id: number)=>{
    toast.promise(api.delete(`productos/${id}`),
      {
        loading: 'Eliminando producto...',
        success: '¡El producto ha sido eliminada!',
        error: 'Hubo un problema al eliminar el producto.',
      }
    ).then(() => {
      fetchProducto(); // Actualiza la lista después de eliminar
    });
  },[]);

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setModalConfig({type:null, id:null});
    fetchProducto(); 
  };



  const handleToggleEstado = useCallback(async(id: number, estadoActual: string) =>{
    const nuevoEstado = estadoActual === 'D' ? 'A' : 'D'

    try {
      if (nuevoEstado === 'A') {
        const toastId = toast(
          <div>
            <p>¿Estás seguro de que quieres cancelar el producto?</p>
            <div>
              <button
                className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
                onClick={async () => {
                  // Confirmar el cambio
                  toast.dismiss(toastId); // Cerrar el toast con el ID
                  try {
                    await api.put(`/productos/${id}`, { estado_productos: nuevoEstado });
                     setProductos(productos.map(pro => pro.ID_producto === id ? { ...pro, estado_productos: nuevoEstado } : pro     
                       ));
                       toast.success('El estado del producto ha sido cambiado a "Cancelado".');
                  } catch (error) {
                    console.error('Error al cambiar el estado del producto:', error);
                    toast.error('Hubo un problema al cambiar el estado del producto.');
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
        return; // Salimos aquí para no proceder con el cambio automático
      }else{
        await api.put(`/productos/${id}`, { estado_productos: nuevoEstado });
        setProductos(productos.map(pro => pro.ID_producto === id ? { ...pro, estado_productos: nuevoEstado } : pro 
        ));
        toast.success('¡El estado del producdo ha sido actualizado!');
      }
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      toast.error('Hubo un problema al cambiar el estado del producto.');
    }
  },[productos]);

  useEffect(() => {
    fetchProducto(); 
  }, []);


  type Categoria = {
    ID_Categoria: number;
    descripcion: string;
  };
  const [Categoria, setCategoria] = useState<Categoria[]>([]);


 


  const columns  = useMemo<MRT_ColumnDef<Producto>[]> (
    
    ()  => [
      {
        accessorKey: 'ID_producto',
        header: '#',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      // {
      //   accessorKey: 'ID_categorias',
      //   header: 'Categoría',
      //   Cell: ({ cell, row }) => {
      //       // Encontrar el estado correspondiente al ID_estado_pedido
      //       const categorias = Categoria.find(e => e.ID_Categoria=== row.original.categorias);
      //             // Si no se encuentra el estado, mostrar un valor por defecto
      //       const categoria = categorias ? categorias.descripcion : 'Desconocido';
      //       <p>{categoria}</p>
            
      // }},
      {
        accessorKey: 'descripcion',
        header: 'Descripcion',
      },
      {
        accessorKey: 'estado_productos',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'D' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Agotado': 'Disponible'}
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
            <button onClick={() => handleModal('edit',row.original.ID_producto)} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(row.original.ID_producto)} className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={() => handleModal('detail',row.original.ID_producto)} className="tw-bg-green-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-green-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faEye} />
            </button>
           
            </div>
        ),
      },
    ], [handleToggleEstado, handleDelete]);

  return (
    <>
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
         <h1 className="page-heading">Productos</h1>
         <button onClick={()=>handleModal('add')} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
           <FontAwesomeIcon icon={faPlus} /> Agregar producto
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
        <MaterialReactTable columns={columns} data={productos} />
      )}
         <Modal
           isOpen={isModalOpen}
           onRequestClose={handleCloseModal}
            className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-w-full tw-max-w-3xl tw-max-h-full tw-overflow-y-auto tw-mx-auto"
  overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
            
         >
            {modalConfig.type === 'add' && <AddProductos onClose={handleCloseModal} />}
            {modalConfig.type === 'edit' && modalConfig.id !== null && <EditProductos id={modalConfig.id} onClose={handleCloseModal} />} 
            {modalConfig.type === 'detail' && modalConfig.id !== null && <ProductosDetail id={modalConfig.id} onClose={handleCloseModal} />} 
         </Modal>
       </div>
    </>
  );
};

export default Productos;