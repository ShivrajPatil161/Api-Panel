import { useState, useMemo, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table'
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'
import ProductAssignmentFormModal from '../Forms/ProductSchemeAssignmen'
import api from '../../constants/API/axiosInstance'



// ==================== PRODUCT ASSIGNMENT LIST ====================
const ProductAssignment = () => {
    const [assignments, setAssignments] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [viewingAssignment, setViewingAssignment] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    useEffect(() => {
        fetchProductSchemeAssignment()
    },[])

    const fetchProductSchemeAssignment = async () => {
        const response = await api.get("/outward-schemes")
        setAssignments(response?.data)
    }

    const getProductLabel = (product) => {
        const productMap = {
            'pos_machine': 'POS Machine',
            'soundbox': 'Soundbox',
            'qr_scanner': 'QR Scanner',
            'card_reader': 'Card Reader'
        }
        return productMap[product] || product
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'assignedTo',
            header: 'Assigned To',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">
                    {row.getValue('assignedTo')}
                </div>
            ),
        },
        {
            accessorKey: 'assignedType',
            header: 'Type',
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.getValue('assignedType') === 'franchise'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {row.getValue('assignedType') === 'franchise' ? 'Franchise' : 'Merchant'}
                </span>
            ),
        },
        {
            accessorKey: 'product',
            header: 'Product',
            cell: ({ row }) => (
                <div className="text-gray-900 font-medium">
                    {getProductLabel(row.getValue('product'))}
                </div>
            ),
        },
        {
            accessorKey: 'scheme',
            header: 'Scheme',
            cell: ({ row }) => (
                <div className="text-gray-900 font-mono text-sm">
                    {row.getValue('scheme')}
                </div>
            ),
        },
        {
            accessorKey: 'effectiveDate',
            header: 'Effective Date',
            cell: ({ row }) => (
                <div className="text-gray-600">
                    {new Date(row.getValue('effectiveDate')).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks',
            cell: ({ row }) => (
                <div className="text-gray-600 max-w-xs truncate">
                    {row.getValue('remarks')}
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
                        title="Edit assignment"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete assignment"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], [])

    const table = useReactTable({
        data: assignments,
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
        setEditingAssignment(null)
        setIsModalOpen(true)
    }

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment)
        setIsModalOpen(true)
    }

    const handleView = (assignment) => {
        setViewingAssignment(assignment)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product assignment?')) {
            setAssignments(assignments.filter(assignment => assignment.id !== id))
        }
    }

    const handleSubmit = (data) => {
        if (editingAssignment) {
            setAssignments(assignments.map(assignment =>
                assignment.id === editingAssignment.id
                    ? { ...data, id: editingAssignment.id }
                    : assignment
            ))
        } else {
            setAssignments([...assignments, { ...data, id: Date.now() }])
        }
        setIsModalOpen(false)
        setEditingAssignment(null)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setEditingAssignment(null)
    }

    return (
        <div className="max-w-8xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="bg-white text-black p-6 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Product Assignments</h1>
                            <p className="text-black mt-2">Manage product assignments for franchises and merchants</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Assignment
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
                                placeholder="Search assignments..."
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            Total: {assignments.length} assignments
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <ProductAssignmentFormModal
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    initialData={editingAssignment}
                    isEdit={!!editingAssignment}
                />
            )}

            {/* View Modal */}
            {viewingAssignment && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-2xl font-bold text-gray-800">Assignment Details</h2>
                            <button
                                onClick={() => setViewingAssignment(null)}
                                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                    <p className="text-gray-900">{viewingAssignment.assignedTo}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <p className="text-gray-900 capitalize">{viewingAssignment.assignedType}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <p className="text-gray-900">{getProductLabel(viewingAssignment.product)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Scheme</label>
                                    <p className="text-gray-900">{viewingAssignment.scheme}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                    <p className="text-gray-900">{new Date(viewingAssignment.effectiveDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {viewingAssignment.remarks && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <p className="text-gray-900">{viewingAssignment.remarks}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductAssignment