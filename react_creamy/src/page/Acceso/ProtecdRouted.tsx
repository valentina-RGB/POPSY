// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuhtContex';
// import { Rol } from '../../types/rol';
// import { Permiso } from '../../types/permiso';
// import { PermisoRol } from '../../types/permiso_rol';
// import axios from 'axios';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// function validateCurrentRoute(
//   roleID: number,
//   routeName: string,
//   permissions: Permiso[],
//   rolePermissions: PermisoRol[]
// ): boolean {

//   console.log(roleID, routeName, permissions, rolePermissions);
  
//   const permiso = permissions.find((permiso) => permiso.descripcion === routeName);
//   if (!permiso) return false;
//   console.log(permiso.ID_permiso);
  
//   const hasPermission = rolePermissions.some(
//     (rolePermiso) =>
//       rolePermiso.ID_roles === roleID && rolePermiso.ID_permisos === permiso.ID_permiso
//   );
  
//   console.log(hasPermission);

//   return hasPermission;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
//   const [permissions, setPermissions] = useState<Permiso[]>([]);
//   const [rolePermissions, setRolePermissions] = useState<PermisoRol[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchAuthData = async () => {
//       try {

//         const permissionsResponse = await axios.get('https://creamy-soft.onrender.com/permiso');
//         setPermissions(permissionsResponse.data);

//         const rolePermissionsResponse = await axios.get('https://creamy-soft.onrender.com/permiso_roles');
//         setRolePermissions(rolePermissionsResponse.data);

//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching auth data:', error);
//         setIsLoading(false);
//       }
//     };

//     fetchAuthData();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const storedRole = localStorage.getItem('ID_rol');

//   if (!storedRole) {
//     return <Navigate to="/login" replace />;
//   }

//   const currentRole: any = JSON.parse(storedRole) as Rol;
//   const routeName: string = (children as any)?.type?.name || '';

//   const isAllowed = validateCurrentRoute(
//     currentRole,
//     routeName,
//     permissions,
//     rolePermissions
//   );

//   if (!isAllowed) {
//     return <Navigate to="/Home" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

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