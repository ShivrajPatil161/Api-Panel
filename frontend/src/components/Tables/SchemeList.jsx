import { useState, useMemo, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table'

import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X, Copy ,DollarSign, IndianRupee, Search, Package, Users, CreditCard, Building2, IndianRupeeIcon} from 'lucide-react'

import { toast } from 'react-toastify'

import PricingSchemeFormModal from '../Forms/PricingForm'
import schemeApi from '../../constants/API/schemeApi'
import { set } from 'react-hook-form'
import StatsCard from '../UI/StatsCard'
import PageHeader from '../UI/PageHeader'
import TableHeader from '../UI/TableHeader'
import Table from '../UI/Table'
import Pagination from '../UI/Pagination'

const SchemeList = () => {
    const [schemes, setSchemes] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingScheme, setEditingScheme] = useState(null)
    const [viewingScheme, setViewingScheme] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [isReuse, setIsReuse] = useState(false) // Add this state

    // Load schemes on component mount
    useEffect(() => {
        loadSchemes()
    }, [])

    const loadSchemes = async () => {
        try {
            setLoading(true)
            const response = await schemeApi.getAllSchemes()
            setSchemes(response.data.content || response.data) // Handle paginated response
        } catch (error) {
            const errorMessage = error?.response?.data?.error || 'Failed to load pricing schemes'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

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
            accessorKey: 'productCategoryName',
            header: 'Product Category',
            cell: ({ row }) => (
                <div className="text-gray-900">
                    {row.getValue('productCategoryName')}
                </div>
            ),
        },
        // {
        //     accessorKey: 'rentalByMonth',
        //     header: 'Monthly Rental',
        //     cell: ({ row }) => (
        //         <div className="text-gray-900 font-medium">
        //             ₹{row.getValue('rentalByMonth')}
        //         </div>
        //     ),
        // },
        {
            accessorKey: 'channelRates',
            header: 'Channel Types & Rates',
            cell: ({ row }) => {
                const channelRates = row.getValue('channelRates') || []
                
                const maxVisible = 2

                return (
                    <div className="text-xs text-gray-600 max-w-xs">
                        {channelRates.slice(0, maxVisible).map((rate, index) => (
                            <div key={index} className="mb-1">
                                <span className="font-medium text-gray-800">{rate.channelName}:</span>
                               
                                    <span className="ml-1">{rate.rate}%</span>
                                
                            </div>
                        ))}
                        {channelRates.length > maxVisible && (
                            <div className="text-gray-500 italic">
                                ...and {channelRates.length - maxVisible} more
                            </div>
                        )}
                    </div>
                )
            },
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
                        onClick={() => handleDelete(row.original.id, row.original.schemeCode)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete scheme"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => handleReuse(row.original)}
                        className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Reuse scheme"
                    >
                        <Copy size={16} />
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
                pageSize: 10,
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
    const handleReuse = (scheme) => {
        setEditingScheme(scheme)
        setIsReuse(true) // Set to true for reuse mode
        setIsModalOpen(true)
    }


    const handleView = (scheme) => {
        setViewingScheme(scheme)
    }

    const handleDelete = (schemeId, schemeCode) => {
        const confirmDelete = () => {
            toast.dismiss()
            performDelete(schemeId, schemeCode)
        }

        const cancelDelete = () => {
            toast.dismiss()
        }

        toast.warn(
            <div className="flex flex-col space-y-2">
                <span>Delete "{schemeCode}"?</span>
                <div className="flex space-x-2">
                    <button
                        onClick={confirmDelete}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Delete
                    </button>
                    <button
                        onClick={cancelDelete}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        )
    }

    const performDelete = async (schemeId, schemeCode) => {
        try {
            await schemeApi.deleteScheme(schemeId)
            loadSchemes()
            toast.success(`${schemeCode} deleted successfully!`)
        } catch (error) {
            const errorMessage = error?.response?.data?.error || 'Failed to delete pricing scheme'
            toast.error(errorMessage)
        }
    }

    const handleSubmit = async (data) => {
        try {
            if (editingScheme && !isReuse) {
                await schemeApi.updateScheme(editingScheme.id, data)
                toast.success('Pricing scheme updated successfully!')
            } else {
                await schemeApi.createScheme(data)
                toast.success('Pricing scheme created successfully!')
            }
            loadSchemes()
            setIsModalOpen(false)
            setEditingScheme(null)
            setIsReuse(false) // Reset reuse state after submission
        } catch (error) {
            const errorMessage = error?.response?.data?.error ||
                (editingScheme ? 'Failed to update pricing scheme' : 'Failed to create pricing scheme')
            toast.error(errorMessage)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setEditingScheme(null)
        setIsReuse(false) // Reset reuse state on cancel
    }

    // Calculate stats
    const totalSchemes = schemes.length
    const merchantSchemes = schemes.filter(s => s.customerType === 'direct_merchant').length
    const totalRent = totalSchemes > 0
        ? Math.round(schemes.reduce((acc, s) => acc + (s.rentalByMonth || 0), 0) )
        : 0

    if (loading) {
        return (
            <div className="max-w-8xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading pricing schemes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pr-4">
            <div className="mx-auto">

                {/* Header */}
                <PageHeader
                icon={IndianRupee}
                iconColor="text-blue-600"
                title="Pricing Scheme Management"
                description="Manage pricing schemes for partners"
                buttonText="Add Scheme"
                buttonIcon={Plus}
                onButtonClick={handleCreate}
                buttonColor="bg-blue-600 hover:bg-blue-700"
                />

                {/* Stats Channels */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={Package}
                        iconColor="text-blue-600"
                        bgColor="bg-blue-100"
                        label="Total Schemes"
                        value={totalSchemes}
                    />
                    
                    <StatsCard
                        icon={Users}
                        iconColor="text-purple-600"
                        bgColor="bg-purple-100"
                        label="Partner Schemes"
                        value={merchantSchemes}
                    />
                    
                    {/* Uncomment when needed:
                    <StatsCard
                        icon={CreditChannel}
                        iconColor="text-yellow-600"
                        bgColor="bg-yellow-100"
                        label="Total Monthly Rent"
                        value={totalRent}
                        suffix="₹"
                    />
                    */}
                </div>

                {/* Table Channel */}
                <div className="bg-white rounded-lg shadow-sm">
                    <TableHeader
                        title="Pricing Schemes List"
                        searchValue={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Search schemes..."
                        disabled={loading}
                    />

                    <Table
                        table={table}
                        columns={columns}
                        emptyState={{
                            icon: <IndianRupeeIcon size={50} />,
                            message: "No pricing schemes found",
                            action: (
                            <button
                                onClick={handleCreate}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add First Scheme
                            </button>
                            )
                        }}
                    />

                    <Pagination table={table} disabled={loading} />
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PricingSchemeFormModal
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    initialData={editingScheme}
                    isEdit={!!editingScheme && !isReuse}
                    isReuse={isReuse}
                />
            )}

            {/* View Modal */}
            {viewingScheme && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
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
                               
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rental</label>
                                    <p className="text-gray-900">₹{viewingScheme.rentalByMonth}</p>
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel Types</label>
                                    <p className="text-gray-900">{viewingScheme.channelRates?.length || 0} types</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Rates</label>
                                <div className="space-y-2">
                                    {viewingScheme.channelRates?.map((rate, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span className="font-medium">{rate.channelName}</span>
                                            <div className="text-sm text-gray-600">
                                                {viewingScheme.customerType === 'franchise'
                                                    ? `Franchise: ${rate.franchiseRate}% | Merchant: ${rate.merchantRate}%`
                                                    : `Rate: ${rate.rate}%`
                                                }
                                            </div>
                                        </div>
                                    )) || <p className="text-gray-500">No channel rates configured</p>}
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