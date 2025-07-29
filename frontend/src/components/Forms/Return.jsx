import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Sample customer & product options – replace with dynamic data
const customers = ["Franchise A", "Merchant B", "Franchise C"];
const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

const ReturnForm = () => {
  const initialValues = {
    customer: '',
    product: '',
    quantity: '',
    returnDate: '',
    returnReason: '',
    condition: ''
  };

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer is required"),
    product: Yup.string().required("Product is required"),
    quantity: Yup.number().positive("Must be positive").integer("Must be an integer").required("Quantity is required"),
    returnDate: Yup.date().required("Return date is required"),
    returnReason: Yup.string().required("Return reason is required"),
    condition: Yup.string().required("Condition is required")
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Return form submitted", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Return Master Form</h2>
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

          {/* Quantity */}
          <div>
            <label className="block mb-1">Quantity</label>
            <Field name="quantity" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Return Date */}
          <div>
            <label className="block mb-1">Return Date</label>
            <Field name="returnDate" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="returnDate" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Return Reason */}
          <div>
            <label className="block mb-1">Return Reason</label>
            <Field name="returnReason" as="textarea" className="w-full border rounded p-2" />
            <ErrorMessage name="returnReason" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Condition */}
          <div>
            <label className="block mb-1">Condition</label>
            <Field name="condition" as="select" className="w-full border rounded p-2">
              <option value="">Select Condition</option>
              <option value="Working">Working</option>
              <option value="Faulty">Faulty</option>
            </Field>
            <ErrorMessage name="condition" component="div" className="text-red-600 text-sm" />
          </div>

          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ReturnForm;
