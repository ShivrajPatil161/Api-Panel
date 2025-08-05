import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  Wallet
} from 'lucide-react';

const Header = ({ userType, userInfo = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType')
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
      '/dashboard/customers/admin-approval': 'Merchant Approval',
      '/dashboard/customers/assign-products': 'Product Assignment',
      '/dashboard/others/upload': 'File Upload',
      '/dashboard/others/charges': 'Charge Calculation',
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
      'admin-approval': 'Approval',
      upload: 'Upload',
      charges: 'Charges'
    };

    return segments.map(segment => breadcrumbMap[segment] || segment).join(' > ');
  };

  const defaultUserInfo = {
    name:
      userType === 'admin'
        ? 'Admin User'
        : userType === 'merchant'
          ? 'Merchant User'
          : 'Franchise User',
    email:
      userType === 'admin'
        ? 'admin@company.com'
        : userType === 'merchant'
          ? 'merchant@company.com'
          : 'franchise@company.com',
    initials:
      userType === 'admin'
        ? 'AD'
        : userType === 'merchant'
          ? 'MU'
          : 'FU',
    walletBalance: userType !== 'admin' ? 25000 : null,
  };

  const currentUser = { ...defaultUserInfo, ...userInfo };

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

        {/* Right Section - Wallet & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Wallet - Only for customers */}
          {(userType === 'merchant' || userType=== 'franchise') && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Wallet className="h-5 w-5 text-gray-600" />
              <div className="text-right">
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{currentUser.walletBalance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{currentUser.initials}</span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
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
        </div>
      </div>

      {/* Click outside handler */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;