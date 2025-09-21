import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import {
    Search,
    MoreVertical,
    Edit3,
    Trash2,
    UserX,
    UserCheck,
    Shield,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Filter,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../constants/API/axiosInstance';

const AdminManagementTable = ({ onEditPermissions, onRefresh }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const columnHelper = createColumnHelper();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/admins");
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await api.patch(`/admin/admins/${userId}/status`, {
                enabled: !currentStatus,
            });

            setData((prev) =>
                prev.map((admin) =>
                    admin.id === userId ? { ...admin, enabled: !currentStatus } : admin
                )
            );

            toast.success(
                `Admin ${!currentStatus ? "enabled" : "disabled"} successfully`
            );
        } catch (error) {
            console.error("Failed to update admin status:", error);
            toast.error("Failed to update admin status");
        }
    };

    const handleDeleteAdmin = async (userId) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this admin?</p>
                <button
                    onClick={async () => {
                        try {
                            await api.delete(`/admin/admins/${userId}`);
                            setData((prev) =>
                                prev.filter((admin) => admin.id !== userId)
                            );
                            toast.success("Admin deleted successfully");
                        } catch (error) {
                            console.error("Failed to delete admin:", error);
                            toast.error("Failed to delete admin");
                        }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                >
                    Yes, delete
                </button>
            </div>,
            { autoClose: false }
        );
    };

    const columns = useMemo(() => [
        columnHelper.accessor('email', {
            header: 'Admin Details',
            cell: ({ row }) => (
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {row.original.email.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {row.original.email}
                        </div>
                        <div className="text-sm text-gray-500">
                            ID: {row.original.id}
                        </div>
                    </div>
                </div>
            )
        }),

        columnHelper.accessor('roles', {
            header: 'Role & Permissions',
            cell: ({ row }) => {
                const roles = row.original.roles || [];
                const isSuperAdmin = roles.some(role => role.name === 'SUPER_ADMIN');
                const permissions = roles.flatMap(role => role.permissions || []);

                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${isSuperAdmin
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                            </span>
                        </div>
                        {!isSuperAdmin && (
                            <div className="text-xs text-gray-500">
                                {permissions.length} permission(s)
                            </div>
                        )}
                    </div>
                );
            }
        }),

        columnHelper.accessor('enabled', {
            header: 'Status',
            cell: ({ row }) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${row.original.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {row.original.enabled ? 'Active' : 'Inactive'}
                </span>
            )
        }),

        columnHelper.accessor('createdAt', {
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            )
        }),

        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const isSuperAdmin = row.original.roles?.some(role => role.name === 'SUPER_ADMIN');
                const isCurrentUser = row.original.email === localStorage.getItem('userEmail');

                return (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(dropdownOpen === row.original.id ? null : row.original.id)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                            disabled={isSuperAdmin && !isCurrentUser}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {dropdownOpen === row.original.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <div className="py-1">
                                    {!isSuperAdmin && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    onEditPermissions(row.original);
                                                    setDropdownOpen(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Permissions
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleStatusToggle(row.original.id, row.original.enabled);
                                                    setDropdownOpen(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {row.original.enabled ? (
                                                    <>
                                                        <UserX className="w-4 h-4 mr-2" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="w-4 h-4 mr-2" />
                                                        Activate
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleDeleteAdmin(row.original.id);
                                                    setDropdownOpen(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Admin
                                            </button>
                                        </>
                                    )}

                                    {isSuperAdmin && (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            Super Admin - Cannot be modified
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        })
    ], [dropdownOpen, onEditPermissions]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
            pagination
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: 'includesString'
    });

    const handleRefresh = () => {
        fetchAdmins();
        if (onRefresh) onRefresh();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <h3 className="text-lg font-medium text-gray-900">Admin Management</h3>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search admins..."
                            />
                        </div>

                        {/* Refresh */}
                        <button
                            onClick={handleRefresh}
                            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center space-x-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <div className="flex flex-col">
                                                    <ChevronUp
                                                        className={`w-3 h-3 ${header.column.getIsSorted() === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                                                    />
                                                    <ChevronDown
                                                        className={`w-3 h-3 -mt-1 ${header.column.getIsSorted() === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {table.getRowModel().rows.length === 0 && (
                <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
            )}

            {/* Pagination */}
            {table.getPageCount() > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )}{' '}
                            of {table.getFilteredRowModel().rows.length} results
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementTable;