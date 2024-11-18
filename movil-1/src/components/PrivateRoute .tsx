import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;  // Cambiar `element` por `children`
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
