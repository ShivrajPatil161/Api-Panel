import React, { useState } from 'react';
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
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    vendors: false,
    products: false,
    inventory: false,
    customers: false,
    transactions: false
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
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
        { title: 'Add Product', path: '/dashboard/inventory/add', icon: Package },
        { title: 'Product Pricing', path: '/dashboard/inventory/pricing', icon: Calculator },
         { title: 'Inward Entry', path: '/dashboard/inventory/inward', icon: ArrowDown },
        { title: 'Outward Entry', path: '/dashboard/inventory/outward', icon: ArrowUp },
        { title: 'Returns', path: '/dashboard/inventory/returns', icon: RotateCcw }
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
        { title: 'Assign Products', path: '/dashboard/customers/assign-products', icon: Package }
      ]
    },
    {
      title: 'Other',
      key: 'Other',
      icon: CreditCard,
      iconColor: '',
      children: [
        { title: 'File Upload', path: '/dashboard/others/upload', icon: Upload },
        { title: 'Charge Calculation', path: '/dashboard/others/charges', icon: Calculator }
      ]
    },
    {
      title: 'Reports',
      path: '/dashboard/reports',
      icon: BarChart3,
      iconColor: ''
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const isActiveParent = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Supply Chain</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {sidebarCollapsed ? (
            <Menu className="w-5 h-5 text-gray-600" />
          ) : (
            <X className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.key || item.path}>
              {item.children ? (
                // Menu with children
                <div>
                  <button
                    onClick={() => !sidebarCollapsed && toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group ${
                      isActiveParent(item.children) ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isActiveParent(item.children) ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors duration-200`}>
                        <item.icon className={`w-5 h-5 ${isActiveParent(item.children) ? 'text-blue-600' : item.iconColor}`} />
                      </div>
                      {!sidebarCollapsed && (
                        <span className={`font-medium ${isActiveParent(item.children) ? 'text-blue-900' : 'text-gray-700'}`}>
                          {item.title}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <div className="transition-transform duration-200">
                        {expandedMenus[item.key] ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    )}
                  </button>
                  
                  {expandedMenus[item.key] && !sidebarCollapsed && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActiveLink(child.path)
                              ? 'bg-blue-600 text-white shadow-md'
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
              ) : (
                // Single menu item
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group ${
                    isActiveLink(item.path) ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActiveLink(item.path) ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors duration-200`}>
                    <item.icon className={`w-5 h-5 ${isActiveLink(item.path) ? 'text-blue-600' : item.iconColor}`} />
                  </div>
                  {!sidebarCollapsed && (
                    <span className={`font-medium ${isActiveLink(item.path) ? 'text-blue-900' : 'text-gray-700'}`}>
                      {item.title}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

    
    </div>
  );
};

export default Sidebar;