import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search, Eye, Building2, CreditCard, Calendar, DollarSign, Users } from 'lucide-react'
import VendorRateForm from '../Forms/VendorRate'
import { generateDummyData } from '../../constants/constants'


const VendorRateList = () => {
    const [data, setData] = useState(() => generateDummyData())
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingData, setEditingData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [globalFilter, setGlobalFilter] = useState('')

    const columnHelper = createColumnHelper()

    const columns = useMemo(() => [
        columnHelper.accessor('vendorId', {
            header: 'Vendor ID',
            cell: info => (
                <span className="font-mono text-sm">{info.getValue()}</span>
            ),
            size: 100
        }),
        columnHelper.accessor('vendorName', {
            header: 'Vendor Name',
            cell: info => (
                <div>
                    <div className="font-medium text-gray-900">{info.getValue()}</div>
                    <div className="text-sm text-gray-500">{info.row.original.rental.deviceType}</div>
                </div>
            ),
        }),
        columnHelper.accessor('rental.monthlyRate', {
            header: 'Monthly Rate',
            cell: info => (
                <div className="font-semibold text-green-700">₹{info.getValue()}</div>
            ),
            size: 120
        }),
        columnHelper.accessor('cardRates', {
            header: 'Card Rates',
            cell: info => {
                const rates = info.getValue()
                const displayRates = rates.slice(0, 2)
                const hasMore = rates.length > 2

                return (
                    <div className="space-y-1">
                        {displayRates.map((rate, index) => (
                            <div key={index} className="text-xs">
                                <span className="text-gray-600">{rate.cardType}:</span>{' '}
                                <span className="font-medium">{rate.rate}%</span>
                            </div>
                        ))}
                        {hasMore && (
                            <div className="text-xs text-gray-500">
                                +{rates.length - 2} more...
                            </div>
                        )}
                    </div>
                )
            },
            size: 150
        }),
        columnHelper.accessor('effectiveDate', {
            header: 'Effective Date',
            cell: info => (
                <div>
                    <div className="font-medium text-gray-900">
                        {new Date(info.getValue()).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500">
                        {info.row.original.expiryDate
                            ? `Exp: ${new Date(info.row.original.expiryDate).toLocaleDateString('en-IN')}`
                            : 'No expiry'
                        }
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue()
                return (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {status}
                    </span>
                )
            },
            size: 100
        }),
        columnHelper.display({
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
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Rate"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            size: 100
        })
    ], [])

    const table = useReactTable({
        data,
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
                pageSize: 5
            }
        }
    })

    const handleAddVendorRate = () => {
        setEditingData(null)
        setIsEdit(false)
        setIsFormOpen(true)
        console.log("jjj")
    }

    const handleEdit = (vendorData) => {
        setEditingData(vendorData)
        setIsEdit(true)
        setIsFormOpen(true)
    }

    const handleView = (vendorData) => {
        console.log('View vendor rate:', vendorData)
        alert(`Viewing details for ${vendorData.vendorName}`)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this vendor rate?')) {
            setData(prev => prev.filter(item => item.id !== id))
        }
    }

    const handleFormSubmit = (formData) => {
        if (isEdit) {
            setData(prev => prev.map(item =>
                item.id === editingData.id
                    ? { ...formData, id: editingData.id, status: item.status }
                    : item
            ))
        } else {
            const newData = {
                ...formData,
                id: Math.max(...data.map(d => d.id)) + 1,
                status: 'Active'
            }
            setData(prev => [...prev, newData])
        }
        setIsFormOpen(false)
        setEditingData(null)
    }

    const handleFormCancel = () => {
        setIsFormOpen(false)
        setEditingData(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Vendor Rate Management</h1>
                                <p className="text-gray-600">Manage vendor rates and device rental pricing</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddVendorRate}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Rate</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Rates</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.filter(d => d.status === 'Active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Expired Rates</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date()).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg Monthly Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{(data.reduce((sum, d) => sum + parseFloat(d.rental.monthlyRate), 0) / data.length).toFixed(0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-lg shadow">
                    {/* Table Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Vendor Rate List</h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Search vendor rates..."
                                    />
                                </div>
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

                    {/* Pagination */}
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
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <VendorRateForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingData}
                    isEdit={isEdit}
                />
            )}
        </div>
    )
}

export default VendorRateList