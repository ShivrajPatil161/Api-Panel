import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Sample product options – replace with dynamic list from DB/API
const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

const ProductPricingForm = () => {
  const initialValues = {
    pricingCode: '',
    product: '',
    basePrice: '',
    gstPercentage: '',
    effectiveFrom: '',
    description: ''
  };

  const validationSchema = Yup.object({
    pricingCode: Yup.string().required("Pricing Code is required"),
    product: Yup.string().required("Product is required"),
    basePrice: Yup.number().required("Base price is required").min(0, "Must be a positive number"),
    gstPercentage: Yup.number().required("GST % is required").min(0).max(100),
    effectiveFrom: Yup.date().required("Effective date is required"),
    description: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Product Pricing Master Submitted:", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Product Pricing Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          {/* Pricing Code */}
          <div>
            <label className="block mb-1">Pricing Code</label>
            <Field name="pricingCode" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="pricingCode" component="div" className="text-red-600 text-sm" />
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

          {/* Base Price */}
          <div>
            <label className="block mb-1">Base Price (₹)</label>
            <Field name="basePrice" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="basePrice" component="div" className="text-red-600 text-sm" />
          </div>

          {/* GST Percentage */}
          <div>
            <label className="block mb-1">GST (%)</label>
            <Field name="gstPercentage" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="gstPercentage" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Effective From */}
          <div>
            <label className="block mb-1">Effective From</label>
            <Field name="effectiveFrom" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="effectiveFrom" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1">Description (optional)</label>
            <Field name="description" as="textarea" className="w-full border rounded p-2" />
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ProductPricingForm;
