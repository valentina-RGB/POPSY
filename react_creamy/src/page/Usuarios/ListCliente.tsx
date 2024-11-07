import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Usuario } from '../../types/usuarios';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

const ListCliente: React.FC = () => {
  const [clientes, setClientes] = useState<Usuario[]>([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios');
      // Filtramos los usuarios para obtener solo los clientes (asumiendo que el ID_rol de cliente es 27)
      const clientesFiltrados = response.data.filter((usuario: Usuario) => usuario.ID_rol === 27);
      setClientes(clientesFiltrados);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      toast.error('Hubo un problema al cargar la lista de clientes.');
    }
  };

  const columns = useMemo<MRT_ColumnDef<Usuario>[]>(
    () => [
      {
        accessorKey: 'ID_usuario',
        header: 'ID',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },
      {
        accessorKey: 'telefono',
        header: 'Teléfono',
        Cell: ({ cell }) => `${cell.getValue<number>()}`,
      },
      {
        accessorKey: 'estado_usuario',
        header: 'Estado',
        Cell: ({ cell }) => (
          <span className={`tw-inline-block tw-text-xs tw-font-semibold tw-rounded-full tw-py-1 tw-px-2 ${cell.getValue<string>() === 'A' ? 'tw-bg-green-100 tw-text-green-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
            {cell.getValue<string>() === 'A' ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="tw-p-6 tw-bg-gray-100 tw-min-h-screen">
      <h1 className="page-heading">Lista de Clientes</h1>
      <MaterialReactTable 
        columns={columns} 
        data={clientes} 
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: true }}
      />
    </div>
  );
};

export default ListCliente;