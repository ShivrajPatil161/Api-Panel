import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    createColumnHelper,
    flexRender,
} from '@tanstack/react-table';
import {
    Plus,
    Search,
    Edit,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Building2,
    Users,
    Calendar,
    X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import CustomerRateForm from '../Forms/PricingForm';


import { dummyDirectMerchantRates, dummyFranchiseRates } from '../../constants/constants';

// Main Component
const CustomerRatesManagement = () => {
    const [franchiseRates, setFranchiseRates] = useState(dummyFranchiseRates);
    const [directMerchantRates, setDirectMerchantRates] = useState(dummyDirectMerchantRates);
    const [showForm, setShowForm] = useState(false);
    const [editingRate, setEditingRate] = useState(null);
    const [activeTab, setActiveTab] = useState('franchise');
    const [franchiseGlobalFilter, setFranchiseGlobalFilter] = useState('');
    const [directGlobalFilter, setDirectGlobalFilter] = useState('');

    const franchiseColumnHelper = createColumnHelper();
    const directColumnHelper = createColumnHelper();

    const franchiseColumns = useMemo(
        () => [
            franchiseColumnHelper.accessor('id', {
                header: 'ID',
                cell: info => `#${info.getValue()}`,
                size: 80,
            }),
            franchiseColumnHelper.accessor('franchiseName', {
                header: 'Franchise Details',
                cell: info => (
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">ID: {info.row.original.franchiseId}</div>
                    </div>
                ),
            }),
            franchiseColumnHelper.accessor('rental', {
                header: 'Device & Rental',
                cell: info => (
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue().deviceType}</div>
                        <div className="text-sm text-gray-500">₹{info.getValue().monthlyRate}/month</div>
                    </div>
                ),
            }),
            franchiseColumnHelper.accessor('cardRates', {
                header: 'Card Rates',
                cell: info => (
                    <div className="text-xs">
                        {info.getValue().map((rate, index) => (
                            <div key={index} className="flex justify-between mb-1">
                                <span className="font-medium">{rate.cardType}:</span>
                                <span>{rate.franchiseRate}% / {rate.merchantRate}%</span>
                            </div>
                        ))}
                    </div>
                ),
            }),
            franchiseColumnHelper.accessor('effectiveDate', {
                header: 'Effective Period',
                cell: info => (
                    <div className="text-sm">
                        <div>{new Date(info.getValue()).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(info.row.original.expiryDate).toLocaleDateString()}</div>
                    </div>
                ),
            }),
            franchiseColumnHelper.accessor('status', {
                header: 'Status',
                cell: info => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {info.getValue() === 'active' ? 'Active' : 'Inactive'}
                    </span>
                ),
            }),
            franchiseColumnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: info => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleView(info.row.original)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Edit Rate"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original.id, 'franchise')}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Rate"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            }),
        ],
        []
    );

    const directMerchantColumns = useMemo(
        () => [
            directColumnHelper.accessor('id', {
                header: 'ID',
                cell: info => `#${info.getValue()}`,
                size: 80,
            }),
            directColumnHelper.accessor('merchantName', {
                header: 'Merchant Name',
                cell: info => (
                    <div className="font-medium text-gray-900">{info.getValue()}</div>
                ),
            }),
            directColumnHelper.accessor('rental', {
                header: 'Device & Rental',
                cell: info => (
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue().deviceType}</div>
                        <div className="text-sm text-gray-500">₹{info.getValue().monthlyRate}/month</div>
                    </div>
                ),
            }),
            directColumnHelper.accessor('cardRates', {
                header: 'Card Rates',
                cell: info => (
                    <div className="text-xs">
                        {info.getValue().map((rate, index) => (
                            <div key={index} className="flex justify-between mb-1">
                                <span className="font-medium">{rate.cardType}:</span>
                                <span>{rate.rate}%</span>
                            </div>
                        ))}
                    </div>
                ),
            }),
            directColumnHelper.accessor('effectiveDate', {
                header: 'Effective Period',
                cell: info => (
                    <div className="text-sm">
                        <div>{new Date(info.getValue()).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(info.row.original.expiryDate).toLocaleDateString()}</div>
                    </div>
                ),
            }),
            directColumnHelper.accessor('status', {
                header: 'Status',
                cell: info => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {info.getValue() === 'active' ? 'Active' : 'Inactive'}
                    </span>
                ),
            }),
            directColumnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: info => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleView(info.row.original)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Edit Rate"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original.id, 'direct')}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Rate"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            }),
        ],
        []
    );

    const franchiseTable = useReactTable({
        data: franchiseRates,
        columns: franchiseColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: franchiseGlobalFilter,
        },
        onGlobalFilterChange: setFranchiseGlobalFilter,
        initialState: {
            pagination: { pageSize: 5 },
        },
    });

    const directMerchantTable = useReactTable({
        data: directMerchantRates,
        columns: directMerchantColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: directGlobalFilter,
        },
        onGlobalFilterChange: setDirectGlobalFilter,
        initialState: {
            pagination: { pageSize: 5 },
        },
    });

    const handleAddRate = () => {
        setEditingRate(null);
        setShowForm(true);
    };

    const handleEdit = (rate) => {
        setEditingRate(rate);
        setShowForm(true);
    };

    const handleView = (rate) => {
        alert(`Viewing details for ${rate.franchiseName || rate.merchantName}`);
    };

    const handleDelete = (rateId, type) => {
        if (window.confirm('Are you sure you want to delete this rate?')) {
            if (type === 'franchise') {
                setFranchiseRates(franchiseRates.filter(rate => rate.id !== rateId));
            } else {
                setDirectMerchantRates(directMerchantRates.filter(rate => rate.id !== rateId));
            }
        }
    };

    const handleFormSubmit = (data) => {
        if (editingRate) {
            if (data.customerType === 'franchise') {
                setFranchiseRates(franchiseRates.map(rate =>
                    rate.id === editingRate.id ? { ...rate, ...data } : rate
                ));
            } else {
                setDirectMerchantRates(directMerchantRates.map(rate =>
                    rate.id === editingRate.id ? { ...rate, ...data } : rate
                ));
            }
        } else {
            const newRate = {
                ...data,
                id: Math.max(
                    ...franchiseRates.map(r => r.id),
                    ...directMerchantRates.map(r => r.id)
                ) + 1,
                status: 'active'
            };

            if (data.customerType === 'franchise') {
                setFranchiseRates([...franchiseRates, newRate]);
            } else {
                setDirectMerchantRates([...directMerchantRates, newRate]);
            }
        }
        setShowForm(false);
        setEditingRate(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingRate(null);
    };

    const totalActiveRates = franchiseRates.filter(r => r.status === 'active').length +
        directMerchantRates.filter(r => r.status === 'active').length;

    const TableComponent = ({ table, globalFilter, setGlobalFilter, type }) => (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {type === 'franchise' ? 'Franchise Rates' : 'Direct Merchant Rates'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Search ${type} rates...`}
                            />
                        </div>
                        <button
                            onClick={handleAddRate}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add New Rate</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Customer Rates Management</h1>
                                <p className="text-gray-600">Manage franchise and direct merchant payment rates</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Rates</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {franchiseRates.length + directMerchantRates.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Franchise Rates</p>
                                <p className="text-2xl font-bold text-gray-900">{franchiseRates.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Direct Merchant</p>
                                <p className="text-2xl font-bold text-gray-900">{directMerchantRates.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Rates</p>
                                <p className="text-2xl font-bold text-gray-900">{totalActiveRates}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('franchise')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'franchise'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Franchise Rates ({franchiseRates.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('direct')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'direct'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Direct Merchant Rates ({directMerchantRates.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tables */}
                {activeTab === 'franchise' ? (
                    <TableComponent
                        table={franchiseTable}
                        globalFilter={franchiseGlobalFilter}
                        setGlobalFilter={setFranchiseGlobalFilter}
                        type="franchise"
                    />
                ) : (
                    <TableComponent
                        table={directMerchantTable}
                        globalFilter={directGlobalFilter}
                        setGlobalFilter={setDirectGlobalFilter}
                        type="direct"
                    />
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <CustomerRateForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingRate}
                    isEdit={!!editingRate}
                />
            )}
        </div>
    );
};

export default CustomerRatesManagement;