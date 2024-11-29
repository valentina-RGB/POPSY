import { Toaster, toast } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./components/navbar_prueba";
import Menu from "./components/sidebar";
import Dashboard from "./page/Dashboard";
import Categorias from "./page/Categories/Categories-list";
import Insumos from "./page/Insumos/Insumos-list";
import EntriesList from "./page/Insumos/EntriesList";
import Ventas from "./page/Ventas/VentasList";
import Ventasadd from "./page/Ventas/CreateVenta";
import ListarRoles from './page/Roles/ListRol';
import AddCliente from './page/Clientes/CreateCliente';
import ListarClientes from './page/Clientes/ListCliente';
import ListarUsuarios from './page/Usuarios/ListUsuario';
import Productos from './page/Products/products-list';
import Pedidos from './page/Order/Order_list';
import PedidoDetalles from './page/Order/Order_details';
import VentaDetalles from './page/Ventas/VentaDetail';
import Login from './page/Acceso/login';
import SignUp from './page/Acceso/signUp';
import OrderAdd from './page/Order/Order_add';
import { AuthProvider } from './page/Acceso/AuhtContex';
import ProtectedRoute from './page/Acceso/ProtecdRouted';
import RolList from './page/Roles/ListRol';
import UsuarioList from './page/Usuarios/ListUsuario';
import NotFoundPage from './components/404';

const Loader: React.FC = () => (
  <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
    <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-4 tw-border-blue-500 tw-border-opacity-75"></div>
  </div>
);

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canShowToast, setCanShowToast] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showToast = (message: string) => {
    if (canShowToast) {
      toast(message);
      setCanShowToast(false);
      setTimeout(() => setCanShowToast(true), 2000); // Pausa de 2 segundos
    }
  };

  return (
    <>
      <Navbar toggleMenu={toggleMenu} />
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-pt-6">
        <Menu isMenuOpen={isMenuOpen} />
        <div className="tw-flex-1 tw-p-4 md:tw-p-1 tw-overflow-auto">
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-p-4 md:tw-p-6 tw-min-h-[calc(100vh-150px)]">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route
                path="/Dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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
                    <EntriesList />
                  </ProtectedRoute>
                } />
              <Route
                path="/Ventas"
                element={
                  <ProtectedRoute>
                    <Ventas />
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
              <Route path="/pedido/:id" element={<PedidoDetalles />} />
              <Route path="/venta/:id" element={<VentaDetalles />} />
              <Route path="/404" element={<NotFoundPage />} />
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
                    <RolList />
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
                    <UsuarioList />
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
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
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
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  );
};

export default App;
