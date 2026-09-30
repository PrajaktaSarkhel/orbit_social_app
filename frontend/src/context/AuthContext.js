import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  // Synchronize state changes with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const openAuthModal = useCallback(({ tab = 'login', message = '', action = null } = {}) => {
    setAuthModalTab(tab);
    setAuthModalMessage(message);
    if (action) {
      setPendingAction(() => action);
    }
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalMessage('');
    setPendingAction(null);
  }, []);

  // Gatekeeper for user interactions
  const requireAuth = useCallback((actionCallback, message = "Sign in to interact with the Orbit community") => {
    if (user && user.username) {
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    } else {
      openAuthModal({
        tab: 'login',
        message,
        action: actionCallback
      });
      return false;
    }
  }, [user, openAuthModal]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // If there was a pending action queued before opening auth modal, execute it!
      if (pendingAction && typeof pendingAction === 'function') {
        setTimeout(() => {
          try {
            pendingAction(userData);
          } catch (e) {
            console.error("Error executing post-login pending action", e);
          }
        }, 100);
      }

      closeAuthModal();
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Invalid email or password";
      return { success: false, message: typeof errorMsg === 'string' ? errorMsg : "Login failed" };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await API.post('/auth/signup', { username, email, password });
      // Automatically log the user in after signing up for smooth UX
      const loginRes = await login(email, password);
      return loginRes;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Signup failed. Please check your credentials.";
      return { success: false, message: typeof errorMsg === 'string' ? errorMsg : "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && user.username),
        login,
        signup,
        logout,
        requireAuth,
        authModalOpen,
        authModalTab,
        authModalMessage,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
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

export default AuthContext;
