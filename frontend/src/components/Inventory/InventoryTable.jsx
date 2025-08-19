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
} from 'lucide-react'

const InventoryTable = ({ data }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    const columns = useMemo(() => [
        {
            accessorKey: 'productCode',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Product Code</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('productCode')}</div>
            ),
        },
        {
            accessorKey: 'productName',
            header: 'Product Name',
        },
        {
            accessorKey: 'quantity',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Total Quantity</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="text-center font-semibold">{row.getValue('quantity')}</div>
            ),
        },
        {
            accessorKey: 'reserved',
            header: 'Reserved',
            cell: ({ row }) => (
                <div className="text-center text-yellow-600 font-medium">{row.getValue('reserved')}</div>
            ),
        },
        {
            accessorKey: 'available',
            header: 'Available',
            cell: ({ row }) => (
                <div className="text-center text-green-600 font-semibold">{row.getValue('available')}</div>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const available = row.getValue('available')
                const total = row.getValue('quantity')
                const percentage = (available / total) * 100

                let status = 'In Stock'
                let colorClass = 'bg-green-100 text-green-800'

                if (percentage <= 10) {
                    status = 'Low Stock'
                    colorClass = 'bg-red-100 text-red-800'
                } else if (percentage <= 30) {
                    status = 'Medium Stock'
                    colorClass = 'bg-yellow-100 text-yellow-800'
                }

                return (
                    <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                        {status}
                    </span>
                )
            },
        },
    ], [])

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

    return (
        <div className="space-y-4 p-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search inventory..."
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

export default InventoryTable