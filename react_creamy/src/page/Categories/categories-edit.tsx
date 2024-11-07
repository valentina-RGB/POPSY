import React, {useState, ChangeEvent, DragEvent,useEffect  } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { Categoria } from '../../types/Categoria';
import {  UploadIcon } from 'lucide-react';

interface Props {
  id: number;
  onClose: () => void;
}

const EditCategoria: React.FC<Props> = ({ id, onClose }) => {
    // const [Categoria, setCategoria] = useState<Categoria | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState({descripcion: ''});

  const [formEdit, setFormEdit] = useState<Categoria>({
    ID_categoria:id,
    descripcion: '',
    estado_categoria:'A',
    imagen: null as File | null,
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await api.get(`/categorias/${id}`);

        setFormEdit({
          ID_categoria: id,
          descripcion: response.data.descripcion,
          estado_categoria: response.data.estado_categoria,
          imagen: response.data.imagen
        });
        setPreview(`http://localhost:3300${response.data.imagen}`);
         
      } catch (error) {
        setError('Error al cargar el categoría.');
      }
    };
    if (id) {
    fetchCategoria()
    }
}, [id, setPreview]);
  
  
 // 2. Manejo de cambio en los inputs
 const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value } = e.target;
    setFormEdit(prev => ({ ...prev, [name]: value }));
    if (name === 'descripcion') {
      setErrors(prev => ({ ...prev, descripcion: '' }));
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormEdit(prev => ({ ...prev, imagen: file }));
      setErrors(prev => ({ ...prev, imagen: '' }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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


    const newErrors = { descripcion: ''};
    if (!formEdit.descripcion) {
      newErrors.descripcion = 'El nombre de la categoría es obligatorio';
    }
 

    setErrors(newErrors);
    setError(error);
    if (!newErrors.descripcion) {
    try {
      await api.put(`/categorias/${id}`,{
        ID_categoria: id,
        descripcion:formEdit.descripcion,
        estado:'',
        imagen: formEdit.imagen||'N/A'
      },{
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/json',
        }});  
      toast.success('La categoria se ha actualizado correctamente.');
      onClose();
      navigate('/Categorias');
      resetForm();

      }
      catch (error) {
      console.error('Error al editar la categoría:', error);
      toast.error('No se pudo actualizar la categoría');
      
    }
    }
  };

  if (!formEdit.ID_categoria) return <p>Cargando...</p>;

  const resetForm = () => {
    
  };




  return (
    <div className="fixed inset-0 flex items-center justify-center ">
    <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
    <h3 className="page-heading">Editar</h3>
      <form onSubmit={handleSubmit} className="tw-space-y-6 tw-max-w-md tw-mx-auto tw-p-6 tw-bg-white tw-rounded-lg tw-shadow-md">
      <div className="tw-space-y-2">
        <label htmlFor="descripcion" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
          Nombre de la categoría
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          value={formEdit.descripcion}
          onChange={handleInputChange}
          className={`tw-mt-1 tw-block tw-w-full tw-rounded-md tw-shadow-sm ${
            errors.descripcion ? 'tw-border-red-500' : 'tw-border-gray-300'
          } tw-focus:border-indigo-300 tw-focus:ring tw-focus:ring-indigo-200 tw-focus:ring-opacity-50`}
        />
        {errors.descripcion && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.descripcion}</p>}
      </div>
      <div className="tw-space-y-2">
        <label htmlFor="imagen" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
          Imagen
        </label>
        <div
          className={`tw-border-2 tw-border-dashed tw-rounded-lg tw-p-4 tw-text-center ${
            dragActive ? 'tw-border-indigo-400' : 'tw-border-gray-300'
          } `}
         
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
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
                  setFormEdit(prev => ({ ...prev, imagen: null }));
                  setPreview(null);
                }}
              >
                Cambiar
              </button>
            </div>
          ) : (
            <label htmlFor="image" className="tw-cursor-pointer">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8">
                <UploadIcon className="tw-w-12 tw-h-12 tw-text-gray-400" />
                <p className="tw-mt-2 tw-text-sm tw-text-gray-500">
                  Arrastra y suelta una imagen aquí, o haz clic para seleccionar
                </p>
              </div>
            </label>
          )}
        </div>
        {/* {errors.image && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.image}</p>} */}
      </div>

      <button
        type="submit"
        className="tw-w-full tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-md hover:tw-bg-indigo-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
      >
        Guardar cambios
      </button>
    </form>

    </div>
  </div>
  );
};

export default EditCategoria;

