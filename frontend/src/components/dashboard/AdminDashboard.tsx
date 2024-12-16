// frontend/src/components/dashboard/AdminDashboard.tsx
import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity,
  Search,
  Filter,
  Download,
  Settings 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  date: string;
  protections: number;
  verifications: number;
  users: number;
}

const analyticsData: AnalyticsData[] = [
  { date: '2024-01', protections: 65, verifications: 123, users: 45 },
  { date: '2024-02', protections: 78, verifications: 156, users: 58 },
  { date: '2024-03', protections: 90, verifications: 189, users: 72 }
];

export const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Platform overview and management
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-300"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button className="p-2 rounded-lg bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-300">
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="1,234"
          change="+12%"
          icon={Users}
        />
        <StatCard
          title="Protected Works"
          value="5,678"
          change="+8%"
          icon={Shield}
        />
        <StatCard
          title="Active Reports"
          value="23"
          change="+15%"
          icon={AlertTriangle}
        />
        <StatCard
          title="System Usage"
          value="89%"
          change="+3%"
          icon={Activity}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Platform Analytics
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="protections" 
                stroke="#61deff" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="verifications" 
                stroke="#ff61dc" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#61ffce" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Reports
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((report) => (
              <ReportCard key={report} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <StatusItem
              label="API Health"
              status="healthy"
              value="99.9%"
            />
            <StatusItem
              label="Storage Usage"
              status="warning"
              value="85%"
            />
            <StatusItem
              label="Database"
              status="healthy"
              value="Good"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
