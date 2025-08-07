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
  const userType = localStorage.getItem("userType")
  const [selectedMerchant, setSelectedMerchant] = useState('all');



  // Mock data for different user types
  const mockData = {
    admin: {
      name: "Admin Dashboard",
      vendors: [
        { name: "Acme Tech Solutions", bank: "Axis Bank", email: "acme@vendor.com", products: 40 },
        { name: "SwiftPOS Systems", bank: "HDFC", email: "swift@vendor.com", products: 55 },
        { name: "NeoBank Devices Pvt Ltd", bank: "ICICI", email: "neo@vendor.com", products: 30 }
      ],
      stats: {
        vendors: 3,
        products: 125,
        franchises: 12,
        merchants: 47,
        totalRevenue: 2500000
      }
    },
    franchise: {
      name: "ABC Retail Franchise",
      totalMerchants: 12,
      totalProducts: 45,
      walletBalance: 125000,
      monthlyRevenue: 115000,
      merchants: [
        { id: 1, name: "Store Alpha", location: "Mumbai", products: 5, revenue: 45000 },
        { id: 2, name: "Store Beta", location: "Delhi", products: 3, revenue: 32000 },
        { id: 3, name: "Store Gamma", location: "Pune", products: 4, revenue: 38000 }
      ]
    },
    merchant: {
      name: "XYZ Electronics",
      location: "Bangalore",
      walletBalance: 25000,
      products: 3,
      monthlyRevenue: 15000
    }
  };

  const products = {
    franchise: [
      { type: 'POS', count: 18, active: 15 },
      { type: 'QR', count: 20, active: 18 },
      { type: 'Soundbox', count: 7, active: 6 }
    ],
    merchant: [
      { type: 'POS', count: 2, active: 2 },
      { type: 'QR', count: 1, active: 1 },
      { type: 'Soundbox', count: 0, active: 0 }
    ]
  };

  const recentTransactions = [
    { id: 1, type: 'credit', amount: 5000, desc: 'Product distribution payment', time: '2 hours ago' },
    { id: 2, type: 'debit', amount: 1200, desc: 'POS device maintenance', time: '1 day ago' },
    { id: 3, type: 'credit', amount: 8500, desc: 'Commission payment', time: '2 days ago' }
  ];

  // Render Admin Dashboard
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Vendors" value={mockData.admin.stats.vendors} icon={Building2} color="blue" />
        <StatCard label="Products in Stock" value={mockData.admin.stats.products} icon={Package} color="purple" />
        <StatCard label="Franchises" value={mockData.admin.stats.franchises} icon={Store} color="green" />
        <StatCard label="Merchants" value={mockData.admin.stats.merchants} icon={Users} color="orange" />
        <StatCard label="Total Revenue" value={`₹${(mockData.admin.stats.totalRevenue / 100000).toFixed(1)}L`} icon={TrendingUp} color="green" />
      </div>

      {/* Vendors Table */}
      <DataTable
        title="Vendors Summary"
        headers={["Vendor Name", "Bank", "Email", "Total Products"]}
        data={mockData.admin.vendors}
        renderRow={(vendor) => (
          <>
            <td className="p-3">{vendor.name}</td>
            <td className="p-3">{vendor.bank}</td>
            <td className="p-3">{vendor.email}</td>
            <td className="p-3">{vendor.products}</td>
          </>
        )}
      />
    </div>
  );

  // Render Franchise/Merchant Dashboard
  const renderUserDashboard = () => {
    const currentData = mockData[userType];
    const currentProducts = products[userType] || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{currentData.name}</h1>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                    {userType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Wallet Balance"
              value={`₹${currentData.walletBalance?.toLocaleString()}`}
              icon={Wallet}
              color="green"
            />

            {userType === 'franchise' && (
              <StatCard
                label="Total Merchants"
                value={currentData.totalMerchants}
                icon={Users}
                color="blue"
              />
            )}

            <StatCard
              label="Total Products"
              value={currentData.totalProducts || currentData.products}
              icon={Package}
              color="purple"
            />

            <StatCard
              label="Monthly Revenue"
              value={`₹${currentData.monthlyRevenue?.toLocaleString()}`}
              icon={TrendingUp}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Products Overview</h2>
                  {userType === 'franchise' && (
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      value={selectedMerchant}
                      onChange={(e) => setSelectedMerchant(e.target.value)}
                    >
                      <option value="all">All Merchants</option>
                      {currentData.merchants?.map(merchant => (
                        <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentProducts.map((product, index) => (
                    <ProductCard key={index} {...product} />
                  ))}
                </div>
              </div>

              {/* Merchants List (Franchise only) */}
              {userType === 'franchise' && currentData.merchants && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Merchant Network</h2>
                  <div className="space-y-4">
                    {currentData.merchants.map((merchant) => (
                      <div key={merchant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Store className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{merchant.name}</h3>
                            <p className="text-sm text-gray-600">{merchant.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{merchant.products} Products</p>
                          <p className="text-sm text-green-600">₹{merchant.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ActivityCard transactions={recentTransactions} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic based on user type
  return (
    <div className="min-h-screen bg-gray-50">
      {userType === 'admin' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderAdminDashboard()}
        </div>
      ) : (
        renderUserDashboard()
      )}
    </div>
  );
};

export default Dashboard;