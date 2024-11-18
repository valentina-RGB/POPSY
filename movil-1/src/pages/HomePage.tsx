import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card'; // Asegúrate de que la ruta de importación sea correcta
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const MenuItem = ({ icon, title, onClick, isActive, subtitle }) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1
        ${isActive ? 'bg-purple-50 border-l-4 border-purple-500' : 'bg-white'}`}
    >
      <div className="flex items-center p-4 space-x-4">
        <div className={`p-3 rounded-full ${
          isActive ? 'bg-purple-500' : 'bg-gradient-to-r from-purple-100 to-pink-100'
        }`}>
          {React.cloneElement(icon, { 
            className: `w-6 h-6 ${isActive ? 'text-white' : 'text-purple-600'}`
          })}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${
            isActive ? 'text-purple-700' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-purple-200 text-purple-700' : 'bg-purple-50 text-purple-600'
            }`}>
              Online
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('pedidos');
  const [userData, setUserData] = useState({ name: '', role: '' });
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3300/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData({ name: response.data.name, role: response.data.role });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const menuItems = [
    {
      id: 'pedidos',
      title: 'Pedidos',
      subtitle: 'Gestiona tus órdenes',
      icon: <ShoppingBag />,
      path: '/pedidos'
    },
    {
      id: 'ventas',
      title: 'Ventas',
      subtitle: 'Análisis y reportes',
      icon: <DollarSign />,
      path: '/ventas'
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      subtitle: 'Administra usuarios',
      icon: <Users />,
      path: '/usuarios'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <nav className="backdrop-blur-md bg-white/75 sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Creamy Soft
              </h1>
            </div>
            
            {userData.name && (
              <div className="flex items-center gap-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-purple-50 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-purple-600" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              isActive={activeItem === item.id}
              onClick={() => {
                setActiveItem(item.id);
                history.push(item.path);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
