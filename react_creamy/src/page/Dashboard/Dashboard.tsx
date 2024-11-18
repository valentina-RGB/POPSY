import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ShoppingCart, Activity, DollarSign, Users, Percent } from 'lucide-react';

const SalesDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const salesData = [
    { month: 'Ene', ventas: 4000, pedidos: 240, clientes: 180 },
    { month: 'Feb', ventas: 3000, pedidos: 198, clientes: 160 },
    { month: 'Mar', ventas: 5000, pedidos: 280, clientes: 220 },
    { month: 'Abr', ventas: 4500, pedidos: 308, clientes: 250 },
    { month: 'May', ventas: 6000, pedidos: 387, clientes: 290 },
    { month: 'Jun', ventas: 5500, pedidos: 350, clientes: 270 }
  ];

  const topProducts = [
    { name: 'Laptop Pro', ventas: 145, porcentaje: 28 },
    { name: 'Smart Watch', ventas: 120, porcentaje: 23 },
    { name: 'Auriculares BT', ventas: 98, porcentaje: 19 },
    { name: 'Tablet Air', ventas: 75, porcentaje: 15 },
    { name: 'Mouse Gaming', ventas: 68, porcentaje: 13 }
  ];

  const categorySales = [
    { name: 'Electrónicos', value: 45 },
    { name: 'Accesorios', value: 25 },
    { name: 'Gaming', value: 15 },
    { name: 'Audio', value: 10 },
    { name: 'Otros', value: 5 }
  ];

  const performanceData = [
    { subject: 'Ventas', A: 120, fullMark: 150 },
    { subject: 'Clientes', A: 98, fullMark: 150 },
    { subject: 'Ingresos', A: 86, fullMark: 150 },
    { subject: 'Satisfacción', A: 99, fullMark: 150 },
    { subject: 'Crecimiento', A: 85, fullMark: 150 },
    { subject: 'Retención', A: 65, fullMark: 150 },
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  const totalVentas = salesData.reduce((sum, item) => sum + item.ventas, 0);
  const totalPedidos = salesData.reduce((sum, item) => sum + item.pedidos, 0);

  const AnimatedValue = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (isLoaded) {
        const duration = 1500;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(timer);
      }
    }, [value, isLoaded]);

    return <>{prefix}{displayValue.toLocaleString()}{suffix}</>;
  };

  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-4 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatsCard = ({ title, value, icon: Icon, color, growth }: { title: string, value: number, icon: any, color: string, growth: number }) => (
    <Card className={`bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className={`p-2 ${color} rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color.split('-')[0]}-600`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-800">
          <AnimatedValue value={value} prefix={title === 'Ventas Totales' ? '$' : ''} />
        </div>
        <p className={`text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'} mt-2 font-medium`}>
          {growth >= 0 ? '+' : ''}{growth}% vs mes anterior
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className={`p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Dashboard de Ventas</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4 animate-pulse" />
          <span>Tiempo real</span>
        </div>
      </div>
      
      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Ventas Totales" 
          value={totalVentas} 
          icon={DollarSign}
          color="bg-green-100"
          growth={12.5}
        />
        <StatsCard 
          title="Total Pedidos" 
          value={totalPedidos} 
          icon={ShoppingCart}
          color="bg-blue-100"
          growth={8.2}
        />
        <StatsCard 
          title="Clientes Nuevos" 
          value={387} 
          icon={Users}
          color="bg-purple-100"
          growth={15.7}
        />
        <StatsCard 
          title="Tasa de Conversión" 
          value={24} 
          icon={Percent}
          color="bg-orange-100"
          growth={5.3}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Tendencia de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorVentas)"
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorPedidos)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Distribución de Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={2000}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className={index === activeIndex ? 'scale-110' : ''}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Rendimiento General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar
                    name="Rendimiento"
                    dataKey="A"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    fillOpacity={0.6}
                    animationDuration={2000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Top Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="ventas" 
                    radius={[0, 4, 4, 0]}
                    animationDuration={2000}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;