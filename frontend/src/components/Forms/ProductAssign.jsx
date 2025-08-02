// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Static sample data – replace with dynamic API values in production
// const customers = ["Franchise A", "Merchant B"];
// const products = ["Swap Machine", "QR Code", "QR + Soundbox"];
// const pricingCodes = ["CODE001", "CODE002", "CODE003"];

// const ProductAssignmentForm = () => {
//   const initialValues = {
//     customer: '',
//     product: '',
//     pricingCode: '',
//     assignmentDate: '',
//     assignedBy: '',
//     remarks: ''
//   };

//   const validationSchema = Yup.object({
//     customer: Yup.string().required("Customer is required"),
//     product: Yup.string().required("Product is required"),
//     pricingCode: Yup.string().required("Pricing code is required"),
//     assignmentDate: Yup.date().required("Assignment date is required"),
//     assignedBy: Yup.string().required("Assigned By is required"),
//     remarks: Yup.string()
//   });

//   const onSubmit = (values, { resetForm }) => {
//     console.log("Product Assignment Submitted:", values);
//     resetForm();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
//       <h2 className="text-xl font-bold mb-4">Product Assignment Form</h2>
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

//           {/* Pricing Code */}
//           <div>
//             <label className="block mb-1">Pricing Code</label>
//             <Field name="pricingCode" as="select" className="w-full border rounded p-2">
//               <option value="">Select Code</option>
//               {pricingCodes.map((code, i) => (
//                 <option key={i} value={code}>{code}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="pricingCode" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Assignment Date */}
//           <div>
//             <label className="block mb-1">Assignment Date</label>
//             <Field name="assignmentDate" type="date" className="w-full border rounded p-2" />
//             <ErrorMessage name="assignmentDate" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Assigned By */}
//           <div>
//             <label className="block mb-1">Assigned By</label>
//             <Field name="assignedBy" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="assignedBy" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Remarks */}
//           <div>
//             <label className="block mb-1">Remarks</label>
//             <Field name="remarks" as="textarea" className="w-full border rounded p-2" />
//           </div>

//           <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//             Submit
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default ProductAssignmentForm;

import { useForm } from 'react-hook-form'

// Static sample data – replace with dynamic API values in production
const customers = ["Franchise A", "Merchant B"]
const products = ["Swap Machine", "QR Code", "QR + Soundbox"]
const pricingCodes = ["CODE001", "CODE002", "CODE003"]

const ProductAssignmentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customer: '',
      product: '',
      pricingCode: '',
      assignmentDate: '',
      assignedBy: '',
      remarks: ''
    }
  })

  const onSubmit = (data) => {
    console.log("Product Assignment Submitted:", data)
    alert("Assignment saved successfully!")
    reset()
  }

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Product Assignment Form</h2>
      <div className="space-y-4">
        {/* Customer */}
        <div>
          <label className="block mb-1 font-medium">Customer (Franchise/Merchant)</label>
          <select
            {...register('customer', { required: 'Customer is required' })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Customer</option>
            {customers.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          {errors.customer && (
            <div className="text-red-600 text-sm mt-1">{errors.customer.message}</div>
          )}
        </div>

        {/* Product */}
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <select
            {...register('product', { required: 'Product is required' })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Product</option>
            {products.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
          {errors.product && (
            <div className="text-red-600 text-sm mt-1">{errors.product.message}</div>
          )}
        </div>

        {/* Pricing Code */}
        <div>
          <label className="block mb-1 font-medium">Pricing Code</label>
          <select
            {...register('pricingCode', { required: 'Pricing code is required' })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Code</option>
            {pricingCodes.map((code, i) => (
              <option key={i} value={code}>{code}</option>
            ))}
          </select>
          {errors.pricingCode && (
            <div className="text-red-600 text-sm mt-1">{errors.pricingCode.message}</div>
          )}
        </div>

        {/* Assignment Date */}
        <div>
          <label className="block mb-1 font-medium">Assignment Date</label>
          <input
            type="date"
            {...register('assignmentDate', { required: 'Assignment date is required' })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.assignmentDate && (
            <div className="text-red-600 text-sm mt-1">{errors.assignmentDate.message}</div>
          )}
        </div>

        {/* Assigned By */}
        <div>
          <label className="block mb-1 font-medium">Assigned By</label>
          <input
            type="text"
            {...register('assignedBy', { required: 'Assigned By is required' })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name"
          />
          {errors.assignedBy && (
            <div className="text-red-600 text-sm mt-1">{errors.assignedBy.message}</div>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label className="block mb-1 font-medium">Remarks</label>
          <textarea
            {...register('remarks')}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Optional remarks or notes"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex-1"
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductAssignmentForm