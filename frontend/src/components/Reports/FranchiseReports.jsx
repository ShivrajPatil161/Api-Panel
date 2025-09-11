import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { Download, FileText, FileSpreadsheet, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

import api from '../../constants/API/axiosInstance';
import autoTable from 'jspdf-autotable';
// Downloadable Export Component
const ExportButtons = ({ data, filename = 'franchise-reports' }) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            'Franchise Name': item.franchiseName,
            'Total Merchants': item.totalMerchants,
            'Wallet Balance': item.walletBalance || 0,
            'Total Devices': item.totalDevices,
            'Total Products': item.totalProducts
        })));

        // Style the header row
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4F46E5" } },
                    alignment: { horizontal: "center" }
                };
            }
        }

        // Set column widths
        worksheet['!cols'] = [
            { width: 20 }, // Franchise Name
            { width: 15 }, // Total Merchants
            { width: 15 }, // Wallet Balance
            { width: 15 }, // Total Devices
            { width: 15 }, // Total Products
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Franchise Reports');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text('Franchise Reports', 20, 20);

        // Add timestamp
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

        // Prepare table data
        const tableData = data.map(item => [
            item.franchiseName,
            item.totalMerchants.toString(),
            (item.walletBalance || 0).toString(),
            item.totalDevices.toString(),
            item.totalProducts.toString()
        ]);

        // Add table
        autoTable(doc,{
            head: [['Franchise Name', 'Total Merchants', 'Wallet Balance', 'Total Devices', 'Total Products']],
            body: tableData,
            startY: 40,
            theme: 'striped',
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 12
            },
            bodyStyles: {
                fontSize: 10
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' },
                4: { cellWidth: 30, halign: 'center' }
            },
            margin: { top: 40, left: 20, right: 20 }
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
            </button>
            <button
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
                <FileText className="w-4 h-4" />
                Export PDF
            </button>
        </div>
    );
};

// Main Reports Component
const FranchiseReports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
        columnHelper.accessor('franchiseName', {
            header: 'Franchise Name',
            cell: info => (
                <div className="font-medium text-gray-900">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('totalMerchants', {
            header: 'Total Merchants',
            cell: info => (
                <div className="text-center text-gray-700">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('walletBalance', {
            header: 'Wallet Balance',
            cell: info => (
                <div className="text-center text-gray-700">
                    ${(info.getValue() || 0).toLocaleString()}
                </div>
            ),
        }),
        columnHelper.accessor('totalDevices', {
            header: 'Total Devices',
            cell: info => (
                <div className="text-center text-gray-700">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('totalProducts', {
            header: 'Total Products',
            cell: info => (
                <div className="text-center text-gray-700">
                    {info.getValue()}
                </div>
            ),
        }),
    ], [columnHelper]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await api.get('/stats/franchise-reports');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching franchise reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Franchise Reports</h1>
                    <p className="text-sm text-gray-600">Overview of franchise performance metrics</p>
                </div>
                <ExportButtons data={data} filename="franchise-reports" />
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search franchises..."
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                            <div className="flex items-center gap-2">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <span className="text-indigo-600">↑</span>,
                                                    desc: <span className="text-indigo-600">↓</span>,
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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

                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
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
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Total Franchises</div>
                    <div className="text-2xl font-bold text-gray-900">{data.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Total Merchants</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data.reduce((sum, item) => sum + item.totalMerchants, 0)}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Total Devices</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data.reduce((sum, item) => sum + item.totalDevices, 0)}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data.reduce((sum, item) => sum + item.totalProducts, 0)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FranchiseReports;