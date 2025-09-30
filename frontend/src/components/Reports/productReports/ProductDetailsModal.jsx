// frontend/src/components/Reports/ProductDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Building, 
  Users, 
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader
} from 'lucide-react';
import productReportApi from '../../../constants/API/productReportApi';
const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [validSchemes, setValidSchemes] = useState([]);
  const [merchantSchemes, setMerchantSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch detailed pricing schemes when modal opens
  useEffect(() => {
    if (isOpen && product?.id) {
      fetchPricingSchemes();
    }
  }, [isOpen, product?.id]);

  const fetchPricingSchemes = async () => {
    if (!product?.id || !product?.category?.productCategoryName) return;
    
    setLoading(true);
    try {
      // Fetch franchise schemes
      const franchiseResponse = await productReportApi.getValidPricingSchemes(
        product.id, 
        product.category.productCategoryName, 
        'FRANCHISE'
      );
      setValidSchemes(franchiseResponse || []);

      // Fetch merchant schemes
      const merchantResponse = await productReportApi.getValidPricingSchemes(
        product.id, 
        product.category.productCategoryName, 
        'direct_merchant'
      );
      setMerchantSchemes(merchantResponse || []);
    } catch (error) {
      console.error('Error fetching pricing schemes:', error);
      setValidSchemes([]);
      setMerchantSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const tabs = [
    { id: 'details', label: 'Product Details', icon: Package },
    { id: 'schemes', label: 'Pricing Schemes', icon: DollarSign },
    { id: 'assignments', label: 'Assignments', icon: Users },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{product.productName}</h2>
              <p className="text-blue-100 text-sm">{product.productCode}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Name</label>
                      <p className="text-gray-900 font-medium">{product.productName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Code</label>
                      <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {product.productCode}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900">{product.categoryName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor</label>
                      <p className="text-gray-900">{product.vendorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center gap-2">
                        {product.status ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    Technical Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Brand</label>
                      <p className="text-gray-900">{product.brand}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Model</label>
                      <p className="text-gray-900">{product.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">HSN Code</label>
                      <p className="text-gray-900 font-mono text-sm">{product.hsn}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Warranty</label>
                      <p className="text-gray-900">
                        {product.warrantyPeriod} months ({product.warrantyType})
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Min Order Qty</label>
                        <p className="text-gray-900">{product.minOrderQuantity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Max Order Qty</label>
                        <p className="text-gray-900">{product.maxOrderQuantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Description
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Remarks */}
              {product.remarks && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Remarks
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <p className="text-orange-800">{product.remarks}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="space-y-6">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading pricing schemes...</span>
                </div>
              )}

              {!loading && (
                <>
                  {/* Franchise Schemes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-500" />
                      Franchise Pricing Schemes
                    </h3>
                    {validSchemes.length > 0 ? (
                      <div className="space-y-3">
                        {validSchemes.map((scheme) => (
                          <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{scheme.schemeCode}</h4>
                                <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-green-600">
                                    Monthly Rental: ₹{scheme.rentalByMonth?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {scheme.customerType}
                              </span>
                            </div>
                            {scheme.cardRates && scheme.cardRates.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Card Rates:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {scheme.cardRates.map((rate, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span className="text-gray-600">{rate.cardName}:</span>
                                      <span className="font-medium">
                                        ₹{rate.franchiseRate?.toLocaleString() || rate.rate?.toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No franchise pricing schemes available</p>
                      </div>
                    )}
                  </div>

                  {/* Direct Merchant Schemes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Direct Merchant Pricing Schemes
                    </h3>
                    {merchantSchemes.length > 0 ? (
                      <div className="space-y-3">
                        {merchantSchemes.map((scheme) => (
                          <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{scheme.schemeCode}</h4>
                                <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-green-600">
                                    Monthly Rental: ₹{scheme.rentalByMonth?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {scheme.customerType}
                              </span>
                            </div>
                            {scheme.cardRates && scheme.cardRates.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Card Rates:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {scheme.cardRates.map((rate, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span className="text-gray-600">{rate.cardName}:</span>
                                      <span className="font-medium">
                                        ₹{rate.rate?.toLocaleString() || rate.merchantRate?.toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No direct merchant pricing schemes available</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Current Assignments ({product.assignments?.length || 0})
              </h3>
              {product.assignments && product.assignments.length > 0 ? (
                <div className="space-y-4">
                  {product.assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.customerType === 'FRANCHISE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {assignment.customerType}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              Customer ID: {assignment.customerId}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Effective: {new Date(assignment.effectiveDate).toLocaleDateString()}</span>
                            </div>
                            {assignment.expiryDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Expires: {new Date(assignment.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {assignment.remarks && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {assignment.remarks}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Scheme ID</p>
                          <p className="font-mono text-sm">{assignment.schemeId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No scheme assignments found</p>
                  <p className="text-sm">This product has not been assigned to any customers yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;