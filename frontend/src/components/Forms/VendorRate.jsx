import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, Package, Users, Plus, X, Layers, ToggleLeft, ToggleRight, Calculator } from 'lucide-react';

// Validation schema
const vendorRatesSchema = z.object({
  vendorId: z.string().min(1, 'Please select a vendor'),
  productId: z.string().min(1, 'Please select a product'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  currency: z.enum(['INR', 'USD', 'EUR']),
  basePrice: z.number().min(0.01, 'Base price must be greater than 0'),
  quantitySlabs: z.array(z.object({
    minQuantity: z.number().min(1, 'Minimum quantity must be at least 1'),
    maxQuantity: z.number().min(1, 'Maximum quantity must be at least 1'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    discountPercent: z.number().min(0).max(100, 'Discount must be between 0-100%')
  })).min(1, 'At least one quantity slab is required'),
  taxInclusive: z.boolean(),
  gstPercent: z.number().min(0).max(100, 'GST must be between 0-100%'),
  additionalCharges: z.array(z.object({
    chargeName: z.string().min(1, 'Charge name is required'),
    amount: z.number().min(0, 'Amount must be 0 or more'),
    type: z.enum(['fixed', 'percentage'])
  })).optional(),
  paymentTerms: z.string().min(5, 'Payment terms are required'),
  creditPeriod: z.number().min(0, 'Credit period must be 0 or more days'),
  status: z.enum(['active', 'inactive']),
  remarks: z.string().optional()
});

const VendorRatesForm = ({ onSubmit, initialData = null, isEdit = false }) => {
  const [vendors] = useState([
    { id: '1', name: 'HDFC Bank', code: 'HDFC' },
    { id: '2', name: 'ICICI Bank', code: 'ICICI' },
    { id: '3', name: 'SBI Bank', code: 'SBI' },
    { id: '4', name: 'Axis Bank', code: 'AXIS' }
  ]);

  const [products] = useState([
    { id: '1', name: 'POS Terminal X200', code: 'PT-X200', vendorId: '1' },
    { id: '2', name: 'QR Scanner Pro', code: 'QRS-PRO', vendorId: '1' },
    { id: '3', name: 'Card Reader Mini', code: 'CR-MINI', vendorId: '2' },
    { id: '4', name: 'Thermal Printer TP100', code: 'TP-100', vendorId: '3' }
  ]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(vendorRatesSchema),
    defaultValues: initialData || {
      vendorId: '',
      productId: '',
      effectiveDate: '',
      expiryDate: '',
      currency: 'INR',
      basePrice: 0,
      quantitySlabs: [
        { minQuantity: 1, maxQuantity: 10, price: 0, discountPercent: 0 }
      ],
      taxInclusive: false,
      gstPercent: 18,
      additionalCharges: [
        { chargeName: '', amount: 0, type: 'fixed' }
      ],
      paymentTerms: '',
      creditPeriod: 30,
      status: 'active',
      remarks: ''
    }
  });

  const { fields: slabFields, append: appendSlab, remove: removeSlab } = useFieldArray({
    control,
    name: 'quantitySlabs'
  });

  const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({
    control,
    name: 'additionalCharges'
  });

  const watchVendor = watch('vendorId');
  const watchStatus = watch('status');
  const watchTaxInclusive = watch('taxInclusive');

  const filteredProducts = products.filter(product => 
    !watchVendor || product.vendorId === watchVendor
  );

  const handleFormSubmit = (data) => {
    console.log('Vendor Rates Form Data:', data);
    onSubmit?.(data);
  };

  const toggleStatus = () => {
    setValue('status', watchStatus === 'active' ? 'inactive' : 'active');
  };

  const toggleTaxInclusive = () => {
    setValue('taxInclusive', !watchTaxInclusive);
  };

  const addQuantitySlab = () => {
    appendSlab({ minQuantity: 1, maxQuantity: 10, price: 0, discountPercent: 0 });
  };

  const addAdditionalCharge = () => {
    appendCharge({ chargeName: '', amount: 0, type: 'fixed' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  {isEdit ? 'Edit Vendor Rates' : 'Add New Vendor Rates'}
                </h1>
                <p className="text-purple-100">
                  {isEdit ? 'Update vendor pricing information' : 'Set up pricing structure for vendor products'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor *
                  </label>
                  <select
                    {...register('vendorId')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    Product *
                  </label>
                  <select
                    {...register('productId')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Product</option>
                    {filteredProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="text-red-500 text-sm mt-1">{errors.productId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date *
                  </label>
                  <input
                    {...register('effectiveDate')}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.effectiveDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.effectiveDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    {...register('expiryDate')}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    {...register('currency')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price *
                  </label>
                  <input
                    {...register('basePrice', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.basePrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.basePrice.message}</p>
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

            {/* Quantity Slabs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-purple-600" />
                Quantity Slabs
              </h2>
              <div className="space-y-4">
                {slabFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Qty *
                      </label>
                      <input
                        {...register(`quantitySlabs.${index}.minQuantity`, { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="1"
                      />
                      {errors.quantitySlabs?.[index]?.minQuantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantitySlabs[index].minQuantity.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Qty *
                      </label>
                      <input
                        {...register(`quantitySlabs.${index}.maxQuantity`, { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="10"
                      />
                      {errors.quantitySlabs?.[index]?.maxQuantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantitySlabs[index].maxQuantity.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        {...register(`quantitySlabs.${index}.price`, { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      {errors.quantitySlabs?.[index]?.price && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantitySlabs[index].price.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount %
                      </label>
                      <input
                        {...register(`quantitySlabs.${index}.discountPercent`, { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                      {errors.quantitySlabs?.[index]?.discountPercent && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantitySlabs[index].discountPercent.message}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSlab(index)}
                        disabled={slabFields.length <= 1}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuantitySlab}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Quantity Slab</span>
                </button>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                Tax Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={toggleTaxInclusive}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        watchTaxInclusive
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {watchTaxInclusive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                      <span className="font-medium">Tax Inclusive</span>
                    </button>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Percentage *
                  </label>
                  <input
                    {...register('gstPercent', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="18"
                  />
                  {errors.gstPercent && (
                    <p className="text-red-500 text-sm mt-1">{errors.gstPercent.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Charges */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-purple-600" />
                Additional Charges (Optional)
              </h2>
              <div className="space-y-4">
                {chargeFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Charge Name
                      </label>
                      <input
                        {...register(`additionalCharges.${index}.chargeName`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Setup Fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        {...register(`additionalCharges.${index}.type`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="fixed">Fixed Amount</option>
                        <option value="percentage">Percentage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        {...register(`additionalCharges.${index}.amount`, { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeCharge(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAdditionalCharge}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Additional Charge</span>
                </button>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Payment Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms *
                  </label>
                  <input
                    {...register('paymentTerms')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Net 30, Advance payment"
                  />
                  {errors.paymentTerms && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Period (Days) *
                  </label>
                  <input
                    {...register('creditPeriod', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="30"
                  />
                  {errors.creditPeriod && (
                    <p className="text-red-500 text-sm mt-1">{errors.creditPeriod.message}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Rates' : 'Create Rates'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRatesForm;