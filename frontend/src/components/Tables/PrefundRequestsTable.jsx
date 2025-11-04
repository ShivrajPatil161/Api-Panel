import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Plus, ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";
import { usePrefundQueries } from "../Hooks/usePrefundQueries";
import PrefundRequestForm from "../Forms/PrefundRequestForm";
import PrefundRequestModal from "../View/PrefundRequestModal";
import TableShimmer from "../Shimmer/TableShimmer";

const PrefundRequestsTable = () => {
    const userType = localStorage.getItem("userType");

    const [pagination, setPagination] = useState({ page: 0, size: 10 });
    const [filtering, setFiltering] = useState("");
    const [sorting, setSorting] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewingRequest, setViewingRequest] = useState(null);

    const { useMyPrefundRequests, useAllPrefundRequests, useCreatePrefund } = usePrefundQueries();

    
    const createMutation = useCreatePrefund();

    const queryHook =
        userType === "admin" || userType === "super_admin"
            ? useAllPrefundRequests(pagination)
            : useMyPrefundRequests(pagination);

    const { data, isLoading, isError, error } = queryHook;

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "requestedBy", header: "Requested By" },
        {
            accessorKey: "depositAmount",
            header: "Amount",
            cell: (info) => `₹${info.getValue()?.toFixed(2)}`,
        },
        { accessorKey: "paymentMode", header: "Payment Mode" },
        { accessorKey: "depositType", header: "Deposit Type" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue();
                let color = "bg-gray-100 text-gray-700";
                if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
                else if (status === "Approved") color = "bg-green-100 text-green-800";
                else if (status === "Rejected") color = "bg-red-100 text-red-800";
                return (
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Action",
            cell: ({ row }) => (
                <button
                    onClick={() => setViewingRequest(row.original)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                >
                    <Eye size={18} />
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        manualPagination: true,
        pageCount: data?.totalPages || 1,
    });

    if (isLoading)
        return (
            <TableShimmer rows={4} columns={8}/>
        );
    if (isError)
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                {error.message || "Error fetching data"}
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Prefund Requests
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {userType === "admin" || userType === "super_admin"
                                ? "Manage and review all prefund requests"
                                : "View and manage your prefund submissions"}
                        </p>
                    </div>

                    {userType !== "admin" && userType !== "super_admin" && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>New Request</span>
                        </button>
                    )}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Requests List</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search requests..."
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getIsSorted() === "asc"
                                                        ? " 🔼"
                                                        : header.column.getIsSorted() === "desc"
                                                            ? " 🔽"
                                                            : null}
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
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center space-y-2">
                                                <p className="text-gray-500">
                                                    No prefund requests found
                                                </p>
                                                {userType !== "admin" && (
                                                    <button
                                                        onClick={() => setIsFormOpen(true)}
                                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Create First Request
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                >
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
                    {data?.content?.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Page {pagination.page + 1} of {data?.totalPages || 1}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                page: prev.page - 1,
                                            }))
                                        }
                                        disabled={pagination.page === 0}
                                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                page: prev.page + 1,
                                            }))
                                        }
                                        disabled={data?.last}
                                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <PrefundRequestForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    isSubmitting={createMutation.isPending}
                    onSubmit={(data, reset, close) => {
                        createMutation.mutate(data, {
                            onSuccess: () => {
                                reset();
                                close();
                            },
                        });
                    }}
                />
            )}

            {/* View / Action Modal */}
            <PrefundRequestModal
                request={viewingRequest}
                isOpen={!!viewingRequest}
                onClose={() => setViewingRequest(null)}
                isAdmin={userType === "admin" || userType === "super_admin"}
            />
        </div>
    );
};

export default PrefundRequestsTable;
