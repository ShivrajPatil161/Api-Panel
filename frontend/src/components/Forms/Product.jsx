import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProductForm = () => {
  const initialValues = {
    productName: '',
    productType: '',
    mid: '',
    sid: '',
    tid: '',
    vpaid: '',
    mobileNumber: '',
    modelNumber: '',
    brand: '',
    isActive: false
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required('Product name is required'),
    productType: Yup.string().required('Product type is required'),
    mid: Yup.string(),
    sid: Yup.string(),
    tid: Yup.string(),
    vpaid: Yup.string(),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
    modelNumber: Yup.string().required('Model number is required'),
    brand: Yup.string().required('Brand is required'),
    isActive: Yup.boolean()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log('Product Master Form Data:', values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Product Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Product Name</label>
            <Field name="productName" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="productName" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Product Type</label>
            <Field name="productType" as="select" className="w-full border rounded p-2">
              <option value="">Select Type</option>
              <option value="Swap Machine">Swap Machine</option>
              <option value="QR Code">QR Code</option>
              <option value="QR with Soundbox">QR with Soundbox</option>
            </Field>
            <ErrorMessage name="productType" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">MID</label>
              <Field name="mid" type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">SID</label>
              <Field name="sid" type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">TID</label>
              <Field name="tid" type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">VPA ID</label>
              <Field name="vpaid" type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Mobile Number</label>
              <Field name="mobileNumber" type="text" className="w-full border rounded p-2" />
              <ErrorMessage name="mobileNumber" component="div" className="text-red-600 text-sm" />
            </div>
          </div>

          <div>
            <label className="block mb-1">Model Number</label>
            <Field name="modelNumber" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="modelNumber" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Brand</label>
            <Field name="brand" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="brand" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="flex items-center space-x-2">
            <Field name="isActive" type="checkbox" className="mr-2" />
            <label htmlFor="isActive">Active</label>
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ProductForm;
