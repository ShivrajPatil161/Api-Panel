import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import {
  Package,
  Users,
  Building2,
  Plus,
  Minus,
  Search,
  AlertCircle,
  CheckCircle,
  Trash2,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Zod validation schemas
const baseDistributionSchema = z.object({
  product: z.string().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  merchant: z.string().min(1, "Please select a merchant"),
  selectedDevices: z.array(z.string()).min(1, "Please select at least one device")
});

const adminDistributionSchema = baseDistributionSchema.extend({
  franchise: z.string().min(1, "Please select a franchise")
});

// Reusable Form Field Component
const FormField = ({ label, error, required = false, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

// Reusable Select Component
const Select = ({ placeholder, options, value, onChange, error }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
      }`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Device Selection Table Component
const DeviceSelectionTable = ({ devices, selectedDevices, onSelectionChange, quantity }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            if (e.target.checked && selectedDevices.length < quantity) {
              const remainingSlots = quantity - selectedDevices.length;
              const unselectedRows = table.getRowModel().rows
                .filter(row => !selectedDevices.includes(row.original.id))
                .slice(0, remainingSlots);
              
              const newSelections = [...selectedDevices, ...unselectedRows.map(row => row.original.id)];
              onSelectionChange(newSelections);
            } else if (!e.target.checked) {
              const pageRowIds = table.getRowModel().rows.map(row => row.original.id);
              const newSelections = selectedDevices.filter(id => !pageRowIds.includes(id));
              onSelectionChange(newSelections);
            }
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedDevices.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked && selectedDevices.length < quantity) {
              onSelectionChange([...selectedDevices, row.original.id]);
            } else if (!e.target.checked) {
              onSelectionChange(selectedDevices.filter(id => id !== row.original.id));
            }
          }}
          disabled={!selectedDevices.includes(row.original.id) && selectedDevices.length >= quantity}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
        />
      ),
    },
    {
      accessorKey: 'sid',
      header: 'SID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('sid')}</div>
      ),
    },
    {
      accessorKey: 'mid',
      header: 'MID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('mid')}</div>
      ),
    },
    {
      accessorKey: 'tid',
      header: 'TID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('tid')}</div>
      ),
    },
    {
      accessorKey: 'vpaid',
      header: 'VPA ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('vpaid')}</div>
      ),
    },
    {
      accessorKey: 'mobileNo',
      header: 'Mobile No',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('mobileNo')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.getValue('status') === 'available'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.getValue('status')}
        </span>
      ),
    },
  ], [selectedDevices, onSelectionChange, quantity]);

  const table = useReactTable({
    data: devices,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search devices..."
          />
        </div>
        <div className="text-sm text-gray-600">
          Selected: {selectedDevices.length} / {quantity}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-blue-600">
                          {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  );
};

// Main Product Distribution Component
const ProductDistribution = () => {
  const [userType, setUserType] = useState('merchant');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') || 'merchant';
    setUserType(storedUserType);
  }, []);

  // Mock data
  const franchises = [
    { value: 'franchise-1', label: 'ABC Retail Franchise' },
    { value: 'franchise-2', label: 'XYZ Electronics Franchise' },
    { value: 'franchise-3', label: 'Tech Solutions Franchise' }
  ];

  const products = [
    { value: 'pos-device', label: 'POS Device', availableQuantity: 50 },
    { value: 'qr-scanner', label: 'QR Scanner', availableQuantity: 30 },
    { value: 'soundbox', label: 'Soundbox', availableQuantity: 25 }
  ];

  const merchants = [
    { id: 'merchant-1', name: 'Store Alpha', location: 'Mumbai', franchiseId: 'franchise-1' },
    { id: 'merchant-2', name: 'Store Beta', location: 'Delhi', franchiseId: 'franchise-1' },
    { id: 'merchant-3', name: 'Store Gamma', location: 'Pune', franchiseId: 'franchise-1' },
    { id: 'merchant-4', name: 'Tech Store 1', location: 'Bangalore', franchiseId: 'franchise-2' },
    { id: 'merchant-5', name: 'Tech Store 2', location: 'Chennai', franchiseId: 'franchise-2' }
  ];

  // Mock function to generate device data based on product and quantity
  const generateDeviceData = (productType, quantity) => {
    const devices = [];
    for (let i = 1; i <= quantity + 10; i++) { // Generate more devices than needed
      devices.push({
        id: `${productType}-${i.toString().padStart(3, '0')}`,
        sid: `SID${Math.random().toString().substr(2, 8)}`,
        mid: `MID${Math.random().toString().substr(2, 8)}`,
        tid: `TID${Math.random().toString().substr(2, 8)}`,
        vpaid: `VPA${Math.random().toString().substr(2, 8)}`,
        mobileNo: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status: Math.random() > 0.2 ? 'available' : 'reserved'
      });
    }
    return devices.filter(device => device.status === 'available');
  };

  // Form setup
  const schema = userType === 'admin' ? adminDistributionSchema : baseDistributionSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      franchise: '',
      product: '',
      quantity: 0,
      merchant: '',
      selectedDevices: []
    }
  });

  const watchedValues = watch();
  const selectedProduct = products.find(p => p.value === watchedValues.product);
  const selectedFranchise = watchedValues.franchise;

  // Filter merchants based on franchise selection (for admin)
  const availableMerchants = userType === 'admin'
    ? merchants.filter(m => m.franchiseId === selectedFranchise)
    : merchants.filter(m => m.franchiseId === 'franchise-1'); // Default franchise for franchise user

  // Filter merchants based on search
  const filteredMerchants = availableMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate devices when product and quantity change
  useEffect(() => {
    if (watchedValues.product && watchedValues.quantity > 0) {
      const devices = generateDeviceData(watchedValues.product, watchedValues.quantity);
      setAvailableDevices(devices);
      setSelectedDevices([]);
      setValue('selectedDevices', []);
    }
  }, [watchedValues.product, watchedValues.quantity, setValue]);

  // Handle device selection
  const handleDeviceSelection = (deviceIds) => {
    setSelectedDevices(deviceIds);
    setValue('selectedDevices', deviceIds);
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      console.log('Distribution Data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedMerchant = merchants.find(m => m.id === data.merchant);
      alert(`Successfully distributed ${data.quantity} ${selectedProduct?.label} to ${selectedMerchant?.name}!`);

      // Reset form
      reset();
      setSelectedDevices([]);
      setAvailableDevices([]);
      setSearchTerm('');

    } catch (error) {
      alert('Distribution failed. Please try again.');
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Distribution</h1>
            <p className="text-gray-600">
              {userType === 'admin'
                ? 'Distribute products to a franchise merchant'
                : 'Distribute products to a merchant'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${userType === 'admin'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
            }`}>
            {userType === 'admin' ? 'Admin Panel' : 'Franchise Panel'}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribution Details</h2>

        <div className="space-y-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Franchise Selection (Admin only) */}
          {userType === 'admin' && (
            <FormField label="Select Franchise" error={errors.franchise} required>
              <Select
                placeholder="Choose franchise"
                options={franchises}
                value={watchedValues.franchise}
                onChange={(e) => setValue('franchise', e.target.value)}
                error={errors.franchise}
              />
            </FormField>
          )}

          {/* Product Selection */}
          <FormField label="Select Product" error={errors.product} required>
            <Select
              placeholder="Choose product"
              options={products.map(p => ({ value: p.value, label: `${p.label} (Available: ${p.availableQuantity})` }))}
              value={watchedValues.product}
              onChange={(e) => setValue('product', e.target.value)}
              error={errors.product}
            />
          </FormField>

          {/* Quantity */}
          {selectedProduct && (
            <FormField label="Quantity to Distribute" error={errors.quantity} required>
              <input
                type="number"
                min="1"
                max={selectedProduct.availableQuantity}
                {...register('quantity', { valueAsNumber: true })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.quantity ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                placeholder="Enter quantity"
              />
              <p className="text-sm text-gray-600">
                Available: {selectedProduct.availableQuantity}
              </p>
            </FormField>
          )}

          {/* Merchant Selection */}
          {(userType === 'franchise' || (userType === 'admin' && selectedFranchise)) && (
            <FormField label="Select Merchant" error={errors.merchant} required>
              <Select
                placeholder="Choose merchant"
                options={availableMerchants.map(m => ({ value: m.id, label: `${m.name} - ${m.location}` }))}
                value={watchedValues.merchant}
                onChange={(e) => setValue('merchant', e.target.value)}
                error={errors.merchant}
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Device Selection Section */}
      {availableDevices.length > 0 && watchedValues.quantity > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Select Devices ({selectedDevices.length}/{watchedValues.quantity})
          </h2>
          
          <DeviceSelectionTable
            devices={availableDevices}
            selectedDevices={selectedDevices}
            onSelectionChange={handleDeviceSelection}
            quantity={watchedValues.quantity}
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedDevices.length === watchedValues.quantity && watchedValues.merchant && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>
              {isSubmitting ? 'Distributing...' : 'Distribute Products'}
            </span>
          </button>

          {selectedDevices.length !== watchedValues.quantity && (
            <p className="text-sm text-orange-600 text-center mt-2">
              Please select exactly {watchedValues.quantity} devices before submitting
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDistribution;