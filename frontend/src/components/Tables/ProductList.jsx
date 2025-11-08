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
  Shield,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import ProductMasterForm from '../Forms/Product';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../constants/API/productApi';
import StatsCard from '../UI/StatsCard';
import PageHeader from '../UI/PageHeader';
import TableHeader from '../UI/TableHeader';
import Table from '../UI/Table';
import Pagination from '../UI/Pagination';
import { useProductQueries } from '../Hooks/useProductsQueries';
import TableShimmer from '../Shimmer/TableShimmer';
import ErrorState from '../UI/ErrorState';

// Modular Components
const SearchBar = ({ searchInput, setSearchInput, onSearch, onClear, loading }) => (
  <div className="mb-4">
    <div className="flex max-w-md">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchInput && (
          <button
            onClick={onClear}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <Search size={16} />
      </button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="mb-4 text-center">
    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <span className="ml-2">Loading products...</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
    {status ? 'Active' : 'Inactive'}
  </span>
);

const ActionButtons = ({ product, onView, onEdit, onDelete }) => (
  <div className="flex space-x-1">
    <button
      onClick={() => onView(product)}
      className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
      title="View Details"
    >
      <Eye size={16} />
    </button>
    <button
      onClick={() => onEdit(product)}
      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
      title="Edit Product"
    >
      <Edit size={16} />
    </button>
    <button
      onClick={() => onDelete(product.id,product.productName)}
      className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
      title="Delete Product"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const ProductViewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
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
              <span>{product.productName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Code:</span>
              <span className="font-mono">{product.productCode}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Category:</span>
              {product.productCategory.categoryName}
            </div>
           
            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <StatusBadge status={product.status} />
            </div>
            
          </div>

         
          {product.description && (
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-700">{product.description}</p>
            </div>
          )}

      

          {product.remarks && (
            <div>
              <span className="font-medium">Remarks:</span>
              <p className="mt-1 text-gray-700">{product.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  const userType = localStorage.getItem('userType')?.toLowerCase() || '';
  const columnHelper = createColumnHelper();

  // TanStack Query hooks
  const {
    useAllProducts,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct
  } = useProductQueries();

  // Fetch products with current pagination, sorting, and search
  const {
    data: productsData,
    isLoading,
    isError,
    error
  } = useAllProducts(
    pagination.pageIndex,
    pagination.pageSize,
    sorting[0]?.id || 'productName',
    sorting[0]?.desc ? 'desc' : 'asc',
  
  );

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Extract data from query response
  const data = productsData?.content || [];
  const totalPages = productsData?.totalPages || 0;
  const totalElements = productsData?.totalElements || 0;




  // Calculate stats
  const activeProducts = data.filter(p => p.status === true).length;
  const inactiveProducts = data.filter(p => p.status === false).length;

  // Table columns configuration
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
      columnHelper.accessor('productCategory.categoryName', {
        header: 'Category',
        cell: info => (info.getValue() || '—'),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <ActionButtons
            product={info.row.original}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
      }),
    ],
    []
  );

  // Table configuration
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

  // Action handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
  };

  const handleDelete = (productId, productName) => {
    const confirmDelete = () => {
      toast.dismiss();
      performDelete(productId);
    };

    const cancelDelete = () => {
      toast.dismiss();
      toast.info('Delete operation cancelled');
    };

    toast.warn(
      <div className="flex flex-col space-y-2">
        <span>Delete "{productName}"?</span>
        <div className="flex space-x-2">
          <button
            onClick={confirmDelete}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  const performDelete = async (productId) => {
    deleteMutation.mutate(productId);
  };

  const handleFormSubmit = async (formData) => {
    const isEdit = !!editingProduct;

    if (isEdit) {
      updateMutation.mutate(
        { id: editingProduct.id, data: formData },
        {
          onSuccess: () => {
            handleCloseForm();
          }
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseForm();
        }
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };



  if (isError) return <ErrorState />

  if(isLoading) return <TableShimmer />

  return (
    <div className="min-h-screen bg-gray-50 pr-4">
      <div className="mx-auto">
        {/* Header */}
        <PageHeader
          icon={Package}
          iconColor="text-blue-600"
          title="Product Management"
          description="Manage your all products"
          {...((userType === 'admin' || userType === 'super_admin') && {
            buttonText: "+ Add Product",
            onButtonClick: handleAddProduct,
            buttonColor: "bg-blue-600 hover:bg-blue-700"
          })}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Package}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
            label="Total Products"
            value={totalElements}
          />

          <StatsCard
            icon={CheckCircle}
            iconColor="text-green-600"
            bgColor="bg-green-100"
            label="Active Products"
            value={activeProducts}
          />

          <StatsCard
            icon={XCircle}
            iconColor="text-red-600"
            bgColor="bg-red-100"
            label="Inactive Products"
            value={inactiveProducts}
          />
        </div>

    

        {showForm && (
          <ProductMasterForm
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            isEdit={!!editingProduct}
            onCancel={handleCloseForm}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        )}

        <ProductViewModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <TableHeader
            title="Product List"
            searchValue={globalFilter}
            onSearchChange={setGlobalFilter}
            searchPlaceholder="Search products..."
          />

          {/* Table */}
          <Table
            table={table}
            columns={columns}
            emptyState={{
              icon: <Package size={50} />,
              message: "No products found",
            }}
          />

          {/* Pagination */}
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
};

export default ProductList;




