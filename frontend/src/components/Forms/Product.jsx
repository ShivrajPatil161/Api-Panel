import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Layers, Settings, FileText, ToggleLeft, ToggleRight, Plus, X } from 'lucide-react';

// Validation schema
const productSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  productCode: z.string().min(3, 'Product code must be at least 3 characters'),
  vendorId: z.string().min(1, 'Please select a vendor'),
  category: z.enum(['POS', 'QR_SCANNER', 'CARD_READER', 'PRINTER', 'ACCESSORIES'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  model: z.string().min(2, 'Model is required'),
  brand: z.string().min(2, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specifications: z.array(z.object({
    key: z.string().min(1, 'Specification key is required'),
    value: z.string().min(1, 'Specification value is required')
  })).min(1, 'At least one specification is required'),
  warrantyPeriod: z.number().min(0, 'Warranty period must be 0 or more months'),
  warrantyType: z.enum(['manufacturer', 'vendor', 'none']),
  dimensions: z.object({
    length: z.number().min(0, 'Length must be positive').optional(),
    width: z.number().min(0, 'Width must be positive').optional(),
    height: z.number().min(0, 'Height must be positive').optional(),
    weight: z.number().min(0, 'Weight must be positive').optional()
  }),
  hsn: z.string().regex(/^[0-9]{4,8}$/, 'HSN must be 4-8 digits'),
  status: z.enum(['active', 'inactive']),
  minOrderQuantity: z.number().min(1, 'Minimum order quantity must be at least 1'),
  maxOrderQuantity: z.number().min(1, 'Maximum order quantity must be at least 1'),
  remarks: z.string().optional()
});

const ProductMasterForm = ({ onSubmit,onCancel, initialData = null, isEdit = false }) => {
  const [vendors, setVendors] = useState([
    { id: '1', name: 'HDFC Bank', code: 'HDFC' },
    { id: '2', name: 'ICICI Bank', code: 'ICICI' },
    { id: '3', name: 'SBI Bank', code: 'SBI' },
    { id: '4', name: 'Axis Bank', code: 'AXIS' }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      productName: '',
      productCode: '',
      vendorId: '',
      category: 'POS',
      model: '',
      brand: '',
      description: '',
      specifications: [{ key: '', value: '' }],
      warrantyPeriod: 12,
      warrantyType: 'manufacturer',
      dimensions: {
        length: '',
        width: '',
        height: '',
        weight: ''
      },
      hsn: '',
      status: 'active',
      minOrderQuantity: 1,
      maxOrderQuantity: 100,
      remarks: ''
    }
  });

  const watchStatus = watch('status');
  const watchSpecs = watch('specifications');

  const handleFormSubmit = (data) => {
    console.log('Product Form Data:', data);
    onSubmit?.(data);
  };

  const toggleStatus = () => {
    setValue('status', watchStatus === 'active' ? 'inactive' : 'active');
  };

  const addSpecification = () => {
    const currentSpecs = watchSpecs || [];
    setValue('specifications', [...currentSpecs, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    const currentSpecs = watchSpecs || [];
    if (currentSpecs.length > 1) {
      setValue('specifications', currentSpecs.filter((_, i) => i !== index));
    }
  };

  const categories = [
    { value: 'POS', label: 'POS Machine' },
    { value: 'QR_SCANNER', label: 'QR Scanner' },
    { value: 'CARD_READER', label: 'Card Reader' },
    { value: 'PRINTER', label: 'Printer' },
    { value: 'ACCESSORIES', label: 'Accessories' }
  ];

  const warrantyTypes = [
    { value: 'manufacturer', label: 'Manufacturer Warranty' },
    { value: 'vendor', label: 'Vendor Warranty' },
    { value: 'none', label: 'No Warranty' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between" >
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
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
           </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    {...register('productName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                  {errors.productName && (
                    <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Code *
                  </label>
                  <input
                    {...register('productCode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter unique product code"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.productCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.productCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor *
                  </label>
                  <select
                    {...register('vendorId')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.code})
                      </option>
                    ))}
                  </select>
                  {errors.vendorId && (
                    <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    {...register('brand')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    {...register('model')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter model number"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter detailed product description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={toggleStatus}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        watchStatus === 'active'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}
                    >
                      {watchStatus === 'active' ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {watchStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-green-600" />
                Technical Specifications
              </h2>
              <div className="space-y-4">
                {watchSpecs?.map((spec, index) => (
                  <div key={index} className="flex space-x-4 items-start">
                    <div className="flex-1">
                      <input
                        {...register(`specifications.${index}.key`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Specification name (e.g., Display Size)"
                      />
                      {errors.specifications?.[index]?.key && (
                        <p className="text-red-500 text-sm mt-1">{errors.specifications[index].key.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        {...register(`specifications.${index}.value`)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Specification value (e.g., 15.6 inches)"
                      />
                      {errors.specifications?.[index]?.value && (
                        <p className="text-red-500 text-sm mt-1">{errors.specifications[index].value.message}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      disabled={watchSpecs?.length <= 1}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Specification</span>
                </button>
              </div>
            </div>

            {/* Physical Details */}
            {/* <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-green-600" />
                Physical Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (cm)
                  </label>
                  <input
                    {...register('dimensions.length', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (cm)
                  </label>
                  <input
                    {...register('dimensions.width', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    {...register('dimensions.height', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    {...register('dimensions.weight', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div> */}

            {/* Warranty & Legal */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Warranty & Legal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period (Months) *
                  </label>
                  <input
                    {...register('warrantyPeriod', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="12"
                  />
                  {errors.warrantyPeriod && (
                    <p className="text-red-500 text-sm mt-1">{errors.warrantyPeriod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Type *
                  </label>
                  <select
                    {...register('warrantyType')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {warrantyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSN Code *
                  </label>
                  <input
                    {...register('hsn')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter HSN code"
                    maxLength={8}
                  />
                  {errors.hsn && (
                    <p className="text-red-500 text-sm mt-1">{errors.hsn.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Quantities */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Quantities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity *
                  </label>
                  <input
                    {...register('minOrderQuantity', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                  />
                  {errors.minOrderQuantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.minOrderQuantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Order Quantity *
                  </label>
                  <input
                    {...register('maxOrderQuantity', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100"
                  />
                  {errors.maxOrderQuantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxOrderQuantity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                {...register('remarks')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter any additional remarks or notes"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductMasterForm;