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

interface Venta {
  ID_venta: number;
  fecha: string;
  precio_total: number;
  ID_estado_venta: number;
  ProductosLista: {
    ID_producto: number;
    nombre: string;
    precio_neto: number;
    Producto_Ventas: {
      cantidad: number;
      sub_total: number;
    };
  }[];
}

const VentasList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
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

  const fetchVentas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3300/ventas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const getStatusLabel = (estado: number) => {
    switch (estado) {
      case 1: return 'Pagado';
      case 2: return 'Cancelado';

      default: return 'Desconocido';
    }
  };

  const getStatusColor = (estado: number) => {
    switch (estado) {
      case 2: return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 1: return 'bg-amber-50 text-amber-600 border border-amber-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const filteredData = ventas.filter(
    (venta) =>
      venta.ID_venta.toString().includes(searchText) ||
      venta.ProductosLista.some((producto) =>
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
              onClick={fetchVentas}
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
            Mis Ventas
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
              {filteredData.map((venta) => (
                <div
                  key={venta.ID_venta}
                  className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between 
                             hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => setSelectedVenta(venta)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <ShoppingCart size={24} className="text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Venta #{venta.ID_venta}</h3>
                      <p className="text-sm text-gray-500">{formatDate(venta.fecha)}</p>
                      <p className="text-pink-600 font-semibold">{formatPrecio(venta.precio_total)}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      venta.ID_estado_venta
                    )}`}
                  >
                    {getStatusLabel(venta.ID_estado_venta)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <IonModal
          isOpen={!!selectedVenta}
          onDidDismiss={() => setSelectedVenta(null)}
          breakpoints={[0, 0.5, 0.8]}
          initialBreakpoint={0.8}
          className="rounded-t-3xl"
        >
          {selectedVenta && (
            <div className="p-6 bg-gradient-to-br from-white via-pink-50 to-purple-50 h-full rounded-t-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Detalle del Venta
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedVenta.ID_estado_venta
                  )}`}
                >
                  {getStatusLabel(selectedVenta.ID_estado_venta)}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-pink-400" size={24} />
                    <p className="text-gray-600">Fecha</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatDate(selectedVenta.fecha)}</p>
                </div>
                <div className="border-t border-pink-100 my-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-pink-400" size={24} />
                    <p className="text-gray-600">Total</p>
                  </div>
                  <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    {formatPrecio(selectedVenta.precio_total)}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Package className="text-pink-400 mr-3" size={24} />
                Productos
              </h3>
              <div className="space-y-3">
                {selectedVenta.ProductosLista.map((producto) => (
                  <div
                    key={producto.ID_producto}
                    className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:scale-[1.02] transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {producto.Producto_Ventas.cantidad}x {formatPrecio(producto.Producto_Ventas.sub_total)}
                      </p>
                    </div>
                    <IceCream size={28} className="text-pink-400" />
                  </div>
                ))}
              </div>

              <IonButton
                expand="full"
                onClick={() => setSelectedVenta(null)}
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

export default VentasList;