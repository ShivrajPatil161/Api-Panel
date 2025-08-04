import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Calculator, AlertCircle, CheckCircle2, X, FileSpreadsheet, Subscript, SubtitlesIcon } from "lucide-react";

// Zod schema for form validation
const chargeCalculationSchema = z.object({
  customerType: z.string().min(1, "Please select customer type"),
  franchise: z.string().optional(),
  customer: z.string().min(1, "Please select a customer/merchant"),
  product: z.string().min(1, "Please select a product"),
  vendor: z.string().min(1, "Please select a vendor"),
  file: z.instanceof(File, { message: "Please upload the transactions Excel file" })
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) => [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv"
      ].includes(file.type),
      "Please upload Excel files only (XLS, XLSX, or CSV)"
    ),
  remarks: z.string().optional()
}).refine((data) => {
  if (data.customerType === "franchise") {
    return data.franchise && data.franchise.length > 0;
  }
  return true;
}, {
  message: "Please select a franchise",
  path: ["franchise"]
});

const ChargeCalculationsForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(chargeCalculationSchema),
    defaultValues: {
      customerType: "",
      franchise: "",
      customer: "",
      product: "",
      vendor: "",
      file: null,
      remarks: ""
    }
  });

  // Watch form values for conditional rendering
  const customerType = watch("customerType");
  const franchise = watch("franchise");
  const selectedFile = watch("file");

  // Configuration
  const SUPPORTED_FORMATS = {
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "text/csv": "CSV"
  };

  const CUSTOMER_TYPES = [
    { value: "franchise", label: "Merchant under Franchise" },
    { value: "direct", label: "Direct Merchant" }
  ];

  // Sample data - in real app, these would come from API
  const FRANCHISES = [
    { value: "franchise_001", label: "ABC Franchise Network" },
    { value: "franchise_002", label: "XYZ Franchise Group" },
    { value: "franchise_003", label: "PQR Franchise Solutions" },
    { value: "franchise_004", label: "MNO Franchise Partners" }
  ];

  const FRANCHISE_MERCHANTS = {
    franchise_001: [
      { value: "merchant_001_001", label: "ABC Delhi Central" },
      { value: "merchant_001_002", label: "ABC Delhi East" },
      { value: "merchant_001_003", label: "ABC Gurgaon Mall" }
    ],
    franchise_002: [
      { value: "merchant_002_001", label: "XYZ Mumbai Andheri" },
      { value: "merchant_002_002", label: "XYZ Mumbai Bandra" },
      { value: "merchant_002_003", label: "XYZ Pune Center" }
    ],
    franchise_003: [
      { value: "merchant_003_001", label: "PQR Bangalore Koramangala" },
      { value: "merchant_003_002", label: "PQR Bangalore Whitefield" },
      { value: "merchant_003_003", label: "PQR Hyderabad Hitech" }
    ],
    franchise_004: [
      { value: "merchant_004_001", label: "MNO Chennai Anna Nagar" },
      { value: "merchant_004_002", label: "MNO Chennai T Nagar" },
      { value: "merchant_004_003", label: "MNO Coimbatore RS Puram" }
    ]
  };

  const DIRECT_MERCHANTS = [
    { value: "direct_001", label: "RetailCorp Solutions" },
    { value: "direct_002", label: "TechMart India" },
    { value: "direct_003", label: "QuickBuy Services" },
    { value: "direct_004", label: "SmartPay Retailers" }
  ];

  const PRODUCTS = [
    { value: "pos_terminal", label: "POS Terminal Services" },
    { value: "payment_gateway", label: "Payment Gateway" },
    { value: "digital_wallet", label: "Digital Wallet" },
    { value: "upi_services", label: "UPI Services" },
    { value: "card_processing", label: "Card Processing" }
  ];

  const VENDORS = [
    { value: "vendor_001", label: "PayTech Solutions Pvt Ltd" },
    { value: "vendor_002", label: "FinanceFlow Systems" },
    { value: "vendor_003", label: "SecurePay Technologies" },
    { value: "vendor_004", label: "TransactEase Corp" }
  ];

  // Handle customer type change
  const handleCustomerTypeChange = (value) => {
    setValue("customerType", value);
    setValue("franchise", "");
    setValue("customer", "");
  };

  // Handle franchise change
  const handleFranchiseChange = (value) => {
    setValue("franchise", value);
    setValue("customer", "");
  };

  // Get customer options based on selection
  const getCustomerOptions = () => {
    if (customerType === "franchise" && franchise) {
      return FRANCHISE_MERCHANTS[franchise] || [];
    } else if (customerType === "direct") {
      return DIRECT_MERCHANTS;
    }
    return [];
  };

  // Handle file upload
  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    onChange(file);
  };

  // Remove file
  const removeFile = () => {
    setValue("file", null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Form submission
  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call for charge calculations
      const calculationData = new FormData();
      calculationData.append("customerType", data.customerType);
      if (data.customerType === "franchise") {
        calculationData.append("franchise", data.franchise);
      }
      calculationData.append("customer", data.customer);
      calculationData.append("product", data.product);
      calculationData.append("vendor", data.vendor);
      calculationData.append("transactionsFile", data.file);
      calculationData.append("remarks", data.remarks || "");

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log("Charge calculations initiated:", {
        customerType: data.customerType,
        franchise: data.franchise,
        customer: data.customer,
        product: data.product,
        vendor: data.vendor,
        fileName: data.file.name,
        fileSize: `${(data.file.size / 1024).toFixed(1)} KB`,
        remarks: data.remarks
      });

      setProcessSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        reset();
        setProcessSuccess(false);
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      }, 3000);

    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (processSuccess) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Calculation Processing Started</h3>
          <p className="text-green-600">Your merchant transactions file has been uploaded and charge calculations are being processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Charge Calculations Center
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Upload merchant transactions for automated charge calculations
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Customer Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Type <span className="text-red-500">*</span>
            </label>
            <Controller
              name="customerType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => handleCustomerTypeChange(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 ${
                    errors.customerType ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select customer type</option>
                  {CUSTOMER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.customerType && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.customerType.message}
              </p>
            )}
          </div>

          {/* Franchise Selection (only for franchise customers) */}
          {customerType === "franchise" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Franchise <span className="text-red-500">*</span>
              </label>
              <Controller
                name="franchise"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => handleFranchiseChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 ${
                      errors.franchise ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Select franchise</option>
                    {FRANCHISES.map(franchiseItem => (
                      <option key={franchiseItem.value} value={franchiseItem.value}>
                        {franchiseItem.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.franchise && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.franchise.message}
                </p>
              )}
            </div>
          )}

          {/* Customer/Merchant Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {customerType === "franchise" ? "Select Merchant" : "Select Customer"} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={!customerType || (customerType === "franchise" && !franchise)}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.customer ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">
                    {!customerType 
                      ? "First select customer type" 
                      : customerType === "franchise" && !franchise
                      ? "First select franchise"
                      : customerType === "franchise" 
                      ? "Select merchant" 
                      : "Select customer"}
                  </option>
                  {getCustomerOptions().map(customer => (
                    <option key={customer.value} value={customer.value}>
                      {customer.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.customer && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.customer.message}
              </p>
            )}
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Product <span className="text-red-500">*</span>
            </label>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 ${
                    errors.product ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select product</option>
                  {PRODUCTS.map(product => (
                    <option key={product.value} value={product.value}>
                      {product.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.product && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.product.message}
              </p>
            )}
          </div>

          {/* Vendor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Vendor <span className="text-red-500">*</span>
            </label>
            <Controller
              name="vendor"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 ${
                    errors.vendor ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select vendor</option>
                  {VENDORS.map(vendor => (
                    <option key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.vendor && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.vendor.message}
              </p>
            )}
          </div>

          {/* Excel File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Transactions Excel File <span className="text-red-500">*</span>
            </label>
            
            {!selectedFile ? (
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                errors.file ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
              }`}>
                <Controller
                  name="file"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <input
                        id="file-input"
                        type="file"
                        onChange={(e) => handleFileChange(e, onChange)}
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                      />
                      <label htmlFor="file-input" className="cursor-pointer">
                        <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium mb-1">
                          Click to upload merchant transactions file
                        </p>
                        <p className="text-sm text-gray-500">
                          Excel files only: XLSX, XLS, CSV (max 10MB)
                        </p>
                      </label>
                    </>
                  )}
                />
              </div>
            ) : (
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)} • {SUPPORTED_FORMATS[selectedFile.type]}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {errors.file && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.file.message}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Remarks
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Add any specific notes about the calculation requirements or special considerations..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Calculations...
                </>
              ) : (
                <>
                  <SubtitlesIcon className="w-5 h-5" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Maximum file size: 10MB • Supported formats: XLSX, XLS, CSV • Ensure your Excel file contains all merchant transaction data
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChargeCalculationsForm;