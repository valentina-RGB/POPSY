
import React, { useState, ChangeEvent, DragEvent  } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import { UploadIcon } from 'lucide-react';

interface AddCategories { 
  onClose: () => void;
}

const AddCategories: React.FC<AddCategories> = ({ onClose }) => {
    const [descripcion, setDescripcion] = useState<string>('');
    const [estado, setEstado] = useState<string>('A');
    const [imagen, setImagen] = useState('');
    // const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    
const [errors, setErrors] = useState({
    descripcion: '',
    imagen: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

 // 2. Manejo de cambio en los inputs
 const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'descripcion') {
      setErrors(prev => ({ ...prev, descripcion: '' }));
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
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

const [formData, setFormData] = useState({
    descripcion,
    estado:'A',
    image: null as File | null,
  });

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
          descripcion: formData.descripcion,
          estado_categoria: formData.estado,
          imagen: formData.image||''
          // imagen: ''
      };

      const newErrors = { descripcion: '', imagen: '' };
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = 'El nombre de la categoría es obligatorio';
      }
    //   if (!formData.imagen) {
    //     newErrors.imagen = 'La imagen es obligatoria';
    //   }
      setErrors(newErrors);
      if (!newErrors.descripcion) {
    try {
          await api.post('/categorias',data,{
            headers: {
              'Content-Type': 'multipart/form-data',
            }});
          onClose(); 
        toast.success('La categoría ha agregada exitosamente.');
        navigate('/Categorias');
        resetForm();
        
      } catch (error) {
        toast.error('No se pudo agregar la categoría. Por favor, intente nuevamente.');
      }}
  };

  const resetForm = () => {
    setDescripcion(descripcion);
    setEstado(estado);
    setImagen(imagen);

    // setError(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-max-w-lg w-full">
        <h2 className="tw-text-2xl tw-font-semibold tw-mb-4 tw-text-gray-800">
          
        </h2>
        <form onSubmit={handleSubmit} className="tw-space-y-6 tw-max-w-md tw-mx-auto tw-p-6 tw-bg-white tw-rounded-lg tw-shadow-md">
        <div className="tw-space-y-2">
          <label htmlFor="descripcion" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
            Nombre de la categoría
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className={`tw-mt-1 tw-block tw-w-full tw-rounded-md tw-shadow-sm ${
              errors.descripcion ? 'tw-border-red-500' : 'tw-border-gray-300'
            } tw-focus:border-indigo-300 tw-focus:ring tw-focus:ring-indigo-200 tw-focus:ring-opacity-50`}
          />
          {errors.descripcion && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{errors.descripcion}</p>}
        </div>
        <div className="tw-space-y-2">
          <label htmlFor="image" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
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
                    setFormData(prev => ({ ...prev, image: null }));
                    setPreview(null);
                  }}
                > Cambiar
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
        > Guardar categoría
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddCategories;
