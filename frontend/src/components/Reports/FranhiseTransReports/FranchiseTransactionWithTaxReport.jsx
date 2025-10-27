// FranchiseTransactionReport.jsx
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FileText, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import api from '../../../constants/API/axiosInstance';
import UniversalExportButtons from '../UniversalExportButtons';
import FTransReportFilters from './FTransReportFilters';

const FranchiseTransactionWithTaxReport = ({ filters: commonFilters, isFranchise }) => {
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
                status: 'SETTLED',
                dateFilterType: localFilters.dateFilterType,
                ...(localFilters.transactionType !== 'All' && { transactionType: localFilters.transactionType }),
                includeTaxes: true
            };

            // 🟡 CASE 1: Franchise = ALL → Export Excel
            if (localFilters.selectedFranchise === 'ALL') {
                const response = await api.get('/v1/reports/transactions/franchise/export-all', {
                    params,
                    responseType: 'blob', // important for file download
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;

                // optional custom filename from response header
                const disposition = response.headers['content-disposition'];
                const filename = disposition
                    ? disposition.split('filename=')[1]
                    : `franchise_transactions_${localFilters.startDate}_to_${localFilters.endDate}.xlsx`;

                link.setAttribute('download', filename.replace(/"/g, ''));
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);
            }
            // 🟢 CASE 2: Specific franchise → Normal paginated API
            else {
                const response = await api.get('/v1/reports/transactions/franchise/enhanced', {
                    params: {
                        ...params,
                        franchiseId: localFilters.selectedFranchise,
                        page: 0,
                        size: 100,
                    },
                });

                if (response.data.success) {
                    setTransactions(response.data.data.transactions);
                    setSummary(response.data.data.summary);
                    setReportInfo({
                        reportGeneratedAt: response.data.data.reportGeneratedAt,
                        totalPages: response.data.data.totalPages,
                        totalElements: response.data.data.totalElements,
                        reportType: response.data.data.reportType,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Error fetching transaction data');
        } finally {
            setLoading(false);
        }
    };

    // Detect which fields are available in the data
    const availableFields = useMemo(() => {
        if (transactions.length === 0) return new Set();

        const fields = new Set();
        transactions.forEach(txn => {
            Object.keys(txn).forEach(key => {
                // Only include fields that have meaningful values (not null/undefined/empty)
                if (txn[key] !== null && txn[key] !== undefined && txn[key] !== '') {
                    fields.add(key);
                }
            });
        });
        return fields;
    }, [transactions]);

    // Define all possible column configurations
    const columnDefinitions = useMemo(() => {
        const columnHelper = createColumnHelper();
        return {
            customTxnId: columnHelper.accessor('customTxnId', {
                header: 'System ID',
                cell: info => <span className="font-mono text-xs text-gray-900">{info.getValue() || '-'}</span>
            }),
            txnId: columnHelper.accessor('txnId', {
                header: 'Transaction ID',
                cell: info => <span className="font-mono text-xs text-gray-900">{info.getValue() || '-'}</span>
            }),
            txnDate: columnHelper.accessor('txnDate', {
                header: 'Date',
                cell: info => info.getValue() ? <span className="text-xs text-gray-700">{new Date(info.getValue()).toLocaleDateString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            settleDate: columnHelper.accessor('settleDate', {
                header: 'Settled On',
                cell: info => info.getValue() ? <span className="text-xs text-gray-600">{new Date(info.getValue()).toLocaleDateString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            txnAmount: columnHelper.accessor('txnAmount', {
                header: 'Amount',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-blue-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            settleAmount: columnHelper.accessor('settleAmount', {
                header: 'Settle Amount',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-green-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            systemFee: columnHelper.accessor('systemFee', {
                header: 'Net System Fee',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-red-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            systemFeeExGST: columnHelper.accessor('systemFeeExGST', {
                header: 'System Fee',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-red-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            gstAmount: columnHelper.accessor('gstAmount', {
                header: 'GST Amount',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-red-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            commissionAmount: columnHelper.accessor('commissionAmount', {
                header: 'Commission',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-orange-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            tdsAmount: columnHelper.accessor('tdsAmount', {
                header: 'TDS',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-orange-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            tdsPercentage: columnHelper.accessor('tdsPercentage', {
                header: 'TDS %',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-orange-600">{info.getValue()?.toLocaleString()}%</span> : <span className="text-xs text-gray-400">-</span>
            }),
            netCommissionAmount: columnHelper.accessor('netCommissionAmount', {
                header: 'Net Commission',
                cell: info => info.getValue() ? <span className="font-semibold text-xs text-orange-600">₹{info.getValue()?.toLocaleString()}</span> : <span className="text-xs text-gray-400">-</span>
            }),
            authCode: columnHelper.accessor('authCode', {
                header: 'Auth Code',
                cell: info => <span className="text-xs text-gray-600">{info.getValue() || '-'}</span>
            }),
            tid: columnHelper.accessor('tid', {
                header: 'TID',
                cell: info => <span className="text-xs text-gray-600">{info.getValue() || '-'}</span>
            }),
            brandType: columnHelper.accessor('brandType', {
                header: 'Brand',
                cell: info => <span className="text-xs font-medium text-purple-600">{info.getValue() || '-'}</span>
            }),
            cardType: columnHelper.accessor('cardType', {
                header: 'Card Type',
                cell: info => <span className="text-xs text-blue-600">{info.getValue() || '-'}</span>
            }),
            cardClassification: columnHelper.accessor('cardClassification', {
                header: 'Card Class',
                cell: info => <span className="text-xs text-gray-600">{info.getValue() || '-'}</span>
            }),
            merchantName: columnHelper.accessor('merchantName', {
                header: 'Merchant',
                cell: info => <span className="text-xs text-gray-900 font-medium">{info.getValue() || '-'}</span>
            }),
            franchiseName: columnHelper.accessor('franchiseName', {
                header: 'Franchise',
                cell: info => <span className="text-xs text-gray-700">{info.getValue() || '-'}</span>
            }),
            state: columnHelper.accessor('state', {
                header: 'State',
                cell: info => <span className="text-xs text-gray-600">{info.getValue() || '-'}</span>
            }),
            settlementRate: columnHelper.accessor('settlementRate', {
                header: 'Settlement Rate',
                cell: info => info.getValue() ? <span className="text-xs text-indigo-600">{info.getValue()}%</span> : <span className="text-xs text-gray-400">-</span>
            }),
            franchiseRate: columnHelper.accessor('franchiseRate', {
                header: 'Franchise Rate',
                cell: info => info.getValue() ? <span className="text-xs text-green-600">{info.getValue()}%</span> : <span className="text-xs text-gray-400">-</span>
            }),
            merchantRate: columnHelper.accessor('merchantRate', {
                header: 'Merchant Rate',
                cell: info => info.getValue() ? <span className="text-xs text-purple-600">{info.getValue()}%</span> : <span className="text-xs text-gray-400">-</span>
            }),
            commissionRate: columnHelper.accessor('commissionRate', {
                header: 'Commission Rate',
                cell: info => info.getValue() ? <span className="text-xs text-orange-600">{info.getValue()}%</span> : <span className="text-xs text-gray-400">-</span>
            })
        };
    }, []);

    // Priority order for columns (most important first)
    const columnPriority = [
        'customTxnId', 'txnId', 'txnDate', 'settleDate', 'txnAmount', 'settleAmount', 'systemFee', 'systemFeeExGST', 'gstAmount', 'commissionAmount', 'tdsAmount', 'tdsPercentage','netCommissionAmount',
        'merchantName', 'franchiseName', 'brandType', 'cardType', 'authCode', 'tid',
        'cardClassification', 'state', 'settlementRate', 'franchiseRate',
        'merchantRate', 'commissionRate'
    ];

    // Dynamically build columns based on available fields
    const columns = useMemo(() => {
        return columnPriority
            .filter(field => availableFields.has(field))
            .map(field => columnDefinitions[field])
            .filter(Boolean);
    }, [availableFields, columnDefinitions]);

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleFiltersChange = (newFilters) => {
        setLocalFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Dynamic export configuration based on available fields
    const exportConfig = useMemo(() => {
        const fieldMapping = {
            customTxnId: { header: 'System ID', format: val => val },
            txnId: { header: 'Transaction ID', format: val => val },
            txnDate: { header: 'Transaction Date', format: val => new Date(val).toLocaleString() },
            settleDate: { header: 'Settled On', format: val => new Date(val).toLocaleString() },
            txnAmount: { header: 'Amount (₹)', format: val => val },
            settleAmount: { header: 'Settle Amount (₹)', format: val => val },
            systemFee: { header: 'Net System Fee (₹)', format: val => val },
            systemFeeExGST: { header: 'System Fee (₹)', format: val => val },
            gstAmount: { header: 'GST (₹)', format: val => val },
            commissionAmount: { header: 'Commission (₹)', format: val => val },
            tdsAmount: { header: 'TDS (₹)', format: val => val },
            tdsPercentage: { header: 'TDS (%)', format: val => val },
            netCommissionAmount: { header: 'Net Commission (₹)', format: val => val },
            authCode: { header: 'Auth Code', format: val => val },
            tid: { header: 'TID', format: val => val },
            brandType: { header: 'Brand Type', format: val => val },
            cardType: { header: 'Card Type', format: val => val },
            cardClassification: { header: 'Card Classification', format: val => val || '-' },
            merchantName: { header: 'Merchant Name', format: val => val },
            franchiseName: { header: 'Franchise Name', format: val => val },
            state: { header: 'State', format: val => val || '-' },
            settlementRate: { header: 'Settlement Rate (%)', format: val => val },
            franchiseRate: { header: 'Franchise Rate (%)', format: val => val },
            merchantRate: { header: 'Merchant Rate (%)', format: val => val },
            commissionRate: { header: 'Commission Rate (%)', format: val => val }
            
        };

        const availableColumns = columnPriority.filter(field => availableFields.has(field));

        return {
            headers: availableColumns.map(field => fieldMapping[field].header),
            keys: availableColumns
        };
    }, [availableFields]);

    const excelTransform = (data) => {
        return data.map(transaction => {
            const row = {};
            exportConfig.keys.forEach(key => {
                const fieldMapping = {
                    customTxnId: { header: 'System ID', format: val => val },
                    txnId: { header: 'Transaction ID', format: val => val },
                    txnDate: { header: 'Transaction Date', format: val => new Date(val).toLocaleString() },
                    settleDate: { header: 'Settled On', format: val => new Date(val).toLocaleString() },
                    txnAmount: { header: 'Amount', format: val => val },
                    settleAmount: { header: 'Settle Amount', format: val => val },
                    systemFee: { header: 'Net System Fee (₹)', format: val => val },
                    systemFeeExGST: { header: 'System Fee (₹)', format: val => val },
                    gstAmount: { header: 'GST (₹)', format: val => val },
                    commissionAmount: { header: 'Commission (₹)', format: val => val },
                    tdsAmount: { header: 'TDS (₹)', format: val => val },
                    tdsPercentage: { header: 'TDS (%)', format: val => val },
                    netCommissionAmount: { header: 'Net Commission (₹)', format: val => val },
                    authCode: { header: 'Auth Code', format: val => val },
                    tid: { header: 'TID', format: val => val },
                    brandType: { header: 'Brand Type', format: val => val },
                    cardType: { header: 'Card Type', format: val => val },
                    cardClassification: { header: 'Card Classification', format: val => val || '-' },
                    merchantName: { header: 'Merchant Name', format: val => val },
                    franchiseName: { header: 'Franchise Name', format: val => val },
                    state: { header: 'State', format: val => val || '-' },
                    settlementRate: { header: 'Settlement Rate', format: val => `${val || 0}%` },
                    franchiseRate: { header: 'Franchise Rate', format: val => `${val || 0}%` },
                    merchantRate: { header: 'Merchant Rate', format: val => `${val || 0}%` },
                    commissionRate: { header: 'Commission Rate', format: val => `${val || 0}%` }
                
                };

                const config = fieldMapping[key];
                row[config.header] = config.format(transaction[key]);
            });
            return row;
        });
    };

    const generateFilename = () => {
        const dateRange = `${localFilters.startDate}_to_${localFilters.endDate}`;
        const type = localFilters.transactionType !== 'All' ? `_${localFilters.transactionType}` : '';
        return `franchise_transaction_report${type}_${dateRange}`;
    };

    // Dynamic card analysis based on available fields
    const renderCardAnalysis = () => {
        const hasBrandType = availableFields.has('brandType');
        const hasCardType = availableFields.has('cardType');

        if (!hasBrandType && !hasCardType) return null;

        return (
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Card Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hasBrandType && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Brand Distribution</h4>
                            <div className="space-y-1">
                                {Object.entries(
                                    transactions.reduce((acc, txn) => {
                                        if (txn.brandType) {
                                            acc[txn.brandType] = (acc[txn.brandType] || 0) + 1;
                                        }
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
                    )}

                    {hasCardType && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Card Type Distribution</h4>
                            <div className="space-y-1">
                                {Object.entries(
                                    transactions.reduce((acc, txn) => {
                                        if (txn.cardType) {
                                            acc[txn.cardType] = (acc[txn.cardType] || 0) + 1;
                                        }
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
                    )}
                </div>
            </div>
        );
    };

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
                                <p className="text-lg font-bold text-gray-900">₹{summary.totalAmount?.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600">Net Amount</p>
                                <p className="text-lg font-bold text-green-600">₹{summary.totalNetAmount?.toLocaleString()}</p>
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

            {/* Dynamic Card Analysis */}
            {transactions.length > 0 && renderCardAnalysis()}

            {/* Transactions Table */}
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
                            columns={exportConfig}
                            excelTransform={excelTransform}
                            summary={summary}
                        />
                    </div>

                    <div className="overflow-x-auto" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
            )}

            {/* No Data Message */}
            {!loading && transactions.length === 0 && summary && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-md font-medium text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-sm text-gray-600">No transactions found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
};

export default FranchiseTransactionWithTaxReport;