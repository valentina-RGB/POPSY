import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuhtContex';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/Login" replace />
  );
};

export default ProtectedRoute;