import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/login';
import PrivateRoute from './components/PrivateRoute ';
import HomePage from './pages/HomePage';
import VentasList from './pages/VentasList';
import PedidosList from './pages/PedidosList';
import Navbar from './components/Navbar';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css'; // Variables de tema personalizadas

setupIonicReact();

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirigir de forma forzada al login
  };

  const showNavbar = !['/login', '/'].includes(window.location.pathname);

  return (
    <IonApp>
      <IonReactRouter>
        {showNavbar && <Navbar onLogout={handleLogout} />} {/* Mostrar Navbar si no es login */}
        
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/login" exact>
              <LoginPage onLoginSuccess={({ token }) => {
                localStorage.setItem('token', token);
                window.location.href = '/home'; // Redirigir después del login exitoso
              }} />
            </Route>
            <Route path="/" exact>
              <Redirect to="/login" /> {/* Redirigir a login si está en raíz */}
            </Route>
            <PrivateRoute path="/home" exact>
              <HomePage />
            </PrivateRoute>
            <PrivateRoute path="/ventas" exact>
              <VentasList />
            </PrivateRoute>
            <PrivateRoute path="/pedidos" exact>
              <PedidosList />
            </PrivateRoute>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
 