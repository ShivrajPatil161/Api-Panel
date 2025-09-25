import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CreditCard,
  QrCode,
  Volume2,
  Users,
  TrendingUp,
  Bell,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Store,
  Package,
  BarChart3,
  History,
  Building2
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';

// Reusable Stat Card Component
const StatCard = ({ label, value, icon: Icon, color = 'blue', onClick }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {Icon && (
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      )}
    </div>
  </div>
);

// Reusable Product Card Component
const ProductCard = ({ type, count, active }) => {
  const icons = {
    POS: CreditCard,
    QR: QrCode,
    Soundbox: Volume2
  };
  const Icon = icons[type];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{type}</h3>
        </div>
        <button className="p-1 hover:bg-gray-50 rounded">
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total</span>
          <span className="font-medium">{count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Active</span>
          <span className="font-medium text-green-600">{active}</span>
        </div>
      </div>
    </div>
  );
};

// Reusable Table Component
const DataTable = ({ title, headers, data, renderRow }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="p-3 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Reusable Activity Card Component
const ActivityCard = ({ transactions, title = "Recent Activity" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
    </div>
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
              {transaction.type === 'credit' ? (
                <ArrowDownRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount?.toLocaleString() || transaction.amount}
              </p>
              <p className="text-xs text-gray-600">{transaction.desc}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{transaction.time}</p>
        </div>
      ))}
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const userType = localStorage.getItem("userType").toLowerCase()
  



  // Main render logic based on user type
  return (
    <div className="min-h-screen bg-gray-50">
      {['admin', 'super_admin'].includes(userType) ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard userType={userType} />
      )}

    </div>
  );
};

export default Dashboard;