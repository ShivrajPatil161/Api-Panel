import React from 'react';
import {
    X, Key, Server, Lock, User, Calendar, Shield,
    CheckCircle, XCircle, Globe, Tag
} from 'lucide-react';

const VendorCredentialView = ({ credential, isOpen, onClose }) => {
    if (!isOpen || !credential) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const InfoSection = ({ title, children, icon: Icon }) => (
        <div className="mb-6">
            <div className="flex items-center mb-3">
                <Icon className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {children}
            </div>
        </div>
    );

    const InfoRow = ({ label, value, isSecret = false }) => (
        <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className={`text-sm text-gray-900 text-right max-w-md ${isSecret ? 'font-mono' : ''}`}>
                {value || 'N/A'}
            </span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Key className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Credential Details</h2>
                            <p className="text-sm text-gray-500">
                                {credential.vendorInfo?.name || 'Unknown Vendor'} - {credential.productName || 'Unknown Product'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-6 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {credential.isActive ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${credential.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {credential.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <InfoSection title="Basic Information" icon={Tag}>
                            <InfoRow label="ID" value={`#${credential.id}`} />
                            <InfoRow label="Vendor" value={credential.vendorInfo?.name} />
                            <InfoRow label="Product" value={credential?.productName} />
                        </InfoSection>

                        {/* Authentication */}
                        <InfoSection title="Authentication" icon={Lock}>
                            <InfoRow label="Client ID" value={credential.clientId} isSecret />
                            <InfoRow label="Client Secret" value={credential.clientSecret ? '••••••••••••' : 'N/A'} isSecret />
                            <InfoRow label="Username" value={credential.username} />
                            <InfoRow label="Password" value={credential.password ? '••••••••••••' : 'N/A'} />
                            <InfoRow label="Salt Key" value={credential.saltKey ? '••••••••••••' : 'N/A'} isSecret />
                        </InfoSection>

                        {/* UAT Environment */}
                        <InfoSection title="UAT Environment" icon={Server}>
                            <InfoRow label="Base URL" value={credential.baseUrlUat} />
                            <InfoRow label="Token URL" value={credential.tokenUrlUat} />
                        </InfoSection>

                        {/* Production Environment */}
                        <InfoSection title="Production Environment" icon={Globe}>
                            <InfoRow label="Base URL" value={credential.baseUrlProd} />
                            <InfoRow label="Token URL" value={credential.tokenUrlProd} />
                        </InfoSection>

                       

                        {/* Custom Fields */}
                        {(credential.userField1 || credential.userField2 || credential.userField3) && (
                            <InfoSection title="Custom Fields" icon={Tag}>
                                {credential.userField1 && <InfoRow label="User Field 1" value={credential.userField1} />}
                                {credential.userField2 && <InfoRow label="User Field 2" value={credential.userField2} />}
                                {credential.userField3 && <InfoRow label="User Field 3" value={credential.userField3} />}
                            </InfoSection>
                        )}

                        {/* Token Information */}
                        {credential.token && (
                            <InfoSection title="Token Information" icon={Key}>
                                <InfoRow
                                    label="Token"
                                    value={credential.token ? `${credential.token.substring(0, 20)}...` : 'N/A'}
                                    isSecret
                                />
                            </InfoSection>
                        )}

                        {/* Timestamps */}
                        <InfoSection title="Record Information" icon={Calendar}>
                            <InfoRow label="Created On" value={formatDate(credential.createdAt)} />
                            <InfoRow label="Created By" value={credential.createdBy} />
                            <InfoRow label="Last Edited" value={formatDate(credential.updatedAt)} />
                            <InfoRow label="Edited By" value={credential.editedBy} />
                        </InfoSection>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorCredentialView;