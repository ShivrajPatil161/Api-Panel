import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import {
    Building2, Search, Edit, Eye, Trash2, ChevronLeft,
    ChevronRight, Plus, CreditCard
} from 'lucide-react';
import { toast } from 'react-toastify';

import AdminBankForm from '../Forms/AdminBankForm';

// Mock data - just 2 rows
const MOCK_BANKS = [
    {
        id: 1,
        bankName: 'HDFC Bank',
        accountNumber: '123456789012',
        ifscCode: 'HDFC0001234',
        charges: true,
        chargesType: 'percentage'
    },
    {
        id: 2,
        bankName: 'State Bank of India',
        accountNumber: '987654321098',
        ifscCode: 'SBIN0005678',
        charges: false,
        chargesType: ''
    }
];

const AdminBankTable = () => {
    const [banks, setBanks] = useState(MOCK_BANKS);
    const [showForm, setShowForm] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [viewingBank, setViewingBank] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => `#${info.getValue()}`,
                size: 80,
            }),
            columnHelper.accessor('bankName', {
                header: 'Bank Name',
                cell: info => (
                    <div className="font-medium text-gray-900">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('accountNumber', {
                header: 'Account Number',
                cell: info => (
                    <div className="text-sm text-gray-900">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('ifscCode', {
                header: 'IFSC Code',
                cell: info => (
                    <div className="text-sm text-gray-900 font-mono">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('charges', {
                header: 'Charges',
                cell: info => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue()
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {info.getValue() ? 'Enabled' : 'Disabled'}
                    </span>
                ),
            }),
            columnHelper.accessor('chargesType', {
                header: 'Charges Type',
                cell: info => (
                    <div className="text-sm text-gray-900 capitalize">
                        {info.getValue() || '-'}
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
                            title="Edit Bank"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original.id, info.row.original.bankName)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete Bank"
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
        data: banks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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

    const handleAddBank = () => {
        setEditingBank(null);
        setShowForm(true);
    };

    const handleEdit = (bank) => {
        setEditingBank(bank);
        setShowForm(true);
    };

    const handleView = (bank) => {
        setViewingBank(bank);
    };

    const handleDelete = (bankId, bankName) => {
        const confirmDelete = () => {
            toast.dismiss();
            performDelete(bankId, bankName);
        };

        const cancelDelete = () => {
            toast.dismiss();
            toast.info('Delete operation cancelled');
        };

        toast.warn(
            <div className="flex flex-col space-y-2">
                <span>Delete "{bankName}"?</span>
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

    const performDelete = (bankId, bankName) => {
        setBanks(banks.filter(bank => bank.id !== bankId));
        toast.success(`${bankName} deleted successfully!`);
    };

    const handleFormSubmit = (data) => {
        const isEditing = !!editingBank;
        const bankName = data.bankName;

        if (isEditing) {
            setBanks(banks.map(bank =>
                bank.id === editingBank.id ? { ...bank, ...data } : bank
            ));
            toast.success(`${bankName} updated successfully!`);
        } else {
            const newBank = { ...data, id: banks.length + 1 };
            setBanks([...banks, newBank]);
            toast.success(`${bankName} created successfully!`);
        }
        setShowForm(false);
        setEditingBank(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingBank(null);
    };

    const handleViewModalClose = () => {
        setViewingBank(null);
    };

    const totalBanks = banks.length;
    const chargesEnabled = banks.filter(b => b.charges === true).length;
    const chargesDisabled = banks.filter(b => b.charges === false).length;

    return (
        <div className="min-h-screen bg-gray-50 pr-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CreditCard className="text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
                                <p className="text-gray-600">Manage all your bank accounts and information</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddBank}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Bank</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Banks</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBanks}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Charges Enabled</p>
                                <p className="text-2xl font-bold text-gray-900">{chargesEnabled}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CreditCard className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Charges Disabled</p>
                                <p className="text-2xl font-bold text-gray-900">{chargesDisabled}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Bank List</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search banks..."
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
                                                <CreditCard className="h-12 w-12 text-gray-400" />
                                                <p className="text-gray-500">No banks found</p>
                                                <button
                                                    onClick={handleAddBank}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Add First Bank
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
                    {table.getRowModel().rows.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">
                                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                        {Math.min(
                                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                            table.getFilteredRowModel().rows.length
                                        )}{' '}
                                        of {table.getFilteredRowModel().rows.length} results
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
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
                <AdminBankForm
                    isOpen={showForm}
                    onClose={handleFormCancel}
                    defaultValues={editingBank}
                    onSubmit={handleFormSubmit}
                    isEdit={!!editingBank}
                />
            )}

            {/* View Modal */}
            {viewingBank && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
                            <button
                                onClick={handleViewModalClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                <p className="text-lg text-gray-900">{viewingBank.bankName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Number</label>
                                <p className="text-lg text-gray-900">{viewingBank.accountNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                                <p className="text-lg text-gray-900 font-mono">{viewingBank.ifscCode}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Charges</label>
                                <p className="text-lg text-gray-900">{viewingBank.charges ? 'Enabled' : 'Disabled'}</p>
                            </div>
                            {viewingBank.charges && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Charges Type</label>
                                    <p className="text-lg text-gray-900 capitalize">{viewingBank.chargesType}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleViewModalClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBankTable;