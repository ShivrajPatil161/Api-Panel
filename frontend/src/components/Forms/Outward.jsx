import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Sample options – replace with dynamic data as needed
const customers = ["Franchise A", "Merchant B", "Franchise C"];
const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

const OutwardForm = () => {
  const initialValues = {
    customer: "",
    product: "",
    quantity: "",
    dispatchDate: "",
    assignedBy: "",
    remarks: ""
  };

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer is required"),
    product: Yup.string().required("Product is required"),
    quantity: Yup.number()
      .positive("Must be positive")
      .integer("Must be an integer")
      .required("Quantity is required"),
    dispatchDate: Yup.date().required("Dispatch date is required"),
    assignedBy: Yup.string().required("Assigned By is required"),
    remarks: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Outward Form Submitted", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Outward Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Customer (Franchise/Merchant)</label>
            <Field name="customer" as="select" className="w-full border rounded p-2">
              <option value="">Select Customer</option>
              {customers.map((c, index) => (
                <option key={index} value={c}>{c}</option>
              ))}
            </Field>
            <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
          </div>

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

          <div>
            <label className="block mb-1">Quantity</label>
            <Field name="quantity" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Dispatch Date</label>
            <Field name="dispatchDate" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="dispatchDate" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Assigned By</label>
            <Field name="assignedBy" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="assignedBy" component="div" className="text-red-600 text-sm" />
          </div>

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

export default OutwardForm;
