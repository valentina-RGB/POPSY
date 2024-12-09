import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

interface MenuItemProps {
  icon: React.ReactElement;
  title: string;
  onClick: () => void;
  isActive: boolean;
  subtitle?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onClick, isActive, subtitle }) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 
        'border-2 border-purple-500 bg-purple-50' : 'bg-white'}`}
    >
      <div className="flex items-center p-5 space-x-4">
        <div className={`p-4 rounded-xl ${
          isActive ? 'bg-purple-500' : 'bg-purple-100'
        }`}>
          {React.cloneElement(icon, { 
            className: `w-8 h-8 ${isActive ? 'text-white' : 'text-purple-600'}`
          })}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-xl ${
            isActive ? 'text-purple-800' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const NavigationMenu = () => {
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
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-6">
      {/* Header */}
      <nav className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Creamy Soft
            </h1>
          </div>
          
          {userData.name && (
            <div className="flex items-center gap-x-4">
              <div className="text-right">
                <p className="text-md font-semibold text-gray-900">{userData.name}</p>
                <p className="text-sm text-gray-500">{userData.role}</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
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

      {/* Logout Button */}
     
    </div>
  );
};

export default NavigationMenu;