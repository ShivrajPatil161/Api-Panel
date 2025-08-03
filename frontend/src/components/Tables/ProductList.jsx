import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import ProductMasterForm from '../Forms/Product'

import { generateDummyProducts } from '../../constants/constants'


const ProductList = () => {
  const [data, setData] = useState(generateDummyProducts())
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const columnHelper = createColumnHelper()

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
        cell: info => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === 'POS' ? 'bg-blue-100 text-blue-800' :
            info.getValue() === 'Scanner' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {info.getValue()}
          </span>
        ),
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
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        ),
      }),
      columnHelper.accessor('warrantyPeriod', {
        header: 'Warranty',
        cell: info => (
          <div>
            <div className="text-sm font-medium">{info.getValue()} months</div>
            <div className="text-xs text-gray-500 capitalize">{info.row.original.warrantyType}</div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleView(info.row.original)}
              className="text-green-600 hover:text-green-900 text-sm font-medium"
            >
              View
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleView = (product) => {
    alert(`Viewing product: ${product.productName}\nID: ${product.id}`)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setData(prevData => prevData.filter(product => product.id !== productId))
    }
  }

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      // Update existing product
      setData(prevData => 
        prevData.map(product => 
          product.id === editingProduct.id ? { ...product, ...formData } : product
        )
      )
    } else {
      // Add new product
      setData(prevData => [...prevData, formData])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Product Master</h1>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Product
          </button>
        </div>

        {/* Search Filter */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Product Form Modal */}
          {showForm && (
              <ProductMasterForm
              onSubmit={handleFormSubmit}
              initialData={editingProduct}
                  isEdit={!!editingProduct}
                  onCancel={handleCloseForm}
            />
       
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
         
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default ProductList