import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuhtContex';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        // Puedes eliminar estas llamadas si no son necesarias
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching auth data:', error);
        setIsLoading(false);
      }
    };

    fetchAuthData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const storedRole = localStorage.getItem('ID_rol');

  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuhtContex';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? (
//     <>{children}</>
//   ) : (
//     <Navigate to="/Login" replace />
//   );
// };

// export default ProtectedRoute;