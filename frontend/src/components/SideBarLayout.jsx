import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  Menu, 
  X, 
  Users, 
  Package, 
  DollarSign, 
  UserPlus, 
  ArrowDown, 
  ArrowUp, 
  RotateCcw, 
  Calculator, 
  Upload, 
  FileSpreadsheet,
  Home,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mastersExpanded, setMastersExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(true);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      current: location.pathname === '/'
    },
    {
      name: 'Masters',
      icon: Settings,
      expanded: mastersExpanded,
      setExpanded: setMastersExpanded,
      children: [
        {
          name: 'Vendor Master',
          href: '/vendor-master',
          icon: Users,
          current: location.pathname === '/vendor-master'
        },
        {
          name: 'Product Master',
          href: '/product',
          icon: Package,
          current: location.pathname === '/product-master'
        },
        {
          name: 'Vendor Rates',
          href: '/vendor-rates',
          icon: DollarSign,
          current: location.pathname === '/vendor-rates'
        },
        {
          name: 'Product Pricing',
          href: '/product-pricing',
          icon: Calculator,
          current: location.pathname === '/product-pricing'
        },
        {
          name: 'Customer Onboarding',
          href: '/customer-onboarding',
          icon: UserPlus,
          current: location.pathname === '/customer-onboarding'
        }
      ]
    },
    {
      name: 'Transactions',
      icon: ArrowDown,
      expanded: transactionsExpanded,
      setExpanded: setTransactionsExpanded,
      children: [
        {
          name: 'Inward Entry',
          href: '/inward',
          icon: ArrowDown,
          current: location.pathname === '/inward'
        },
        {
          name: 'Outward Entry',
          href: '/outward',
          icon: ArrowUp,
          current: location.pathname === '/outward'
        },
        {
          name: 'Product Assignment',
          href: '/product-assign',
          icon: Package,
          current: location.pathname === '/product-assign'
        },
        {
          name: 'Return Management',
          href: '/return',
          icon: RotateCcw,
          current: location.pathname === '/return'
        }
      ]
    },
    {
      name: 'Reports & Tools',
      icon: FileSpreadsheet,
      expanded: reportsExpanded,
      setExpanded: setReportsExpanded,
      children: [
        {
          name: 'File Upload',
          href: '/file-upload',
          icon: Upload,
          current: location.pathname === '/file-upload'
        },
        {
          name: 'Charge Calculation',
          href: '/charge-calculation',
          icon: Calculator,
          current: location.pathname === '/charge-calculation'
        }
      ]
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Supply Chain</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  // Parent item with children
                  <div>
                    <button
                      onClick={() => item.setExpanded(!item.expanded)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        sidebarOpen ? 'hover:bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                        {sidebarOpen && (
                          <span className="text-gray-700">{item.name}</span>
                        )}
                      </div>
                      {sidebarOpen && (
                        <div className="transition-transform duration-200">
                          {item.expanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {/* Children items */}
                    {item.expanded && sidebarOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              child.current
                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <child.icon className="w-4 h-4 mr-3" />
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular navigation item
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@company.com</p>
              </div>
              <button className="p-1 rounded hover:bg-gray-100">
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {navigation.find(item => 
                  item.href === location.pathname || 
                  item.children?.some(child => child.href === location.pathname)
                )?.name || 
                navigation.find(item => 
                  item.children?.some(child => child.href === location.pathname)
                )?.children?.find(child => child.href === location.pathname)?.name || 
                'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default SidebarLayout;