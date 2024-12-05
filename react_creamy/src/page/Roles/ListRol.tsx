import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Rol } from '../../types/rol';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import AddRol from './CreateRol';
// import EditRol from './EditRol';
import Modal from 'react-modal';
import Skeleton from '@mui/material/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import EditRol from './EditRol';

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

const Roles: React.FC = () => {
  const [roles, setRol] = useState<Rol[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'entry' | 'detail' | null>(null);
  const [selectedRolId, setSelectedRolId] = useState<number | null>(null);

  useEffect(() => {
    fetchRol();
  }, []);
  const [loading, setLoading] = useState(true);
  const fetchRol = async () => {
    try {
      const response = await api.get('/roles');
      console.log(response);
      setRol(response.data);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleEdit = (id: number) => {
    setSelectedRolId(id);
    setModalType('edit');
    setIsModalOpen(true);
  };

const handleDelete = async (id: number) => {
  const toastId = toast(
    <div>
      <p>¿Estás seguro de que quieres eliminar el Rol?</p>
      <div>
        <button
          className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
          onClick={async () => {
            toast.dismiss(toastId);
            try {
              await api.delete(`/Roles/${id}`)               
              toast.success('El rol a sido eliminado con éxito.');
              window.location.reload()

            } catch (error) {
              console.error(
                "Error al cambiar el estado del rol:",
                error
              );
              toast.error(
                "Hubo un problema al cambiar el estado del rol."
              );
            }
          }}
        >
          Confirmar
        </button>
        <button
          className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2"
          onClick={() => toast.dismiss(toastId)} 
        >
          Cancelar
        </button>
      </div>
    </div>,
    {
      duration: 8000 
    }
  );
  return;
};

  const handleToggleEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'A' ? 'D' : 'A';

    try {
      await api.put(`/roles/${id}`, { estado_rol: nuevoEstado });
      setRol(roles.map(roles =>
        roles.ID_rol === id ? { ...roles, estado_rol: nuevoEstado } : roles
      ));
      toast.success('El estado del rol ha sido actualizado.');
      window.location.reload()
    } catch (error) {
      console.error('Error al cambiar el estado del rol:', error);
      toast.success('Cambio de estado exitoso.');
      window.location.reload()
    }
  };

  const handleAddRol = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedRolId(null);
  };

  const handleModalCloseAndFetch = async () => {
    handleCloseModal();
    await fetchRol(); // Actualiza la lista después de agregar/editar entrada
  };

  const columns = useMemo<MRT_ColumnDef<Rol>[]>(
    () => [
      {
        accessorKey: 'ID_rol',
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
        accessorKey: 'estado_rol',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'A' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'A' ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => handleToggleEstado(Number(row.original.ID_rol), cell.getValue<string>())}
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
              onClick={() => handleEdit(Number(row.original.ID_rol))}
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
              onClick={() => handleDelete(row.original.ID_rol)} 
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
    [roles],
  );

  return (
    <section className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5">
    <motion.div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6">
    <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">
      Roles
      </h1>
      <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-6 tw-flex tw-space-x-4"
        >
      <button onClick={handleAddRol} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
        <FontAwesomeIcon icon={faPlus} /> Agregar Rol
      </button>
      </motion.div>
      {/* Skeleton Loader cuando loading es true */}
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
            data={roles}
            muiTablePaperProps={{
              sx: tableStyles
            }}
            enableColumnOrdering
            enableGlobalFilter
            positionToolbarAlertBanner="bottom"       
          />
        )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
        {modalType === 'add' && <AddRol onClose={handleModalCloseAndFetch} id={0} />}
        {modalType === 'edit' && selectedRolId !== null && <EditRol id={selectedRolId} onClose={handleModalCloseAndFetch} />}
      </Modal>
    </motion.div>
    </section>
  );
};

export default Roles;