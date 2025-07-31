import React, { useState } from "react";
import { Package, DollarSign, Percent, Calendar, FileText, Hash, AlertCircle, CheckCircle2, Calculator } from "lucide-react";

const ProductPricingForm = () => {
  const [formData, setFormData] = useState({
    pricingCode: '',
    product: '',
    basePrice: '',
    gstPercentage: '',
    effectiveFrom: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Enhanced product options with details
  const products = [
    { 
      id: "swap_machine", 
      name: "Swap Machine", 
      category: "Hardware",
      description: "Digital payment swap machine"
    },
    { 
      id: "qr_code", 
      name: "QR Code", 
      category: "Digital",
      description: "QR code payment solution"
    },
    { 
      id: "qr_soundbox", 
      name: "QR + Soundbox", 
      category: "Combo",
      description: "QR code with audio confirmation"
    },
    { 
      id: "pos_terminal", 
      name: "POS Terminal", 
      category: "Hardware",
      description: "Point of sale terminal device"
    },
    { 
      id: "mobile_app", 
      name: "Mobile App License", 
      category: "Software",
      description: "Mobile application license"
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pricingCode.trim()) {
      newErrors.pricingCode = "Pricing code is required";
    } else if (!/^[A-Z0-9-_]+$/i.test(formData.pricingCode)) {
      newErrors.pricingCode = "Pricing code should contain only letters, numbers, hyphens, and underscores";
    }

    if (!formData.product) {
      newErrors.product = "Please select a product";
    }

    if (!formData.basePrice) {
      newErrors.basePrice = "Base price is required";
    } else if (parseFloat(formData.basePrice) < 0) {
      newErrors.basePrice = "Base price must be a positive number";
    }

    if (!formData.gstPercentage) {
      newErrors.gstPercentage = "GST percentage is required";
    } else if (parseFloat(formData.gstPercentage) < 0 || parseFloat(formData.gstPercentage) > 100) {
      newErrors.gstPercentage = "GST percentage must be between 0 and 100";
    }

    if (!formData.effectiveFrom) {
      newErrors.effectiveFrom = "Effective date is required";
    } else if (new Date(formData.effectiveFrom) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.effectiveFrom = "Effective date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const calculateTotalPrice = () => {
    const base = parseFloat(formData.basePrice) || 0;
    const gst = parseFloat(formData.gstPercentage) || 0;
    const gstAmount = (base * gst) / 100;
    return {
      basePrice: base,
      gstAmount: gstAmount,
      totalPrice: base + gstAmount
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const calculations = calculateTotalPrice();
      const submitData = {
        ...formData,
        ...calculations,
        submittedAt: new Date().toISOString()
      };

      console.log("Product Pricing Master Submitted:", submitData);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          pricingCode: '',
          product: '',
          basePrice: '',
          gstPercentage: '',
          effectiveFrom: '',
          description: ''
        });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      setErrors({ submit: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.product);
  const calculations = calculateTotalPrice();

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-green-800 mb-2">Pricing Configuration Saved!</h3>
          <p className="text-green-600 text-lg">
            Product pricing has been successfully configured and is now active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7" />
            Product Pricing Master
          </h1>
          <p className="text-purple-100 mt-1">
            Configure product pricing with tax calculations
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Pricing Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pricing Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.pricingCode}
                onChange={(e) => handleInputChange("pricingCode", e.target.value.toUpperCase())}
                placeholder="e.g., SWAP-001, QR-BASE-2024"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.pricingCode ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-purple-500"
                }`}
              />
            </div>
            {errors.pricingCode && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pricingCode}
              </p>
            )}
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={formData.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${
                  errors.product ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-purple-500"
                }`}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </select>
            </div>
            {selectedProduct && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>{selectedProduct.category}:</strong> {selectedProduct.description}
                </p>
              </div>
            )}
            {errors.product && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.product}
              </p>
            )}
          </div>

          {/* Pricing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange("basePrice", e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.basePrice ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-purple-500"
                  }`}
                />
              </div>
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.basePrice}
                </p>
              )}
            </div>

            {/* GST Percentage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GST Percentage (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.gstPercentage}
                  onChange={(e) => handleInputChange("gstPercentage", e.target.value)}
                  placeholder="18"
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.gstPercentage ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-purple-500"
                  }`}
                />
              </div>
              {errors.gstPercentage && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gstPercentage}
                </p>
              )}
            </div>
          </div>

          {/* Price Calculation Display */}
          {(formData.basePrice || formData.gstPercentage) && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                Price Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Base Price</p>
                  <p className="text-xl font-semibold text-gray-800">₹{calculations.basePrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">GST Amount</p>
                  <p className="text-xl font-semibold text-orange-600">₹{calculations.gstAmount.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-green-600">₹{calculations.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Effective From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => handleInputChange("effectiveFrom", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.effectiveFrom ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-purple-500"
                }`}
              />
            </div>
            {errors.effectiveFrom && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.effectiveFrom}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add pricing notes, special conditions, or additional details..."
                rows="3"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            {errors.submit && (
              <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Pricing Configuration...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Save Pricing Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            All prices are in Indian Rupees (₹) • GST calculations are applied automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPricingForm;