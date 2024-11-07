import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignUp: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password || !telefono) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      await api.post('/auth/signup', {
        nombre,
        email,
        password,
        telefono,
      });
      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error al registrar:', error);
      setError(
        'Error al registrar: ' + (error.response?.data?.message || 'Error desconocido')
      );
    }
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-md">
        <h2 className="tw-text-3xl tw-font-semibold tw-text-center tw-mb-6 tw-text-gray-800">
          Crear Cuenta
        </h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="nombre" className="tw-block tw-text-gray-700 tw-font-semibold">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              placeholder="Nombre completo"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="email" className="tw-block tw-text-gray-700 tw-font-semibold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="password" className="tw-block tw-text-gray-700 tw-font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              placeholder="Contraseña"
              required
            />
          </div>
          <div className="tw-mb-6">
            <label htmlFor="telefono" className="tw-block tw-text-gray-700 tw-font-semibold">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              placeholder="Teléfono"
              required
            />
          </div>
          <button
            type="submit"
            className="tw-w-full tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold hover:tw-bg-green-600 tw-transition"
          >
            Crear Cuenta
          </button>
        </form>
        <p className="tw-mt-4 tw-text-center tw-text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="tw-text-blue-500 hover:tw-underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
