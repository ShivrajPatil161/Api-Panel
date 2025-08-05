import { useState } from 'react'
import { useForm } from 'react-hook-form'

// Reusable Form Components
const FormInput = ({ label, name, register, errors, required = false, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, { required: required && `${label} is required` })}
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

// Document Upload Component
const DocumentUpload = ({ label, name, register, errors, required = false, acceptedTypes = ".pdf,.jpg,.jpeg,.png" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      accept={acceptedTypes}
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Basic Details Component
const BasicDetailsForm = ({ register, errors, customerType }) => {
  const businessTypes = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'restaurant', label: 'Restaurant/Food' },
    { value: 'services', label: 'Services' },
    { value: 'grocery', label: 'Grocery/Supermarket' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'other', label: 'Other' }
  ]

  return (
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

        <FormSelect
          label="Business Type"
          name="businessType"
          register={register}
          errors={errors}
          required
          options={businessTypes}
        />

        <FormInput
          label="GST Number"
          name="gstNumber"
          register={register}
          errors={errors}
          required
          placeholder="Enter GST number"
        />

        <FormInput
          label="PAN Number"
          name="panNumber"
          register={register}
          errors={errors}
          required
          placeholder="Enter PAN number"
        />

        <FormInput
          label="Registration Number"
          name="registrationNumber"
          register={register}
          errors={errors}
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
}

// Contact Details Component
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
        placeholder="Primary mobile number"
      />

      <FormInput
        label="Primary Contact Email"
        name="primaryContactEmail"
        register={register}
        errors={errors}
        required
        type="email"
        placeholder="Primary email address"
      />

      <FormInput
        label="Alternate Mobile"
        name="alternateContactMobile"
        register={register}
        errors={errors}
        type="tel"
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

      <FormInput
        label="WhatsApp Number"
        name="whatsappNumber"
        register={register}
        errors={errors}
        type="tel"
        placeholder="WhatsApp number"
      />
    </div>
  </div>
)

// Document Upload Component
const DocumentsForm = ({ register, errors, customerType }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Upload</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DocumentUpload
        label="PAN Card"
        name="panCardDocument"
        register={register}
        errors={errors}
        required
      />

      <DocumentUpload
        label="GST Certificate"
        name="gstCertificate"
        register={register}
        errors={errors}
        required
      />

      <DocumentUpload
        label="Address Proof"
        name="addressProof"
        register={register}
        errors={errors}
        required
      />

      <DocumentUpload
        label="Bank Account Proof"
        name="bankProof"
        register={register}
        errors={errors}
        required
      />

      {customerType === 'franchise' && (
        <>
          <DocumentUpload
            label="Franchise Agreement"
            name="franchiseAgreement"
            register={register}
            errors={errors}
          />

          <DocumentUpload
            label="Trade License"
            name="tradeLicense"
            register={register}
            errors={errors}
          />
        </>
      )}
    </div>
  </div>
)

// Bank Details Component
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

// Franchise Selection Component
const FranchiseSelectionForm = ({ register, errors }) => {
  const [hasFranchise, setHasFranchise] = useState('')

  // Mock franchise data - replace with API call
  const availableFranchises = [
    { value: 'franchise_001', label: 'TechPay Solutions' },
    { value: 'franchise_002', label: 'Digital Commerce Hub' },
    { value: 'franchise_003', label: 'PayTech Partners' }
  ]

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Franchise Association</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Do you belong to a franchise?
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="yes"
                {...register('hasFranchise', { required: 'Please select an option' })}
                onChange={(e) => setHasFranchise(e.target.value)}
                className="mr-2"
              />
              <span>Yes, I belong to a franchise</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="no"
                {...register('hasFranchise', { required: 'Please select an option' })}
                onChange={(e) => setHasFranchise(e.target.value)}
                className="mr-2"
              />
              <span>No, I'm an independent merchant</span>
            </label>
          </div>
          {errors.hasFranchise && (
            <p className="mt-1 text-sm text-red-600">{errors.hasFranchise.message}</p>
          )}
        </div>

        {hasFranchise === 'yes' && (
          <FormSelect
            label="Select Your Franchise"
            name="franchiseId"
            register={register}
            errors={errors}
            required
            options={availableFranchises}
            placeholder="Choose your franchise"
          />
        )}
      </div>
    </div>
  )
}

// Main Onboarding Component
const CustomerOnboarding = ({
  merchant,
  onClose,
  isFranchiseContext = false,
  isModal = false
}) => {
  const [customerType, setCustomerType] = useState(
    isFranchiseContext ? 'merchant' : (merchant || "")
  )
  const [currentStep, setCurrentStep] = useState(isFranchiseContext ? 3 : 1)
  const [formData, setFormData] = useState({})

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const getStepsForCustomerType = () => {
    const baseSteps = ['Customer Type']

    if (customerType === 'franchise') {
      return [...baseSteps, 'Basic Details', 'Contact Details', 'Bank Details', 'Documents']
    } else if (customerType === 'merchant') {
      return [...baseSteps, 'Franchise Info', 'Basic Details', 'Contact Details', 'Bank Details', 'Documents']
    } else if (customerType === 'franchise_merchant') {
      return [...baseSteps, 'Basic Details', 'Contact Details', 'Bank Details', 'Documents']
    }

    return baseSteps
  }

  const steps = getStepsForCustomerType()

  const handleCustomerTypeSelect = (type) => {
    setCustomerType(type)
    setCurrentStep(2)
  }

  const handleStepSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }))

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      const finalData = { ...formData, ...data, customerType }
      console.log('Customer Onboarding Data:', finalData)

      const successMessage = isFranchiseContext
        ? 'Merchant added successfully!'
        : 'Customer onboarding completed successfully!'

      alert(successMessage)

      // Reset form
      reset()
      setFormData({})

      if (isFranchiseContext && onClose) {
        onClose()
      } else {
        setCurrentStep(1)
        setCustomerType('')
      }
    }
  }

  const goToPreviousStep = () => {
    const minStep = isFranchiseContext ? 3 : 1
    if (currentStep > minStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Get visible steps for progress bar
  const getVisibleSteps = () => {
    if (isFranchiseContext) {
      return steps.slice(2) // Skip 'Customer Type' and 'Franchise Info'
    }
    return steps
  }

  const visibleSteps = getVisibleSteps()
  const progressStepNumber = isFranchiseContext ? currentStep - 2 : currentStep

  // Container class based on context
  const containerClass = isModal
    ? "space-y-6"
    : "max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"

  return (
    <div className={containerClass}>
      {!isModal && (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Onboarding</h1>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {visibleSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 <= progressStepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600">{step}</span>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <div
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${((progressStepNumber - 1) / (visibleSteps.length - 1)) * 100}%` }}
          />
          <div
            className="flex-1 h-1 bg-gray-200"
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && !isFranchiseContext && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-6">Select Customer Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => handleCustomerTypeSelect('franchise')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-4xl mb-2">🏢</div>
                <h3 className="font-semibold">Franchise</h3>
                <p className="text-sm text-gray-600">Register as a franchise owner</p>
              </button>

              <button
                onClick={() => handleCustomerTypeSelect('merchant')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-4xl mb-2">🏪</div>
                <h3 className="font-semibold">Merchant</h3>
                <p className="text-sm text-gray-600">merchant onboarding</p>
              </button>
            </div>
          </div>
        )}

        {currentStep > 1 && (
          <div onSubmit={handleSubmit(handleStepSubmit)}>
            {/* Franchise Info Step - only for independent merchants and not in franchise context */}
            {currentStep === 2 && customerType === 'merchant' && !isFranchiseContext && (
              <FranchiseSelectionForm register={register} errors={errors} />
            )}

            {/* Basic Details Step */}
            {((currentStep === 2 && (customerType === 'franchise' || customerType === 'franchise_merchant')) ||
              (currentStep === 3 && customerType === 'merchant')) && (
                <BasicDetailsForm
                  register={register}
                  errors={errors}
                  customerType={isFranchiseContext ? 'merchant' : customerType}
                />
              )}

            {/* Contact Details Step */}
            {((currentStep === 3 && (customerType === 'franchise' || customerType === 'franchise_merchant')) ||
              (currentStep === 4 && customerType === 'merchant')) && (
                <ContactDetailsForm register={register} errors={errors} />
              )}

            {/* Bank Details Step */}
            {((currentStep === 4 && (customerType === 'franchise' || customerType === 'franchise_merchant')) ||
              (currentStep === 5 && customerType === 'merchant')) && (
                <BankDetailsForm register={register} errors={errors} />
              )}

            {/* Documents Step */}
            {((currentStep === 5 && (customerType === 'franchise' || customerType === 'franchise_merchant')) ||
              (currentStep === 6 && customerType === 'merchant')) && (
                <DocumentsForm
                  register={register}
                  errors={errors}
                  customerType={isFranchiseContext ? 'merchant' : customerType}
                />
              )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep <= (isFranchiseContext ? 3 : 1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleSubmit(handleStepSubmit)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentStep === steps.length ? (
                  isFranchiseContext ? 'Add Merchant' : (
                    customerType === 'franchise_merchant' ? 'Add Merchant' : 'Complete Onboarding'
                  )
                ) : 'Next Step'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerOnboarding