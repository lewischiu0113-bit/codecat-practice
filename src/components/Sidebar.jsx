import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();

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
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 animate-slide-in-left">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 animate-fade-in">
          CodeCat
          <span className="text-primary"> Practice</span>
        </h1>
        <nav className="space-y-2">
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
      </div>
    </div>
  );
};

export default Sidebar;

