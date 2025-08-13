import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X } from 'lucide-react'

// ==================== FORM COMPONENTS ====================

// Reusable Input Component
const Input = ({ label, name, register, errors, required = false, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...register(name, {
        required: required ? `${label} is required` : false,
        ...(type === 'email' && { pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })
      })}
      type={type}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
    )}
  </div>
)

// Reusable Select Component
const Select = ({ label, name, register, errors, options, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, { required: required ? `${label} is required` : false })}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      {...props}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
    )}
  </div>
)

// Vendor and Product Selection Component
const VendorProductDetails = ({ register, errors }) => {
  // Mock data - replace with actual API calls
  const vendorOptions = [
    { value: '1', label: 'Vendor A' },
    { value: '2', label: 'Vendor B' }
  ]

  const productOptions = [
    { value: '1', label: 'POS Machine' },
    { value: '2', label: 'QR Code Scanner' }
  ]

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Vendor & Product Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Vendor"
          name="vendorId"
          register={register}
          errors={errors}
          options={vendorOptions}
          required
        />
        <Select
          label="Product"
          name="productId"
          register={register}
          errors={errors}
          options={productOptions}
          required
        />
        <Input
          label="Product Code"
          name="productCode"
          register={register}
          errors={errors}
          required
          placeholder="Enter product code"
        />
        <Input
          label="Effective Date"
          name="effectiveDate"
          register={register}
          errors={errors}
          type="date"
          required
        />
        <Input
          label="Expiry Date"
          name="expiryDate"
          register={register}
          errors={errors}
          type="date"
          required
        />
      </div>
    </div>
  )
}

// Monthly Rent Component
const MonthlyRent = ({ register, errors }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Rent</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monthly Rent (₹)"
          name="monthlyRent"
          register={register}
          errors={errors}
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="Enter monthly rent"
        />
      </div>
    </div>
  )
}

// Card Rate Item Component
const CardRateItem = ({ index, register, errors, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Type <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`vendorCardRates.${index}.cardType`, { required: 'Card type is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter card type"
        />
        {errors.vendorCardRates?.[index]?.cardType && (
          <p className="mt-1 text-sm text-red-500">{errors.vendorCardRates[index].cardType.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`vendorCardRates.${index}.rate`, {
            required: 'Rate is required',
            min: { value: 0, message: 'Rate must be positive' },
            max: { value: 100, message: 'Rate cannot exceed 100%' }
          })}
          type="number"
          step="0.01"
          min="0"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 2.5"
        />
        {errors.vendorCardRates?.[index]?.rate && (
          <p className="mt-1 text-sm text-red-500">{errors.vendorCardRates[index].rate.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        title="Remove card type"
      >
        <X size={20} />
      </button>
    </div>
  )
}

// Card Rates Component
const CardRates = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendorCardRates"
  })

  const [selectedCardType, setSelectedCardType] = useState('')

  const predefinedCardTypes = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' },
    { value: 'American Express', label: 'American Express' }
  ]

  const addPredefinedCardRate = () => {
    if (selectedCardType) {
      append({ cardType: selectedCardType, rate: '' })
      setSelectedCardType('')
    }
  }

  const addCustomCardRate = () => {
    append({ cardType: '', rate: '' })
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Card Processing Rates</h3>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <select
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select predefined type</option>
              {predefinedCardTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addPredefinedCardRate}
              disabled={!selectedCardType}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Selected
            </button>
          </div>

          <button
            type="button"
            onClick={addCustomCardRate}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Add Custom Type
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <CardRateItem
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
          />
        ))}
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No card types added yet.</p>
            <p className="text-xs mt-1">Use the buttons above to add predefined types or create custom ones.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VENDOR RATE FORM MODAL ====================
const VendorRateForm = ({ onCancel, onSubmit, initialData = null, isEdit = false }) => {
  const getDefaultValues = () => ({
    vendorId: '',
    productId: '',
    productCode: '',
    effectiveDate: '',
    expiryDate: '',
    monthlyRent: '',
    vendorCardRates: [],
    remark: ''
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || getDefaultValues()
  })

  const onFormSubmit = (data) => {
    const filteredData = {
      ...data,
      vendorCardRates: data.vendorCardRates.filter(rate => rate.rate && parseFloat(rate.rate) > 0 && rate.cardType.trim())
    }

    onSubmit(filteredData)
    onCancel()
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Vendor Rates' : 'Add New Vendor Rates'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            title="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-6">
            <VendorProductDetails register={register} errors={errors} />
            <MonthlyRent register={register} errors={errors} />
            <CardRates control={control} register={register} errors={errors} />

            {/* Remarks */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  {...register('remark')}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional remarks about the vendor rates"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onFormSubmit)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {isEdit ? 'Update Vendor Rates' : 'Save Vendor Rates'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorRateForm