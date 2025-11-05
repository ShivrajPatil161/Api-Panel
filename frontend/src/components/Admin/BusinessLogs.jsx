import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import api from '../../constants/API/axiosInstance';
import PageHeader from '../UI/PageHeader';
import { FileText } from 'lucide-react';

const BusinessLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLogType, setSelectedLogType] = useState('');

    const logTypes = [
        { value: 'logins', label: 'User Logins', description: 'Track when users log into the system' },
        { value: 'logouts', label: 'User Logouts', description: 'Track when users log out of the system' },
        { value: 'creates', label: 'Data Creation', description: 'Track when new records are created' },
        { value: 'edits', label: 'Data Modifications', description: 'Track when existing records are updated' },
        { value: 'deletes', label: 'Data Deletions', description: 'Track when records are deleted' },
        { value: 'failed-attempts', label: 'Failed Operations', description: 'Track failed requests and errors' },
        { value: 'admin-actions', label: 'Admin Activities', description: 'Track administrative actions' },
        { value: 'user-management', label: 'User Management', description: 'Track user and admin management activities' },
        { value: 'data-exports', label: 'Data Exports', description: 'Track data export and download activities' },
    ];

    const fetchLogs = async () => {
        if (!selectedLogType) return;

        setLoading(true);
        try {
            const response = await api.get(`/admin/logs/business/${selectedLogType}`);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionFromUrl = (method, url) => {
        if (url.includes('/login')) return 'Login';
        if (url.includes('/logout')) return 'Logout';
        if (method === 'POST') return 'Created';
        if (method === 'PUT') return 'Updated';
        if (method === 'DELETE') return 'Deleted';
        if (method === 'GET' && url.includes('/export')) return 'Exported';
        return method;
    };

    const getResourceFromUrl = (url) => {
        const parts = url.split('/').filter(part => part);

        // Remove query params or hashes if present
        const cleanParts = parts.map(p => p.split('?')[0].split('#')[0]);

        // Assume the resource is the segment after "api"
        const apiIndex = cleanParts.findIndex(part => part.toLowerCase() === 'api');

        if (apiIndex !== -1 && apiIndex + 1 < cleanParts.length) {
            const resource = cleanParts[apiIndex + 1];
            return resource.charAt(0).toUpperCase() + resource.slice(1);
        }

        return 'System';
    };


    const columns = [
        {
            accessorKey: 'createdAt',
            header: 'Time',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {formatDateTime(row.getValue('createdAt'))}
                </div>
            ),
        },
        {
            accessorKey: 'userId',
            header: 'User',
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-900">{row.getValue('userId')}</div>
                    <div className="text-gray-500">{row.original.username?.split('(')[1]?.replace(')', '')}</div>
                </div>
            ),
        },
        {
            header: 'Action',
            cell: ({ row }) => (
                <div className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.original.requestMethod === 'POST' ? 'bg-green-100 text-green-800' :
                            row.original.requestMethod === 'PUT' ? 'bg-blue-100 text-blue-800' :
                                row.original.requestMethod === 'DELETE' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {getActionFromUrl(row.original.requestMethod, row.original.requestUrl)}
                    </span>
                </div>
            ),
        },
        {
            header: 'Request Url',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {getResourceFromUrl(row.original.requestUrl)}
                    {console.log(row.original)}
                </div>
            ),
        },
        {
            header: 'Request Body',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {(row.original.requestBody)}
                    {console.log(row.original)}
                </div>
            ),
        },
        {
            header: 'Response Body',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {(row.original.responseBody)}
                    {console.log(row.original)}
                </div>
            ),
        },
        {
            accessorKey: 'responseStatus',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.getValue('responseStatus') >= 200 && row.getValue('responseStatus') < 300
                        ? 'bg-green-100 text-green-800'
                        : row.getValue('responseStatus') >= 400
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {row.getValue('responseStatus')}
                </span>
            ),
        },
        {
            accessorKey: 'executionTimeMs',
            header: 'Response Time',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {row.getValue('executionTimeMs')}ms
                </div>
            ),
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.getValue('ipAddress')}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: logs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="p-3 ">

            <PageHeader
            icon={FileText}
            iconColor="text-indigo-600"
            title="System Activity Logs"
            description="Monitor user activities and system changes"
            />

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Activity Type
                        </label>
                        <select
                            value={selectedLogType}
                            onChange={(e) => setSelectedLogType(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Choose an activity type...</option>
                            {logTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {selectedLogType && (
                            <p className="mt-1 text-sm text-gray-500">
                                {logTypes.find(t => t.value === selectedLogType)?.description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={fetchLogs}
                        disabled={!selectedLogType || loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Loading...' : 'Fetch Logs'}
                    </button>
                </div>
            </div>

            {logs.length > 0 && (
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            {logTypes.find(t => t.value === selectedLogType)?.label} ({logs.length} entries)
                        </h3>
                    </div>

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
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    <span>
                                                        {header.column.getIsSorted() === 'desc' ? ' ↓' :
                                                            header.column.getIsSorted() === 'asc' ? ' ↑' : ''}
                                                    </span>
                                                </div>
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
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {logs.length === 0 && selectedLogType && !loading && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-xl mb-2">📋</div>
                    <p>No {logTypes.find(t => t.value === selectedLogType)?.label.toLowerCase()} found</p>
                </div>
            )}
        </div>
    );
};

export default BusinessLogs;