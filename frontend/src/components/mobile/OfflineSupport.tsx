import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasUpdates, setHasUpdates] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`
      fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-4
      transition-all duration-300 ease-in-out
      ${isOnline ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}
    `}>
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CloudOff className="w-5 h-5" />
          <span>You're offline</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-red-600 rounded-lg"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
