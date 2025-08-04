import { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table'
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

import { schemeList } from '../../constants/constants'
import PricingSchemeFormModal from '../Forms/PricingForm'

const SchemeList = () => {
    const [schemes, setSchemes] = useState(schemeList)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingScheme, setEditingScheme] = useState(null)
    const [viewingScheme, setViewingScheme] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    const columns = useMemo(() => [
        {
            accessorKey: 'schemeCode',
            header: 'Scheme Code',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">
                    {row.getValue('schemeCode')}
                </div>
            ),
        },
        {
            accessorKey: 'customerType',
            header: 'Customer Type',
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.getValue('customerType') === 'franchise'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {row.getValue('customerType') === 'franchise' ? 'Franchise' : 'Direct Merchant'}
                </span>
            ),
        },
        {
            accessorKey: 'rentalByMonth',
            header: 'Monthly Rental',
            cell: ({ row }) => (
                <div className="text-gray-900 font-medium">
                    ₹{row.getValue('rentalByMonth')}
                </div>
            ),
        },
        {
            accessorKey: 'cardRates',
            header: 'Card Types',
            cell: ({ row }) => (
                <div className="text-gray-600">
                    {row.getValue('cardRates').length} types
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <div className="text-gray-600 max-w-xs truncate">
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleView(row.original)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit scheme"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete scheme"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], [])

    const table = useReactTable({
        data: schemes,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    const handleCreate = () => {
        setEditingScheme(null)
        setIsModalOpen(true)
    }

    const handleEdit = (scheme) => {
        setEditingScheme(scheme)
        setIsModalOpen(true)
    }

    const handleView = (scheme) => {
        setViewingScheme(scheme)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this pricing scheme?')) {
            setSchemes(schemes.filter(scheme => scheme.id !== id))
        }
    }

    const handleSubmit = (data) => {
        if (editingScheme) {
            setSchemes(schemes.map(scheme =>
                scheme.id === editingScheme.id
                    ? { ...data, id: editingScheme.id }
                    : scheme
            ))
        } else {
            setSchemes([...schemes, { ...data, id: Date.now() }])
        }
        setIsModalOpen(false)
        setEditingScheme(null)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setEditingScheme(null)
    }

    return (
        <div className="max-w-8xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="bg- text-black p-6 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Pricing Schemes</h1>
                            <p className="text-black mt-2">Manage pricing schemes for franchises and direct merchants</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create New Scheme
                        </button>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <input
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search schemes..."
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            Total: {schemes.length} schemes
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <span className="text-blue-600">
                                                        {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="text-sm text-gray-600">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PricingSchemeFormModal
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    initialData={editingScheme}
                    isEdit={!!editingScheme}
                />
            )}

            {/* View Modal */}
            {viewingScheme && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-2xl font-bold text-gray-800">Scheme Details</h2>
                            <button
                                onClick={() => setViewingScheme(null)}
                                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Code</label>
                                    <p className="text-gray-900">{viewingScheme.schemeCode}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                                    <p className="text-gray-900 capitalize">{viewingScheme.customerType.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental</label>
                                    <p className="text-gray-900">₹{viewingScheme.rentalByMonth}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Types</label>
                                    <p className="text-gray-900">{viewingScheme.cardRates.length} types</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Rates</label>
                                <div className="space-y-2">
                                    {viewingScheme.cardRates.map((rate, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span className="font-medium">{rate.cardName}</span>
                                            <div className="text-sm text-gray-600">
                                                {viewingScheme.customerType === 'franchise'
                                                    ? `Franchise: ${rate.franchiseRate}% | Merchant: ${rate.merchantRate}%`
                                                    : `Rate: ${rate.rate}%`
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {viewingScheme.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <p className="text-gray-900">{viewingScheme.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SchemeList