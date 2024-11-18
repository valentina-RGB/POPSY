import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, RefreshCw, X, ChevronRight } from 'lucide-react';

const SalesList = () => {
  const [sales, setSales] = useState<any[]>([]); // Lista de ventas
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Obtener el color según el estado de la venta
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Formatear la fecha de la venta
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener las ventas de la API
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3300/ventas'); // Cambiar por la URL de tu API
      if (!response.ok) {
        throw new Error('Error al obtener las ventas');
      }
      const data = await response.json();
      setSales(data); // Establecer las ventas en el estado
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    fetchSales();
  }, []);

  // Filtrar las ventas en función del texto de búsqueda
  const filteredData = sales.filter(sale =>
    sale.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
    sale.id.toString().includes(searchText)
  );

  // Manejar la recarga de las ventas
  const handleRefresh = () => {
    fetchSales();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="pb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente o número..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          // Carga con esqueleto
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : (
          // Tarjetas de ventas
          filteredData.map((sale, index) => (
            <div
              key={sale.id}
              className="bg-white rounded-lg shadow mb-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-98"
              style={{
                animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`
              }}
              onClick={() => {
                setSelectedSale(sale);
                setShowModal(true);
              }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{sale.id} - {sale.clientName}
                    </h3>
                    <p className="text-gray-600">{formatDate(sale.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-900 font-semibold">{sale.amount}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-lg max-w-md w-full transform transition-all duration-300"
            style={{animation: 'modalEnter 0.3s ease-out forwards'}}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Detalles de Venta #{selectedSale.id}</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3">
                <p><span className="font-semibold">Cliente:</span> {selectedSale.clientName}</p>
                <p><span className="font-semibold">Fecha:</span> {formatDate(selectedSale.date)}</p>
                <p><span className="font-semibold">Estado:</span> {selectedSale.status}</p>
                <p><span className="font-semibold">Monto:</span> {selectedSale.amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de agregar nueva venta */}
      <button 
        className="fixed right-6 bottom-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
        onClick={() => alert('Agregar nueva venta')}
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default SalesList;
