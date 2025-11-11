import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Key,
    Plus,
    AlertCircle,
    X,
    Shield,
    Globe,
    CheckCircle,
    XCircle
} from 'lucide-react';
import PartnerCredentialForm from '../Forms/PartnerCredentialForm';
import PartnerCredentialView from '../View/PartnerCredentialView';
import PageHeader from '../UI/PageHeader';
import TableHeader from '../UI/TableHeader';
import Table from '../UI/Table';
import Pagination from '../UI/Pagination';
import { usePartnerCredentials, useDeletePartnerCredential } from '../Hooks/usePartnerCredentials';

// Utility Components
const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
        {isActive ? (
            <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
            </>
        ) : (
            <>
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
            </>
        )}
    </span>
);

const ActionButton = ({ icon: Icon, onClick, variant = 'ghost', className = '' }) => {
    const variants = {
        ghost: 'hover:bg-green-100 text-green-600 hover:text-green-900',
        primary: 'text-blue-700 hover:bg-blue-100',
        danger: 'hover:bg-red-50 text-red-600 hover:text-red-700'
    };

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
            aria-label={Icon.name}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Retry
            </button>
        )}
    </div>
);

// Main Table Component
const PartnerCredentialTable = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [viewModal, setViewModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [addModal, setAddModal] = useState(false);

    const columnHelper = createColumnHelper();

    // Fetch credentials using React Query
    const { data: credentials = [], isLoading, isError, error, refetch } = usePartnerCredentials();
    
    // Delete mutation
    const deleteMutation = useDeletePartnerCredential();

    const handleView = (credential) => {
        setViewModal(credential);
    };

    const handleEdit = (credential) => {
        setEditModal(credential);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this credential?')) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    };

    // Table columns
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">#{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor(row => row, {
            id: 'partner',
            header: 'Partner',
            cell: (info) => {
                const row = info.getValue();
                return (
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Key className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">
                                Partner: {row.apiPartnerName}
                            </div>
                            <div className="text-sm text-gray-500">
                                Product : {row.productName}
                            </div>
                        </div>
                    </div>
                );
            },
            size: 200,
        }),
        columnHelper.accessor('callbackUrl', {
            header: 'Callback URL',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate max-w-xs">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('baseUrlProd', {
            header: 'Production URL',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate max-w-xs">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: (info) => <StatusBadge isActive={info.getValue()} />,
            size: 100,
        }),
        columnHelper.accessor('editedOn', {
            header: 'Last Updated',
            cell: (info) => {
                const date = info.getValue();
                return (
                    <span className="text-sm text-gray-600">
                        {date ? new Date(date).toLocaleDateString() : 'N/A'}
                    </span>
                );
            },
            size: 120,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton
                        icon={Eye}
                        onClick={() => handleView(row.original)}
                        variant="primary"
                    />
                    <ActionButton
                        icon={Edit}
                        onClick={() => handleEdit(row.original)}
                        variant="ghost"
                    />
                    <ActionButton
                        icon={Trash2}
                        onClick={() => handleDelete(row.original.id)}
                        variant="danger"
                    />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper]);

    // Table instance
    const table = useReactTable({
        data: credentials,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-2 pr-5">
            <div className="mx-auto">
                <div className="">
                    <PageHeader
                        icon={Key}
                        iconColor="text-blue-600"
                        title="Partner Credentials"
                        description={`${credentials.length} total credentials`}
                        buttonText="Add Credential"
                        buttonIcon={Plus}
                        onButtonClick={() => setAddModal(true)}
                        buttonColor="bg-blue-600 hover:bg-blue-700"
                    />
                    
                    <TableHeader
                        searchValue={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Search credentials..."
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        <ErrorDisplay 
                            message={error?.message || 'Failed to load credentials'} 
                            onRetry={refetch}
                        />
                    ) : (
                        <>
                            <Table
                                table={table}
                                columns={columns}
                                emptyState={{
                                    icon: <Key className="h-12 w-12" />,
                                    message: "No credentials found",
                                    action: null
                                }}
                                sortable={true}
                                hoverable={true}
                            />
                            <Pagination table={table} />
                        </>
                    )}
                </div>

                {/* Add Modal */}
                {addModal && (
                    <PartnerCredentialForm
                        isOpen={addModal}
                        onClose={() => setAddModal(false)}
                        mode="create"
                    />
                )}

                {/* Edit Modal */}
                {editModal && (
                    <PartnerCredentialForm
                        isOpen={!!editModal}
                        onClose={() => setEditModal(null)}
                        initialData={editModal}
                        mode="edit"
                    />
                )}

                {/* View Modal */}
                {viewModal && (
                    <PartnerCredentialView
                        credential={viewModal}
                        onClose={() => setViewModal(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PartnerCredentialTable;