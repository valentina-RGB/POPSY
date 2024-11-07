import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/navbar"; // Asegúrate de que el path sea correcto
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
import Login from './page/Acceso/login';
import SignUp from './page/Acceso/signUp';
import OrderAdd from './page/Order/Order_add';

const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar fijo */}
      <Navbar />
      <div className="tw-flex tw-flex-col md:tw-flex-row">
        {/* Sidebar o menú */}
        <Menu />

        {/* Contenido principal con suficiente padding-top */}
        <div className="tw-page-holder tw-w-full tw-pt"> {/* Añadimos tw-pt-16 para que el contenido no se superponga */}
          <div className="tw-container-fluid tw-px-lg-4 tw-px-xl-5">
            {/* Definición de rutas */}
            <Routes>
              <Route path="/" element={<Navigate to="/Dashboard" />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Categorias" element={<Categorias />} />
              <Route path="/Insumos" element={<Insumos />} />
              <Route path="/historial-entradas" element={<EntriesList />} />
              <Route path="/Ventas" element={<Ventas />} />
              <Route path="/Productos" element={<Productos />} />
              <Route path="/Pedidos" element={<Pedidos />} />
              <Route path="/roles" element={<ListarRoles />} />
              <Route path="/Clientes" element={<ListarClientes />} />
              <Route path="/agregar-cliente" element={<AddCliente />} />
              <Route path="/Usuarios" element={<ListarUsuarios />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Agregar-pedidos" element={<OrderAdd />} />
              <Route path="/Agregar-ventas" element={<Ventasadd />} />
            </Routes>
            <footer className="footer tw-bg-white tw-shadow tw-align-self-end tw-py-3 tw-px-xl-5 tw-w-full">
              <div className="tw-container-fluid">
                <div className="tw-row">
                  <div className="tw-col-md-6 tw-text-center tw-text-md-start tw-fw-bold">
                    <p className="tw-mb-2 tw-mb-md-0 tw-fw-bold">
                      Creamy Soft &copy; 2024
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
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
