import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Zod schema for form validation
const inwardSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  vendorId: z.string().min(1, 'Vendor ID is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  receivedDate: z.string().min(1, 'Received date is required'),
  receivedBy: z.string().min(1, 'Received by is required'),
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  productType: z.string().min(1, 'Product type is required'),
  quantity: z.string().min(1, 'Quantity is required').refine(val => parseInt(val) > 0, 'Quantity must be positive'),
  unitPrice: z.string().min(1, 'Unit price is required').refine(val => parseFloat(val) >= 0, 'Unit price must be non-negative'),
  totalAmount: z.string().optional(),
  serialNumbers: z.string().optional(),
  batchNumber: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  condition: z.string().min(1, 'Condition is required'),
  remarks: z.string().optional(),
})

// Reusable Input Component with error handling
const FormInput = ({ label, name, register, errors, type = "text", required = false, disabled = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <input
      type={type}
      {...register(name)}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? 'bg-gray-200' : ''
      } ${errors[name] ? 'border-red-500' : ''}`}
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Reusable Select Component
const FormSelect = ({ label, name, register, errors, options, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <select
      {...register(name)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? 'border-red-500' : ''
      }`}
      {...props}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Reusable Textarea Component
const FormTextarea = ({ label, name, register, errors, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <textarea
      {...register(name)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? 'border-red-500' : ''
      }`}
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

const Inward = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(inwardSchema),
    defaultValues: {
      condition: 'new'
    }
  })

  const [serialNumberGrid, setSerialNumberGrid] = useState([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [currentUploadField, setCurrentUploadField] = useState('')
  const [uploadedData, setUploadedData] = useState([])

  // Watch for changes
  const quantity = watch('quantity')
  const unitPrice = watch('unitPrice')

  // Product type options
  const productTypes = [
    { value: 'pos_machine', label: 'POS Machine' },
    { value: 'qr_scanner', label: 'QR Scanner' },
    { value: 'card_reader', label: 'Card Reader' },
    { value: 'printer', label: 'Thermal Printer' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ]

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'refurbished', label: 'Refurbished' },
    { value: 'used', label: 'Used' },
    { value: 'damaged', label: 'Damaged' }
  ]

  // Auto-calculate total amount
  useEffect(() => {
    const qty = parseFloat(quantity) || 0
    const price = parseFloat(unitPrice) || 0
    setValue('totalAmount', (qty * price).toFixed(2))
  }, [quantity, unitPrice, setValue])

  // Create serial number grid when quantity changes
  useEffect(() => {
    const qty = parseInt(quantity) || 0
    if (qty > 0) {
      const newGrid = Array.from({ length: qty }, (_, index) => ({
        id: index + 1,
        MID: '',
        SID: '',
        TID: '',
        VpID: '',
        selectedFields: {
          MID: false,
          SID: false,
          TID: false,
          VpID: false
        }
      }))
      setSerialNumberGrid(newGrid)
    } else {
      setSerialNumberGrid([])
    }
  }, [quantity])

  const handleSerialNumberChange = (rowId, field, value) => {
    setSerialNumberGrid(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    )
  }

  const handleFieldSelection = (rowId, field, checked) => {
    setSerialNumberGrid(prev =>
      prev.map(row =>
        row.id === rowId
          ? {
            ...row,
            selectedFields: { ...row.selectedFields, [field]: checked },
            [field]: checked ? row[field] : ''
          }
          : row
      )
    )
  }

  const handleSelectAllForField = (field) => {
    setSerialNumberGrid(prev =>
      prev.map(row => ({
        ...row,
        selectedFields: { ...row.selectedFields, [field]: true }
      }))
    )
  }

  const handleDeselectAllForField = (field) => {
    setSerialNumberGrid(prev =>
      prev.map(row => ({
        ...row,
        selectedFields: { ...row.selectedFields, [field]: false },
        [field]: ''
      }))
    )
  }

  // Handle file upload for serial numbers
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target.result
          const lines = text.split('\n').filter(line => line.trim())
          
          // Update grid with uploaded data
          setSerialNumberGrid(prev =>
            prev.map((row, index) => ({
              ...row,
              [field]: lines[index] || '',
              selectedFields: {
                ...row.selectedFields,
                [field]: lines[index] ? true : row.selectedFields[field]
              }
            }))
          )
          
          setUploadModalOpen(false)
          alert(`${lines.length} ${field} values uploaded successfully!`)
        } catch (error) {
          alert('Error reading file. Please ensure it\'s a valid text file.')
        }
      }
      reader.readAsText(file)
    }
  }

  const openUploadModal = (field) => {
    setCurrentUploadField(field)
    setUploadModalOpen(true)
  }

  const onSubmit = (data) => {
    const submissionData = {
      ...data,
      serialNumberGrid: serialNumberGrid
    }

    console.log('Inward Entry:', submissionData)
    alert('Inward entry saved successfully!')
    
    // Reset form and grid
    reset()
    setSerialNumberGrid([])
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inward Entry</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice & Vendor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice & Vendor Details</h3>
            <div className="space-y-4">
              <FormInput
                label="Invoice Number"
                name="invoiceNumber"
                register={register}
                errors={errors}
                required
                placeholder="Enter invoice number"
              />
              <FormInput
                label="Vendor ID"
                name="vendorId"
                register={register}
                errors={errors}
                required
                disabled
                placeholder="Enter vendor ID"
              />
              <FormInput
                label="Vendor Name"
                name="vendorName"
                register={register}
                errors={errors}
                required
                placeholder="Enter vendor name"
              />
              <FormInput
                label="Received Date"
                name="receivedDate"
                type="date"
                register={register}
                errors={errors}
                required
              />
              <FormInput
                label="Received By"
                name="receivedBy"
                register={register}
                errors={errors}
                required
                placeholder="Enter receiver name"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
            <div className="space-y-4">
              <FormInput
                label="Product ID"
                name="productId"
                register={register}
                errors={errors}
                required
                placeholder="Enter product ID"
              />
              <FormInput
                label="Product Name"
                name="productName"
                register={register}
                errors={errors}
                required
                placeholder="Enter product name"
              />
              <FormSelect
                label="Product Type"
                name="productType"
                register={register}
                errors={errors}
                options={productTypes}
                required
              />
              <FormInput
                label="Quantity"
                name="quantity"
                type="number"
                register={register}
                errors={errors}
                required
                min="1"
                placeholder="Enter quantity"
              />
              <FormInput
                label="Unit Price"
                name="unitPrice"
                type="number"
                register={register}
                errors={errors}
                required
                step="0.01"
                min="0"
                placeholder="Enter unit price"
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput
              label="Total Amount"
              name="totalAmount"
              register={register}
              errors={errors}
              disabled
              placeholder="Auto-calculated"
            />
            <FormInput
              label="Batch Number"
              name="batchNumber"
              register={register}
              errors={errors}
              placeholder="Enter batch number"
            />
            <FormInput
              label="Warranty Period (months)"
              name="warrantyPeriod"
              type="number"
              register={register}
              errors={errors}
              min="0"
              placeholder="Enter warranty period"
            />
            <FormSelect
              label="Condition"
              name="condition"
              register={register}
              errors={errors}
              options={conditionOptions}
              required
            />
          </div>

          {/* Dynamic Serial Number Grid with Upload Option */}
          {serialNumberGrid.length > 0 ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Serial Numbers (Select required fields for each item)
              </label>

              {/* Column Action Buttons with Upload */}
              <div className="mb-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {['MID', 'SID', 'TID', 'VpID'].map(field => (
                    <div key={field} className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectAllForField(field)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Select All {field}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeselectAllForField(field)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Deselect All {field}
                      </button>
                      <button
                        type="button"
                        onClick={() => openUploadModal(field)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Upload {field}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-600">
                  Upload files should contain one ID per line (txt format)
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded-md">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          S.No
                        </th>
                        {['MID', 'SID', 'TID', 'VpID'].map(field => (
                          <th key={field} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            <div className="flex flex-col items-center">
                              <span>{field}</span>
                              <span className="text-xs text-gray-400">Select & Enter/Upload</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {serialNumberGrid.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-sm text-gray-900 border-b">
                            {row.id}
                          </td>
                          {['MID', 'SID', 'TID', 'VpID'].map(field => (
                            <td key={field} className="px-3 py-2 border-b">
                              <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={row.selectedFields[field]}
                                    onChange={(e) => handleFieldSelection(row.id, field, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-600">Include {field}</span>
                                </label>
                                <input
                                  type="text"
                                  value={row[field]}
                                  onChange={(e) => handleSerialNumberChange(row.id, field, e.target.value)}
                                  disabled={!row.selectedFields[field]}
                                  className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                                    !row.selectedFields[field] ? 'bg-gray-100 text-gray-400' : ''
                                  }`}
                                  placeholder={row.selectedFields[field] ? `Enter ${field}` : 'Not selected'}
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
            </div>
          ) : (
            <FormTextarea
              label="Serial Numbers (TID/MID/SID/VPID/MOBNO)"
              name="serialNumbers"
              register={register}
              errors={errors}
              rows={3}
              placeholder="Enter quantity first to use the serial number grid, or enter serial numbers manually"
            />
          )}

          <div className="mt-4">
            <FormTextarea
              label="Remarks"
              name="remarks"
              register={register}
              errors={errors}
              rows={3}
              placeholder="Enter any additional remarks"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              reset()
              setSerialNumberGrid([])
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Inward Entry
          </button>
        </div>
      </form>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload {currentUploadField} Values</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select file (txt format, one {currentUploadField} per line)
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileUpload(e, currentUploadField)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Format example:</strong><br/>
                12345<br/>
                67890<br/>
                11111<br/>
                (One ID per line)
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

export default Inward