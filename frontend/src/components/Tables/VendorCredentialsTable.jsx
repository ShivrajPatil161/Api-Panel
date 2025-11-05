import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import {
    Key, Plus, Search, Edit, Eye, Trash2, ChevronLeft,
    ChevronRight, Shield, Server, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import VendorCredentialForm from '../Forms/VendorCredentialForm';
import VendorCredentialView from '../View/VendorCredentialView';
import TableShimmer from '../Shimmer/TableShimmer';
import { createVendorCredential, deleteVendorCredential, getVendorCredentials, updateVendorCredential } from '../../constants/API/vendorCredentials';
import PageHeader from '../UI/PageHeader';
import StatsCard from '../UI/StatsCard';
import ErrorState from '../UI/ErrorState';
import Pagination from '../UI/Pagination';
import TableHeader from '../UI/TableHeader';
import Table from '../UI/Table';
const VendorCredentialTable = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingCredential, setEditingCredential] = useState(null);
    const [viewingCredential, setViewingCredential] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columnHelper = createColumnHelper();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['vendorCreds', {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: 'id',
            sortOrder: 'ASC'
        }],
        queryFn: getVendorCredentials,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    const createMutation = useMutation({
        mutationFn: createVendorCredential,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['vendorCreds']);
            toast.success(`Credential created successfully!`);
            setShowForm(false);
            setEditingCredential(null);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create vendor credentials");
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateVendorCredential,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['vendorCreds']);
            toast.success(`Credential updated successfully!`);
            setShowForm(false);
            setEditingCredential(null);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update credentials");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteVendorCredential,
        onSuccess: () => {
            queryClient.invalidateQueries(['vendorCreds']);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete credentials");
        }
    });

    const credentials = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => `#${info.getValue()}`,
                size: 80,
            }),
            columnHelper.accessor('vendorInfo.name', {
                header: 'Vendor',
                cell: info => (
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue() || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{info.row.original.productName || 'N/A'}</div>
                    </div>
                ),
            }),

            columnHelper.accessor('clientId', {
                header: 'Client ID',
                cell: info => (
                    <div className="text-sm text-gray-900 font-mono">
                        {info.getValue() || 'N/A'}
                    </div>
                ),
            }),
            columnHelper.accessor('baseUrlUat', {
                header: 'UAT URL',
                cell: info => (
                    <div className="text-sm text-gray-900 flex items-center">
                        <Server className="h-3 w-3 mr-1 text-gray-400" />
                        {info.getValue() ? (
                            <span className="truncate max-w-xs">{info.getValue()}</span>
                        ) : 'N/A'}
                    </div>
                ),
            }),
            columnHelper.accessor('baseUrlProd', {
                header: 'Prod URL',
                cell: info => (
                    <div className="text-sm text-gray-900 flex items-center">
                        <Server className="h-3 w-3 mr-1 text-gray-400" />
                        {info.getValue() ? (
                            <span className="truncate max-w-xs">{info.getValue()}</span>
                        ) : 'N/A'}
                    </div>
                ),
            }),
            columnHelper.accessor('isActive', {
                header: 'Status',
                cell: info => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue()
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {info.getValue() ? 'Active' : 'Inactive'}
                    </span>
                ),
            }),
            columnHelper.accessor('token', {
                header: 'Token',
                cell: info => (
                    <div className="text-sm text-gray-900 flex items-center">
                        <Lock className="h-3 w-3 mr-1 text-gray-400" />
                        {info.getValue() || 'N/A'}
                    </div>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: info => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleView(info.row.original)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Edit Credential"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original.id, info.row.original.vendor?.name)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete Credential"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            }),
        ],
        []
    );

    const table = useReactTable({
        data: credentials,
        columns,
        manualPagination: true,  // ✅ Server handles pagination
        pageCount: totalPages,   // Total pages from API
        state: {
            globalFilter,
            pagination,  // External pagination state
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,  // Sync state changes
    });

    const handleAddCredential = () => {
        setEditingCredential(null);
        setShowForm(true);
    };

    const handleEdit = (credential) => {
        setEditingCredential(credential);
        setShowForm(true);
    };

    const handleView = (credential) => {
        setViewingCredential(credential);
    };

    const handleDelete = (credentialId, vendorName) => {
        const confirmDelete = () => {
            toast.dismiss();
            performDelete(credentialId, vendorName);
        };

        const cancelDelete = () => {
            toast.dismiss();
            toast.info('Delete operation cancelled');
        };

        toast.warn(
            <div className="flex flex-col space-y-2">
                <span>Delete credential for "{vendorName}"?</span>
                <div className="flex space-x-2">
                    <button
                        onClick={confirmDelete}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Delete
                    </button>
                    <button
                        onClick={cancelDelete}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    };

    const performDelete = (credentialId, vendorName) => {
        deleteMutation.mutate(credentialId, {
            onSuccess: () => {
                toast.success(`${vendorName} deleted successfully!`);
            }
        });
    };

    const handleFormSubmit = (data) => {
        const isEditing = !!editingCredential;

        if (isEditing) {
            updateMutation.mutate({ id: editingCredential.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCredential(null);
    };

    const handleViewModalClose = () => {
        setViewingCredential(null);
    };

    const totalCredentials = totalElements;
    const activeCredentials = credentials.filter(c => c.isActive === true).length;
    const inactiveCredentials = credentials.filter(c => c.isActive === false).length;

    if (isError) {
        return <ErrorState />;
    }

    if (isLoading) {
        return <TableShimmer rows={3} columns={8} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pr-4">
            <div className=" mx-auto">

                {/* Header */}
                <PageHeader
                    icon={Key}
                    iconColor="text-blue-600"
                    title="Vendor Credentials"
                    description="Manage vendor API credentials and authentication"
                    buttonText="Add Credential"
                    buttonIcon={Plus}
                    onButtonClick={handleAddCredential}
                    buttonColor="bg-blue-600 hover:bg-blue-700"
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        icon={Key}
                        iconColor="text-blue-600"
                        bgColor="bg-blue-100"
                        label="Total Credentials"
                        value={totalCredentials}
                    />

                    <StatsCard
                        icon={Shield}
                        iconColor="text-green-600"
                        bgColor="bg-green-100"
                        label="Active"
                        value={activeCredentials}
                    />

                    <StatsCard
                        icon={Shield}
                        iconColor="text-red-600"
                        bgColor="bg-red-100"
                        label="Inactive"
                        value={inactiveCredentials}
                    />
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <TableHeader
                        title="Credentials List"
                        searchValue={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Search credentials..."
                    />

                    <Table
                        table={table}
                        columns={columns}
                        emptyState={{
                            icon: <Key size={50} />,
                            message: "No credentials found",
                            action: (
                            <button
                                onClick={handleAddCredential}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add First Credential
                            </button>
                            )
                        }}
                    />

                    {/* Pagination */}
                    {!isLoading && (
                        <Pagination table={table} />
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <VendorCredentialForm
                    isOpen={showForm}
                    onSubmit={handleFormSubmit}
                    onClose={handleFormCancel}
                    initialData={editingCredential}
                />
            )}

            {/* View Modal */}
            <VendorCredentialView
                credential={viewingCredential}
                isOpen={!!viewingCredential}
                onClose={handleViewModalClose}
            />
        </div>
    );
};

export default VendorCredentialTable;