import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to proper dashboard based on user role
    if (user.role === 'owner') {
      return <Navigate to="/owner-dashboard" replace />;
    } else {
      return <Navigate to="/employee-dashboard" replace />;
    }
  }

  return children;
};
