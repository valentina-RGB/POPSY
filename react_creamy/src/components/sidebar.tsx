import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ArrowPathIcon,
  CubeTransparentIcon,
  TagIcon,
  TruckIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { memo, useCallback, useEffect, useState } from "react";
import axios from "axios";






type rol = {
  ID_perimiso: number;
  descripcion: string;
}


// Memoized NavLink component for performance optimization
const NavLink = memo(({
  path,
  name,
  icon: Icon,
  isActive
}: {
  path: string,
  name: string,
  icon: React.ComponentType<{ className?: string }>,
  isActive: boolean
}) => (
  <Link
    to={path}
    aria-current={isActive ? "page" : undefined}
    className={`tw-flex tw-items-center tw-px-3 tw-py-2 tw-rounded-lg tw-transition-colors tw-duration-300
      ${
        isActive
          ? "tw-bg-indigo-100 tw-text-indigo-900 dark:tw-bg-indigo-600 dark:tw-text-white"
          : "tw-text-gray-600 hover:tw-bg-gray-200 hover:tw-text-gray-900 dark:tw-text-gray-300 dark:hover:tw-bg-gray-800 dark:hover:tw-text-white"
      }`}
  >
    <Icon
      className={`tw-w-6 tw-h-6 ${
        isActive ? "tw-text-indigo-700 dark:tw-text-white" : "tw-text-gray-500"
      }`}
      aria-hidden="true"
    />
    <span className="tw-mx-3 tw-text-sm tw-font-medium">{name}</span>
  </Link>
));


const Menu = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles , setroles] = useState<rol[]>([])
  const location = useLocation();


  // Memoized login status check function
  const checkLoginStatus = useCallback(() => {
    try {
      const localStorageData = localStorage.getItem("jwtToken");
      setIsLoggedIn(!!localStorageData);
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  }, []);


  useEffect(() => {
    // Initial login status check
    checkLoginStatus();
   
    // Add event listener for storage changes across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "jwtToken") {
        checkLoginStatus();
      }
    };


    window.addEventListener('storage', handleStorageChange);
   
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkLoginStatus]);


  // Navigation items configuration
  const navItems = [
    {
      label: "Dashboard",
      links: [
        { path: "/Home", name: "Home", icon: HomeIcon },
        { path: "/Dashboard", name: "Dashboard", icon: ChartBarIcon   },
      ],
    },
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
        { path: "/Categorias", name: "Categorias", icon: CubeTransparentIcon },
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






 




  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("jwtToken");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("ID_rol");


    if (token && storedUserName && storedUserRole) {
      setIsLoggedIn(true);
      // setUserName(storedUserName);


      // Fetch para obtener el rol


      const fecth = async() =>{
        const response = await axios.get(`http://localhost:3300/roles/${storedUserRole}`)
     
        const {Permiso} = response.data
        setroles(Permiso)
        // console.log('rol',{roles}, storedUserRole, 'esta',response.data)
 
      }


      fecth();
    }
  }, []);


  console.log("holiii")
  // Visibility class for menu open/close
  const visibilityClass = isMenuOpen
    ? "tw-translate-x-0 tw-opacity-100 tw-visible"
    : "tw-translate-x-[-100%] tw-opacity-0 tw-invisible";


  return (
    <aside
      className={`${isLoggedIn ? "" : "tw-hidden"}
        tw-flex tw-flex-col
        tw-w-64
        tw-h-screen
        tw-px-5
        tw-py-8
        tw-overflow-y-auto
        tw-bg-white
        tw-border-rdark:tw-bg-gray-900
        dark:tw-border-gray-700 tw-rounded-lg
        tw-shadow-lg tw-transition-all
        tw-duration-300 tw-ease-in-out ${visibilityClass}
        ${isMenuOpen ? "tw-absolute tw-block" : "tw-hidden"} lg:${isMenuOpen ? "tw-block" : "tw-hidden"} lg:tw-static
        tw-rounded-lg tw-shadow-lg ${visibilityClass} `}
      style={{ zIndex: 10 }}
      aria-label="Main Navigation"
      role="navigation"
    >
      <div className="tw-mt-4 tw-space-y-8">
        {navItems.map((section) => (
          <nav key={section.label}>
            <label
              className="tw-px-3 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-700 dark:tw-text-gray-400"
              id={`section-${section.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {section.label}
            </label>
            <div
              className="tw-mt-2 tw-space-y-2"
              aria-labelledby={`section-${section.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {section.links.map((link) => {
                if(roles.length > 0){
                const permiso = roles.find((permiso) => permiso.descripcion.toLowerCase() ===link.name.toLowerCase());
               
                return permiso ? (
                  <NavLink
                  key={link.name}
                  path={link.path}
                  name={link.name}
                  icon={link.icon}
                  isActive={location.pathname === link.path}
                />
                ):null;
                }
                return null;          
              })}
            </div>
          </nav>
        ))}
      </div>
    </aside>
  );
};


export default Menu;



