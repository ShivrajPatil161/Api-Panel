import React, { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";

const FileUploadForm = () => {
  const [formData, setFormData] = useState({
    uploadFor: "",
    file: null,
    remarks: ""
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Configuration
  const FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const SUPPORTED_FORMATS = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/png": "PNG", 
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX"
  };

  const UPLOAD_CATEGORIES = [
    { value: "vendor", label: "Vendor Documentation" },
    { value: "product", label: "Product Information" },
    { value: "compliance", label: "Compliance Documents" },
    { value: "contract", label: "Contract & Agreements" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.uploadFor) {
      newErrors.uploadFor = "Please select an upload category";
    }

    if (!formData.file) {
      newErrors.file = "Please select a file to upload";
    } else {
      if (formData.file.size > FILE_SIZE) {
        newErrors.file = "File size exceeds 2MB limit";
      }
      if (!SUPPORTED_FORMATS[formData.file.type]) {
        newErrors.file = "Unsupported file format. Please upload PDF, JPEG, PNG, DOC, or DOCX files";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleInputChange("file", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsUploading(true);
    
    try {
      // Simulate API call
      const uploadData = new FormData();
      uploadData.append("uploadFor", formData.uploadFor);
      uploadData.append("file", formData.file);
      uploadData.append("remarks", formData.remarks);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("File uploaded successfully:", {
        category: formData.uploadFor,
        fileName: formData.file.name,
        fileSize: `${(formData.file.size / 1024).toFixed(1)} KB`,
        remarks: formData.remarks
      });

      setUploadSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ uploadFor: "", file: null, remarks: "" });
        setUploadSuccess(false);
        // Reset file input
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      }, 2000);

    } catch (error) {
      setErrors({ submit: "Upload failed. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const removeFile = () => {
    handleInputChange("file", null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Upload Successful</h3>
          <p className="text-green-600">Your file has been uploaded and processed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload Center
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Upload your business documents securely
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Upload Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.uploadFor}
              onChange={(e) => handleInputChange("uploadFor", e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 ${
                errors.uploadFor ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="">Select document category</option>
              {UPLOAD_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.uploadFor && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.uploadFor}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document File <span className="text-red-500">*</span>
            </label>
            
            {!formData.file ? (
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                errors.file ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
              }`}>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, JPEG, PNG, DOC, DOCX (max 2MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">{formData.file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(formData.file.size)} • {SUPPORTED_FORMATS[formData.file.type]}
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
                {errors.file}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Remarks
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="Add any additional notes or comments about this document..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {errors.submit && (
              <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}
            
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading Document...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Maximum file size: 2MB • Supported formats: PDF, JPEG, PNG, DOC, DOCX
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm;