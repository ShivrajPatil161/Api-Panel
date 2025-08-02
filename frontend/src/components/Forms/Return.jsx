// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Sample customer & product options – replace with dynamic data
// const customers = ["Franchise A", "Merchant B", "Franchise C"];
// const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

// const ReturnForm = () => {
//   const initialValues = {
//     customer: '',
//     product: '',
//     quantity: '',
//     returnDate: '',
//     returnReason: '',
//     condition: ''
//   };

//   const validationSchema = Yup.object({
//     customer: Yup.string().required("Customer is required"),
//     product: Yup.string().required("Product is required"),
//     quantity: Yup.number().positive("Must be positive").integer("Must be an integer").required("Quantity is required"),
//     returnDate: Yup.date().required("Return date is required"),
//     returnReason: Yup.string().required("Return reason is required"),
//     condition: Yup.string().required("Condition is required")
//   });

//   const onSubmit = (values, { resetForm }) => {
//     console.log("Return form submitted", values);
//     resetForm();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
//       <h2 className="text-xl font-bold mb-4">Return Master Form</h2>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//         <Form className="space-y-4">
//           {/* Customer */}
//           <div>
//             <label className="block mb-1">Customer (Franchise/Merchant)</label>
//             <Field name="customer" as="select" className="w-full border rounded p-2">
//               <option value="">Select Customer</option>
//               {customers.map((c, i) => (
//                 <option key={i} value={c}>{c}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Product */}
//           <div>
//             <label className="block mb-1">Product</label>
//             <Field name="product" as="select" className="w-full border rounded p-2">
//               <option value="">Select Product</option>
//               {products.map((p, i) => (
//                 <option key={i} value={p}>{p}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Quantity */}
//           <div>
//             <label className="block mb-1">Quantity</label>
//             <Field name="quantity" type="number" className="w-full border rounded p-2" />
//             <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Return Date */}
//           <div>
//             <label className="block mb-1">Return Date</label>
//             <Field name="returnDate" type="date" className="w-full border rounded p-2" />
//             <ErrorMessage name="returnDate" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Return Reason */}
//           <div>
//             <label className="block mb-1">Return Reason</label>
//             <Field name="returnReason" as="textarea" className="w-full border rounded p-2" />
//             <ErrorMessage name="returnReason" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Condition */}
//           <div>
//             <label className="block mb-1">Condition</label>
//             <Field name="condition" as="select" className="w-full border rounded p-2">
//               <option value="">Select Condition</option>
//               <option value="Working">Working</option>
//               <option value="Faulty">Faulty</option>
//             </Field>
//             <ErrorMessage name="condition" component="div" className="text-red-600 text-sm" />
//           </div>

//           <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
//             Submit
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default ReturnForm;

import { useForm } from 'react-hook-form'

// Reusable Input Component
const FormInput = ({ label, name, register, errors, required = false, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <input
      type={type}
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Reusable Select Component
const FormSelect = ({ label, name, register, errors, required = false, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <select
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

// Reusable Textarea Component
const FormTextarea = ({ label, name, register, errors, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <textarea
      {...register(name, { required: required && `${label} is required` })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
)

const OptimizedReturns = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Form options
  const productTypes = [
    { value: 'pos_machine', label: 'POS Machine' },
    { value: 'qr_scanner', label: 'QR Scanner' },
    { value: 'card_reader', label: 'Card Reader' },
    { value: 'printer', label: 'Thermal Printer' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ]

  const returnReasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_product', label: 'Wrong Product Delivered' },
    { value: 'damage_in_transit', label: 'Damage in Transit' },
    { value: 'customer_request', label: 'Customer Request' },
    { value: 'warranty_claim', label: 'Warranty Claim' },
    { value: 'upgrade_request', label: 'Upgrade Request' },
    { value: 'excess_stock', label: 'Excess Stock' },
    { value: 'other', label: 'Other' }
  ]

  const returnConditions = [
    { value: 'new', label: 'New/Unused' },
    { value: 'good', label: 'Good Condition' },
    { value: 'fair', label: 'Fair Condition' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'not_working', label: 'Not Working' }
  ]

  const actionsTaken = [
    { value: 'replacement', label: 'Replacement Provided' },
    { value: 'refund', label: 'Refund Processed' },
    { value: 'repair', label: 'Sent for Repair' },
    { value: 'credit_note', label: 'Credit Note Issued' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'pending', label: 'Pending Review' }
  ]

  const onSubmit = (data) => {
    console.log('Return Entry:', data)
    alert('Return entry saved successfully!')
    reset()
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Return Entry</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Return & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
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
          <div className="bg-gray-50 p-4 rounded-lg">
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
                placeholder="Enter returned quantity"
              />
              <FormTextarea
                label="Serial Numbers"
                name="serialNumbers"
                register={register}
                errors={errors}
                required
                rows={3}
                placeholder="Enter serial numbers of returned items"
              />
            </div>
          </div>
        </div>

        {/* Return Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Return Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isWarranty')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                This is a warranty return
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('replacementRequired')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Replacement required
              </label>
            </div>
          </div>

          <FormTextarea
            label="Inspection Notes"
            name="inspectionNotes"
            register={register}
            errors={errors}
            rows={3}
            placeholder="Enter detailed inspection notes"
          />
          
          <div className="mt-4">
            <FormTextarea
              label="Remarks"
              name="remarks"
              register={register}
              errors={errors}
              rows={3}
              placeholder="Enter any additional remarks"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Save Return Entry
          </button>
        </div>
      </form>
    </div>
  )
}

export default OptimizedReturns