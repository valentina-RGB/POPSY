import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonSearchbar, 
  IonButton, 
  IonSpinner, 
  IonModal,
  IonButtons,
  IonBackButton,
  useIonRouter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { 
  RefreshCw, 
  IceCream, 
  ShoppingCart, 
  Calendar, 
  CreditCard, 
  Package,
  ArrowLeft 
} from 'lucide-react';

interface Pedido {
  ID_pedido: number;
  fecha: string;
  precio_total: number;
  ID_estado_pedido: number;
  ProductosLista: {
    ID_producto: number;
    nombre: string;
    precio_neto: number;
    Producto_Pedidos: {
      cantidad: number;
      sub_total: number;
    };
  }[];
}

const PedidosList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const history = useHistory();
  const ionRouter = useIonRouter();

  // Función para formatear precios en pesos colombianos
  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://creamy-soft.onrender.com/pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const getStatusLabel = (estado: number) => {
    switch (estado) {
      case 1: return 'Lista';
      case 2: return 'Proceso';
      case 3: return 'Venta';
      case 4: return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const getStatusColor = (estado: number) => {
    switch (estado) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = pedidos.filter(
    (pedido) =>
      pedido.ID_pedido.toString().includes(searchText) ||
      pedido.ProductosLista.some((producto) =>
        producto.nombre.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBack = () => {
    
      window.location.href = '/home';
    
  };

  return (
    <IonPage className='pt-2'>
      <IonHeader className="ion-no-border pt-14">
        <IonToolbar color="white" className="px-2 ">
          <IonButtons slot="start">
          <IonButton 
              onClick={handleBack}
              fill="clear"
              className="text-pink-600 hover:text-pink-700 transition-colors flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton 
              onClick={fetchPedidos} 
              fill="clear" 
              className="text-pink-600 hover:bg-pink-100 transition-all"
            >
              <RefreshCw size={20} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Mis Pedidos
          </h1>

          <IonSearchbar
            className="mb-4"
            placeholder="Buscar por número o sabor de helado"
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value!)}
          />

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <IonSpinner color="primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((pedido) => (
                <div 
                  key={pedido.ID_pedido} 
                  className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between 
                             hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => setSelectedPedido(pedido)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <ShoppingCart size={24} className="text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Pedido #{pedido.ID_pedido}</h3>
                      <p className="text-sm text-gray-500">{formatDate(pedido.fecha)}</p>
                      <p className="text-pink-600 font-semibold">{formatPrecio(pedido.precio_total)}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      pedido.ID_estado_pedido
                    )}`}
                  >
                    {getStatusLabel(pedido.ID_estado_pedido)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <IonModal 
          isOpen={!!selectedPedido} 
          onDidDismiss={() => setSelectedPedido(null)}
          breakpoints={[0, 0.5, 0.8]}
          initialBreakpoint={0.8}
          className="rounded-t-3xl"
        >
          {selectedPedido && (
            <div className="p-6 bg-gradient-to-br from-white via-pink-50 to-purple-50 h-full rounded-t-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Detalle del Pedido
                </h2>
                <span 
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedPedido.ID_estado_pedido
                  )}`}
                >
                  {getStatusLabel(selectedPedido.ID_estado_pedido)}
                </span>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-pink-400" size={24} />
                    <p className="text-gray-600">Fecha</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatDate(selectedPedido.fecha)}</p>
                </div>
                <div className="border-t border-pink-100 my-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-pink-400" size={24} />
                    <p className="text-gray-600">Total</p>
                  </div>
                  <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    {formatPrecio(selectedPedido.precio_total)}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Package className="text-pink-400 mr-3" size={24} />
                Productos
              </h3>
              <div className="space-y-3">
                {selectedPedido.ProductosLista.map((producto) => (
                  <div 
                    key={producto.ID_producto} 
                    className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:scale-[1.02] transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {producto.Producto_Pedidos.cantidad}x {formatPrecio(producto.Producto_Pedidos.sub_total)}
                      </p>
                    </div>
                    <IceCream size={28} className="text-pink-400" />
                  </div>
                ))}
              </div>

              <IonButton 
                expand="full" 
                onClick={() => setSelectedPedido(null)} 
                className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Cerrar
              </IonButton>
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default PedidosList;