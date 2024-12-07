import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  // faSignOutAlt, 
  faIceCream,
  faBars, 
  faTimes, 
  faUser, 
  faCog, 
  faDashboard, 
  faHistory 
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';

interface NavbarProps {
  toggleMenu: () => void;
}


// Lista de colores posibles
const colorOptions = ["tw-bg-blue-600", "tw-bg-red-500", "tw-bg-green-500", "tw-bg-pink-500", "tw-bg-yellow-500"];

const Navbar: React.FC<NavbarProps> = ({ toggleMenu }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  //ICONO
  const [currentColor, setCurrentColor] = useState(colorOptions[0]);


    // Cambia el color cada vez que el componente es montado o cuando quieras
  
    const changeColor = () => {
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      setCurrentColor(randomColor);
    };



    useEffect(() => {
      changeColor();
    }, []);
  
  

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("ID_rol");

    if (token && storedUserName && storedUserRole) {
      setIsLoggedIn(true);
      setUserName(storedUserName);

      fetch(`http://localhost:3300/roles`)
        .then((response) => response.json())
        .then((roles) => {
          const role = roles.find((r: { ID_rol: number }) => r.ID_rol === Number(storedUserRole));
          setUserRole(role ? role.descripcion : "Rol no encontrado");
        })
        .catch((error) => {
          console.error("Error obteniendo el rol:", error);
          setUserRole("Error al obtener rol");
        });
    }
  }, []);

  const handleLogout = () => {
    const toastId = toast(
      <div className="tw-flex tw-flex-col tw-space-y-2">
        <p className="tw-font-semibold">¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="tw-flex tw-justify-between tw-space-x-2">
          <button
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-flex-1"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("ID_rol");
              localStorage.removeItem("ID_usuario");
              localStorage.removeItem("userName");
              toast.dismiss(toastId);
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          >
            Confirmar
          </button>
          <button
            className="tw-bg-gray-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-flex-1"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        duration: 8000,
        position: 'top-right',
      }
    );
  };

  const UserMenu = () => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-w-56 tw-bg-white tw-border tw-rounded-lg tw-shadow-lg tw-z-50"
      >
        <div className="tw-p-4 tw-border-b tw-text-center">
          <p className="tw-font-semibold">{userName}</p>
          <p className="tw-text-sm tw-text-gray-500">{userRole}</p>
        </div>
        <ul className="tw-py-1">
          <li>
            <button className="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-hover:bg-gray-100 tw-flex tw-items-center tw-space-x-2">
              <FontAwesomeIcon icon={faDashboard} />
              <a href="/home">
              <span>Panel</span>
              </a>
            </button>
          </li>
          <li>
            <button className="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-hover:bg-gray-100 tw-flex tw-items-center tw-space-x-2">
              <FontAwesomeIcon icon={faCog} />
             <a href="/Roles" >
             <span>Configuración</span>
             </a>
            </button>
          </li>
          <li>
            <button className="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-hover:bg-gray-100 tw-flex tw-items-center tw-space-x-2">
              <FontAwesomeIcon icon={faHistory} />
              <a href= "/Dashboard">
              <span>Medidor</span>
              </a>
            </button>
          </li>
        </ul>
        <div className="tw-border-t tw-p-2">
        <button
          onClick={handleLogout}
          className="tw-w-full tw-bg-pink-400 tw-text-white tw-rounded-full tw-px-6 tw-py-3 tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-bg-pink-500 hover:tw-shadow-lg tw-transform hover:tw-scale-105"
          >
          <FontAwesomeIcon icon={faIceCream} className="tw-text-sm" />
          <span className="tw-font-semibold tw-text-sm">Cerrar Sesión</span>
        </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-50 tw-bg-white tw-shadow-md tw-py-3 ${isLoggedIn ? "" : "tw-hidden"}`}
    >
      <div className="tw-container tw-mx-auto tw-px-4 tw-flex tw-justify-between tw-items-center">
        {/* Logo and Mobile Menu Toggle */}
        <div className="tw-flex tw-items-center tw-space-x-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="tw-lg:tw-hidden tw-text-gray-600 hover:tw-text-blue-500 tw-transition-colors"
          >
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              className="tw-text-2xl"
            />
          </motion.button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="tw-flex tw-items-center tw-space-x-2">
            {/* Texto con color dinámico */}
            <span className={`tw-font-bold tw-text-xl tw-text-blue-500 `}>Creamy Soft</span>
          </motion.div>
        </div>

        {/* Right Side Actions */}
        <div className="tw-flex tw-items-center tw-space-x-4 tw-relative">
          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="tw-cursor-pointer tw-flex tw-items-center tw-space-x-2"
          >
            <div className={`tw-w-10 tw-h-10 tw-rounded-full ${currentColor} tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold`}>
              <FontAwesomeIcon icon={faUser}/>
            </div>
            <div className="tw-hidden md:tw-block">
              <p className="tw-text-sm tw-font-semibold">{userName || "Usuario"}</p>
              <p className="tw-text-xs tw-text-gray-500">{userRole || "Cargando rol..."}</p>
            </div>
          </motion.div>

          {isUserMenuOpen && <UserMenu />}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;