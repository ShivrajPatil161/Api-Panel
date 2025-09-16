import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Home,
  Users,
  Package,
  DollarSign,
  UserPlus,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Calculator,
  Upload,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  Warehouse,
  CreditCard,
  Store,
  Banknote,
  Coins,
  Eye
} from 'lucide-react';

// Reusable Menu Item Component
const MenuItem = ({
  item,
  isActive,
  isParentActive,
  sidebarCollapsed,
  onMenuClick
}) => {
  const location = useLocation();

  const isActiveLink = (path) => location.pathname === path;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => onMenuClick(item.key)}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 hover:bg-blue-100 group ${isParentActive ? 'bg-blue-100 border border-blue-500' : ''
            }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isParentActive ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
              } transition-colors duration-200`}>
              <item.icon className={`w-5 h-5 ${isParentActive ? 'text-blue-600' : item.iconColor || 'text-gray-600'
                }`} />
            </div>
            {!sidebarCollapsed && (
              <span className={`font-medium ${isParentActive ? 'text-blue-900' : 'text-gray-700'
                }`}>
                {item.title}
              </span>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="transition-transform duration-200">
              {isActive ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
          )}
        </button>

        {isActive && !sidebarCollapsed && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActiveLink(child.path)
                    ? 'bg-gray-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <child.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group ${isActiveLink(item.path) ? 'bg-blue-50 border border-blue-200' : ''
        }`}
    >
      <div className={`p-2 rounded-lg ${isActiveLink(item.path) ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
        } transition-colors duration-200`}>
        <item.icon className={`w-5 h-5 ${isActiveLink(item.path) ? 'text-blue-600' : item.iconColor || 'text-gray-600'
          }`} />
      </div>
      {!sidebarCollapsed && (
        <span className={`font-medium ${isActiveLink(item.path) ? 'text-blue-900' : 'text-gray-700'
          }`}>
          {item.title}
        </span>
      )}
    </Link>
  );
};

// Reusable Sidebar Header Component
const SidebarHeader = ({ sidebarCollapsed, onToggle, userType }) => {

  const getUserTypeDisplay = (type) => {
    switch (type) {
      case 'admin': return 'Admin Panel';
      case 'franchise': return 'Franchise Portal';
      case 'merchant': return 'Merchant Portal';
      default: return 'Management System';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {!sidebarCollapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Supply Chain</h1>
            <p className="text-xs text-gray-500">{getUserTypeDisplay(userType)}</p>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {sidebarCollapsed ? (
          <Menu className="w-5 h-5 text-gray-600" />
        ) : (
          <X className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
};

// Menu configurations for different user types
const getMenuItems = (userType) => {
  const baseMenuItems = {
    admin: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        iconColor: ''
      },
      {
        title: 'Vendors',
        key: 'vendors',
        icon: Users,
        iconColor: '',
        children: [
          { title: 'Vendor List', path: '/dashboard/vendors', icon: Users },
          { title: 'Vendor Rates', path: '/dashboard/vendors/rates', icon: DollarSign }
        ]
      },
      {
        title: 'Inventory',
        key: 'inventory',
        icon: Package,
        iconColor: '',
        children: [
          { title: 'Product List', path: '/dashboard/inventory', icon: Package },
          { title: 'Pricing Scheme', path: '/dashboard/inventory/pricing', icon: Calculator },
          { title: 'Product Scheme Assign', path: '/dashboard/inventory/products-assign', icon: Calculator },
          { title: 'Inventory', path: '/dashboard/inventory/inventory', icon: ArrowDown },
          
        ]
      },
      {
        title: 'Customers',
        key: 'customers',
        icon: Users,
        iconColor: '',
        children: [
          { title: 'Customer List', path: '/dashboard/customers', icon: Users },
          { title: 'Onboard Customer', path: '/dashboard/customers/onboard', icon: UserPlus },
          { title: 'Merchant Approval', path: '/dashboard/customers/admin-approval', icon: UserPlus },
          { title: 'Products Distribution', path: '/dashboard/customers/products-distribution', icon: Package }
        ]
      },
      {
        title: 'Other',
        key: 'other',
        icon: CreditCard,
        iconColor: '',
        children: [
          { title: 'File Upload', path: '/dashboard/others/upload', icon: Upload },
          { title: 'Charge Calculation', path: '/dashboard/others/charges', icon: Calculator },
          { title: 'Batch Status', path: '/dashboard/others/batch-status', icon: Eye }
        ]
      },
      {
        title: 'Reports',
        path: '/dashboard/reports',
        icon: BarChart3,
        iconColor: ''
      }
    ],
    franchise: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        iconColor: ''
      },
      {
        title: 'Merchants',
        key: 'merchants',
        icon: Store,
        iconColor: '',
        children: [
          { title: 'Merchant List', path: '/dashboard/merchants', icon: Store }
        ]
      },
      {
        title: 'Inventory',
        key: 'inventory',
        icon: Package,
        iconColor: '',
        children: [
          { title: 'Inward Entry', path: '/dashboard/customers/inward-products', icon: Package },
          { title: 'Product List', path: '/dashboard/inventory/customer-products', icon: Package },
          { title: 'Product Distribution', path: '/dashboard/customers/products-distribution', icon: Package }
        ]
      },
      {
        title: 'Reports',
        path: '/dashboard/reports',
        icon: BarChart3,
        iconColor: ''
      }
    ],
    merchant: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        iconColor: ''
      },
      {
        title: 'Inventory',
        key: 'inventory',
        icon: Package,
        iconColor: '',
        children: [
          { title: 'Inward Entry', path: '/dashboard/customers/inward-products', icon: Package },
          { title: 'Product List', path: '/dashboard/inventory/customer-products', icon: Package }
        ]
      },
      {
        title: 'Bill Payment',
        key: 'payment',
        icon: Banknote,
        iconColor: ''
      
      },
      {
        title: 'Payout',
        key: 'payout',
        path: '/dashboard/payout',
        icon: Coins,
        iconColor: '',
        // children: [
        //   { title: 'Payout', icon: Coins }
        // ]
       
      },
      {
        title: 'Card Details',
        key: 'card-details',
        path:'/dashboard/credit-card-bill-payment',
        icon: CreditCard,
        iconColor: ''
      },
      {
        title: 'Reports',
        path: '/dashboard/reports',
        icon: BarChart3,
        iconColor: ''
      }
    ]
  };

  return baseMenuItems[userType] || baseMenuItems.merchant;
};

// Main Sidebar Component
const Sidebar = ({userType}) => {
  const location = useLocation();
 console.log(userType)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    vendors: false,
    products: false,
    inventory: false,
    customers: false,
    transactions: false,
    merchants: false,
    other: false
  });

 
  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);

    // If collapsing the sidebar, close all expanded menus
    if (!sidebarCollapsed) {
      setExpandedMenus({
        vendors: false,
        products: false,
        inventory: false,
        customers: false,
        transactions: false,
        merchants: false,
        other: false
      });
    }
  };

  // Modified handler for menu items with children
  const handleMenuClick = (menuKey) => {
    if (sidebarCollapsed) {
      // If sidebar is collapsed, expand it and open the menu
      setSidebarCollapsed(false);
      setExpandedMenus(prev => ({
        ...prev,
        [menuKey]: true
      }));
    } else {
      // If sidebar is expanded, just toggle the menu
      toggleMenu(menuKey);
    }
  };

  const isActiveParent = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  const menuItems = getMenuItems(userType);

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200`}>
      {/* Sidebar Header */}
      <SidebarHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userType={userType}
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 ">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.key || item.path}>
              <MenuItem
                item={item}
                isActive={expandedMenus[item.key]}
                isParentActive={isActiveParent(item.children)}
                sidebarCollapsed={sidebarCollapsed}
                onMenuClick={handleMenuClick}
              />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;