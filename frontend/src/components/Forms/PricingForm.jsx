import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X, Plus } from 'lucide-react'

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

// Card Rate Item Component for Direct Merchants
const DirectMerchantCardRateItem = ({ index, register, errors, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`cardRates.${index}.cardName`, { required: 'Card name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter card name"
        />
        {errors.cardRates?.[index]?.cardName && (
          <p className="mt-1 text-sm text-red-500">{errors.cardRates[index].cardName.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`cardRates.${index}.rate`, {
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
        {errors.cardRates?.[index]?.rate && (
          <p className="mt-1 text-sm text-red-500">{errors.cardRates[index].rate.message}</p>
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

// Card Rate Item Component for Franchises
const FranchiseCardRateItem = ({ index, register, errors, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`cardRates.${index}.cardName`, { required: 'Card name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter card name"
        />
        {errors.cardRates?.[index]?.cardName && (
          <p className="mt-1 text-sm text-red-500">{errors.cardRates[index].cardName.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Franchise Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`cardRates.${index}.franchiseRate`, {
            required: 'Franchise rate is required',
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
        {errors.cardRates?.[index]?.franchiseRate && (
          <p className="mt-1 text-sm text-red-500">{errors.cardRates[index].franchiseRate.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Merchant Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`cardRates.${index}.merchantRate`, {
            required: 'Merchant rate is required',
            min: { value: 0, message: 'Rate must be positive' },
            max: { value: 100, message: 'Rate cannot exceed 100%' }
          })}
          type="number"
          step="0.01"
          min="0"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 3.0"
        />
        {errors.cardRates?.[index]?.merchantRate && (
          <p className="mt-1 text-sm text-red-500">{errors.cardRates[index].merchantRate.message}</p>
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
const CardRates = ({ control, register, errors, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cardRates"
  })

  const [selectedCardType, setSelectedCardType] = useState('')
  const customerType = watch('customerType')

  const predefinedCardTypes = [
    { value: 'visa_credit', label: 'Visa Credit Card' },
    { value: 'visa_debit', label: 'Visa Debit Card' },
    { value: 'mastercard_credit', label: 'Mastercard Credit' },
    { value: 'mastercard_debit', label: 'Mastercard Debit' },
    { value: 'american_express', label: 'American Express' },
    { value: 'rupay', label: 'RuPay' },
    { value: 'diners_club', label: 'Diners Club' }
  ]

  const addPredefinedCardRate = () => {
    if (selectedCardType) {
      const cardTypeLabel = predefinedCardTypes.find(type => type.value === selectedCardType)?.label || selectedCardType

      if (customerType === 'franchise') {
        append({ cardName: cardTypeLabel, franchiseRate: '', merchantRate: '' })
      } else {
        append({ cardName: cardTypeLabel, rate: '' })
      }
      setSelectedCardType('')
    }
  }

  const addCustomCardRate = () => {
    if (customerType === 'franchise') {
      append({ cardName: '', franchiseRate: '', merchantRate: '' })
    } else {
      append({ cardName: '', rate: '' })
    }
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
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Custom Type
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          customerType === 'franchise' ? (
            <FranchiseCardRateItem
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
            />
          ) : (
            <DirectMerchantCardRateItem
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
            />
          )
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

// ==================== PRICING SCHEME FORM MODAL ====================
const PricingSchemeFormModal = ({ onCancel, onSubmit, initialData = null, isEdit = false }) => {
  const getDefaultValues = () => ({
    schemeCode: '',
    rentalByMonth: '',
    customerType: '',
    cardRates: [],
    description: ''
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: initialData || getDefaultValues()
  })

  const customerTypeOptions = [
    { value: 'franchise', label: 'Franchise' },
    { value: 'direct_merchant', label: 'Direct Merchant' }
  ]

  const onFormSubmit = (data) => {
    const filteredData = {
      ...data,
      cardRates: data.cardRates.filter(rate => {
        if (data.customerType === 'franchise') {
          return rate.franchiseRate && parseFloat(rate.franchiseRate) > 0 &&
            rate.merchantRate && parseFloat(rate.merchantRate) > 0 &&
            rate.cardName.trim()
        } else {
          return rate.rate && parseFloat(rate.rate) > 0 && rate.cardName.trim()
        }
      })
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
            {isEdit ? 'Edit Pricing Scheme' : 'Add New Pricing Scheme'}
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
            {/* Basic Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Scheme Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Scheme Code"
                  name="schemeCode"
                  register={register}
                  errors={errors}
                  required
                  placeholder="e.g., SCHEME_001"
                />
                <Input
                  label="Rental by Month (₹)"
                  name="rentalByMonth"
                  register={register}
                  errors={errors}
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter monthly rental"
                />
                <Select
                  label="Customer Type"
                  name="customerType"
                  register={register}
                  errors={errors}
                  options={customerTypeOptions}
                  required
                />
              </div>
            </div>

            {/* Card Rates */}
            {watch('customerType') && (
              <CardRates control={control} register={register} errors={errors} watch={watch} />
            )}

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description for this pricing scheme"
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
                {isEdit ? 'Update Scheme' : 'Save Scheme'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSchemeFormModal