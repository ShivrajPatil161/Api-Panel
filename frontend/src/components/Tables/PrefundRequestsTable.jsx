import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import api from '../../constants/API/axiosInstance';
import PrefundRequestForm from '../Forms/PrefundRequestForm'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Table component to display partner's prefund requests
 * Includes pagination and modal for new requests
 */
const PrefundRequestsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');

    // Fetch requests
    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/prefund-auth/my-requests');
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Handle successful form submission
    const handleRequestSuccess = () => {
        fetchRequests();
    };

    // Table columns
    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'createDateTime',
            header: 'Created Date',
            cell: (info) => {
                const date = new Date(info.getValue());
                return date.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            },
        },
        {
            accessorKey: 'depositAmount',
            header: 'Amount',
            cell: (info) => `₹${info.getValue()?.toFixed(2)}`,
        },
        {
            accessorKey: 'bankAccountNumber',
            header: 'Account Number',
        },
        {
            accessorKey: 'bankTranId',
            header: 'Transaction ID',
        },
        {
            accessorKey: 'paymentMode',
            header: 'Payment Mode',
        },
        {
            accessorKey: 'depositType',
            header: 'Deposit Type',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const status = info.getValue();
                let colorClass = '';
                if (status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-800';
                else if (status === 'APPROVED')
                    colorClass = 'bg-green-100 text-green-800';
                else if (status === 'REJECTED') colorClass = 'bg-red-100 text-red-800';

                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks',
        },
    ];

    // Initialize table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        My Prefund Requests
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        New Request
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    placeholder="Search requests..."
                    className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() === 'asc' && '↑'}
                                            {header.column.getIsSorted() === 'desc' && '↓'}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No prefund requests found
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-700">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} results
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="text-sm text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[10, 20, 30, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Modal */}
            <PrefundRequestForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleRequestSuccess}
            />
        </div>
    );
};

export default PrefundRequestsTable;