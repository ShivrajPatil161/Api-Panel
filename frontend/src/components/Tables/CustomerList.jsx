import React, { useState, useEffect, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Wallet,
    Package,
    MapPin,
    AlertCircle,
    X,
    Handshake,
} from 'lucide-react'
import { toast } from 'react-toastify'

// Import API functions
import { 
    apiPartnerApi, 
    handleApiError 
} from '../../constants/API/customerApi'
import CustomerOnboarding from '../Forms/CustomerOnboarding/CustomerOnborading'
import PartnerView from '../View/PartnerView'

// Utility Components
const StatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        suspended: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
    )
}

const ActionButton = ({ icon: Icon, onClick, variant = 'ghost', className = '' }) => {
    const variants = {
        ghost: 'hover:bg-green-100 text-green-600 hover:text-green-900',
        primary: 'text-blue-700 hover:bg-blue-100',
        danger: 'hover:bg-red-50 text-red-600 hover:text-red-700'
    }

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
            aria-label={Icon.name}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
)

const ErrorDisplay = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
)

// Main API Partner List Component
const ApiPartnerList = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [viewModal, setViewModal] = useState(null)
    const [editModal, setEditModal] = useState(null)

    const columnHelper = createColumnHelper()

    // Fetch all API partners
    const fetchPartners = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await apiPartnerApi.getAll()
            setPartners(response.data)
        } catch (err) {
            const errorInfo = handleApiError(err, 'Failed to load API partners')
            setError(errorInfo.message)
            toast.error(errorInfo.message)
        } finally {
            setLoading(false)
        }
    }

    // Fetch single partner details for viewing
    const handleViewPartner = async (id) => {
        try {
            const response = await apiPartnerApi.getById(id)
            setViewModal({ apiPartner: response.data })
        } catch (err) {
            const errorInfo = handleApiError(err, 'Failed to load partner details')
            toast.error(errorInfo.message)
        }
    }

    // Fetch single partner data for editing
    const handleEditPartner = async (id) => {
        try {
            setLoading(true)
            const response = await apiPartnerApi.getById(id)
            const partnerData = response.data.apiPartner || response.data

            setEditModal({
                apiPartner: partnerData,
                apiPartnerId: id
            })
        } catch (err) {
            const errorInfo = handleApiError(err, 'Failed to load partner data for editing')
            toast.error(errorInfo.message)
        } finally {
            setLoading(false)
        }
    }

    // Delete partner
    const handleDeletePartner = async (id) => {
        if (window.confirm('Are you sure you want to delete this API partner?')) {
            try {
                await apiPartnerApi.delete(id)
                toast.success('API Partner deleted successfully')
                fetchPartners()
            } catch (err) {
                const errorInfo = handleApiError(err, 'Failed to delete API partner')
                toast.error(errorInfo.message)
            }
        }
    }

    // Handle edit success - close modal and refresh list
    const handleEditSuccess = () => {
        setEditModal(null)
        fetchPartners()
    }

    // Initial data load
    useEffect(() => {
        fetchPartners()
    }, [])

    // Table columns definition
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">#{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor('businessName', {
            header: 'Business Name',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Handshake className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.businessType}</div>
                    </div>
                </div>
            ),
            size: 250,
        }),
        columnHelper.accessor('address', {
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
                    <span className="font-medium">{info.getValue() || 0}</span>
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{(info.getValue() || 0).toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue() || 'active'} />,
            size: 100,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton
                        icon={Eye}
                        onClick={() => handleViewPartner(row.original.id)}
                        variant="primary"
                    />
                    <ActionButton
                        icon={Edit}
                        onClick={() => handleEditPartner(row.original.id)}
                        variant="ghost"
                    />
                    <ActionButton
                        icon={Trash2}
                        onClick={() => handleDeletePartner(row.original.id)}
                        variant="danger"
                    />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper])

    // Table instance
    const table = useReactTable({
        data: partners,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    // Error state
    if (error) {
        return <ErrorDisplay error={error} onRetry={fetchPartners} />
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className='flex items-center'>
                        <Handshake className='text-blue-600 mr-3' size={32} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">API Partner Management</h2>
                            <p className="text-gray-600 mt-1">{partners.length} total API partners</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search API partners..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
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
                                            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {'<<'}
                                        </button>
                                        <button
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {'>'}
                                        </button>
                                        <button
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {'>>'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Edit Modal */}
                {editModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Edit API Partner</h2>
                                    <button
                                        onClick={() => setEditModal(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <CustomerOnboarding
                                    isModal={true}
                                    isEditMode={true}
                                    partnerData={editModal.apiPartner}
                                    partnerId={editModal.apiPartnerId}
                                    onClose={() => setEditModal(null)}
                                    onSuccess={handleEditSuccess}
                                    
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModal && (
                    <PartnerView
                        apiPartner={viewModal.apiPartner}
                        onClose={() => setViewModal(null)}
                    />
                )}
            </div>
        </div>
    )
}

export default ApiPartnerList