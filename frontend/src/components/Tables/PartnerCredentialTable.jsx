import React, { useState, useMemo } from 'react'
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
    Key,
    Plus,
    AlertCircle,
    X,
    Shield,
    Globe,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { toast } from 'react-toastify'
import PartnerCredentialForm from '../Forms/PartnerCredentialForm'
import PartnerCredentialView from '../View/PartnerCredentialView'
import PageHeader from '../UI/PageHeader'
import TableHeader from '../UI/TableHeader'
import Table from '../UI/Table'
import Pagination from '../UI/Pagination'

// Mock data - Replace with API call later
const mockCredentials = [
    {
        id: 1,
        partner: 'partner1',
        partnerName: 'Partner 1',
        product: 'recharge',
        productName: 'Recharge',
        tokenUrlUat: 'https://uat.partner1.com/token',
        tokenUrlProd: 'https://prod.partner1.com/token',
        baseUrlUat: 'https://uat.partner1.com/api',
        baseUrlProd: 'https://prod.partner1.com/api',
        clientId: 'CLIENT_123',
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
    },
    {
        id: 2,
        partner: 'partner2',
        partnerName: 'Partner 2',
        product: 'bill_payment',
        productName: 'Bill Payment',
        tokenUrlUat: 'https://uat.partner2.com/token',
        tokenUrlProd: 'https://prod.partner2.com/token',
        baseUrlUat: 'https://uat.partner2.com/api',
        baseUrlProd: 'https://prod.partner2.com/api',
        clientId: 'CLIENT_456',
        isActive: false,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18'
    },
    {
        id: 3,
        partner: 'partner3',
        partnerName: 'Partner 3',
        product: 'dth',
        productName: 'DTH',
        tokenUrlUat: 'https://uat.partner3.com/token',
        tokenUrlProd: 'https://prod.partner3.com/token',
        baseUrlUat: 'https://uat.partner3.com/api',
        baseUrlProd: 'https://prod.partner3.com/api',
        clientId: 'CLIENT_789',
        isActive: true,
        createdAt: '2024-01-12',
        updatedAt: '2024-01-22'
    }
]

// Utility Components
const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
        {isActive ? (
            <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
            </>
        ) : (
            <>
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
            </>
        )}
    </span>
)

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



// Main Table Component
const PartnerCredentialTable = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [credentials, setCredentials] = useState(mockCredentials)
    const [loading, setLoading] = useState(false)
    const [viewModal, setViewModal] = useState(null)
    const [editModal, setEditModal] = useState(null)
    const [addModal, setAddModal] = useState(false)

    const columnHelper = createColumnHelper()

    // API Functions - Ready for backend integration
    const fetchCredentials = async () => {
        try {
            setLoading(true)
            // TODO: Replace with actual API call
            // const response = await api.get('/partner-credentials')
            // setCredentials(response.data)

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            setCredentials(mockCredentials)
        } catch (err) {
            toast.error('Failed to load credentials')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleView = (credential) => {
        setViewModal(credential)
    }

    const handleEdit = (credential) => {
        setEditModal(credential)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this credential?')) {
            try {
                // TODO: Replace with actual API call
                // await api.delete(`/partner-credentials/${id}`)

                setCredentials(credentials.filter(c => c.id !== id))
                toast.success('Credential deleted successfully')
            } catch (err) {
                toast.error('Failed to delete credential')
                console.error(err)
            }
        }
    }

    const handleSubmit = async (data) => {
        try {
            if (editModal) {
                // TODO: Replace with actual API call
                // await api.put(`/partner-credentials/${editModal.id}`, data)

                setCredentials(credentials.map(c =>
                    c.id === editModal.id
                        ? { ...c, ...data, updatedAt: new Date().toISOString().split('T')[0] }
                        : c
                ))
                toast.success('Credential updated successfully')
                setEditModal(null)
            } else {
                // TODO: Replace with actual API call
                // const response = await api.post('/partner-credentials', data)

                const newCredential = {
                    id: credentials.length + 1,
                    ...data,
                    partnerName: `Partner ${data.partner}`,
                    productName: data.product.replace('_', ' ').toUpperCase(),
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0]
                }
                setCredentials([...credentials, newCredential])
                toast.success('Credential created successfully')
                setAddModal(false)
            }
        } catch (err) {
            toast.error('Failed to save credential')
            console.error(err)
        }
    }

    // Table columns
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">#{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor('partnerName', {
            header: 'Partner',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Key className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.productName}</div>
                    </div>
                </div>
            ),
            size: 200,
        }),
        columnHelper.accessor('clientId', {
            header: 'Client ID',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-sm text-gray-600">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('baseUrlProd', {
            header: 'Production URL',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate max-w-xs">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: (info) => <StatusBadge isActive={info.getValue()} />,
            size: 100,
        }),
        columnHelper.accessor('updatedAt', {
            header: 'Last Updated',
            cell: (info) => (
                <span className="text-sm text-gray-600">{info.getValue()}</span>
            ),
            size: 120,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton
                        icon={Eye}
                        onClick={() => handleView(row.original)}
                        variant="primary"
                    />
                    <ActionButton
                        icon={Edit}
                        onClick={() => handleEdit(row.original)}
                        variant="ghost"
                    />
                    <ActionButton
                        icon={Trash2}
                        onClick={() => handleDelete(row.original.id)}
                        variant="danger"
                    />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper, credentials])

    // Table instance
    const table = useReactTable({
        data: credentials,
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

    return (
        <div className="min-h-screen bg-gray-50 p-2 pr-5">
            <div className="mx-auto">
                <div className="">
                    <PageHeader
                        icon={Key}
                        iconColor="text-blue-600"
                        title="Partner Credentials"
                        description={`${credentials.length} total credentials`}
                        buttonText="Add Credential"
                        buttonIcon={Plus}
                        onButtonClick={() => setAddModal(true)}
                        buttonColor="bg-blue-600 hover:bg-blue-700"
                    />
                    
                    <TableHeader
                        searchValue={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Search credentials..."
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Table
                                table={table}
                                columns={columns}
                                emptyState={{
                                    icon: <Key className="h-12 w-12" />,
                                    message: "No credentials found",
                                    action: null
                                }}
                                sortable={true}
                                hoverable={true}
                            />
                            <Pagination table={table} />
                        </>
                    )}
                </div>

                {/* Add Modal */}
                {addModal && (
                    <PartnerCredentialForm
                        isOpen={addModal}
                        onClose={() => setAddModal(false)}
                        onSubmit={handleSubmit}
                        mode="create"
                    />
                )}

                {/* Edit Modal */}
                {editModal && (
                    <PartnerCredentialForm
                        isOpen={!!editModal}
                        onClose={() => setEditModal(null)}
                        onSubmit={handleSubmit}
                        initialData={editModal}
                        mode="edit"
                    />
                )}

                {/* View Modal */}
                {viewModal && (
                    <PartnerCredentialView
                        credential={viewModal}
                        onClose={() => setViewModal(null)}
                    />
                )}
            </div>
        </div>
    )
}

export default PartnerCredentialTable