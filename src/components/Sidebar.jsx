import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      signOut();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      path: '/',
      label: '首頁',
      icon: LayoutDashboard,
    },
    {
      path: '/exams',
      label: '考題列表',
      icon: BookOpen,
    },
    {
      path: '/history',
      label: '歷史紀錄',
      icon: History,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 animate-slide-in-left flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 animate-fade-in">
          CodeCat
          <span className="text-primary"> Practice</span>
        </h1>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md',
                  isActive
                    ? 'bg-orange-50 text-primary font-medium shadow-sm scale-105'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon 
                  size={20} 
                  className={clsx(
                    'transition-transform duration-300',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )} 
                />
                <span className="transition-all duration-300">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
          >
            <LogOut size={20} />
            <span>登出</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

