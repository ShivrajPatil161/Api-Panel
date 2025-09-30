// frontend/src/components/Reports/ProductReportSummaryCards.jsx
import React from 'react';
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign
} from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, color, subtext, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600'
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtext && (
            <p className="text-sm opacity-70 mt-1">{subtext}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]} bg-white bg-opacity-50`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const ProductReportSummaryCards = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Products',
      value: summary?.totalProducts?.toLocaleString() || '0',
      icon: Package,
      color: 'blue',
      subtext: 'All products in inventory'
    },
    {
      title: 'Active Products',
      value: summary?.activeProducts?.toLocaleString() || '0',
      icon: CheckCircle,
      color: 'green',
      subtext: 'Currently available'
    },
    {
      title: 'Inactive Products',
      value: summary?.inactiveProducts?.toLocaleString() || '0',
      icon: XCircle,
      color: 'red',
      subtext: 'Currently unavailable'
    },
    {
      title: 'Total Categories',
      value: summary?.totalCategories?.toLocaleString() || '0',
      icon: BarChart3,
      color: 'purple',
      subtext: 'Product categories'
    },
    {
      title: 'Products with Schemes',
      value: summary?.productsWithSchemes?.toLocaleString() || '0',
      icon: DollarSign,
      color: 'indigo',
      subtext: 'Have pricing schemes'
    },
    {
      title: 'Franchise Schemes',
      value: summary?.franchiseSchemes?.toLocaleString() || '0',
      icon: Users,
      color: 'yellow',
      subtext: 'Franchise pricing schemes'
    },
    {
      title: 'Merchant Schemes',
      value: summary?.merchantSchemes?.toLocaleString() || '0',
      icon: Users,
      color: 'green',
      subtext: 'Merchant pricing schemes'
    },
    {
      title: 'Unassigned Products',
      value: summary?.unassignedProducts?.toLocaleString() || '0',
      icon: AlertCircle,
      color: 'red',
      subtext: 'Without pricing schemes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => (
        <SummaryCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          subtext={card.subtext}
          trend={card.trend}
        />
      ))}
    </div>
  );
};

export default ProductReportSummaryCards;