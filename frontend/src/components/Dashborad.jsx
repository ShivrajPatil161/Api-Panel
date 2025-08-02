// import React, { useState } from 'react';
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   Search,
//   Filter,
//   Download,
//   Bell,
//   Settings,
//   BarChart3,
//   PieChart,
//   Activity
// } from 'lucide-react';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   // Dummy data
//   const stats = {
//     totalVendors: 24,
//     totalProducts: 156,
//     totalCustomers: 1247,
//     monthlyRevenue: 2456780,
//     pendingOrders: 42,
//     lowStockItems: 18,
//     activeContracts: 67,
//     averageDeliveryTime: 3.2
//   };

//   const recentOrders = [
//     { id: 'ORD-001', customer: 'Tech Solutions Ltd', amount: 45000, status: 'Delivered', date: '2024-07-28' },
//     { id: 'ORD-002', customer: 'Global Retail Corp', amount: 78500, status: 'Processing', date: '2024-07-29' },
//     { id: 'ORD-003', customer: 'Metro Stores', amount: 23000, status: 'Shipped', date: '2024-07-30' },
//     { id: 'ORD-004', customer: 'Digital Hub Inc', amount: 56700, status: 'Pending', date: '2024-07-30' },
//     { id: 'ORD-005', customer: 'Smart Systems', amount: 34200, status: 'Delivered', date: '2024-07-29' }
//   ];

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'active':
//       case 'delivered':
//       case 'in stock':
//       case 'premium':
//         return 'text-green-600 bg-green-100';
//       case 'pending':
//       case 'processing':
//       case 'low stock':
//       case 'regular':
//         return 'text-yellow-600 bg-yellow-100';
//       case 'inactive':
//       case 'shipped':
//         return 'text-blue-600 bg-blue-100';
//       case 'out of stock':
//         return 'text-red-600 bg-red-100';
//       default:
//         return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "purple" }) => (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//           {trend && (
//             <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//               {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
//               <span className="text-sm font-medium">{trendValue}</span>
//             </div>
//           )}
//         </div>
//         <div className={`p-3 rounded-full bg-${color}-100`}>
//           <Icon className={`h-6 w-6 text-${color}-600`} />
//         </div>
//       </div>
//     </div>
//   );

//   const renderOverview = () => (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Vendors"
//           value={stats.totalVendors}
//           icon={Users}
//           trend="up"
//           trendValue="+12%"
//           color="blue"
//         />
//         <StatCard
//           title="Total Products"
//           value={stats.totalProducts}
//           icon={Package}
//           trend="up"
//           trendValue="+8%"
//           color="green"
//         />
//         <StatCard
//           title="Total Customers"
//           value={stats.totalCustomers.toLocaleString()}
//           icon={ShoppingCart}
//           trend="up"
//           trendValue="+23%"
//           color="purple"
//         />
//         <StatCard
//           title="Monthly Revenue"
//           value={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`}
//           icon={DollarSign}
//           trend="up"
//           trendValue="+15%"
//           color="yellow"
//         />
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending Orders</p>
//               <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
//             </div>
//             <Clock className="h-8 w-8 text-orange-600" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
//               <p className="text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
//             </div>
//             <AlertTriangle className="h-8 w-8 text-red-600" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Contracts</p>
//               <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
//             </div>
//             <CheckCircle className="h-8 w-8 text-green-600" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
//               <p className="text-2xl font-bold text-blue-600">{stats.averageDeliveryTime} days</p>
//             </div>
//             <Activity className="h-8 w-8 text-blue-600" />
//           </div>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-lg shadow-md">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );




//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
            
//               <p className="text- text-gray-600">Manage your vendors, products, and customers</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-900">
//                 <Bell className="h-5 w-5" />
//               </button>
//               <button className="p-2 text-gray-600 hover:text-gray-900">
//                 <Settings className="h-5 w-5" />
//               </button>
//               <button className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export Data
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="border-b border-gray-200 mb-6">
//           <nav className="-mb-px flex space-x-8">
//             {[
//               { id: 'overview', label: 'Overview', icon: BarChart3 },
             
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? 'border-purple-500 text-purple-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <tab.icon className="h-5 w-5 mr-2" />
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Content */}
//         {activeTab === 'overview' && renderOverview()}
        
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react"

// Dummy vendor data
const dummyVendors = [
  {
    name: "Acme Tech Solutions",
    bank: "Axis Bank",
    email: "acme@vendor.com",
    products: 40
  },
  {
    name: "SwiftPOS Systems",
    bank: "HDFC",
    email: "swift@vendor.com",
    products: 55
  },
  {
    name: "NeoBank Devices Pvt Ltd",
    bank: "ICICI",
    email: "neo@vendor.com",
    products: 30
  }
]

const Dashboard = () => {
  return (
    <div className="space-y-6 ml-7" >
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Vendors" value="3" />
        <StatCard label="Products in Stock" value="125" />
        <StatCard label="Franchises" value="12" />
        <StatCard label="Merchants" value="47" />
      </div>

      {/* Vendor Table */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Vendors Summary</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-left text-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Vendor Name</th>
                <th className="p-2">Bank</th>
                <th className="p-2">Email</th>
                <th className="p-2">Total Products</th>
              </tr>
            </thead>
            <tbody>
              {dummyVendors.map((vendor, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{vendor.name}</td>
                  <td className="p-2">{vendor.bank}</td>
                  <td className="p-2">{vendor.email}</td>
                  <td className="p-2">{vendor.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Dummy stat card component
const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
)

export default Dashboard
