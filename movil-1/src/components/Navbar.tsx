import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onLogout?: () => void;
}

interface Role {
  ID_rol: number;
  descripcion : string;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ nombre: string; ID_rol: number } | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser); // Verifica que el objeto `user` tiene la propiedad `ID_rol`
      setUser(parsedUser);
    }

    // Fetch de roles desde la API
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3300/roles');
        if (!response.ok) {
          throw new Error('Error al obtener roles');
        }
        const data: Role[] = await response.json();
        console.log(data);  // Verifica que la respuesta contiene los roles correctamente
        setRoles(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoles();
  }, []);

  const getRolName = (rolId: number) => {
    const role = roles.find((r) => r.ID_rol === rolId);
    return role ? role.descripcion  : 'Cargando...';
  };

  return (
    <>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-lg p-4 z-10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Creamy Soft
          </h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-purple-50 rounded-full transition-colors duration-300"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6 text-purple-600" />}
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Burger Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
          >
            <div className="p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-purple-50 rounded-full transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-purple-600" />
                </button>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                {user && (
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="p-3 bg-white rounded-full">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{user.nombre}</h3>
                      <p className="text-sm text-gray-500">{getRolName(user.ID_rol)}</p>
                    </div>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="mt-6 flex items-center space-x-2 w-full p-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
