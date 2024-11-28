import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';


interface AddUsuario { 
  onClose: () => void;
}

const AddUsuario: React.FC<AddUsuario> = ({onClose}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol]= useState<number | string>('');
  const [roles, setRoles]= useState<Array<{ ID_rol: number, descripcion: string }>>([]);
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching types of usuario:', error);
        setError('Error al cargar los usuarios.');
      }
    };

    fetchRoles();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {

    
    e.preventDefault();

    if (!nombre || !email || !password || !telefono || !rol) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {

      const usuario = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        password: password,
        ID_rol: Number(rol),
        estado: 'A'
      }

      console.log(usuario);

      await api.post('/usuarios', usuario);
      onClose();
      toast.success('El usuario se  ha agregada exitosamente.');
      navigate('/Usuarios')
      
    } catch (error) {
      toast.error('No se pudo agregar la usuario. Por favor, intente nuevamente.');
      // console.error('Error al agregar el usuario:', error);
      // setError('Error al agregar el usuario: ' + (error.response?.data?.message || 'Error desconocido'));
    }

  };

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md w-full max-w-md tw-mx-auto">
        <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
        <div className="tw-mb-4">
            <label htmlFor="nombre" className="tw-block tw-text-gray-700 tw-font-semibold">Nombre</label>
            <input
              type="nombre"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Nombre completo"
              required
            />
          </div>
          <div className="tw-mb-4"> 
            <label htmlFor="email" className="tw-block tw-text-gray-700 tw-font-semibold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="password" className="tw-block tw-text-gray-700 tw-font-semibold">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Contraseña"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="telefono" className="tw-block tw-text-gray-700 tw-font-semibold">Teléfono</label>
            <input
              type="number"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Teléfono"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="ID_rol" className="tw-block tw-text-gray-700 tw-font-semibold">ID Rol</label>
            <select
              id="ID_rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
            >
              <option value="" disabled>Selecciona el rol</option>
              {roles.map(tipo => (
                <option key={tipo.ID_rol} value={tipo.ID_rol}>{tipo.descripcion}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-hover:bg-blue-600 tw-transition"
          >
            Agregar Usuario
          </button>
        </form>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
      </div>
    </div>
  );
};

export default AddUsuario;
