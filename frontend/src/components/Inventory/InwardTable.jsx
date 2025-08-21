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
    CreditCard,
    X,
} from 'lucide-react'

const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">{label}:</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );
};

const ViewInwardEntry = ({ inwardData, onClose, isOpen }) => {
    if (!isOpen || !inwardData) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Inward Entry – {inwardData.invoiceNumber}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Vendor & Invoice Section */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Vendor & Invoice Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
                            <div className="">
                                <DetailRow label="Invoice Number" value={inwardData.invoiceNumber} />
                                <DetailRow label="Vendor Name" value={inwardData.vendorName} />
                            </div>
                            <div className="">
                                <DetailRow label="Received By" value={inwardData.receivedBy} />
                                <DetailRow label="Received Date" value={inwardData.receivedDate} />
                            </div>
                        </div>
                    </div>

                    {/* Product Section */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Product Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20 ">
                            <div className="">
                                <DetailRow label="Product Code" value={inwardData.productCode} />
                                <DetailRow label="Batch Number" value={inwardData.batchNumber} />
                                <DetailRow label="Condition" value={inwardData.productCondition} />
                            </div>
                            <div className="">
                                <DetailRow label="Product Name" value={inwardData.productName} />
                                <DetailRow
                                    label="Warranty Period"
                                    value={
                                        inwardData.warrantyPeriod
                                            ? inwardData.warrantyPeriod + " months"
                                            : null
                                    }
                                />
                                <DetailRow label="Quantity" value={inwardData.quantity} />
                            </div>
                        </div>
                    </div>

                    {/* Serial Numbers */}
                    {inwardData.serialNumbers?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Serial Numbers
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-100 text-left">
                                        <tr>
                                            <th className="p-2 border">TID</th>
                                            <th className="p-2 border">SID</th>
                                            <th className="p-2 border">MID</th>
                                            <th className="p-2 border">VPAID</th>
                                            <th className="p-2 border">Mobile</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inwardData.serialNumbers.map((s, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="p-2 border">{s.tid || "-"}</td>
                                                <td className="p-2 border">{s.sid || "-"}</td>
                                                <td className="p-2 border">{s.mid || "-"}</td>
                                                <td className="p-2 border">{s.vpaid || "-"}</td>
                                                <td className="p-2 border">{s.mobNumber || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Remarks */}
                    <DetailRow label="Remarks" value={inwardData.remark} />
                </div>
            </div>
        </div>
    );
};


const InwardTable = ({ data, onEdit, onView, onDelete }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [viewData, setViewData] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleView = (vendorData) => {
        setViewData(vendorData)
        setIsViewOpen(true)
    }

    const handleViewClose = () => {
        setViewData(null)
        setIsViewOpen(false)
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'invoiceNumber',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Invoice Number</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('invoiceNumber')}</div>
            ),
        },
        {
            accessorKey: 'vendorName',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Vendor Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
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
                    <span>Quantity</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div className="text-center font-semibold">{row.getValue('quantity')}</div>
            ),
        },
        {
            accessorKey: 'receivedDate',
            header: ({ column }) => (
                <button
                    className="flex items-center space-x-1 hover:text-blue-600"
                    onClick={() => column.toggleSorting()}
                >
                    <span>Received Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            ),
            cell: ({ row }) => (
                <div>{new Date(row.getValue('receivedDate')).toLocaleDateString()}</div>
            ),
        },
        {
            accessorKey: 'receivedBy',
            header: 'Received By',
        },
       
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleView(row.original)}
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
                <p className="text-gray-500">No inward entries found. Click "Add Inward Entry" to get started.</p>
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
                        placeholder="Search inward entries..."
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
            {isViewOpen && (
                <ViewInwardEntry
                    inwardData={viewData}
                    onClose={handleViewClose}
                    isOpen={isViewOpen}
                />
            )}
        </div>
    )
}

export default InwardTable