import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Phone, Mail, MapPin, FileText, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

// Validation schema
const vendorSchema = z.object({
  vendorName: z.string().min(2, 'Vendor name must be at least 2 characters'),
  bankName: z.string().min(2, 'Bank name is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  alternatePhone: z.string().regex(/^[0-9]{10}$/, 'Alternate phone must be 10 digits').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  alternateEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
  agreementStartDate: z.string().min(1, 'Agreement start date is required'),
  agreementEndDate: z.string().min(1, 'Agreement end date is required'),
  creditPeriod: z.number().min(0, 'Credit period must be 0 or more days'),
  paymentTerms: z.string().min(5, 'Payment terms are required'),
  status: z.enum(['active', 'inactive']),
  remarks: z.string().optional()
});

const VendorMasterForm = ({ onSubmit, initialData = null, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData || {
      vendorName: '',
      bankName: '',
      contactPerson: '',
      phoneNumber: '',
      alternatePhone: '',
      email: '',
      alternateEmail: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      agreementStartDate: '',
      agreementEndDate: '',
      creditPeriod: 30,
      paymentTerms: '',
      status: 'active',
      remarks: ''
    }
  });

  const watchStatus = watch('status');

  const handleFormSubmit = (data) => {
    console.log('Form Data:', data);
    onSubmit?.(data);
  };

  const toggleStatus = () => {
    setValue('status', watchStatus === 'active' ? 'inactive' : 'active');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
                </h1>
                <p className="text-blue-100">
                  {isEdit ? 'Update vendor information' : 'Register a new vendor in the system'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name *
                  </label>
                  <input
                    {...register('vendorName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter vendor name"
                  />
                  {errors.vendorName && (
                    <p className="text-red-500 text-sm mt-1">{errors.vendorName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    {...register('bankName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    {...register('contactPerson')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
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

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phoneNumber')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    {...register('alternatePhone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter alternate phone number"
                    maxLength={10}
                  />
                  {errors.alternatePhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.alternatePhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Email
                  </label>
                  <input
                    {...register('alternateEmail')}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter alternate email"
                  />
                  {errors.alternateEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.alternateEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      {...register('state')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      {...register('pincode')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Legal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number *
                  </label>
                  <input
                    {...register('gstNumber')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter GST number (15 digits)"
                    maxLength={15}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.gstNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.gstNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number *
                  </label>
                  <input
                    {...register('panNumber')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PAN number (10 digits)"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.panNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.panNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement Terms */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Agreement Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agreement Start Date *
                  </label>
                  <input
                    {...register('agreementStartDate')}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.agreementStartDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.agreementStartDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agreement End Date *
                  </label>
                  <input
                    {...register('agreementEndDate')}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.agreementEndDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.agreementEndDate.message}</p>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter credit period in days"
                  />
                  {errors.creditPeriod && (
                    <p className="text-red-500 text-sm mt-1">{errors.creditPeriod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms *
                  </label>
                  <input
                    {...register('paymentTerms')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Net 30, Advance payment"
                  />
                  {errors.paymentTerms && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Vendor' : 'Create Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorMasterForm;