import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isValid = false;

    if (token) {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem('user')
        );

        if (
          storedUser &&
          typeof storedUser === 'object' &&
          storedUser.role
        ) {
          setUser(storedUser);
          isValid = true;
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }

    if (token && !isValid) {
      logout();
    } else {
      setLoading(false);
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(
      'auth-unauthorized',
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        'auth-unauthorized',
        handleUnauthorized
      );
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    if (res.success) {
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
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};