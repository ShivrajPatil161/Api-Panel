import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Settings, FileText, ToggleRight, ToggleLeft } from 'lucide-react';
import { z } from 'zod';
import axiosInstance from '../../constants/API/axiosInstance';
import api from '../../constants/API/axiosInstance';

// Category Select with Add New Option Component
const CategorySelectField = ({
  label,
  name,
  register,
  error,
  options,
  required = false,
  placeholder = "Select an option",
  watch,
  setValue
}) => {
  const selectedValue = watch(name);
  const showNewCategoryInput = selectedValue === 'new';

  return (
    <div className="space-y-4">
      

      <div className={`grid gap-4 md:grid-cols-2`}>
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
          </label>
          <select
            {...register(name)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="new" className="font-medium text-green-600">
              + Add New Category
            </option>
          </select>
          {error && !showNewCategoryInput && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>

        {/* New category input appears beside it */}
        {showNewCategoryInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Category Name *
            </label>
            <input
              {...register('newCategoryName')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter new category name"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
            {watch('newCategoryName') && !error && (
              <p className="text-green-600 text-sm mt-1">
                New category "{watch('newCategoryName')}" will be created
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Validation Schema
const productSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  productCategoryId: z.union([
    z.coerce.number().min(1, 'Please select a category'),
    z.literal("new") // allow "new" string for add category
  ]),
  newCategoryName: z.string().optional(),
  status: z.boolean(),
  description: z.string().optional().default(""),
  remarks: z.string().nullable().optional().default("")
}).refine((data) => {
  if (data.productCategoryId === 'new' && (!data.newCategoryName || data.newCategoryName.trim().length < 2)) {
    return false;
  }
  return true;
}, {
  message: "New category name must be at least 2 characters",
  path: ["newCategoryName"],
});

// Form Header Component
const FormHeader = ({ isEdit, onCancel }) => (
  <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-t-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Package className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-green-100">
            {isEdit ? 'Update product information' : 'Register a new product in the catalog'}
          </p>
        </div>
      </div>
      <button
        onClick={onCancel}
        className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );
};

// Input Field Component
const InputField = ({
  label,
  name,
  register,
  error,
  required = false,
  type = "text",
  placeholder = "",
  disabled = false,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && '*'}
    </label>
    <input
      {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

// Textarea Field Component
const TextareaField = ({
  label,
  name,
  register,
  error,
  required = false,
  placeholder = "",
  rows = 3
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && '*'}
    </label>
    <textarea
      {...register(name)}
      rows={rows}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      placeholder={placeholder}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

// Status Toggle Component
const StatusToggle = ({ status, onToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Status
    </label>
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${status
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-red-100 text-red-700 border border-red-300'
          }`}
      >
        {status ? (
          <ToggleRight className="h-5 w-5" />
        ) : (
          <ToggleLeft className="h-5 w-5" />
        )}
        <span className="font-medium">
          {status ? 'Active' : 'Inactive'}
        </span>
      </button>
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
    {icon}
    {title}
  </h2>
);

// Main Form Component
const ProductMasterForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      productCategoryId: initialData?.productCategory?.id || ''
    } : {
      productName: '',
      productCategoryId: '',
      newCategoryName: '',
      description: '',
      status: true,
      remarks: ''
    }
  });

  const watchStatus = watch('status');

  // Load categories only
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);

        const categoriesResponse = await api.get('/product-categories');

        setCategories(categoriesResponse.data.map(category => ({
          value: category.id,
          label: category.categoryName
        })));

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);


  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // Determine category name - use newCategoryName if new category, otherwise find existing category name
      let categoryName, categoryId;
      if (data.productCategoryId === 'new') {
        categoryName = data.newCategoryName;
        categoryId = null; // Backend will create new category
      } else {
        // Find the selected category name from categories array
        const selectedCategory = categories.find(cat => cat.value === data.productCategoryId);
        categoryName = selectedCategory ? selectedCategory.label : '';
        categoryId = selectedCategory ? Number(selectedCategory.value) : null;
      }

      // Transform data to match backend expectations
      const transformedData = {
        productName: data.productName,
        productCategory: categoryId
          ? { id: categoryId, categoryName: categoryName }
          : { categoryName: categoryName }, // For new category
        description: data.description || null,
        status: data.status,
        remarks: data.remarks || null
      };

      onSubmit(transformedData);

    } catch (error) {
      console.error('Error saving product:', error);

      if (error.response?.data) {
        if (error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to save product. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = () => {
    setValue('status', !watchStatus);
  };

  if (dataLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <FormHeader isEdit={isEdit} onCancel={onCancel} />

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
            <ErrorDisplay error={error} />

            {/* Basic Information */}
            <div>
              <SectionHeader
                icon={<Package className="h-5 w-5 mr-2 text-green-600" />}
                title="Basic Information"
              />

              {/* First Row - Category Only (with conditional new category input beside) */}
              <div className="mb-6">
                <CategorySelectField
                  label="Category"
                  name="productCategoryId"
                  register={register}
                  error={errors.productCategoryId || errors.newCategoryName}
                  options={categories}
                  required
                  placeholder="Select Category"
                  watch={watch}
                  setValue={setValue}
                />
              </div>

              {/* Second Row onwards - Rest of the form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Product Name"
                  name="productName"
                  register={register}
                  error={errors.productName}
                  required
                  placeholder="Enter product name"
                />

                <StatusToggle
                  status={watchStatus}
                  onToggle={toggleStatus}
                />

                <div className="md:col-span-2">
                  <TextareaField
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                    placeholder="Enter detailed product description"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <TextareaField
              label="Remarks"
              name="remarks"
              register={register}
              error={errors.remarks}
              placeholder="Enter any additional remarks or notes"
            />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>
                  {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductMasterForm;