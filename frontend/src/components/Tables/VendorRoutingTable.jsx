import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Plus } from 'lucide-react'
import FormShimmer from '../Shimmer/FormShimmer'
import api from '../../constants/API/axiosInstance'
import { toast } from 'react-toastify'
const VendorRoutingForm = lazy(() => import('../Forms/VendorRoutingForm')) 



const VendorRoutingTable = () => {
    const [data, setData] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [selectedRouting, setSelectedRouting] = useState(null)



    const fetchRoutes = async () => {
        try {
            const response = await api.get("/vendor-routing")
            console.table(response?.data?.content)
            setData(response?.data?.content)
        } catch (error) {
            console.error("Error", error)
            toast.error("Failed to fetch routes")
        }
    } 
    useEffect(() => {
                fetchRoutes()
                
    }, [])
    

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: info => <span className="font-medium text-gray-900">#{info.getValue()}</span>,
            size: 60
        },
        {
            accessorKey: 'productName',
            header: 'Product',
            cell: info => (
                <div>
                    <p className="font-semibold text-gray-800">{info.getValue()}</p>
                    <p className="text-xs text-gray-500">{info.row.original.productId}</p>
                </div>
            )
        },
        {
            accessorKey: 'vendorRules',
            header: 'Vendors',
            cell: info => (
                <div className="flex flex-wrap gap-1">
                    {info.getValue().map((vendor, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            {vendor.vendorName}
                        </span>
                    ))}
                </div>
            )
        },
        {
            accessorKey: 'vendorRules',
            header: 'Amount Range',
            cell: info => {
                const allVendors = info.getValue()
                const minAmount = Math.min(...allVendors.map(v => v.minAmount))
                const maxAmount = Math.max(...allVendors.map(v => v.maxAmount))
                return (
                    <span className="text-sm text-gray-700">
                        ₹{minAmount.toLocaleString()} - ₹{maxAmount.toLocaleString()}
                    </span>
                )
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: info => {
                const value = info.getValue();
                const date = new Date(value);
                const formatted = date.toLocaleString(); // e.g. "11/10/2025, 1:41:57 PM"
                return <span className="text-sm text-gray-600">{formatted}</span>;
            }
        },

        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${info.getValue() 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                    {info.getValue()? "Active" :"Inactive"}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(info.row.original)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    const handleAddVendorRouting = () => {
        setOpenForm(true)
    }

    const handleEdit = (routing) => {
        setSelectedRouting(routing)
        setOpenForm(true)
    }

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this routing?')) {
            setData(data.filter(item => item.id !== id))
        }
    }

    const handleClose = () => {
        setOpenForm(false)
        setSelectedRouting(null)
    }

    const handleSubmit = async (formData) => {
        console.log('Form submitted:', formData)
        // Add/update logic here

        
        try {
            const response = await api.post("/vendor-routing", formData)
            toast.success("Created!!")
            handleClose()
            fetchRoutes()
        } catch (error) {
            console.error("Error:", error)
            toast.error(error?.message || "Error")
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Vendor Routing</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage vendor routing configurations</p>
                </div>
                <button
                    onClick={handleAddVendorRouting}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Vendor Routing
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.vendorName} className="px-4 py-3 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Show</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[5, 10, 20, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        <span>
                            of {table.getFilteredRowModel().rows.length} entries
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span className="px-4 py-2 text-sm font-medium text-gray-700">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            

            {openForm && (
                <Suspense fallback={<FormShimmer />}>
                    <VendorRoutingForm
                        isOpen={openForm}
                        onClose={handleClose}
                        onSubmit={handleSubmit}
                        defaultValues={selectedRouting}
                    />
                </Suspense>
            )}
        </div>
    )
}

export default VendorRoutingTable