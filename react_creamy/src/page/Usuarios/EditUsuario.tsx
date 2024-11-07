import React, { useEffect, useState } from "react";
import api from "../../api/api";

interface EditUsuarioProps {
  id: number;  
  onClose: () => void;
}

const EditUsuario: React.FC<EditUsuarioProps> = ({ id, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<number | string>(""); 
  const [roles, setRoles] = useState<Array<{ ID_rol: number, descripcion: string }>>([]); // Lista de roles
  
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar los datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/usuarios/${id}`);
        const usuario = response.data;
        setNombre(usuario.nombre);
        setEmail(usuario.email);
        setPassword(usuario.password); // Esto depende de si permites cambiar la contraseña
        setTelefono(usuario.telefono);
        setRol(usuario.ID_rol);  // Asignamos el rol del usuario
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setError("No se pudo cargar la información del usuario");
      }
    };

    if (id) {
      fetchUsuario();
    }
  }, [id]);

  // Efecto para cargar los roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        setError("No se pudo cargar la lista de roles");
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password || !telefono || !rol) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await api.put(`/usuarios/${id}`, {
        nombre,
        email,
        password,
        telefono,
        ID_rol: Number(rol), // Convertimos el rol seleccionado a número
        estado: "A",
      });
      // Solo cerramos el modal después de una actualización exitosa
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar el usuario:", error);
      setError(
        "Error al actualizar el usuario: " +
        (error.response?.data?.message || "Error desconocido")
      );
    }
  };

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md w-full max-w-md tw-mx-auto">
        <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-900">
          Actualizar Usuario
        </h2>
        {error && <p className="tw-text-red-500 tw-mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label
              htmlFor="nombre"
              className="tw-block tw-text-gray-700 tw-font-semibold"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Nombre"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label
              htmlFor="email"
              className="tw-block tw-text-gray-700 tw-font-semibold"
            >
              Email
            </label>
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
            <label
              htmlFor="password"
              className="tw-block tw-text-gray-700 tw-font-semibold"
            >
              Contraseña
            </label>
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
            <label
              htmlFor="telefono"
              className="tw-block tw-text-gray-700 tw-font-semibold"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="tw-mt-1 tw-block tw-w-full tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
              placeholder="Teléfono"
              required
            />
          </div>
          <div className="tw-mb-4">
            <label
              htmlFor="ID_rol"
              className="tw-block tw-text-gray-700 tw-font-semibold"
            >
              Rol
            </label>
            <select
              id="ID_rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="tw-mt-1 tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition"
              required
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
            Actualizar Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUsuario;
