import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      label: '儀錶板',
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
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          CodeCat
          <span className="text-primary"> Practice</span>
        </h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-orange-50 text-primary font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

