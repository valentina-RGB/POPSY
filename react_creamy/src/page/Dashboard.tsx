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
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard: React.FC = () => {
  interface Producto {
    ID_producto: number;
    Producto: { nombre: string };
    total_vendido: number;
  }

  const [productosMasVendidos, setProductosMasVendidos] = useState<Producto[]>([]);
  const [ventasData, setVentasData] = useState<{ fecha: string; precio_total: number }[]>([]);
  const [ventasPorDia, setVentasPorDia] = useState<{ [key: string]: number }>({});
  const [totalVentas, setTotalVentas] = useState(0);
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
      </div>
    </div>
  );
};

export default Dashboard;
