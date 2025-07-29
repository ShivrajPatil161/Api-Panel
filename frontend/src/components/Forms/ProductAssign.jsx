import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Static sample data – replace with dynamic API values in production
const customers = ["Franchise A", "Merchant B"];
const products = ["Swap Machine", "QR Code", "QR + Soundbox"];
const pricingCodes = ["CODE001", "CODE002", "CODE003"];

const ProductAssignmentForm = () => {
  const initialValues = {
    customer: '',
    product: '',
    pricingCode: '',
    assignmentDate: '',
    assignedBy: '',
    remarks: ''
  };

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer is required"),
    product: Yup.string().required("Product is required"),
    pricingCode: Yup.string().required("Pricing code is required"),
    assignmentDate: Yup.date().required("Assignment date is required"),
    assignedBy: Yup.string().required("Assigned By is required"),
    remarks: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Product Assignment Submitted:", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Product Assignment Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block mb-1">Customer (Franchise/Merchant)</label>
            <Field name="customer" as="select" className="w-full border rounded p-2">
              <option value="">Select Customer</option>
              {customers.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </Field>
            <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Product */}
          <div>
            <label className="block mb-1">Product</label>
            <Field name="product" as="select" className="w-full border rounded p-2">
              <option value="">Select Product</option>
              {products.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </Field>
            <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Pricing Code */}
          <div>
            <label className="block mb-1">Pricing Code</label>
            <Field name="pricingCode" as="select" className="w-full border rounded p-2">
              <option value="">Select Code</option>
              {pricingCodes.map((code, i) => (
                <option key={i} value={code}>{code}</option>
              ))}
            </Field>
            <ErrorMessage name="pricingCode" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Assignment Date */}
          <div>
            <label className="block mb-1">Assignment Date</label>
            <Field name="assignmentDate" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="assignmentDate" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Assigned By */}
          <div>
            <label className="block mb-1">Assigned By</label>
            <Field name="assignedBy" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="assignedBy" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Remarks */}
          <div>
            <label className="block mb-1">Remarks</label>
            <Field name="remarks" as="textarea" className="w-full border rounded p-2" />
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ProductAssignmentForm;
