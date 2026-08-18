import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isValid = false;
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        // Validate that user data actually exists and has necessary properties
        if (storedUser && typeof storedUser === 'object' && storedUser.role) {
          setUser(storedUser);
          isValid = true;
        }
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    
    // Clear invalid state if we have a token but corrupted/missing user data
    if (token && !isValid) {
      logout();
    } else {
      setLoading(false);
    }

    // Listen for unauthorized events from the API interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (phone, password) => {
    const res = await api.post('/auth/login', { phone, password });
    if (res.success) {
      // The API returns { success: true, data: { token: '...', user: { ... } } }
      const { token, user: userData } = res.data;
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
