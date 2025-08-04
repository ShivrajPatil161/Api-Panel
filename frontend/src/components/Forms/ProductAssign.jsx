import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  Users,
  Building2,
  Plus,
  Minus,
  Search,
  AlertCircle,
  CheckCircle,
  Trash2,
  Store
} from 'lucide-react';

// Zod validation schemas
const baseDistributionSchema = z.object({
  product: z.string().min(1, "Please select a product"),
  totalQuantity: z.number().min(1, "Quantity must be at least 1"),
  merchants: z.array(z.string()).min(1, "Please select at least one merchant"),
  distributions: z.array(z.object({
    merchantId: z.string(),
    quantity: z.number().min(0, "Quantity cannot be negative")
  }))
});

const adminDistributionSchema = baseDistributionSchema.extend({
  franchise: z.string().min(1, "Please select a franchise")
});

// Reusable Form Field Component
const FormField = ({ label, error, required = false, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

// Reusable Select Component
const Select = ({ placeholder, options, value, onChange, error }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
      }`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Merchant Selection Card Component
const MerchantCard = ({ merchant, isSelected, onToggle, quantity, onQuantityChange, maxQuantity }) => (
  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-200 hover:border-gray-300 bg-white'
    }`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Store className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{merchant.name}</h3>
          <p className="text-sm text-gray-600">{merchant.location}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>

    {isSelected && (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quantity to Distribute
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            max={maxQuantity}
            className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">/ {maxQuantity}</span>
        </div>
      </div>
    )}
  </div>
);

// Main Product Distribution Component
const ProductDistribution = () => {
  const [userType, setUserType] = useState('merchant');
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [distributions, setDistributions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Get user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  // Mock data
  const franchises = [
    { value: 'franchise-1', label: 'ABC Retail Franchise' },
    { value: 'franchise-2', label: 'XYZ Electronics Franchise' },
    { value: 'franchise-3', label: 'Tech Solutions Franchise' }
  ];

  const products = [
    { value: 'pos-device', label: 'POS Device', availableQuantity: 50 },
    { value: 'qr-scanner', label: 'QR Scanner', availableQuantity: 30 },
    { value: 'soundbox', label: 'Soundbox', availableQuantity: 25 }
  ];

  const merchants = [
    { id: 'merchant-1', name: 'Store Alpha', location: 'Mumbai', franchiseId: 'franchise-1' },
    { id: 'merchant-2', name: 'Store Beta', location: 'Delhi', franchiseId: 'franchise-1' },
    { id: 'merchant-3', name: 'Store Gamma', location: 'Pune', franchiseId: 'franchise-1' },
    { id: 'merchant-4', name: 'Tech Store 1', location: 'Bangalore', franchiseId: 'franchise-2' },
    { id: 'merchant-5', name: 'Tech Store 2', location: 'Chennai', franchiseId: 'franchise-2' }
  ];

  // Form setup
  const schema = userType === 'admin' ? adminDistributionSchema : baseDistributionSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      franchise: '',
      product: '',
      totalQuantity: 0,
      merchants: [],
      distributions: []
    }
  });

  const watchedValues = watch();
  const selectedProduct = products.find(p => p.value === watchedValues.product);
  const selectedFranchise = watchedValues.franchise;

  // Filter merchants based on franchise selection (for admin)
  const availableMerchants = userType === 'admin'
    ? merchants.filter(m => m.franchiseId === selectedFranchise)
    : merchants.filter(m => m.franchiseId === 'franchise-1'); // Default franchise for franchise user

  // Filter merchants based on search
  const filteredMerchants = availableMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle merchant selection
  const handleMerchantToggle = (merchantId) => {
    const updatedMerchants = selectedMerchants.includes(merchantId)
      ? selectedMerchants.filter(id => id !== merchantId)
      : [...selectedMerchants, merchantId];

    setSelectedMerchants(updatedMerchants);
    setValue('merchants', updatedMerchants);

    // Remove distribution if merchant is deselected
    if (!updatedMerchants.includes(merchantId)) {
      const updatedDistributions = { ...distributions };
      delete updatedDistributions[merchantId];
      setDistributions(updatedDistributions);
    }
  };

  // Handle quantity change for merchant
  const handleQuantityChange = (merchantId, quantity) => {
    const updatedDistributions = {
      ...distributions,
      [merchantId]: quantity
    };
    setDistributions(updatedDistributions);

    // Update form distributions
    const distributionArray = Object.entries(updatedDistributions).map(([id, qty]) => ({
      merchantId: id,
      quantity: qty
    }));
    setValue('distributions', distributionArray);
  };

  // Calculate total distributed quantity
  const totalDistributed = Object.values(distributions).reduce((sum, qty) => sum + qty, 0);
  const remainingQuantity = watchedValues.totalQuantity - totalDistributed;

  // Form submission
  const onSubmit = async (data) => {
    try {
      console.log('Distribution Data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Successfully distributed ${data.totalQuantity} ${selectedProduct?.label} to ${data.merchants.length} merchants!`);

      // Reset form
      reset();
      setSelectedMerchants([]);
      setDistributions({});
      setSearchTerm('');

    } catch (error) {
      alert('Distribution failed. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Distribution</h1>
            <p className="text-gray-600">
              {userType === 'admin'
                ? 'Distribute products to franchise merchants'
                : 'Distribute products to your merchants'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${userType === 'admin'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
            }`}>
            {userType === 'admin' ? 'Admin Panel' : 'Franchise Panel'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribution Details</h2>

            <div className="space-y-6">
              {/* Franchise Selection (Admin only) */}
              {userType === 'admin' && (
                <FormField label="Select Franchise" error={errors.franchise} required>
                  <Select
                    placeholder="Choose franchise"
                    options={franchises}
                    value={watchedValues.franchise}
                    onChange={(e) => setValue('franchise', e.target.value)}
                    error={errors.franchise}
                  />
                </FormField>
              )}

              {/* Product Selection */}
              <FormField label="Select Product" error={errors.product} required>
                <Select
                  placeholder="Choose product"
                  options={products.map(p => ({ value: p.value, label: `${p.label} (Available: ${p.availableQuantity})` }))}
                  value={watchedValues.product}
                  onChange={(e) => setValue('product', e.target.value)}
                  error={errors.product}
                />
              </FormField>

              {/* Total Quantity */}
              {selectedProduct && (
                <FormField label="Total Quantity to Distribute" error={errors.totalQuantity} required>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.availableQuantity}
                    {...register('totalQuantity', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.totalQuantity ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    placeholder="Enter quantity"
                  />
                  <p className="text-sm text-gray-600">
                    Available: {selectedProduct.availableQuantity}
                  </p>
                </FormField>
              )}

              {/* Distribution Summary */}
              {watchedValues.totalQuantity > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Quantity:</span>
                    <span className="font-medium">{watchedValues.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Distributed:</span>
                    <span className="font-medium text-blue-600">{totalDistributed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className={`font-medium ${remainingQuantity === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {remainingQuantity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Merchant Selection Section */}
        <div className="lg:col-span-2 space-y-6">
          {(userType === 'franchise' || (userType === 'admin' && selectedFranchise)) && watchedValues.totalQuantity > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Select Merchants</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search merchants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredMerchants.map((merchant) => (
                  <MerchantCard
                    key={merchant.id}
                    merchant={merchant}
                    isSelected={selectedMerchants.includes(merchant.id)}
                    onToggle={() => handleMerchantToggle(merchant.id)}
                    quantity={distributions[merchant.id] || 0}
                    onQuantityChange={(qty) => handleQuantityChange(merchant.id, qty)}
                    maxQuantity={watchedValues.totalQuantity}
                  />
                ))}
              </div>

              {filteredMerchants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No merchants found</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {selectedMerchants.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || remainingQuantity !== 0}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>
                  {isSubmitting ? 'Distributing...' : 'Distribute Products'}
                </span>
              </button>

              {remainingQuantity !== 0 && (
                <p className="text-sm text-orange-600 text-center mt-2">
                  Please distribute all {watchedValues.totalQuantity} items before submitting
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDistribution;