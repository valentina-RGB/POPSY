import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

import api from '../../api/api';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faPlus, faInfoCircle, faSyncAlt, faEye, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import AddVenta from './CreateVenta';
import VentaDetails from './VentaDetail';
import Skeleton from '@mui/material/Skeleton';
import { Link, useNavigate } from 'react-router-dom';
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

export interface EstadoVenta {
  ID_estado_venta: number;
  descripcion: 'Pagado' | 'Cancelado'; // Ajusta según los estados que manejas
}

const VentasList: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const navigate = useNavigate();
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

  const handleViewDetails = (id: number) => {
    navigate(`/venta/${id}`); // Redirige a la página de detalle del pedido con el ID correspondiente
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
        const nombreEstado = estado?.descripcion === 'Pagado' ? 'Pagado' : 'Cancelado';
        const color =
          estado?.descripcion === 'Pagado'
            ? 'tw-bg-green-100 tw-text-green-800'
            : 'tw-bg-red-100 tw-text-red-800';
    
        return (
          <div className="tw-flex tw-items-center">
            <span
              className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${color}`}
            >
              {nombreEstado}
            </span>
            <button
              onClick={() => handleToggleEstado(row.original.ID_venta, cell.getValue<number>())}
              className="tw-ml-2 tw-text-gray-700 tw-transition-colors hover:tw-text-gray-900"
            >
              <FontAwesomeIcon
                icon={estado?.descripcion === 'Pagado' ? faToggleOn : faToggleOff}
                className="tw-text-2xl"
              />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "precio_total",
      header: "Precio Total",
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
      id: 'acciones',
      header: 'Acciones',
      Cell: ({ row }) => (
        <div className="tw-flex tw-justify-center tw-gap-2">
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewDetails(row.original.ID_venta)}
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
  ], [handleToggleEstado, estadosVenta, ventas]);

  return (
    <section className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5">
    <motion.div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6">
    <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">
      Ventas
    </h1>
    <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-6 tw-flex tw-space-x-4"
        >
      <Link to="/Agregar-ventas">
      <button
        className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
      >
        <FontAwesomeIcon icon={faPlus} /> Agregar una venta
      </button>
      </Link>
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
            data={ventas}
            initialState={{
              sorting: [{ id: 'fecha', desc: true }], 
            }}
            muiTablePaperProps={{
              sx: tableStyles
            }}
            enableColumnOrdering
            enableGlobalFilter
            positionToolbarAlertBanner="bottom"
          // Optional: Add row hover and click animations          
          />
        )}

    </motion.div>
    </section>
  );
};

export default VentasList;
