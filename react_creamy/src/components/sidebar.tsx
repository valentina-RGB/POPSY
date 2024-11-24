import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  BuildingStorefrontIcon, // Para Insumos
  ArrowPathIcon, // Para Entradas
  CubeTransparentIcon, // Para Categorías
  TagIcon, // Para Productos
  TruckIcon, // Para Pedidos
  BanknotesIcon, // Para Ventas
  Cog6ToothIcon, // Para Roles
  UserGroupIcon, // Para Usuarios
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const Menu = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // Asegura que `location.pathname` esté disponible

  useEffect(() => {
    const localStorageData = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!localStorageData); // Evalúa si hay token
  }, []);

  const navItems = [
    { label: "Dashboard", links: [{ path: "/Dashboard", name: "Dashboard", icon: HomeIcon }] },
    {
      label: "Compras",
      links: [
        { path: "/Insumos", name: "Insumos", icon: BuildingStorefrontIcon },
        { path: "/historial-entradas", name: "Entradas", icon: ArrowPathIcon },
      ],
    },
    {
      label: "Ventas",
      links: [
        { path: "/Categorias", name: "Categorías", icon: CubeTransparentIcon },
        { path: "/Productos", name: "Productos", icon: TagIcon },
        { path: "/Pedidos", name: "Pedidos", icon: TruckIcon },
        { path: "/Ventas", name: "Ventas", icon: BanknotesIcon },
      ],
    },
    {
      label: "Configuración",
      links: [
        { path: "/Roles", name: "Roles", icon: Cog6ToothIcon },
        { path: "/Usuarios", name: "Usuarios", icon: UserGroupIcon },
      ],
    },
  ];

  // Lógica para definir clases de visibilidad
  const visibilityClass = isMenuOpen
    ? "tw-translate-x-0 tw-opacity-100 tw-visible"
    : "tw-translate-x-[-100%] tw-opacity-0 tw-invisible"; // Ocultar con transiciones

  return (
    <aside
      className={`${isLoggedIn ? "" : "tw-hidden"} tw-flex tw-flex-col tw-w-64 tw-h-screen tw-px-5 tw-py-8 tw-overflow-y-auto 
      tw-bg-white tw-border-r dark:tw-bg-gray-900 dark:tw-border-gray-700 
      tw-rounded-lg tw-shadow-lg tw-transition-transform tw-duration-300 tw-ease-in-out ${visibilityClass}`}
      style={{ zIndex: 10 }}
    >
      <div className="tw-mt-4 tw-space-y-8">
        {navItems.map((section) => (
          <div key={section.label}>
            <label className="tw-px-3 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-700 dark:tw-text-gray-400">
              {section.label}
            </label>
            <div className="tw-mt-2 tw-space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-lg tw-transition-colors tw-duration-300 
                    ${
                      location.pathname === link.path
                        ? "tw-bg-indigo-100 tw-text-indigo-900 dark:tw-bg-indigo-600 dark:tw-text-white"
                        : "tw-text-gray-600 hover:tw-bg-gray-200 hover:tw-text-gray-900 dark:tw-text-gray-300 dark:hover:tw-bg-gray-800 dark:hover:tw-text-white"
                    }`}
                >
                  <link.icon
                    className={`tw-w-6 tw-h-6 ${
                      location.pathname === link.path ? "tw-text-indigo-700 dark:tw-text-white" : "tw-text-gray-500"
                    }`}
                  />
                  <span className="tw-mx-3 tw-text-sm tw-font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Menu;
