import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const AddCliente: React.FC = () => {
  const [documento, setDocumento] = useState('123456789');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('sincorreo@gmail.com');
  const [estadoCliente, setEstadoCliente] = useState('A');
  const [ID_usuario, setID_usuario] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !direccion || !correoElectronico) {
      setError('Por favor, completa los campos obligatorios.');
      return;
    }
    try {
      await api.post('/clientes', {
        documento,
        nombre,
        apellidos,
        direccion,
        correo_electronico: correoElectronico,
        estado_cliente: estadoCliente,
        ID_usuario,
      });
      navigate('/Clientes');
    } catch (error: any) {
      console.error('Error al agregar el cliente:', error);
      setError('Error al agregar el cliente: ' + (error.response?.data?.message || 'Error desconocido'));
    }
  };

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md w-full max-w-md tw-mx-auto">
        <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">Agregar Cliente</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="documento" className="tw-block tw-text-gray-700 tw-font-semibold">Documento</label>
            <input
              type="text"
              id="documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Documento del cliente"
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="nombre" className="tw-block tw-text-gray-700 tw-font-semibold">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="apellidos" className="tw-block tw-text-gray-700 tw-font-semibold">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Apellidos del cliente"
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="direccion" className="tw-block tw-text-gray-700 tw-font-semibold">Dirección</label>
            <input
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Dirección del cliente"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="correo_electronico" className="tw-block tw-text-gray-700 tw-font-semibold">Correo Electrónico</label>
            <input
              type="email"
              id="correo_electronico"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Correo electrónico del cliente"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="estado_cliente" className="tw-block tw-text-gray-700 tw-font-semibold">Estado del Cliente</label>
            <input
              type="text"
              id="estado_cliente"
              value={estadoCliente}
              onChange={(e) => setEstadoCliente(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Estado del cliente (A/I)"
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="ID_usuario" className="tw-block tw-text-gray-700 tw-font-semibold">ID Usuario</label>
            <input
              type="number"
              id="ID_usuario"
              value={ID_usuario}
              onChange={(e) => setID_usuario(parseInt(e.target.value))}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="ID del usuario"
            />
          </div>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-hover:bg-blue-600 tw-transition"
          >
            Agregar Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCliente;
