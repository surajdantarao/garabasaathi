import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('garba_saathi_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const loginUser = async (loginInput, password) => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInput, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('garba_saathi_user', JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error during login' };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('garba_saathi_user', JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error during registration' };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('garba_saathi_user');
  };

  const refreshCurrentUser = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(apiUrl(`/api/users/${currentUser.id}`));
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('garba_saathi_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      loginUser,
      registerUser,
      logoutUser,
      refreshCurrentUser,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
