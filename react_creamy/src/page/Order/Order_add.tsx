import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Package,
} from "lucide-react";
import api from "../../api/api";
import { toast } from "react-hot-toast";
// import Productos from "../Products/products-list";
// import Productos from "../Products/products-list";

// const saboresDisponibles = [
//   "Vainilla", "Chocolate", "Fresa", "Menta", "Dulce de Leche",
//   "Pistacho", "Cookies & Cream", "Mango", "Limón", "Café"
// ]

type Insumo_adicion = {
  ID_insumo: number;
  descripcion_insumo: string;
  ID_tipo_Insumo: number;
  precio: number;
  Adiciones_Insumos: {
    cantidad: number;
    total: number;
  };
};


type Configuracion = {
  cantidad: number;
  total: number;
  Insumos: Insumos[];
};





// type Tipo_Insumo = {
//   ID_tipo_Insumo : number,
//   descripcion_tipo : string
// }

// type Adiciones = {
//   ID_adicion: number;
//   cantidad: number;
//   total: number;
//   Productos_adiciones: {
//     cantidad: number;
//   };
//   insumos: Insumo_adicion[];
// };

type Insumos = {
  ID_insumo: number;
  descripcion_insumo: string;
  precio: number;
};

type Producto = {
  ID_producto: number | null;
  nombre: string;
  precio_neto: number;
  Producto_Pedidos: {
    cantidad: number;
    sub_total: number;
  };
  adicion: Insumo_adicion[];
};

type Pedido = {
  fecha: string;
  ID_clientes: number | string;
  precio_total: number;
  ID_estado_pedido: number | string;
  ProductosLista: Producto[];
};

export default function OrderAdd() {
  // const [Pedidos, setPedidos] = useState<Pedido[]>([]);

  const [productoActual, setProductoActual] = useState<string | null>(null);
  const [IDActual, SetIDActual] = useState<number | null>(null);
  const [precioNeto, SetIPrecioNeto] = useState<number | null>(0);
  // const [productosActual, setProductoActual] = useState<Producto[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  //PRODUCTOS
  const [searchTerm, setSearchTerm] = useState("");
  const [busqueda, setBusqueda] = useState<Producto[]>([]);
  const [productosAgregados, setProductosAgregados] = useState<Producto[]>([]);


  const [configuracion, setConfiguracion] = useState<Configuracion[]>([]);
  // const [saboresSeleccionados, SetsaboresSeleccionados] = useState<[]>([]);
  const [TerminosHelado, setTerminosHelado] = useState("");
  const [buscarHelado, setBuscarHelado] = useState<Insumo_adicion[]>([]);
  const [insumosAgregados, setInsumoAgregados] = useState<Insumo_adicion[]>([]);

  const [salsasAgregadas, setsalsasAgregadas] = useState<Insumo_adicion[]>([]);
  const [salsasDisponibles, setSalsaDisponibles] = useState<Insumo_adicion[]>(
    []
  );

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm2, setDebouncedSearchTerm2] =
    useState(TerminosHelado);

  const [TerminosInsumos, setTerminosInsumos] = useState("");
  const [buscarInsumos, setBuscarInsumos] = useState<Insumo_adicion[]>([]);
  const [adiciones, setadiciones] = useState<Insumo_adicion[]>([]);
  const [debouncedSearchTerm3, setDebouncedSearchTerm3] =
    useState(TerminosHelado);
  const [menuVisible, setMenuVisible] = useState(false);

  const [General, setGeneral] = useState<Insumo_adicion[]>([]);
  // const [totalAdiciones, setTotaladiciones] = useState(Number);
  useEffect(() => {
    const combinedArray = [
      ...salsasAgregadas,
      ...insumosAgregados,
      ...adiciones,
    ];

    const arrayGeneralizado = generalizarItems(combinedArray);

    console.log(arrayGeneralizado);
    setGeneral(arrayGeneralizado);
  }, [salsasAgregadas, insumosAgregados, adiciones]);

  useEffect(() => {
    // Configura un temporizador que actualiza el término de búsquedaaa
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Solo se actualiza después de 500ms
    }, 600);

    // Limpia el temporizador si el usuario sigue escribiendo antes de que se complete
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Se ejecuta cada vez que cambia el término de búsqueda

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
    if (!debouncedSearchTerm) {
      fetchPedidos();
    } else {
      const productosFiltrados = busqueda.filter(
        (producto) =>
          producto.nombre
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (producto.ID_producto?.toString() ?? "").includes(
            debouncedSearchTerm.toLowerCase()
          )
      );
      setBusqueda(productosFiltrados);
    }
  }, [debouncedSearchTerm]); // Solo filtra cuando el término de búsqueda "debounced" se actualiza

  useEffect(() => {
    if (!debouncedSearchTerm2) {
      fetchPedidos();
    } else {
      const heladosFiltrados = buscarHelado.filter((helado) =>
        helado.descripcion_insumo
          .toLowerCase()
          .includes(debouncedSearchTerm2.toLowerCase())
      );
      setBuscarHelado(heladosFiltrados);
    }
  }, [debouncedSearchTerm2]);

  useEffect(() => {
    if (!debouncedSearchTerm3) {
      fetchPedidos();
    } else {
      const InsumosFiltrados = buscarInsumos.filter((insumos) =>
        insumos.descripcion_insumo
          .toLowerCase()
          .includes(debouncedSearchTerm3.toLowerCase())
      );
      setBuscarInsumos(InsumosFiltrados);
    }
  }, [debouncedSearchTerm3]);

  const fetchPedidos = async () => {
    const url_productos = `/productos`;
    const url_insumos = `/insumos?ID_tipo_insumo=2`;
    const url_salsa = `/insumos?ID_tipo_insumo=3`;
    const url_total_insumos = `/insumos`;

    const response_productos = await api.get(url_productos);
    const response_insumos = await api.get(url_insumos);
    const response_salsas = await api.get(url_salsa);
    const response_total_insumos = await api.get(url_total_insumos);

    if (response_productos.status === 200 && response_insumos.status === 200) {
      const data_producto: Producto[] = await response_productos.data;
      const data_insumos: Insumo_adicion[] = await response_insumos.data;
      const data_salsas: Insumo_adicion[] = await response_salsas.data;
      const data_total_insumos: Insumo_adicion[] =
        await response_total_insumos.data;

      setBuscarHelado(data_insumos);
      setSalsaDisponibles(data_salsas);
      setBusqueda(data_producto);
      setBuscarInsumos(data_total_insumos);

      // console.log("Productos", data_producto);
    } else {
      console.error("Error al cargar los insumos");
    }
  };

  const añadirInsumo = (insumo: Insumo_adicion) => {
    const AdicionExists = insumosAgregados.some(
      (input) => input.descripcion_insumo === insumo.descripcion_insumo
    );

    if (AdicionExists) {
      updateQuantity(insumo.descripcion_insumo, 1);
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
          ID_tipo_Insumo: insumo.ID_tipo_Insumo,
          Adiciones_Insumos: {
            cantidad: 1,
            total: 0,
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
      if (insumo.ID_insumo <= 2) {
        updateQuantityInsumos(insumo.ID_insumo, 1);
        // Mostramos un mensaje toast
      }
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
          ID_tipo_Insumo: insumo.ID_tipo_Insumo,
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
          ID_tipo_Insumo: salsa.ID_tipo_Insumo,
          Adiciones_Insumos: {
            cantidad: 1,
            total: salsa.precio,
          },
        },
      ];

      setsalsasAgregadas(nuevaSalsa);
    }
  };

  const generalizarItems = (array: Insumo_adicion[]) => {
    return array.reduce((acc: Insumo_adicion[], item) => {
      // Verifica si el objeto Adiciones_Insumos existe
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
        // Sumar la cantidad y el total de los items duplicados
        if (
          existingItem.Adiciones_Insumos &&
          typeof existingItem.Adiciones_Insumos.cantidad === "number"
        ) {
          existingItem.Adiciones_Insumos.cantidad +=
            item.Adiciones_Insumos.cantidad;
          existingItem.Adiciones_Insumos.total +=
            item.Adiciones_Insumos.cantidad * item.precio;
        }
      } else {
        // Agregar el item con su total, incluso si el total es 0
        acc.push({
          ...item,
          Adiciones_Insumos: {
            cantidad: item.Adiciones_Insumos.cantidad,
            total: item.Adiciones_Insumos.total, // Esto puede ser 0 y aún así se agrega
          },
        });
      }

      return acc;
    }, []);
  };

  // const agregarProducto = () => {
  //   if (productoActual) {
  //     // Actualiza el estado con los nuevos productos agregados
  //     setProductosAgregados((prevProductos) => [
  //       ...prevProductos,
  //       {
  //         ID_producto: IDActual,
  //         nombre: productoActual ?? "",
  //         precio_neto: precioNeto ?? 0,
  //         Producto_Pedidos: {
  //           cantidad: 1,
  //           precio_neto: precioNeto ?? 0,
  //           sub_total: (precioNeto ?? 0) * 1,    
  //         },
  //         adicion: General.length > 0 ? General : []
  //       },
  //     ]);

  //     // Cierra el modal y restablece el producto actual
  //     setModalAbierto(false);
  //     setProductoActual(null);
  //   }
  // };

  const agregarProducto = () => {
    if (productoActual) {
      setProductosAgregados((prevProductos) => {
        // Buscamos si ya existe el producto en la lista
        const productoExistente = prevProductos.find(
          (producto) => producto.ID_producto === IDActual
        );
  
        if (productoExistente) {
          // Si existe, actualizamos su cantidad y subtotal
          return prevProductos.map((producto) =>
            producto.ID_producto === IDActual
              ? {
                  ...producto,
                  Producto_Pedidos: {
                    ...producto.Producto_Pedidos,
                    cantidad: producto.Producto_Pedidos.cantidad + 1,
                    sub_total:
                      (producto.Producto_Pedidos.cantidad + 1) *
                      producto.precio_neto,
                  },
                  adicion: General.length > 0 ? General : producto.adicion,
                }
              : producto
          );
        } else {
          // Si no existe, lo añadimos como un nuevo producto
          return [
            ...prevProductos,
            {
              ID_producto: IDActual,
              nombre: productoActual ?? "",
              precio_neto: precioNeto ?? 0,
              Producto_Pedidos: {
                cantidad: 1,
                precio_neto: precioNeto ?? 0,
                sub_total: (precioNeto ?? 0) * 1,
              },
              adicion: General.length > 0 ? General : [],
            },
          ];
        }
      });
  
      // Cierra el modal y restablece el producto actual
      setModalAbierto(false);
      setProductoActual(null);
    }
  };
  console.log(insumosAgregados);
  console.log(productosAgregados);

  // useEffect(() => {
  //   console.log(productosAgregados);
  // }, [productosAgregados]);

  const order = async () => {
    const pedido: Pedido = {
      fecha: new Date().toISOString(),
      ID_clientes: 1,
      precio_total: totalPedido,
      ID_estado_pedido: 1,
      ProductosLista: productosAgregados,
    };
    console.log(pedido);
    const url_order = `/pedidos`;

    try {
      await api.post(url_order, pedido, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("El pedido ha sido agregado exitosamente.");
    } catch {
      toast.error(
        "No se pudo agregar la categoría. Por favor, intente nuevamente."
      );
    }
  };

  const eliminarHelado = (index: number) => {
    setInsumoAgregados((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarAdicion = (index: number) => {
    setadiciones((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (id: string, amount: number) => {
    const newInputs = insumosAgregados.map((input) => {
      let newQuantity = isNaN(input.Adiciones_Insumos.cantidad + amount)
        ? 1
        : input.Adiciones_Insumos.cantidad + amount;
      // const precio = isNaN(input.precio * newQuantity)? 1: input.precio * newQuantity;

      if (newQuantity < 1) {
        newQuantity = 1;
      }

      if (input.descripcion_insumo === id) {
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

    setInsumoAgregados(newInputs);
  };

  const updateQuantityInsumos = (id: number, amount: number) => {
    const newInputs = adiciones.map((input) => {
      let newQuantity = isNaN(input.Adiciones_Insumos.cantidad + amount)
        ? 1
        : input.Adiciones_Insumos.cantidad + amount;
      // const precio = isNaN(input.precio * newQuantity)? 1: input.precio * newQuantity;

      if (newQuantity < 1) {
        newQuantity = 1;
      }

      if (input.ID_insumo === id) {
        return {
          ...input,
          Adiciones_Insumos: {
            ...input.Adiciones_Insumos,
            cantidad: newQuantity,
            total: newQuantity * input.precio,
          },
        };
      }
      return input;
    });

    setadiciones(newInputs);
  };
  const Adiciones_total = General.reduce(
    (sum,adicion) => sum + adicion.Adiciones_Insumos.total,0
  );


  const actualizarCantidad = (index: number, incremento: number) => {
    setProductosAgregados((prev) =>
      prev.map((producto, i) =>
        i === index
          ? {
              ...producto,
              Producto_Pedidos: {
                ...producto.Producto_Pedidos,
                cantidad: Math.max(
                  1,
                  producto.Producto_Pedidos.cantidad + incremento
                )
                
              },
            }
          : producto
      )
      
    );
    
  };

  const totalPorId = productosAgregados.reduce((acc, producto) => {
    const id = producto.ID_producto; // Asegúrate de que este es el ID correcto
    if (id !== null) {
      if (!acc[id]) {
        acc[id] = 0;
      }
      acc[id] += producto.Producto_Pedidos.cantidad;
    }
    return acc;
  }, {} as { [key: number]: number })

  console.log(totalPorId[1]); // Aquí puedes ver el total por ID en la consola



  const eliminarProducto = (index: number) => {
    setProductosAgregados((prev) => prev.filter((_, i) => i !== index));
  };
  
  // const [subtotal, setSubtotal] = useState<number>(0);

  const totalPedido = productosAgregados.reduce(
    (sum, producto) =>
      sum + (producto.precio_neto * producto.Producto_Pedidos.cantidad) + (Adiciones_total * producto.Producto_Pedidos.cantidad),
    0
  );

  // const Sub = () => {
  //   const newSubtotal = productosAgregados.reduce(
  //     (sum, producto) =>
  //       sum + (producto.precio_neto * producto.Producto_Pedidos.cantidad) + (Adiciones_total * producto.Producto_Pedidos.cantidad),
  //     0
  //   );
  //   setSubtotal(newSubtotal);
  //   return newSubtotal;
  // }

  // const subtotal = productosAgregados.reduce(
  //   (sum, producto) =>
  //     sum + (producto.precio_neto * producto.Producto_Pedidos.cantidad)+ (Adiciones_total*producto.Producto_Pedidos.cantidad),
  //   0
  // );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  }

  console.log(`VALOR TOTAL DE LAS ADICIONES ${ Adiciones_total}`);	

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
          <div className="tw-relative tw-mb-4">
            <Search className="tw-absolute tw-left-2 tw-top-2.5 tw-h-4 tw-w-4 tw-text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tw-pl-8 tw-py-2 tw-border tw-rounded-md tw-w-full"
            />
          </div>
          <div className="tw-h-60 tw-overflow-y-auto">
            {busqueda.map((producto) => (
              <div
                key={producto.ID_producto}
                className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-px-4"
              >
                <div className="tw-flex tw-gap-6">
                  <span>{producto.ID_producto}</span>
                  <span>{producto.nombre}</span>
                </div>
                <button
                  className=" tw-bg-[#6b46c1] hover:tw-bg-[#553c9a] tw-text-white tw-border tw-px-4 tw-py-2 tw-rounded-md tw-text-sm  "
                  onClick={() => {
                    setProductoActual(producto.nombre);
                    SetIDActual(producto.ID_producto);
                    SetIPrecioNeto(producto.precio_neto);
                    // ID(producto);
                    setModalAbierto(true);
                  }}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
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
      
            <p className="tw-text-sm">
              Adiciones:{" "}
              {producto.adicion.map((adicion) => (
                <span key={adicion.ID_insumo}>{adicion.descripcion_insumo}, </span>
              ))}
            </p>
      
            {/* Calculo del subtotal para cada producto */}
            <p className="tw-text-sm">
              Subtotal: $
              {(
                producto.precio_neto * producto.Producto_Pedidos.cantidad +
                producto.adicion.reduce(
                  (sum, adicion) => sum + adicion.precio * producto.Producto_Pedidos.cantidad,
                  0
                )
              ).toFixed(2)}
            </p>
      
            <div className="tw-flex tw-items-center tw-space-x-2">
              <button
                className="tw-border tw-p-2"
                onClick={() => actualizarCantidad(index, -1)}
              >
                <Minus className="tw-h-4 tw-w-4" />
              </button>
              <span className="tw-w-8 tw-text-center">
                {producto.Producto_Pedidos.cantidad}
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
              Total del Pedido:
            </span>
            <span className="tw-text-lg tw-font-bold">
              ${totalPedido.toFixed(2)}
            </span>
          </div>
          <button
            onClick={order}
            className="tw-w-full tw-bg-[#6b46c1] hover:tw-bg-[#553c9a] tw-text-white tw-px-4 tw-py-2 tw-mt-4 tw-rounded-md tw-flex tw-items-center tw-justify-center"
          >
            <ShoppingCart className="tw-mr-2 tw-h-4 tw-w-4 " /> Realizar Pedido
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
                            onClick={() => añadirInsumo(sabor)}
                          >
                            <Plus className="tw-h-4 tw-w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna 2: Sabores agregados */}
                <div className="tw-mb-4">
                  <h4 className="tw-text-lg page-heading tw-mb-7 tw-text-center">
                    Sabores agregados
                  </h4>
                  <div className="tw-h-60 tw-overflow-y-auto tw-border tw-rounded-md tw-p-3">
                    {insumosAgregados.map((sabor, index) => (
                      <div
                        key={sabor.descripcion_insumo}
                        className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b"
                      >
                        <div className="tw-flex-1">
                          <p className="tw-font-semibold">
                            {sabor.descripcion_insumo}
                          </p>
                          <p className="tw-text-sm">Precio: ${0}</p>
                        </div>
                        <div className="tw-flex tw-items-center tw-space-x-2">
                          <button
                            className="tw-border tw-p-2"
                            onClick={() =>
                              updateQuantity(sabor.descripcion_insumo, -1)
                            }
                          >
                            <Minus className="tw-h-4 tw-w-4" />
                          </button>
                          <span className="tw-w-8 tw-text-center">
                            {sabor.Adiciones_Insumos.cantidad || 0}
                          </span>
                          <button
                            className="tw-border tw-p-2"
                            onClick={() => añadirInsumo(sabor)}
                          >
                            <Plus className="tw-h-4 tw-w-4" />
                          </button>
                          <button
                            className="tw-text-red-600 tw-p-2"
                            onClick={() => eliminarHelado(index)}
                          >
                            <Trash2 className="tw-h-4 tw-w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                              updateQuantityInsumos(sabor.ID_insumo, -1)
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
                      placeholder="Buscar producto..."
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

