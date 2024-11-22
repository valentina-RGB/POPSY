import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Usuario } from '../../types/usuarios';
import { Rol } from '../../types/roles';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import AddUsuario from './CreateUsuario';
import EditUsuario from './EditUsuario';
import Modal from 'react-modal';
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

const UsuarioList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedUsuarioId(id);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    toast.promise(
      api.delete(`/usuarios/${id}`),
      {
        loading: 'Eliminando usuario...',
        success: '¡El usuario ha sido eliminado!',
        error: 'Hubo un problema al eliminar el usuario.',
      }
    ).then(() => {
      fetchUsuarios();
    });
  };

  const handleToggleEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'A' ? 'D' : 'A';

    try {
      await api.put(`/usuarios/${id}`, { estado: nuevoEstado });
      setUsuarios(usuarios.map(usuario =>
        usuario.ID_usuario === id ? { ...usuario, estado: nuevoEstado } : usuario
      ));
      toast.success('El estado del usuario ha sido actualizado.');
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      toast.error('Hubo un problema al cambiar el estado del usuario.');
    }
  };

  const handleAddUsuario = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedUsuarioId(null);
  };

  const handleModalCloseAndFetch = async () => {
    handleCloseModal();
    await fetchUsuarios();
  };

  // Mapeo de ID_rol a descripción
  const getRolDescripcion = (idRol: number) => {
    const rol = roles.find(rol => rol.ID_rol === idRol);
    return rol ? rol.descripcion : 'Desconocido';
  };

  const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
    () => [
      {
        accessorKey: 'ID_usuario',
        header: 'ID',
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
        accessorKey: 'email',
        header: 'Email',
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
        accessorKey: 'telefono',
        header: 'Teléfono',
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
        accessorKey: 'ID_rol',
        header: 'Rol',
        Cell: ({ cell }) => getRolDescripcion(cell.getValue<number>()), // Muestra la descripción del rol
      },
      {
        accessorKey: 'estado_usuario',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'A' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_usuario, cell.getValue<string>())}
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
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit(row.original.ID_usuario)}
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
        onClick={() => handleDelete(row.original.ID_usuario)} 
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
      },
    ],
    [usuarios, roles]
  );

  return (
    <section className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5">
      <motion.div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6">
      <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">Usuarios</h1>
        <button onClick={handleAddUsuario} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
          <FontAwesomeIcon icon={faPlus} /> Agregar usuario
        </button>
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
            data={usuarios}
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
          {modalType === 'add' && <AddUsuario onClose={handleModalCloseAndFetch} />}
          {modalType === 'edit' && selectedUsuarioId !== null && <EditUsuario id={selectedUsuarioId} onClose={handleModalCloseAndFetch} />}
        </Modal>
      </motion.div>
    </section>
  );
};

export default UsuarioList;
