import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { Cliente } from '../../types/clientes';

const ListarClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Error al cargar los clientes.');
      }
    };

    const conDelte = async (id: number) => {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes(clientes.filter(cliente => cliente.ID_cliente !== id));
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    };

    fetchClientes();
  }, []);

  const deleteClient = async (id: number) => {

  }

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-max-w-4xl tw-mx-auto">
        <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">Lista de Clientes</h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <Link to="/agregar-cliente" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-hover:bg-blue-600 tw-transition tw-mb-4 tw-inline-block">
          Agregar Nuevo Cliente
        </Link>
        <table className="tw-min-w-full tw-bg-white tw-shadow-md tw-rounded-lg tw-overflow-hidden">
          <thead className="tw-bg-gray-200 tw-text-gray-700">
            <tr>
              <th className="tw-py-3 tw-px-4 tw-text-left">ID</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Documento</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Nombre</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Apellidos</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Dirección</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Correo Electrónico</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Estado</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">ID Usuario</th>
              <th className="tw-py-3 tw-px-4 tw-text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.ID_cliente} className="tw-border-b tw-border-gray-200 hover:tw-bg-gray-100">
                <td className="tw-py-3 tw-px-4">{cliente.ID_cliente}</td>
                <td className="tw-py-3 tw-px-4">{cliente.documento}</td>
                <td className="tw-py-3 tw-px-4">{cliente.nombre}</td>
                <td className="tw-py-3 tw-px-4">{cliente.apellidos}</td>
                <td className="tw-py-3 tw-px-4">{cliente.direccion}</td>
                <td className="tw-py-3 tw-px-4">{cliente.correo_electronico}</td>
                <td className="tw-py-3 tw-px-4">{cliente.estado_cliente}</td>
                <td className="tw-py-3 tw-px-4">{cliente.ID_usuario}</td>
                <td className="tw-py-3 tw-px-4">
                  <Link to={`/editar-cliente${cliente.ID_cliente}`} className="tw-text-blue-500 tw-hover:text-blue-700 tw-mr-2">Editar</Link>
                  <button onClick={ async () => {
                        try {
                          await api.delete(`/clientes/${cliente.ID_cliente}`);
                          setClientes(clientes.filter(cliente => cliente.ID_cliente !== cliente.ID_cliente));
                        } catch (error) {
                          console.error('Error al eliminar el cliente:', error);
                        }
                  }} className="tw-text-red-500 tw-hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarClientes;
