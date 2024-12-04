import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuhtContex';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function validateCurrentRoute(
  roleID: number,
  routeName: string,
  permissions: Permiso[],
  rolePermissions: PermisoRol[]
): boolean {

  console.log(roleID, routeName, permissions, rolePermissions);
  
  const permiso = permissions.find((permiso) => permiso.descripcion === routeName);
  if (!permiso) return false;
  console.log(permiso.ID_permiso);
  
  const hasPermission = rolePermissions.some(
    (rolePermiso) =>
      rolePermiso.ID_roles === roleID && rolePermiso.ID_permisos === permiso.ID_permiso
  );
  
  console.log(hasPermission);

  return hasPermission;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const [permissions, setPermissions] = useState<Permiso[]>([]);
  const [rolePermissions, setRolePermissions] = useState<PermisoRol[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {

        const permissionsResponse = await axios.get('http://localhost:3300/permiso');
        setPermissions(permissionsResponse.data);

        const rolePermissionsResponse = await axios.get('http://localhost:3300/permiso_roles');
        setRolePermissions(rolePermissionsResponse.data);

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

  const currentRole: any = JSON.parse(storedRole) as Rol;
  const routeName: string = (children as any)?.type?.name || '';

  const isAllowed = validateCurrentRoute(
    currentRole,
    routeName,
    permissions,
    rolePermissions
  );

  if (!isAllowed) {
    return <Navigate to="/Home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;