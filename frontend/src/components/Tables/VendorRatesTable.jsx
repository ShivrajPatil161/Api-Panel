import { useState, useMemo, useEffect } from 'react'
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search, Eye, Building2, CreditCard, Calendar, DollarSign, Users, Loader2, Copy } from 'lucide-react'
import VendorRateForm from '../Forms/VendorRate'
import { getAllVendorRates, createVendorRate, updateVendorRate, deleteVendorRate } from '../../constants/API/vendorRates'
import VendorRateView from '../View/VendorRateView'
import { set } from 'react-hook-form'
import StatsCard from '../UI/StatsCard';
import PageHeader from '../UI/PageHeader'
import TableHeader from '../UI/TableHeader'
import Table from '../UI/Table'
import Pagination from '../UI/Pagination'


const VendorRateList = () => {
    const [data, setData] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingData, setEditingData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [viewData, setViewData] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isReuse, setIsReuse] = useState(false)


    const columnHelper = createColumnHelper()

    const handleView = (vendorData) => {
        setViewData(vendorData)
        setIsViewOpen(true)
    }

    const handleViewClose = () => {
        setViewData(null)
        setIsViewOpen(false)
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchVendorRates()
    }, [])

    const fetchVendorRates = async () => {
        try {
            setLoading(true)
            const response = await getAllVendorRates()
            setData(response.data || response || [])
        } catch (error) {
            console.error('Error fetching vendor rates:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: info => (
                <span className="font-mono text-sm">{info.getValue()}</span>
            ),
            size: 80
        }),
        columnHelper.accessor('vendorName', {
            header: 'Vendor Name',
            cell: info => (
                <div>
                    <div className="font-medium text-gray-900">{info.getValue() || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{info.row.original.vendorId || 'N/A'}</div>
                </div>
            ),
        }),
        columnHelper.accessor('productName', {
            header: 'Product',
            cell: info => (
                <div>
                    <div className="font-medium text-gray-900">{info.getValue() || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{info.row.original.productCode || 'N/A'}</div>
                </div>
            ),
        }),
        columnHelper.accessor('monthlyRent', {
            header: 'Monthly Rent',
            cell: info => (
                <div className="font-semibold text-green-700">
                    ₹{info.getValue() ? parseFloat(info.getValue()).toLocaleString('en-IN') : 'N/A'}
                </div>
            ),
            size: 120
        }),
        columnHelper.accessor('vendorChannelRates', {
            header: 'Channel Rates',
            cell: info => {
                const rates = info.getValue() || []
                const displayRates = rates.slice(0, 2)
                const hasMore = rates.length > 2

                return (
                    <div className="space-y-1">
                        {displayRates.length > 0 ? (
                            displayRates.map((rate, index) => (
                                <div key={index} className="text-xs">
                                    <span className="text-gray-600">{rate.channelType}:</span>{' '}
                                    <span className="font-medium">{rate.rate}%</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500">No rates</span>
                        )}
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
                        {info.getValue() ? new Date(info.getValue()).toLocaleDateString('en-IN') : 'N/A'}
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
        columnHelper.accessor(row => {
            // Calculate status based on dates
            const currentDate = new Date()
            const effectiveDate = new Date(row.effectiveDate)
            const expiryDate = row.expiryDate ? new Date(row.expiryDate) : null

            if (expiryDate && currentDate > expiryDate) {
                return 'Expired'
            } else if (currentDate >= effectiveDate) {
                return 'Active'
            } else {
                return 'Pending'
            }
        }, {
            id: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue()
                let statusClass = ''

                switch (status) {
                    case 'Active':
                        statusClass = 'bg-green-100 text-green-800'
                        break
                    case 'Expired':
                        statusClass = 'bg-red-100 text-red-800'
                        break
                    case 'Pending':
                        statusClass = 'bg-yellow-100 text-yellow-800'
                        break
                    default:
                        statusClass = 'bg-gray-100 text-gray-800'
                }

                return (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
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
                        disabled={submitting}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleEdit(info.row.original)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Rate"
                        disabled={submitting}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Rate"
                        disabled={submitting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleReuse(info.row.original)}
                        className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Reuse Rates"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            ),
            size: 100
        })
    ], [submitting])

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
                pageSize: 10
            }
        }
    })

    const handleAddVendorRate = () => {
        setEditingData(null)
        setIsEdit(false)
        setIsFormOpen(true)
    }

    const handleEdit = (vendorData) => {
        setEditingData(vendorData)
        setIsEdit(true)
        setIsFormOpen(true)
    }

    const handleReuse = (vendorData) => {
        setEditingData(vendorData)
        setIsReuse(true)
        setIsFormOpen(true)
    }


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor rate?')) {
            try {
                setSubmitting(true)
                await deleteVendorRate(id)
                await fetchVendorRates() // Refresh the data
            } catch (error) {
                console.error('Error deleting vendor rate:', error)
            } finally {
                setSubmitting(false)
            }
        }
    }

    const handleFormSubmit = async (formData) => {
        try {
            setSubmitting(true)
            let success = false

            if (isEdit) {
                await updateVendorRate(editingData.id, formData)
                success = true
            } else {
                await createVendorRate(formData)
                success = true
            }

            // Only close form and refresh data on success
            if (success) {
                await fetchVendorRates() // Refresh the data
                setIsFormOpen(false)
                setEditingData(null)
                setIsEdit(false)
                setIsReuse(false)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            // Don't close the form on error - let user retry
        } finally {
            setSubmitting(false)
        }
    }

    const handleFormCancel = () => {
        setIsFormOpen(false)
        setEditingData(null)
        setIsEdit(false)
        setIsReuse(false)
    }

    // Calculate stats safely based on backend structure
    const stats = useMemo(() => {
        const totalVendors = data.length

        // Calculate status for each record
        const currentDate = new Date()
        const activeRates = data.filter(d => {
            const effectiveDate = new Date(d.effectiveDate)
            const expiryDate = d.expiryDate ? new Date(d.expiryDate) : null
            return currentDate >= effectiveDate && (!expiryDate || currentDate <= expiryDate)
        }).length

        const expiredRates = data.filter(d =>
            d.expiryDate && new Date(d.expiryDate) < currentDate
        ).length

       

        return { totalVendors, activeRates, expiredRates }
    }, [data])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading vendor rates...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pr-4">
            <div className="mx-auto">

                {/* Header */}
                <PageHeader
                icon={CreditCard}
                iconColor="text-blue-600"
                title="Vendor Rate Management"
                description="Manage vendor rates and device rental pricing"
                buttonText="Add Rate"
                buttonIcon={submitting ? Loader2 : Plus}
                onButtonClick={handleAddVendorRate}
                buttonColor="bg-blue-600 hover:bg-blue-700"
                buttonDisabled={submitting}
                />


                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    icon={Users}
                    iconColor="text-blue-600"
                    bgColor="bg-blue-100"
                    label="Total Rates"
                    value={stats.totalVendors}
                />
                
                <StatsCard
                    icon={Building2}
                    iconColor="text-green-600"
                    bgColor="bg-green-100"
                    label="Active Rates"
                    value={stats.activeRates}
                />
                
                <StatsCard
                    icon={Calendar}
                    iconColor="text-red-600"
                    bgColor="bg-red-100"
                    label="Expired Rates"
                    value={stats.expiredRates}
                />
                </div>

                {/* Table card */}
                <div className="bg-white rounded-lg shadow">
                    {/* Table Header */}
                    <TableHeader
                    title="Vendor Rate List"
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    searchPlaceholder="Search vendor rates..."
                    />

                    <Table
                    table={table}
                    columns={columns}
                    emptyState={{
                        icon: <CreditCard />,
                        message: "No vendor rates found",
                        action: <p className="text-sm text-gray-500">Get started by adding a new vendor rate.</p>
                    }}
                    />

                    <Pagination table={table} />
                </div>
            </div>
            {/* Form Modal */}
            {isFormOpen && (
                <VendorRateForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingData}
                    isEdit={isEdit}
                    isReuse={isReuse}
                    submitting={submitting}
                />
            )}
            {/* View Modal */}
            <VendorRateView
                vendorData={viewData}
                onClose={handleViewClose}
                isOpen={isViewOpen}
            />
        </div>
    )
}

export default VendorRateList