import { useState, useMemo, useEffect } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import Skeleton from '@mui/material/Skeleton';
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Package,
} from "lucide-react";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const tableStyles = {
  '& .MuiPaper-root': {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  '& .MuiTableHead-root': {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  '& .MuiTableRow-root': {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      transition: 'background-color 0.2s ease',
    }
  },
  '& .MuiTableCell-root': {
    fontFamily: "'Inter', sans-serif",
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    '&.stock-cell': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#1e293b'
  }
};

type Insumo_adicion = {
  ID_insumo: number;
  descripcion_insumo: string;
  ID_tipo_insumo: number;
  estado_insumo: string;
  precio: number;
  Adiciones_Insumos: {
    cantidad: number;
    total: number;
  };
};

type Producto = {
  ID_producto: number | null;
  nombre: string;
  cantidad: number;
  precio_neto: number;
  Producto_Pedido: {

    cantidad: number;
    sub_total: number;
    Adiciones: {
      id_adicion: number
      cantidad: number,
      total: number,
      Insumos: Insumo_adicion[]
    }[]

  }[]

};



type Pedido = {
  fecha: string;
  ID_clientes: number | string;
  precio_total: number;
  ID_estado_pedido: number | string;
  ProductosLista: Producto[]

};


const cache = {
  Helados: [],
  Insumos: [],
  Salsas: [],
  Productos: []
}


// type identification = {
//   id: number
// }
export default function OrderAdd() {
  // const [Pedidos, setPedidos] = useState<Pedido[]>([]);
  const { id } = useParams();
  const [productoActual, setProductoActual] = useState<string | null>(null);
  const [IDActual, SetIDActual] = useState<number | null>(null);
  const [precioNeto, SetIPrecioNeto] = useState<number>(0);
  // const [productosActual, setProductoActual] = useState<Producto[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  //PRODUCTOS

  const [productosAgregados, setProductosAgregados] = useState<Producto[]>([]);
  const [TerminosHelado, setTerminosHelado] = useState("");
  const [buscarHelado, setBuscarHelado] = useState<Insumo_adicion[]>([]);
  const [insumosAgregados, setInsumoAgregados] = useState<Insumo_adicion[]>([]);

  const [salsasAgregadas, setsalsasAgregadas] = useState<Insumo_adicion[]>([]);
  const [salsasDisponibles, setSalsaDisponibles] = useState<Insumo_adicion[]>([]);

  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm2, setDebouncedSearchTerm2] = useState(TerminosHelado);

  const [TerminosInsumos, setTerminosInsumos] = useState("");
  const [buscarInsumos, setBuscarInsumos] = useState<Insumo_adicion[]>([]);
  const [adiciones, setadiciones] = useState<Insumo_adicion[]>([]);
  const [debouncedSearchTerm3, setDebouncedSearchTerm3] = useState(TerminosHelado);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    //REDUCIR ENTRADA DE INSUMOS
    // console.log('reducir entrada',reducir_entrada(5, -3));
  }), []

  useEffect(() => {
    const combinedArray = [
      ...salsasAgregadas,
      ...insumosAgregados,
      ...adiciones,
    ];



    const generalizarItems = (array: Insumo_adicion[]) => {
      array.reduce((acc: Insumo_adicion[], item) => {
        if (
          !item.Adiciones_Insumos ||
          typeof item.Adiciones_Insumos.cantidad !== "number"
        ) {
          console.error(
            `El item ${item.descripcion_insumo} no tiene Adiciones_Insumos o cantidad definida.`
          );
          return acc;
        }

        const existingItem = acc.find((it) => it.ID_insumo === item.ID_insumo);

        if (existingItem) {
          if (
            existingItem.Adiciones_Insumos &&
            typeof existingItem.Adiciones_Insumos.cantidad === "number"
          ) {
            existingItem.Adiciones_Insumos.cantidad += item.Adiciones_Insumos.cantidad;
            existingItem.Adiciones_Insumos.total += item.Adiciones_Insumos.cantidad * item.precio;
          }
        } else {
          acc.push({
            ...item,
            Adiciones_Insumos: {
              cantidad: item.Adiciones_Insumos.cantidad,
              total: item.Adiciones_Insumos.total, // Esto puede ser 0 y aún así se agrega
            },
          });
        }

        setLista(acc);
        console.log('ACC', acc);
        return acc;
      }, []);

      // Calcular el total de todas las adiciones
      const total = calcularTotalAdiciones(); // Llamamos a la función para calcular el total

      console.log("Total de todas las adiciones:", total);
    };


    generalizarItems(combinedArray);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salsasAgregadas, insumosAgregados, adiciones]);



  useEffect(() => {
    // Configura un temporizador que actualiza el término de búsqueda
    const handler = setTimeout(() => {
      setDebouncedSearchTerm2(TerminosHelado); // Solo se actualiza después de 500ms
    }, 600);

    // Limpia el temporizador si el usuario sigue escribiendo antes de que se complete
    return () => {
      clearTimeout(handler);
    };
  }, [TerminosHelado]); // Se ejecuta cada vez que cambia el término de búsqueda

  useEffect(() => {
    // Configura un temporizador que actualiza el término de búsqueda
    const handler = setTimeout(() => {
      setDebouncedSearchTerm3(TerminosInsumos); // Solo se actualiza después de 500ms
    }, 500);

    // Limpia el temporizador si el usuario sigue escribiendo antes de que se complete
    return () => {
      clearTimeout(handler);
    };
  }, [TerminosInsumos]); // Se ejecuta cada vez que cambia el término de búsqueda


  useEffect(() => {
    if (!debouncedSearchTerm2) {
      setBuscarHelado(cache.Helados);
    } else {
      const heladosFiltrados = buscarHelado.filter((helado) =>
        helado.descripcion_insumo
          .toLowerCase()
          .includes(debouncedSearchTerm2.toLowerCase())
      );
      setBuscarHelado(heladosFiltrados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm2]);

  useEffect(() => {
    if (!debouncedSearchTerm3) {
      // fetchPedidos();
    } else {
      const InsumosFiltrados = buscarInsumos.filter((insumos) =>
        insumos.descripcion_insumo
          .toLowerCase()
          .includes(debouncedSearchTerm3.toLowerCase())
      );
      setBuscarInsumos(InsumosFiltrados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm3]);


  // Cargar insumos desde el backend
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get('http://localhost:3300/insumos'); // Endpoint de insumos
        const helados = response.data.filter((insumo: Insumo_adicion) => insumo.ID_tipo_insumo === 1 && insumo.estado_insumo === 'A');
        const salsas = response.data.filter((insumo: Insumo_adicion) => insumo.ID_tipo_insumo === 2 && insumo.estado_insumo === 'A');
        const generales = response.data.filter((insumo: Insumo_adicion) => insumo.ID_tipo_insumo !== 1 && insumo.ID_tipo_insumo !== 2 && insumo.estado_insumo === 'A');

        console.log(helados, salsas, generales)

        setSalsaDisponibles(salsas);
        setBuscarHelado(helados);
        setBuscarInsumos(generales);
        cache.Helados = helados
        cache.Salsas = salsas
        // console.log('cache',cache.Helados);

        // setInsumosGenerales(generales);
      } catch (error) {
        console.error('Error al cargar los insumos:', error);
      }
    };

    fetchInsumos();
  }, []);


  useEffect(() => {
    const fecht = async () => {
      try {
        const response = await api.get(`http://localhost:3300/productos`)
        const data = response.data
        setProducts(data);

        cache.Productos = data
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    }
    fecht()


    if (id) {
      const pedidos = async () => {
        try {
          const response = await api.get(`http://localhost:3300/pedidos/${id}`)
          const data = response.data
          const { ProductosLista } = data

          setProductosAgregados(ProductosLista);
          console.log(data)
        } catch (error) {
          console.error("Error al obtener el pedido:", error);
        }
      }

      pedidos()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const añadirInsumo = (insumo: Insumo_adicion) => {
    const InsumosExists = insumosAgregados.some(
      (input) => input.descripcion_insumo === insumo.descripcion_insumo
    );

    if (InsumosExists) {
      handleChangeInsumo(insumo.ID_insumo, 1, 'helado');
      // Mostramos un mensaje toast
      toast.success(
        `La cantidad de ${insumo.descripcion_insumo} ha sido actualizada.`
      );
    } else {
      const nuevo = [
        ...insumosAgregados,
        {
          ID_insumo: insumo.ID_insumo,
          descripcion_insumo: insumo.descripcion_insumo,
          precio: insumo.precio,
          estado_insumo: insumo.estado_insumo,
          ID_tipo_insumo: insumo.ID_tipo_insumo,
          Adiciones_Insumos: {
            cantidad: 1,
            total: 1 * insumo.precio
          },
        },
      ];

      setInsumoAgregados(nuevo);

      return insumosAgregados;
    }
  };

  const añadirAdicion = (insumo: Insumo_adicion) => {
    const AdicionExists = adiciones.some(
      (input) => input.ID_insumo === insumo.ID_insumo
    );

    if (AdicionExists) {
      handleChangeInsumo(insumo.ID_insumo, 1, 'adicion');
      // Mostramos un mensaje toast
      toast.success(
        `La cantidad de ${insumo.descripcion_insumo} ha sido actualizada.`
      );
    } else {
      const nuevo = [
        ...adiciones,
        {
          ID_insumo: insumo.ID_insumo,
          descripcion_insumo: insumo.descripcion_insumo,
          precio: insumo.precio,
          ID_tipo_insumo: insumo.ID_tipo_insumo,
          estado_insumo: insumo.estado_insumo,
          Adiciones_Insumos: {
            cantidad: 1,
            total: insumo.precio,
          },
        },
      ];

      setadiciones(nuevo);
      return adiciones;
    }
  };

  const handleSalsaChange = (salsa: Insumo_adicion) => {
    const siExiste = salsasAgregadas.some(
      (s) => s.ID_insumo === salsa.ID_insumo
    );
    if (siExiste) {
      // Si la salsa ya está agregada, la eliminamos
      setsalsasAgregadas(
        salsasAgregadas.filter((s) => s.ID_insumo !== salsa.ID_insumo)
      );
    } else {
      // Si no está agregada, la agregamos

      const nuevaSalsa = [
        ...salsasAgregadas,
        {
          ID_insumo: salsa.ID_insumo,
          descripcion_insumo: salsa.descripcion_insumo,
          precio: salsa.precio,
          ID_tipo_insumo: salsa.ID_tipo_insumo,
          estado_insumo: salsa.estado_insumo,
          Adiciones_Insumos: {
            cantidad: 1,
            total: salsa.precio,
          },
        },
      ];

      setsalsasAgregadas(nuevaSalsa);
    }
  };


  const [Lista, setLista] = useState<Insumo_adicion[]>([]);


  const calcularTotalAdiciones = () => {
    // Sumar todos los totales de cada item en Lista
    const total = Lista.reduce((acc, item) => {
      // Verifica si Adiciones_Insumos tiene un total y lo suma
      if (item.Adiciones_Insumos && typeof item.Adiciones_Insumos.total === "number") {
        return acc + item.Adiciones_Insumos.total;
      }
      return acc;
    }, 0); // Inicializamos el acumulador en 0

    return total;
  };


  useEffect(() => {
    console.log("Lista actualizada:", Lista);
  }, [Lista]);



  // LISTA DE PRODUCTOS
  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
    () => [
      {
        accessorKey: "ID_producto",
        header: "#",
        size: 80,
        Cell: ({ cell }) => (
          <span className="tw-text-gray-500 tw-font-medium">
            #{cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "nombre",
        header: "Producto",
        Cell: ({ cell }) => (
          <div className="tw-flex tw-flex-col">
            <span className="tw-font-medium">{cell.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "precio_neto",
        header: "Precio",
        Cell: ({ cell }) => {
          const valor = cell.getValue<number>();
          return (
            <span className="tw-font-medium tw-text-blue-600">
              {valor !== undefined
                ? new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "COP",
                }).format(valor)
                : "No definido"}
            </span>
          );
        },
      },
      {
        accessorKey: "stock_bola",
        header: "Disponible",
        Cell: ({ cell }) => {
          const stock = cell.getValue<number>();
          return (
            <div className="stock-cell">
              <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm
                        ${stock > 0
                  ? 'tw-bg-green-100 tw-text-green-800'
                  : 'tw-bg-red-100 tw-text-red-800'}`}>
                {stock > 0 ? `${stock} disponibles` : 'Agotado'}
              </span>
            </div>
          );
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        size: 120,
        Cell: ({ row }) => (
          <div className="tw-flex tw-justify-center">
            <button
              type="button"
              className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-lg 
                                 tw-transition-all hover:tw-bg-blue-600 disabled:tw-opacity-50
                                 disabled:tw-cursor-not-allowed"
              onClick={() => {
                setProductoActual(row.original.nombre);
                SetIDActual(row.original.ID_producto);
                SetIPrecioNeto(row.original.precio_neto);
                setModalAbierto(true);
              }}

            >
              Agregar
            </button>
          </div>
        ),
      },
    ],
    []
  );



  const agregarProducto = () => {
    if (productoActual) {

      // Crear una nueva adición con los insumos seleccionados, calculando el total basado en la cantidad y precio de cada insumo
      const nuevaAdicion = {
        // Usamos el timestamp como un ID único
        id_adicion: Date.now(),
        cantidad: 1, // La cantidad depende de cuántos insumos se han agregado (ajustar según tu lógica)
        total: Lista.reduce((acc, item) => {
          if (item.Adiciones_Insumos && item.Adiciones_Insumos.total) {
            return acc + (item.Adiciones_Insumos.cantidad * item.Adiciones_Insumos.total);
          }
          return acc;
        }, 0), // Calculamos el total de la adición sumando los subtotales de los insumos
        Insumos: [...Lista], // Copia de la lista de insumos seleccionados
      };

      console.log('Nueva adición:', nuevaAdicion);

      // Actualizar productos agregados con sus adiciones personalizadas
      setProductosAgregados((prevProductos) => {
        // Verificar si el producto ya existe en la lista
        const productoExistente = prevProductos.find(
          (producto) => producto.ID_producto === IDActual
        );

        if (productoExistente) {
          // Si el producto ya existe, actualizar la cantidad y agregar la nueva adición
          return prevProductos.map((producto) =>
            producto.ID_producto === IDActual
              ? {
                ...producto,
                cantidad: producto.cantidad + 1, // Incrementar cantidad
                Producto_Pedido: producto.Producto_Pedido.map((productoPedido) => ({
                  ...productoPedido,
                  cantidad: productoPedido.cantidad + 1, // Incrementar cantidad en Producto_Pedido
                  sub_total: (productoPedido.cantidad + 1) * producto.precio_neto, // Actualizar sub_total
                  Adiciones: [
                    ...productoPedido.Adiciones, // Conservar las adiciones anteriores
                    nuevaAdicion, // Agregar la nueva adición
                  ],
                })),
              }
              : producto
          );
        } else {
          // Si el producto no existe, agregar un nuevo producto con su adición
          return [
            ...prevProductos,
            {
              ID_producto: IDActual,
              nombre: productoActual,
              cantidad: 1,
              precio_neto: precioNeto ?? 0,
              Producto_Pedido: [{
                cantidad: 1,
                sub_total: precioNeto,
                Adiciones: [nuevaAdicion]
              }]
              // Establecer la primera adición con el insumo específico
            },
          ];
        }
      });

      console.log(productosAgregados)
      // Limpiar las listas temporales (para el siguiente producto)
      setInsumoAgregados([]);
      setsalsasAgregadas([]);
      setadiciones([]);
      setLista([]); // Limpiar la lista de insumos
      setModalAbierto(false); // Cerrar el modal
      setProductoActual(null); // Restablecer el producto actual
    }


  };


  useEffect(() => {

    console.log('Productos agregados', productosAgregados)
  }, [productosAgregados]);


  const navegate = useNavigate()
  const order = async () => {

    const pedido: Pedido = {
      fecha: new Date().toISOString(),
      ID_clientes: 1,
      precio_total: totalPedido,
      ID_estado_pedido: 1,
      ProductosLista: productosAgregados
    };
    console.log(pedido);
    const url_order = `/pedidos`;

    try {

      if (id) {
        await api.put(`${url_order}/${id}`, pedido, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("El pedido ha sido actualizado exitosamente.");
        navegate('/pedidos');
      } else {
        await api.post(url_order, pedido, {
          headers: {
            "Content-Type": "application/json",
          },
        });




        toast.success("El pedido ha sido agregado exitosamente.");


        navegate('/pedidos');

      }

    } catch {
      toast.error(
        "No se pudo agregar el pedido. Por favor, intente nuevamente."
      );
    }
  };






  const eliminarHelado = (index: number) => {
    setInsumoAgregados((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarAdicion = (index: number) => {
    setadiciones((prev) => prev.filter((_, i) => i !== index));
  };


  // Función para manejar los cambios en la cantidad de insumos
  const handleChangeInsumo = (ID_insumo: number, cantidad: number, tipo: string) => {
    if (tipo === 'helado') {
      // Calcular la suma total de la cantidad en la lista de insumos
      // const cantidadTotal = insumosAgregados.reduce((acc, input) => acc + input.Adiciones_Insumos.cantidad, 0);
      const newInputs = insumosAgregados.map((input) => {
        let newQuantity = isNaN(input.Adiciones_Insumos.cantidad + cantidad)
          ? 1
          : input.Adiciones_Insumos.cantidad + cantidad;
        // const precio = isNaN(input.precio * newQuantity)? 1: input.precio * newQuantity;

        if (newQuantity < 1) {
          newQuantity = 1;
        }

        if (input.ID_insumo === ID_insumo) {
          return {
            ...input,
            Adiciones_Insumos: {
              ...input.Adiciones_Insumos,
              cantidad: newQuantity,
              // precio: precio
            },
          };
        }
        return input;
      });

      // const newInputsAdiciones = insumosAgregados.map((input) => {
      //   // let newQuantity= isNaN(input.Adiciones_Insumos.cantidad + cantidad)
      //   //   ? 1
      //   //   : input.Adiciones_Insumos.cantidad + cantidad;

      //   if (input.ID_insumo === ID_insumo) {
      //     return {
      //       ...input,
      //       // Adiciones_Insumos: {
      //       //   ...input.Adiciones_Insumos,
      //       //   cantidad: 1
      //       //   // precio:
      //       // },
      //       ID_insumo: input.ID_insumo,
      //       descripcion_insumo: input.descripcion_insumo,
      //       precio: input.precio,
      //       ID_tipo_insumo: input.ID_tipo_insumo,
      //       estado_insumo: input.estado_insumo,
      //       Adiciones_Insumos: {
      //         cantidad: 1,
      //         total: input.precio,
      //       },
      //     };
      //   }
      //   return input;
      // });

      setInsumoAgregados(newInputs);
      // if(cantidadTotal<2){
      //   setInsumoAgregados(newInputs);
      // }else{
      //   setadiciones(newInputsAdiciones)
      // }


    } else if (tipo === 'salsa') {
      setInsumoAgregados(prev => {
        const updated = [...prev];

        // updated[index].Adiciones_Insumos.cantidad = cantidad;
        return updated;
      });
    } else if (tipo === 'adicion') {
      const newInputs = adiciones.map((input) => {
        let newQuantity = isNaN(input.Adiciones_Insumos.cantidad + cantidad)
          ? 1
          : input.Adiciones_Insumos.cantidad + cantidad;
        // const precio = isNaN(input.precio * newQuantity)? 1: input.precio * newQuantity;

        if (newQuantity < 1) {
          newQuantity = 1;
        }

        if (input.ID_insumo === ID_insumo) {
          return {
            ...input,
            Adiciones_Insumos: {
              ...input.Adiciones_Insumos,
              cantidad: newQuantity,
              //precio: precio
            },
          };
        }
        return input;
      });

      setadiciones(newInputs);
    }


  }

  const actualizarCantidad = (index: number, incremento: number) => {
    setProductosAgregados((prev) =>
      prev.map((producto, i) =>
        i === index
          ? {
            ...producto,
            Producto_Pedidos: {
              ...producto.Producto_Pedido,
              cantidad: Math.max(1, producto.Producto_Pedido.reduce((acc, p) => acc + p.cantidad, 0) + incremento)
              // cantidad: Math.max(1, producto.Producto_Pedido.reduce((acc, p) => acc + p.cantidad, 0) + incremento)
            }
          }
          : producto
      )

    );

  };

  const eliminarProducto = (index: number) => {
    setProductosAgregados((prev) => prev.filter((_, i) => i !== index));
  };

  // const [subtotal, setSubtotal] = useState<number>(0);

  // const totalPedido = productosAgregados.reduce(
  //   (sum, producto) =>
  //     //
  //   sum + (producto.precio_neto * producto.Producto_Pedido.reduce((acc, p) => acc + p.cantidad, 0) + (Adiciones_total * producto.Producto_Pedidos.map(p=> p.cantidad)) ,
  //   0
  // );

  const totalPedido = productosAgregados.reduce((sum, producto) => {
    // Calcular el total de todas las adiciones de este producto
    const totalAdiciones = producto.Producto_Pedido.reduce((accPedido, pedido) => {
      const subtotalAdiciones = pedido.Adiciones.reduce(
        (accAdicion, adicion) => accAdicion + adicion.total,
        0
      );
      return accPedido + subtotalAdiciones;
    }, 0);

    // Calcular el total del producto (precio * cantidad total del producto)
    const cantidadTotalProducto = producto.Producto_Pedido.reduce(
      (accCantidad, pedido) => accCantidad + pedido.cantidad,
      0
    );
    const totalProducto = producto.precio_neto * cantidadTotalProducto;

    // Sumar total del producto y total de las adiciones
    return sum + totalProducto + totalAdiciones;
  }, 0);

  console.log("Total del pedido:", totalPedido);




  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  }



  // const handleCantidadAdicionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   id_producto: number,
  //   id_adicion: number
  // ) => {
  //   const newCantidadAdicion = parseInt(e.target.value, 10);

  //   if (newCantidadAdicion > 0) {
  //     setProductosAgregados((prevProductos) =>
  //       prevProductos.map((producto) => {
  //         if (producto.ID_producto === id_producto) {
  //           // Actualizamos Producto_Pedido
  //           const nuevoProductoPedido = producto.Producto_Pedido.map((productoPedido) => {
  //             // Actualizamos Adiciones
  //             const nuevasAdiciones = productoPedido.Adiciones.map((adicion) => {
  //               if (adicion.id_adicion === id_adicion) {
  //                 // Recalculamos el total de la adición basado en los insumos
  //                 const nuevoTotalAdicion = adicion.Insumos.reduce(
  //                   (acc, insumo) =>
  //                     acc + insumo.precio * insumo.Adiciones_Insumos.cantidad,
  //                   0
  //                 );

  //                 return {
  //                   ...adicion,
  //                   cantidad: newCantidadAdicion, // Actualizamos la cantidad
  //                   total: nuevoTotalAdicion * newCantidadAdicion, // Recalculamos el total
  //                 };
  //               }
  //               return adicion;
  //             });

  //             // Recalculamos el subtotal del producto
  //             const nuevoSubTotal = nuevasAdiciones.reduce(
  //               (acc, adicion) => acc + adicion.total,
  //               0
  //             );

  //             return {
  //               ...productoPedido,
  //               Adiciones: nuevasAdiciones,
  //               sub_total: nuevoSubTotal, // Actualizamos el subtotal
  //             };
  //           });

  //           return {
  //             ...producto,
  //             Producto_Pedido: nuevoProductoPedido,
  //           };
  //         }
  //         return producto;
  //       })
  //     );
  //   }
  // };


  const handleCantidadAdicionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id_producto: number,
    id_adicion: number
  ) => {
    const newCantidadAdicion = parseInt(e.target.value, 10);

    if (newCantidadAdicion > 0) {
      setProductosAgregados((prevProductos) =>
        prevProductos.map((producto) => {
          if (producto.ID_producto === id_producto) {
            // Actualizamos Producto_Pedido
            const nuevoProductoPedido = producto.Producto_Pedido.map((productoPedido) => {
              // Actualizamos Adiciones
              const nuevasAdiciones = productoPedido.Adiciones.map((adicion) => {
                if (adicion.id_adicion === id_adicion) {
                  // Recalculamos el total de la adición basado en los insumos
                  const nuevoTotalAdicion = adicion.Insumos.reduce(
                    (acc, insumo) =>
                      acc + insumo.precio * insumo.Adiciones_Insumos.cantidad,
                    0
                  );

                  return {
                    ...adicion,
                    cantidad: newCantidadAdicion, // Actualizamos la cantidad
                    total: nuevoTotalAdicion * newCantidadAdicion, // Recalculamos el total
                  };
                }
                return adicion;
              });

              // Recalculamos el subtotal del producto
              const nuevoSubTotal = nuevasAdiciones.reduce(
                (acc, adicion) => acc + adicion.total,
                0
              );

              // Recalculamos la cantidad total basada en las adiciones
              const nuevaCantidadProducto = nuevasAdiciones.reduce(
                (acc, adicion) => acc + adicion.cantidad,
                0
              );

              return {
                ...productoPedido,
                Adiciones: nuevasAdiciones,
                sub_total: nuevoSubTotal, // Actualizamos el subtotal
                cantidad: nuevaCantidadProducto, // Actualizamos la cantidad total del producto
              };
            });

            // Aseguramos que la cantidad total del producto esté sincronizada con las adiciones
            const nuevaCantidadTotal = nuevoProductoPedido.reduce(
              (acc, pedido) => acc + pedido.cantidad,
              0
            );

            return {
              ...producto,
              Producto_Pedido: nuevoProductoPedido,
              cantidad: nuevaCantidadTotal, // Actualizamos la cantidad del producto
            };
          }
          return producto;
        })
      );
    }
  };

  const handleCantidadInsumoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id_producto: number,
    id_adicion: number,
    insumoId: number
  ) => {
    const newCantidadInsumo = parseInt(e.target.value, 10);

    if (newCantidadInsumo > 0) {
      setProductosAgregados((prevProductos) =>
        prevProductos.map((producto) => {
          if (producto.ID_producto === id_producto) {
            return {
              ...producto,
              Producto_Pedido: producto.Producto_Pedido.map((productoPedido) => {
                return {
                  ...productoPedido,
                  Adiciones: productoPedido.Adiciones.map((adicion) => {
                    if (adicion.id_adicion === id_adicion) {
                      // Actualizamos los insumos dentro de la adición
                      const nuevosInsumos = adicion.Insumos.map((insumo) => {
                        if (insumo.ID_insumo === insumoId) {
                          const nuevoTotalInsumo = insumo.precio * newCantidadInsumo;
                          return {
                            ...insumo,
                            Adiciones_Insumos: {
                              cantidad: newCantidadInsumo,
                              total: nuevoTotalInsumo, // Aseguramos la propiedad "total"
                            },
                          };
                        }
                        return insumo;
                      });

                      // Recalculamos el total de la adición
                      const nuevoTotalAdicion = nuevosInsumos.reduce(
                        (acc, insumo) => acc + insumo.Adiciones_Insumos.total,
                        0
                      );

                      return {
                        ...adicion,
                        Insumos: nuevosInsumos,
                        total: nuevoTotalAdicion,
                      };
                    }
                    return adicion;
                  }),
                };
              }),
            };
          }
          return producto;
        })
      );
    }
  };


  const handleEliminarAdicion = (id_producto: number, id_adicion: number) => {
    setProductosAgregados((prevProductos) => {
      return prevProductos.map((producto) => {
        // Verificamos si es el producto que queremos modificar
        if (producto.ID_producto === id_producto) {
          return {
            ...producto,
            Producto_Pedido: producto.Producto_Pedido.map((productoPedido) => {
              // Filtramos las adiciones para eliminar la que coincida con `id_adicion`
              const nuevasAdiciones = productoPedido.Adiciones.filter(
                (adicion) => adicion.id_adicion !== id_adicion
              );

              // Recalculamos el subtotal basándonos en las adiciones restantes
              const nuevoSubTotal = nuevasAdiciones.reduce(
                (acc, adicion) => acc + adicion.total,
                0
              );

              return {
                ...productoPedido,
                sub_total: nuevoSubTotal, // Actualizamos el subtotal
                Adiciones: nuevasAdiciones, // Actualizamos las adiciones
              };
            }),
          };
        }
        return producto; // Devolvemos el producto sin cambios si no coincide
      });
    });
  };





  return (
    <div className="tw-container tw-mx-auto tw-p-4 ">
      {/* <h1 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-center">Heladería Delicia Fría</h1> */}

      {/* Grid de dos columnas */}
      <div className="tw-grid tw-md:grid-cols-2 tw-gap-6">
        {/* Columna 1: Buscar productos */}
        <div className="tw-bg-white tw-p-3 tw-shadow-md tw-rounded-md">
          <div className="tw-flex tw-mb-3">
            <h2 className="tw-text-xl ">Productos</h2>
            <Package className="tw-mr-2 tw-h-4 tw-w-4" />
          </div>
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
            <div style={{ width: "100%", overflowX: "auto" }}>

              <MaterialReactTable
                columns={columns}
                data={products}
                initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
                muiTableContainerProps={{ style: { maxWidth: "100%" } }}
                muiTableBodyProps={{ style: { minWidth: "100%" } }}
              />
            </div>

          )}
        </div>

        {/* Columna 2: Tu pedido */}
        <div className="tw-bg-white tw-p-2 tw-shadow-md tw-rounded-md">
          <div className="tw-mb-4">
            <h2 className="tw-text-xl tw-font-semibold">Tu Pedido</h2>
          </div>
          <div className="tw-h-64 tw-overflow-y-auto">
            {productosAgregados.map((producto: Producto, index: number) => (
              <div key={index} className="tw-border-b">
                {/* Título del acordeón (Producto) */}
                <div
                  className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-cursor-pointer"
                  onClick={() => toggleAccordion(index)}
                >
                  <p className="tw-font-semibold">{producto.nombre}</p>
                  <span>
                    {activeIndex === index ? (
                      <Minus className="tw-h-4 tw-w-4" />
                    ) : (
                      <Plus className="tw-h-4 tw-w-4" />
                    )}
                  </span>
                </div>

                {/* Contenido del acordeón */}
                {activeIndex === index && (
                  <div className="tw-pt-2 tw-pb-4">
                    <p className="tw-text-sm">Precio: ${producto.precio_neto.toFixed(2)}</p>

                    <div className="tw-container tw-mx-auto tw-p-4">
                      {/* <h2 className="tw-text-2xl tw-font-semibold tw-mb-4">Listado de Adiciones</h2> */}
                      <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-overflow-hidden">
                        <thead className="tw-bg-gray-50">
                          <tr>
                            <th className="tw-w-16 tw-px-4 tw-py-3 tw-text-left tw-font-semibold tw-text-gray-700 tw-text-sm tw-uppercase tw-tracking-wider">#</th>
                            <th className="tw-w-2/5 tw-px-4 tw-py-3 tw-text-left tw-font-semibold tw-text-gray-700 tw-text-sm tw-uppercase tw-tracking-wider">Descripción de Adición</th>
                            <th className="tw-w-1/5 tw-px-4 tw-py-3 tw-text-left tw-font-semibold tw-text-gray-700 tw-text-sm tw-uppercase tw-tracking-wider">Cantidad</th>
                            <th className="tw-w-1/5 tw-px-4 tw-py-3 tw-text-left tw-font-semibold tw-text-gray-700 tw-text-sm tw-uppercase tw-tracking-wider">Total</th>
                            <th className="tw-w-16 tw-px-4 tw-py-3 tw-text-left tw-font-semibold tw-text-gray-700 tw-text-sm tw-uppercase tw-tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="tw-divide-y tw-divide-gray-200">
                          {producto.Producto_Pedido.map((Producto_Pedidos) => {
                            return Producto_Pedidos.Adiciones.map((adicion, index) => (
                              <tr
                                key={adicion.id_adicion}
                                className="tw-bg-white hover:tw-bg-gray-50 tw-transition-colors"
                              >
                                <td className="tw-px-4 tw-py-4 tw-align-top">
                                  <span className="tw-inline-flex tw-items-center tw-justify-center tw-bg-blue-100 tw-text-blue-800 tw-w-8 tw-h-8 tw-rounded-full tw-text-sm tw-font-medium">
                                    #{index + 1}
                                  </span>
                                </td>
                                <td className="tw-px-4 tw-py-4">
                                  <div className="tw-max-h-[300px] tw-overflow-y-auto tw-pr-2 tw-space-y-2">
                                    {adicion.Insumos.map((insumo) => (
                                      <div
                                        key={insumo.ID_insumo}
                                        className="tw-flex tw-items-center tw-gap-3 tw-bg-gray-50 tw-p-3 tw-rounded-lg tw-border tw-border-gray-100"
                                      >
                                        <div className="tw-flex-1">
                                          <p className="tw-text-sm tw-font-medium tw-text-gray-900">
                                            {insumo.descripcion_insumo}
                                          </p>
                                          <p className="tw-text-sm tw-text-gray-500 tw-mt-0.5">
                                            Precio unitario: ${insumo.precio}
                                          </p>
                                        </div>
                                        <div className="tw-flex tw-flex-col tw-items-end tw-gap-1">
                                          <label className="tw-text-xs tw-text-gray-500">Cantidad</label>
                                          <input
                                            type="number"
                                            value={insumo.Adiciones_Insumos.cantidad}
                                            onChange={(e) => handleCantidadInsumoChange(e, producto.ID_producto || 1, adicion.id_adicion, insumo.ID_insumo)}
                                            className="tw-w-20 tw-bg-white tw-border tw-border-gray-300 focus:tw-border-blue-500 focus:tw-ring-1 focus:tw-ring-blue-500 tw-rounded-md tw-px-2 tw-py-1 tw-text-sm tw-text-right"
                                            min="0"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-4 tw-align-top">
                                  <div className="tw-flex tw-flex-col tw-gap-1">
                                    <label className="tw-text-xs tw-text-gray-500">Cantidad total</label>
                                    <input
                                      type="number"
                                      value={adicion.cantidad}
                                      onChange={(e) => handleCantidadAdicionChange(e, producto.ID_producto || 1, adicion.id_adicion)}
                                      className="tw-w-24 tw-bg-white tw-border tw-border-gray-300 focus:tw-border-blue-500 focus:tw-ring-1 focus:tw-ring-blue-500 tw-rounded-md tw-px-3 tw-py-1.5 tw-text-sm"
                                      min="0"
                                    />
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-4 tw-align-top">
                                  <div className="tw-flex tw-flex-col tw-gap-1">
                                    <span className="tw-text-xs tw-text-gray-500">Total adición</span>
                                    <span className="tw-font-medium tw-text-gray-900 tw-text-lg">
                                      ${adicion.total.toLocaleString()}
                                    </span>
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-4 tw-align-top">
                                  <button
                                    onClick={() => handleEliminarAdicion(producto.ID_producto || 1, adicion.id_adicion)}
                                    className="tw-inline-flex tw-items-center tw-justify-center tw-h-8 tw-w-8 tw-text-red-600 hover:tw-text-red-800 hover:tw-bg-red-100 tw-rounded-full tw-transition-colors"
                                    title="Eliminar adición"
                                  >
                                    <Trash2 className="tw-h-5 tw-w-5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          })}
                        </tbody>
                      </table>

                    </div>


                    {/* Calculo del subtotal para cada producto */}
                    <p className="tw-text-sm">
                      {/* Subtotal: 
              {producto.subtotal.toFixed(2)} */}
                    </p>

                    <div className="tw-flex tw-items-center tw-space-x-2">
                      <button
                        className="tw-border tw-p-2"
                        onClick={() => actualizarCantidad(index, -1)}
                      >
                        <Minus className="tw-h-4 tw-w-4" />
                      </button>
                      <span className="tw-w-8 tw-text-center">
                        {producto.Producto_Pedido.map(p => p.cantidad)}
                      </span>
                      <button
                        className="tw-border tw-p-2"
                        onClick={() => actualizarCantidad(index, 1)}
                      >
                        <Plus className="tw-h-4 tw-w-4" />
                      </button>
                      <button
                        className="tw-text-red-600 tw-p-2"
                        onClick={() => eliminarProducto(index)}
                      >
                        <Trash2 className="tw-h-4 tw-w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="tw-flex tw-justify-between tw-mt-4">
            <span className="tw-text-lg tw-font-semibold">
              Total de la venta:
            </span>
            <span className="tw-text-lg tw-font-bold">
              ${totalPedido.toFixed(2)}
            </span>
          </div>
          <button
            onClick={order}
            className="tw-w-full tw-bg-[#6b46c1] hover:tw-bg-[#553c9a] tw-text-white tw-px-4 tw-py-2 tw-mt-4 tw-rounded-md tw-flex tw-items-center tw-justify-center"
          >
            <ShoppingCart className="tw-mr-2 tw-h-4 tw-w-4 " /> Realizar Venta
          </button>
        </div>
      </div>

      {/* Modal para personalizar producto */}
      {modalAbierto && (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50">
          <div className="tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-w-full tw-max-w-[95%] lg:tw-max-w-[80%] tw-mx-auto tw-h-[80vh] tw-overflow-y-auto">
            <h3 className="tw-text-lg page-heading tw-mb-6">
              Configuración de {productoActual}
            </h3>
            <div className="tw-mb-4">
              {/* Ajustar a 3 columnas */}
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-10">
                {/* Columna 1: Listar y buscar */}
                <div className="tw-mb-4">
                  {/* <p className="tw-font-semibold">Buscar sabores:</p> */}
                  <div className="tw-space-y-4  ">
                    <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                      <input
                        type="text"
                        value={TerminosHelado}
                        onChange={(e) => setTerminosHelado(e.target.value)}
                        placeholder="Buscar el sabor de helado..."
                        className="tw-flex-1 tw-border-[#ff6b00] tw-border tw-p-2 tw-rounded-lg focus:tw-ring-[#ff6b00]"
                      />
                    </div>
                  </div>
                  <div className="tw-h-60 tw-overflow-y-auto tw-border tw-rounded-md tw-p-2">
                    {buscarHelado.map((sabor) => (
                      <div
                        key={sabor.descripcion_insumo}
                        className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b"
                      >
                        <div className="tw-flex-1">
                          <p className="tw-font-semibold">
                            {sabor.descripcion_insumo}
                          </p>
                          <p className="tw-text-sm">
                            {/* Precio: ${sabor.precio.toFixed(2)} */}
                          </p>
                        </div>
                        <div className="tw-flex tw-items-center tw-space-x-2">
                          <button
                            className="tw-border tw-p-2"
                            onClick={() => {
                              añadirInsumo(sabor)

                            }}
                          >
                            <Plus className="tw-h-4 tw-w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna 2: Sabores agregados */}
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">
                  <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-flex tw-items-center tw-justify-center tw-gap-2">

                      Sabores agregados
                    </h4>
                  </div>

                  <div className="tw-max-h-[400px] tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-thumb-gray-200 tw-scrollbar-track-gray-50">
                    {insumosAgregados.length === 0 ? (
                      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8 tw-px-4 tw-text-gray-500">

                        <p className="tw-text-sm">No hay sabores agregados</p>
                      </div>
                    ) : (
                      <div className="tw-divide-y tw-divide-gray-100">
                        {insumosAgregados.map((sabor, index) => (
                          <div
                            key={sabor.descripcion_insumo}
                            className="tw-group hover:tw-bg-gray-50 tw-transition-colors tw-duration-150"
                          >
                            <div className="tw-flex tw-items-center tw-p-4 tw-gap-4">
                              <div className="tw-flex-1 tw-min-w-0">
                                <div className="tw-flex tw-items-center tw-gap-2">
                                  <span className="tw-inline-flex tw-items-center tw-justify-center tw-bg-blue-100 tw-text-blue-800 tw-w-6 tw-h-6 tw-rounded-full tw-text-xs tw-font-medium">
                                    {index + 1}
                                  </span>
                                  <h3 className="tw-font-medium tw-text-gray-900 tw-truncate">
                                    {sabor.descripcion_insumo}
                                  </h3>
                                </div>
                                <div className="tw-mt-1 tw-flex tw-items-center tw-gap-3">
                                  <span className="tw-text-sm tw-text-gray-500">
                                    Precio unitario:
                                  </span>
                                  <span className="tw-text-sm tw-font-medium tw-text-blue-600">
                                    ${sabor.precio.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="tw-flex tw-items-center tw-gap-2">
                                <div className="tw-flex tw-items-center tw-bg-gray-100 tw-rounded-lg tw-p-1">
                                  <button
                                    className="tw-p-1.5 tw-rounded-md hover:tw-bg-white hover:tw-shadow-sm tw-transition-all disabled:tw-opacity-50 disabled:hover:tw-bg-transparent disabled:hover:tw-shadow-none"
                                    onClick={() => handleChangeInsumo(sabor.ID_insumo, -1, 'helado')}
                                    disabled={sabor.Adiciones_Insumos.cantidad <= 0}
                                    title="Disminuir cantidad"
                                  >
                                    <Minus className="tw-h-4 tw-w-4 tw-text-gray-600" />
                                  </button>

                                  <div className="tw-w-12 tw-text-center tw-font-medium tw-text-gray-900">
                                    {sabor.Adiciones_Insumos.cantidad || 0}
                                  </div>

                                  <button
                                    className="tw-p-1.5 tw-rounded-md hover:tw-bg-white hover:tw-shadow-sm tw-transition-all"
                                    onClick={() => añadirInsumo(sabor)}
                                    title="Aumentar cantidad"
                                  >
                                    <Plus className="tw-h-4 tw-w-4 tw-text-gray-600" />
                                  </button>
                                </div>

                                <button
                                  className="tw-p-2 tw-text-gray-400 hover:tw-text-red-600 hover:tw-bg-red-50 tw-rounded-full tw-transition-colors"
                                  onClick={() => eliminarHelado(index)}
                                  title="Eliminar sabor"
                                >
                                  <Trash2 className="tw-h-4.5 tw-w-4.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fila 3 vacía */}
                <div className="tw-mb-4">
                  <h4 className="tw-text-lg page-heading tw-mb-7 tw-text-center">
                    Adiciones
                  </h4>
                  <div className="tw-h-60 tw-overflow-y-auto tw-border tw-rounded-md tw-p-3">
                    {adiciones.map((sabor, index) => (
                      <div
                        key={sabor.descripcion_insumo}
                        className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b"
                      >
                        <div className="tw-flex-1">
                          <p className="tw-font-semibold">
                            {sabor.descripcion_insumo}
                          </p>
                          <p className="tw-text-sm">
                            Precio: ${sabor.precio.toFixed(2)}
                          </p>
                        </div>
                        <div className="tw-flex tw-items-center tw-space-x-2">
                          <button
                            className="tw-border tw-p-2"
                            onClick={() =>
                              handleChangeInsumo(sabor.ID_insumo, -1, 'adicion')
                            }
                          >
                            <Minus className="tw-h-4 tw-w-4" />
                          </button>
                          <span className="tw-w-8 tw-text-center">
                            {sabor.Adiciones_Insumos.cantidad || 0}
                          </span>
                          <button
                            className="tw-border tw-p-2"
                            onClick={() => añadirAdicion(sabor)}
                          >
                            <Plus className="tw-h-4 tw-w-4" />
                          </button>
                          <button
                            className="tw-text-red-600 tw-p-2"
                            onClick={() => eliminarAdicion(index)}
                          >
                            <Trash2 className="tw-h-4 tw-w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Salsas */}
            <div className="tw-mb-5">
              <div className="tw-flex tw-justify-between tw-items-center tw-px-12">
                <p className="tw-font-semibold page-heading">Salsas:</p>
                <p className="tw-font-semibold page-heading">
                  Añadir adiciones:
                </p>
              </div>
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                {/* Columna 1: Salsas */}
                <div>
                  <div className="tw-flex tw-flex-wrap tw-space-x-4">
                    {salsasDisponibles.map((salsa) => (
                      <label
                        key={salsa.ID_insumo}
                        className="tw-flex tw-items-center"
                      >
                        <input
                          type="checkbox"
                          name="salsas"
                          value={salsa.descripcion_insumo}
                          checked={salsasAgregadas.some(
                            (s) => s.ID_insumo === salsa.ID_insumo
                          )}
                          onChange={() => handleSalsaChange(salsa)}
                          className="tw-h-4 tw-w-4"
                        />
                        <span className="tw-text-xs tw-ml-2 capitalize">
                          {salsa.descripcion_insumo}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="tw-relative tw-flex tw-items-center tw-gap-2">
                  {/* Input de búsqueda */}
                  <div className="tw-ml-auto tw-relative">
                    <input
                      className="form-control tw-w-48 tw-p-1"
                      value={TerminosInsumos}
                      onChange={(e) => setTerminosInsumos(e.target.value)} // Actualiza el término de búsqueda
                      onFocus={() => setMenuVisible(true)} // Muestra el menú cuando el input recibe el foco
                      onBlur={() =>
                        setTimeout(() => setMenuVisible(false), 200)
                      } // Oculta el menú cuando el input pierde el foco (con pequeño retraso para permitir clics en opciones)
                      placeholder="Buscar Insumo..."
                    />

                    {/* Menú desplegable hacia arriba, visible solo cuando `menuVisible` es true */}
                    {menuVisible && buscarInsumos.length > 0 && (
                      <div className="tw-absolute tw-bottom-full tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-shadow-lg tw-max-h-40 tw-overflow-y-auto tw-rounded-md">
                        {buscarInsumos
                          .filter((insumo) =>
                            insumo.descripcion_insumo
                              .toLowerCase()
                              .includes(TerminosInsumos.toLowerCase())
                          )
                          .map((insumo) => (
                            <div
                              key={insumo.ID_insumo}
                              onClick={() => {
                                setTerminosInsumos(insumo.descripcion_insumo); // Selecciona el producto
                                setMenuVisible(false); // Oculta el menú
                              }}
                              className="tw-p-2 tw-text-sm tw-cursor-pointer hover:tw-bg-gray-100 tw-flex tw-justify-between tw-items-center"
                            >
                              {/* Descripción del insumo */}
                              <span>{insumo.descripcion_insumo}</span>

                              {/* Botón para añadir el insumo */}
                              <button
                                className="tw-border tw-p-2 tw-rounded-md tw-bg-gray-200 hover:tw-bg-gray-300"
                                onClick={() => añadirAdicion(insumo)} // Función para añadir producto
                              >
                                <Plus className="tw-h-4 tw-w-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-flex tw-justify-between">
              <button
                onClick={() => setModalAbierto(false)}
                className="tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={agregarProducto}
                className="tw-bg-[#6b46c1] hover:tw-bg-[#553c9a] tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
              >
                Agregar al pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

