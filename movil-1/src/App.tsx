import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';
import { storefrontOutline, clipboardOutline, logOutOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { IonHeader, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { searchCircle } from 'ionicons/icons';
setupIonicReact();

const App: React.FC = () => (
<>

<IonApp>
    <IonReactRouter>
      <IonTabs>
        {/* Rutas de la aplicación */}
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to="/home" />
          </Route>
          <Route path="/home" exact={true}>
            <Home />
          </Route>
          <Route path="/message/:id" exact={true}>
            <ViewMessage />
          </Route>
          <Route path="/ventas" exact={true}>
            <div>Ventas</div>
          </Route>
          <Route path="/pedidos" exact={true}>
            <div>Pedidos</div>
          </Route>
          <Route path="/cerrar-sesion" exact={true}>
            <div>Cerrar Sesión</div>
          </Route>
        </IonRouterOutlet>

        {/* Barra de Navegación */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="ventas" href="/ventas">
            <IonIcon icon={storefrontOutline} />
            <IonLabel>Ventas</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pedidos" href="/pedidos">
            <IonIcon icon={clipboardOutline} />
            <IonLabel>Pedidos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cerrarSesion" href="/cerrar-sesion">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
</>
);

export default App;
