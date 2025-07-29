import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Static sample options – in real app, fetch from API or props
const vendors = ["Bank of India", "HDFC", "ICICI"];
const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

const InwardForm = () => {
  const initialValues = {
    vendor: '',
    product: '',
    quantity: '',
    receivedDate: '',
    invoiceNumber: '',
    remarks: ''
  };

  const validationSchema = Yup.object({
    vendor: Yup.string().required("Vendor is required"),
    product: Yup.string().required("Product is required"),
    quantity: Yup.number().required("Quantity is required").positive().integer(),
    receivedDate: Yup.date().required("Received date is required"),
    invoiceNumber: Yup.string().required("Invoice number is required"),
    remarks: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Inward form submitted", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Inward Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          {/* Vendor Dropdown */}
          <div>
            <label className="block mb-1">Vendor</label>
            <Field name="vendor" as="select" className="w-full border rounded p-2">
              <option value="">Select Vendor</option>
              {vendors.map((v, index) => (
                <option key={index} value={v}>{v}</option>
              ))}
            </Field>
            <ErrorMessage name="vendor" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block mb-1">Product</label>
            <Field name="product" as="select" className="w-full border rounded p-2">
              <option value="">Select Product</option>
              {products.map((p, index) => (
                <option key={index} value={p}>{p}</option>
              ))}
            </Field>
            <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1">Quantity</label>
            <Field name="quantity" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Received Date */}
          <div>
            <label className="block mb-1">Received Date</label>
            <Field name="receivedDate" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="receivedDate" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Invoice Number */}
          <div>
            <label className="block mb-1">Invoice Number</label>
            <Field name="invoiceNumber" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="invoiceNumber" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Remarks */}
          <div>
            <label className="block mb-1">Remarks</label>
            <Field name="remarks" as="textarea" className="w-full border rounded p-2" />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default InwardForm;
