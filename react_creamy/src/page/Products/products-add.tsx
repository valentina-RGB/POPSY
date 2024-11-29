import React, { useState, ChangeEvent, DragEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import {UploadIcon } from "lucide-react";
import Modal from "react-modal";

import { XIcon, PlusIcon, MinusIcon, SearchIcon } from 'lucide-react';


Modal.setAppElement("#root");


type Insumo = {
  ID_insumo: number;
  descripcion_insumo: string;
  estado_insumo: string;
  precio: number;
  stock_bola: number;
  ID_tipo_insumo: number;
  Producto_insumos: {
    cantidad: number;
    precio: number;
  };
};

interface AddProducto {
  onClose: () => void;
  id: number | undefined;
}

const AddProductos: React.FC<AddProducto> = ({ onClose, id}) => {
  const [descripcion, setDescripcion] = useState<string>("");
  const [estado, setEstado] = useState<string>("A");
  const [imagen, setImagen] = useState("");
  const [categorias, setCategorias] = useState<Array<{ ID_categoria: number; descripcion: string }>>([]);
  // const [Insumos, setInsumos] = useState<Insumo[]>([]);
  const [tipo, setTipo] = useState<Array<{ ID_tipo_producto: number; descripcion: string }>>([]);
  const [error, setError] = useState<string | unknown>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    nombre:"",
    insumos:"",
    categorias:"",
    tipo_productos: ""
  });

  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    precio_neto: number;
    ID_estado_productos: number | string;
    ID_tipo_productos: number | string;
    ID_categorias: number | string;
    stock_bola: number | string;
    imagen: File | null;
    Insumos: Insumo[]
  }>({
    nombre: "",
    descripcion: "",
    precio_neto: 0,
    ID_estado_productos: 0,
    ID_tipo_productos: 0,
    stock_bola:0,
    ID_categorias: 0, // Por ejemplo, inicializar como 0
    imagen: null,
    Insumos: []
  });

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (err: unknown) {
      console.error("Error al cargar las categorías :", err);
      setError(err);
    }
  };

  const fetchTipo = async () => {
    try {
      const response = await api.get("/tipo_producto");
      setTipo(response.data);
    } catch (err: unknown) {
      console.error("Error al cargar el  tipo de producto :", err);
      setError(err);
    }
  };


  

  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchTipo();
    fetchCategorias();

  };


  useEffect(() => {
    fetchTipo();
    fetchCategorias();

    if(id){
      console.log('Holaaaaaa')
      const fetchProducto = async () => {
        try {
          const response = await api.get(`/productos/${id}`);
          const producto = response.data;
          const {Insumos} = producto;
          setFormData(producto);
          setInputs(Insumos);
        }catch (error) {
          toast.error(String(error));
        }
      }
      fetchProducto();
    }
  }, []);

  // 2. Manejo de cambio en los inputs

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "descripcion") {
      setErrors((prev) => ({ ...prev, descripcion: "" }));
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, imagen: file }));
      setErrors((prev) => ({ ...prev, imagen: "" }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio_neto: formData.precio_neto,
      ID_estado_productos: formData.ID_estado_productos,
      ID_tipo_productos: formData.ID_tipo_productos,
      ID_categorias: formData.ID_categorias,
      stock_bola: Number(formData.stock_bola)||0, 
      imagen: formData.imagen || '',
      Insumos: inputs
    };
    console.log(data)

    const newErrors = { nombre: "", insumos:"", categorias: "", tipo_productos: "" };
 

    if (!formData.ID_categorias) {
      newErrors.categorias = "Campo obligatorio";
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "Campo obligatorio";
    }

    if(!formData.ID_tipo_productos){
      newErrors.tipo_productos = "Campo obligatorio"
    }
    if (inputs.length <=0){
        newErrors.insumos= 'Debes agregar almenos 1 insumo';
      
    }


    //VALIDACIONES 
    setErrors(newErrors); 

      if(id && !newErrors.nombre && !newErrors.categorias && !newErrors.tipo_productos && !newErrors.insumos){
          try {
          await api.put(`/productos/${id}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          onClose();
          toast.success("El producto ha sido actualizado exitosamente.");
          navigate("/productos");
          resetForm();
        } catch (error) {
          toast.error(
            "No se pudo actualizar el producto . Por favor, intente nuevamente."
          );
          setError(error);
        }

      }else{
        if (!newErrors.nombre && !newErrors.categorias && !newErrors.tipo_productos && !newErrors.insumos) {
        try {
          await api.post("/productos", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          onClose();
          toast.success("El producto se a agregado exitosamente.");
          navigate("/productos");
          resetForm();
        } catch (error) {
          toast.error(
            "No se pudo agregar el producto . Por favor, intente nuevamente."
          );
          setError(error);
        }
      }
    }
  };


  
 

  // useEffect(() => {

  //   const newErrors = { nombre: "", insumos:"", categorias: "", tipo_productos: "" };
    
   

  //   setErrors(newErrors);

  // }),[formData.nombre]
  
  const resetForm = () => {
    setDescripcion(descripcion);
    setEstado(estado);
    setImagen(imagen);
  }


    // DESDE AQUI SE HACE LA CREACIÓN DE INSUMOS

        // Manejo de la búsqueda de insumos

    const [searchTerm, setSearchTerm] = useState("") //LO USARE PARA BUSCAR INSUMOS
    const [inputs, setInputs] = useState<Insumo[]>([]);
    const [searchResults, setSearchResults] =  useState<Insumo[]>([]);

      
    const loadInputs = async () => {
      try {
        const response = await api.get("/Insumos");
        const data = await response.data.filter((insumos:Insumo) => insumos.estado_insumo === 'A');
        setSearchResults(data);
    
      } catch (error) {
        console.error("Error al cargar los insumos:", error);
      }
    };

useEffect(() => {
  if (!searchTerm) {
    loadInputs(); // Si no hay un término de búsqueda, mostrar todos los insumos
  } else {
    const filteredInputs = searchResults.filter((input) =>
      input.descripcion_insumo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredInputs); // Actualizar los resultados de la búsqueda
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm]);


  // Función para agregar un insumo a la lista
  const addInput = (insumo: Insumo) => {
    const productExists = inputs.some((input) => input.ID_insumo === insumo.ID_insumo);
   
    if (productExists) {
    updateQuantity(insumo.ID_insumo, 1);
    // Mostramos un mensaje toast
    toast.success(`La cantidad de ${insumo.descripcion_insumo} ha sido actualizada.`);
  } else {
   
   
    setInputs([
      
      ...inputs,
      { 
        ID_insumo: insumo.ID_insumo, 
        descripcion_insumo: insumo.descripcion_insumo,
        estado_insumo: insumo.estado_insumo,
        precio: insumo.precio,
        stock_bola: insumo.stock_bola,
        ID_tipo_insumo: insumo.ID_tipo_insumo,
        Producto_insumos: {
          cantidad: + 1 ,
          precio: insumo.precio,
        }
      }
    ]);
    
    // Mostramos un mensaje toast
    toast.success(`${insumo.descripcion_insumo} ha sido actualizado.`);
    return inputs;
  }
  };



    const updateQuantity = (id: number, amount: number) => {
      const newInputs = inputs.map((input) => {
        if (input.ID_insumo === id) {
          const newQuantity = isNaN(input.Producto_insumos.cantidad + amount)? 1: input.Producto_insumos.cantidad + amount;
          const precio = isNaN(input.precio * newQuantity)? 1: input.precio * newQuantity;
          return {
            ...input,
            Producto_insumos: {
              ...input.Producto_insumos,
              cantidad: newQuantity,
              precio: precio
            },
          };
        }
        return input;
      });
      setInputs(newInputs);
    };

    const calcularSumaTotalPrecios = () => {
      // Suma todos los precios de los insumos
      const totalPrecio = inputs.reduce((acumulador, input) => {
        return acumulador + input.Producto_insumos.precio;
      }, 0); // El '0' es el valor inicial del acumulador.
    
      return totalPrecio;
    };


    const calcularPrecioRecomentado = () => {
      // Suma todos los precios de los insumos
      const totalPrecio = inputs.reduce((acumulador, input) => {
        return acumulador + (input.Producto_insumos.precio * 0.80) + input.Producto_insumos.precio;
      }, 0); // El '0' es el valor inicial del acumulador.
    
      return totalPrecio;
    };

    const totalPrecio = calcularSumaTotalPrecios();


    const precio_recomentado = calcularPrecioRecomentado();

    const removeInput = (id: number) => {
      const newInputs = inputs.filter((input) => input.ID_insumo !== id);
      setInputs(newInputs);
    };
    setSearchTerm


  const resetFormInsumos = () => {
    
    inputs.pop()
    handleCloseModal()
  }


  
  return (
    <>
    <p>{error?.toString()}</p>
      <div className="tw-bg-[#f8faf] dark:tw-bg-[#f5f3ff] tw-p-6 tw-rounded-lg tw-shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-2">
              <h2 className="tw-text-2xl tw-font-bold tw-text-[#6b46c1]">
                {id ? "Editar Producto" : "Agregar Producto"}
              </h2>
              <p className="tw-text-gray-500 dark:tw-text-gray-400">
                Completa los siguientes campos para agregar un nuevo producto a tu
                catálogo.
              </p>
            </div>
          </div>
          <div className="tw-mb-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">

            {/* Columna de información del producto */}
            <div className="tw-col-span-2 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="nombre"
                  className="tw-text-gray-800 dark:tw-text-gray-800"
                >
                  Nombre 
                  <span className="tw-text-[#f31515]">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                  className={`tw-h-9 tw-border tw-mt-1 tw-block tw-w-full tw-rounded-md tw-shadow-sm ${
                    errors.nombre ? 'tw-border-red-500' : 'tw-border-gray-300'
                  } tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]`}
                />
                 {errors.nombre && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.nombre}</p>}
              </div>
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="price"
                  className="tw-text-gray-800 dark:tw-text-gray-800">
                  Precio recomendado: {precio_recomentado}
                  <span className="tw-text-[#f31515]">*</span>
                </label>
                <div className="input-group">
                <span className="tw-h-9 tw-border input-group-text dark:tw-bg-[#a78bfa]">$</span>
                <input
                  id="price"
                  type="number"
                  min="1000"
                  max="50000"
                  name = "precio_neto"
                  value = {formData.precio_neto}
                  onChange={handleInputChange}
                  step="100"
                  placeholder="Ingresa el precio"
                  className="tw-h-9 tw-border tw-w-40 tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]"
                />

                </div>
               
              </div>
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="ID_categorias"
                  className="tw-text-gray-800 dark:tw-text-gray-800">
                  Categoría
                  <span className="tw-text-[#f31515]">*</span>
                </label>
                <select
                  id="ID_categorias"
                  name="ID_categorias"
                  value={formData.ID_categorias}
                  onChange={handleInputChange}
                  className="tw-h-9 tw-border tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]"  
                >
                  <option value={0} disabled>
                    Selecciona un producto
                  </option>
                  {categorias.map((c) => (
                    <>
                    <option key={c.ID_categoria} value={c.ID_categoria}>
                      {c.descripcion}
                    </option>
                    </>
                    
                  ))}
                </select>
                {errors.categorias && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.categorias}</p>}
              </div>
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="type"
                  className="tw-text-gray-600 dark:tw-text-gray-400">
                  Tipo de Producto
                <span className={`tw-text-[#f31515] ${errors.tipo_productos ?'tw-text-[#f31515]' :'tw-border-gray-300'}`}>*</span>
                
                </label>
                <select
                  id="type"
                  name="ID_tipo_productos"
                  value={formData.ID_tipo_productos}
                  onChange={handleInputChange}
                  className=" tw-h-9 tw-border tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]"
                >
                  <option value={0} disabled>
                    Selecciona un tipo
                  </option>
                  {tipo.map((t) => (
                    <option key={t.ID_tipo_producto} value={t.ID_tipo_producto}>
                      {t.descripcion}
                    </option>
                  ))}
                  ;
                </select>
                {errors.tipo_productos && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.tipo_productos}</p>}
              </div>
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="stock_bola"
                  className="tw-text-gray-800 dark:tw-text-gray-800">
                stock del helado
                
                </label>
                <input
                  id="stock_bola"
                  name="stock_bola"
                  type="number"
                  value={formData.stock_bola}
                  onChange={handleInputChange}
                  placeholder="1 bola"
                  className={`tw-mt-1 tw-block tw-w-32 tw-h-8 tw-rounded tw-border tw-shadow-sm tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]`}/>
                 
              </div>
              <div className="tw-grid tw-gap-2">
                <label
                  htmlFor="descripcion"
                  className="tw-text-gray-600 dark:tw-text-gray-400"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe el producto"
                  className=" tw-bg-[#b570dd21] dark:tw-bg-[#ddd6fe] tw-text-gray-700 dark:tw-text-gray-800 tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-p-2 focus:tw-ring-[#6b46c1] focus:tw-border-[#6b46c1]"
                />
              </div>
            </div>
            {/* Columna de imagen del producto */}
            <div className="tw-space-y-2">
              <label
                htmlFor="image"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
              >
                Imagen
              </label>
              <div
                className={`tw-border-2 tw-border-dashed tw-rounded-lg tw-p-4 tw-text-center ${dragActive ? "tw-border-indigo-400" : "tw-border-gray-300"
                  } `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="image"
                  name="imagen"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] || null)
                  }
                  className="tw-hidden"
                />
                {preview ? (
                  <div className="tw-relative tw-w-full tw-h-48">
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="tw-w-full tw-h-full tw-object-cover tw-rounded-lg"
                    />
                    <button
                      type="button"
                      className="tw-absolute tw-top-2 tw-right-2 tw-px-2 tw-py-1 tw-bg-white tw-text-gray-700 tw-text-sm tw-rounded tw-shadow"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, imagen: null }));
                        setPreview(null);
                      }}
                    >
                      {" "}
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="tw-cursor-pointer">
                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8">
                      <UploadIcon className="tw-w-12 tw-h-12 tw-text-gray-400" />
                      <p className="tw-mt-2 tw-text-sm tw-text-gray-500">
                        Arrastra y suelta una imagen aquí, o haz clic para
                        seleccionar
                      </p>
                    </div>
                  </label>
                )}
              </div>
              
            </div>

          </div>



          {/* 
      AGREGAR INSUMOS */}
        <Modal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4"
      overlayClassName="tw-fixed tw-inset-0 tw-bg-black/40 tw-backdrop-blur-sm tw-z-50"
    >
      <div className="tw-bg-white tw-w-full tw-max-w-5xl tw-rounded-lg tw-shadow-lg tw-max-h-[90vh]">
        {/* Header */}
        <div className="tw-border-b tw-p-4">
          <div className="tw-flex tw-items-center tw-justify-between">
              <h4 className="tw-text-xl tw-font-semibold">¡Insumos!</h4>
            <button 
              onClick={handleCloseModal}
              className="tw-rounded-lg tw-p-2 tw-text-gray-500 hover:tw-bg-gray-100"
            >
              <XIcon className="tw-w-5 tw-h-5" />
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-p-4 tw-h-[calc(90vh-8rem)]">
          {/* Left Column - Search and Results */}
          <div className="tw-flex tw-flex-col tw-h-full">
            <div className="tw-relative tw-mb-4">
              <SearchIcon className="tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400 tw-w-5 tw-h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar insumo..."
                className="tw-w-full tw-pl-10 tw-pr-4 tw-py-2 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-ring-purple-200 focus:tw-border-purple-400"
              />
            </div>

            <div className="tw-flex-1 tw-overflow-y-auto tw-border tw-rounded-lg tw-p-3">
              {searchResults.map((input, index) => (
                <div key={index} className="tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b last:tw-border-0 hover:tw-bg-gray-50">
                  <span className="tw-text-sm">{input.descripcion_insumo}</span>
                  <button
                    onClick={() => addInput(input)}
                    className="tw-bg-green-100 tw-text-green-700 tw-rounded tw-px-3 tw-py-1.5 hover:tw-bg-green-200 tw-text-sm"
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Added Items */}
          <div className="tw-flex tw-flex-col tw-h-full tw-border-t md:tw-border-t-0 md:tw-border-l tw-pt-4 md:tw-pt-0 md:tw-pl-4">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h3 className="tw-font-medium">Insumos Agregados</h3>
              <span className="tw-bg-purple-100 tw-text-purple-700 tw-px-3 tw-py-1 tw-rounded tw-text-sm">
                Total: {totalPrecio}
              </span>
            </div>

            <div className="tw-flex-1 tw-overflow-y-auto tw-border tw-rounded-lg tw-p-3">
              {inputs.map((input) => (
                <div key={input.ID_insumo} className="tw-p-3 tw-border-b last:tw-border-0">
                  <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                    <span className="tw-text-sm">{input.descripcion_insumo}</span>
                    <button
                      onClick={() => removeInput(input.ID_insumo)}
                      className="tw-text-gray-400 hover:tw-text-red-500"
                    >
                      <XIcon className="tw-w-4 tw-h-4" />
                    </button>
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-between tw-bg-gray-50 tw-rounded tw-p-2">
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <button
                        onClick={() => updateQuantity(input.ID_insumo, -1)}
                        disabled={input.Producto_insumos.cantidad <= 1}
                        className="tw-text-gray-500 hover:tw-text-gray-700 disabled:tw-opacity-50"
                      >
                        <MinusIcon className="tw-w-4 tw-h-4" />
                      </button>
                      <span className="tw-text-sm tw-w-8 tw-text-center">
                        {input.Producto_insumos.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(input.ID_insumo, 1)}
                        className="tw-text-gray-500 hover:tw-text-gray-700"
                      >
                        <PlusIcon className="tw-w-4 tw-h-4" />
                      </button>
                    </div>
                    <span className="tw-text-sm tw-font-medium">
                      ${input.Producto_insumos.precio}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tw-border-t tw-p-4 tw-bg-gray-50">
          <div className="tw-flex tw-justify-end tw-gap-3">
            <button
              onClick={resetFormInsumos}
              className="tw-px-4 tw-py-2 tw-border tw-rounded tw-text-gray-600 hover:tw-bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleCloseModal}
              className="tw-px-4 tw-py-2 tw-bg-purple-500 tw-text-white tw-rounded hover:tw-bg-purple-600"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </Modal>
      <div className="tw-mt-4 tw-flex tw-place-content-between tw-gap-2">
          <button
            type="submit"
          className="tw-px-4 tw-py-2 tw-bg-purple-500 tw-text-white tw-rounded hover:tw-bg-purple-600">
            Guardar Producto
          </button>
          
          <button             
              onClick={() => handleModal()}
              type="button"
              className="tw-bg-green-100 tw-text-green-700 tw-rounded tw-px-3 tw-py-1.5 hover:tw-bg-green-200 "
              >Añadir insumos 
          </button>
              {errors.insumos && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.insumos}</p>}

          </div>
       
      

        </form>
      </div>




    </>
  );
}
// function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M5 12h14" />
//     </svg>
//   );
// }

// function PlusIcon(props:React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M5 12h14" />
//       <path d="M12 5v14" />
//     </svg>
//   );
// }

// function XIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }
export default AddProductos;
