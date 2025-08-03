import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Edit2, 
  Trash2,  
  Users,
  Code,
  Calendar,
  Search,
  Edit,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const PricingManagement = () => {
  const [pricingSchemes, setPricingSchemes] = useState([
    {
      id: 1,
      pricingCode: 'PRC001',
      schemeName: 'Standard Franchise Package',
      targetType: 'franchise',
      rentPerProduct: 150.00,
      transactionChargeType: 'percentage',
      transactionChargeValue: 2.5,
      description: 'Standard pricing for most franchises',
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      pricingCode: 'PRC002',
      schemeName: 'Premium Merchant Plan',
      targetType: 'merchant',
      rentPerProduct: 100.00,
      transactionChargeType: 'fixed',
      transactionChargeValue: 5.00,
      description: 'Premium plan for high-volume merchants',
      createdAt: '2024-01-16',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      schemeName: '',
      targetType: 'franchise',
      rentPerProduct: '',
      transactionChargeType: 'percentage',
      transactionChargeValue: '',
      description: ''
    }
  });

  const generatePricingCode = () => {
    const lastCode = pricingSchemes.length > 0 
      ? Math.max(...pricingSchemes.map(scheme => parseInt(scheme.pricingCode.replace('PRC', '')))) 
      : 0;
    return `PRC${String(lastCode + 1).padStart(3, '0')}`;
  };

  const onSubmit = (data) => {
    if (editingScheme) {
      setPricingSchemes(prev => 
        prev.map(scheme => 
          scheme.id === editingScheme.id 
            ? { ...scheme, ...data, updatedAt: new Date().toISOString().split('T')[0] }
            : scheme
        )
      );
      setEditingScheme(null);
    } else {
      const newScheme = {
        id: Date.now(),
        pricingCode: generatePricingCode(),
        ...data,
        rentPerProduct: parseFloat(data.rentPerProduct),
        transactionChargeValue: parseFloat(data.transactionChargeValue),
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setPricingSchemes(prev => [...prev, newScheme]);
    }
    reset();
    setShowAddForm(false);
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setValue('schemeName', scheme.schemeName);
    setValue('targetType', scheme.targetType);
    setValue('rentPerProduct', scheme.rentPerProduct);
    setValue('transactionChargeType', scheme.transactionChargeType);
    setValue('transactionChargeValue', scheme.transactionChargeValue);
    setValue('description', scheme.description);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setPricingSchemes(prev => prev.filter(scheme => scheme.id !== id));
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('pricingCode', {
      header: 'Pricing Code',
      cell: info => (
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-500" />
          <span className="font-mono text-sm font-semibold">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('schemeName', {
      header: 'Scheme Name',
      cell: info => (
        <div className="font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('targetType', {
      header: 'Target Type',
      cell: info => (
        <div className="flex items-center gap-2">
         
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            info.getValue() === 'franchise' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('rentPerProduct', {
      header: 'Rent/Product',
      cell: info => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">₹{info.getValue().toFixed(2)}</span>
        </div>
      ),
    }),
    columnHelper.accessor(row => row, {
      id: 'transactionCharge',
      header: 'Transaction Charge',
      cell: info => {
        const { transactionChargeType, transactionChargeValue } = info.getValue();
        return (
          <div className="text-sm">
            {transactionChargeType === 'percentage' 
              ? `${transactionChargeValue}%` 
              : `${transactionChargeValue.toFixed(2)}`}
          </div>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: info => (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          info.getValue() === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2  className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: pricingSchemes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Pricing Management</h1>
          <p className="text-gray-600">Manage pricing schemes for franchises and merchants</p>
        </div>

        {/* Add Pricing Scheme Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingScheme(null);
              reset();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Pricing Scheme
          </button>
        </div>

        {/* Modal Overlay */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingScheme ? 'Edit Pricing Scheme' : 'Add New Pricing Scheme'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingScheme(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scheme Name *
                      </label>
                      <input
                        {...register('schemeName', { required: 'Scheme name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter scheme name"
                      />
                      {errors.schemeName && (
                        <p className="mt-1 text-sm text-red-600">{errors.schemeName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Type *
                      </label>
                      <select
                        {...register('targetType', { required: 'Target type is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="franchise">Franchise</option>
                        <option value="merchant">Merchant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rent Per Product (₹) *
                      </label>
                      <input
                        {...register('rentPerProduct', { 
                          required: 'Rent per product is required',
                          min: { value: 0, message: 'Value must be positive' }
                        })}
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      {errors.rentPerProduct && (
                        <p className="mt-1 text-sm text-red-600">{errors.rentPerProduct.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Charge Value *
                      </label>
                      <input
                        {...register('transactionChargeValue', { 
                          required: 'Transaction charge value is required',
                          min: { value: 0, message: 'Value must be positive' }
                        })}
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={watch('transactionChargeType') === 'percentage' ? '2.5' : '5.00'}
                      />
                      {errors.transactionChargeValue && (
                        <p className="mt-1 text-sm text-red-600">{errors.transactionChargeValue.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter description for this pricing scheme"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingScheme(null);
                    reset();
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Schemes List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pricing Schemes</h2>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">{pricingSchemes.length} schemes</span>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(String(e.target.value))}
                className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search schemes..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
          <div className="px-6 py-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            <span className="text-sm text-gray-700">
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingManagement;