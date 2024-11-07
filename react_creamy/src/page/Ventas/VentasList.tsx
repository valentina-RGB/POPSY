import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Venta } from '../../types/Ventas';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import AddVenta from './CreateVenta';
import VentaDetails from './VentaDetail';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';

export interface EstadoVenta {
  ID_estado_venta: number;
  descripcion: 'Pagado' | 'Cancelado'; // Ajusta según los estados que manejas
}

const VentasList: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isAddVentaModalOpen, setIsAddVentaModalOpen] = useState(false);
  const [isVentaDetailsModalOpen, setIsVentaDetailsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'detail' | null>(null);
  const [selectedVentaId, setSelectedVentaId] = useState<number | null>(null);
  const [estadosVenta, setEstadosVenta] = useState<EstadoVenta[]>([]);

  const [loading, setLoading] = useState(true);
  // Función para obtener las ventas
  const fetchVentas = async () => {
    try {
      const response = await api.get('/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
     } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Función para obtener los estados de venta
  const fetchEstadosVenta = async () => {
    try {
      const response = await api.get('/estadoventas');
      setEstadosVenta(response.data);
    } catch (error) {
      console.error('Error al obtener los estados de ventas:', error);
    }
  };

  // Manejo del modal: solo se abrirá si no está ya abierto
  const handleOpenAddVentaModal = () => {
    if (isVentaDetailsModalOpen) return; // Verifica que el otro modal no esté abierto
    setIsAddVentaModalOpen(true);
    setModalType('add');
  };

  const handleOpenVentaDetailsModal = (id: number) => {
    if (isAddVentaModalOpen) return; // Verifica que el otro modal no esté abierto
    setSelectedVentaId(id);
    setIsVentaDetailsModalOpen(true);
    setModalType('detail');
  };

  const handleCloseAddVentaModal = () => {
    setIsAddVentaModalOpen(false);
    fetchVentas(); // Vuelve a cargar las ventas después de cerrar el modal
  };

  const handleCloseVentaDetailsModal = () => {
    setIsVentaDetailsModalOpen(false);
    setSelectedVentaId(null);
  };

  // Función para cambiar el estado de una venta
  const handleToggleEstado = useCallback(async (id: number, estadoActual: number) => {
    const indexActual = estadosVenta.findIndex((estado) => estado.ID_estado_venta === estadoActual);
    if (indexActual === -1) return;

    const siguienteEstado = estadosVenta[(indexActual + 1) % estadosVenta.length];
    const estadoActualDescripcion = estadosVenta.find((e) => e.ID_estado_venta === estadoActual)?.descripcion;

    if (estadoActualDescripcion === 'Cancelado') {
      toast.error('No se puede revertir el estado de una venta cancelada.');
      return;
    }

    if (siguienteEstado.descripcion === 'Cancelado') {
      const toastId = toast(
        <div>
          <p>¿Estás seguro de que quieres cancelar la venta?</p>
          <div>
            <button
              className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
              onClick={async () => {
                toast.dismiss(toastId);
                try {
                  toast.loading('Cancelando venta...');
                  await api.put(`/ventas/${id}/estado`, { ID_estado_venta: siguienteEstado.ID_estado_venta });
                  setVentas((prevVentas) =>
                    prevVentas.map((venta) =>
                      venta.ID_venta === id ? { ...venta, ID_estado_venta: siguienteEstado.ID_estado_venta } : venta
                    )
                  );
                  toast.dismiss();
                  toast.success('El estado de la venta ha sido actualizado.');
                } catch (error) {
                  toast.dismiss();
                  console.error('Error al cambiar el estado de la venta:', error);
                  toast.error('Hubo un problema al cambiar el estado.');
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
        { duration: 8000 }
      );
      
      return;
    }

    try {
      toast.loading('Actualizando estado...');
      await api.put(`/ventas/${id}/estado`, { ID_estado_venta: siguienteEstado.ID_estado_venta });
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.ID_venta === id ? { ...venta, ID_estado_venta: siguienteEstado.ID_estado_venta } : venta
        )
      );
      toast.dismiss();
      toast.success('El estado de la venta ha sido actualizado.');
    } catch (error) {
      toast.dismiss();
      console.error('Error al cambiar el estado de la venta:', error);
      toast.error('Hubo un problema al cambiar el estado.');
    }
  }, [estadosVenta]);

  useEffect(() => {
    fetchVentas();
    fetchEstadosVenta();
  }, []);

  // Definición de columnas
  const columns = useMemo<MRT_ColumnDef<Venta>[]>(() => [
    {
      accessorKey: 'ID_venta',
      header: '#',
    },
    {
      accessorKey: 'ID_cliente',
      header: 'Cliente',
      Cell: ({ cell }) => {
        const cliente = ventas.find((venta) => venta.ID_venta === cell.row.original.ID_venta)?.Cliente;
        return cliente ? cliente.nombre : 'Desconocido';
      },
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      Cell: ({ cell }) => {
        const fechaOriginal = cell.getValue<string>();
        const fechaFormateada = new Date(fechaOriginal).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return fechaFormateada;
      },
    },
    {
      accessorKey: 'ID_estado_venta',
      header: 'Estado',
      Cell: ({ cell, row }) => {
        const estado = estadosVenta.find((e) => e.ID_estado_venta === cell.getValue<number>());
        const nombreEstado = estado ? estado.descripcion : 'Desconocido';
        const color = estado
          ? {
              'Pagado': 'tw-bg-green-100 tw-text-green-800',
              'Cancelado': 'tw-bg-red-100 tw-text-red-800',
            }[estado.descripcion]
          : 'tw-bg-gray-100 tw-text-gray-800';

        return (
          <div className="tw-flex tw-items-center">
            <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${color}`}>
              {nombreEstado}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_venta, cell.getValue<number>())}
              className="tw-ml-2 tw-text-gray-700 tw-transition-colors hover:tw-text-gray-900"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="tw-text-2xl" />
            </button>
          </div>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      Cell: ({ row }) => (
        <div className="tw-flex tw-justify-center tw-gap-2">
          <button
            onClick={() => handleOpenVentaDetailsModal(row.original.ID_venta)}
            className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
        </div>
      ),
    },
  ], [handleToggleEstado, estadosVenta, ventas]);

  return (
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
      <h1 className="page-heading">Ventas</h1>
      <Link to="/Agregar-ventas">
      <button
        className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
      >
        <FontAwesomeIcon icon={faPlus} /> Agregar una venta
      </button>
      </Link>
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
        <MaterialReactTable columns={columns} data={ventas} />
      )}
      <Modal
        isOpen={isAddVentaModalOpen || isVentaDetailsModalOpen}
        onRequestClose={() => {
          if (isAddVentaModalOpen) handleCloseAddVentaModal();
          if (isVentaDetailsModalOpen) handleCloseVentaDetailsModal();
        }}
        className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
      >
  {/*     {isAddVentaModalOpen && (
          <AddVenta isOpen={isAddVentaModalOpen} onClose={handleCloseAddVentaModal} onVentaCreated={handleCloseAddVentaModal} />
        )} */}
        {isVentaDetailsModalOpen && selectedVentaId !== null && (
          <VentaDetails isOpen={isVentaDetailsModalOpen} onClose={handleCloseVentaDetailsModal} ventaId={selectedVentaId} />
        )}
      </Modal>
    </div>
  );
};

export default VentasList;
