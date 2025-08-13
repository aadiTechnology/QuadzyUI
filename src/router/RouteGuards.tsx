import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const getScreenAccessConfig = () => {
  const config = localStorage.getItem('screenAccessConfig');
  return config ? JSON.parse(config) : {};
};

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const auth = useAuth();
  const user = (auth as any).user;
  const location = useLocation();
  const permissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
  const allowedRoles = permissions[location.pathname] || [];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default RouteGuard;