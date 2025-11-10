import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getFilteredRowModel } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Plus, Eye, RouterIcon, Users } from 'lucide-react'
import FormShimmer from '../Shimmer/FormShimmer'
import api from '../../constants/API/axiosInstance'
import { toast } from 'react-toastify'
import VendorRoutingView from '../View/VendorRoutingView '
import PageHeader from '../UI/PageHeader'
import Pagination from '../UI/Pagination'
import Table from '../UI/Table'
import TableHeader from '../UI/TableHeader'
const VendorRoutingForm = lazy(() => import('../Forms/VendorRoutingForm')) 



const VendorRoutingTable = () => {
    const [data, setData] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [selectedRouting, setSelectedRouting] = useState(null)
    const [openView, setOpenView] = useState(false)


    const [globalFilter, setGlobalFilter] = useState('');

    const fetchRoutes = async () => {
        try {
            const response = await api.get("/vendor-routing")
            
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
            cell: info => {
                const vendors = info.getValue();
                const displayVendors = vendors.slice(0, 2); // show only first 2
                const hasMore = vendors.length > 2;

                return (
                    <div className="flex flex-wrap gap-1 items-center">
                        {displayVendors.map(vendor => (
                            <span key={vendor.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {vendor.vendorName}
                            </span>
                        ))}
                        {hasMore && (
                            <span className="text-xs text-gray-500 font-medium">+{vendors.length - 2} more</span>
                        )}
                    </div>
                );
            }
        },

        {
            id: 'amountRange', // <-- changed from accessorKey to unique id
            header: 'Amount Range',
            cell: info => {
                const allVendors = info.row.original.vendorRules;
                const minAmount = Math.min(...allVendors.map(v => v.minAmount));
                const maxAmount = Math.max(...allVendors.map(v => v.maxAmount));
                return (
                    <span className="text-sm text-gray-700">
                        ₹{minAmount.toLocaleString()} - ₹{maxAmount.toLocaleString()}
                    </span>
                );
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
                        onClick={() => handleView(info.row.original)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(info.row.original)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
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
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
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

    const handleView = (routing) => {
        setSelectedRouting(routing)
        setOpenView(true)
    }


    const handleClose = () => {
        setOpenForm(false)
        setOpenView(false)
        setSelectedRouting(null)

    }

    const handleSubmit = async (formData) => {
        console.log('Form submitted:', formData);

        try {
            if (selectedRouting) {
                // ✏️ Update existing vendor routing
                await api.put(`/vendor-routing/${selectedRouting.id}`, formData);
                toast.success("Vendor routing updated successfully!");
            } else {
                // 🆕 Create new vendor routing
                await api.post("/vendor-routing", formData);
                toast.success("Vendor routing created successfully!");
            }

            handleClose();
            fetchRoutes(); // Refresh table/list after success

        } catch (error) {
            console.error("Error:", error);
            toast.error(
                error?.response?.data?.message || error?.message || "Something went wrong!"
            );
        }
    };


    return (
        <div className="p-6">
            {/* Header */}
            <PageHeader
                icon={RouterIcon}
                iconColor="text-blue-600"
                title="Vendor Routing"
                description="Manage vendor routing configurations"
                buttonText="Add Vendor Routing"
                buttonIcon={Plus}
                onButtonClick={handleAddVendorRouting}
                buttonColor="bg-blue-600 hover:bg-blue-700"
            />

            <div className="bg-white rounded-lg shadow-sm">
                <TableHeader
                    title="Vendor Routing"
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                    searchPlaceholder="Search route..."
                />


                <Table
                    table={table}
                    columns={columns}
                    emptyState={{
                        icon: <Users size={50} />,
                        message: "No routings found",
                        action: (
                            <button
                                onClick={handleAddVendorRouting}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Vendor Routing
                            </button>
                        )
                    }}
                />

                <Pagination table={table} />

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


            {openView && (
                <VendorRoutingView
                    selectedRouting={selectedRouting}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default VendorRoutingTable