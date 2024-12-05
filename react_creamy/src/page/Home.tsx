import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  
} from 'lucide-react';

interface HomeWelcomeProps {
  username: string;
  role: string;
}

const Home: React.FC<HomeWelcomeProps> = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el nombre de usuario y el rol desde localStorage
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('ID_rol');

    if (storedUserName && storedUserRole) {
      setUserName(storedUserName);
      // Lógica para obtener la descripción del rol si es necesario
      fetch(`http://localhost:3300/roles`)
        .then((response) => response.json())
        .then((roles) => {
          const roleObj = roles.find((r: { ID_rol: number }) => r.ID_rol === Number(storedUserRole));
          setUserRole(roleObj ? roleObj.descripcion : 'Rol no encontrado');
        })
        .catch((error) => {
          console.error('Error obteniendo el rol:', error);
          setUserRole('Error al obtener rol');
        });
    }
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const dashboardStats = [
    {
      icon: CalendarIcon,
      title: 'Día de Hoy',
      value: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
    {
      icon: ClockIcon,
      title: 'Último Inicio de Sesión',
      value: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      icon: UserIcon,
      title: 'Rol Actual',
      value: userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Cargando rol...',
    },
  ];

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-6">
      <div className="tw-w-full tw-max-w-4xl tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-8 tw-space-y-6">
        {/* Encabezado */}
        <div className="tw-text-center">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-4">
            {getTimeBasedGreeting()}, {userName || 'Usuario'}
          </h1>
          <p className="tw-text-gray-600 tw-text-lg">
            Bienvenido al Sistema de Gestión de Heladería. Aquí encontrarás todas las herramientas que necesitas.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-6">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-text-center"
            >
              <stat.icon className="tw-w-8 tw-h-8 tw-text-indigo-500 tw-mx-auto tw-mb-2" />
              <h3 className="tw-font-semibold tw-text-gray-700">{stat.title}</h3>
              <p className="tw-text-gray-500">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Mensaje Motivacional */}
        <div className="tw-bg-indigo-50 tw-border tw-border-indigo-100 tw-rounded-xl tw-p-6 tw-text-center">
          <h2 className="tw-text-2xl tw-font-bold tw-text-indigo-600 tw-mb-4">
            ¡Hagamos grande nuestra heladería hoy!
          </h2>
          <p className="tw-text-gray-700">
            Cada día es una oportunidad para crear momentos dulces y memorables. Tu trabajo es fundamental para el éxito.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
