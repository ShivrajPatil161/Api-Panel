import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { toast } from 'react-toastify';
import {
    Package,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    Search,
    Filter,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { inventoryData, getInventorySummary } from '../constants/inventoryDummyData';

// Status Badge Component
const StatusBadge = ({ status, type }) => {
    const getStatusColor = (status, type) => {
        const statusColors = {
            inward: {
                received: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                rejected: 'bg-red-100 text-red-800'
            },
            outward: {
                dispatched: 'bg-blue-100 text-blue-800',
                in_transit: 'bg-purple-100 text-purple-800',
                delivered: 'bg-green-100 text-green-800',
                cancelled: 'bg-red-100 text-red-800'
            }
        };

        return statusColors[type]?.[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status, type)}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};

// Type Badge Component
const TypeBadge = ({ type }) => {
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${type === 'inward'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
            {type === 'inward' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {type.toUpperCase()}
        </span>
    );
};

// Serial Numbers Modal Component
const SerialNumbersModal = ({ isOpen, onClose, serialNumbers, productName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Serial Numbers - {productName}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-96">
                    {serialNumbers && serialNumbers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VpID</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {serialNumbers.map((serial, index) => (
                                        <tr key={serial.id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {serial.MID || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {serial.SID || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {serial.TID || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {serial.VpID || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No serial numbers available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Summary Cards Component
const SummaryCards = () => {
    const summary = getInventorySummary();

    const cards = [
        {
            title: 'Total Inward',
            value: summary.totalInward,
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Outward',
            value: summary.totalOutward,
            icon: TrendingDown,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Total Value',
            value: `₹${summary.totalValue.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Recent Transactions',
            value: summary.recentTransactions.length,
            icon: Activity,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div key={index} className={`${card.bgColor} rounded-lg p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                        </div>
                        <card.icon className={`h-8 w-8 ${card.color}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main Inventory Component
const Inventory = () => {
    const [data] = useState(inventoryData);
    const [globalFilter, setGlobalFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serialModalOpen, setSerialModalOpen] = useState(false);
    const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState('');

    // Table columns definition
    const columns = useMemo(
        () => [
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({ getValue }) => <TypeBadge type={getValue()} />,
                size: 100,
            },
            {
                accessorKey: 'date',
                header: 'Date',
                cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('en-IN'),
                size: 120,
            },
            {
                accessorKey: 'invoiceNumber',
                header: 'Invoice/Delivery No.',
                cell: ({ row }) => {
                    const invoice = row.original.invoiceNumber;
                    const delivery = row.original.deliveryNumber;
                    return (
                        <span className="font-mono text-sm">
                            {invoice || delivery || '-'}
                        </span>
                    );
                },
                size: 150,
            },
            {
                accessorKey: 'vendorName',
                header: 'Vendor/Customer',
                cell: ({ row }) => {
                    const vendor = row.original.vendorName;
                    const customer = row.original.customerName;
                    return vendor || customer || '-';
                },
                size: 150,
            },
            {
                accessorKey: 'productName',
                header: 'Product',
                cell: ({ getValue, row }) => (
                    <div>
                        <div className="font-medium text-sm">{getValue()}</div>
                        <div className="text-xs text-gray-500">{row.original.productId}</div>
                    </div>
                ),
                size: 200,
            },
            {
                accessorKey: 'productType',
                header: 'Type',
                cell: ({ getValue }) => (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getValue().replace('_', ' ').toUpperCase()}
                    </span>
                ),
                size: 120,
            },
            {
                accessorKey: 'quantity',
                header: 'Qty',
                size: 80,
            },
            {
                accessorKey: 'unitPrice',
                header: 'Unit Price',
                cell: ({ getValue }) => `₹${getValue().toLocaleString('en-IN')}`,
                size: 120,
            },
            {
                accessorKey: 'totalAmount',
                header: 'Total Amount',
                cell: ({ getValue }) => `₹${getValue().toLocaleString('en-IN')}`,
                size: 120,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ getValue, row }) => (
                    <StatusBadge status={getValue()} type={row.original.type} />
                ),
                size: 120,
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleViewSerialNumbers(row.original)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="View Serial Numbers"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                ),
                size: 80,
            },
        ],
        []
    );

    // Filter data based on type and status
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const typeMatch = typeFilter === 'all' || item.type === typeFilter;
            const statusMatch = statusFilter === 'all' || item.status === statusFilter;
            return typeMatch && statusMatch;
        });
    }, [data, typeFilter, statusFilter]);

    // Table instance
    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const handleViewSerialNumbers = (item) => {
        setSelectedSerialNumbers(item.serialNumbers || []);
        setSelectedProductName(item.productName);
        setSerialModalOpen(true);
    };

    const handleExport = () => {
        toast.success('Export functionality would be implemented here');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-2">Track and manage all inward and outward inventory movements</p>
            </div>

            {/* Summary Cards */}
            <SummaryCards />

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Types</option>
                                <option value="inward">Inward</option>
                                <option value="outward">Outward</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="received">Received</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={20} />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{ width: header.getSize() }}
                                        >
                                            <div className="flex items-center space-x-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: ' ↑',
                                                    desc: ' ↓',
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 text-sm text-gray-900"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-700">
                            <span>
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
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                {[10, 20, 30, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Serial Numbers Modal */}
            <SerialNumbersModal
                isOpen={serialModalOpen}
                onClose={() => setSerialModalOpen(false)}
                serialNumbers={selectedSerialNumbers}
                productName={selectedProductName}
            />
        </div>
    );
};

export default Inventory;