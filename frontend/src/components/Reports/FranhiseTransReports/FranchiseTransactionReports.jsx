// FranchiseTransactionReport.jsx
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FileText, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
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

    // Table columns definition with all available fields
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.accessor('txnId', {
            header: 'Transaction ID',
            cell: info => (
                <span className="font-mono text-xs text-gray-900">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('txnDate', {
            header: 'Date',
            cell: info => (
                <span className="text-xs text-gray-700">
                    {new Date(info.getValue()).toLocaleDateString()}
                </span>
            )
        }),
        columnHelper.accessor('txnAmount', {
            header: 'Amount',
            cell: info => (
                <span className="font-semibold text-xs text-blue-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('settleAmount', {
            header: 'Settle Amount',
            cell: info => (
                <span className="font-semibold text-xs text-green-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('systemFee', {
            header: 'System Fee',
            cell: info => (
                <span className="font-semibold text-xs text-red-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('commissionAmount', {
            header: 'Commission',
            cell: info => (
                <span className="font-semibold text-xs text-orange-600">
                    ₹{info.getValue().toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('authCode', {
            header: 'Auth Code',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('tid', {
            header: 'TID',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('brandType', {
            header: 'Brand',
            cell: info => (
                <span className="text-xs font-medium text-purple-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('cardType', {
            header: 'Card Type',
            cell: info => (
                <span className="text-xs text-blue-600">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('cardClassification', {
            header: 'Card Class',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue() || '-'}
                </span>
            )
        }),
        columnHelper.accessor('merchantName', {
            header: 'Merchant',
            cell: info => (
                <span className="text-xs text-gray-900 font-medium">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('franchiseName', {
            header: 'Franchise',
            cell: info => (
                <span className="text-xs text-gray-700">
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor('state', {
            header: 'State',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue() || '-'}
                </span>
            )
        }),
        columnHelper.accessor('settlementRate', {
            header: 'Settlement Rate',
            cell: info => (
                <span className="text-xs text-indigo-600">
                    {info.getValue()}%
                </span>
            )
        }),
        columnHelper.accessor('franchiseRate', {
            header: 'Franchise Rate',
            cell: info => (
                <span className="text-xs text-green-600">
                    {info.getValue()}%
                </span>
            )
        }),
        columnHelper.accessor('merchantRate', {
            header: 'Merchant Rate',
            cell: info => (
                <span className="text-xs text-purple-600">
                    {info.getValue()}%
                </span>
            )
        }),
        columnHelper.accessor('commissionRate', {
            header: 'Commission Rate',
            cell: info => (
                <span className="text-xs text-orange-600">
                    {info.getValue()}%
                </span>
            )
        }),
        columnHelper.accessor('settleDate', {
            header: 'Settled On',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {new Date(info.getValue()).toLocaleDateString()}
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

    // Export functionality with all fields
    const exportColumns = {
        headers: [
            'Transaction ID', 'Transaction Date', 'Amount (₹)', 'Settle Amount (₹)', 'System Fee (₹)',
            'Commission (₹)', 'Auth Code', 'TID', 'Brand Type', 'Card Type', 'Card Classification',
            'Merchant Name', 'Franchise Name', 'State', 'Settlement Rate (%)', 'Franchise Rate (%)',
            'Merchant Rate (%)', 'Commission Rate (%)', 'Settled On'
        ],
        keys: [
            'txnId', 'txnDate', 'txnAmount', 'settleAmount', 'systemFee', 'commissionAmount',
            'authCode', 'tid', 'brandType', 'cardType', 'cardClassification', 'merchantName',
            'franchiseName', 'state', 'settlementRate', 'franchiseRate', 'merchantRate',
            'commissionRate', 'settleDate'
        ]
    };

    const excelTransform = (data) => {
        return data.map(transaction => ({
            'Transaction ID': transaction.txnId,
            'Transaction Date': new Date(transaction.txnDate).toLocaleString(),
            'Amount': transaction.txnAmount,
            'Settle Amount': transaction.settleAmount,
            'System Fee': transaction.systemFee,
            'Commission': transaction.commissionAmount,
            'Auth Code': transaction.authCode,
            'TID': transaction.tid,
            'Brand Type': transaction.brandType,
            'Card Type': transaction.cardType,
            'Card Classification': transaction.cardClassification || '-',
            'Merchant Name': transaction.merchantName,
            'Franchise Name': transaction.franchiseName,
            'State': transaction.state || '-',
            'Settlement Rate': transaction.settlementRate,
            'Franchise Rate': transaction.franchiseRate,
            'Merchant Rate': transaction.merchantRate,
            'Commission Rate': transaction.commissionRate,
            'Settled On': new Date(transaction.settleDate).toLocaleString()
        }));
    };

    const generateFilename = () => {
        const dateRange = `${localFilters.startDate}_to_${localFilters.endDate}`;
        return `franchise_transaction_report_${dateRange}`;
    };

    // Calculate total system fee from transactions
    const totalSystemFee = transactions.reduce((sum, txn) => sum + txn.systemFee, 0);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Total Transactions</p>
                                <p className="text-lg font-bold text-gray-900">{summary.totalTransactions}</p>
                            </div>
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900">₹{summary.totalAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Net Amount</p>
                                <p className="text-lg font-bold text-green-600">₹{summary.totalNetAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Total Commission</p>
                                <p className="text-lg font-bold text-orange-600">₹{summary.totalCommission?.toLocaleString() || 0}</p>
                            </div>
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Card Analysis */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Card Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Brand Distribution */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Brand Distribution</h4>
                            <div className="space-y-1">
                                {Object.entries(
                                    transactions.reduce((acc, txn) => {
                                        acc[txn.brandType] = (acc[txn.brandType] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).map(([brand, count]) => (
                                    <div key={brand} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs">
                                        <span className="font-medium">{brand}</span>
                                        <span className="text-gray-600">{count} txns</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Type Distribution */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Card Type Distribution</h4>
                            <div className="space-y-1">
                                {Object.entries(
                                    transactions.reduce((acc, txn) => {
                                        acc[txn.cardType] = (acc[txn.cardType] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).map(([type, count]) => (
                                    <div key={type} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs">
                                        <span className="font-medium">{type}</span>
                                        <span className="text-gray-600">{count} txns</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table with Sticky Horizontal Scroll */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-md font-semibold text-gray-900">Transaction Details</h2>
                            {reportInfo && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Report generated on {new Date(reportInfo.reportGeneratedAt).toLocaleDateString()} |
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

                    <div className="relative">
                        <div
                            className="overflow-x-auto"
                            style={{
                                maxHeight: '70vh',
                                overflowY: 'auto'
                            }}
                        >
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50 sticky top-0">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                                                <td key={cell.id} className="px-3 py-2 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sticky horizontal scrollbar at bottom of viewport */}
                        <div
                            className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 z-10 overflow-x-auto"
                            style={{
                                height: '12px'
                            }}
                            onScroll={(e) => {
                                const tableContainer = e.target.closest('.relative').querySelector('.overflow-x-auto');
                                if (tableContainer) {
                                    tableContainer.scrollLeft = e.target.scrollLeft;
                                }
                            }}
                        >
                            <div style={{ width: 'max-content', minWidth: '100%', height: '1px' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Data Message */}
            {!loading && transactions.length === 0 && summary && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-md font-medium text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-sm text-gray-600">No commission transactions found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
};

export default FranchiseTransactionReport;