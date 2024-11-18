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
        accessorKey: 'stock.stock_actual',
        header: 'Cantidad',
        Cell: ({ cell }) => {
          const stockActual = cell.getValue<number>(); // Accede al valor de stock_actual
          return stockActual !== undefined ? stockActual : 'N/A'; // Verifica si el valor es válido
        },
      },
      {
        id: 'acciones',
        header: 'Acciones',
        Cell: ({ row }) => (
          <div className="tw-flex tw-justify-center tw-gap-2">
            {/* Botón para editar */}
            <button
              onClick={() => handleEdit(row.original.ID_insumo)}
              className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faEdit} title="Editar" />
            </button>

            {/* Botón para eliminar */}
            <button
              onClick={() => handleDelete(row.original.ID_insumo)}
              className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faTrash} title="Eliminar" />
            </button>

            {/* Botón para agregar entrada */}
            <button
              onClick={() => handleAddEntry(row.original.ID_insumo)}
              className="tw-bg-green-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-green-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faBoxOpen} title="Agregar entrada" />
            </button>

            {/* Botón para ver detalles */}
            <button
              onClick={() => handleViewDetails(row.original.ID_insumo)}
              className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faEye} title="Ver detalles" />
            </button>
          </div>
        ),
      }

    ],
    [insumos],
  );

  return (
    <section className="tw-rounded-lg mb-3 mb-lg-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
        <h1 className="page-heading">Insumos</h1>

        {/* Botones de acciones */}
        <div className="tw-mb-4 tw-flex tw-gap-4">
          <button onClick={handleAddInsumo} className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
            <FontAwesomeIcon icon={faPlus} /> Agregar Insumo
          </button>
          <button onClick={() => navigate('/historial-entradas')} className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition-all tw-duration-300">
            <FontAwesomeIcon icon={faBoxOpen} /> Ver Historial de Entradas
          </button>
        </div>

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
          <MaterialReactTable columns={columns} data={insumos} />
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
        >
          {modalType === 'add' && <AddInsumo onClose={handleModalCloseAndFetch} />}
          {modalType === 'edit' && selectedInsumoId !== null && <EditInsumo id={selectedInsumoId} onClose={handleModalCloseAndFetch} />}
          {modalType === 'entry' && selectedInsumoId !== null && <AddEntry id={selectedInsumoId} onClose={handleModalCloseAndFetch} />}
          {modalType === 'detail' && selectedInsumoId !== null && <InsumoDetails id={selectedInsumoId} onClose={handleModalCloseAndFetch} />}
        </Modal>
      </div>
    </section>
  );

};

export default InsumosList;