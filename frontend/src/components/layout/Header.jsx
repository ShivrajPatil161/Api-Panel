import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Sun,
  Moon,
  HelpCircle,
  Download
} from 'lucide-react';
// manager tond vr krun bolela amhi pn asnr ahe tumcha sibath , kuthe ahe????????????? malu cha nuber deun mokla !!!!!!!!!!!abhi la vichar bolnr toh
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/dashboard/vendors': 'Vendor List',
      '/dashboard/vendors/add': 'Add Vendor',
      '/dashboard/vendors/rates': 'Vendor Rates',
      '/dashboard/inventory': 'Product List',
      '/dashboard/inventory/add': 'Add Product',
      '/dashboard/inventory/pricing': 'Product Pricing',
      '/dashboard/inventory/inward': 'Inward Entry',
      '/dashboard/inventory/outward': 'Outward Entry',
      '/dashboard/inventory/returns': 'Returns',
      '/dashboard/customers': 'Customer List',
      '/dashboard/customers/onboard': 'Customer Onboarding',
      '/dashboard/customers/assign-products': 'Product Assignment',
      '/dashboard/transactions/upload': 'File Upload',
      '/dashboard/transactions/charges': 'Charge Calculation',
      '/dashboard/reports': 'Reports'
    };
    return routeTitles[path] || 'Supply Chain Management';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length <= 1) return null;
    
    const breadcrumbMap = {
      dashboard: 'Dashboard',
      vendors: 'Vendors',
      products: 'Products',
      inventory: 'Inventory',
      customers: 'Customers',
      transactions: 'Transactions',
      reports: 'Reports',
      add: 'Add',
      rates: 'Rates',
      pricing: 'Pricing',
      inward: 'Inward',
      outward: 'Outward',
      returns: 'Returns',
      onboard: 'Onboard',
      'assign-products': 'Assign Products',
      upload: 'Upload',
      charges: 'Charges'
    };

    return segments.map(segment => breadcrumbMap[segment] || segment).join(' > ');
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New vendor registration', time: '5 min ago', type: 'info' },
    { id: 2, title: 'Low stock alert', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'Payment received', time: '2 hours ago', type: 'success' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Page Title & Breadcrumb */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
          {getBreadcrumb() && (
            <nav className="text-sm text-gray-500 mt-1">
              {getBreadcrumb()}
            </nav>
          )}
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Download className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-400' :
                          notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">AD</span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@company.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@company.com</p>
                </div>
                
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <User className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <HelpCircle className="h-4 w-4 mr-3" />
                    Help & Support
                  </button>
                </div>
                
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Date/Time */}
          <div className="hidden lg:block text-sm text-gray-500 border-l border-gray-300 pl-4">
            <div className="text-right">
              <p className="font-medium">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
              <p className="text-xs">{new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;