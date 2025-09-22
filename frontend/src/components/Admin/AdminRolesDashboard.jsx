import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Shield, Settings, Plus, Eye, Settings2 } from 'lucide-react';
import CreateAdminForm from './CreateAdminForm';
import AdminManagementTable from './AdminManagementTable';
import EditPermissionsModal from './EditPermissionsModal';
import UserPermissionsPage from './UserPermissionsPage';
import api from '../../constants/API/axiosInstance';
import PermissionsManagement from './PermissionsManagement';

const AdminRolesDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [stats, setStats] = useState({
        totalAdmins: 0,
        activeAdmins: 0,
        totalPermissions: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    const userType = localStorage.getItem('userType');
    const isSuperAdmin = userType === 'SUPER_ADMIN';

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        }
    }, [activeTab]);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const [adminsResponse, permissionsResponse] = await Promise.all([
                api.get('/admin/admins'),
                api.get('/admin/permissions')
            ]);

            const admins = adminsResponse.data;
            const permissions = permissionsResponse.data;

            setStats({
                totalAdmins: admins.length,
                activeAdmins: admins.filter(admin => admin.enabled).length,
                totalPermissions: permissions.length,
                recentActivity: admins
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        }
    };

    const handleEditPermissions = (admin) => {
        setSelectedAdmin(admin);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedAdmin(null);
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        }
    };

    const TabButton = ({ id, icon: Icon, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${activeTab === id ? 'bg-blue-500' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );

    const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color === 'blue' ? 'bg-blue-100' :
                        color === 'green' ? 'bg-green-100' :
                            color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                    <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' :
                            color === 'green' ? 'text-green-600' :
                                color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                </div>
            </div>
        </div>
    );

    if (!isSuperAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserPermissionsPage />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage administrators and permissions</p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-1 bg-gray-100 rounded-lg">
                        <TabButton
                            id="dashboard"
                            icon={Settings}
                            label="Dashboard"
                        />
                        <TabButton
                            id="admins"
                            icon={Users}
                            label="Manage Admins"
                            count={stats.totalAdmins}
                        />
                        <TabButton
                            id="permissions"
                            icon={Eye}
                            label="My Permissions"
                        />
                        <TabButton
                            id="permissions-management"
                            icon={Settings2}
                            label="Permissions Management"
                        />
                    </div>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Administrators"
                                value={loading ? '...' : stats.totalAdmins}
                                subtitle="Including super admins"
                                icon={Users}
                                color="blue"
                            />
                            <StatCard
                                title="Active Administrators"
                                value={loading ? '...' : stats.activeAdmins}
                                subtitle="Currently enabled"
                                icon={UserPlus}
                                color="green"
                            />
                            <StatCard
                                title="Total Permissions"
                                value={loading ? '...' : stats.totalPermissions}
                                subtitle="Available permissions"
                                icon={Shield}
                                color="purple"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                                        <Plus className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Create New Admin</p>
                                        <p className="text-sm text-gray-500">Add administrator with permissions</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('admins')}
                                    className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg group-hover:bg-green-200">
                                        <Users className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Manage Admins</p>
                                        <p className="text-sm text-gray-500">View and edit admin permissions</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Admin Activity</h2>
                                <p className="text-sm text-gray-600 mt-1">Latest administrator accounts created</p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {loading ? (
                                    <div className="p-6 text-center">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </div>
                                ) : stats.recentActivity.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">
                                        No recent admin activity
                                    </div>
                                ) : (
                                    stats.recentActivity.map((admin) => (
                                        <div key={admin.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">
                                                            {admin.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {admin.roles?.some(role => role.name === 'SUPER_ADMIN') ? 'Super Admin' : 'Admin'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(admin.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${admin.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {admin.enabled ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Admins Tab */}
                {activeTab === 'admins' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Administrator Management</h2>
                                <p className="text-gray-600 mt-1">Manage admin accounts and their permissions</p>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Create New Admin</span>
                            </button>
                        </div>

                        <AdminManagementTable
                            onEditPermissions={handleEditPermissions}
                            onRefresh={fetchDashboardStats}
                        />
                    </div>
                )}

                {/* My Permissions Tab */}
                {activeTab === 'permissions' && (
                    <div className="-m-4 md:-m-6">
                        <UserPermissionsPage />
                        {/* <PermissionsManagement /> */}
                    </div>
                )}
                {/* My Permissions Tab */}
                {activeTab === 'permissions-management' && (
                    <div className="-m-4 md:-m-6">
                        {/* <UserPermissionsPage /> */}
                        <PermissionsManagement />
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateAdminForm
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditPermissionsModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                admin={selectedAdmin}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default AdminRolesDashboard;