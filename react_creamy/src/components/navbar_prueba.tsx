import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faBars,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    toggleMenu();
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("jwtToken");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("ID_rol");

    if (token && storedUserName && storedUserRole) {
      setIsLoggedIn(true);
      setUserName(storedUserName);

      // Fetch para obtener el rol
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
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("ID_rol");
    localStorage.removeItem("ID_usuario");
    localStorage.removeItem("userName");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`tw-relative tw-top-0 tw-left-0 tw-right-0 tw-z-50 tw-bg-white tw-shadow-md tw-py-3 ${
        isLoggedIn ? "" : "tw-hidden"
      }`}
    >
      <div className="tw-container tw-mx-auto tw-px-4 tw-flex tw-justify-between tw-items-center">
        {/* Logo and Mobile Menu Toggle */}
        <div className="tw-flex tw-items-center tw-space-x-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleMenuToggle}
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
            className="tw-flex tw-items-center tw-space-x-2"
          >
            <span className="tw-font-bold tw-text-xl tw-text-blue-600">Creamy Soft</span>
          </motion.div>
        </div>

        {/* Right Side Actions */}
        <div className="tw-flex tw-items-center tw-space-x-4">
          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="tw-flex tw-items-center tw-space-x-2"
          >
            <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-blue-500 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="tw-hidden md:tw-block">
              <p className="tw-text-sm tw-font-semibold">{userName || "Usuario"}</p>
              <p className="tw-text-xs tw-text-gray-500">{userRole || "Cargando rol..."}</p>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="tw-bg-red-500 tw-text-white tw-rounded-full tw-px-4 tw-py-2 tw-flex tw-items-center tw-space-x-2 tw-transition-colors hover:tw-bg-red-600"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="tw-hidden md:tw-inline">Salir</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
