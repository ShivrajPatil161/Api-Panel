import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Plus,
    ChevronDown,
    ChevronRight,
    Store,
    Users,
    Wallet,
    Package,
    MoreHorizontal,
    MapPin,
    Phone,
    Mail,
    Calendar,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

import { franchiseData, merchantData } from '../../constants/constants';

// Reusable Components
const StatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        suspended: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const ActionButton = ({ icon: Icon, onClick, variant = 'ghost', size = 'sm', className = '' }) => {
    const variants = {
        ghost: 'hover:bg-gray-50 text-gray-600 hover:text-gray-900',
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        danger: 'hover:bg-red-50 text-red-600 hover:text-red-700'
    };

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

const TableHeader = ({ title, count, onAdd, onExport, searchValue, onSearchChange }) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{count} total customers</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
         
        </div>
    </div>
);

const CustomerListComponent = () => {
    const [activeTab, setActiveTab] = useState('franchises');
    const [globalFilter, setGlobalFilter] = useState('');
    const [expanded, setExpanded] = useState({});


    // Column Helper
    const columnHelper = createColumnHelper();

    // Franchise Columns
    const franchiseColumns = useMemo(() => [
        columnHelper.display({
            id: 'expander',
            header: '',
            cell: ({ row }) => (
                <button
                    onClick={() => row.toggleExpanded()}
                    className="p-1 hover:bg-gray-50 rounded"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                </button>
            ),
            size: 40,
        }),
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor('name', {
            header: 'Franchise Name',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Store className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.contactPerson}</div>
                    </div>
                </div>
            ),
            size: 250,
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('merchantCount', {
            header: 'Merchants',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{info.getValue()}</span>
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor('totalProducts', {
            header: 'Products',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{info.getValue()}</span>
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{info.getValue().toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
            size: 100,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton icon={Eye} onClick={() => console.log('View', row.original.id)} />
                    <ActionButton icon={Edit} onClick={() => console.log('Edit', row.original.id)} />
                    <ActionButton icon={Trash2} onClick={() => console.log('Delete', row.original.id)} variant="danger" />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper]);

    // Merchant Columns
    const merchantColumns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor('name', {
            header: 'Merchant Name',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Store className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.businessType}</div>
                    </div>
                </div>
            ),
            size: 250,
        }),
        columnHelper.accessor('contactPerson', {
            header: 'Contact Person',
            cell: (info) => (
                <div>
                    <div className="font-medium text-gray-900">{info.getValue()}</div>
                    <div className="text-sm text-gray-500">{info.row.original.email}</div>
                </div>
            ),
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('products', {
            header: 'Products',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{info.getValue()}</span>
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{info.getValue().toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('monthlyRevenue', {
            header: 'Monthly Revenue',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{info.getValue().toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
            size: 100,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton icon={Eye} onClick={() => console.log('View', row.original.id)} />
                    <ActionButton icon={Edit} onClick={() => console.log('Edit', row.original.id)} />
                    <ActionButton icon={Trash2} onClick={() => console.log('Delete', row.original.id)} variant="danger" />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper]);

    // Table instance
    const table = useReactTable({
        data: activeTab === 'franchises' ? franchiseData : merchantData,
        columns: activeTab === 'franchises' ? franchiseColumns : merchantColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            globalFilter,
            expanded,
        },
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        getSubRows: activeTab === 'franchises' ? (row) => row.merchants : undefined,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const SubRow = ({ merchant }) => (
        <tr className="bg-gray-50 border-l-4 border-blue-200">
            <td className="pl-12 py-3"></td>
            <td className="py-3">
                <span className="font-mono text-xs text-gray-500">{merchant.id}</span>
            </td>
            <td className="py-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1 bg-blue-100 rounded">
                        <Store className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{merchant.name}</span>
                </div>
            </td>
            <td className="py-3">
                <span className="text-sm text-gray-600">{merchant.location}</span>
            </td>
            <td className="py-3">
                <span className="text-sm font-medium">{merchant.products}</span>
            </td>
            <td className="py-3">
                <span className="text-sm font-medium">₹{merchant.revenue.toLocaleString()}</span>
            </td>
            <td className="py-3">
                <StatusBadge status={merchant.status} />
            </td>
            <td className="py-3">
                <div className="flex items-center space-x-1">
                    <ActionButton icon={Eye} onClick={() => console.log('View merchant', merchant.id)} />
                    <ActionButton icon={Edit} onClick={() => console.log('Edit merchant', merchant.id)} />
                </div>
            </td>
        </tr>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('franchises')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'franchises'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Franchises ({franchiseData.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('merchants')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'merchants'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Direct Merchants ({merchantData.length})
                        </button>
                    </nav>
                </div>

                {/* Header */}
                <TableHeader
                    title={activeTab === 'franchises' ? 'Franchise Management' : 'Direct Merchant Management'}
                    count={activeTab === 'franchises' ? franchiseData.length : merchantData.length}
                    onAdd={() => console.log('Add new')}
                    onExport={() => console.log('Export data')}
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                />

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={header.column.getToggleSortingHandler()}
                                                style={{ width: header.getSize() }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <tr className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    style={{ width: cell.column.getSize() }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Sub-rows for franchise merchants */}
                                        {activeTab === 'franchises' && row.getIsExpanded() && row.original.merchants?.map((merchant) => (
                                            <SubRow key={merchant.id} merchant={merchant} />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                            table.getFilteredRowModel().rows.length
                                        )}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'<<'}
                                </button>
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'<'}
                                </button>
                                <span className="flex items-center space-x-1">
                                    <span>Page</span>
                                    <strong>
                                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </strong>
                                </span>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'>'}
                                </button>
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {'>>'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerListComponent;