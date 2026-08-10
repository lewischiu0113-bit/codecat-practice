import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import ExamInterface from './components/ExamInterface';
import Results from './components/Results';
import History from './components/History';
import ArticleGuide from './components/ArticleGuide';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomeSplash from './components/WelcomeSplash';

function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row relative">
      {/* 行動端頂部 Sticky Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
        <div className="font-bold text-lg text-gray-800">
          CodeCat <span className="text-primary">Practice</span>
        </div>
        <div className="w-8" /> {/* 保持平衡對齊 */}
      </header>

      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 pt-16 md:pt-0 min-w-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exam/:id" element={<ExamInterface />} />
          <Route path="/exam/:id/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/articles" element={<ArticleGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <WelcomeSplash />
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
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
