import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import ExamInterface from './components/ExamInterface';
import Results from './components/Results';
import History from './components/History';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 公開路由：登入和註冊 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 受保護的路由：需要登入才能訪問 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-100">
                  <Sidebar />
                  <main className="flex-1 ml-64">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/exams" element={<ExamList />} />
                      <Route path="/exam/:id" element={<ExamInterface />} />
                      <Route path="/exam/:id/results" element={<Results />} />
                      <Route path="/history" element={<History />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
