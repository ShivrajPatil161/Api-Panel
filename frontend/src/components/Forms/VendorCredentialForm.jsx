import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Key, Globe, Shield, User, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../constants/API/axiosInstance';

// Validation Schema
const vendorCredentialSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  product: z.string().min(1, 'Product is required'),
  
  tokenUrlUat: z.string().min(1, 'Token URL UAT is required').url('Invalid URL format'),
  tokenUrlProd: z.string().min(1, 'Token URL Prod is required').url('Invalid URL format'),
  baseUrlUat: z.string().min(1, 'Base URL UAT is required').url('Invalid URL format'),
  baseUrlProd: z.string().min(1, 'Base URL Prod is required').url('Invalid URL format'),
  

  isActive: z.boolean()
});

// Reusable Components
const FormInput = ({ label, name, control, error, required = false, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      )}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

const FormSelect = ({ label, name, control, error, required = false, options = [], placeholder = "Select an option" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

const StatusToggle = ({ label, name, control, activeLabel = "Active", inactiveLabel = "Inactive", activeColor = "green" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              field.value
                ? `bg-${activeColor}-100 text-${activeColor}-700 border border-${activeColor}-300`
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {field.value ? (
              <ToggleRight className="h-5 w-5" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
            <span className="font-medium">
              {field.value ? activeLabel : inactiveLabel}
            </span>
          </button>
        </div>
      )}
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
    <Icon className="h-5 w-5 mr-2 text-blue-600" />
    {title}
  </h2>
);

const FormSection = ({ title, icon, children }) => (
  <div>
    <SectionHeader icon={icon} title={title} />
    {children}
  </div>
);

const GridLayout = ({ columns = 2, children }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
    {children}
  </div>
);

const Modal = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-t-lg sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-gray-100">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const FormActions = ({ onCancel, isSubmitting, isEdit }) => (
  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isSubmitting ? 'Saving...' : isEdit ? 'Update Credential' : 'Create Credential'}
    </button>
  </div>
);

const VendorCredentialForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(vendorCredentialSchema),
    defaultValues: initialData || {
      vendor: '',
      product: '',
      
      tokenUrlUat: '',
      tokenUrlProd: '',
      baseUrlUat: '',
      baseUrlProd: '',
      callbackUrl:'',
      isActive: true,
    },
  })

  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)

  const selectedVendor = watch('vendor')

  // ✅ Fetch vendors when modal opens
  useEffect(() => {
   
      fetchVendors()
   
  }, [])

  // ✅ Fetch products when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      fetchProductsByVendor(selectedVendor)
    } else {
      setProducts([])
    }
  }, [selectedVendor])

  // ✅ Fetch vendors
  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vendors/id_name')
      const vendorOptions = response.data.map(vendor => ({
        value: vendor.id.toString(),
        label: vendor.name,
        id: vendor.id,
      }))
      setVendors(vendorOptions)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch products by vendor
  const fetchProductsByVendor = async (vendorId, preselectedProductId = null) => {
    try {
      setProductsLoading(true)
      const response = await api.get(`/products/vendor/${vendorId}`)
      const productOptions = response.data.map(product => ({
        value: product.id.toString(),
        label: `${product.productCode} - ${product.productName}`,
        id: product.id,
      }))
      setProducts(productOptions)

      // preselect if editing existing credential
      if (preselectedProductId) {
        setValue('product', preselectedProductId.toString())
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  // ✅ Preload products if editing
  useEffect(() => {
    if (initialData?.vendor && initialData?.product) {
      fetchProductsByVendor(initialData.vendor, initialData.product)
    }
  }, [initialData])

  const handleFormSubmit = (data) => {
    onSubmit(data)
    //reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal
      title={initialData ? 'Edit Vendor Credential' : 'Add New Vendor Credential'}
      subtitle={
        initialData
          ? 'Update vendor API credentials'
          : 'Register new vendor API credentials'
      }
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Basic Information */}
        <FormSection title="Basic Information" icon={Building2}>
          <GridLayout columns={2}>
            <FormSelect
              label="Vendor"
              name="vendor"
              control={control}
              error={errors.vendor}
              required
              options={vendors}
              placeholder={loading ? 'Loading vendors...' : 'Select Vendor'}
              disabled={loading}
            />

            <FormSelect
              label="Product"
              name="product"
              control={control}
              error={errors.product}
              required
              options={products}
              placeholder={
                selectedVendor
                  ? productsLoading
                    ? 'Loading products...'
                    : 'Select Product'
                  : 'Select vendor first'
              }
              disabled={!selectedVendor || productsLoading}
            />
          </GridLayout>
        </FormSection>

      

        {/* URLs */}
        <FormSection title="UAT Environment URLs" icon={Globe}>
          <GridLayout columns={2}>
            <FormInput
              label="Token URL UAT"
              name="tokenUrlUat"
              control={control}
              error={errors.tokenUrlUat}
              required
              placeholder="https://uat.example.com/token"
            />
            <FormInput
              label="Base URL UAT"
              name="baseUrlUat"
              control={control}
              error={errors.baseUrlUat}
              required
              placeholder="https://uat.example.com/api"
            />
          </GridLayout>
        </FormSection>

        <FormSection title="Production Environment URLs" icon={Globe}>
          <GridLayout columns={2}>
            <FormInput
              label="Token URL Prod"
              name="tokenUrlProd"
              control={control}
              error={errors.tokenUrlProd}
              required
              placeholder="https://prod.example.com/token"
            />
            <FormInput
              label="Base URL Prod"
              name="baseUrlProd"
              control={control}
              error={errors.baseUrlProd}
              required
              placeholder="https://prod.example.com/api"
            />
          </GridLayout>
        </FormSection>

        {/* Status */}
        <FormSection title="Configuration" icon={User}>
          <GridLayout columns={2}>
            <StatusToggle
              label="Status"
              name="isActive"
              control={control}
              activeLabel="Active"
              inactiveLabel="Inactive"
              activeColor="green"
            />
            <FormInput
              label="Callback url"
              name="callbackUrl"
              control={control}
              error={errors.callbackUrl}
              
              placeholder="https://callbackUrl/"
            />
          </GridLayout>
        </FormSection>

        {/* Form Actions */}
        <FormActions
          onCancel={handleClose}
          isSubmitting={isSubmitting}
          isEdit={!!initialData}
        />
      </form>
    </Modal>
  )
}

export default VendorCredentialForm
