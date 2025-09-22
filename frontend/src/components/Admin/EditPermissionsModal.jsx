import React, { useState, useEffect } from 'react';
import { X, Shield, Save, CheckCircle2, AlertCircle, User } from 'lucide-react';

const EditPermissionsModal = ({ isOpen, onClose, admin, onSuccess }) => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && admin) {
            fetchPermissions();
            // Get current admin permissions
            const currentPermissions = admin.roles?.flatMap(role =>
                role.permissions?.map(p => p.name) || []
            ) || [];
            setSelectedPermissions(currentPermissions);
        }
    }, [isOpen, admin]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/permissions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            }
        } catch (error) {
            setError('Failed to fetch permissions');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionName) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionName)
                ? prev.filter(p => p !== permissionName)
                : [...prev, permissionName]
        );
    };

    const handleSave = async () => {
        if (selectedPermissions.length === 0) {
            setError('At least one permission must be selected');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/admins/${admin.id}/permissions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedPermissions)
            });

            if (response.ok) {
                const updatedAdmin = await response.json();
                onSuccess(updatedAdmin);
                onClose();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update permissions');
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSelectedPermissions([]);
        onClose();
    };

    if (!isOpen || !admin) return null;

    const currentPermissions = admin.roles?.flatMap(role =>
        role.permissions?.map(p => p.name) || []
    ) || [];
    const hasChanges = JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(currentPermissions.sort());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Edit Permissions</h2>
                            <div className="flex items-center space-x-2 mt-1">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">{admin.email}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-600">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {hasChanges && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2 text-amber-700">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">You have unsaved changes</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Current Role: <span className="text-blue-600">ADMIN</span>
                            </h3>

                            <div className="text-sm text-gray-600 mb-4">
                                Select permissions for this administrator. They will only be able to access features
                                for which they have been granted permissions.
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="ml-2 text-gray-600">Loading permissions...</span>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4 max-h-80 overflow-y-auto bg-gray-50">
                                <div className="space-y-2">
                                    {permissions.map((permission) => {
                                        const isSelected = selectedPermissions.includes(permission.name);
                                        const wasOriginallySelected = currentPermissions.includes(permission.name);
                                        const isChanged = isSelected !== wasOriginallySelected;

                                        return (
                                            <label
                                                key={permission.id}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                                        ? 'bg-blue-50 border border-blue-200'
                                                        : 'hover:bg-gray-100 border border-transparent'
                                                    } ${isChanged ? 'ring-2 ring-blue-300' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handlePermissionToggle(permission.name)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {permission.name}
                                                        </span>
                                                        {isSelected && (
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        )}
                                                        {isChanged && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {isSelected ? 'Added' : 'Removed'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {permission.description && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-100 rounded-lg">
                            <span>Total permissions selected:</span>
                            <span className="font-medium text-gray-900">
                                {selectedPermissions.length} of {permissions.length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges || selectedPermissions.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPermissionsModal;