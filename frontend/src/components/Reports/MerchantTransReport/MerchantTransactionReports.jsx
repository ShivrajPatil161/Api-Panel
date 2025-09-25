// MerchantTransactionReports.jsx
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FileText, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import api from '../../../constants/API/axiosInstance';
import UniversalExportButtons from '../UniversalExportButtons';
import MTransReportFilters from './MTransReportFilters';

const MerchantTransactionReports = ({ filters: commonFilters, userType }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportInfo, setReportInfo] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        ...commonFilters,
        transactionType: 'CREDIT'
    });

    const customerId = localStorage.getItem('customerId');
    const isMerchant = userType === 'merchant';

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: `${localFilters.startDate}T00:00:00`,
                endDate: `${localFilters.endDate}T23:59:59`,
                merchantId: isMerchant ? customerId : localFilters.selectedMerchant,
                status: 'SETTLED',
                dateFilterType: localFilters.dateFilterType,
                page: 0,
                size: 100,
                ...(localFilters.transactionType !== 'All' && { transactionType: localFilters.transactionType })
            };

            const response = await api.get('/v1/reports/transactions/merchant/enhanced', { params });

            if (response.data.success) {
                setTransactions(response.data.data.transactions);
                setSummary(response.data.data.summary);
                setReportInfo({
                    reportGeneratedAt: response.data.data.reportGeneratedAt,
                    totalPages: response.data.data.totalPages,
                    totalElements: response.data.data.totalElements
                });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Error fetching transaction data');
        } finally {
            setLoading(false);
        }
    };

    // Check if merchant is franchise type based on data structure
    const isFranchiseMerchant = transactions.length > 0 && transactions[0].franchiseName;

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
        columnHelper.accessor('settleDate', {
            header: 'Settled On',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {new Date(info.getValue()).toLocaleDateString()}
                </span>
            )
        }),
        columnHelper.accessor('txnAmount', { // Use actual field name from DTO
            header: 'Transaction Amount',
            cell: info => (
                <span className="font-semibold text-xs text-blue-600">
                    ₹{(info.getValue() || 0).toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('settleAmount', {
            header: 'Net Amount',
            cell: info => (
                <span className="font-semibold text-xs text-green-600">
                    ₹{(info.getValue() || 0).toLocaleString()}
                </span>
            )
        }),
        columnHelper.accessor('systemFee', {
            header: 'System Fee',
            cell: info => (
                <span className="font-semibold text-xs text-red-600">
                    ₹{(info.getValue() || 0).toLocaleString()}
                </span>
            )
        }),
        // Franchise-specific columns (conditionally shown)
        ...(isFranchiseMerchant ? [
            columnHelper.accessor('commissionAmount', {
                header: 'Commission',
                cell: info => (
                    <span className="font-semibold text-xs text-orange-600">
                        ₹{(info.getValue() || 0).toLocaleString()}
                    </span>
                )
            }),
            columnHelper.accessor('franchiseName', {
                header: 'Franchise',
                cell: info => (
                    <span className="text-xs text-gray-700">
                        {info.getValue() || '-'}
                    </span>
                )
            })
        ] : []),
        columnHelper.accessor('authCode', {
            header: 'Auth Code',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue() || '-'}
                </span>
            )
        }),
        columnHelper.accessor('tid', {
            header: 'TID',
            cell: info => (
                <span className="text-xs text-gray-600">
                    {info.getValue() || '-'}
                </span>
            )
        }),
        columnHelper.accessor('brandType', {
            header: 'Brand',
            cell: info => (
                <span className="text-xs font-medium text-purple-600">
                    {info.getValue() || '-'}
                </span>
            )
        }),
        columnHelper.accessor('cardType', {
            header: 'Card Type',
            cell: info => (
                <span className="text-xs text-blue-600">
                    {info.getValue() || '-'}
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
                    {info.getValue() || '-'}
                </span>
            )
        }),
        ...(isFranchiseMerchant ? [
            columnHelper.accessor('state', {
                header: 'State',
                cell: info => (
                    <span className="text-xs text-gray-600">
                        {info.getValue() || '-'}
                    </span>
                )
            })
        ] : []),
        columnHelper.accessor('settlementPercentage', {
            header: 'Settlement Rate',
            cell: info => (
                <span className="text-xs text-indigo-600">
                    {info.getValue() || 0}%
                </span>
            )
        }),
        columnHelper.accessor('merchantRate', {
            header: 'Merchant Rate',
            cell: info => (
                <span className="text-xs text-purple-600">
                    {info.getValue() || 0}%
                </span>
            )
        }),
        // Franchise-specific rate columns
        ...(isFranchiseMerchant ? [
            columnHelper.accessor('franchiseRate', {
                header: 'Franchise Rate',
                cell: info => (
                    <span className="text-xs text-green-600">
                        {info.getValue() || 0}%
                    </span>
                )
            }),
            columnHelper.accessor('commissionRate', {
                header: 'Commission Rate',
                cell: info => (
                    <span className="text-xs text-orange-600">
                        {info.getValue() || 0}%
                    </span>
                )
            })
        ] : [])
    ], [columnHelper, isFranchiseMerchant]);

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Handle filter changes from the ReportFilters component
    const handleFiltersChange = (newFilters) => {
        setLocalFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Export functionality with dynamic columns based on merchant type
    const getExportColumns = () => {
        const baseColumns = {
            headers: [
                'Transaction ID', 'Transaction Date', 'Settled On', 'Transaction Amount (₹)', 'Net Amount (₹)',
                'System Fee (₹)', 'Auth Code', 'TID', 'Brand Type', 'Card Type', 'Card Classification',
                'Merchant Name', 'Settlement Rate (%)', 'Merchant Rate (%)'
            ],
            keys: [
                'txnId', 'txnDate', 'settleDate', 'txnAmount', 'settleAmount', 'systemFee',
                'authCode', 'tid', 'brandType', 'cardType', 'cardClassification',
                'merchantName', 'settlementPercentage', 'merchantRate'
            ]
        };

        if (isFranchiseMerchant) {
            baseColumns.headers.splice(6, 0, 'Commission (₹)', 'Franchise Name');
            baseColumns.keys.splice(6, 0, 'commissionAmount', 'franchiseName');
            baseColumns.headers.splice(-2, 0, 'State', 'Franchise Rate (%)', 'Commission Rate (%)');
            baseColumns.keys.splice(-2, 0, 'state', 'franchiseRate', 'commissionRate');
        }

        return baseColumns;
    };

    const excelTransform = (data) => {
        return data.map(transaction => {
            

            const baseData = {
                'Transaction ID': transaction.txnId,
                'Transaction Date': new Date(transaction.txnDate).toLocaleString(),
                'Settled On': new Date(transaction.settleDate).toLocaleString(),
                'Transaction Amount': transaction.txnAmount || 0,
                'Net Amount': transaction.settleAmount || 0,
                'System Fee': transaction.systemFee || 0,
                'Auth Code': transaction.authCode || '-',
                'TID': transaction.tid || '-',
                'Brand Type': transaction.brandType || '-',
                'Card Type': transaction.cardType || '-',
                'Card Classification': transaction.cardClassification || '-',
                'Merchant Name': transaction.merchantName || '-',
                'Settlement Rate': `${(transaction.settlementPercentage || 0).toFixed(2)}%`,
                'Merchant Rate': `${(transaction.merchantRate || 0).toFixed(2)}%`
            };

            if (isFranchiseMerchant) {
                return {
                    ...baseData,
                    'Commission': transaction.commissionAmount || 0,
                    'Franchise Name': transaction.franchiseName || '-',
                    'State': transaction.state || '-',
                    'Franchise Rate': `${(transaction.franchiseRate || 0).toFixed(2)}%`,
                    'Commission Rate': `${(transaction.commissionRate || 0).toFixed(2)}%`
                };
            }

            return baseData;
        });
    };

    const generateFilename = () => {
        const dateRange = `${localFilters.startDate}_to_${localFilters.endDate}`;
        return `merchant_transaction_report_${dateRange}`;
    };

    const generateReportTitle = () => {
        return isFranchiseMerchant ? 'Franchise Merchant Transaction Report' : 'Direct Merchant Transaction Report';
    };

    // Calculate totals
    const totalSystemFee = transactions.reduce((sum, txn) => sum + (txn.systemFee || 0), 0);
    const totalCommission = transactions.reduce((sum, txn) => sum + (txn.commissionAmount || 0), 0);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <MTransReportFilters
                    filters={localFilters}
                    onChange={handleFiltersChange}
                    userType={userType}
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
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900">₹{summary.totalAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-green-600" />
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
                                <p className="text-xs font-medium text-gray-600">
                                    {isFranchiseMerchant ? 'Total Commission' : 'Total Charges'}
                                </p>
                                <p className="text-lg font-bold text-orange-600">
                                    ₹{(isFranchiseMerchant ? totalCommission : summary.totalCharges).toLocaleString()}
                                </p>
                            </div>
                            {isFranchiseMerchant ?
                                <DollarSign className="w-6 h-6 text-orange-600" /> :
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Card Analysis */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Transaction Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Brand Distribution */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Brand Distribution</h4>
                            <div className="space-y-1">
                                {Object.entries(
                                    transactions.reduce((acc, txn) => {
                                        const brand = txn.brandType || 'Unknown';
                                        acc[brand] = (acc[brand] || 0) + 1;
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
                                        const type = txn.cardType || 'Unknown';
                                        acc[type] = (acc[type] || 0) + 1;
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

                        {/* Average Transaction Value */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Summary Stats</h4>
                            <div className="space-y-1">
                                <div className="bg-blue-50 p-2 rounded text-xs">
                                    <div className="flex justify-between">
                                        <span>Avg Transaction</span>
                                        <span className="font-medium">₹{summary.averageTransactionValue?.toFixed(0) || 0}</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-2 rounded text-xs">
                                    <div className="flex justify-between">
                                        <span>Success Rate</span>
                                        <span className="font-medium">{summary.successRate || 100}%</span>
                                    </div>
                                </div>
                                {isFranchiseMerchant && (
                                    <div className="bg-orange-50 p-2 rounded text-xs">
                                        <div className="flex justify-between">
                                            <span>Total Commission</span>
                                            <span className="font-medium">₹{totalCommission.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-md font-semibold text-gray-900">Transaction Details</h2>
                            {reportInfo && (
                                <p className="text-xs text-gray-600 mt-1">
                                    {generateReportTitle()} | Generated on {new Date(reportInfo.reportGeneratedAt).toLocaleDateString()} |
                                    Total {reportInfo.totalElements} transactions
                                </p>
                            )}
                        </div>
                        <UniversalExportButtons
                            data={transactions}
                            filename={generateFilename()}
                            title={generateReportTitle()}
                            columns={getExportColumns()}
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
                    </div>
                </div>
            )}

            {/* No Data Message */}
            {!loading && transactions.length === 0 && summary && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-md font-medium text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-sm text-gray-600">No transactions found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
};

export default MerchantTransactionReports;