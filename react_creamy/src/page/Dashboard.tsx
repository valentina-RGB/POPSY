import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TooltipItem,
} from "chart.js";
import {
  DollarSign,
  Calendar,
  ShoppingBag,
  Package,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard: React.FC = () => {
  interface Producto {
    ID_producto: number;
    Producto: { nombre: string };
    total_vendido: number;
  }

  interface InsumoCritico {
  ID_stock_insumo: number;
  stock_actual: number;
  stock_min: number;
  stock_max: number;
  insumo: {
    ID_insumo: number;
    descripcion_insumo: string;
    precio: number;
    estado_insumo: string;
  };
}


  const [productosMasVendidos, setProductosMasVendidos] = useState<Producto[]>([]);
  const [ventasData, setVentasData] = useState<{ fecha: string; precio_total: number }[]>([]);
  const [ventasPorDia, setVentasPorDia] = useState<{ [key: string]: number }>({});
  const [totalVentas, setTotalVentas] = useState(0);
  const [insumosCriticos, setInsumosCriticos] = useState<InsumoCritico[]>([]);
  const [filtro, setFiltro] = useState<"mes" | "dias">("mes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await axios.get("http://localhost:3300/dashboard/productos-mas-vendidos");
        setProductosMasVendidos(productosResponse.data);
  
        const ventasResponse = await axios.get(`http://localhost:3300/dashboard/ventas?filtro=${filtro}`);
        const ventas = ventasResponse.data.datos.ventas;

        const response = await axios.get('http://localhost:3300/dashboard/insumos');
        setInsumosCriticos(response.data.data); 
  
        // Agrupar las ventas por día y contar su cantidad
        const ventasPorDiaCantidad = ventas.reduce((acc: { [key: string]: number }, venta: { fecha_sin_hora: string }) => {
          const fecha = venta.fecha_sin_hora;
          acc[fecha] = (acc[fecha] || 0) + 1; // Incrementa el contador de ventas para ese día
          return acc;
        }, {});
  
        setVentasData(ventas);
        setVentasPorDia(ventasPorDiaCantidad);
        setTotalVentas(ventasResponse.data.datos.estadisticas.totalVentas);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [filtro]);

  const pieData = {
    labels: productosMasVendidos.map((producto) => producto.Producto.nombre),
    datasets: [
      {
        data: productosMasVendidos.map((producto) => producto.total_vendido),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const ventasChartData = {
    labels: Object.keys(ventasPorDia),
    datasets: [
      {
        label: "Ventas",
        data: Object.values(ventasPorDia),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const calculateStockStatus = (current: number, min: number, max: number) => {
    if (current <= 0) return 'Agotado'; // Stock actual es 0 o menor
    if (current < min) return 'Crítico'; // Stock actual menor al mínimo
    if (current < max / 2) return 'Bajo'; // Stock actual menor a la mitad del máximo
    return 'Normal'; // Stock en nivel adecuado
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agotado': return 'tw-bg-red-100 tw-text-red-800';
      case 'Crítico': return 'tw-bg-orange-100 tw-text-orange-800';
      case 'Bajo': return 'tw-bg-yellow-100 tw-text-yellow-800';
      default: return 'tw-bg-green-100 tw-text-green-800'; // Para 'Normal'
    }
  };

  const statsCards = [
    {
      title: "Total Ventas",
      value: `$${totalVentas.toLocaleString()}`,
      icon: <DollarSign className="tw-w-5 tw-h-5" />,
    },
    {
      title: "Ventas del Día",
      value: `$${ventasData
        .filter((venta) => new Date(venta.fecha).toDateString() === new Date().toDateString())
        .reduce((acc, venta) => acc + venta.precio_total, 0)
        .toLocaleString()}`,
      icon: <Calendar className="tw-w-5 tw-h-5" />,
    },
    {
      title: "Productos Vendidos",
      value: productosMasVendidos.reduce((acc: number, curr) => acc + Number(curr.total_vendido), 0),
      icon: <ShoppingBag className="tw-w-5 tw-h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-screen">
        <div className="tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-t-4 tw-border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-screen">
        <p className="tw-text-red-600 tw-font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-max-w-7xl tw-mx-auto">
        <header className="tw-mb-8">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Panel de Control</h1>
          <p className="tw-mt-2 tw-text-gray-600">Resumen de ventas y métricas clave</p>
        </header>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div>
                  <p className="tw-text-sm tw-text-gray-500">{card.title}</p>
                  <p className="tw-text-2xl tw-font-semibold tw-text-gray-800">{card.value}</p>
                </div>
                <div className="tw-p-3 tw-rounded-full tw-bg-indigo-100">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
          <div className="lg:tw-col-span-2 tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm">
            <h2 className="tw-text-lg tw-font-semibold tw-mb-4">Tendencia de Ventas</h2>
            <Line data={ventasChartData} options={{ responsive: true }} />
          </div>

          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm">
            <h2 className="tw-text-lg tw-font-semibold tw-mb-4">Productos Más Vendidos</h2>
            <Pie data={pieData} />
          </div>
        </div>

        <div className="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h2 className="tw-text-xl tw-font-bold tw-text-gray-800">Insumos Críticos</h2>
        <Package className="tw-h-6 tw-w-6 tw-text-gray-500" />
      </div>

      {insumosCriticos.length === 0 ? (
        <div className="tw-text-center tw-text-gray-500 tw-py-4">
          No hay insumos críticos en este momento
        </div>
      ) : (
        <div className="tw-space-y-4">
          {insumosCriticos.map((insumo) => {
            const stockStatus = calculateStockStatus(insumo.stock_actual, insumo.stock_min, insumo.stock_max);
            
            return (
              <div 
                key={insumo.ID_stock_insumo} 
                className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-flex tw-justify-between tw-items-center"
              >
                <div>
                  <h3 className="tw-font-semibold tw-text-gray-800">
                    {insumo.insumo.descripcion_insumo}
                  </h3>
                  <div className="tw-text-sm tw-text-gray-600 tw-mt-1">
                    Precio: ${insumo.insumo.precio.toLocaleString()}
                  </div>
                </div>
                <div className="tw-flex tw-items-center tw-space-x-4">
                  <div className="tw-flex tw-flex-col tw-items-end">
                    <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${getStatusColor(stockStatus)}`}>
                      {stockStatus}
                    </span>
                    <div className="tw-text-sm tw-text-gray-600 tw-mt-1">
                      Stock: {insumo.stock_actual} / {insumo.stock_min}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
