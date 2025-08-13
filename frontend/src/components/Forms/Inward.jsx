import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  X,
  Upload,
  FileText,
  Download
} from 'lucide-react'

// ==================== SCHEMAS & VALIDATION ====================

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
  serialNumbers: z.string().optional(),
  batchNumber: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  condition: z.string().min(1, 'Condition is required'),
  remarks: z.string().optional(),
})

// ==================== DUMMY DATA ====================

const initialInwardData = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    vendorId: 'VEN-001',
    vendorName: 'Tech Solutions Ltd',
    productId: 'PROD-001',
    productName: 'POS Terminal X1',
    productType: 'pos_machine',
    quantity: 5,
    receivedDate: '2024-01-15',
    receivedBy: 'John Doe',
    condition: 'new',
    status: 'Received',
    batchNumber: 'BATCH001',
    warrantyPeriod: '12',
    remarks: 'All items received in good condition'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    vendorId: 'VEN-002',
    vendorName: 'Digital Payments Inc',
    productId: 'PROD-002',
    productName: 'QR Scanner Pro',
    productType: 'qr_scanner',
    quantity: 10,
    receivedDate: '2024-01-16',
    receivedBy: 'Jane Smith',
    condition: 'new',
    status: 'Received',
    batchNumber: 'BATCH002',
    warrantyPeriod: '24',
    remarks: 'Fast delivery'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    vendorId: 'VEN-003',
    vendorName: 'Hardware World',
    productId: 'PROD-003',
    productName: 'Card Reader Basic',
    productType: 'card_reader',
    quantity: 15,
    receivedDate: '2024-01-17',
    receivedBy: 'Mike Johnson',
    condition: 'new',
    status: 'Pending',
    batchNumber: 'BATCH003',
    warrantyPeriod: '18',
    remarks: 'Pending quality check'
  }
]

// ==================== REUSABLE FORM COMPONENTS ====================

const FormInput = ({ label, name, register, errors, type = "text", required = false, disabled = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name)}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-200' : ''
        } ${errors[name] ? 'border-red-500' : ''}`}
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

const FormSelect = ({ label, name, register, errors, options, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : ''
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

const FormTextarea = ({ label, name, register, errors, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...register(name)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : ''
        }`}
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// ==================== SERIAL NUMBER GRID COMPONENT ====================

const SerialNumberGrid = ({ quantity, onGridChange }) => {
  const [serialGrid, setSerialGrid] = useState([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const serialFields = ['MID', 'SID', 'TID', 'VpID']

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
      setSerialGrid(newGrid)
      onGridChange && onGridChange(newGrid)
    } else {
      setSerialGrid([])
      onGridChange && onGridChange([])
    }
  }, [quantity, onGridChange])

  const handleSerialNumberChange = (rowId, field, value) => {
    const updatedGrid = serialGrid.map(row =>
      row.id === rowId ? { ...row, [field]: value } : row
    )
    setSerialGrid(updatedGrid)
    onGridChange && onGridChange(updatedGrid)
  }

  const handleFieldSelection = (rowId, field, checked) => {
    const updatedGrid = serialGrid.map(row =>
      row.id === rowId
        ? {
          ...row,
          selectedFields: { ...row.selectedFields, [field]: checked },
          [field]: checked ? row[field] : ''
        }
        : row
    )
    setSerialGrid(updatedGrid)
    onGridChange && onGridChange(updatedGrid)
  }

  const handleSelectAllForField = (field) => {
    const updatedGrid = serialGrid.map(row => ({
      ...row,
      selectedFields: { ...row.selectedFields, [field]: true }
    }))
    setSerialGrid(updatedGrid)
    onGridChange && onGridChange(updatedGrid)
  }

  const handleDeselectAllForField = (field) => {
    const updatedGrid = serialGrid.map(row => ({
      ...row,
      selectedFields: { ...row.selectedFields, [field]: false },
      [field]: ''
    }))
    setSerialGrid(updatedGrid)
    onGridChange && onGridChange(updatedGrid)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())

        // Parse CSV/Excel data - expecting columns: MID, SID, TID, VpID
        const dataRows = lines.slice(1) // Skip header row

        const updatedGrid = serialGrid.map((row, index) => {
          if (index < dataRows.length && dataRows[index]) {
            const columns = dataRows[index].split(/[,\t]/).map(col => col.trim())
            return {
              ...row,
              MID: columns[0] || '',
              SID: columns[1] || '',
              TID: columns[2] || '',
              VpID: columns[3] || '',
              selectedFields: {
                MID: !!columns[0],
                SID: !!columns[1],
                TID: !!columns[2],
                VpID: !!columns[3]
              }
            }
          }
          return row
        })

        setSerialGrid(updatedGrid)
        onGridChange && onGridChange(updatedGrid)
        setUploadModalOpen(false)
        alert(`Successfully uploaded data for ${Math.min(dataRows.length, serialGrid.length)} items!`)
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid CSV/Excel file with MID, SID, TID, VpID columns.')
      }
    }
    reader.readAsText(file)
  }

  const generateSampleFile = () => {
    const headers = 'MID,SID,TID,VpID'
    const sampleData = Array.from({ length: Math.min(serialGrid.length, 5) }, (_, i) =>
      `MID${String(i + 1).padStart(6, '0')},SID${String(i + 1).padStart(6, '0')},TID${String(i + 1).padStart(6, '0')},VP${String(i + 1).padStart(6, '0')}`
    ).join('\n')

    const csvContent = `${headers}\n${sampleData}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'serial_numbers_sample.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (serialGrid.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Serial Numbers (Select required fields for each item)
      </label>

      {/* Column Action Buttons */}
      <div className="mb-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          {serialFields.map(field => (
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
            </div>
          ))}
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Upload All IDs
          </button>
          <button
            type="button"
            onClick={generateSampleFile}
            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            Download Sample File
          </button>
        </div>
        <div className="text-xs text-gray-600">
          Upload Excel/CSV file with columns: MID, SID, TID, VpID (in that order)
        </div>
      </div>

      {/* Serial Number Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-md">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  S.No
                </th>
                {serialFields.map(field => (
                  <th key={field} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <div className="flex flex-col items-center">
                      <span>{field}</span>
                      <span className="text-xs text-gray-400">Select & Enter</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {serialGrid.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-sm text-gray-900 border-b">
                    {row.id}
                  </td>
                  {serialFields.map(field => (
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
                          className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!row.selectedFields[field] ? 'bg-gray-100 text-gray-400' : ''
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

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Serial Numbers</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Excel/CSV File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <strong>File Format:</strong><br />
                Excel/CSV file with 4 columns in this order:<br />
                <strong>MID | SID | TID | VpID</strong><br />
                <br />
                First row should contain headers.<br />
                Each subsequent row represents one item's IDs.
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

// ==================== INWARD FORM MODAL COMPONENT ====================

const InwardFormModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [serialGridData, setSerialGridData] = useState([])

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

  // Load edit data
  useEffect(() => {
    if (editData) {
      Object.keys(editData).forEach(key => {
        setValue(key, editData[key])
      })
    }
  }, [editData, setValue])

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

  const handleFormSubmit = (data) => {
    const submissionData = {
      ...data,
      serialNumberGrid: serialGridData,
      id: editData?.id || Date.now(), // Generate ID for new entries
      status: editData?.status || 'Pending'
    }
    onSubmit(submissionData)
    reset()
    setSerialGridData([])
    onClose()
  }

  const handleClose = () => {
    reset()
    setSerialGridData([])
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
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

              {/* Serial Number Grid */}
              <SerialNumberGrid
                quantity={quantity}
                onGridChange={setSerialGridData}
              />

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
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editData ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== VIEW MODAL COMPONENT ====================

const ViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null

  const productTypeLabels = {
    pos_machine: 'POS Machine',
    qr_scanner: 'QR Scanner',
    card_reader: 'Card Reader',
    printer: 'Thermal Printer',
    accessories: 'Accessories',
    other: 'Other'
  }

  const conditionLabels = {
    new: 'New',
    refurbished: 'Refurbished',
    used: 'Used',
    damaged: 'Damaged'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Inward Entry Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice & Vendor Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice & Vendor Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Invoice Number:</span>
                  <p className="text-gray-900">{data.invoiceNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vendor ID:</span>
                  <p className="text-gray-900">{data.vendorId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vendor Name:</span>
                  <p className="text-gray-900">{data.vendorName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Received Date:</span>
                  <p className="text-gray-900">{data.receivedDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Received By:</span>
                  <p className="text-gray-900">{data.receivedBy}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Product ID:</span>
                  <p className="text-gray-900">{data.productId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product Name:</span>
                  <p className="text-gray-900">{data.productName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product Type:</span>
                  <p className="text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {productTypeLabels[data.productType] || data.productType}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Quantity:</span>
                  <p className="text-gray-900 font-semibold">{data.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${data.status === 'Received'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {data.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Serial Numbers (if available) - positioned after quantity */}
          {data.serialNumberGrid && data.serialNumberGrid.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Serial Numbers / IDs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">S.No</th>
                      {['MID', 'SID', 'TID', 'VpID'].map(field => (
                        <th key={field} className="px-3 py-2 text-left">{field}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.serialNumberGrid.map((row, index) => (
                      <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2">{row.id}</td>
                        {['MID', 'SID', 'TID', 'VpID'].map(field => (
                          <td key={field} className="px-3 py-2">
                            {row.selectedFields && row.selectedFields[field] ? row[field] || '-' : 'Not Selected'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-600">Batch Number:</span>
                <p className="text-gray-900">{data.batchNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Warranty Period:</span>
                <p className="text-gray-900">{data.warrantyPeriod ? `${data.warrantyPeriod} months` : 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Condition:</span>
                <p className="text-gray-900">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {conditionLabels[data.condition] || data.condition}
                  </span>
                </p>
              </div>
            </div>

            {data.remarks && (
              <div className="mt-4">
                <span className="font-medium text-gray-600">Remarks:</span>
                <p className="text-gray-900 mt-1">{data.remarks}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== INWARD TABLE COMPONENT ====================

const InwardTable = ({ data, onEdit, onView, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const columns = useMemo(() => [
    {
      accessorKey: 'invoiceNumber',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-blue-600"
          onClick={() => column.toggleSorting()}
        >
          <span>Invoice Number</span>
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('invoiceNumber')}</div>
      ),
    },
    {
      accessorKey: 'vendorName',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-blue-600"
          onClick={() => column.toggleSorting()}
        >
          <span>Vendor Name</span>
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: 'productName',
      header: 'Product Name',
    },
    {
      accessorKey: 'productType',
      header: 'Product Type',
      cell: ({ row }) => {
        const productTypeLabels = {
          pos_machine: 'POS Machine',
          qr_scanner: 'QR Scanner',
          card_reader: 'Card Reader',
          printer: 'Thermal Printer',
          accessories: 'Accessories',
          other: 'Other'
        }
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {productTypeLabels[row.getValue('productType')] || row.getValue('productType')}
          </span>
        )
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-blue-600"
          onClick={() => column.toggleSorting()}
        >
          <span>Quantity</span>
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue('quantity')}</div>
      ),
    },
    {
      accessorKey: 'receivedDate',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-blue-600"
          onClick={() => column.toggleSorting()}
        >
          <span>Received Date</span>
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue('receivedDate')).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: 'receivedBy',
      header: 'Received By',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${status === 'Received'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(row.original)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(row.original)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="Edit Entry"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Delete Entry"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], [onEdit, onView, onDelete])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search entries..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN INWARD MANAGEMENT COMPONENT ====================

const InwardManagement = () => {
  const [inwardData, setInwardData] = useState(initialInwardData)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [viewingEntry, setViewingEntry] = useState(null)

  const handleAddNew = () => {
    setEditingEntry(null)
    setIsFormModalOpen(true)
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setIsFormModalOpen(true)
  }

  const handleView = (entry) => {
    setViewingEntry(entry)
    setIsViewModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setInwardData(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleFormSubmit = (data) => {
    if (editingEntry) {
      // Update existing entry
      setInwardData(prev =>
        prev.map(item => item.id === editingEntry.id ? { ...data, id: editingEntry.id } : item)
      )
    } else {
      // Add new entry
      setInwardData(prev => [...prev, data])
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inward Management</h1>
                <p className="text-gray-600 mt-1">Manage your inventory inward entries</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddNew}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Entry</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Entries</p>
                    <p className="text-2xl font-semibold text-blue-900">{inwardData.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-md">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Received</p>
                    <p className="text-2xl font-semibold text-green-900">
                      {inwardData.filter(item => item.status === 'Received').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-md">
                    <Upload className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-900">
                      {inwardData.filter(item => item.status === 'Pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg">
          <InwardTable
            data={inwardData}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <InwardFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false)
            setEditingEntry(null)
          }}
          onSubmit={handleFormSubmit}
          editData={editingEntry}
        />

        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setViewingEntry(null)
          }}
          data={viewingEntry}
        />
      </div>
    </div>
  )
}

export default InwardManagement