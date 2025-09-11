import React, { useState, useEffect } from 'react';
import {
    Users,
    Store,
    Package,
    CreditCard,
    TrendingUp,
    Wallet,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';
import api from '../../constants/API/axiosInstance';

const AdminDashboard = () => {
    const [franchiseData, setFranchiseData] = useState(null);
    const [transactionStats, setTransactionStats] = useState(null);
    const [pricingStats, setPricingStats] = useState(null);
    const [vendorStats, setVendorStats] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [franchise, transactions, pricing, vendors, products] = await Promise.all([
                api.get('/franchise/franchises-merchants'),
                api.get('/stats/transactions-stats'),
                api.get('/pricing-schemes/stats'),
                api.get('/vendors/stats'),
                api.get('/products/stats')
            ]);

            setFranchiseData(franchise.data);
            setTransactionStats(transactions.data);
            setPricingStats(pricing.data);
            setVendorStats(vendors.data);
            setProductStats(products.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-slate-600">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xl font-medium">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center space-x-3 text-red-700">
                        <AlertCircle className="w-6 h-6" />
                        <span className="font-medium">{error}</span>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle = null, trend = null }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-500">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-${color}-50`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
            {trend && (
                <div className="flex items-center mt-3 text-sm">
                    {trend > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownLeft className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-slate-500 ml-1">vs last month</span>
                </div>
            )}
        </div>
    );

    const CategoryCard = ({ category }) => (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-medium text-slate-800">{category.categoryName}</h4>
                    <p className="text-sm text-slate-500">Code: {category.categoryCode}</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">{category.productCount}</span>
            </div>
        </div>
    );

    const StatusBadge = ({ status, count }) => {
        const colors = {
            AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
            ALLOCATED: 'bg-blue-100 text-blue-800 border-blue-200',
            ACTIVE: 'bg-green-100 text-green-800 border-green-200',
            INACTIVE: 'bg-red-100 text-red-800 border-red-200'
        };

        return (
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}: {count}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                            <p className="text-slate-600">Overview of your business operations</p>
                        </div>
                        <button
                            onClick={fetchAllData}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Franchises"
                        value={franchiseData?.totalFranchises || 0}
                        icon={Store}
                        color="blue"
                        subtitle="Active franchise locations"
                    />
                    <StatCard
                        title="Total Merchants"
                        value={franchiseData?.totalMerchants || 0}
                        icon={Users}
                        color="green"
                        subtitle={`${franchiseData?.totalDirectMerchants || 0} direct, ${franchiseData?.totalFranchiseMerchants || 0} franchise`}
                    />
                    <StatCard
                        title="Total Products"
                        value={productStats?.totalProducts || 0}
                        icon={Package}
                        color="purple"
                        subtitle={`${productStats?.activeProducts || 0} active, ${productStats?.inactiveProducts || 0} inactive`}
                    />
                    <StatCard
                        title="Active Vendors"
                        value={vendorStats?.activeVendors || 0}
                        icon={Wallet}
                        color="orange"
                        subtitle={`${vendorStats?.totalVendors || 0} total vendors`}
                    />
                </div>

                {/* Transaction & Inventory Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Transaction Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Transaction Overview</h3>
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{transactionStats?.totalInwardTransactions || 0}</p>
                                <p className="text-sm text-green-700">Inward</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{transactionStats?.totalOutwardTransactions || 0}</p>
                                <p className="text-sm text-red-700">Outward</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Total Product Serials:</span>
                                <span className="font-semibold">{transactionStats?.totalProductSerials || 0}</span>
                            </div>

                            {transactionStats?.productSerialStatus && (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(transactionStats.productSerialStatus).map(([status, count]) => (
                                        <StatusBadge key={status} status={status} count={count} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vendor & Financial Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Vendor & Financial</h3>
                            <CreditCard className="w-6 h-6 text-purple-600" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-purple-700">Monthly Rent</p>
                                    <p className="text-2xl font-bold text-purple-600">₹{vendorStats?.totalMonthlyRent || 0}</p>
                                </div>
                                <Wallet className="w-8 h-8 text-purple-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-slate-50 rounded-lg">
                                    <p className="text-lg font-bold text-slate-700">{pricingStats?.totalSchemes || 0}</p>
                                    <p className="text-xs text-slate-500">Pricing Schemes</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-lg">
                                    <p className="text-lg font-bold text-slate-700">{vendorStats?.totalVendorRates || 0}</p>
                                    <p className="text-xs text-slate-500">Vendor Rates</p>
                                </div>
                            </div>

                            {vendorStats?.cardTypeDistribution && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Card Types:</p>
                                    {Object.entries(vendorStats.cardTypeDistribution).map(([type, count]) => (
                                        <div key={type} className="flex justify-between text-sm py-1">
                                            <span className="text-slate-600">{type}:</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Categories & Franchise Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Categories */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Product Categories</h3>
                            <Package className="w-6 h-6 text-green-600" />
                        </div>

                        <div className="space-y-4">
                            {productStats?.categoryBreakdown?.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    </div>

                    {/* Franchise Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Franchise Distribution</h3>
                            <Store className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{franchiseData?.totalDirectMerchants || 0}</p>
                                    <p className="text-xs text-blue-700">Direct</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{franchiseData?.totalFranchiseMerchants || 0}</p>
                                    <p className="text-xs text-green-700">Franchise</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{franchiseData?.totalFranchises || 0}</p>
                                    <p className="text-xs text-purple-700">Locations</p>
                                </div>
                            </div>

                            {franchiseData?.merchantsPerFranchise && (
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-slate-600 mb-3">Merchants per Franchise:</p>
                                    <div className="space-y-2">
                                        {Object.entries(franchiseData.merchantsPerFranchise).map(([franchiseId, count]) => (
                                            <div key={franchiseId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                <span className="text-slate-700">Franchise #{franchiseId}</span>
                                                <span className="font-semibold text-slate-900">{count} merchants</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;