import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the current path in sessionStorage before redirecting. User stays on the same page after reloading
      sessionStorage.setItem('redirectPath', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  return isAuthenticated ? <Outlet /> : <Navigate to={sessionStorage.getItem('redirectPath') || '/login'} replace />;
};

export default PrivateRoute;

