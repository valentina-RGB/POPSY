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
import { TrendingUp, Package, ArrowUp, ArrowDown, DollarSign, Calendar, ShoppingBag } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  interface Producto {
    ID_producto: number;
    Producto: {
      nombre: string;
    };
    total_vendido: number;
  }

  const [productosMasVendidos, setProductosMasVendidos] = useState<Producto[]>([]);
  interface Venta {
    fecha: string;
    precio_total: number;
  }

  const [ventasData, setVentasData] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('mes');
  const [totalVentas, setTotalVentas] = useState(0);
  const [ventasPorDia, setVentasPorDia] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await axios.get("http://localhost:3300/dashboard/productos-mas-vendidos");
        setProductosMasVendidos(productosResponse.data);

        const ventasResponse = await axios.get(`http://localhost:3300/dashboard/ventas?filtro=${filtro}`);
        const ventas = ventasResponse.data.datos.ventas;
        const ventasPorDia = ventasResponse.data.datos.estadisticas.ventasPorDia;
        
        setVentasData(ventas);
        setVentasPorDia(ventasPorDia);

        // Total de ventas del filtro actual
        setTotalVentas(ventasResponse.data.datos.estadisticas.totalVentas);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [filtro]);

  const data = {
    labels: productosMasVendidos.map((producto) => producto.Producto.nombre),
    datasets: [{
      data: productosMasVendidos.map((producto) => producto.total_vendido),
      backgroundColor: [
        "rgba(99, 102, 241, 0.8)",
        "rgba(168, 85, 247, 0.8)",
        "rgba(236, 72, 153, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(245, 158, 11, 0.8)"
      ],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"pie">) => {
            const value = tooltipItem.raw as number;
            const percentage = ((value / totalVentas) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const ventasDataForChart = {
    labels: Object.keys(ventasPorDia),
    datasets: [{
      label: "Ventas",
      data: Object.values(ventasPorDia),
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
    }],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: { 
        grid: {
          display: false,
        }
      },
      y: { 
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        }
      },
    },
  };

  const totalVentasDia = ventasData
    .filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      const fechaHoy = new Date();
      // Verificar si la venta es del mismo día (sin considerar la hora)
      return fechaVenta.toDateString() === fechaHoy.toDateString();
    })
    .reduce((acc, venta) => acc + venta.precio_total, 0);

  const ventasDelDia = totalVentasDia > 0 ? `$${totalVentasDia.toLocaleString()}` : "$0";

  const statsCards = [
    {
      title: "Total Ventas",
      value: `$${totalVentas.toLocaleString()}`,
      icon: <DollarSign className="tw-w-5 tw-h-5" />,
      color: "tw-bg-indigo-100 tw-text-indigo-600",
    },
    {
      title: "Ventas del Día",
      value: ventasDelDia,
      icon: <Calendar className="tw-w-5 tw-h-5" />,
      color: "tw-bg-purple-100 tw-text-purple-600",
    },
    {
      title: "Productos Vendidos",
      value: productosMasVendidos.reduce((acc, curr) => acc + curr.total_vendido, 0),
      icon: <ShoppingBag className="tw-w-5 tw-h-5" />,
      color: "tw-bg-pink-100 tw-text-pink-600",
    }
  ];

  return (
    <div className="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
      <div className="tw-max-w-7xl tw-mx-auto">
        <header className="tw-mb-8">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Panel de Control</h1>
          <p className="tw-mt-2 tw-text-gray-600">Resumen de ventas y métricas clave</p>
        </header>

        {loading ? (
          <div className="tw-flex tw-items-center tw-justify-center tw-h-64">
            <div className="tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-t-4 tw-border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
              {statsCards.map((card, index) => (
                <div key={index} className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-100">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <div>
                      <p className="tw-text-sm tw-text-gray-600">{card.title}</p>
                      <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{card.value}</p>
                    </div>
                    <div className={`tw-p-3 tw-rounded-lg ${card.color}`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
              <div className="lg:tw-col-span-2">
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-100">
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
                    <h2 className="tw-text-xl tw-font-semibold tw-text-gray-900">Tendencia de Ventas</h2>
                    <div className="tw-flex tw-gap-2">
                      {['mes', 'dias'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFiltro(f)}
                          className={`tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-colors
                            ${filtro === f 
                              ? 'tw-bg-indigo-500 tw-text-white' 
                              : 'tw-bg-gray-100 tw-text-gray-600 hover:tw-bg-gray-200'}`}
                        >
                          {f === 'mes' ? 'Mensual' : 'Últimos días'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Line data={ventasDataForChart} options={lineOptions} />
                </div>
              </div>

              <div>
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-100">
                  <h2 className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-6">Productos Más Vendidos</h2>
                  <Pie data={data} options={pieOptions} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
