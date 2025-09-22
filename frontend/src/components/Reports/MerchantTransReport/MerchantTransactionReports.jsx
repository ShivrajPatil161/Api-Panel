// import React, { useState, useEffect, useMemo } from 'react';
// import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
// import { Calendar, Search, FileText, TrendingUp, TrendingDown } from 'lucide-react';
// import api from '../../../constants/API/axiosInstance';
// import UniversalExportButtons from '../UniversalExportButtons'; // Adjust path as needed

// const MerchantTransactionReport = () => {
//     const [merchants, setMerchants] = useState([]);
//     const [selectedMerchant, setSelectedMerchant] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [transactionType, setTransactionType] = useState('CREDIT');
//     const [transactions, setTransactions] = useState([]);
//     const [summary, setSummary] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [reportInfo, setReportInfo] = useState(null);

//     // Check if user is a merchant
//     const userType = localStorage.getItem('userType').toLowerCase();
//     const customerId = localStorage.getItem('customerId');
//     const isMerchant = userType === 'merchant';

//     // Fetch merchants on component mount (only if not a merchant user)
//     useEffect(() => {
//         if (!isMerchant) {
//             fetchMerchants();
//         } else {
//             // If merchant, set their ID as selected merchant
//             setSelectedMerchant(customerId);
//         }
//     }, [isMerchant, customerId]);

//     const fetchMerchants = async () => {
//         try {
//             const response = await api.get('/merchants/direct-merchant');
//             setMerchants(response.data);
//         } catch (error) {
//             console.error('Error fetching merchants:', error);
//         }
//     };

//     const fetchTransactions = async () => {
//         if (!selectedMerchant || !startDate || !endDate) {
//             alert('Please fill all required fields');
//             return;
//         }

//         setLoading(true);
//         try {
//             const params = {
//                 startDate: `${startDate}T00:00:00`,
//                 endDate: `${endDate}T23:59:59`,
//                 merchantId: selectedMerchant,
//                 status: 'SETTLED',
//                 transactionType: transactionType,
//                 page: 0,
//                 size: 100
//             };

//             const response = await api.get('/v1/reports/transactions/merchant', { params });

//             if (response.data.success) {
//                 setTransactions(response.data.data.transactions);
//                 setSummary(response.data.data.summary);
//                 setReportInfo({
//                     reportGeneratedAt: response.data.data.reportGeneratedAt,
//                     totalPages: response.data.data.totalPages,
//                     totalElements: response.data.data.totalElements
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching transactions:', error);
//             alert('Error fetching transaction data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Table columns definition
//     const columnHelper = createColumnHelper();
//     const columns = useMemo(() => [
//         columnHelper.accessor('transactionId', {
//             header: 'Transaction ID',
//             cell: info => (
//                 <span className="font-mono text-sm text-gray-900">
//                     {info.getValue()}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('transactionDate', {
//             header: 'Date & Time',
//             cell: info => (
//                 <span className="text-sm text-gray-700">
//                     {new Date(info.getValue()).toLocaleString()}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('amount', {
//             header: 'Amount',
//             cell: info => (
//                 <span className="font-semibold text-blue-600">
//                     ₹{info.getValue().toLocaleString()}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('netAmount', {
//             header: 'Net Amount',
//             cell: info => (
//                 <span className="font-semibold text-green-600">
//                     ₹{info.getValue() ? info.getValue().toLocaleString() : 0}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('charge', {
//             header: 'Charges',
//             cell: info => (
//                 <span className="text-red-600">
//                     ₹{info.getValue().toLocaleString()}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('status', {
//             header: 'Status',
//             cell: info => (
//                 <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
//                     {info.getValue()}
//                 </span>
//             )
//         }),
//         columnHelper.accessor('remarks', {
//             header: 'Remarks',
//             cell: info => (
//                 <span className="text-sm text-gray-600">
//                     {info.getValue() || '-'}
//                 </span>
//             )
//         })
//     ], [columnHelper]);

//     const table = useReactTable({
//         data: transactions,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     });

//     // Export configuration
//     const exportColumns = {
//         headers: ['Transaction ID', 'Date & Time', 'Amount(₹)', 'Net Amount(₹)', 'Charges(₹)', 'Status', 'Remarks'],
//         keys: ['transactionId', 'transactionDate', 'amount', 'netAmount', 'charge', 'status', 'remarks'],
//         styles: { cellWidth: 'wrap' },
//         columnStyles: {
//             0: { cellWidth: 25 },
//             1: { cellWidth: 25 },
//             2: { cellWidth: 'auto', halign: 'center' },
//             3: { cellWidth: 'auto', halign: 'center' },
//             4: { cellWidth: 'auto', halign: 'center' },
//             5: { cellWidth: 15, halign: 'center' },
//             6: { cellWidth: 40 } // Let remarks wrap
//         },
//         widths: [25, 25, 15, 15, 15, 12, 30]
//     };

//     // Transform data for export
//     const excelTransform = (data) => {
//         return data.map(transaction => ({
//             'Transaction ID': transaction.transactionId,
//             'Date & Time': new Date(transaction.transactionDate).toLocaleString(),
//             'Amount': transaction.amount,
//             'Net Amount': transaction.netAmount || 0,
//             'Charges': transaction.charge,
//             'Status': transaction.status,
//             'Remarks': transaction.remarks || '-'
//         }));
//     };

//     const pdfTransform = (data) => {
//         return data.map(transaction => ({
//             transactionId: transaction.transactionId,
//             transactionDate: new Date(transaction.transactionDate).toLocaleString(),
//             amount: `\u20B9${transaction.amount.toLocaleString()}`,
//             netAmount: `\u20B9${(transaction.netAmount || 0).toLocaleString()}`,
//             charge: `\u20B9${transaction.charge.toLocaleString()}`,
//             status: transaction.status,
//             remarks: transaction.remarks || '-'
//         }));
//     };

//     // Generate filename
//     const generateFilename = () => {
//         const merchantName = isMerchant
//             ? 'merchant'
//             : merchants.find(m => m.id === selectedMerchant)?.businessName?.replace(/\s+/g, '_') || 'merchant';
//         const dateRange = `${startDate}_to_${endDate}`;
//         return `${merchantName}_transactions_${dateRange}`;
//     };

//     // Generate report title
//     const generateReportTitle = () => {
//         const merchantName = isMerchant
//             ? 'Merchant'
//             : merchants.find(m => m.id === selectedMerchant)?.businessName || 'Merchant';
//         return `${merchantName} Transaction Report `;
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//                     <div className="flex items-center gap-3 mb-6">
//                         <FileText className="w-8 h-8 text-blue-600" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Transaction Report</h1>
//                             <p className="text-gray-600">View and analyze merchant transactions</p>
//                         </div>
//                     </div>

//                     {/* Filters */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                         {/* Merchant Selection - Only show if not merchant user */}
//                         {!isMerchant && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Select Merchant
//                                 </label>
//                                 <select
//                                     value={selectedMerchant}
//                                     onChange={(e) => setSelectedMerchant(e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Choose Merchant</option>
//                                     {merchants.map((merchant) => (
//                                         <option key={merchant.id} value={merchant.id}>
//                                             {merchant.businessName} - {merchant.contactPersonName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}

//                         {/* Start Date */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Start Date
//                             </label>
//                             <input
//                                 type="date"
//                                 value={startDate}
//                                 onChange={(e) => setStartDate(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         {/* End Date */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 End Date
//                             </label>
//                             <input
//                                 type="date"
//                                 value={endDate}
//                                 onChange={(e) => setEndDate(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         {/* Transaction Type */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Transaction Type
//                             </label>
//                             <select
//                                 value={transactionType}
//                                 onChange={(e) => setTransactionType(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="CREDIT">Credit</option>
//                                 <option value="DEBIT">Debit</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Search Button */}
//                     <button
//                         onClick={fetchTransactions}
//                         disabled={loading}
//                         className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                         <Search className="w-4 h-4" />
//                         {loading ? 'Loading...' : 'Generate Report'}
//                     </button>
//                 </div>

//                 {/* Summary Cards */}
//                 {summary && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                         <div className="bg-white rounded-lg shadow-sm border p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Total Transactions</p>
//                                     <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
//                                 </div>
//                                 <FileText className="w-8 h-8 text-blue-600" />
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow-sm border p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Total Amount</p>
//                                     <p className="text-2xl font-bold text-gray-900">₹{summary.totalAmount.toLocaleString()}</p>
//                                 </div>
//                                 <TrendingUp className="w-8 h-8 text-green-600" />
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow-sm border p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Net Amount</p>
//                                     <p className="text-2xl font-bold text-green-600">₹{summary.totalNetAmount.toLocaleString()}</p>
//                                 </div>
//                                 <TrendingUp className="w-8 h-8 text-green-600" />
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow-sm border p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Total Charges</p>
//                                     <p className="text-2xl font-bold text-red-600">₹{summary.totalCharges.toLocaleString()}</p>
//                                 </div>
//                                 <TrendingDown className="w-8 h-8 text-red-600" />
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Transactions Table */}
//                 {transactions.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//                         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
//                                 {reportInfo && (
//                                     <p className="text-sm text-gray-600 mt-1">
//                                         Report generated on {new Date(reportInfo.reportGeneratedAt).toLocaleString()} |
//                                         Total {reportInfo.totalElements} transactions
//                                     </p>
//                                 )}
//                             </div>
//                             {/* Export Buttons */}
//                             <UniversalExportButtons
//                                 data={transactions}
//                                 filename={generateFilename()}
//                                 title={generateReportTitle()}
//                                 columns={exportColumns}
//                                 excelTransform={excelTransform}
//                                 pdfTransform={pdfTransform}
//                                 summary={summary}
//                             />
//                         </div>

//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     {table.getHeaderGroups().map(headerGroup => (
//                                         <tr key={headerGroup.id}>
//                                             {headerGroup.headers.map(header => (
//                                                 <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {table.getRowModel().rows.map(row => (
//                                         <tr key={row.id} className="hover:bg-gray-50">
//                                             {row.getVisibleCells().map(cell => (
//                                                 <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
//                                                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {/* No Data Message */}
//                 {!loading && transactions.length === 0 && summary && (
//                     <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
//                         <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
//                         <p className="text-gray-600">No transactions found for the selected criteria.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MerchantTransactionReport;




// MerchantTransactionReports.jsx
import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { FileText, TrendingUp, TrendingDown } from 'lucide-react';
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
            header: 'Date & Time',
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
                    ₹{info.getValue() ? info.getValue().toLocaleString() : 0}
                </span>
            )
        }),
        columnHelper.accessor('charge', {
            header: 'Charges',
            cell: info => (
                <span className="text-red-600">
                    ₹{info.getValue().toLocaleString()}
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
        headers: ['Transaction ID', 'Date & Time', 'Amount(₹)', 'Net Amount(₹)', 'Charges(₹)', 'Status', 'Remarks'],
        keys: ['transactionId', 'transactionDate', 'amount', 'netAmount', 'charge', 'status', 'remarks'],
        styles: { cellWidth: 'wrap' },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 25 },
            2: { cellWidth: 'auto', halign: 'center' },
            3: { cellWidth: 'auto', halign: 'center' },
            4: { cellWidth: 'auto', halign: 'center' },
            5: { cellWidth: 15, halign: 'center' },
            6: { cellWidth: 40 }
        },
        widths: [25, 25, 15, 15, 15, 12, 30]
    };

    const excelTransform = (data) => {
        return data.map(transaction => ({
            'Transaction ID': transaction.transactionId,
            'Date & Time': new Date(transaction.transactionDate).toLocaleString(),
            'Amount': transaction.amount,
            'Net Amount': transaction.netAmount || 0,
            'Charges': transaction.charge,
            'Status': transaction.status,
            'Remarks': transaction.remarks || '-'
        }));
    };

    const pdfTransform = (data) => {
        return data.map(transaction => ({
            transactionId: transaction.transactionId,
            transactionDate: new Date(transaction.transactionDate).toLocaleString(),
            amount: `\u20B9${transaction.amount.toLocaleString()}`,
            netAmount: `\u20B9${(transaction.netAmount || 0).toLocaleString()}`,
            charge: `\u20B9${transaction.charge.toLocaleString()}`,
            status: transaction.status,
            remarks: transaction.remarks || '-'
        }));
    };

    const generateFilename = () => {
        const dateRange = `${localFilters.startDate}_to_${localFilters.endDate}`;
        return `merchant_transaction_report_${dateRange}`;
    };

    const generateReportTitle = () => {
        return 'Merchant Transaction Report';
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">₹{summary.totalAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
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
                                <p className="text-sm font-medium text-gray-600">Total Charges</p>
                                <p className="text-2xl font-bold text-red-600">₹{summary.totalCharges.toLocaleString()}</p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-600" />
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
                            title={generateReportTitle()}
                            columns={exportColumns}
                            excelTransform={excelTransform}
                            pdfTransform={pdfTransform}
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
                    <p className="text-gray-600">No transactions found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
};

export default MerchantTransactionReports;