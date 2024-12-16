import React from 'react';
import { 
  Home, 
  Shield, 
  Image, 
  Settings, 
  Users,
  LogOut 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Shield, label: 'Protect', path: '/protect' },
  { icon: Image, label: 'My Artworks', path: '/artworks' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-full bg-white dark:bg-dark-200 border-r border-gray-200 dark:border-dark-300 pt-16">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-dark-300 text-blue-600 dark:text-neon-blue'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={() => {/* Handle logout */}}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
