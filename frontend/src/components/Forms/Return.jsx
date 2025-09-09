import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, X } from 'lucide-react';

// Zod validation schema
const returnSchema = z.object({
  returnNumber: z.string().min(1, "Return number is required"),
  originalDeliveryNumber: z.string().min(1, "Original delivery number is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  customerName: z.string().min(1, "Customer name is required"),
  returnDate: z.string().min(1, "Return date is required"),
  receivedBy: z.string().min(1, "Receiver name is required"),
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  productType: z.string().min(1, "Product type is required"),
  quantity: z.number().min(1, "Original quantity must be at least 1"),
  returnedQuantity: z.number().min(1, "Returned quantity must be at least 1"),
  returnReason: z.string().min(1, "Return reason is required"),
  returnCondition: z.string().min(1, "Return condition is required"),
  actionTaken: z.string().min(1, "Action taken is required"),
  refundAmount: z.number().min(0, "Refund amount must be positive").optional(),
  approvedBy: z.string().optional(),
  isWarranty: z.boolean().optional(),
  replacementRequired: z.boolean().optional(),
  inspectionNotes: z.string().optional(),
  remarks: z.string().optional(),
}).refine((data) => data.returnedQuantity <= data.quantity, {
  message: "Returned quantity cannot exceed original quantity",
  path: ["returnedQuantity"],
});

// Reusable Input Component
const FormInput = ({ label, name, register, errors, required = false, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, {
        valueAsNumber: type === 'number' ? true : false,
        required: required && `${label} is required`
      })}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors[name] ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
        }`}
      {...props}
    />
    {errors[name] && (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name].message}
      </div>
    )}
  </div>
);

// Reusable Select Component
const FormSelect = ({ label, name, register, errors, required = false, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, { required: required && `${label} is required` })}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors[name] ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
        }`}
      {...props}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name].message}
      </div>
    )}
  </div>
);

// Reusable Textarea Component
const FormTextarea = ({ label, name, register, errors, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...register(name, { required: required && `${label} is required` })}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors[name] ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
        }`}
      {...props}
    />
    {errors[name] && (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {errors[name].message}
      </div>
    )}
  </div>
);

// Serial Number Grid Component
const SerialNumberGrid = ({ quantity, returnedQuantity, onSelectionChange }) => {
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [selectedSerials, setSelectedSerials] = useState(new Set());

  // Generate dummy serial numbers when quantity changes
  useEffect(() => {
    if (quantity > 0) {
      const newSerials = Array.from({ length: quantity }, (_, index) => ({
        id: index + 1,
        tid: `TID${String(Math.floor(Math.random() * 900000) + 100000)}`,
        mid: `MID${String(Math.floor(Math.random() * 900000) + 100000)}`,
        sid: `SID${String(Math.floor(Math.random() * 900000) + 100000)}`,
        vpaid: `VPA${String(Math.floor(Math.random() * 900000) + 100000)}`,
      }));
      setSerialNumbers(newSerials);
      setSelectedSerials(new Set());
    } else {
      setSerialNumbers([]);
      setSelectedSerials(new Set());
    }
  }, [quantity]);

  // Handle row selection
  const handleRowSelection = (serialId, isSelected) => {
    const newSelected = new Set(selectedSerials);

    if (isSelected && selectedSerials.size < returnedQuantity) {
      newSelected.add(serialId);
    } else if (!isSelected) {
      newSelected.delete(serialId);
    }

    setSelectedSerials(newSelected);

    // Pass selected serials to parent
    const selectedData = serialNumbers.filter(serial => newSelected.has(serial.id));
    onSelectionChange(selectedData);
  };

  if (!quantity || quantity === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">Enter original quantity to generate serial numbers</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Serial Numbers</h4>
          <div className="text-sm text-gray-600">
            Selected: {selectedSerials.size} / {returnedQuantity} (Max: {returnedQuantity})
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VPAID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {serialNumbers.map((serial) => {
              const isSelected = selectedSerials.has(serial.id);
              const canSelect = !isSelected && selectedSerials.size < returnedQuantity;

              return (
                <tr
                  key={serial.id}
                  className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleRowSelection(serial.id, e.target.checked)}
                      disabled={!canSelect && !isSelected}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {serial.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {serial.tid}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {serial.mid}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {serial.sid}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {serial.vpaid}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {returnedQuantity > 0 && selectedSerials.size !== returnedQuantity && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-3">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-700">
              Please select exactly {returnedQuantity} serial number{returnedQuantity !== 1 ? 's' : ''} for return.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const OptimizedReturns = ({onSubmit,onCancel}) => {
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      quantity: 0,
      returnedQuantity: 0,
      refundAmount: 0,
      isWarranty: false,
      replacementRequired: false,
    }
  });

  // Watch quantity and returnedQuantity for serial number grid
  const quantity = watch('quantity');
  const returnedQuantity = watch('returnedQuantity');

  // Form options
  const productTypes = [
    { value: 'pos_machine', label: 'POS Machine' },
    { value: 'qr_scanner', label: 'QR Scanner' },
    { value: 'card_reader', label: 'Card Reader' },
    { value: 'printer', label: 'Thermal Printer' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ];

  const returnReasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_product', label: 'Wrong Product Delivered' },
    { value: 'damage_in_transit', label: 'Damage in Transit' },
    { value: 'customer_request', label: 'Customer Request' },
    { value: 'warranty_claim', label: 'Warranty Claim' },
    { value: 'upgrade_request', label: 'Upgrade Request' },
    { value: 'excess_stock', label: 'Excess Stock' },
    { value: 'other', label: 'Other' }
  ];

  const returnConditions = [
    { value: 'new', label: 'New/Unused' },
    { value: 'good', label: 'Good Condition' },
    { value: 'fair', label: 'Fair Condition' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'not_working', label: 'Not Working' }
  ];

  const actionsTaken = [
    { value: 'replacement', label: 'Replacement Provided' },
    { value: 'refund', label: 'Refund Processed' },
    { value: 'repair', label: 'Sent for Repair' },
    { value: 'credit_note', label: 'Credit Note Issued' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'pending', label: 'Pending Review' }
  ];


  const handleSerialSelectionChange = (selectedSerials) => {
    setSelectedSerialNumbers(selectedSerials);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
       {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {'Add New Return Entry'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

      <div className="space-y-8">
        {/* Return & Customer Details + Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Return & Customer Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Return & Customer Details</h3>
            <div className="space-y-4">
              <FormInput
                label="Return Number"
                name="returnNumber"
                register={register}
                errors={errors}
                required
                placeholder="Enter return number"
              />
              <FormInput
                label="Original Delivery Number"
                name="originalDeliveryNumber"
                register={register}
                errors={errors}
                required
                placeholder="Enter original delivery number"
              />
              <FormInput
                label="Customer ID"
                name="customerId"
                register={register}
                errors={errors}
                required
                placeholder="Enter customer ID"
              />
              <FormInput
                label="Customer Name"
                name="customerName"
                register={register}
                errors={errors}
                required
                placeholder="Enter customer name"
              />
              <FormInput
                label="Return Date"
                name="returnDate"
                type="date"
                register={register}
                errors={errors}
                required
              />
              <FormInput
                label="Received By"
                name="receivedBy"
                register={register}
                errors={errors}
                required
                placeholder="Enter receiver name"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
            <div className="space-y-4">
              <FormInput
                label="Product ID"
                name="productId"
                register={register}
                errors={errors}
                required
                placeholder="Enter product ID"
              />
              <FormInput
                label="Product Name"
                name="productName"
                register={register}
                errors={errors}
                required
                placeholder="Enter product name"
              />
              <FormSelect
                label="Product Type"
                name="productType"
                register={register}
                errors={errors}
                required
                options={productTypes}
              />
              <FormInput
                label="Original Quantity"
                name="quantity"
                type="number"
                register={register}
                errors={errors}
                required
                min="1"
                placeholder="Enter original quantity"
              />
              <FormInput
                label="Returned Quantity"
                name="returnedQuantity"
                type="number"
                register={register}
                errors={errors}
                required
                min="1"
                max={quantity || undefined}
                placeholder="Enter returned quantity"
              />
            </div>
          </div>
        </div>

        {/* Serial Numbers Grid - Full Width */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Serial Numbers Selection</h3>
          <SerialNumberGrid
            quantity={quantity || 0}
            returnedQuantity={returnedQuantity || 0}
            onSelectionChange={handleSerialSelectionChange}
          />
        </div>

        {/* Return Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Return Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <FormSelect
              label="Return Reason"
              name="returnReason"
              register={register}
              errors={errors}
              required
              options={returnReasons}
            />
            <FormSelect
              label="Return Condition"
              name="returnCondition"
              register={register}
              errors={errors}
              required
              options={returnConditions}
            />
            <FormSelect
              label="Action Taken"
              name="actionTaken"
              register={register}
              errors={errors}
              required
              options={actionsTaken}
            />
            <FormInput
              label="Refund Amount"
              name="refundAmount"
              type="number"
              register={register}
              errors={errors}
              step="0.01"
              min="0"
              placeholder="Enter refund amount"
            />
            <FormInput
              label="Approved By"
              name="approvedBy"
              register={register}
              errors={errors}
              placeholder="Enter approver name"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Controller
                name="isWarranty"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    value=""
                    checked={field.value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                )}
              />
              <label className="text-sm text-gray-700">
                This is a warranty return
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Controller
                name="replacementRequired"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    value=""
                    checked={field.value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                )}
              />
              <label className="text-sm text-gray-700">
                Replacement required
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextarea
              label="Inspection Notes"
              name="inspectionNotes"
              register={register}
              errors={errors}
              rows={4}
              placeholder="Enter detailed inspection notes"
            />
            <FormTextarea
              label="Remarks"
              name="remarks"
              register={register}
              errors={errors}
              rows={4}
              placeholder="Enter any additional remarks"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : null}
            <span>{isSubmitting ? 'Saving...' : 'Save Return Entry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedReturns;