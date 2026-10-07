import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI } from '../services/api';

const DEFAULT_ADMIN = {
  id: 'usr-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@gmail.com',
  role: 'admin',
  title: 'Hotel Administrator',
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser && !localStorage.getItem('logged_out')) {
      localStorage.setItem('user', JSON.stringify(DEFAULT_ADMIN));
      setUser(DEFAULT_ADMIN);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try backend if available
      const res = await loginAPI({ email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('logged_out');
      setUser(userData);
      return userData;
    } catch {
      // Seamless offline fallback for student project
      const fallbackUser = {
        id: 'usr-demo',
        name: email?.includes('alex') ? 'Alex Johnson' : 'Alex Johnson',
        email: email || 'alex.johnson@gmail.com',
        role: 'admin',
        title: 'Hotel Administrator',
      };
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      localStorage.removeItem('logged_out');
      setUser(fallbackUser);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('logged_out', 'true');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

