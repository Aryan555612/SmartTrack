import React, { createContext, useContext, useState } from 'react';
import { apiFetch } from '../utils/api';

const MALE_OWNER_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('smarttrack_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.role === 'owner') {
        parsed.name = 'Aryan Patel';
        parsed.title = 'CEO & Founder';
        parsed.avatar = MALE_OWNER_AVATAR;
        localStorage.setItem('smarttrack_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('smarttrack_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = (userData, tokenData) => {
    let updatedUser = { ...userData };
    if (updatedUser.role === 'owner') {
      updatedUser.name = 'Aryan Patel';
      updatedUser.title = 'CEO & Founder';
      updatedUser.avatar = MALE_OWNER_AVATAR;
    }
    setUser(updatedUser);
    setToken(tokenData);
    localStorage.setItem('smarttrack_user', JSON.stringify(updatedUser));
    localStorage.setItem('smarttrack_token', tokenData);
  };

  const loginUser = async (email, role, password) => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smarttrack_user');
    localStorage.removeItem('smarttrack_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
