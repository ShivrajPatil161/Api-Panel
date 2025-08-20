import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, ChevronDown } from 'lucide-react'
import api from '../../constants/API/axiosInstance'

// Outward schema
const outwardSchema = z.object({
  deliveryNumber: z.string().min(1, 'Delivery number is required'),
  customerId: z.string().min(1, 'Customer is required'),
  customerType: z.string().min(1, 'Customer type is required'),
  dispatchDate: z.string().min(1, 'Dispatch date is required'),
  dispatchedBy: z.string().min(1, 'Dispatched by is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.string().min(1, 'Quantity is required').refine(val => parseInt(val) > 0, 'Quantity must be positive'),
  unitPrice: z.string().min(1, 'Unit price is required').refine(val => parseFloat(val) > 0, 'Unit price must be positive'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  deliveryMethod: z.string().min(1, 'Delivery method is required'),
  trackingNumber: z.string().optional(),
  expectedDelivery: z.string().optional(),
  remarks: z.string().optional(),
})

// Serial Number Grid for Outward - Row-based selection
const OutwardSerialNumberGrid = ({ quantity, onGridChange, availableSerials = [] }) => {
  const [serialGrid, setSerialGrid] = useState([])

  useEffect(() => {
    const qty = parseInt(quantity) || 0;

    if (qty > 0 && availableSerials.length > 0) {
      // Use available serials from backend
      const gridData = availableSerials.slice(0, qty).map((serial, index) => ({
        id: index + 1,
        serialId: serial.id,
        MID: serial.mid || '',
        SID: serial.sid || '',
        TID: serial.tid || '',
        VpID: serial.vpaid || '',
        selected: false, // Row-based selection
      }));

      setSerialGrid(gridData);
    } else if (qty > 0) {
      // Fallback if no backend data available yet
      const gridData = Array.from({ length: qty }, (_, index) => ({
        id: index + 1,
        serialId: null,
        MID: `Sample MID ${index + 1}`,
        SID: `Sample SID ${index + 1}`,
        TID: `Sample TID ${index + 1}`,
        VpID: `Sample VpID ${index + 1}`,
        selected: false,
      }));

      setSerialGrid(gridData);
    } else {
      setSerialGrid([]);
    }
  }, [quantity, availableSerials]);

  useEffect(() => {
    onGridChange && onGridChange(serialGrid);
  }, [serialGrid, onGridChange]);

  const handleRowSelection = (rowId, selected) => {
    const updatedGrid = serialGrid.map(row =>
      row.id === rowId ? { ...row, selected } : row
    );
    setSerialGrid(updatedGrid);
  };

  const handleSelectAll = () => {
    const updatedGrid = serialGrid.map(row => ({ ...row, selected: true }));
    setSerialGrid(updatedGrid);
  };

  const handleDeselectAll = () => {
    const updatedGrid = serialGrid.map(row => ({ ...row, selected: false }));
    setSerialGrid(updatedGrid);
  };

  if (serialGrid.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Enter a quantity to view available serial numbers</p>
      </div>
    );
  }

  const selectedCount = serialGrid.filter(row => row.selected).length;

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Serial Numbers Selection ({selectedCount}/{serialGrid.length} selected)
      </label>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Select All
        </button>
        <button
          type="button"
          onClick={handleDeselectAll}
          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Deselect All
        </button>
        <div className="flex items-center text-sm text-gray-600 ml-4">
          <span className="font-medium">{selectedCount}</span> items selected for outward
        </div>
      </div>

      {/* Serial Number Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <div className="flex items-center space-x-2">
                    <span>Select</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Item #
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  MID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  SID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  TID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  VpID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {serialGrid.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.selected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    } hover:bg-blue-50 transition-colors cursor-pointer`}
                  onClick={() => handleRowSelection(row.id, !row.selected)}
                >
                  <td className="px-3 py-3 border-b">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={(e) => handleRowSelection(row.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900 border-b">
                    {row.id}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 border-b">
                    <span className={`${row.selected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                      {row.MID || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 border-b">
                    <span className={`${row.selected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                      {row.SID || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 border-b">
                    <span className={`${row.selected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                      {row.TID || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 border-b">
                    <span className={`${row.selected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                      {row.VpID || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 text-sm text-gray-600 bg-green-50 p-3 rounded">
        <strong>Summary:</strong> {selectedCount} out of {serialGrid.length} items selected for outward dispatch
        {selectedCount > 0 && (
          <div className="mt-1">
            <span className="text-green-700 font-medium">Ready for dispatch</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Outward Form Modal
const OutwardFormModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [serialGridData, setSerialGridData] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableSerials, setAvailableSerials] = useState([])

  // Dropdown states
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  // Loading states
  const [customersLoading, setCustomersLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(outwardSchema),
    defaultValues: editData || {
      customerType: 'franchise',
      deliveryMethod: 'courier',
      dispatchDate: new Date().toISOString().split('T')[0]
    }
  })

  const quantity = watch('quantity')
  const unitPrice = watch('unitPrice')
  const selectedCustomerId = watch('customerId')
  const selectedProductId = watch('productId')

  // Calculate total amount
  const totalAmount = quantity && unitPrice ? (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2) : '0.00'

  // API calls (placeholder for now)
  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true)
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/customers/id_name')

      // Mock data for now
      const mockCustomers = [
        { id: 1, name: 'ABC Franchise', type: 'franchise' },
        { id: 2, name: 'XYZ Merchant', type: 'merchant' },
        { id: 3, name: 'Direct Customer 1', type: 'direct_customer' },
      ]

      const customerOptions = mockCustomers.map(customer => ({
        value: customer.id.toString(),
        label: `${customer.name} (${customer.type})`,
        id: customer.id,
        type: customer.type
      }))
      setCustomers(customerOptions)
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert('Error loading customers. Please try again.')
    } finally {
      setCustomersLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/products/available_for_outward')

      // Mock data for now
      const mockProducts = [
        { id: 1, productCode: 'POS001', productName: 'POS Terminal Basic', availableQty: 10 },
        { id: 2, productCode: 'POS002', productName: 'POS Terminal Advanced', availableQty: 5 },
        { id: 3, productCode: 'QR001', productName: 'QR Code Scanner', availableQty: 8 },
      ]

      const productOptions = mockProducts.map(product => ({
        value: product.id.toString(),
        label: `${product.productCode} - ${product.productName} (Available: ${product.availableQty})`,
        productCode: product.productCode,
        productName: product.productName,
        availableQty: product.availableQty
      }))
      setProducts(productOptions)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error loading products. Please try again.')
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchAvailableSerials = async (productId, qty) => {
    if (!productId || !qty) {
      setAvailableSerials([])
      return
    }

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get(`/serials/available/${productId}?limit=${qty}`)

      // Mock data for now
      const mockSerials = Array.from({ length: parseInt(qty) }, (_, index) => ({
        id: index + 1,
        mid: `MID${String(index + 1).padStart(6, '0')}`,
        sid: `SID${String(index + 1).padStart(6, '0')}`,
        tid: `TID${String(index + 1).padStart(6, '0')}`,
        vpaid: `VPA${String(index + 1).padStart(6, '0')}`,
      }))

      setAvailableSerials(mockSerials)
    } catch (error) {
      console.error('Error fetching available serials:', error)
      setAvailableSerials([])
    }
  }

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
      fetchProducts()
    }
  }, [isOpen])

  // Fetch available serials when product and quantity change
  useEffect(() => {
    if (selectedProductId && quantity) {
      fetchAvailableSerials(selectedProductId, quantity)
    }
  }, [selectedProductId, quantity])

  // Load edit data
  useEffect(() => {
    if (editData && isOpen) {
      Object.keys(editData).forEach(key => {
        if (!['serialNumbers', 'customerId', 'productId'].includes(key)) {
          setValue(key, editData[key])
        }
      })

      if (editData.customerId) {
        setValue("customerId", editData.customerId.toString())
      }
      if (editData.productId) {
        setValue("productId", editData.productId.toString())
      }

      if (editData.serialNumbers) {
        setSerialGridData(editData.serialNumbers)
      }
    } else if (isOpen && !editData) {
      setSerialGridData([])
    }
  }, [editData, isOpen])

  const customerTypeOptions = [
    { value: 'franchise', label: 'Franchise' },
    { value: 'merchant', label: 'Merchant' },
    { value: 'direct_customer', label: 'Direct Customer' }
  ]

  const deliveryMethodOptions = [
    { value: 'courier', label: 'Courier' },
    { value: 'self_pickup', label: 'Self Pickup' },
    { value: 'direct_delivery', label: 'Direct Delivery' },
    { value: 'logistics_partner', label: 'Logistics Partner' }
  ]

  const handleFormSubmit = async (data) => {
    const selectedSerials = serialGridData.filter(serial => serial.selected)

    if (selectedSerials.length === 0) {
      alert('Please select at least one serial number for outward')
      return
    }

    if (selectedSerials.length !== parseInt(data.quantity)) {
      alert(`Please select exactly ${data.quantity} serial numbers`)
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = {
        ...data,
        totalAmount,
        selectedSerials,
        id: editData?.id || Date.now()
      }

      await onSubmit(submissionData)
      reset()
      setSerialGridData([])
      setAvailableSerials([])
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setSerialGridData([])
    setAvailableSerials([])
    setProducts([])
    setCustomers([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? 'Edit Outward Entry' : 'Add New Outward Entry'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Delivery & Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery & Customer Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('deliveryNumber')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deliveryNumber ? 'border-red-500' : ''}`}
                      placeholder="Enter delivery number"
                      disabled={isSubmitting}
                    />
                    {errors.deliveryNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('customerId')}
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.customerId ? 'border-red-500' : ''} ${customersLoading ? 'opacity-50' : ''}`}
                        disabled={isSubmitting || customersLoading}
                      >
                        <option value="">
                          {customersLoading ? 'Loading customers...' : 'Select customer'}
                        </option>
                        {customers.map(customer => (
                          <option key={customer.value} value={customer.value}>
                            {customer.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        {customersLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.customerId && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('customerType')}
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.customerType ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select customer type</option>
                        {customerTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-2 flex items-center pointer-events-none h-4 w-4 text-gray-400" />
                    </div>
                    {errors.customerType && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dispatch Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('dispatchDate')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dispatchDate ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.dispatchDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.dispatchDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dispatched By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('dispatchedBy')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dispatchedBy ? 'border-red-500' : ''}`}
                      placeholder="Enter dispatcher name"
                      disabled={isSubmitting}
                    />
                    {errors.dispatchedBy && (
                      <p className="mt-1 text-sm text-red-600">{errors.dispatchedBy.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('productId')}
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.productId ? 'border-red-500' : ''} ${productsLoading ? 'opacity-50' : ''}`}
                        disabled={isSubmitting || productsLoading}
                      >
                        <option value="">
                          {productsLoading ? 'Loading products...' : 'Select product'}
                        </option>
                        {products.map(product => (
                          <option key={product.value} value={product.value}>
                            {product.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        {productsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.productId && (
                      <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('quantity')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : ''}`}
                      placeholder="Enter quantity"
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('unitPrice')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.unitPrice ? 'border-red-500' : ''}`}
                      placeholder="Enter unit price"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                    />
                    {errors.unitPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="text"
                      value={totalAmount}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('deliveryAddress')}
                    rows="3"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                    placeholder="Enter complete delivery address"
                    disabled={isSubmitting}
                  />
                  {errors.deliveryAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('contactPerson')}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactPerson ? 'border-red-500' : ''}`}
                    placeholder="Enter contact person name"
                    disabled={isSubmitting}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('contactNumber')}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactNumber ? 'border-red-500' : ''}`}
                    placeholder="Enter contact number"
                    disabled={isSubmitting}
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('deliveryMethod')}
                      className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.deliveryMethod ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select delivery method</option>
                      {deliveryMethodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute inset-y-0 right-2 flex items-center pointer-events-none h-4 w-4 text-gray-400" />
                  </div>
                  {errors.deliveryMethod && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryMethod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    {...register('trackingNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tracking number (if available)"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    {...register('expectedDelivery')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Serial Number Grid */}
              <OutwardSerialNumberGrid
                quantity={quantity}
                onGridChange={setSerialGridData}
                availableSerials={availableSerials}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  {...register('remarks')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter any additional remarks"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {isSubmitting
                    ? (editData ? 'Updating...' : 'Processing...')
                    : (editData ? 'Update Outward' : 'Process Outward')
                  }
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Outward component with modal integration
const Outward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [outwardEntries, setOutwardEntries] = useState([])

  const handleSubmit = async (data) => {
    try {
      console.log('Outward Entry Data:', data)
      // TODO: Replace with actual API call when backend is ready
      // await api.post('/outward', data)

      // Mock success for now
      if (editData) {
        // Update existing entry
        setOutwardEntries(prev =>
          prev.map(entry => entry.id === data.id ? data : entry)
        )
        alert('Outward entry updated successfully!')
      } else {
        // Add new entry
        setOutwardEntries(prev => [...prev, data])
        alert('Outward entry processed successfully!')
      }

      setEditData(null)
    } catch (error) {
      console.error('Error processing outward:', error)
      throw error
    }
  }

  const handleEdit = (entry) => {
    setEditData(entry)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditData(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditData(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Outward Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Outward Entry
        </button>
      </div>

      {/* Outward entries list (placeholder) */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Outward Entries</h2>
        </div>
        <div className="p-4">
          {outwardEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No outward entries yet. Click "Add Outward Entry" to get started.</p>
          ) : (
            <div className="space-y-4">
              {outwardEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Delivery #{entry.deliveryNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Customer: {entry.customerId} | Quantity: {entry.quantity} | Amount: ₹{entry.totalAmount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dispatch Date: {entry.dispatchDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outward Form Modal */}
      <OutwardFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  )
}

export default OutwardFormModal