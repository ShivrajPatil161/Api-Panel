import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import {
  DollarSign, Package, Users, Plus, Search, Edit, Eye, Trash2, 
  ChevronLeft, ChevronRight, Tag, Calculator, TrendingUp,
  Building2, Calendar, ToggleLeft, ToggleRight, X, Save
} from 'lucide-react';

// Validation schema for pricing
const pricingSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  productCategory: z.enum(['pos_machine', 'qr_scanner', 'card_reader', 'mobile_pos', 'accessories'], {
    errorMap: () => ({ message: 'Please select a product category' })
  }),
  vendorId: z.string().min(1, 'Please select a vendor'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  basePrice: z.number().min(0, 'Base price must be 0 or greater'),
  costPrice: z.number().min(0, 'Cost price must be 0 or greater'),
  markup: z.number().min(0, 'Markup must be 0 or greater'),
  sellingPrice: z.number().min(0, 'Selling price must be 0 or greater'),
  minQuantity: z.number().min(1, 'Minimum quantity must be at least 1'),
  maxQuantity: z.number().min(1, 'Maximum quantity must be at least 1'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Discount value must be 0 or greater'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  tierPricing: z.array(z.object({
    minQuantity: z.number().min(1, 'Min quantity must be at least 1'),
    maxQuantity: z.number().min(1, 'Max quantity must be at least 1'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    discount: z.number().min(0, 'Discount must be 0 or greater')
  })).optional(),
  specialRates: z.object({
    franchiseRate: z.number().min(0, 'Franchise rate must be 0 or greater'),
    merchantRate: z.number().min(0, 'Merchant rate must be 0 or greater'),
    bulkOrderRate: z.number().min(0, 'Bulk order rate must be 0 or greater')
  }),
  description: z.string().optional(),
  terms: z.string().optional()
});

// Dummy vendors data
const dummyVendors = [
  { id: '1', name: 'HDFC Bank Solutions', bankName: 'HDFC Bank' },
  { id: '2', name: 'ICICI Merchant Services', bankName: 'ICICI Bank' },
  { id: '3', name: 'SBI Payment Solutions', bankName: 'State Bank of India' },
  { id: '4', name: 'Axis Bank Digital', bankName: 'Axis Bank' },
  { id: '5', name: 'Kotak Mahindra Tech', bankName: 'Kotak Mahindra Bank' }
];


const PricingForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(pricingSchema),
    defaultValues: initialData || {
      productName: '',
      productCategory: 'pos_machine',
      vendorId: '',
      vendorName: '',
      sku: '',
      basePrice: 0,
      costPrice: 0,
      markup: 0,
      sellingPrice: 0,
      minQuantity: 1,
      maxQuantity: 100,
      discountType: 'percentage',
      discountValue: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'active',
      tierPricing: [
        { minQuantity: 1, maxQuantity: 10, price: 0, discount: 0 },
        { minQuantity: 11, maxQuantity: 50, price: 0, discount: 5 },
        { minQuantity: 51, maxQuantity: 100, price: 0, discount: 10 }
      ],
      specialRates: {
        franchiseRate: 0,
        merchantRate: 0,
        bulkOrderRate: 0
      },
      description: '',
      terms: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tierPricing'
  });

  const watchCostPrice = watch('costPrice');
  const watchMarkup = watch('markup');
  const watchSellingPrice = watch('sellingPrice');
  const watchVendorId = watch('vendorId');
  const watchStatus = watch('status');

  // Auto-calculate selling price based on cost price and markup
  React.useEffect(() => {
    if (watchCostPrice && watchMarkup) {
      const calculatedPrice = watchCostPrice * (1 + watchMarkup / 100);
      setValue('sellingPrice', Math.round(calculatedPrice * 100) / 100);
    }
  }, [watchCostPrice, watchMarkup, setValue]);

  // Auto-fill vendor name when vendor is selected
  React.useEffect(() => {
    if (watchVendorId) {
      const selectedVendor = dummyVendors.find(v => v.id === watchVendorId);
      if (selectedVendor) {
        setValue('vendorName', selectedVendor.name);
      }
    }
  }, [watchVendorId, setValue]);

  const handleFormSubmit = (data) => {
    console.log('Pricing Data:', data);
    onSubmit?.(data);
  };

  const toggleStatus = () => {
    setValue('status', watchStatus === 'active' ? 'inactive' : 'active');
  };

  const addTierPricing = () => {
    append({ minQuantity: 1, maxQuantity: 10, price: 0, discount: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  {isEdit ? 'Edit Product Pricing' : 'Add Product Pricing'}
                </h1>
                <p className="text-green-100">
                  {isEdit ? 'Update product pricing information' : 'Set up pricing for a new product'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
          {/* Basic Product Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  Product Category *
                </label>
                <select
                  {...register('productCategory')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pos_machine">POS Machine</option>
                  <option value="qr_scanner">QR Scanner</option>
                  <option value="card_reader">Card Reader</option>
                  <option value="mobile_pos">Mobile POS</option>
                  <option value="accessories">Accessories</option>
                </select>
                {errors.productCategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.productCategory.message}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  {...register('sku')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product SKU"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                )}
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor *
                </label>
                <select
                  {...register('vendorId')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Vendor</option>
                  {dummyVendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.bankName})
                    </option>
                  ))}
                </select>
                {errors.vendorId && (
                  <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
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

          {/* Pricing Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-green-600" />
              Pricing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <input
                  {...register('basePrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.basePrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price (₹) *
                </label>
                <input
                  {...register('costPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.costPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Markup (%) *
                </label>
                <input
                  {...register('markup', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.markup && (
                  <p className="text-red-500 text-sm mt-1">{errors.markup.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (₹) *
                </label>
                <input
                  {...register('sellingPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="0.00"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated from cost price + markup</p>
              </div>
            </div>
          </div>

          {/* Special Rates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Special Rates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchise Rate (₹) *
                </label>
                <input
                  {...register('specialRates.franchiseRate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Rate (₹) *
                </label>
                <input
                  {...register('specialRates.merchantRate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulk Order Rate (₹) *
                </label>
                <input
                  {...register('specialRates.bulkOrderRate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Discount */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-green-600" />
              Quantity & Discount Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Quantity *
                </label>
                <input
                  {...register('minQuantity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Quantity *
                </label>
                <input
                  {...register('maxQuantity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  {...register('discountType')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value
                </label>
                <input
                  {...register('discountValue', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Tier Pricing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Tier Pricing
              </h2>
              <button
                type="button"
                onClick={addTierPricing}
                className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tier</span>
              </button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Qty
                    </label>
                    <input
                      {...register(`tierPricing.${index}.minQuantity`, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Qty
                    </label>
                    <input
                      {...register(`tierPricing.${index}.maxQuantity`, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      {...register(`tierPricing.${index}.price`, { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      {...register(`tierPricing.${index}.discount`, { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Date Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date *
                </label>
                <input
                  {...register('effectiveDate')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.effectiveDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.effectiveDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  {...register('expiryDate')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  {...register('terms')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter pricing terms and conditions..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Pricing' : 'Create Pricing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PricingForm