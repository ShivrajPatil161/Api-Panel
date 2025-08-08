

import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Edit,
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Calendar,
  Shield,
  Building
} from 'lucide-react';
import { toast } from 'react-toastify';

import { generateDummyProducts } from '../../constants/constants';
import ProductMasterForm from '../Forms/Product';
import axiosInstance from '../../constants/API/axiosInstance';


const ProductList = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sorting, setSorting] = useState([]);

  const userType = localStorage.getItem('userType');

  const columnHelper = createColumnHelper();

  // Helper function to get vendor name
  const getVendorName = (vendorId) => {
    const vendors = {
      '1': 'HDFC Bank',
      '2': 'ICICI Bank',
      '3': 'SBI Bank',
      '4': 'Axis Bank'
    };
    return vendors[vendorId] || 'Unknown Vendor';
  };

  // Fetch products from backend with proper pagination
  const fetchProducts = async (page = 0, size = 10, sortBy = 'productName', sortDir = 'asc', search = '') => {
    setLoading(true);
    try {
      let url = `/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

      // Use search endpoint if there's a search query
      if (search.trim()) {
        url = `/products/search?q=${encodeURIComponent(search)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      }

      const response = await axiosInstance.get(url);

      // Transform backend data to match frontend format
      const transformedData = response.data.content?.map(product => ({
        ...product,
        vendorName: getVendorName(product.vendorId),
        status: product.status?.toLowerCase() || 'active',
        category: product.category || 'POS'
      })) || [];

      setData(transformedData);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);

      toast.success(`Loaded ${transformedData.length} products`);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products from server. Using demo data.');

      // Fallback to dummy data with client-side pagination
      const dummyData = generateDummyProducts();
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedDummy = dummyData.slice(startIndex, endIndex);

      setData(paginatedDummy);
      setTotalPages(Math.ceil(dummyData.length / size));
      setTotalElements(dummyData.length);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when pagination/search changes
  useEffect(() => {
    const sortField = sorting[0]?.id || 'productName';
    const sortDirection = sorting[0]?.desc ? 'desc' : 'asc';

    fetchProducts(
      pagination.pageIndex,
      pagination.pageSize,
      sortField,
      sortDirection,
      searchQuery
    );
  }, [pagination.pageIndex, pagination.pageSize, sorting, searchQuery]);

  // Handle search
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Product ID',
        cell: info => (
          <span className="font-mono text-sm font-semibold text-blue-600">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('productName', {
        header: 'Product Name',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.productCode}</div>
          </div>
        ),
      }),
      columnHelper.accessor('vendorName', {
        header: 'Vendor',
        cell: info => (
          <div>
            <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-xs text-gray-500">{info.row.original.vendorId}</div>
          </div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => {
          const category = info.getValue();
          return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category === 'POS' ? 'bg-blue-100 text-blue-800' :
                category === 'QR_SCANNER' ? 'bg-green-100 text-green-800' :
                  category === 'CARD_READER' ? 'bg-yellow-100 text-yellow-800' :
                    category === 'PRINTER' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
              }`}>
              {category === 'QR_SCANNER' ? 'QR Scanner' :
                category === 'CARD_READER' ? 'Card Reader' :
                  category || 'Unknown'}
            </span>
          );
        },
      }),
      columnHelper.accessor('model', {
        header: 'Model',
        cell: info => (
          <div>
            <div className="text-sm font-medium">{info.getValue()}</div>
            <div className="text-xs text-gray-500">{info.row.original.brand}</div>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() === 'active' || info.getValue() === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {(info.getValue() || '').toString().charAt(0).toUpperCase() +
              (info.getValue() || '').toString().slice(1).toLowerCase()}
          </span>
        ),
      }),
      columnHelper.accessor('warrantyPeriod', {
        header: 'Warranty',
        cell: info => (
          <div>
            <div className="text-sm font-medium">{info.getValue()} months</div>
            <div className="text-xs text-gray-500 capitalize">
              {info.row.original.warrantyType?.toLowerCase().replace('_', ' ') || 'Unknown'}
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex space-x-1">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
              title="Edit Product"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
              title="Delete Product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    const editData = {
      ...product,
      status: product.status?.toLowerCase() || 'active',
      warrantyType: product.warrantyType?.toLowerCase() || 'manufacturer',
      specifications: product.specifications || [{ key: '', value: '' }]
    };
    setEditingProduct(editData);
    setShowForm(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');

      // Refresh current page
      const sortField = sorting[0]?.id || 'productName';
      const sortDirection = sorting[0]?.desc ? 'desc' : 'asc';
      fetchProducts(
        pagination.pageIndex,
        pagination.pageSize,
        sortField,
        sortDirection,
        searchQuery
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setShowForm(false);
      setEditingProduct(null);

      // Refresh data to show the latest changes
      const sortField = sorting[0]?.id || 'productName';
      const sortDirection = sorting[0]?.desc ? 'desc' : 'asc';

      setTimeout(() => {
        fetchProducts(
          pagination.pageIndex,
          pagination.pageSize,
          sortField,
          sortDirection,
          searchQuery
        );
      }, 500);

      toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        {userType === 'admin' && (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Product Master</h1>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Add Product
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="flex max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Search size={16} />
            </button>
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Searching for: "<strong>{searchQuery}</strong>"
            </p>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            Showing {totalElements} products
          </span>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading products...</span>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductMasterForm
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isEdit={!!editingProduct}
          onCancel={handleCloseForm}
        />
      )}

      {/* Product View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Package className="text-blue-500" size={16} />
                  <span className="font-medium">Product Name:</span>
                  <span>{viewingProduct.productName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Code:</span>
                  <span className="font-mono">{viewingProduct.productCode}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="text-green-500" size={16} />
                  <span className="font-medium">Vendor:</span>
                  <span>{viewingProduct.vendorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Category:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${viewingProduct.category === 'POS' ? 'bg-blue-100 text-blue-800' :
                      viewingProduct.category === 'QR_SCANNER' ? 'bg-green-100 text-green-800' :
                        viewingProduct.category === 'CARD_READER' ? 'bg-yellow-100 text-yellow-800' :
                          viewingProduct.category === 'PRINTER' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                    }`}>
                    {viewingProduct.category === 'QR_SCANNER' ? 'QR Scanner' :
                      viewingProduct.category === 'CARD_READER' ? 'Card Reader' :
                        viewingProduct.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Brand:</span>
                  <span>{viewingProduct.brand}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Model:</span>
                  <span>{viewingProduct.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${viewingProduct.status === 'active' || viewingProduct.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {viewingProduct.status?.charAt(0).toUpperCase() + viewingProduct.status?.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="text-purple-500" size={16} />
                  <span className="font-medium">Warranty:</span>
                  <span>{viewingProduct.warrantyPeriod} months ({viewingProduct.warrantyType})</span>
                </div>
              </div>

              {viewingProduct.hsn && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">HSN:</span>
                  <span>{viewingProduct.hsn}</span>
                </div>
              )}

              {viewingProduct.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-gray-700">{viewingProduct.description}</p>
                </div>
              )}

              {viewingProduct.specifications && viewingProduct.specifications.length > 0 && (
                <div>
                  <span className="font-medium">Specifications:</span>
                  <div className="mt-2 space-y-2">
                    {viewingProduct.specifications.map((spec, index) => (
                      spec.key && spec.value && (
                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{spec.key}:</span>
                          <span>{spec.value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      <span className="text-gray-400">
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted()] ?? '↕'}
                      </span>
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
      {data.length === 0 && !loading && (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No products found.</p>
        </div>
      )}

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalElements)} of{' '}
              {totalElements} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;