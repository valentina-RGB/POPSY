import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Usuario } from '../../types/usuarios';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faBoxOpen, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import AddUsuario from './CreateUsuario';
import EditUsuario from './EditUsuario';
/* import usuarioDetails from './UsuarioDetails'; */
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');

const UsuarioList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'entry' | 'detail' | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
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

  const handleAddusuario = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: number) => {
    setSelectedUsuarioId(id);
    setModalType('detail');
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

  const [isClientesModalOpen, setIsClientesModalOpen] = useState(false);

  const clientes = useMemo(() => usuarios.filter(usuario => usuario.ID_rol === 3), [usuarios]);


  const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
    () => [
      {
        accessorKey: 'ID_usuario',
        header: 'ID',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },
      {
        accessorKey: 'telefono',
        header: 'Telefono',
        Cell: ({ cell }) => `${cell.getValue<number>()}`,
      },
      {
        accessorKey: 'ID_rol',
        header: 'Rol',
        Cell: ({ cell }) => `${cell.getValue<number>()}`,
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
            <button onClick={() => handleEdit(row.original.ID_usuario)} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(row.original.ID_usuario)} className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            
          </div>
        ),
      },
    ],
    [usuarios],
  );

  return (
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
      <h1 className="page-heading">usuarios</h1>
      <button onClick={handleAddusuario} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
        <FontAwesomeIcon icon={faPlus} /> Agregar usuario
      </button>

      <button
        onClick={() => navigate('/clientes')} 
        className="tw-bg-green-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-ml-4 tw-shadow-md tw-hover:bg-green-600 tw-transition-all tw-duration-300"
      >
        Ver clientes
      </button>


      <MaterialReactTable columns={columns} data={usuarios} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
        {modalType === 'add' && <AddUsuario onClose={handleModalCloseAndFetch} />}
        {modalType === 'edit' && selectedUsuarioId !== null && <EditUsuario id={selectedUsuarioId} onClose ={handleModalCloseAndFetch} />}
        {/* {modalType === 'detail' && selectedusuarioId !== null && <usuarioDetails id={selectedusuarioId} onClose={handleModalCloseAndFetch} />} */}
      </Modal>

    </div>
  );
};

export default UsuarioList;