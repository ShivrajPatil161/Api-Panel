import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Plus, ChevronLeft, ChevronRight, Search, Eye,  IndianRupee, FileText } from "lucide-react";
import { usePrefundQueries } from "../Hooks/usePrefundQueries";
import PrefundRequestForm from "../Forms/PrefundRequestForm";
import PrefundRequestModal from "../View/PrefundRequestModal";
import TableShimmer from "../Shimmer/TableShimmer";
import PageHeader from "../UI/PageHeader";
import ErrorState from "../UI/ErrorState";
import Table from "../UI/Table";
import TableHeader from "../UI/TableHeader";

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
        return <ErrorState />

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className=" mx-auto">
                <PageHeader
                    icon={IndianRupee}
                    iconColor="text-blue-600"
                    title="Prefund Requests"
                    description={
                        userType === "admin" || userType === "super_admin"
                            ? "Manage and review all prefund requests"
                            : "View and manage your prefund submissions"
                    }
                    buttonText={userType !== "admin" && userType !== "super_admin" ? "New Request" : undefined}
                    buttonIcon={userType !== "admin" && userType !== "super_admin" ? Plus : undefined}
                    onButtonClick={userType !== "admin" && userType !== "super_admin" ? () => setIsFormOpen(true) : undefined}
                    buttonColor="bg-blue-600 hover:bg-blue-700"
                />
        
                {/* Table Card */}
                <div className="bg-white rounded-lg shadow-sm">
                    <TableHeader
                        title="Requests List"
                        searchValue={filtering}
                        onSearchChange={setFiltering}
                        searchPlaceholder="Search requests..."
                    />

                    <Table 
                        table={table}
                        columns={columns}
                        emptyState={{
                            icon: <FileText className="h-12 w-12" />,
                            message: "No prefund requests found",
                            action: userType !== "admin" ? (
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create First Request
                                </button>
                            ) : null
                        }}
                        sortable={true}
                        hoverable={true}
                    />

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
