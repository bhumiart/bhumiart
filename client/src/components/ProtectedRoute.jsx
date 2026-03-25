import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ isAdmin }) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (isAdmin && !userInfo.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
