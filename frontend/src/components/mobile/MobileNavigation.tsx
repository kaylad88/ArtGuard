import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Shield, 
  Image as ImageIcon, 
  Settings,
  Menu,
  X,
  Camera 
} from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

export const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCameraActive, setIsCameraActive] = React.useState(false);

  const handlers = useSwipeable({
    onSwipedRight: () => setIsMenuOpen(true),
    onSwipedLeft: () => setIsMenuOpen(false)
  });

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Shield, label: 'Protect', path: '/protect' },
    { icon: ImageIcon, label: 'Gallery', path: '/gallery' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-dark-300 md:hidden">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center w-16 h-full"
            >
              <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Camera Capture Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-neon-blue rounded-full 
                 flex items-center justify-center shadow-lg md:hidden"
        onClick={() => setIsCameraActive(true)}
      >
        <Camera className="w-6 h-6 text-white" />
      </motion.button>

      {/* Camera Interface */}
      <AnimatePresence>
        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            <CameraInterface onClose={() => setIsCameraActive(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
