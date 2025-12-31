import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser as authLogout } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 從 localStorage 載入用戶資訊
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    // 監聽認證狀態變化事件
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const signOut = () => {
    authLogout();
    setUser(null);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const value = {
    user,
    loading,
    isAuthenticated: user !== null,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

