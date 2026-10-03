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

  const getErrorMessage = (err, defaultMsg) => {
    const data = err.response?.data;
    if (!data) return err.message || defaultMsg;
    if (typeof data === 'string') return data;
    if (data.details && data.details.includes('buffering timed out')) {
      return "Database connection timed out. MongoDB Atlas cluster may be offline or paused.";
    }
    if (data.details && data.details.includes('whitelist')) {
      return data.details;
    }
    if (data.message && data.message !== "Internal Server Error") {
      return data.message;
    }
    if (data.details) {
      return data.details;
    }
    return data.message || defaultMsg;
  };

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
      const errorMsg = getErrorMessage(err, "Invalid email or password");
      return { success: false, message: errorMsg };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await API.post('/auth/signup', { username, email, password });
      // Automatically log the user in after signing up for smooth UX
      const loginRes = await login(email, password);
      return loginRes;
    } catch (err) {
      const errorMsg = getErrorMessage(err, "Signup failed. Please check your credentials.");
      return { success: false, message: errorMsg };
    }
  };

  const loginAsDemo = useCallback((demoUsername = 'CosmicExplorer') => {
    const demoUser = {
      _id: 'demo_user_' + Date.now(),
      userId: 'demo_user_' + Date.now(),
      username: demoUsername,
      email: 'demo@orbit.social',
      token: 'demo_jwt_token_orbit',
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));

    if (pendingAction && typeof pendingAction === 'function') {
      setTimeout(() => {
        try {
          pendingAction(demoUser);
        } catch (e) {
          console.error("Pending action error:", e);
        }
      }, 100);
    }

    closeAuthModal();
    return demoUser;
  }, [pendingAction, closeAuthModal]);

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
        loginAsDemo,
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
