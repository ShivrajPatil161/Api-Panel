import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Store,
    MapPin,
    Package,
    Wallet,
    TrendingUp,
    Mail,
    Phone
} from 'lucide-react';

// Dummy merchant data
const merchantData = [
    {
        id: 'MER001',
        name: 'Green Valley Foods',
        businessType: 'Grocery Store',
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@greenvalley.com',
        phone: '+91-9876543210',
        location: 'Mumbai, Maharashtra',
        products: 245,
        walletBalance: 15000,
        monthlyRevenue: 85000,
        status: 'active',
        joinedDate: '2024-01-15'
    },
    {
        id: 'MER002',
        name: 'Tech Solutions Hub',
        businessType: 'Electronics',
        contactPerson: 'Priya Sharma',
        email: 'priya@techsol.com',
        phone: '+91-9876543211',
        location: 'Bangalore, Karnataka',
        products: 180,
        walletBalance: 22000,
        monthlyRevenue: 120000,
        status: 'active',
        joinedDate: '2024-02-10'
    },
    {
        id: 'MER003',
        name: 'Fashion Forward',
        businessType: 'Clothing',
        contactPerson: 'Amit Patel',
        email: 'amit@fashionforward.com',
        phone: '+91-9876543212',
        location: 'Delhi, Delhi',
        products: 320,
        walletBalance: 8500,
        monthlyRevenue: 95000,
        status: 'pending',
        joinedDate: '2024-03-05'
    },
    {
        id: 'MER004',
        name: 'Home Essentials',
        businessType: 'Home & Garden',
        contactPerson: 'Sunita Singh',
        email: 'sunita@homeessentials.com',
        phone: '+91-9876543213',
        location: 'Pune, Maharashtra',
        products: 150,
        walletBalance: 12000,
        monthlyRevenue: 65000,
        status: 'active',
        joinedDate: '2024-01-20'
    },
    {
        id: 'MER005',
        name: 'Sports Arena',
        businessType: 'Sports & Fitness',
        contactPerson: 'Vikram Joshi',
        email: 'vikram@sportsarena.com',
        phone: '+91-9876543214',
        location: 'Chennai, Tamil Nadu',
        products: 95,
        walletBalance: 18500,
        monthlyRevenue: 75000,
        status: 'inactive',
        joinedDate: '2023-12-08'
    },
    {
        id: 'MER006',
        name: 'Book Paradise',
        businessType: 'Books & Media',
        contactPerson: 'Meera Reddy',
        email: 'meera@bookparadise.com',
        phone: '+91-9876543215',
        location: 'Hyderabad, Telangana',
        products: 420,
        walletBalance: 5500,
        monthlyRevenue: 45000,
        status: 'active',
        joinedDate: '2024-02-28'
    },
    {
        id: 'MER007',
        name: 'Auto Parts Plus',
        businessType: 'Automotive',
        contactPerson: 'Ravi Gupta',
        email: 'ravi@autopartsplus.com',
        phone: '+91-9876543216',
        location: 'Jaipur, Rajasthan',
        products: 280,
        walletBalance: 25000,
        monthlyRevenue: 110000,
        status: 'active',
        joinedDate: '2024-01-03'
    },
    {
        id: 'MER008',
        name: 'Beauty Bliss',
        businessType: 'Beauty & Personal Care',
        contactPerson: 'Kavita Agarwal',
        email: 'kavita@beautybliss.com',
        phone: '+91-9876543217',
        location: 'Kolkata, West Bengal',
        products: 165,
        walletBalance: 9200,
        monthlyRevenue: 58000,
        status: 'suspended',
        joinedDate: '2023-11-15'
    },
    {
        id: 'MER009',
        name: 'Pet Care Corner',
        businessType: 'Pet Supplies',
        contactPerson: 'Arjun Menon',
        email: 'arjun@petcare.com',
        phone: '+91-9876543218',
        location: 'Kochi, Kerala',
        products: 75,
        walletBalance: 14500,
        monthlyRevenue: 42000,
        status: 'active',
        joinedDate: '2024-03-12'
    },
    {
        id: 'MER010',
        name: 'Kitchen King',
        businessType: 'Kitchenware',
        contactPerson: 'Deepak Yadav',
        email: 'deepak@kitchenking.com',
        phone: '+91-9876543219',
        location: 'Lucknow, Uttar Pradesh',
        products: 210,
        walletBalance: 11800,
        monthlyRevenue: 72000,
        status: 'active',
        joinedDate: '2024-02-14'
    },
    {
        id: 'MER011',
        name: 'Toy World',
        businessType: 'Toys & Games',
        contactPerson: 'Sneha Kulkarni',
        email: 'sneha@toyworld.com',
        phone: '+91-9876543220',
        location: 'Nashik, Maharashtra',
        products: 135,
        walletBalance: 7800,
        monthlyRevenue: 38000,
        status: 'pending',
        joinedDate: '2024-03-20'
    },
    {
        id: 'MER012',
        name: 'Fresh Fruits Co',
        businessType: 'Food & Beverages',
        contactPerson: 'Suresh Iyer',
        email: 'suresh@freshfruits.com',
        phone: '+91-9876543221',
        location: 'Coimbatore, Tamil Nadu',
        products: 85,
        walletBalance: 16200,
        monthlyRevenue: 55000,
        status: 'active',
        joinedDate: '2024-01-08'
    },
    {
        id: 'MER013',
        name: 'Digital Dreams',
        businessType: 'Computer & Software',
        contactPerson: 'Ankit Jain',
        email: 'ankit@digitaldreams.com',
        phone: '+91-9876543222',
        location: 'Indore, Madhya Pradesh',
        products: 95,
        walletBalance: 21500,
        monthlyRevenue: 98000,
        status: 'active',
        joinedDate: '2024-02-22'
    }
];

// Reusable Components
const StatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        inactive: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        suspended: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const ActionButton = ({ icon: Icon, onClick, variant = 'ghost', size = 'sm', className = '' }) => {
    const variants = {
        ghost: 'hover:bg-gray-50 text-gray-600 hover:text-gray-900',
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        danger: 'hover:bg-red-50 text-red-600 hover:text-red-700'
    };

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${variants[variant]} ${className}`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

const TableHeader = ({ title, count, searchValue, onSearchChange }) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{count} total merchants</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search merchants..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </div>
    </div>
);

const MerchantListComponent = () => {
    const [globalFilter, setGlobalFilter] = useState('');

    // Column Helper
    const columnHelper = createColumnHelper();

    // Merchant Columns
    const merchantColumns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-600">{info.getValue()}</span>
            ),
            size: 80,
        }),
        columnHelper.accessor('name', {
            header: 'Merchant Name',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Store className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{info.getValue()}</div>
                        <div className="text-sm text-gray-500">{info.row.original.businessType}</div>
                    </div>
                </div>
            ),
            size: 250,
        }),
        columnHelper.accessor('contactPerson', {
            header: 'Contact Person',
            cell: (info) => (
                <div>
                    <div className="font-medium text-gray-900">{info.getValue()}</div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{info.row.original.email}</span>
                    </div>
                </div>
            ),
            size: 200,
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{info.getValue()}</span>
                </div>
            ),
            size: 150,
        }),
        columnHelper.accessor('products', {
            header: 'Products',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{info.getValue()}</span>
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{info.getValue().toLocaleString()}</span>
                </div>
            ),
            size: 120,
        }),
        columnHelper.accessor('monthlyRevenue', {
            header: 'Monthly Revenue',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">₹{info.getValue().toLocaleString()}</span>
                </div>
            ),
            size: 130,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
            size: 100,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1">
                    <ActionButton icon={Eye} onClick={() => console.log('View', row.original.id)} />
                    <ActionButton icon={Edit} onClick={() => console.log('Edit', row.original.id)} />
                    <ActionButton icon={Trash2} onClick={() => console.log('Delete', row.original.id)} variant="danger" />
                </div>
            ),
            size: 120,
        }),
    ], [columnHelper]);

    // Table instance
    const table = useReactTable({
        data: merchantData,
        columns: merchantColumns,
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
                pageSize: 5,
            },
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <TableHeader
                    title="Merchant Management"
                    count={merchantData.length}
                    searchValue={globalFilter}
                    onSearchChange={setGlobalFilter}
                />

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
            </div>
        </div>
        </div >
    );
};

export default MerchantListComponent;