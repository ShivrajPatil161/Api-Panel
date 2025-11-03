import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Key, Globe, Shield, User, ToggleLeft, ToggleRight } from 'lucide-react';

// Validation Schema
const vendorCredentialSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  product: z.string().min(1, 'Product is required'),
  token: z.string().optional(),
  tokenUrlUat: z.string().min(1, 'Token URL UAT is required').url('Invalid URL format'),
  tokenUrlProd: z.string().min(1, 'Token URL Prod is required').url('Invalid URL format'),
  baseUrlUat: z.string().min(1, 'Base URL UAT is required').url('Invalid URL format'),
  baseUrlProd: z.string().min(1, 'Base URL Prod is required').url('Invalid URL format'),
  clientId: z.string().optional(),
  saltKey: z.string().optional(),
  clientSecret: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),

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

// Main Component
const VendorCredentialForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  mode = 'create'
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(vendorCredentialSchema),
    defaultValues: initialData || {
      vendor: '',
      product: '',
      token: '',
      tokenUrlUat: '',
      tokenUrlProd: '',
      baseUrlUat: '',
      baseUrlProd: '',
      clientId: '',
      saltKey: '',
      clientSecret: '',
      username: '',
      password: '',
      
      isActive: true
    }
  });

  

  // Mock data
  const vendorOptions = [
    { value: 'vendor1', label: 'Vendor 1' },
    { value: 'vendor2', label: 'Vendor 2' },
    { value: 'vendor3', label: 'Vendor 3' },
    { value: 'vendor4', label: 'Vendor 4' }
  ];

  const productOptions = [
    { value: 'recharge', label: 'Recharge' },
    { value: 'bill_payment', label: 'Bill Payment' },
    { value: 'dth', label: 'DTH' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water' }
  ];

  

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={mode === 'create' ? 'Add New Vendor Credential' : 'Edit Vendor Credential'}
      subtitle={mode === 'create' ? 'Register new vendor API credentials' : 'Update vendor API credentials'}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
        {/* Basic Information */}
        <FormSection title="Basic Information" icon={Building2}>
          <GridLayout columns={2}>
            <FormSelect
              label="Vendor"
              name="vendor"
              control={control}
              error={errors.vendor}
              required
              options={vendorOptions}
              placeholder="Select Vendor"
            />

            <FormSelect
              label="Product"
              name="product"
              control={control}
              error={errors.product}
              required
              options={productOptions}
              placeholder="Select Product"
            />
          </GridLayout>
        </FormSection>

        {/* Authentication Information */}
        <FormSection title="Authentication Information" icon={Shield}>
          <div className="space-y-6">
            <GridLayout columns={2}>
              <FormInput
              label="Token"
              name="token"
              control={control}
              error={errors.token}
              placeholder="Enter authentication token"
            />

             <FormInput
                label="Salt Key"
                name="saltKey"
                control={control}
                error={errors.saltKey}
                placeholder="Enter salt key"
              />
            </GridLayout>

            <GridLayout columns={2}>
              <FormInput
                label="Client ID"
                name="clientId"
                control={control}
                error={errors.clientId}
                placeholder="Enter client ID"
              />

             

              <FormInput
                label="Client Secret"
                name="clientSecret"
                control={control}
                error={errors.clientSecret}
                type="password"
                placeholder="Enter client secret"
              />

              <FormInput
                label="Username"
                name="username"
                control={control}
                error={errors.username}
                placeholder="Enter username"
              />

              <FormInput
                label="Password"
                name="password"
                control={control}
                error={errors.password}
                type="password"
                placeholder="Enter password"
              />
            </GridLayout>
          </div>
        </FormSection>

        {/* API URLs - UAT Environment */}
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
              placeholder="https://something.example.com/api"
            />
          </GridLayout>
        </FormSection>

        {/* API URLs - Production Environment */}
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

        {/* Configuration */}
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
          </GridLayout>

          
        </FormSection>

        {/* Form Actions */}
        <FormActions
          onCancel={handleClose}
          isSubmitting={isSubmitting}
          isEdit={mode === 'edit'}
        />
      </form>
    </Modal>
  );
};

export default VendorCredentialForm;