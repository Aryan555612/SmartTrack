import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { Landing } from './pages/Landing';
import { ProtectedRoute } from './components/ProtectedRoute';

const DefaultRedirect = () => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard'} replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login"   element={<Login />} />
            <Route path="/pricing" element={<Landing />} />

            <Route
              path="/employee-dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<DefaultRedirect />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
