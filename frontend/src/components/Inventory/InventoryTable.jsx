import { useState, useMemo, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import {
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
} from 'lucide-react'
import api
    from '../../constants/API/axiosInstance'

const InventoryTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

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
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Product Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
        },
        {
            accessorKey: 'totalQuantity',
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
                <div className="text-center font-semibold">{row.getValue('totalQuantity')}</div>
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
                const total = row.getValue('totalQuantity')
                const percentage = total > 0 ? (available / total) * 100 : 0

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

    const fetchInventory = async () => {
        setLoading(true)
        setError(null)

        try {
            const sortBy = sorting.length > 0 ? sorting[0].id : 'productName'
            const sortDir = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

            const params = {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sortBy,
                sortDir,
            }

            if (globalFilter && globalFilter.trim()) {
                params.search = globalFilter.trim()
            }

            const response = await api.get('/inventory', { params })

            setData(response.data.content)
            setTotalPages(response.data.totalPages)
            setTotalElements(response.data.totalElements)
        } catch (err) {
            setError('Failed to fetch inventory data')
            console.error('Inventory fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on component mount and when pagination/sorting/search changes
    useEffect(() => {
        fetchInventory()
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter])

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setGlobalFilter(searchInput.trim())
            setPagination(prev => ({ ...prev, pageIndex: 0 }))
        }
    }

    const handleSearchClear = () => {
        setSearchInput('')
        setGlobalFilter('')
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        pageCount: totalPages,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
    })

    const canPreviousPage = pagination.pageIndex > 0
    const canNextPage = pagination.pageIndex < totalPages - 1

    return (
        <div className="space-y-4 p-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search inventory (Press Enter to search)..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    {searchInput && (
                        <button
                            onClick={handleSearchClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    )}
                </div>
                {loading && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

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
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="text-gray-500">Loading inventory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                        No inventory items found
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page {pagination.pageIndex + 1} of {totalPages || 1}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({totalElements} total items)
                            </span>
                            <select
                                value={pagination.pageSize}
                                onChange={(e) => setPagination(prev => ({
                                    ...prev,
                                    pageSize: Number(e.target.value),
                                    pageIndex: 0
                                }))}
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
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
                                disabled={!canPreviousPage || loading}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                                disabled={!canPreviousPage || loading}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                                disabled={!canNextPage || loading}
                                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: totalPages - 1 }))}
                                disabled={!canNextPage || loading}
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