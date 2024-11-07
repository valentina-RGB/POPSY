import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from 'react-router-dom';

interface Props {
  id: number;
  onClose: () => void;
}

const CategoriaDetail: React.FC<Props> = ({ id, onClose }) => {
  interface Categoria {
    ID_categoria: number;
    descripcion: string;
    estado_categoria: string;
    imagen: File | null;
  }

  const [categorias, setCategorias] = useState<Categoria | null>(null);

  useEffect(() => {
    const fetchInsumoDetails = async () => {
      try {
        const response = await api.get(`/categorias/${id}`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del insumo:", error);
      }
    };

    fetchInsumoDetails();
  }, [id]);

  if (!categorias) {
    return (
      <div className="tw-text-center tw-text-gray-600">
        Cargando detalles...
      </div>
    );
  }

  interface EstadoCategorias {
    [key: string]: string;
  }

  const estadoCategorias: EstadoCategorias = {
    D: "Inactivo",
    A: "Activo",
    // Agrega otros estados si es necesario
  };

  const categoriaEstado =
    estadoCategorias[categorias.estado_categoria as keyof EstadoCategorias] ||
    "Desconocido";
  return (
    <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-border tw-border-gray-300 tw-max-w-lg tw-w-full tw-mx-auto">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
        <div className="tw-bg-gray-100 tw-p-4 md:tw-p-6 tw-flex tw-items-center tw-justify-center">
          <img
            src={`http://localhost:3300${categorias.imagen}`}
            alt="Product Image"
            width="300"
            height="300"
            className="tw-w-full tw-max-w-[200px] tw-h-auto"
            style={{ aspectRatio: "1/1", objectFit: "cover" }}
          />
        </div>
        <div className="tw-p-4 md:tw-p-6 tw-flex tw-flex-col tw-justify-center">
          <div className="tw-flex tw-items-center tw-mb-3">
            <span
              className={`tw-font-medium tw-px-2 tw-py-1 tw-rounded-full ${
                categorias.estado_categoria === "D"
                  ? "tw-bg-gray-500 tw-text-white"
                  : "tw-bg-[#7c3aed] tw-text-white"
              }`}
            >
              {categoriaEstado}
            </span>
          </div>
          <h2 className="tw-text-xl tw-font-bold tw-mb-3 tw-text-[#7c3aed]">
            {categorias.descripcion}
          </h2>
          <p className="tw-text-base tw-text-[#4b5563] tw-mb-4">
            ¡Aqui podrás ver que productos estan vinculados a esta categoria!
          </p>
          
          <div className="tw-flex tw-items-center tw-justify-center">
          <Link to="/Productos">
            <button className="tw-bg-[#7c3aed] tw-text-white tw-hover:bg-[#6d32d6] tw-px-4 tw-py-2 tw-rounded-md">
              Ver productos
            </button>
            </Link>
          </div>
          
        </div>
        
        <button
          onClick={onClose}
          className="tw-mt-3 tw-bg-gray-500 tw-text-white tw-rounded-lg tw-px-4 tw-py-2 tw-shadow-md tw-hover:bg-gray-600 tw-transition"
        >
          Cerrar
        </button>
    
      </div>
    </div>
  );
};

export default CategoriaDetail;
