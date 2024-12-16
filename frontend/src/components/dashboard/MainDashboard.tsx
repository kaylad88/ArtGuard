import React from 'react';
import { Shield, Image, AlertTriangle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
  icon: typeof Shield;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-dark-200 rounded-xl p-6
        border border-gray-100 dark:border-dark-300
        ${color} hover:shadow-lg transition-shadow
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          {change && (
            <p className="text-green-500 text-sm mt-1">
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
};

export const MainDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-gray-900 dark:text-white">
            Welcome back, {user?.username}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your artwork
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
            + New Protection
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Shield}
          label="Protected Works"
          value="147"
          change="+12%"
          color="text-neon-blue"
        />
        <StatCard
          icon={Image}
          label="Total Artworks"
          value="284"
          change="+8%"
          color="text-neon-purple"
        />
        <StatCard
          icon={AlertTriangle}
          label="Potential Matches"
          value="3"
          color="text-neon-pink"
        />
        <StatCard
          icon={BarChart2}
          label="Verifications"
          value="1,234"
          change="+24%"
          color="text-neon-green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Activity items */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-4 py-3 border-b dark:border-dark-300 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-dark-300 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">
                    Artwork Protected
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Usage Analytics
          </h2>
          <div className="h-64">
            {/* Chart component will go here */}
          </div>
        </div>
      </div>

      {/* Mobile App Banner */}
      <div className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Get the ArtGuard Mobile App</h2>
            <p className="text-blue-100">
              Protect your artwork on the go. Available for iOS and Android.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              App Store
            </button>
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Play Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
