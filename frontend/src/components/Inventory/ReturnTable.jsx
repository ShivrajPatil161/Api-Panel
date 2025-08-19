import { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import {
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react'

const ReturnTable = ({ data, onEdit, onView, onDelete }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    const columns = useMemo(() => [
        {
            accessorKey: 'returnNumber',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Return Number</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('returnNumber')}</div>
            ),
        },
        {
            accessorKey: 'customerName',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Customer Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
        },
        {
            accessorKey: 'productName',
            header: 'Product Name',
        },
        {
            accessorKey: 'returnedQuantity',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Returned Qty</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="text-center font-semibold">{row.getValue('returnedQuantity')}</div>
            ),
        },
        {
            accessorKey: 'returnDate',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Return Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div>{new Date(row.getValue('returnDate')).toLocaleDateString()}</div>
            ),
        },
        {
            accessorKey: 'returnReason',
            header: 'Return Reason',
            cell: ({ row }) => {
                const reasonLabels = {
                    defective: 'Defective Product',
                    wrong_product: 'Wrong Product',
                    damage_in_transit: 'Damage in Transit',
                    customer_request: 'Customer Request',
                    warranty_claim: 'Warranty Claim',
                    upgrade_request: 'Upgrade Request',
                    excess_stock: 'Excess Stock',
                    other: 'Other'
                }
                return (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {reasonLabels[row.getValue('returnReason')] || row.getValue('returnReason')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'actionTaken',
            header: 'Action Taken',
            cell: ({ row }) => {
                const actionLabels = {
                    replacement: 'Replacement Provided',
                    refund: 'Refund Processed',
                    repair: 'Sent for Repair',
                    credit_note: 'Credit Note Issued',
                    exchange: 'Exchange',
                    pending: 'Pending Review'
                }
                const action = row.getValue('actionTaken')
                let colorClass = 'bg-gray-100 text-gray-800'

                if (action === 'refund' || action === 'replacement') {
                    colorClass = 'bg-green-100 text-green-800'
                } else if (action === 'pending') {
                    colorClass = 'bg-yellow-100 text-yellow-800'
                } else if (action === 'repair') {
                    colorClass = 'bg-blue-100 text-blue-800'
                }

                return (
                    <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                        {actionLabels[action] || action}
                    </span>
                )
            },
        },
        {
            accessorKey: 'refundAmount',
            header: 'Refund Amount',
            cell: ({ row }) => {
                const amount = row.getValue('refundAmount')
                return amount ? <div className="font-semibold">₹{amount}</div> : <div className="text-gray-400">-</div>
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onView?.(row.original)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEdit?.(row.original)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Edit Entry"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete?.(row.original.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Entry"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ], [onEdit, onView, onDelete])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
    })

    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">No return entries found. Click "Add Return Entry" to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search return entries..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReturnTable