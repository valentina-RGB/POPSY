import React, { useMemo, useState, useEffect, useCallback } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import {
  faEdit,
  faTrash,
  faPlus,
  faBoxOpen, faEye
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { Pedido } from "../../types/Pedido";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
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

export interface Estado {
  ID_estado_pedido: number;
  descripcion: string;
}

Modal.setAppElement("#root");

const Pedidos: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "add" | "edit" | "entry" | "detail" | null;
    id: number | null;
  }>({ type: null, id: null });

  const [estadosPedido, setEstadosPedido] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPedido = async () => {
    try {
      const response = await api.get("/pedidos");
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModal = (
    type: "add" | "edit" | "entry" | "detail",
    id: number | null = null
  ) => {
    setModalConfig({ type, id });
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/pedido/${id}`); // Redirige a la página de detalle del pedido con el ID correspondiente
  };

  const handleDelete = useCallback(async (id: number) => {
    toast
      .promise(api.delete(`pedidos/${id}`), {
        loading: "Eliminando orden...",
        success: "¡La orden ha sido eliminada!",
        error: "Hubo un problema al eliminar el pedido.",
      })
      .then(() => {
        fetchPedido();
      });
  }, []);

  const handleToggleEstado = useCallback(
    async (id: number, estadoActual: number) => {
      // Encontrar el índice del estado actual en la lista de estados
      const indexActual = estadosPedido.findIndex(
        (estado) => estado.ID_estado_pedido === estadoActual
      );
      // Si no encontramos el estado actual, no hacemos nada
      if (indexActual === -1) return;

      // Obtener el siguiente estado, o volver al primero si estamos en el último
      const siguienteEstado =
        estadosPedido[(indexActual + 1) % estadosPedido.length];

      const estadoActualDescripcion = estadosPedido.find(
        (e) => e.ID_estado_pedido === estadoActual
      )?.descripcion;
      if (estadoActualDescripcion === "Cancelado") {
        toast.error("No se puede revertir el estado de un pedido cancelado.");
        return; // Salimos aquí para no proceder con ningún cambio
      }

      // Si el siguiente estado es "Cancelado", mostrar un mensaje de confirmación
      if (siguienteEstado.descripcion === "Cancelado") {
        const toastId = toast(
          <div>
            <p>¿Estás seguro de que quieres cancelar el pedido?</p>
            <div>
              <button
                className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mr-2"
                onClick={async () => {
                  // Confirmar el cambio
                  toast.dismiss(toastId); // Cerrar el toast con el ID
                  try {
                    await api.put(`/pedidos/${id}`, {
                      ID_estado_pedido: siguienteEstado.ID_estado_pedido,
                    });
                    // Actualizamos el estado localmente
                    setPedidos(
                      pedidos.map((pedido) =>
                        pedido.ID_pedido === id
                          ? {
                            ...pedido,
                            ID_estado_pedido:
                              siguienteEstado.ID_estado_pedido,
                          }
                          : pedido
                      )
                    );
                    toast.success(
                      'El estado del pedido ha sido cambiado a "Cancelado".'
                    );
                  } catch (error) {
                    console.error(
                      "Error al cambiar el estado del pedido:",
                      error
                    );
                    toast.error(
                      "Hubo un problema al cambiar el estado del pedido."
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
        return; // Salimos aquí para no proceder con el cambio automático
      }

      try {
        await api.put(`/pedidos/${id}`, {
          ID_estado_pedido: siguienteEstado.ID_estado_pedido,
        });
        // Actualizamos el estado localmente
        setPedidos(
          pedidos.map((pedido) =>
            pedido.ID_pedido === id
              ? {
                ...pedido,
                ID_estado_pedido: siguienteEstado.ID_estado_pedido,
              }
              : pedido
          )
        );
        toast.success("El estado de la categoría ha sido actualizado.");
      } catch (error) {
        console.error("Error al cambiar el estado de la categoría:", error);
        toast.error("Hubo un problema al cambiar el estado de la categoría.");
      }
    },
    [pedidos, estadosPedido]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({ type: null, id: null });
    fetchPedido();
  };

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.get("/estado");
        console.log("Estados cargados:", response.data); // Verifica los datos
        // Asegúrate de que la respuesta tenga los datos correctos
        if (response.data && Array.isArray(response.data)) {
          setEstadosPedido(response.data);
        }
      } catch (error) {
        console.error("Error al cargar los estados de pedido:", error);
      }
    };
    fetchPedido();
    fetchEstados();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Pedido>[]>(
    () => [
      {
        accessorKey: "ID_pedido",
        header: "#",
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
        accessorFn: (row) =>
          new Date(row.fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",

          }),
        header: "Fecha",
      },
      {
        accessorKey: "ID_estado_pedido",
        header: "Estado",
        Cell: ({ cell, row }) => {
          const estado = estadosPedido.find(
            (e) => e.ID_estado_pedido === cell.getValue<number>()
          );
          const nombreEstado = estado ? estado.descripcion : "Desconocido";
          const color = estado
            ? {
              "En lista": "tw-bg-yellow-100 tw-text-yellow-800",
              "En proceso": "tw-bg-blue-100 tw-text-blue-800",
              Cancelado: "tw-bg-red-100 tw-text-red-800",
            }[estado.descripcion]
            : "tw-bg-gray-100 tw-text-gray-800";

          return (
            <div className="tw-flex tw-items-center">
              <button
                onClick={() =>
                  handleToggleEstado(
                    row.original.ID_pedido,
                    cell.getValue<number>()
                  )
                }
                className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${color}`}
              >
                {nombreEstado}
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
          return valor !== undefined

            ? new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
            }).format(valor)
            : "No definido";
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        Cell: ({ row }) => (
          <div className="tw-flex tw-justify-center tw-gap-2">
            {/*<Link to={`/Editar-pedido/${row.original.ID_pedido}`}>
              <button className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>*/}
            <Link to={`/Editar-pedido/${row.original.ID_pedido}`}>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="tw-group tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-ring-opacity-75"
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="tw-transition-transform tw-group-hover:tw-rotate-12"
                  title="Editar"
                />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(row.original.ID_pedido)}
              className="tw-group tw-bg-red-500 tw-text-white tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-all tw-duration-300 hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400 focus:tw-ring-opacity-75"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="tw-transition-transform tw-group-hover:tw-rotate-6"
                title="Eliminar"
              />
            </motion.button>
            {/* Botón para ver el detalle del pedido */}
            <motion.button
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewDetails(row.original.ID_pedido)}
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
    ],
    [handleToggleEstado, estadosPedido]
  );

  return (
    <section className="tw-min-h-screen tw-bg-gradient-to-br tw-to-gray-100 -tw-p-5">
    <motion.div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-6">
    <h1 className="tw-font-bold tw-mb-6 tw-text-gray-800 tw-border-b-4 tw-border-blue-500 tw-pb-3">
        Pedidos
      </h1>
      <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="tw-mb-6 tw-flex tw-space-x-4"
        >
      <Link to="/Agregar-pedidos">
        <button className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300">
          <FontAwesomeIcon icon={faPlus} /> Agregar un pedido
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
            data={pedidos}
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
      </Modal>
    </motion.div>
    </section>
  );
};

export default Pedidos;
