import MessageListItem from "../components/MessageListItem";
import { useState } from "react";
import { Message, getMessages } from "../data/messages";
import { useLocation } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonSearchbar,
} from "@ionic/react";
import { searchCircle } from "ionicons/icons";
import "./Home.css"; // Asegúrate de tener las clases de estilo mejoradas aquí

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const location = useLocation();


  const pageTitle = location.pathname.includes("ventas")
    ? "Ventas"
    : location.pathname.includes("pedidos")
    ? "Pedidos"
    : "Inbox";

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Encabezado */}
        <IonHeader className="header-toolbar">
          <IonToolbar className="custom-toolbar">
            <IonTitle className="page-title">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Barra de búsqueda */}
        <IonToolbar className="searchbar-toolbar">
          <IonSearchbar
            searchIcon={searchCircle}
            animated
            placeholder="Buscar"
            className="custom-searchbar"
          ></IonSearchbar>
        </IonToolbar>

        {/* Lista de mensajes */}
        <IonList className="custom-message-list">
          {messages.map((m) => (
            <MessageListItem key={m.id} message={m} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
