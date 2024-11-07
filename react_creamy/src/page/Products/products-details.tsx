import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
// import { Producto } from "../../types/Producto";
// import { PaperClipIcon } from 'tailwindcss/components.css'
import { PaperClipIcon } from "@heroicons/react/20/solid";

interface Props {
  id: number;
  onClose: () => void;
}

const ProductosDetail: React.FC<Props> = ({ id, onClose }) => {
  type Producto = {
    ID_producto: number;
    nombre: string;
    descripcion: string;
    precio_neto: number;
    estado_productos: string | null;
    ID_tipo_productos: number;
    ID_categorias: number;
    imagen: string;
    Insumos: Insumo[];
  };

  type Insumo = {
    ID_insumo: number;
    descripcion_insumo: string;
    estado_insumo: string;
    precio: number;
    ID_tipo_insumo: number;
    Producto_insumos: {
      cantidad: number;
      configuracion: string;
      precio: number;
    };
  };

  type Categoria = {
    ID_Categoria: number;
    descripcion: string;
  };

  const [Productos, setProductos] = useState<Producto | null>(null);
  

  useEffect(() => {
    const fetchInsumoDetails = async () => {
      try {
        const response = await api.get(`/productos/${id}`);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del insumo:", error);
      }
    };


  
    fetchInsumoDetails();
  }, [id]);

  if (!Productos) {
    return (
      <div className="tw-text-center tw-text-gray-600">
        Cargando detalles...
      </div>
    );
  }

  interface EstadoProductos {
    [key: string]: string;
  }

  const estadoProductos: EstadoProductos = {
    D: "Disponible",
    A: "Agotado",
    // Agrega otros estados si es necesario
  };

  const EstadoProductos =
    estadoProductos[Productos.estado_productos as keyof EstadoProductos] ||
    "Desconocido";
  return (
    <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-max-w-[800px] tw-w-full tw-mx-auto tw-relative tw-h-[80vh]">
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-h-full">
        
      <div className="tw-bg-gray-100 tw-p-4 md:tw-p-6 tw-flex tw-items-center tw-justify-center tw-w-[350px] tw-h-[400px]">
        
        <img
          src={`http://localhost:3300${Productos.imagen}`}
          alt="Product Image"
          width="350"
          height="350"
          className="tw-w-full tw-max-w-full tw-h-auto"
          style={{ aspectRatio: "1/1", objectFit: "cover" }}
        />
      </div>
      
      <div className="tw-p-2 md:tw-p-3 tw-flex tw-flex-col tw-justify-center tw-h-90">   
        <div className="tw-flex tw-items-center tw-mb-6">
        <div className= "">
        <h1 className=" tw-font-bold tw-mb-2 tw-text-[#7c3aed]">
          {Productos.nombre}
        </h1>
        <span
            className={` tw-font-medium tw-px-2 tw-py-1 tw-rounded-full ${
              Productos.estado_productos === "A"
                ? "tw-bg-red-100 tw-text-red-800"
                : "tw-bg-green-100 tw-text-green-800"
            }`}
          >
            {EstadoProductos}
          </span>
        </div>
      
        </div>
        <p className="tw-text-base tw-text-[#4b5563] tw-mb-6">
            Descripción del producto: {Productos.descripcion}
        </p>
        <div className="accordion accordion-flush tw-max-h-60 tw-overflow-y-auto " id="accordionFlushExample">
          {Productos.Insumos.map((insumos) => (
            <div key={insumos.ID_insumo} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${insumos.descripcion_insumo}`}
                  aria-expanded="false"
                  aria-controls={insumos.descripcion_insumo}
                >
                  {insumos.descripcion_insumo}
                </button>
              </h2>
              <div
                id={insumos.descripcion_insumo}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <p>Estado del insumo: {
                      insumos.estado_insumo === "D"
                        ? "Disponible"
                        : "Agotado"
                    }</p>
                  <p>Precio: <span className="text-primary">{insumos.precio}</span></p>
                  <p>Cantidad: {insumos.Producto_insumos.cantidad}</p>
                  <p>Precio subtotal: <span className="text-primary">{insumos.Producto_insumos.precio}</span></p>
                </div>
              </div>
            
            </div>
            
          ))}
        </div>
  
       
      </div>
      <p className="  tw-bottom-3 tw-absolute accordion-body fs-5">Precio del producto : <span className="text-primary fs-4">{Productos.precio_neto}</span></p>
    </div>
   
    <button
      onClick={onClose}
      className=" tw-absolute tw-bottom-4 tw-right-4 tw-bg-gray-500 tw-text-white tw-rounded-lg tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition"
    >
      Cerrar
    </button>

  </div>

  );
};

export default ProductosDetail;
