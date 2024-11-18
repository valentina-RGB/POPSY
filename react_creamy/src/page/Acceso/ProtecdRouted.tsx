import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAuth } from './AuhtContex';

interface ProtectedRouteProps extends RouteProps {
  requiredRole: number;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, element, ...rest }) => {
  const { isAuthenticated, role } = useAuth();

  // Si el usuario no está autenticado o no tiene el rol requerido, redirigimos a /login
  if (!isAuthenticated || role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene el rol, mostramos el componente
  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
