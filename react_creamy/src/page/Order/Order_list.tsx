import React, { useMemo, useState, useEffect, useCallback } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import api from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import {
  faEdit,
  faTrash,
  faPlus,
  faBoxOpen,
  // faToggleOn,
  // faToggleOff,
  //faRightToBracket,
  //faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { Pedido } from "../../types/Pedido";
// import AddCategories from './categories-add';
// import EditCategoria from './categories-edit';
import { Link } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';

export interface Estado {
  ID_estado_pedido: number;
  descripcion: string;
}

Modal.setAppElement("#root");

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "add" | "edit" | "entry" | "detail" | null;
    id: number | null;
  }>({ type: null, id: null });
  const [estadosPedido, setEstadosPedido] = useState<Estado[]>([]);
  // const [Categoria, setCategoria] = useState<Categoria | null>(null);

  const [loading, setLoading] = useState(true);
  const fetchPedido = async () => {
    try {
      const response = await api.get("/pedidos");
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleModal = (
    type: "add" | "edit" | "entry" | "detail",
    id: number | null = null
  ) => {
    setModalConfig({ type, id });
    setIsModalOpen(true);
  };

    const handleDelete = useCallback(async(id: number)=>{
      toast.promise(api.delete(`pedidos/${id}`),
        {
          loading: 'Eliminando orden...',
          success: '¡La orden ha sido eliminada!',
          error: 'Hubo un problema al eliminar el pedido.',
        }
      ).then(() => {
        fetchPedido(); // Actualiza la lista después de eliminar
      });
    },[]);

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
          // Encontrar el estado correspondiente al ID_estado_pedido
          const estado = estadosPedido.find(
            (e) => e.ID_estado_pedido === cell.getValue<number>()
          );

          // Si no se encuentra el estado, mostrar un valor por defecto
          const nombreEstado = estado ? estado.descripcion : "Desconocido";

          // Definir un color basado en el nombre del estado
          const color = estado
            ? {
                "En lista": "tw-bg-yellow-100 tw-text-yellow-800",
                "En proceso": "tw-bg-blue-100 tw-text-blue-800",
                Cancelado: "tw-bg-red-100 tw-text-red-800",
                // Agregar más estados y colores aquí
              }[estado.descripcion]
            : "tw-bg-gray-100 tw-text-gray-800";

          return (
            <div className="tw-flex tw-items-center">
              {/* Mostrar el nombre del estado en lugar del ID */}
              
              <button
                onClick={() =>
                  handleToggleEstado(
                    row.original.ID_pedido,
                    cell.getValue<number>()
                  )
                }
                
                //className="tw-ml-2 tw-text-gray-700 tw-transition-colors hover:tw-text-gray-900">
                //{/* <FontAwesomeIcon
                  // icon= {faRightToBracket} size="xs" style={{color: "#B197FC",}} // Ícono para cambiar el estado
                  //className="tw-text-2xl"
               // /> */}

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
            <button
              onClick={() => handleModal("edit", row.original.ID_pedido)}
              className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(row.original.ID_pedido)} className="tw-bg-red-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-red-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="tw-bg-green-500 tw-text-white tw-rounded-full tw-p-2 tw-shadow-md tw-hover:bg-green-600 tw-transition-all tw-duration-300">
              <FontAwesomeIcon icon={faBoxOpen} />
            </button>
          </div>
        ),
      },
    ],
    [handleToggleEstado, estadosPedido]
  );

  return (
    <>
      <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
      <h1 className="page-heading">Pedidos</h1>
        <Link to="/Agregar-pedidos">
          <button
            className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-mb-4 tw-shadow-md tw-hover:bg-blue-600 tw-transition-all tw-duration-300"
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar un pedido
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
        <MaterialReactTable columns={columns} data={pedidos} />
      )}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className="tw-bg-white tw-p-0 tw-mb-12 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-z-50 tw-flex tw-justify-center tw-items-center"
        >
          {/* {modalConfig.type === 'add' && <AddCategories onClose={handleCloseModal} />}
           {modalConfig.type === 'edit' && modalConfig.id !== null && <EditCategoria id={modalConfig.id} onClose={handleCloseModal} />} */}
          {/* {modalType === 'entry' && selectedCategoriaId !== null && <AddEntry id={selectedCategoriaId} onClose={handleModalCloseAndFetch} />}
           {modalType === 'detail' && selectedCategoriaId !== null && <InsumoDetails id={selectedCategoriaId} onClose={handleModalCloseAndFetch} />} */}
        </Modal>
      </div>
    </>
  );
};

export default Pedidos;
