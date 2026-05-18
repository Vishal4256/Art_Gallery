import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
      // Fetch fresh data including wishlist
      fetchFreshData(parsed.token);
    }
    setLoading(false);
  }, []);

  const fetchFreshData = async (token) => {
    try {
      const res = await api.get('/users/wishlist');
      setUser(prev => ({ ...prev, wishlist: res.data.map(a => a._id || a) }));
    } catch (error) {
      console.error('Failed to refresh user data');
    }
  };

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    fetchFreshData(userData.token);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchFreshData }}>
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
