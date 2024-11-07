import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Rol } from '../../types/roles';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faBoxOpen, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import AddRol from './CreateRol';
import EditRol from './EditRol';
/* import RolDetails from './RolDetails'; */
import Modal from 'react-modal';
import Skeleton from '@mui/material/Skeleton';

Modal.setAppElement('#root');

const RolList: React.FC = () => {
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
  try {
    await api.delete(`/roles/${id}`);
    toast.success('¡El rol ha sido eliminado!');
    fetchRol();
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 500) {
      toast.error('No se puede eliminar el rol porque está siendo referenciado en otra parte.');
    } else {
      toast.error('Hubo un problema al eliminar el rol.');
    }
  }
};

  const handleToggleEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'A' ? 'D' : 'A';

    try {
      await api.put(`/roles/${id}`, { estado_rol: nuevoEstado });
      setRol(roles.map(roles =>
        roles.id_rol === id ? { ...roles, estado_rol: nuevoEstado } : roles
      ));
      toast.success('El estado del rol ha sido actualizado.');
    } catch (error) {
      console.error('Error al cambiar el estado del rol:', error);
      toast.error('Hubo un problema al cambiar el estado del rol.');
    }
  };

  const handleAddRol = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: number) => {
    setSelectedRolId(id);
    setModalType('detail');
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
        header: 'ID'
      },
      {
        accessorKey: 'descripcion',
        header: 'Nombre',
      },
      {
        accessorKey: 'estado_rol',
        header: 'Estado',
        Cell: ({ cell, row }) => (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'D' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
              {cell.getValue<string>() === 'D' ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.id_rol, cell.getValue<string>())}
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
        accessorKey: 'ID_permiso.descripcion',
        header: 'permiso',
        Cell: ({ cell }) => cell.getValue<String>() ?? 'N/A',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <div className="tw-flex tw-justify-center tw-gap-2">
            <button onClick={() => handleEdit(Number(row.original.ID_rol))} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(row.original.ID_rol)} className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [roles],
  );

  return (
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
      <h1 className="page-heading">Roles</h1>
      <button onClick={handleAddRol} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
        <FontAwesomeIcon icon={faPlus} /> Agregar Rol
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
        <MaterialReactTable columns={columns} data={roles} />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
        {modalType === 'add' && <AddRol onClose={handleModalCloseAndFetch} />}
        {modalType === 'edit' && selectedRolId !== null && <EditRol id={selectedRolId} onClose={handleModalCloseAndFetch} />}
        {/* {modalType === 'detail' && selectedRolId !== null && <RolDetails id={selectedRolId} onClose={handleModalCloseAndFetch} />} */}
      </Modal>
    </div>
  );
};

export default RolList;