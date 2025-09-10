import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Search } from 'lucide-react';
import distributionApi from "../../constants/API/distributionsAPI"

const ProductDistribution = () => {
  // User context
  const userType = localStorage.getItem("userType")?.toLowerCase();
  const customerId = localStorage.getItem("customerId");

  // State management
  const [loading, setLoading] = useState({
    franchises: false,
    products: false,
    merchants: false,
    devices: false,
    submitting: false
  });

  const [data, setData] = useState({
    franchises: [],
    products: [],
    merchants: [],
    devices: []
  });

  const [formData, setFormData] = useState({
    franchise: userType === 'franchise' ? customerId || '' : '',
    product: '',
    quantity: '',
    merchant: ''
  });

  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceSearch, setDeviceSearch] = useState('');
  const [errors, setErrors] = useState({});

  // Load initial data
  useEffect(() => {
    if (userType === 'admin') {
      loadFranchises();
    } else if (userType === 'franchise' && customerId) {
      loadFranchiseData(customerId);
    }
  }, [userType, customerId]);

  // Load franchise data when franchise changes
  useEffect(() => {
    if (formData.franchise && formData.franchise !== (userType === 'franchise' ? customerId : '')) {
      loadFranchiseData(formData.franchise);
    }
  }, [formData.franchise, userType, customerId]);

  // Load devices when product and quantity are selected
  useEffect(() => {
    if (formData.product && formData.quantity > 0) {
      const selectedProduct = data.products.find(p => p.outwardId.toString() === formData.product);
      if (selectedProduct) {
        loadDevices(selectedProduct.outwardId);
      }
    } else {
      setData(prev => ({ ...prev, devices: [] }));
      setSelectedDevices([]);
    }
  }, [formData.product, formData.quantity, data.products]);

  // API calls
  const loadFranchises = async () => {
    setLoading(prev => ({ ...prev, franchises: true }));
    try {
      const franchises = await distributionApi.getAllFranchises();
      setData(prev => ({ ...prev, franchises }));
    } catch (error) {
      console.error('Load franchises error:', error);
    } finally {
      setLoading(prev => ({ ...prev, franchises: false }));
    }
  };

  const loadFranchiseData = async (franchiseId) => {
    setLoading(prev => ({ ...prev, products: true, merchants: true }));
    try {
      const [products, merchants] = await Promise.all([
        distributionApi.getFranchiseProducts(franchiseId),
        distributionApi.getMerchantsByFranchise(franchiseId)
      ]);
      setData(prev => ({ ...prev, products, merchants }));

      // Reset dependent fields
      setFormData(prev => ({ ...prev, product: '', quantity: '', merchant: '' }));
      setSelectedDevices([]);
    } catch (error) {
      console.error('Load franchise data error:', error);
    } finally {
      setLoading(prev => ({ ...prev, products: false, merchants: false }));
    }
  };

  const loadDevices = async (outwardId) => {
    setLoading(prev => ({ ...prev, devices: true }));
    try {
      const devices = await distributionApi.getSerialNumbersToDispatch(outwardId);
      setData(prev => ({ ...prev, devices }));
      setSelectedDevices([]);
    } catch (error) {
      console.error('Load devices error:', error);
    } finally {
      setLoading(prev => ({ ...prev, devices: false }));
    }
  };

  // Event handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDeviceToggle = (deviceId) => {
    const quantity = parseInt(formData.quantity);
    setSelectedDevices(prev => {
      const isSelected = prev.includes(deviceId);
      if (isSelected) {
        return prev.filter(id => id !== deviceId);
      } else if (prev.length < quantity) {
        return [...prev, deviceId];
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (userType === 'admin' && !formData.franchise) {
      newErrors.franchise = 'Please select a franchise';
    }
    if (!formData.product) {
      newErrors.product = 'Please select a product';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData.merchant) {
      newErrors.merchant = 'Please select a merchant';
    }
    if (selectedDevices.length !== parseInt(formData.quantity)) {
      newErrors.devices = `Please select exactly ${formData.quantity} devices`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(prev => ({ ...prev, submitting: true }));
    try {
      const distributionData = {
        merchantId: formData.merchant,
        selectedDeviceIds: selectedDevices,
        quantity: parseInt(formData.quantity)
      };

      await distributionApi.submitDistribution(distributionData);
      // Reset form
      setFormData({
        franchise: userType === 'franchise' ? customerId || '' : '',
        product: '',
        quantity: '',
        merchant: ''
      });
      setSelectedDevices([]);
      setData(prev => ({ ...prev, devices: [] }));
    } catch (error) {
      alert('Distribution failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Get filtered devices for display
  const filteredDevices = data.devices.filter(device =>
    deviceSearch === '' ||
    device.sid.toLowerCase().includes(deviceSearch.toLowerCase()) ||
    device.mid.toLowerCase().includes(deviceSearch.toLowerCase()) ||
    device.tid.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  const selectedProduct = data.products.find(p => p?.outwardId?.toString() === formData.product);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Distribution</h1>
            <p className="text-gray-600">
              {userType === 'admin' ? 'Distribute products to franchise merchants' : 'Distribute products to merchants'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Franchise Selection (Admin only) */}
          {userType === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchise <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.franchise}
                onChange={(e) => handleInputChange('franchise', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading.franchises}
              >
                <option value="">{loading.franchises ? 'Loading...' : 'Select Franchise'}</option>
                {data.franchises.map(franchise => (
                  <option key={franchise.id} value={franchise.id}>
                    {franchise.franchiseName}
                  </option>
                ))}
              </select>
              {errors.franchise && <p className="text-red-600 text-sm mt-1">{errors.franchise}</p>}
            </div>
          )}

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.products || (userType === 'admin' && !formData.franchise)}
            >
              <option value="">{loading.products ? 'Loading...' : 'Select Product'}</option>
              {data.products.map(product => (
                <option key={product.outwardId} value={product.outwardId}>
                  {product.productName} (Available: {product.remainingQuantity})
                </option>
              ))}
            </select>
            {errors.product && <p className="text-red-600 text-sm mt-1">{errors.product}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.remainingQuantity || 999}
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quantity"
              disabled={!formData.product}
            />
            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
            {selectedProduct && (
              <p className="text-sm text-gray-500 mt-1">Available: {selectedProduct.remainingQuantity}</p>
            )}
          </div>

          {/* Merchant Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Merchant <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.merchant}
              onChange={(e) => handleInputChange('merchant', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.merchants || (userType === 'admin' && !formData.franchise)}
            >
              <option value="">{loading.merchants ? 'Loading...' : 'Select Merchant'}</option>
              {data.merchants.map(merchant => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.businessName} - {merchant.contactPersonEmail}
                </option>
              ))}
            </select>
            {errors.merchant && <p className="text-red-600 text-sm mt-1">{errors.merchant}</p>}
          </div>
        </div>
      </div>

      {/* Device Selection */}
      {data.devices.length > 0 && formData.quantity > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Select Devices ({selectedDevices.length}/{formData.quantity})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search devices..."
                value={deviceSearch}
                onChange={(e) => setDeviceSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading.devices ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredDevices.map(device => (
                <div
                  key={device.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedDevices.includes(device.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    } ${!selectedDevices.includes(device.id) && selectedDevices.length >= parseInt(formData.quantity)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }`}
                  onClick={() => handleDeviceToggle(device.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">SID: {device.sid}</div>
                      <div className="text-sm text-gray-600">MID: {device.mid}</div>
                      <div className="text-sm text-gray-600">TID: {device.tid}</div>
                      <div className="text-sm text-gray-600">VPA: {device.vpaid}</div>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedDevices.includes(device.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                      }`}>
                      {selectedDevices.includes(device.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.devices && <p className="text-red-600 text-sm mt-4">{errors.devices}</p>}
        </div>
      )}

      {/* Submit Button */}
      {formData.merchant && formData.quantity && selectedDevices.length === parseInt(formData.quantity) && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <button
            onClick={handleSubmit}
            disabled={loading.submitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{loading.submitting ? 'Distributing...' : 'Distribute Products'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDistribution;