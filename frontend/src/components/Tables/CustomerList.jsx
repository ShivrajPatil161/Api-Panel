import React, { useState, useEffect, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Store,
    Wallet,
    Package,
    MapPin,
    TrendingUp,
    AlertCircle,
    X,
    Download,
    FileText,
    Image as ImageIcon,
    Handshake,
    Calendar
} from 'lucide-react'
import { toast } from 'react-toastify'

// Import API functions
import { 
    apiPartnerApi, 
    fileApi, 
    handleApiError 
} from '../../constants/API/customerApi'
import CustomerOnboarding from '../Forms/CustomerOnboarding/CustomerOnborading'

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

const ActionButton = ({ icon: Icon, onClick, variant = 'ghost', size = 'sm', className = '' }) => {
    const variants = {
        ghost: 'hover:bg-green-100 text-green-600 hover:text-green-900',
        primary: 'text-blue-700 hover:bg-blue-100',
        danger: 'hover:bg-red-50 text-red-600 hover:text-red-700'
    }

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
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

// Document Preview Component
const DocumentPreview = ({ documentPath, documentName, onClose }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blobUrl, setBlobUrl] = useState(null)

    const cleanPath = documentPath
        ?.replace(/\\\\/g, '/')
        ?.replace(/\\/g, '/')
        ?.replace(/^\/+/, '')

    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(cleanPath || '')
    const isPdf = /\.pdf$/i.test(cleanPath || '')
    const filename = cleanPath?.split('/').pop()

    useEffect(() => {
        if (!cleanPath) return

        const fetchFile = async () => {
            try {
                setLoading(true)
                const response = await fileApi.getFile(cleanPath)
                const blob = response.data
                const url = window.URL.createObjectURL(blob)
                setBlobUrl(url)
                setLoading(false)
            } catch (error) {
                console.error('File fetch error:', error)
                const errorInfo = handleApiError(error, 'Failed to load document')
                setError(errorInfo.message)
                setLoading(false)
            }
        }

        fetchFile()

        return () => {
            if (blobUrl) {
                window.URL.revokeObjectURL(blobUrl)
            }
        }
    }, [cleanPath])

    const handleDownload = async () => {
        try {
            const response = await fileApi.downloadFile(cleanPath)
            const blob = response.data
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            const errorInfo = handleApiError(error, 'Download failed')
            toast.error(errorInfo.message)
        }
    }

    if (!cleanPath) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Document Not Found</h3>
                    <p className="text-gray-600 mb-4">The document path is invalid or missing.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Close
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold">{documentName}</h3>
                        <p className="text-sm text-gray-500">{filename}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleDownload} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Download">
                            <Download className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Close">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {loading && (
                        <div className="flex items-center justify-center h-64">
                            <span className="text-gray-600">Loading document...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <h4 className="text-lg font-semibold mb-2">Error Loading Document</h4>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Try Download
                            </button>
                        </div>
                    )}

                    {isImage && !error && blobUrl && (
                        <div className="flex justify-center">
                            <img
                                src={blobUrl}
                                alt={documentName}
                                className="max-w-full h-auto rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {isPdf && !error && blobUrl && (
                        <iframe
                            src={`${blobUrl}#toolbar=1`}
                            className="w-full h-[600px] border-0 rounded-lg shadow-lg"
                            title={documentName}
                        />
                    )}

                    {!isImage && !isPdf && !error && !loading && (
                        <div className="text-center py-8">
                            <h4 className="text-lg font-semibold mb-2">Preview Not Available</h4>
                            <p className="text-gray-600 mb-4">This document type cannot be previewed. You can download it to view.</p>
                            <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Download Document
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// View Modal Component
const ViewModal = ({ apiPartner, onClose }) => {
    const [documents, setDocuments] = useState({})

    useEffect(() => {
        if (apiPartner?.uploadDocuments) {
            setDocuments(apiPartner.uploadDocuments)
        }
    }, [apiPartner])

    const DocumentItem = ({ docKey, docPath, docName }) => {
        const [previewDoc, setPreviewDoc] = useState(null)

        if (!docPath) return null

        const getDocumentIcon = () => {
            if (docPath.includes('.pdf')) return <FileText className="w-5 h-5 text-red-500" />
            if (docPath.includes('.jpg') || docPath.includes('.jpeg') || docPath.includes('.png')) {
                return <ImageIcon className="w-5 h-5 text-blue-500" />
            }
            return <FileText className="w-5 h-5 text-gray-500" />
        }

        return (
            <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        {getDocumentIcon()}
                        <span className="text-sm font-medium">{docName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPreviewDoc({ path: docPath, name: docName })}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Preview
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const cleanPath = docPath?.replace(/\\\\/g, '/')?.replace(/\\/g, '/')?.replace(/^\/+/, '')
                                    const response = await fileApi.downloadFile(cleanPath)
                                    const blob = response.data
                                    const url = window.URL.createObjectURL(blob)
                                    const link = document.createElement('a')
                                    link.href = url
                                    link.download = cleanPath?.split('/').pop() || 'download'
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                    window.URL.revokeObjectURL(url)
                                } catch (error) {
                                    const errorInfo = handleApiError(error, 'Download failed')
                                    toast.error(errorInfo.message)
                                }
                            }}
                            className="text-green-600 hover:text-green-800 text-sm"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {previewDoc && (
                    <DocumentPreview
                        documentPath={previewDoc.path}
                        documentName={previewDoc.name}
                        onClose={() => setPreviewDoc(null)}
                    />
                )}
            </>
        )
    }

    if (!apiPartner) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">API Partner Details</h2>
                        <p className="text-gray-600">{apiPartner?.businessName || 'N/A'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-3">Basic Information</h3>
                            <div className="space-y-2">
                                <div><strong>Business Name:</strong> {apiPartner?.businessName || 'N/A'}</div>
                                <div><strong>Legal Name:</strong> {apiPartner?.legalName || 'N/A'}</div>
                                <div><strong>Business Type:</strong> {apiPartner?.businessType || 'N/A'}</div>
                                <div><strong>GST Number:</strong> {apiPartner?.gstNumber || 'N/A'}</div>
                                <div><strong>PAN Number:</strong> {apiPartner?.panNumber || 'N/A'}</div>
                                <div><strong>Registration Number:</strong> {apiPartner?.registrationNumber || 'N/A'}</div>
                                <div><strong>Status:</strong> <StatusBadge status={apiPartner?.status || 'active'} /></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Contact Information</h3>
                            <div className="space-y-2">
                                <div><strong>Contact Person:</strong> {apiPartner?.contactPerson?.name || apiPartner?.contactPersonName || 'N/A'}</div>
                                <div><strong>Mobile:</strong> {apiPartner?.contactPerson?.phoneNumber || apiPartner?.contactPersonPhone || 'N/A'}</div>
                                <div><strong>Email:</strong> {apiPartner?.contactPerson?.email || apiPartner?.contactPersonEmail || 'N/A'}</div>
                                <div><strong>Alternate Mobile:</strong> {apiPartner?.contactPerson?.alternatePhoneNum || apiPartner?.alternatePhoneNum || 'N/A'}</div>
                                <div><strong>Landline:</strong> {apiPartner?.contactPerson?.landlineNumber || apiPartner?.landlineNumber || 'N/A'}</div>
                                <div><strong>Address:</strong> {apiPartner?.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Bank Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Bank Name:</strong> {apiPartner?.bankDetails?.bankName || 'N/A'}</div>
                            <div><strong>Account Holder:</strong> {apiPartner?.bankDetails?.accountHolderName || 'N/A'}</div>
                            <div><strong>Account Number:</strong> {apiPartner?.bankDetails?.accountNumber || 'N/A'}</div>
                            <div><strong>IFSC Code:</strong> {apiPartner?.bankDetails?.ifsc || 'N/A'}</div>
                            <div><strong>Branch:</strong> {apiPartner?.bankDetails?.branchName || 'N/A'}</div>
                            <div><strong>Account Type:</strong> {apiPartner?.bankDetails?.accountType || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <h3 className="font-semibold mb-3">Documents</h3>
                        <div className="space-y-3">
                            <DocumentItem docKey="panProof" docPath={documents.panProof} docName="PAN Card" />
                            <DocumentItem docKey="gstCertificateProof" docPath={documents.gstCertificateProof} docName="GST Certificate" />
                            <DocumentItem docKey="addressProof" docPath={documents.addressProof} docName="Address Proof" />
                            <DocumentItem docKey="bankAccountProof" docPath={documents.bankAccountProof} docName="Bank Account Proof" />
                            <DocumentItem docKey="adharProof" docPath={documents.adharProof} docName="Aadhar Proof" />
                            <DocumentItem docKey="other1" docPath={documents.other1} docName="Other Document 1" />
                            <DocumentItem docKey="other2" docPath={documents.other2} docName="Other Document 2" />
                            <DocumentItem docKey="other3" docPath={documents.other3} docName="Other Document 3" />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <Wallet className="w-8 h-8 mx-auto text-green-600 mb-2" />
                            <div className="text-sm text-gray-600">Wallet Balance</div>
                            <div className="font-semibold">₹{(apiPartner?.walletBalance || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                            <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                            <div className="text-sm text-gray-600">Monthly Revenue</div>
                            <div className="font-semibold">₹{(apiPartner?.monthlyRevenue || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                            <Calendar className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                            <div className="text-sm text-gray-600">Created On</div>
                            <div className="font-semibold">
                                {apiPartner?.createdAt ? new Date(apiPartner.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main API Partner List Component
const ApiPartnerListComponent = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [expanded, setExpanded] = useState({})
    const [apiPartners, setApiPartners] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [viewModal, setViewModal] = useState(null)
    const [editModal, setEditModal] = useState(null)
    const [documentPreview, setDocumentPreview] = useState(null)

    const columnHelper = createColumnHelper()

    // Replace the fetchApiPartners function with this:

const fetchApiPartners = async () => {
    try {
        setLoading(true)
        setError(null)
        const response = await apiPartnerApi.getAll() // Changed from getAllDirect()
        setApiPartners(response.data)
    } catch (err) {
        const errorInfo = handleApiError(err, 'Failed to load API partners')
        setError(errorInfo.message)
        toast.error(errorInfo.message)
    } finally {
        setLoading(false)
    }
}

    const fetchApiPartnerDetails = async (id) => {
        try {
            const response = await apiPartnerApi.getDetails(id)
            setViewModal({ apiPartner: response.data })
        } catch (err) {
            const errorInfo = handleApiError(err, 'Failed to load API partner details')
            toast.error(errorInfo.message)
        }
    }

    const handleEditApiPartner = async (id) => {
        try {
            setLoading(true)
            const response = await apiPartnerApi.getDetails(id)
            const apiPartnerData = response.data.apiPartner || response.data

            setEditModal({
                apiPartner: apiPartnerData,
                apiPartnerId: id
            })
        } catch (err) {
            const errorInfo = handleApiError(err, 'Failed to load API partner data for editing')
            toast.error(errorInfo.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteApiPartner = async (id) => {
        if (window.confirm('Are you sure you want to delete this API partner?')) {
            try {
                await apiPartnerApi.delete(id)
                toast.success('API Partner deleted successfully')
                fetchApiPartners()
            } catch (err) {
                const errorInfo = handleApiError(err, 'Failed to delete API partner')
                toast.error(errorInfo.message)
            }
        }
    }

    const handleEditSuccess = () => {
        setEditModal(null)
        fetchApiPartners()
    }

    const handleDocumentPreview = (filePath, documentName) => {
        setDocumentPreview({ documentPath: filePath, documentName })
    }

    useEffect(() => {
        fetchApiPartners()
    }, [])

    // API Partner Columns
    const apiPartnerColumns = useMemo(() => [
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
        columnHelper.accessor('monthlyRevenue', {
            header: 'Monthly Revenue',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
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
                        onClick={() => fetchApiPartnerDetails(row.original.id)}
                        variant="primary"
                    />
                    <ActionButton
                        icon={Edit}
                        onClick={() => handleEditApiPartner(row.original.id)}
                        variant="ghost"
                    />
                    <ActionButton
                        icon={Trash2}
                        onClick={() => handleDeleteApiPartner(row.original.id)}
                        variant="danger"
                    />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper])

    // Table instance
    const table = useReactTable({
        data: apiPartners,
        columns: apiPartnerColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            globalFilter,
            expanded,
        },
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    const TableHeader = ({ title, count }) => (
        <div className="flex items-center justify-between mb-4">
            <div className='flex items-center'>
                <Handshake className='text-blue-600 mr-3' size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 mt-1">{count} total API partners</p>
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
    )

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchApiPartners}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto">
                {/* Header */}
                <TableHeader
                    title="API Partner Management"
                    count={apiPartners.length}
                />

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
                                            <tr key={row.id} className="hover:bg-gray-50">
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
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {'<<'}
                                        </button>
                                        <button
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {'>'}
                                        </button>
                                        <button
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <CustomerOnboarding
                                    isModal={true}
                                    isEditMode={true}
                                    customerData={editModal.apiPartner}
                                    customerId={editModal.apiPartnerId}
                                    onClose={() => setEditModal(null)}
                                    onSuccess={handleEditSuccess}
                                    customerType="apiPartner"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Preview Modal */}
                {documentPreview && (
                    <DocumentPreview
                        documentPath={documentPreview.documentPath}
                        documentName={documentPreview.documentName}
                        onClose={() => setDocumentPreview(null)}
                    />
                )}

                {/* View Modal */}
                {viewModal && (
                    <ViewModal
                        apiPartner={viewModal.apiPartner}
                        onClose={() => setViewModal(null)}
                    />
                )}
            </div>
        </div>
    )
}

export default ApiPartnerListComponent
export { DocumentPreview }