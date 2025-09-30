// frontend/src/components/Reports/ProductReport.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { 
    ChevronUp, 
    ChevronDown, 
    Search, 
    Package,
    TrendingUp,
    Users,
    Building,
    CheckCircle,
    XCircle,
    Eye,
    X,
    AlertTriangle,
    BarChart3,
    DollarSign
} from 'lucide-react';
import UniversalExportButtons from '../UniversalExportButtons';
import productReportApi from '../../../constants/API/productReportApi';
import ProductDetailsModal from './ProductDetailsModal';

const ProductReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        categoryId: '',
        customerType: '',
        activeOnly: false
    });

    // Fetch product scheme assignment data using the NEW comprehensive API
    const fetchProductSchemeData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use the new comprehensive report API
            const [schemeAssignments, categoriesResponse] = await Promise.all([
                productReportApi.getFilteredSchemeAssignmentsForReport({
                    categoryId: filters.categoryId || undefined,
                    customerType: filters.customerType || undefined,
                    activeOnly: filters.activeOnly
                }),
                // productReportApi.getCategories()
            ]);

            setData(schemeAssignments || []);
            setCategories(categoriesResponse || []);
        } catch (error) {
            console.error('Error fetching product scheme data:', error);
            setError('Failed to fetch product scheme data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductSchemeData();
    }, []); // Only run once on mount

    // Group data by product to get unique products with their assignments
    const productGroupedData = useMemo(() => {
        const productMap = new Map();
        
        data.forEach(assignment => {
            const productId = assignment.productId;
            
            if (!productMap.has(productId)) {
                productMap.set(productId, {
                    // Product basic info
                    productId: assignment.productId,
                    productCode: assignment.productCode,
                    productName: assignment.productName,
                    productModel: assignment.productModel,
                    productBrand: assignment.productBrand,
                    productDescription: assignment.productDescription,
                    warrantyPeriod: assignment.warrantyPeriod,
                    warrantyType: assignment.warrantyType,
                    hsn: assignment.hsn,
                    productStatus: assignment.productStatus,
                    minOrderQuantity: assignment.minOrderQuantity,
                    maxOrderQuantity: assignment.maxOrderQuantity,
                    
                    // Category info
                    categoryId: assignment.categoryId,
                    categoryName: assignment.categoryName,
                    
                    // Vendor info
                    vendorId: assignment.vendorId,
                    vendorName: assignment.vendorName,
                    
                    // Assignments array
                    assignments: [],
                    
                    // Calculated fields (will be computed)
                    hasSchemes: false,
                    franchiseSchemes: 0,
                    merchantSchemes: 0,
                    totalAssignments: 0,
                    customerTypes: new Set()
                });
            }
            
            const product = productMap.get(productId);
            product.assignments.push(assignment);
            
            // Update calculated fields
            if (assignment.customerType) {
                product.customerTypes.add(assignment.customerType);
                
                if (assignment.customerType.toUpperCase() === 'FRANCHISE') {
                    product.franchiseSchemes++;
                } else if (assignment.customerType.toUpperCase() === 'MERCHANT') {
                    product.merchantSchemes++;
                }
            }
        });
        
        // Convert to array and finalize calculations
        return Array.from(productMap.values()).map(product => ({
            ...product,
            hasSchemes: product.assignments.length > 0,
            totalAssignments: product.assignments.length,
            customerTypes: Array.from(product.customerTypes).join(', '),
            // For compatibility with existing code
            status: product.productStatus,
            model: product.productModel,
            brand: product.productBrand,
            category: { productCategoryName: product.categoryName },
            vendor: { vendorName: product.vendorName }
        }));
    }, [data]);

    // Filter data based on applied filters
    const filteredData = useMemo(() => {
        let filtered = productGroupedData;

        // Global search filter
        if (globalFilter) {
            const searchLower = globalFilter.toLowerCase();
            filtered = filtered.filter(item => 
                item.productCode?.toLowerCase().includes(searchLower) ||
                item.productName?.toLowerCase().includes(searchLower) ||
                item.productBrand?.toLowerCase().includes(searchLower) ||
                item.categoryName?.toLowerCase().includes(searchLower) ||
                item.vendorName?.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    }, [productGroupedData, globalFilter]);

    // Clear all filters function
    const clearFilters = () => {
        setGlobalFilter('');
        setFilters({
            categoryId: '',
            customerType: '',
            activeOnly: false
        });
    };

    // Open product details modal
    const openProductDetails = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Table columns definition
    const columns = useMemo(() => [
        {
            header: 'Product Code',
            accessorKey: 'productCode',
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-blue-600">{getValue()}</span>
                </div>
            )
        },
        {
            header: 'Product Name',
            accessorKey: 'productName',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-gray-900">{row.original.productName}</div>
                    <div className="text-sm text-gray-500">{row.original.productModel}</div>
                </div>
            )
        },
        {
            header: 'Category',
            accessorKey: 'categoryName',
            cell: ({ getValue }) => (
                <span className="text-gray-700">{getValue() || 'N/A'}</span>
            )
        },
        {
            header: 'Vendor',
            accessorKey: 'vendorName',
            cell: ({ getValue }) => (
                <span className="text-gray-700">{getValue() || 'N/A'}</span>
            )
        },
        {
            header: 'Brand',
            accessorKey: 'productBrand',
            cell: ({ getValue }) => (
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {getValue()}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'productStatus',
            cell: ({ getValue }) => {
                const status = getValue();
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {status ? (
                            <>
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                Active
                            </>
                        ) : (
                            <>
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                Inactive
                            </>
                        )}
                    </span>
                );
            }
        },
        {
            header: 'Has Schemes',
            accessorKey: 'hasSchemes',
            cell: ({ getValue }) => {
                const hasSchemes = getValue();
                return hasSchemes ? (
                    <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Yes</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">No</span>
                    </div>
                );
            }
        },
        {
            header: 'Customer Types',
            accessorKey: 'customerTypes',
            cell: ({ getValue }) => {
                const types = getValue();
                return types && types !== '' ? (
                    <div className="text-sm text-gray-700">
                        {types.split(', ').map((type, index) => (
                            <span 
                                key={index}
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1 ${
                                    type === 'FRANCHISE' 
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">None</span>
                );
            }
        },
        {
            header: 'Assignments',
            accessorKey: 'totalAssignments',
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Building className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600">
                            Franchise: {row.original.franchiseSchemes}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-600">
                            Merchant: {row.original.merchantSchemes}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Warranty',
            accessorKey: 'warrantyPeriod',
            cell: ({ row }) => (
                <span className="text-sm text-gray-700">
                    {row.original.warrantyPeriod} months
                </span>
            )
        },
        {
            header: 'HSN',
            accessorKey: 'hsn',
            cell: ({ getValue }) => (
                <span className="font-mono text-xs bg-yellow-50 px-2 py-1 rounded">
                    {getValue()}
                </span>
            )
        },
        {
            header: 'Min Qty',
            accessorKey: 'minOrderQuantity',
            cell: ({ getValue }) => (
                <span className="text-sm text-gray-700">{getValue()}</span>
            )
        },
        {
            header: 'Max Qty',
            accessorKey: 'maxOrderQuantity',
            cell: ({ getValue }) => (
                <span className="text-sm text-gray-700">{getValue()}</span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button
                    onClick={() => openProductDetails(row.original)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>
            )
        }
    ], []);

    // Calculate summary data
    const summary = useMemo(() => {
        const productsWithSchemes = filteredData.filter(p => p.hasSchemes).length;
        const unassignedProducts = filteredData.length - productsWithSchemes;
        const franchiseSchemes = filteredData.reduce((sum, p) => sum + p.franchiseSchemes, 0);
        const merchantSchemes = filteredData.reduce((sum, p) => sum + p.merchantSchemes, 0);
        const activeProducts = filteredData.filter(p => p.productStatus).length;
        const inactiveProducts = filteredData.length - activeProducts;

        // Category breakdown
        const categoryBreakdown = filteredData.reduce((acc, item) => {
            const category = item.categoryName || 'Unknown';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        // Status breakdown
        const statusBreakdown = filteredData.reduce((acc, item) => {
            const status = item.productStatus ? 'Active' : 'Inactive';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Scheme status breakdown
        const schemeStatusBreakdown = filteredData.reduce((acc, item) => {
            const status = item.hasSchemes ? 'With Schemes' : 'Without Schemes';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return {
            totalProducts: filteredData.length,
            activeProducts,
            inactiveProducts,
            productsWithSchemes,
            unassignedProducts,
            franchiseSchemes,
            merchantSchemes,
            totalAssignments: filteredData.reduce((sum, p) => sum + p.totalAssignments, 0),
            totalCategories: [...new Set(filteredData.map(p => p.categoryName))].length,
            categoryBreakdown,
            statusBreakdown,
            schemeStatusBreakdown,
            averageAssignmentsPerProduct: filteredData.length > 0 ? 
                (franchiseSchemes + merchantSchemes) / filteredData.length : 0
        };
    }, [filteredData]);

    // Initialize table with filtered data
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
    });

    // Export configurations
    const exportColumns = {
        headers: [
            'Product Code', 'Product Name', 'Category', 'Vendor', 'Brand', 'Model',
            'Status', 'Has Schemes', 'Franchise Schemes', 'Merchant Schemes', 
            'Total Assignments', 'Customer Types', 'Warranty Period', 'HSN',
            'Min Order Qty', 'Max Order Qty', 'Description'
        ],
        keys: [
            'productCode', 'productName', 'categoryName', 'vendorName', 'productBrand', 'productModel',
            'productStatus', 'hasSchemes', 'franchiseSchemes', 'merchantSchemes',
            'totalAssignments', 'customerTypes', 'warrantyPeriod', 'hsn',
            'minOrderQuantity', 'maxOrderQuantity', 'productDescription'
        ],
        widths: [15, 25, 15, 20, 12, 15, 10, 12, 15, 15, 15, 20, 12, 12, 12, 12, 30]
    };

    const excelTransform = (data) => {
        return data.map(item => ({
            'Product Code': item.productCode,
            'Product Name': item.productName,
            'Category': item.categoryName,
            'Vendor': item.vendorName,
            'Brand': item.productBrand,
            'Model': item.productModel,
            'Status': item.productStatus ? 'Active' : 'Inactive',
            'Has Schemes': item.hasSchemes ? 'Yes' : 'No',
            'Franchise Schemes': item.franchiseSchemes,
            'Merchant Schemes': item.merchantSchemes,
            'Total Assignments': item.totalAssignments,
            'Customer Types': item.customerTypes || 'None',
            'Warranty Period': `${item.warrantyPeriod} months`,
            'HSN': item.hsn,
            'Min Order Qty': item.minOrderQuantity,
            'Max Order Qty': item.maxOrderQuantity,
            'Description': item.productDescription || ''
        }));
    };

    const summaryConfig = [
        { key: 'totalProducts', label: 'Total Products', formatter: (val) => val.toLocaleString() },
        { key: 'activeProducts', label: 'Active Products', formatter: (val) => val.toLocaleString() },
        { key: 'inactiveProducts', label: 'Inactive Products', formatter: (val) => val.toLocaleString() },
        { key: 'productsWithSchemes', label: 'Products with Schemes', formatter: (val) => val.toLocaleString() },
        { key: 'unassignedProducts', label: 'Unassigned Products', formatter: (val) => val.toLocaleString() },
        { key: 'totalCategories', label: 'Total Categories', formatter: (val) => val.toLocaleString() },
        { key: 'totalAssignments', label: 'Total Assignments', formatter: (val) => val.toLocaleString() }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading product scheme data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-600 mb-2">⚠️ Error</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                        onClick={fetchProductSchemeData}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-600" />
                        Product Scheme Assignment Report
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Comprehensive report of products with pricing scheme assignments and customer details
                    </p>
                </div>
                <UniversalExportButtons
                    data={filteredData}
                    filename="product_scheme_assignment_report"
                    title="Product Scheme Assignment Report"
                    columns={exportColumns}
                    excelTransform={excelTransform}
                    summary={summary}
                    summaryConfig={summaryConfig}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Products</p>
                            <p className="text-3xl font-bold">{summary.totalProducts}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">Active Products</p>
                            <p className="text-3xl font-bold">{summary.activeProducts}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">With Schemes</p>
                            <p className="text-3xl font-bold">{summary.productsWithSchemes}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Assignments</p>
                            <p className="text-3xl font-bold">{summary.totalAssignments}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                        {Object.entries(summary.categoryBreakdown).map(([category, count]) => (
                            <div key={category} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 truncate" title={category}>
                                    {category}
                                </span>
                                <span className="text-lg font-bold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                    <div className="space-y-3">
                        {Object.entries(summary.statusBreakdown).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{status}</span>
                                <span className="text-lg font-bold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheme Status Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheme Assignment Status</h3>
                    <div className="space-y-3">
                        {Object.entries(summary.schemeStatusBreakdown).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{status}</span>
                                <span className="text-lg font-bold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filters.categoryId}
                        onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.customerType}
                        onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">All Customer Types</option>
                        <option value="FRANCHISE">Franchise</option>
                        <option value="MERCHANT">Merchant</option>
                    </select>

                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={filters.activeOnly}
                            onChange={(e) => setFilters(prev => ({ ...prev, activeOnly: e.target.checked }))}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Active Only</span>
                    </label>

                    <button
                        onClick={fetchProductSchemeData}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Fetch
                    </button>

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2 justify-center"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ChevronUp className="w-4 h-4" />,
                                                    desc: <ChevronDown className="w-4 h-4" />,
                                                }[header.column.getIsSorted()] ?? null}
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
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm">
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
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{' '}
                            of {table.getFilteredRowModel().rows.length} results
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        
                        <span className="text-sm text-gray-700">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                        
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            <ProductDetailsModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    );
};

export default ProductReport;