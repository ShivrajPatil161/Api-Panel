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
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: false,
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
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Credentials List</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search credentials..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center space-y-2">
                                                <Key className="h-12 w-12 text-gray-400" />
                                                <p className="text-gray-500">No credentials found</p>
                                                <button
                                                    onClick={handleAddCredential}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Add First Credential
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && table.getRowModel().rows.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">
                                        Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
                                        {Math.min(
                                            (pagination.pageIndex + 1) * pagination.pageSize,
                                            totalElements
                                        )}{' '}
                                        of {totalElements} results
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                                        disabled={pagination.pageIndex === 0}
                                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {pagination.pageIndex + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                                        disabled={pagination.pageIndex >= totalPages - 1}
                                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
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