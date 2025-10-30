import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X, Plus } from 'lucide-react'
import api from '../../constants/API/axiosInstance'

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
const   Select = ({ label, name, register, errors, options, required = false, ...props }) => (
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

// Channel Rate Item Component for Direct Merchants
const DirectMerchantChannelRateItem = ({ index, register, errors, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Channel Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`channelRates.${index}.channelName`, { required: 'Channel name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter channel name"
        />
        {errors.channelRates?.[index]?.channelName && (
          <p className="mt-1 text-sm text-red-500">{errors.channelRates[index].channelName.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`channelRates.${index}.rate`, {
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
        {errors.channelRates?.[index]?.rate && (
          <p className="mt-1 text-sm text-red-500">{errors.channelRates[index].rate.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        title="Remove channel type"
      >
        <X size={20} />
      </button>
    </div>
  )
}

// Channel Rate Item Component for Franchises
const FranchiseChannelRateItem = ({ index, register, errors, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Channel Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`channelRates.${index}.channelName`, { required: 'Channel name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter channel name"
        />
        {errors.channelRates?.[index]?.channelName && (
          <p className="mt-1 text-sm text-red-500">{errors.channelRates[index].channelName.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Franchise Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`channelRates.${index}.franchiseRate`, {
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
        {errors.channelRates?.[index]?.franchiseRate && (
          <p className="mt-1 text-sm text-red-500">{errors.channelRates[index].franchiseRate.message}</p>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Merchant Rate (%) <span className="text-red-500">*</span>
        </label>
        <input
          {...register(`channelRates.${index}.merchantRate`, {
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
        {errors.channelRates?.[index]?.merchantRate && (
          <p className="mt-1 text-sm text-red-500">{errors.channelRates[index].merchantRate.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        title="Remove channel type"
      >
        <X size={20} />
      </button>
    </div>
  )
}


// Channel Rates Component - pricing form 
const ChannelRates = ({ control, register, errors, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "channelRates"
  });

  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelTypes, setChannelTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannelTypeName, setNewChannelTypeName] = useState('');
  const [loading, setLoading] = useState(true);

  // Load channel types from database
  useEffect(() => {
    const loadChannelTypes = async () => {
      try {
        const response = await api.get('/channel-types');
        setChannelTypes(response.data);
      } catch (error) {
        console.error('Failed to load channel types:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChannelTypes();
  }, []);

  const addDatabaseChannelRate = () => {
    if (selectedChannelType) {
      
        append({ channelName: selectedChannelType, rate: '' });
      
      setSelectedChannelType('');
    }
  };

  const handleAddNewChannelType = async () => {
    if (!newChannelTypeName.trim()) return;

    try {
      const response = await api.post('/channel-types', {
        channelName: newChannelTypeName.trim()
      });

      // Refresh channel types list
      const updatedResponse = await api.get('/channel-types');
      setChannelTypes(updatedResponse.data);

      // Add the new channel type to form
      
        append({ channelName: response.data.channelName, rate: '' });
      

      // Reset modal
      setNewChannelTypeName('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create channel type:', error);
      alert('Failed to create channel type. It might already exist.');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Channel Processing Rates</h3>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <select
              value={selectedChannelType}
              onChange={(e) => setSelectedChannelType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">
                {loading ? 'Loading...' : 'Select channel type'}
              </option>
              {channelTypes.map(channelType => (
                <option key={channelType.id} value={channelType.channelName}>
                  {channelType.channelName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addDatabaseChannelRate}
              disabled={!selectedChannelType || loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Selected
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Type
          </button>

    
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
         
            <DirectMerchantChannelRateItem
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
            />
          
        ))}
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No channel types added yet.</p>
            <p className="text-xs mt-1">Use the buttons above to add channel types from database or create custom ones.</p>
          </div>
        )}
      </div>

      {/* Add New Channel Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">New Channel Type</h3>
              <input
                type="text"
                placeholder="Enter new channel type"
                value={newChannelTypeName}
                onChange={(e) => setNewChannelTypeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNewChannelType();
                  if (e.key === 'Escape') {
                    setShowAddModal(false);
                    setNewChannelTypeName('');
                  }
                }}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewChannelTypeName('');
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewChannelType}
                  disabled={!newChannelTypeName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const PricingSchemeFormModal = ({
  onCancel,
  onSubmit,
  initialData = null,
  isEdit = false,
  isReuse = false
}) => {

  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true)

  const getDefaultValues = () => ({
    schemeCode: '',
    rentalByMonth: '',
    
    channelRates: [],
    description: '',
    productCategoryName: '',
    productCategoryId: ''
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    defaultValues: initialData && isEdit && !isReuse
      ? { ...initialData, productCategoryId: String(initialData.productCategoryId) }
      : getDefaultValues()
  })

  // Fetch scheme code on mount for new schemes OR when reusing
  useEffect(() => {
    if ((!isEdit && !initialData) || isReuse) {
      fetchNewSchemeCode()
    }
    fetchCategory()
  }, [isEdit, initialData, isReuse])

  // Set form values when initialData changes (for reuse mode)
  useEffect(() => {
    if (initialData && isReuse) {
      // For reuse mode, copy data but exclude IDs
      setValue('rentalByMonth', initialData.rentalByMonth)
      
      setValue('description', initialData.description)
      setValue('productCategoryId', String(initialData.productCategoryId))

      // Copy channel rates but remove their IDs
      const channelRatesWithoutIds = initialData.channelRates.map(rate => {
        const { id, ...rateWithoutId } = rate
        return rateWithoutId
      })
      setValue('channelRates', channelRatesWithoutIds)
    }
  }, [initialData, isReuse, setValue])

  const fetchNewSchemeCode = async () => {
    try {
      const response = await api.get('/pricing-schemes/generate-code')

      if (response.status === 200) {
        setValue('schemeCode', response?.data?.schemeCode)
      }
    } catch (error) {
      console.error('Error fetching scheme code:', error)
    }
  }

  const fetchCategory = async () => {
    try {
      const response = await api.get("/product-categories")
      setCategory(response.data.map(category => ({
        value: String(category.id),
        label: category.categoryName
      })));

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  
  const onFormSubmit = (data) => {
    const filteredData = {
      ...data,
      productCategory: { id: Number(data.productCategoryId) },
      channelRates: data.channelRates.filter(rate => {
        
          return rate.rate && parseFloat(rate.rate) > 0 && rate.channelName.trim()
        
      }).map(rate => {
        // Remove IDs from channel rates for reuse
        if (isReuse) {
          const { id, ...rateWithoutId } = rate
          return rateWithoutId
        }
        return rate
      })
    }

    // Remove scheme ID for reuse
    if (isReuse) {
      const { id, ...dataWithoutId } = filteredData
      onSubmit(dataWithoutId)
    } else {
      onSubmit(filteredData)
    }

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
            {isEdit && !isReuse ? 'Edit Pricing Scheme' : isReuse ? 'Reuse Pricing Scheme' : 'Add New Pricing Scheme'}
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
          {/* Reuse Notice */}
          {isReuse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You're creating a new pricing scheme based on an existing one.
                A new scheme code has been generated. Channel rates and other details have been pre-filled.
              </p>
            </div>
          )}
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Scheme Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Scheme Code"
                  name="schemeCode"
                  register={register}
                  errors={errors}
                  required
                  disabled
                  readOnly
                  placeholder="Auto-generated"
                />
                {loading ? (
                  <div className="flex items-center">Loading categories...</div>
                ) : (
                  <Select
                    label="Product Type"
                    name="productCategoryId"
                    register={register}
                    errors={errors}
                    options={category}
                    required
                  />
                )}
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
                
              </div>
            </div>

            {/* Channel Rates */}
           
              <ChannelRates control={control} register={register} errors={errors} watch={watch} />
            

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
                {isEdit && !isReuse ? 'Update Scheme' : 'Save Scheme'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSchemeFormModal