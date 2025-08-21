// Updated InwardFormModal component in frontend/src/components/Forms/Inward.jsx
// Replace the existing InwardFormModal with this updated version
// Updated InwardFormModal with API integration for dropdowns
import { useState, useEffect,useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Download, Loader2, ChevronDown } from 'lucide-react'
import * as XLSX from 'xlsx'
import api from '../../constants/API/axiosInstance' 

// Updated schema
const inwardSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  vendorId: z.string().min(1, 'Vendor is required'),
  receivedDate: z.string().min(1, 'Received date is required'),
  receivedBy: z.string().min(1, 'Received by is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.string().min(1, 'Quantity is required').refine(val => parseInt(val) > 0, 'Quantity must be positive'),
  batchNumber: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  condition: z.string().min(1, 'Condition is required'),
  remarks: z.string().optional(),
})


// Fixed SerialNumberGrid - Working checkboxes for manual entry
const SerialNumberGrid = ({ quantity, onGridChange, initialData = [] }) => {
  const [serialGrid, setSerialGrid] = useState([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const serialFields = ['MID', 'SID', 'TID', 'VpID']

  useEffect(() => {
    const qty = parseInt(quantity) || 0;

    if (qty > 0) {
      let gridData = [];

      if (initialData.length > 0) {
        // Always normalize backend serialNumbers into grid format
        gridData = initialData.map((row, index) => ({
          id: index + 1,
          MID: row.mid || '',
          SID: row.sid || '',
          TID: row.tid || '',
          VpID: row.vpaid || '',
          selectedFields: {
            MID: !!row.mid,
            SID: !!row.sid,
            TID: !!row.tid,
            VpID: !!row.vpaid,
          },
        }));
      }

      // If qty is bigger than initialData, pad new rows
      if (gridData.length < qty) {
        const paddedRows = Array.from(
          { length: qty - gridData.length },
          (_, i) => ({
            id: gridData.length + i + 1,
            MID: '',
            SID: '',
            TID: '',
            VpID: '',
            selectedFields: { MID: false, SID: false, TID: false, VpID: false },
          })
        );
        gridData = [...gridData, ...paddedRows];
      }

      setSerialGrid(gridData);
    } else {
      setSerialGrid([]);
    }
  }, [quantity, initialData]);

  // Use useRef to track the previous grid data and only call onGridChange when data actually changes
  const prevGridRef = useRef()

  useEffect(() => {
    if (onGridChange && serialGrid.length > 0) {
      // Only call onGridChange if the data has actually changed
      if (JSON.stringify(prevGridRef.current) !== JSON.stringify(serialGrid)) {
        onGridChange(serialGrid)
        prevGridRef.current = serialGrid
      }
    }
  }, [serialGrid]) // Remove onGridChange from dependencies to prevent infinite loop

  const handleSerialNumberChange = (rowId, field, value) => {
    const updatedGrid = serialGrid.map(row =>
      row.id === rowId ? { ...row, [field]: value } : row
    )
    setSerialGrid(updatedGrid)
  }

  const handleFieldSelection = (rowId, field, checked) => {
    const updatedGrid = serialGrid.map(row =>
      row.id === rowId
        ? {
          ...row,
          selectedFields: { ...row.selectedFields, [field]: checked },
          // Keep the value when unchecked so user doesn't lose data
          [field]: row[field] || ''
        }
        : row
    )
    setSerialGrid(updatedGrid)
  }

  const handleSelectAllForField = (field) => {
    const updatedGrid = serialGrid.map(row => ({
      ...row,
      selectedFields: { ...row.selectedFields, [field]: true }
    }))
    setSerialGrid(updatedGrid)
  }

  const handleDeselectAllForField = (field) => {
    const updatedGrid = serialGrid.map(row => ({
      ...row,
      selectedFields: { ...row.selectedFields, [field]: false }
      // Don't clear the field value, just uncheck
    }))
    setSerialGrid(updatedGrid)
  }

  const handleClearAllForField = (field) => {
    const updatedGrid = serialGrid.map(row => ({
      ...row,
      selectedFields: { ...row.selectedFields, [field]: false },
      [field]: '' // Clear the value
    }))
    setSerialGrid(updatedGrid)
  }

  const handleExcelUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          alert('Excel file should contain at least header and one data row')
          return
        }

        // Skip header row and map data
        const dataRows = jsonData.slice(1)

        const updatedGrid = serialGrid.map((row, index) => {
          if (index < dataRows.length && dataRows[index] && dataRows[index].length > 0) {
            const excelRow = dataRows[index]
            return {
              ...row,
              MID: excelRow[0]?.toString().trim() || '',
              SID: excelRow[1]?.toString().trim() || '',
              TID: excelRow[2]?.toString().trim() || '',
              VpID: excelRow[3]?.toString().trim() || '',
              selectedFields: {
                MID: !!(excelRow[0]?.toString().trim()),
                SID: !!(excelRow[1]?.toString().trim()),
                TID: !!(excelRow[2]?.toString().trim()),
                VpID: !!(excelRow[3]?.toString().trim())
              }
            }
          }
          return row
        })

        setSerialGrid(updatedGrid)
        setUploadModalOpen(false)

        const uploadedCount = Math.min(dataRows.filter(row => row && row.length > 0).length, serialGrid.length)
        alert(`Successfully uploaded data for ${uploadedCount} items!`)
      } catch (error) {
        console.error('Excel parsing error:', error)
        alert('Error reading Excel file. Please ensure it\'s a valid Excel file.')
      }
    }
    reader.readAsArrayBuffer(file)

    // Clear the input so the same file can be uploaded again
    event.target.value = ''
  }

  const generateSampleExcel = () => {
    const quantity = serialGrid.length || 5
    const sampleData = [
      ['MID', 'SID', 'TID', 'VpID'], // Header
      ...Array.from({ length: quantity }, (_, i) => [
        `MID${String(i + 1).padStart(6, '0')}`,
        `SID${String(i + 1).padStart(6, '0')}`,
        `TID${String(i + 1).padStart(6, '0')}`,
        `VPA${String(i + 1).padStart(6, '0')}`
      ])
    ]

    const ws = XLSX.utils.aoa_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Serial Numbers')
    XLSX.writeFile(wb, `serial_numbers_template_${quantity}_items.xlsx`)
  }

  if (serialGrid.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Enter a quantity to configure serial numbers</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Serial Numbers Configuration ({serialGrid.length} items)
      </label>

      {/* Action Buttons */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {serialFields.map(field => (
            <div key={field} className="flex gap-1">
              <button
                type="button"
                onClick={() => handleSelectAllForField(field)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                title={`Enable ${field} for all items`}
              >
                ✓ All {field}
              </button>
              <button
                type="button"
                onClick={() => handleDeselectAllForField(field)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title={`Disable ${field} for all items`}
              >
                ✗ All {field}
              </button>
              <button
                type="button"
                onClick={() => handleClearAllForField(field)}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                title={`Clear all ${field} values`}
              >
                Clear {field}
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-2 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Excel File
          </button>
          <button
            type="button"
            onClick={generateSampleExcel}
            className="px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Template
          </button>
          <div className="text-sm text-gray-600">
            Upload Excel with columns: MID, SID, TID, VpID (optional)
          </div>
        </div>
      </div>

      {/* Serial Number Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Item #
                </th>
                {serialFields.map(field => (
                  <th key={field} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-semibold">{field}</span>
                      <span className="text-xs text-gray-400 normal-case">Enable & Enter</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {serialGrid.map((row, index) => (
                <tr key={row.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900 border-b">
                    {row.id}
                  </td>
                  {serialFields.map(field => (
                    <td key={field} className="px-3 py-3 border-b">
                      <div className="space-y-2">
                        <label className="flex items-center justify-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.selectedFields[field]}
                            onChange={(e) => handleFieldSelection(row.id, field, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-xs text-gray-600">Include</span>
                        </label>
                        <input
                          type="text"
                          value={row[field]}
                          onChange={(e) => handleSerialNumberChange(row.id, field, e.target.value)}
                          disabled={!row.selectedFields[field]}
                          className={`w-full px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all ${!row.selectedFields[field]
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-blue-300'
                            }`}
                          placeholder={row.selectedFields[field] ? `Enter ${field}` : 'Disabled'}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded">
        <strong>Summary:</strong> {
          serialFields.map(field => {
            const count = serialGrid.filter(row => row.selectedFields[field]).length
            return `${field}: ${count}/${serialGrid.length}`
          }).join(' | ')
        }
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Serial Numbers</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Excel Format Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• First row must contain headers: <strong>MID | SID | TID | VpID</strong></li>
                  <li>• Each subsequent row represents one item</li>
                  <li>• Leave cells empty for IDs you don't want to include</li>
                  <li>• File will be processed for {serialGrid.length} items</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Uploading will overwrite existing data. Make sure your Excel file has the correct number of rows.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



// Updated InwardFormModal with backend integration
const InwardFormModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [serialGridData, setSerialGridData] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dropdown states
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])

  // Loading states
  const [vendorsLoading, setVendorsLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(inwardSchema),
    defaultValues: editData || {
      condition: 'new',
      receivedDate: new Date().toISOString().split('T')[0]
    }
  })

  const quantity = watch('quantity')
  const selectedVendorId = watch('vendorId')

  // API calls
  const fetchVendors = async () => {
    try {
      setVendorsLoading(true)
      const response = await api.get('/vendors/id_name')
      const vendorOptions = response.data.map(vendor => ({
        value: vendor.id.toString(),
        label: vendor.name,
        id: vendor.id
      }))
      setVendors(vendorOptions)
    } catch (error) {
      console.error('Error fetching vendors:', error)
      alert('Error loading vendors. Please try again.')
    } finally {
      setVendorsLoading(false)
    }
  }

  const fetchProductsByVendor = async (vendorId) => {
    if (!vendorId) {
      setProducts([])
      return
    }

    try {
      setProductsLoading(true)
      const response = await api.get(`/products/vendor/${vendorId}`)
      const productOptions = response.data.map(product => ({
        value: product.id.toString(),
        label: `${product.productCode} - ${product.productName}`,
        productCode: product.productCode,
        productName: product.productName
      }))
      setProducts(productOptions)

      // Clear product selection when vendor changes
      setValue('productId', '')
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      alert('Error loading products for selected vendor.')
    } finally {
      setProductsLoading(false)
    }
  }



  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      fetchVendors()
    }
  }, [isOpen])

  // Load products when vendor changes
  useEffect(() => {
    if (selectedVendorId) {
      fetchProductsByVendor(selectedVendorId)
    }
  }, [selectedVendorId])

  // Load edit data
  // Load edit data into form when editing
  useEffect(() => {
    if (editData && isOpen) {
      // set basic fields (except dropdowns/serials)
      Object.keys(editData).forEach(key => {
        if (!['serialNumbers', 'vendorId', 'productId'].includes(key)) {
          setValue(key, editData[key])
        }
      })

      // vendor will be set after data loads
      if (editData.vendorId) {
        setValue("vendorId", editData.vendorId.toString())
        fetchProductsByVendor(editData.vendorId)
      }
      

      // serials
      if (editData.serialNumbers) {
        setSerialGridData(editData.serialNumbers)
      }
    } else if (isOpen && !editData) {
      // reset on add new
      setSerialGridData([])
    }
  }, [editData, isOpen])

  // Once products are loaded, set productId
  useEffect(() => {
    if (products.length > 0 && editData?.productId) {
      setValue("productId", editData.productId.toString())
    }
  }, [products, editData, setValue])

  // Once vendors are loaded, set vendorId
  useEffect(() => {
    if (vendors.length > 0 && editData?.vendorId) {
      setValue("vendorId", editData.vendorId.toString())
    }
  }, [vendors, editData, setValue])




  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'refurbished', label: 'Refurbished' },
    { value: 'used', label: 'Used' },
    { value: 'damaged', label: 'Damaged' }
  ]

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const submissionData = {
        ...data,
        serialNumberGrid: serialGridData,
        id: editData?.id || Date.now()
      }

      await onSubmit(submissionData)
      reset()
      setSerialGridData([])
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
    setProducts([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? 'Edit Inward Entry' : 'Add New Inward Entry'}
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
            {/* Invoice & Vendor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice & Vendor Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('invoiceNumber')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.invoiceNumber ? 'border-red-500' : ''
                        }`}
                      placeholder="Enter invoice number"
                      disabled={isSubmitting}
                    />
                    {errors.invoiceNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('vendorId')}
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.vendorId ? 'border-red-500' : ''
                          } ${vendorsLoading ? 'opacity-50' : ''}`}
                        disabled={isSubmitting || vendorsLoading}
                      >
                        <option value="">
                          {vendorsLoading ? 'Loading vendors...' : 'Select vendor'}
                        </option>
                        {vendors.map(vendor => (
                          <option key={vendor.value} value={vendor.value}>
                            {vendor.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        {vendorsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.vendorId && (
                      <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Received Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('receivedDate')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receivedDate ? 'border-red-500' : ''
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.receivedDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.receivedDate.message}</p>
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
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.productId ? 'border-red-500' : ''
                          } ${productsLoading || !selectedVendorId ? 'opacity-50' : ''}`}
                        disabled={isSubmitting || productsLoading || !selectedVendorId}
                      >
                        <option value="">
                          {!selectedVendorId
                            ? 'Select vendor first'
                            : productsLoading
                              ? 'Loading products...'
                              : 'Select product'
                          }
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
                    {!selectedVendorId && (
                      <p className="mt-1 text-sm text-gray-500">Please select a vendor to load products</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('quantity')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : ''
                        }`}
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
                      Received By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('receivedBy')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receivedBy ? 'border-red-500' : ''
                        }`}
                      placeholder="Enter receiver name"
                      disabled={isSubmitting}
                    />
                    {errors.receivedBy && (
                      <p className="mt-1 text-sm text-red-600">{errors.receivedBy.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    {...register('batchNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter batch number"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warranty Period (months)
                  </label>
                  <input
                    type="number"
                    {...register('warrantyPeriod')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter warranty period"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('condition')}
                      className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.condition ? 'border-red-500' : ''
                        }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select condition</option>
                      {conditionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                  )}
                </div>
              </div>

              {/* Serial Number Grid */}
              <SerialNumberGrid
                quantity={quantity}
                onGridChange={setSerialGridData}
                initialData={editData?.serialNumbers || []}
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
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {isSubmitting
                    ? (editData ? 'Updating...' : 'Saving...')
                    : (editData ? 'Update Entry' : 'Save Entry')
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

export default InwardFormModal