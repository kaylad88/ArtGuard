import React from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-dark-300 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <h1 className="text-2xl font-display text-gray-800 dark:text-white">
            ArtGuard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-lg"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-lg">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};
