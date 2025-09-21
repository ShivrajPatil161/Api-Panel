import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../constants/API/axiosInstance';

const PermissionsManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPermissions();
    }, []);

   
    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Permission name is required';
        } else if (!/^[A-Z_]+$/.test(formData.name)) {
            newErrors.name = 'Permission name must contain only uppercase letters and underscores';
        } else if (permissions.some(p => p.name === formData.name && p.id !== editingPermission?.id)) {
            newErrors.name = 'Permission name already exists';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,
            description: permission.description || ''
        });
        setShowCreateForm(true);
    };

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/admin/permissions");
            setPermissions(response.data);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            toast.error("Failed to load permissions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSaving(true);
        try {
            const url = editingPermission
                ? `/api/admin/permissions/${editingPermission.id}`
                : "/api/admin/permissions";

            const method = editingPermission ? "put" : "post";

            const response = await api[method](url, formData);

            const savedPermission = response.data;

            if (editingPermission) {
                setPermissions((prev) =>
                    prev.map((p) =>
                        p.id === editingPermission.id ? savedPermission : p
                    )
                );
                toast.success("Permission updated successfully");
            } else {
                setPermissions((prev) => [...prev, savedPermission]);
                toast.success("Permission created successfully");
            }

            resetForm();
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to save permission";
            setErrors({ submit: message });
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (permission) => {
        // show a confirmation toast instead of window.confirm
        if (!window.confirm(`Delete permission "${permission.name}"?`)) {
            return;
        }

        try {
            await api.delete(`/api/admin/permissions/${permission.id}`);

            setPermissions((prev) =>
                prev.filter((p) => p.id !== permission.id)
            );
            toast.success(`Permission "${permission.name}" deleted successfully`);
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete permission";
            toast.error(message);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingPermission(null);
        setShowCreateForm(false);
        setErrors({});
    };

    const predefinedPermissions = [
        { name: 'CREATE_ADMIN', description: 'Can create new administrators' },
        { name: 'DELETE_ADMIN', description: 'Can delete administrator accounts' },
        { name: 'VIEW_USERS', description: 'Can view user accounts and details' },
        { name: 'MANAGE_FRANCHISES', description: 'Can create and manage franchises' },
        { name: 'MANAGE_MERCHANTS', description: 'Can create and manage merchants' },
        { name: 'VIEW_TRANSACTIONS', description: 'Can view transaction history' },
        { name: 'APPROVE_SETTLEMENTS', description: 'Can approve settlement requests' },
        { name: 'MANAGE_PRODUCTS', description: 'Can add and edit products' },
        { name: 'SYSTEM_SETTINGS', description: 'Can modify system settings' },
        { name: 'VIEW_REPORTS', description: 'Can generate and view reports' }
    ];

    const addPredefinedPermission = async (permission) => {
        try {
            const response = await fetch('/api/admin/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(permission)
            });

            if (response.ok) {
                const newPermission = await response.json();
                setPermissions(prev => [...prev, newPermission]);
            }
        } catch (error) {
            console.error('Failed to add predefined permission:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Permissions Management</h1>
                <p className="text-gray-600 mt-1">Create and manage system permissions</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search permissions..."
                    />
                </div>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Permission</span>
                </button>
            </div>

            {/* Predefined Permissions Helper */}
            {permissions.length === 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-800">Quick Setup</h3>
                            <p className="text-sm text-blue-700 mt-1 mb-3">
                                Add commonly used permissions to get started quickly:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {predefinedPermissions.slice(0, 5).map((permission) => (
                                    <button
                                        key={permission.name}
                                        onClick={() => addPredefinedPermission(permission)}
                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        {permission.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {errors.submit}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permission Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., CREATE_USER, VIEW_REPORTS"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Use uppercase letters and underscores only (e.g., CREATE_USER)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe what this permission allows..."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>{editingPermission ? 'Update' : 'Create'}</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Permissions List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Permissions ({filteredPermissions.length})
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredPermissions.length === 0 ? (
                        <div className="p-6 text-center">
                            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No permissions found' : 'No permissions created'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? 'Try adjusting your search criteria'
                                    : 'Create your first permission to get started'
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Permission
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredPermissions.map((permission) => (
                            <div key={permission.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                                <Shield className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {permission.name}
                                                </h3>
                                                {permission.description && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {permission.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(permission)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit permission"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(permission)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete permission"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionsManagement;