import { Toaster} from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./components/navbar_prueba";
import Menu from "./components/sidebar";
import Dashboard from "./page/Dashboard";
import Categorias from "./page/Categories/Categories-list";
import Insumos from "./page/Insumos/Insumos-list";
import Entradas from "./page/Insumos/EntriesList";
import Ventas from "./page/Ventas/VentasList";
import Ventasadd from "./page/Ventas/CreateVenta";
import AddCliente from './page/Clientes/CreateCliente';
import ListarClientes from './page/Clientes/ListCliente';
import Productos from './page/Products/products-list';
import Pedidos from './page/Order/Order_list';
import Pedidos_Detalles from './page/Order/Order_details';
import Ventas_Detalles from './page/Ventas/VentaDetail';
import Login from './page/Acceso/login';
import SignUp from './page/Acceso/signUp';
import OrderAdd from './page/Order/Order_add';
import { AuthProvider } from './page/Acceso/AuhtContex';
import ProtectedRoute from './page/Acceso/ProtecdRouted';
import Roles from './page/Roles/ListRol';
import Usuarios from './page/Usuarios/ListUsuario';
import NotFoundPage from './components/404';
import Home from './page/Home';
import Help from './components/help';
import { VerDetalle } from './page/Manuales/categorias/ver_detalle';




// Manuales 





const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Si la ruta es específicamente 404, no renderizar el layout
  if (location.pathname === '/404' || location.pathname === '/login' || location.pathname === '/Login') {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar toggleMenu={toggleMenu} />
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-pt-6">
        <Menu isMenuOpen={isMenuOpen} />
        <div className="tw-flex-1 tw-p-4 md:tw-p-1 tw-overflow-auto">
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-p-4 md:tw-p-6 tw-min-h-[calc(100vh-150px)]">
            {children}
            <footer className="tw-mt-6 tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
              <div className="tw-container-fluid">
                <div className="tw-text-center md:tw-text-left tw-mb-2 md:tw-mb-0">
                  <div className="tw-col-md-6 tw-text-center tw-text-md-start tw-fw-bold">
                    <p className="tw-mb-2 tw-mb-md-0 tw-fw-bold">
                      Creamy Soft &copy; {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="tw-col-md-6 tw-text-center tw-text-md-end tw-text-gray-400">
                    <p className="tw-mb-0">Version 1.3.2</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <Help />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ConditionalLayout>
          <Routes>
            {/* Rutas sin layout específico */}
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/" element={<Navigate to="/Home" />} />

            {/* Rutas principales */}
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            <Route
              path="/Home"
              element={
                <ProtectedRoute>
                  <Home username="defaultUser" role="defaultRole" />
                </ProtectedRoute>
              } />
            <Route
              path="/Categorias"
              element={
                <ProtectedRoute>
                  <Categorias />
                </ProtectedRoute>
              } />
            <Route
              path="/Insumos"
              element={
                <ProtectedRoute>
                  <Insumos />
                </ProtectedRoute>
              } />
            <Route
              path="/historial-entradas"
              element={
                <ProtectedRoute>
                  <Entradas />
                </ProtectedRoute>
              } />
            <Route
              path="/Ventas"
              element={
                <ProtectedRoute>
                  <Ventas/>
                </ProtectedRoute>
              } />
            <Route
              path="/Productos"
              element={
                <ProtectedRoute>
                  <Productos />
                </ProtectedRoute>
              } />
            <Route
              path="/Pedidos"
              element={
                <ProtectedRoute>
                  <Pedidos />
                </ProtectedRoute>
              } />
            <Route path="/pedido/:id"
              element=
              {
                <ProtectedRoute>
                  <Pedidos_Detalles />
                </ProtectedRoute>
              } />
            <Route path="/venta/:id"
              element={
                <ProtectedRoute>
                  <Ventas_Detalles />
                </ProtectedRoute>
              } />
            <Route
              path="/Editar-pedido/:id"
              element={
                <ProtectedRoute>
                  <OrderAdd />
                </ProtectedRoute>
              } />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              } />
            <Route
              path="/Clientes"
              element={
                <ProtectedRoute>
                  <ListarClientes />
                </ProtectedRoute>
              } />
            <Route
              path="/agregar-cliente"
              element={
                <ProtectedRoute>
                  <AddCliente />
                </ProtectedRoute>
              } />
            <Route
              path="/Usuarios"
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              } />
            <Route
              path="/Agregar-pedidos"
              element={
                <ProtectedRoute>
                  <OrderAdd />
                </ProtectedRoute>
              } />
            <Route
              path="/Agregar-ventas"
              element={
                <ProtectedRoute>
                  <Ventasadd />
                </ProtectedRoute>
              } />

            {/* Ruta 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />

            {/* Manuales */}
            <Route path="/manual_categoría" element={<VerDetalle/>} />
          </Routes>
        </ConditionalLayout>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  );
};

export default App;