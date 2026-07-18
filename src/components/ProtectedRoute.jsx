import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 當正在確認身份時，不要顯示華麗載入畫面，以免與子層頁面（如 Dashboard）的載入畫面重疊造成兩層動畫。
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100"></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

