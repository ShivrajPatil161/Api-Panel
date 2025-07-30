// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Role types can be used to distinguish franchise and merchant
// const roleOptions = ["Franchise", "Merchant"];

// const CustomerOnboardingForm = () => {
//   const initialValues = {
//     customerName: "",
//     role: "",
//     email: "",
//     phone: "",
//     address: "",
//     contactPerson: "",
//     gstNumber: "",
//     isActive: false
//   };

//   const validationSchema = Yup.object({
//     customerName: Yup.string().required("Customer name is required"),
//     role: Yup.string().required("Role is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     phone: Yup.string()
//       .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
//       .required("Phone is required"),
//     address: Yup.string().required("Address is required"),
//     contactPerson: Yup.string().required("Contact person is required"),
//     gstNumber: Yup.string()
//       .matches(/^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1})$/, "Invalid GSTIN")
//       .required("GST number is required"),
//     isActive: Yup.boolean()
//   });

//   const onSubmit = (values, { resetForm }) => {
//     console.log("Customer Onboarding Submitted:", values);
//     resetForm();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
//       <h2 className="text-xl font-bold mb-4">Customer Onboarding Form</h2>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//         <Form className="space-y-4">
//           <div>
//             <label className="block mb-1">Customer Name</label>
//             <Field name="customerName" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="customerName" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Role</label>
//             <Field name="role" as="select" className="w-full border rounded p-2">
//               <option value="">Select Role</option>
//               {roleOptions.map((r, i) => (
//                 <option key={i} value={r}>{r}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="role" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Email</label>
//             <Field name="email" type="email" className="w-full border rounded p-2" />
//             <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Phone</label>
//             <Field name="phone" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Address</label>
//             <Field name="address" as="textarea" className="w-full border rounded p-2" />
//             <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Contact Person</label>
//             <Field name="contactPerson" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="contactPerson" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">GST Number</label>
//             <Field name="gstNumber" type="text" className="w-full border rounded p-2 uppercase" />
//             <ErrorMessage name="gstNumber" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div className="flex items-center">
//             <Field name="isActive" type="checkbox" className="mr-2" />
//             <label htmlFor="isActive">Active</label>
//           </div>

//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Submit
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default CustomerOnboardingForm;

import React from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"

// Mock franchise list
const franchiseOptions = [
  { id: "f1", name: "Franchise Alpha" },
  { id: "f2", name: "Franchise Beta" },
  { id: "f3", name: "Franchise Gamma" }
]

// Validation Schema
const CustomerSchema = Yup.object().shape({
  customerType: Yup.string().required("Customer type is required"),

  // Franchise validations
  franchiseName: Yup.string().when("customerType", {
    is: "franchise",
    then: Yup.string().required("Franchise name is required")
  }),
  franchiseCode: Yup.string().when("customerType", {
    is: "franchise",
    then: Yup.string().required("Franchise code is required")
  }),
  franchiseEmail: Yup.string().when("customerType", {
    is: "franchise",
    then: Yup.string().email().required("Franchise email is required")
  }),

  // Merchant(s) under franchise
  merchants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Merchant name is required"),
      code: Yup.string().required("Merchant code is required"),
      email: Yup.string().email().required("Merchant email is required")
    })
  ),

  // Standalone merchant validations
  merchantName: Yup.string().when("customerType", {
    is: "merchant",
    then: Yup.string().required("Merchant name is required")
  }),
  merchantCode: Yup.string().when("customerType", {
    is: "merchant",
    then: Yup.string().required("Merchant code is required")
  }),
  merchantEmail: Yup.string().when("customerType", {
    is: "merchant",
    then: Yup.string().email().required("Merchant email is required")
  }),
  franchiseId: Yup.string().when("customerType", {
    is: "merchant",
    then: Yup.string().required("Please select a franchise")
  })
})

const CustomerOnboarding = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Customer Onboarding</h2>

      <Formik
        initialValues={{
          customerType: "",
          franchiseName: "",
          franchiseCode: "",
          franchiseEmail: "",
          merchants: [],
          merchantName: "",
          merchantCode: "",
          merchantEmail: "",
          franchiseId: ""
        }}
        validationSchema={CustomerSchema}
        onSubmit={(values) => {
          console.log("Form Submitted:", values)
          alert("Form submitted successfully! (Check console)")
        }}
      >
        {({ values, errors, touched }) => (
          <Form className="space-y-4">
            {/* Type Selector */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <Field type="radio" name="customerType" value="franchise" />
                Franchise
              </label>
              <label className="flex items-center gap-2">
                <Field type="radio" name="customerType" value="merchant" />
                Merchant
              </label>
            </div>
            {errors.customerType && touched.customerType && (
              <div className="text-red-500 text-sm">{errors.customerType}</div>
            )}

            {/* Franchise Onboarding */}
            {values.customerType === "franchise" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm">Franchise Name</label>
                    <Field name="franchiseName" className="input" />
                    <div className="text-red-500 text-sm">
                      {errors.franchiseName && touched.franchiseName && errors.franchiseName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm">Franchise Code</label>
                    <Field name="franchiseCode" className="input" />
                    <div className="text-red-500 text-sm">
                      {errors.franchiseCode && touched.franchiseCode && errors.franchiseCode}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm">Franchise Email</label>
                    <Field name="franchiseEmail" type="email" className="input" />
                    <div className="text-red-500 text-sm">
                      {errors.franchiseEmail && touched.franchiseEmail && errors.franchiseEmail}
                    </div>
                  </div>
                </div>

                {/* Add Merchants */}
                <FieldArray name="merchants">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center mt-6 mb-2">
                        <h3 className="font-semibold text-lg">Merchants under Franchise</h3>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => push({ name: "", code: "", email: "" })}
                        >
                          + Add Merchant
                        </button>
                      </div>

                      {values.merchants.length > 0 &&
                        values.merchants.map((merchant, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-2"
                          >
                            <div>
                              <label className="text-sm">Name</label>
                              <Field name={`merchants.${index}.name`} className="input" />
                              <div className="text-red-500 text-sm">
                                {errors.merchants?.[index]?.name}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm">Code</label>
                              <Field name={`merchants.${index}.code`} className="input" />
                              <div className="text-red-500 text-sm">
                                {errors.merchants?.[index]?.code}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm">Email</label>
                              <Field name={`merchants.${index}.email`} className="input" />
                              <div className="text-red-500 text-sm">
                                {errors.merchants?.[index]?.email}
                              </div>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="text-red-600 text-sm underline"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </FieldArray>
              </>
            )}

            {/* Merchant Onboarding */}
            {values.customerType === "merchant" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Merchant Name</label>
                  <Field name="merchantName" className="input" />
                  <div className="text-red-500 text-sm">
                    {errors.merchantName && touched.merchantName && errors.merchantName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm">Merchant Code</label>
                  <Field name="merchantCode" className="input" />
                  <div className="text-red-500 text-sm">
                    {errors.merchantCode && touched.merchantCode && errors.merchantCode}
                  </div>
                </div>
                <div>
                  <label className="block text-sm">Merchant Email</label>
                  <Field name="merchantEmail" className="input" />
                  <div className="text-red-500 text-sm">
                    {errors.merchantEmail && touched.merchantEmail && errors.merchantEmail}
                  </div>
                </div>
                <div>
                  <label className="block text-sm">Assign to Franchise</label>
                  <Field name="franchiseId" as="select" className="input">
                    <option value="">Select Franchise</option>
                    {franchiseOptions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-sm">
                    {errors.franchiseId && touched.franchiseId && errors.franchiseId}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CustomerOnboarding
