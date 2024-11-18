import { useHistory } from 'react-router-dom';

const CerrarSesion: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    
    // Redirigir al login
    history.push('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default CerrarSesion;
