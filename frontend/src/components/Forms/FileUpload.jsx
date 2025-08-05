import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  Building2,
  Package,
  Trash2
} from 'lucide-react';

// Zod validation schema
const formSchema = z.object({
  vendor: z.string().min(1, "Please select a vendor"),
  product: z.string().min(1, "Please select a product"),
  file: z.any().optional().refine((file) => {
    if (!file || file.length === 0) return false;
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    return validTypes.includes(file[0]?.type);
  }, "Please upload a valid Excel file (.xlsx, .xls, .csv)")
});

// Mock vendor data with their products
const vendorsData = [
  {
    id: 'vendor-1',
    name: 'TechFlow Solutions',
    email: 'contact@techflow.com',
    products: [
      { id: 'prod-1', name: 'POS Terminal Pro', category: 'Hardware', price: 15000 },
      { id: 'prod-2', name: 'QR Scanner Deluxe', category: 'Hardware', price: 8500 },
      { id: 'prod-3', name: 'Payment Gateway License', category: 'Software', price: 25000 }
    ]
  },
  {
    id: 'vendor-2',
    name: 'FinTech Devices Ltd',
    email: 'sales@fintechdevices.com',
    products: [
      { id: 'prod-4', name: 'Mobile Card Reader', category: 'Hardware', price: 5500 },
      { id: 'prod-5', name: 'Bluetooth Soundbox', category: 'Hardware', price: 3200 },
      { id: 'prod-6', name: 'Digital Receipt Printer', category: 'Hardware', price: 12000 }
    ]
  },
  {
    id: 'vendor-3',
    name: 'Smart Payment Systems',
    email: 'info@smartpayments.com',
    products: [
      { id: 'prod-7', name: 'NFC Payment Device', category: 'Hardware', price: 18000 },
      { id: 'prod-8', name: 'Inventory Management Software', category: 'Software', price: 35000 },
      { id: 'prod-9', name: 'Analytics Dashboard License', category: 'Software', price: 28000 }
    ]
  },
  {
    id: 'vendor-4',
    name: 'Digital Commerce Hub',
    email: 'support@digitalcommerce.com',
    products: [
      { id: 'prod-10', name: 'All-in-One POS System', category: 'Hardware', price: 45000 },
      { id: 'prod-11', name: 'Barcode Scanner Pro', category: 'Hardware', price: 7800 },
      { id: 'prod-12', name: 'Cloud Storage Service', category: 'Software', price: 15000 }
    ]
  }
];

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
const Select = ({ placeholder, options, value, onChange, error, disabled = false }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${error
      ? 'border-red-300 focus:border-red-500'
      : 'border-gray-200 focus:border-blue-500'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// File Upload Component
const FileUpload = ({ onFileSelect, selectedFile, error }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
              ? 'border-red-300 hover:border-red-400'
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your Excel file here, or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx, .xls, and .csv files up to 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Excel Preview Component with SheetJS
const ExcelPreview = ({ file }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [fileStats, setFileStats] = useState(null);

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Get sheet names
      const sheets = workbook.SheetNames;
      setSheetNames(sheets);

      // Use first sheet by default
      const firstSheetName = sheets[0];
      setSelectedSheet(firstSheetName);

      // Convert sheet to JSON
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        setError('The Excel file appears to be empty.');
        return;
      }

      // Extract headers and rows
      const headers = jsonData[0] || [];
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

      // Limit preview to first 10 rows for performance
      const previewRows = rows.slice(0, 10);

      // File statistics
      const stats = {
        totalSheets: sheets.length,
        totalRows: rows.length,
        totalColumns: headers.length,
        previewRows: previewRows.length
      };

      setFileStats(stats);
      setPreviewData({
        headers: headers.map(h => h?.toString() || ''),
        rows: previewRows.map(row =>
          headers.map((_, index) => row[index]?.toString() || '')
        )
      });

    } catch (err) {
      console.error('Excel parsing error:', err);
      setError('Failed to parse Excel file. Please ensure it\'s a valid Excel file (.xlsx, .xls, .csv).');
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChange = async (sheetName) => {
    if (!file || !sheetName) return;

    setLoading(true);
    setSelectedSheet(sheetName);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0] || [];
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));
      const previewRows = rows.slice(0, 10);

      const stats = {
        totalSheets: workbook.SheetNames.length,
        totalRows: rows.length,
        totalColumns: headers.length,
        previewRows: previewRows.length
      };

      setFileStats(stats);
      setPreviewData({
        headers: headers.map(h => h?.toString() || ''),
        rows: previewRows.map(row =>
          headers.map((_, index) => row[index]?.toString() || '')
        )
      });

    } catch (err) {
      setError('Failed to load the selected sheet.');
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewData(null);
    setError(null);
    setSheetNames([]);
    setSelectedSheet('');
    setFileStats(null);
  };

  const downloadJSON = () => {
    if (!previewData) return;

    const data = previewData.rows.map(row => {
      const obj = {};
      previewData.headers.forEach((header, index) => {
        obj[header || `Column_${index + 1}`] = row[index] || '';
      });
      return obj;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}_preview.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!file || loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{loading ? 'Loading...' : 'Preview File'}</span>
          </button>

          {previewData && (
            <>
              <button
                type="button"
                onClick={closePreview}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Close Preview</span>
              </button>

              <button
                type="button"
                onClick={downloadJSON}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Statistics */}
      {fileStats && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">File Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Sheets:</span>
              <span className="ml-1 text-blue-600">{fileStats.totalSheets}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Rows:</span>
              <span className="ml-1 text-blue-600">{fileStats.totalRows}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Columns:</span>
              <span className="ml-1 text-blue-600">{fileStats.totalColumns}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Previewing:</span>
              <span className="ml-1 text-blue-600">{fileStats.previewRows} rows</span>
            </div>
          </div>
        </div>
      )}

      {/* Sheet Selection */}
      {sheetNames.length > 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Sheet</label>
          <select
            value={selectedSheet}
            onChange={(e) => handleSheetChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sheetNames.map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Preview Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {previewData && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                File Preview {selectedSheet && `- ${selectedSheet}`}
              </h3>
              <p className="text-sm text-gray-600">
                Showing first {previewData.rows.length} rows of {fileStats?.totalRows || 0} total rows
              </p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  {previewData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24"
                    >
                      {header || `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                        title={cell}
                      >
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Form Component
const VendorProductUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState('');

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: '',
      product: '',
      file: null
    }
  });

  const watchedVendor = watch('vendor');

  // Get products for selected vendor
  const selectedVendorData = vendorsData.find(v => v.id === watchedVendor);
  const availableProducts = selectedVendorData?.products || [];

  // Handle vendor change
  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    setValue('vendor', vendorId);
    setValue('product', ''); // Reset product when vendor changes
    setSelectedVendor(vendorId);
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setValue('file', file ? [file] : []);
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      console.log('Form Data:', {
        vendor: selectedVendorData,
        product: availableProducts.find(p => p.id === data.product),
        file: selectedFile
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Form submitted successfully!');

      // Reset form
      reset();
      setSelectedFile(null);
      setSelectedVendor('');

    } catch (error) {
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Product Upload</h1>
            <p className="text-gray-600">Upload product data for selected vendor with Excel preview</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-8">
          {/* Vendor Selection */}
          <FormField label="Select Vendor" error={errors.vendor} required>
            <Select
              placeholder="Choose a vendor"
              options={vendorsData.map(vendor => ({
                value: vendor.id,
                label: `${vendor.name} (${vendor.email})`
              }))}
              value={watchedVendor}
              onChange={handleVendorChange}
              error={errors.vendor}
            />
          </FormField>

          {/* Product Selection */}
          <FormField label="Select Product" error={errors.product} required>
            <Select
              placeholder={selectedVendor ? "Choose a product" : "Select vendor first"}
              options={availableProducts.map(product => ({
                value: product.id,
                label: `${product.name} - ₹${product.price.toLocaleString()} (${product.category})`
              }))}
              value={watch('product')}
              onChange={(e) => setValue('product', e.target.value)}
              error={errors.product}
              disabled={!selectedVendor}
            />
          </FormField>

          {/* Selected Product Info */}
          {watch('product') && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {availableProducts.find(p => p.id === watch('product'))?.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Category: {availableProducts.find(p => p.id === watch('product'))?.category} |
                    Price: ₹{availableProducts.find(p => p.id === watch('product'))?.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <FormField label="Upload Excel File" error={errors.file} required>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              error={errors.file}
            />
          </FormField>

          {/* File Preview */}
          {selectedFile && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">File Preview & Analysis</h3>
              <ExcelPreview file={selectedFile} />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>
                {isSubmitting ? 'Uploading...' : 'Submit Form'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductUploadForm;