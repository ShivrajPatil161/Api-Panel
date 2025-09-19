// FranchiseTransactionReport.jsx
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FileText, TrendingUp, DollarSign } from 'lucide-react';
import api from '../../../constants/API/axiosInstance';
import UniversalExportButtons from '../UniversalExportButtons';

import FTransReportFilters from './FTransReportFilters';

const FranchiseTransactionReport = ({ filters: commonFilters, isFranchise }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportInfo, setReportInfo] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        ...commonFilters,
        transactionType: 'CREDIT'
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: `${localFilters.startDate}T00:00:00`,
                endDate: `${localFilters.endDate}T23:59:59`,
                franchiseId: localFilters.selectedFranchise,
                status: 'SETTLED',
                dateFilterType: localFilters.dateFilterType,
                page: 0,
                size: 100,
                // Only include transactionType if it's not 'ALL'
                ...(localFilters.transactionType !== 'All' && { transactionType: localFilters.transactionType })
            };

            const response = await api.get('/v1/reports/transactions/franchise/enhanced', { params });

            if (response.data.success) {
                setTransactions(response.data.data.transactions);
                setSummary(response.data.data.summary);
                setReportInfo({
                    reportGeneratedAt: response.data.data.reportGeneratedAt,
                    totalPages: response.data.data.totalPages,
                    totalElements: response.data.data.totalElements,
                    reportType: response.data.data.reportType
                });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Error fetching transaction data');
        } finally {
            setLoading(false);
        }
    };

    // Table columns definition
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.accessor('transactionId', {
            header: 'Transaction ID',
            cell: info => (
                <span className="font-mono text-sm text-gray-900">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('transactionDate', {
            header: 'Transaction Date',
            cell: info => (
                <span className="text-sm text-gray-700">
                    {new Date(info.getValue()).toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: info => (
                <span className="font-semibold text-blue-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('netAmount', {
            header: 'Net Amount',
            cell: info => (
                <span className="font-semibold text-green-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('charge', {
            header: 'Settled on',
            cell: info => (
                <span className="text-red-600">
                    soon will add
                </span>
            )
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('remarks', {
            header: 'Remarks',
            cell: info => (
                <span className="text-sm text-gray-600">
                    {info.getValue() || '-'}
                </span>
            )
        })
    ], [columnHelper]);

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Handle filter changes from the ReportFilters component
    const handleFiltersChange = (newFilters) => {
        setLocalFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Export functionality
    const exportColumns = {
        headers: ['Transaction ID', 'Transaction Date', 'Amount (₹)', 'Net Amount (₹)', 'Settled On','Status', 'Remarks'],
        keys: ['transactionId', 'transactionDate', 'amount', 'netAmount', 'charge', 'status', 'remarks']
    };

    const excelTransform = (data) => {
        return data.map(transaction => ({
            'Transaction ID': transaction.transactionId,
            'Transaction Date': new Date(transaction.transactionDate).toLocaleString(),
            'Amount': transaction.amount,
            'Net Amount': transaction.netAmount,
            'Settled On':"will add soon",
            'Status': transaction.status,
            'Remarks': transaction.remarks || '-'
        }));
    };

    const generateFilename = () => {
        const dateRange = `${localFilters.startDate}_to_${localFilters.endDate}`;
        return `franchise_transaction_report_${dateRange}`;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <FTransReportFilters
                    filters={localFilters}
                    onChange={handleFiltersChange}
                    isFranchise={isFranchise}
                    reportType="transactions"
                    onGenerate={fetchTransactions}
                />
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
                            </div>
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">₹{summary.totalAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Net Amount</p>
                                <p className="text-2xl font-bold text-green-600">₹{summary.totalNetAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                                <p className="text-2xl font-bold text-orange-600">₹{summary.totalCommission?.toLocaleString() || 0}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-green-600">{summary.successRate}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Commission Breakdown */}
            {summary?.commissionBreakdown && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-orange-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-orange-700">Gross Commission</p>
                            <p className="text-xl font-bold text-orange-600">₹{summary.commissionBreakdown.grossCommission.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-green-700">Net Commission</p>
                            <p className="text-xl font-bold text-green-600">₹{summary.commissionBreakdown.netCommission.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-700">Commission Rate</p>
                            <p className="text-xl font-bold text-blue-600">{(summary.commissionBreakdown.commissionRate).toFixed(2)}%</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-purple-700">Active Merchants</p>
                            <p className="text-xl font-bold text-purple-600">{summary.activeMerchants}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
                            {reportInfo && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Report generated on {new Date(reportInfo.reportGeneratedAt).toLocaleString()} |
                                    Total {reportInfo.totalElements} transactions
                                </p>
                            )}
                        </div>
                        <UniversalExportButtons
                            data={transactions}
                            filename={generateFilename()}
                            title="Franchise Transaction Report"
                            columns={exportColumns}
                            excelTransform={excelTransform}
                            summary={summary}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                </div>
            )}

            {/* No Data Message */}
            {!loading && transactions.length === 0 && summary && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-gray-600">No commission transactions found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
};

export default FranchiseTransactionReport;