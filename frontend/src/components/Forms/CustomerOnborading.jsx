import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FileText, X, Download, Eye, Trash2 } from 'lucide-react'
import api from "../../constants/API/axiosInstance"
import { toast } from 'react-toastify'

// Form validation patterns
const VALIDATION_PATTERNS = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  mobile: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// File validation
const FILE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
}

// Document Preview Component
const DocumentPreview = ({ documentPath, documentName, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [blobUrl, setBlobUrl] = useState(null)

  const cleanPath = documentPath
    ?.replace(/\\\\/g, '/')
    ?.replace(/\\/g, '/')
    ?.replace(/^\/+/, '')

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(cleanPath || '')
  const isPdf = /\.pdf$/i.test(cleanPath || '')
  const filename = cleanPath?.split('/').pop()
  const apiUrl = cleanPath ? `/file/files/${cleanPath}` : null

  useEffect(() => {
    if (!apiUrl) return

    const fetchFile = async () => {
      try {
        setLoading(true)
        const response = await api.get(apiUrl, { responseType: 'blob' })
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        setBlobUrl(url)
        setLoading(false)
      } catch (error) {
        console.error('File fetch error:', error)
        setError('Failed to load document.')
        setLoading(false)
      }
    }

    fetchFile()

    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl)
      }
    }
  }, [apiUrl])

  const handleDownload = async () => {
    try {
      const response = await api.get(apiUrl, { responseType: 'blob' })
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Download failed. Please try again.')
    }
  }

  if (!cleanPath) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Document Not Found</h3>
          <p className="text-gray-600 mb-4">The document path is invalid or missing.</p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{documentName}</h3>
            <p className="text-sm text-gray-500">{filename}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleDownload} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Download">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <span className="text-gray-600">Loading document...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <h4 className="text-lg font-semibold mb-2">Error Loading Document</h4>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Try Download
              </button>
            </div>
          )}

          {isImage && !error && blobUrl && (
            <div className="flex justify-center">
              <img src={blobUrl} alt={documentName} className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          )}

          {isPdf && !error && blobUrl && (
            <iframe src={`${blobUrl}#toolbar=1`} className="w-full h-[600px] border-0 rounded-lg shadow-lg" title={documentName} />
          )}

          {!isImage && !isPdf && !error && !loading && (
            <div className="text-center py-8">
              <h4 className="text-lg font-semibold mb-2">Preview Not Available</h4>
              <p className="text-gray-600 mb-4">This document type cannot be previewed. You can download it to view.</p>
              <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Download Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable Form Components
const FormInput = ({ label, name, register, errors, required = false, type = "text", pattern, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, {
        required: required && `${label} is required`,
        pattern: pattern && {
          value: pattern,
          message: `Invalid ${label} format`
        }
      })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

const FormSelect = ({ label, name, register, errors, required = false, options, placeholder, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      <option value="">{placeholder || `Select ${label}`}</option>
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
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

const DocumentUpload = ({ label, name, register, errors, required = false, existingFile = null, onPreview = null, onDelete = null }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {existingFile && (
      <div className="mb-2 p-3 bg-blue-50 rounded border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">Current file uploaded</span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onPreview?.(existingFile, label)}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(name)}
                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )}

    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      {...register(name, {
        required: required && !existingFile && `${label} is required`,
        validate: {
          fileSize: (files) => {
            if (!files[0]) return true
            return files[0].size <= FILE_CONSTRAINTS.maxSize || 'File size must be less than 5MB'
          },
          fileType: (files) => {
            if (!files[0]) return true
            return FILE_CONSTRAINTS.allowedTypes.includes(files[0].type) || 'Only PDF, JPG, and PNG files are allowed'
          }
        }
      })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    <p className="mt-1 text-xs text-gray-500">
      Accepted formats: PDF, JPG, PNG (Max 5MB)
      {existingFile && " • Upload new file to replace existing one"}
    </p>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Customer Type Selection
const CustomerTypeSelection = ({ onSelect }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-8 text-gray-800">Select Customer Type</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <button
        onClick={() => onSelect('franchise')}
        className="group p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
      >
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
        <h3 className="text-xl font-semibold mb-2">Franchise</h3>
        <p className="text-gray-600">Register as a franchise owner with multiple locations</p>
      </button>

      <button
        onClick={() => onSelect('merchant')}
        className="group p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
      >
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
        <h3 className="text-xl font-semibold mb-2">Merchant</h3>
        <p className="text-gray-600">Register as an individual merchant business</p>
      </button>
    </div>
  </div>
)

// Franchise Selection Component
const FranchiseSelectionForm = ({ register, errors, franchises, loading }) => {
  const [association, setAssociation] = useState("franchise") // default can be 'franchise' or 'independent'

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Franchise Association</h3>

      {/* Radio buttons */}
      <div className="flex items-center space-x-6 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="independent"
            checked={association === "independent"}
            onChange={() => setAssociation("independent")}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Independent Merchant</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="franchise"
            checked={association === "franchise"}
            onChange={() => setAssociation("franchise")}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Belongs to Franchise</span>
        </label>
      </div>

      {/* Franchise dropdown only if "franchise" is selected */}
      {association === "franchise" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading franchises...</span>
            </div>
          ) : (
            <FormSelect
              label="Select Franchise"
              name="franchiseId"
              register={register}
              errors={errors}
              required
              options={franchises}
              placeholder="Choose the franchise"
            />
          )}
        </>
      )}
    </div>
  )
}

// Step Components
const BasicDetailsForm = ({ register, errors, customerType }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      {customerType === 'franchise' ? 'Franchise' : 'Merchant'} Basic Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label={customerType === 'franchise' ? 'Franchise Name' : 'Business Name'}
        name="businessName"
        register={register}
        errors={errors}
        required
        placeholder="Enter business name"
      />

      <FormInput
        label="Legal Entity Name"
        name="legalName"
        register={register}
        errors={errors}
        required
        placeholder="As per registration documents"
      />

      <FormInput
        label="Business Type"
        name="businessType"
        register={register}
        errors={errors}
        required
        placeholder="Enter business type"
      />

      <FormInput
        label="GST Number"
        name="gstNumber"
        register={register}
        errors={errors}
        pattern={VALIDATION_PATTERNS.gst}
        placeholder="Enter GST number"
      />

      <FormInput
        label="PAN Number"
        name="panNumber"
        register={register}
        errors={errors}
        required
        pattern={VALIDATION_PATTERNS.pan}
        placeholder="Enter PAN number"
      />

      <FormInput
        label="Registration Number"
        name="registrationNumber"
        register={register}
        errors={errors}
        required
        placeholder="Company/Shop registration number"
      />
    </div>

    <div className="mt-4">
      <FormTextarea
        label="Business Address"
        name="businessAddress"
        register={register}
        errors={errors}
        required
        rows={3}
        placeholder="Complete business address"
      />
    </div>
  </div>
)

const ContactDetailsForm = ({ register, errors }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Primary Contact Name"
        name="primaryContactName"
        register={register}
        errors={errors}
        required
        placeholder="Contact person name"
      />

      <FormInput
        label="Primary Contact Mobile"
        name="primaryContactMobile"
        register={register}
        errors={errors}
        required
        type="tel"
        pattern={VALIDATION_PATTERNS.mobile}
        placeholder="Primary mobile number"
      />

      <FormInput
        label="Primary Contact Email"
        name="primaryContactEmail"
        register={register}
        errors={errors}
        required
        type="email"
        pattern={VALIDATION_PATTERNS.email}
        placeholder="Primary email address"
      />

      <FormInput
        label="Alternate Mobile"
        name="alternateContactMobile"
        register={register}
        errors={errors}
        type="tel"
        pattern={VALIDATION_PATTERNS.mobile}
        placeholder="Alternate mobile number"
      />

      <FormInput
        label="Landline Number"
        name="landlineNumber"
        register={register}
        errors={errors}
        type="tel"
        placeholder="Landline with STD code"
      />
    </div>
  </div>
)

const BankDetailsForm = ({ register, errors }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Bank Name"
        name="bankName"
        register={register}
        errors={errors}
        required
        placeholder="Enter bank name"
      />

      <FormInput
        label="Account Holder Name"
        name="accountHolderName"
        register={register}
        errors={errors}
        required
        placeholder="As per bank records"
      />

      <FormInput
        label="Account Number"
        name="accountNumber"
        register={register}
        errors={errors}
        required
        placeholder="Bank account number"
      />

      <FormInput
        label="IFSC Code"
        name="ifscCode"
        register={register}
        errors={errors}
        required
        pattern={VALIDATION_PATTERNS.ifsc}
        placeholder="Bank IFSC code"
      />

      <FormInput
        label="Branch Name"
        name="branchName"
        register={register}
        errors={errors}
        required
        placeholder="Bank branch name"
      />

      <FormSelect
        label="Account Type"
        name="accountType"
        register={register}
        errors={errors}
        required
        options={[
          { value: 'current', label: 'Current Account' },
          { value: 'savings', label: 'Savings Account' }
        ]}
      />
    </div>
  </div>
)

const DocumentsForm = ({ register, errors, existingFiles = null, onDocumentPreview = null, onDocumentDelete = null }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Upload</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DocumentUpload
        label="PAN Card"
        name="panCardDocument"
        register={register}
        errors={errors}
        required
        existingFile={existingFiles?.panCardDocument || existingFiles?.panProof}
        onPreview={onDocumentPreview}
        onDelete={onDocumentDelete}
      />

      <DocumentUpload
        label="GST Certificate"
        name="gstCertificate"
        register={register}
        errors={errors}
        existingFile={existingFiles?.gstCertificate || existingFiles?.gstCertificateProof}
        onPreview={onDocumentPreview}
        onDelete={onDocumentDelete}
      />

      <DocumentUpload
        label="Address Proof"
        name="addressProof"
        register={register}
        errors={errors}
        required
        existingFile={existingFiles?.addressProof}
        onPreview={onDocumentPreview}
        onDelete={onDocumentDelete}
      />

      <DocumentUpload
        label="Bank Account Proof"
        name="bankProof"
        register={register}
        errors={errors}
        required
        existingFile={existingFiles?.bankProof || existingFiles?.bankAccountProof}
        onPreview={onDocumentPreview}
        onDelete={onDocumentDelete}
      />
    </div>
  </div>
)

// Main Component
const CustomerOnboarding = ({
  // Context props
  isModal = false,
  onClose = null,

  // Edit mode props
  isEditMode = false,
  customerData = null,
  customerId = null,
  customerType: propCustomerType = null,

  // Success callback
  onSuccess = null
}) => {
  // Check if user is franchise from localStorage
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType').toLowerCase() : null
  const franchiseId = typeof window !== 'undefined' ? localStorage.getItem('franchiseId') : null
  const isFranchiseContext = userType === 'franchise' && franchiseId

  // Initialize customer type
  const [customerType, setCustomerType] = useState(() => {
    if (propCustomerType) return propCustomerType
    if (isEditMode) return customerData?.franchiseName ? 'franchise' : 'merchant'
    if (isFranchiseContext) return 'merchant'
    return ''
  })

  

  // Initialize current step based on context
  const [currentStep, setCurrentStep] = useState(() => {
    if (isEditMode || isFranchiseContext) return 1
    if (customerType) return customerType === 'merchant' ? 2 : 2 // Start from step 2 for both after type selection
    return 1 // Start from customer type selection
  })

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [documentPreview, setDocumentPreview] = useState(null)
  const [franchises, setFranchises] = useState([])
  const [franchiseLoading, setFranchiseLoading] = useState(false)

  // Form with default values for edit mode
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: isEditMode ? {
      businessName: customerData?.businessName || customerData?.franchiseName || '',
      legalName: customerData?.legalName || '',
      businessType: customerData?.businessType || '',
      gstNumber: customerData?.gstNumber || '',
      panNumber: customerData?.panNumber || '',
      registrationNumber: customerData?.registrationNumber || '',
      businessAddress: customerData?.businessAddress || customerData?.address || '',
      primaryContactName: customerData?.contactPerson?.name || customerData?.primaryContactName || '',
      primaryContactMobile: customerData?.contactPerson?.phoneNumber || customerData?.primaryContactMobile || '',
      primaryContactEmail: customerData?.contactPerson?.email || customerData?.primaryContactEmail || '',
      alternateContactMobile: customerData?.alternatePhoneNum || '',
      landlineNumber: customerData?.landlineNumber || '',
      bankName: customerData?.bankDetails?.bankName || '',
      accountHolderName: customerData?.bankDetails?.accountHolderName || '',
      accountNumber: customerData?.bankDetails?.accountNumber || '',
      ifscCode: customerData?.bankDetails?.ifsc || '',
      branchName: customerData?.bankDetails?.branchName || '',
      accountType: customerData?.bankDetails?.accountType || ''
    } : {}
  })

  // Fetch franchises for merchant selection
  const fetchFranchises = async () => {
    try {
      setFranchiseLoading(true)
      const response = await api.get('/franchise')
      const franchiseOptions = response.data.map(franchise => ({
        value: franchise.id,
        label: franchise.franchiseName
      }))
      setFranchises(franchiseOptions)
    } catch (err) {
      console.error('Error fetching franchises:', err)
      toast.error('Failed to load franchises')
    } finally {
      setFranchiseLoading(false)
    }
  }

  // Handle customer type selection
  const handleCustomerTypeSelect = (type) => {
    setCustomerType(type)
    if (type === 'merchant') {
      fetchFranchises()
    }
    setCurrentStep(2) // Always go to step 2 after type selection
  }

  // Get steps configuration based on context
  const getStepsConfig = () => {
    if (isFranchiseContext) {
      return {
        steps: ['Basic Details', 'Contact Details', 'Bank Details', 'Documents'],
        stepMap: {
          1: 'basic',
          2: 'contact',
          3: 'bank',
          4: 'documents'
        }
      }
    }

    if (isEditMode) {
      return {
        steps: ['Basic Details', 'Contact Details', 'Bank Details', 'Documents'],
        stepMap: {
          1: 'basic',
          2: 'contact',
          3: 'bank',
          4: 'documents'
        }
      }
    }

    if (customerType === 'franchise') {
      return {
        steps: ['Customer Type', 'Basic Details', 'Contact Details', 'Bank Details', 'Documents'],
        stepMap: {
          1: 'customerType',
          2: 'basic',
          3: 'contact',
          4: 'bank',
          5: 'documents'
        }
      }
    } else if (customerType === 'merchant') {
      return {
        steps: ['Customer Type', 'Franchise Selection', 'Basic Details', 'Contact Details', 'Bank Details', 'Documents'],
        stepMap: {
          1: 'customerType',
          2: 'franchise',
          3: 'basic',
          4: 'contact',
          5: 'bank',
          6: 'documents'
        }
      }
    }

    return {
      steps: ['Customer Type'],
      stepMap: {
        1: 'customerType'
      }
    }
  }

  const { steps, stepMap } = getStepsConfig()
  const currentStepType = stepMap[currentStep]

  // Create form data for submission
  const createFormData = (data) => {
    const formDataObj = new FormData()

    // Add franchise ID based on context
    if (isFranchiseContext) {
      formDataObj.append('franchiseId', franchiseId.toString())
    } else if (data.franchiseId) {
      formDataObj.append('franchiseId', data.franchiseId.toString())
    }

    // For franchise, use franchiseName field
    if (customerType === 'franchise') {
      formDataObj.append('franchiseName', data.businessName)
    }

    // Append text fields
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'string' && key !== 'businessName') {
        formDataObj.append(key, data[key])
      }
    })

    // Handle business name vs franchise name
    if (customerType === 'merchant') {
      formDataObj.append('businessName', data.businessName)
    }

    // Append files - only new files will be sent
    const fileFields = ['panCardDocument', 'gstCertificate', 'addressProof', 'bankProof']
    fileFields.forEach(field => {
      if (data[field] && data[field][0]) {
        formDataObj.append(field, data[field][0])
      }
    })

    return formDataObj
  }

  // Handle step submission
  const handleStepSubmit = async (data) => {
    setError('')
    const updatedFormData = { ...formData, ...data }
    setFormData(updatedFormData)

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      setLoading(true)

      try {
        if (isEditMode) {
          // Edit mode - use PUT
          const formDataToSend = createFormData(updatedFormData)
          const endpoint = customerType === 'franchise' ? `/franchise/${customerId}` : `/merchants/${customerId}`
          await api.put(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          toast.success(`${customerType === 'franchise' ? 'Franchise' : 'Merchant'} updated successfully!`)
        } else {
          // Create mode
          const formDataToSend = createFormData(updatedFormData)
          const endpoint = customerType === 'franchise' ? '/franchise' : '/merchants'
          await api.post(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          toast.success(`${customerType === 'franchise' ? 'Franchise' : 'Merchant'} added successfully!`)
        }

        // Reset form
        reset()
        setFormData({})

        // Reset to initial step based on context
        if (isFranchiseContext || isEditMode) {
          setCurrentStep(1)
        } else {
          setCurrentStep(1)
          setCustomerType('')
        }

        // Call success callback and close modal
        onSuccess?.()
        onClose?.()

      } catch (err) {
        console.error('API Error:', err)
        setError(
          err.response?.data?.message ||
          `An error occurred during ${isEditMode ? 'update' : 'submission'}. Please try again.`
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleDocumentPreview = (filePath, documentName) => {
    setDocumentPreview({ documentPath: filePath, documentName })
  }

  const handleDocumentDelete = async (fieldName) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const endpoint = customerType === 'franchise' ? `/franchise/${customerId}/document/${fieldName}` : `/merchants/${customerId}/document/${fieldName}`
        await api.delete(endpoint)
        toast.success('Document deleted successfully')
        // Clear the field value
        setValue(fieldName, null)
        // Refresh customer data if needed
        if (onSuccess) {
          onSuccess()
        }
      } catch (error) {
        toast.error('Failed to delete document')
      }
    }
  }

  // Set initial step based on context
  useEffect(() => {
    if (isFranchiseContext) {
      setCustomerType('merchant')
      setCurrentStep(1)
    } else if (isEditMode) {
      setCurrentStep(1)
    }
  }, [isFranchiseContext, isEditMode])

  const containerClass = isModal
    ? "space-y-6"
    : "max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg"

  const renderStepContent = () => {
    // Customer Type Selection
    if (currentStepType === 'customerType') {
      return <CustomerTypeSelection onSelect={handleCustomerTypeSelect} />
    }

    return (
      <form onSubmit={handleSubmit(handleStepSubmit)}>
        {/* Franchise Selection - for merchants only */}
        {currentStepType === 'franchise' && (
          <FranchiseSelectionForm
            register={register}
            errors={errors}
            franchises={franchises}
            loading={franchiseLoading}
          />
        )}

        {/* Basic Details */}
        {currentStepType === 'basic' && (
          <BasicDetailsForm
            register={register}
            errors={errors}
            customerType={customerType}
          />
        )}

        {/* Contact Details */}
        {currentStepType === 'contact' && (
          <ContactDetailsForm register={register} errors={errors} />
        )}

        {/* Bank Details */}
        {currentStepType === 'bank' && (
          <BankDetailsForm register={register} errors={errors} />
        )}

        {/* Documents */}
        {currentStepType === 'documents' && (
          <DocumentsForm
            register={register}
            errors={errors}
            existingFiles={isEditMode ? customerData?.uploadDocuments : null}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDelete={isEditMode ? handleDocumentDelete : null}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Navigation Buttons - Only show for form steps, not customer type selection */}
        {currentStepType !== 'customerType' && (
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (
                currentStep === steps.length ? (
                  isEditMode ? `Update ${customerType === 'franchise' ? 'Franchise' : 'Merchant'}` :
                    `Add ${customerType === 'franchise' ? 'Franchise' : 'Merchant'}`
                ) : 'Next Step'
              )}
            </button>
          </div>
        )}
      </form>
    )
  }

  return (
    <>
      <div className={containerClass}>
        {!isModal && (
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? `Edit ${customerType === 'franchise' ? 'Franchise' : 'Merchant'}` :
              isFranchiseContext ? 'Add Merchant' :
                'Customer Onboarding'}
          </h1>
        )}

        {/* Progress Steps - Only show for multi-step process */}
        {steps.length > 1 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isActive = stepNumber <= currentStep
                const isCompleted = stepNumber < currentStep

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted
                        ? 'bg-green-600 text-white'
                        : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    <span className="text-xs mt-1 text-gray-600 text-center">{step}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex mt-2">
              <div
                className="h-1 bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                }}
              />
              <div className="flex-1 h-1 bg-gray-200" />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Document Preview Modal */}
      {documentPreview && (
        <DocumentPreview
          documentPath={documentPreview.documentPath}
          documentName={documentPreview.documentName}
          onClose={() => setDocumentPreview(null)}
        />
      )}
    </>
  )
}

export default CustomerOnboarding