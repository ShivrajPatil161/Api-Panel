
import React, { useState } from "react";
import { Building2, Store, Plus, Trash2, Users, Mail, Hash, AlertCircle, CheckCircle2, User, Contact } from "lucide-react";

const CustomerOnboarding = () => {
  const [customerType, setCustomerType] = useState("");
  const [franchiseData, setFranchiseData] = useState({
    name: "",
    code: "",
    email: "",
    contactPersonName: "",
    contactPersonPosition:"",
    contactPersonEmail:"",
    contactPersonNumber:"",
    contactPersonDOB:"",
    merchants: []
  });
  const [merchantData, setMerchantData] = useState({
    name: "",
    code: "",
    email: "",
    franchiseId: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock franchise options
  const franchiseOptions = [
    { id: "f1", name: "Franchise Alpha", code: "FA001" },
    { id: "f2", name: "Franchise Beta", code: "FB002" },
    { id: "f3", name: "Franchise Gamma", code: "FG003" },
    { id: "f4", name: "Franchise Delta", code: "FD004" }
  ];

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerType) {
      newErrors.customerType = "Please select a customer type";
    }

    if (customerType === "franchise") {
      if (!franchiseData.name.trim()) {
        newErrors.franchiseName = "Franchise name is required";
      }
      if (!franchiseData.code.trim()) {
        newErrors.franchiseCode = "Franchise code is required";
      }
      if (!franchiseData.email.trim()) {
        newErrors.franchiseEmail = "Franchise email is required";
      } else if (!validateEmail(franchiseData.email)) {
        newErrors.franchiseEmail = "Please enter a valid email address";
      }

      // Validate merchants
      franchiseData.merchants.forEach((merchant, index) => {
        if (!merchant.name.trim()) {
          newErrors[`merchant_${index}_name`] = "Merchant name is required";
        }
        if (!merchant.code.trim()) {
          newErrors[`merchant_${index}_code`] = "Merchant code is required";
        }
        if (!merchant.email.trim()) {
          newErrors[`merchant_${index}_email`] = "Merchant email is required";
        } else if (!validateEmail(merchant.email)) {
          newErrors[`merchant_${index}_email`] = "Please enter a valid email address";
        }
      });
    }

    if (customerType === "merchant") {
      if (!merchantData.name.trim()) {
        newErrors.merchantName = "Merchant name is required";
      }
      if (!merchantData.code.trim()) {
        newErrors.merchantCode = "Merchant code is required";
      }
      if (!merchantData.email.trim()) {
        newErrors.merchantEmail = "Merchant email is required";
      } else if (!validateEmail(merchantData.email)) {
        newErrors.merchantEmail = "Please enter a valid email address";
      }
      if (!merchantData.franchiseId) {
        newErrors.franchiseId = "Please select a franchise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFranchiseChange = (field, value) => {
    setFranchiseData(prev => ({ ...prev, [field]: value }));
    // Clear related errors
    if (errors[`franchise${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`franchise${field.charAt(0).toUpperCase() + field.slice(1)}`]: "" }));
    }
  };

  const handleMerchantChange = (field, value) => {
    setMerchantData(prev => ({ ...prev, [field]: value }));
    // Clear related errors
    if (errors[`merchant${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`merchant${field.charAt(0).toUpperCase() + field.slice(1)}`]: "" }));
    }
  };

  const addMerchant = () => {
    setFranchiseData(prev => ({
      ...prev,
      merchants: [...prev.merchants, { name: "", code: "", email: "" }]
    }));
  };

  const removeMerchant = (index) => {
    setFranchiseData(prev => ({
      ...prev,
      merchants: prev.merchants.filter((_, i) => i !== index)
    }));
    
    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`merchant_${index}_name`];
    delete newErrors[`merchant_${index}_code`];
    delete newErrors[`merchant_${index}_email`];
    setErrors(newErrors);
  };

  const updateMerchant = (index, field, value) => {
    setFranchiseData(prev => ({
      ...prev,
      merchants: prev.merchants.map((merchant, i) => 
        i === index ? { ...merchant, [field]: value } : merchant
      )
    }));
    
    // Clear related errors
    if (errors[`merchant_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`merchant_${index}_${field}`]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const submitData = customerType === "franchise" ? 
        { type: "franchise", data: franchiseData } : 
        { type: "merchant", data: merchantData };

      console.log("Form Submitted:", submitData);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setCustomerType("");
        setFranchiseData({ name: "", code: "", email: "", merchants: [] });
        setMerchantData({ name: "", code: "", email: "", franchiseId: "" });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      setErrors({ submit: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-green-800 mb-2">Onboarding Successful!</h3>
          <p className="text-green-600 text-lg">
            {customerType === "franchise" ? "Franchise" : "Merchant"} has been successfully onboarded to the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7" />
            Customer Onboarding Portal
          </h1>
          <p className="text-indigo-100 mt-1">
            Streamline your franchise and merchant registration process
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Customer Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setCustomerType("franchise");
                  setErrors(prev => ({ ...prev, customerType: "" }));
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  customerType === "franchise"
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <Building2 className={`w-12 h-12 mx-auto mb-3 ${
                  customerType === "franchise" ? "text-indigo-600" : "text-gray-400"
                }`} />
                <h4 className="font-semibold text-gray-800 mb-2">Franchise</h4>
                <p className="text-sm text-gray-600">
                  Register a new franchise with multiple merchant locations
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomerType("merchant");
                  setErrors(prev => ({ ...prev, customerType: "" }));
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  customerType === "merchant"
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <Store className={`w-12 h-12 mx-auto mb-3 ${
                  customerType === "merchant" ? "text-indigo-600" : "text-gray-400"
                }`} />
                <h4 className="font-semibold text-gray-800 mb-2">Merchant</h4>
                <p className="text-sm text-gray-600">
                  Register a single merchant under an existing franchise
                </p>
              </button>
            </div>

            {errors.customerType && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.customerType}
              </p>
            )}
          </div>

          {/* Franchise Form */}
          {customerType === "franchise" && (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Franchise Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Franchise Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={franchiseData.name}
                        onChange={(e) => handleFranchiseChange("name", e.target.value)}
                        placeholder="Enter franchise name"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseName ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Franchise Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={franchiseData.code}
                        onChange={(e) => handleFranchiseChange("code", e.target.value)}
                        placeholder="e.g., FC001"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseCode ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Franchise Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={franchiseData.email}
                        onChange={(e) => handleFranchiseChange("email", e.target.value)}
                        placeholder="franchise@example.com"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseEmail ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Person Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={franchiseData.contactPersonName}
                        onChange={(e) => handleFranchiseChange("contactPersonName", e.target.value)}
                        placeholder="Enter person name"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseName ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={franchiseData.contactPersonPosition}
                        onChange={(e) => handleFranchiseChange("contactPersonPosition", e.target.value)}
                        placeholder="Enter Position"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseCode ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {/* <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" /> */}
                      <input
                        type="email"
                        value={franchiseData.contactPersonEmail}
                        onChange={(e) => handleFranchiseChange("contactPersonEmail", e.target.value)}
                        placeholder="Enter email"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseEmail ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {/* <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" /> */}
                      <input
                        type="email"
                        value={franchiseData.contactPersonNumber}
                        onChange={(e) => handleFranchiseChange("contactPersonNumber", e.target.value)}
                        placeholder="Enter email"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseEmail ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {/* <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" /> */}
                      <input
                        type="date"
                        value={franchiseData.contactPersonDOB}
                        onChange={(e) => handleFranchiseChange("contactPersonDOB", e.target.value)}
                        placeholder="Enter email"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.franchiseEmail ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.franchiseEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.franchiseEmail}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Merchants Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Merchants under Franchise
                  </h3>
                  <button
                    type="button"
                    onClick={addMerchant}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Merchant
                  </button>
                </div>

                {franchiseData.merchants.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No merchants added yet. Click "Add Merchant" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {franchiseData.merchants.map((merchant, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">Merchant #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMerchant(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={merchant.name}
                              onChange={(e) => updateMerchant(index, "name", e.target.value)}
                              placeholder="Merchant name"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`merchant_${index}_name`] ? "border-red-300 bg-red-50" : "border-gray-200"
                              }`}
                            />
                            {errors[`merchant_${index}_name`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`merchant_${index}_name`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Code <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={merchant.code}
                              onChange={(e) => updateMerchant(index, "code", e.target.value)}
                              placeholder="e.g., MC001"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`merchant_${index}_code`] ? "border-red-300 bg-red-50" : "border-gray-200"
                              }`}
                            />
                            {errors[`merchant_${index}_code`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`merchant_${index}_code`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={merchant.email}
                              onChange={(e) => updateMerchant(index, "email", e.target.value)}
                              placeholder="merchant@example.com"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`merchant_${index}_email`] ? "border-red-300 bg-red-50" : "border-gray-200"
                              }`}
                            />
                            {errors[`merchant_${index}_email`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`merchant_${index}_email`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Merchant Form */}
          {customerType === "merchant" && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Merchant Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Merchant Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={merchantData.name}
                      onChange={(e) => handleMerchantChange("name", e.target.value)}
                      placeholder="Enter merchant name"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        errors.merchantName ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-gray-00"
                      }`}
                    />
                  </div>
                  {errors.merchantName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.merchantName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Merchant Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={merchantData.code}
                      onChange={(e) => handleMerchantChange("code", e.target.value)}
                      placeholder="e.g., MC001"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.merchantCode ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                  </div>
                  {errors.merchantCode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.merchantCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Merchant Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={merchantData.email}
                      onChange={(e) => handleMerchantChange("email", e.target.value)}
                      placeholder="merchant@example.com"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.merchantEmail ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-orange-500"
                      }`}
                    />
                  </div>
                  {errors.merchantEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.merchantEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign to Franchise <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={merchantData.franchiseId}
                      onChange={(e) => handleMerchantChange("franchiseId", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none ${
                        errors.franchiseId ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-orange-500"
                      }`}
                    >
                      <option value="">Select a franchise</option>
                      {franchiseOptions.map((franchise) => (
                        <option key={franchise.id} value={franchise.id}>
                          {franchise.name} ({franchise.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.franchiseId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.franchiseId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Section */}
          {customerType && (
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Onboarding...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Onboarding
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;