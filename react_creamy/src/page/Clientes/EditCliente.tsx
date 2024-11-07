import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import { Cliente } from '../../types/clientes';

const EditarCliente: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Error fetching cliente:', error);
        setError('Error al cargar los datos del cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => prevCliente ? { ...prevCliente, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;

    try {
      await api.put(`/clientes/${cliente.ID_cliente}`, cliente);
      navigate('/clientes');
    } catch (error: any) {
      console.error('Error al actualizar el cliente:', error);
      setError('Error al actualizar el cliente: ' + (error.response?.data?.message || 'Error desconocido'));
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="tw-text-red-500">{error}</div>;
  if (!cliente) return <div>Cliente no encontrado</div>;

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md w-full max-w-md tw-mx-auto">
        <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">Editar Cliente</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label htmlFor="documento" className="tw-block tw-text-gray-700 tw-font-semibold">Documento</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={cliente.documento}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="nombre" className="tw-block tw-text-gray-700 tw-font-semibold">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="apellidos" className="tw-block tw-text-gray-700 tw-font-semibold">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={cliente.apellidos}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="direccion" className="tw-block tw-text-gray-700 tw-font-semibold">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={cliente.direccion}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="correo_electronico" className="tw-block tw-text-gray-700 tw-font-semibold">Correo Electrónico</label>
            <input
              type="email"
              id="correo_electronico"
              name="correo_electronico"
              value={cliente.correo_electronico}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="estado_cliente" className="tw-block tw-text-gray-700 tw-font-semibold">Estado</label>
            <input
              type="text"
              id="estado_cliente"
              name="estado_cliente"
              value={cliente.estado_cliente}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label htmlFor="ID_usuario" className="tw-block tw-text-gray-700 tw-font-semibold">ID Usuario</label>
            <input
              type="number"
              id="ID_usuario"
              name="ID_usuario"
              value={cliente.ID_usuario}
              onChange={handleInputChange}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-hover:bg-blue-600 tw-transition"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarCliente;
