import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Role types can be used to distinguish franchise and merchant
const roleOptions = ["Franchise", "Merchant"];

const CustomerOnboardingForm = () => {
  const initialValues = {
    customerName: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    gstNumber: "",
    isActive: false
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().required("Customer name is required"),
    role: Yup.string().required("Role is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone is required"),
    address: Yup.string().required("Address is required"),
    contactPerson: Yup.string().required("Contact person is required"),
    gstNumber: Yup.string()
      .matches(/^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1})$/, "Invalid GSTIN")
      .required("GST number is required"),
    isActive: Yup.boolean()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Customer Onboarding Submitted:", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Customer Onboarding Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Customer Name</label>
            <Field name="customerName" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="customerName" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <Field name="role" as="select" className="w-full border rounded p-2">
              <option value="">Select Role</option>
              {roleOptions.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </Field>
            <ErrorMessage name="role" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <Field name="email" type="email" className="w-full border rounded p-2" />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <Field name="phone" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <Field name="address" as="textarea" className="w-full border rounded p-2" />
            <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Contact Person</label>
            <Field name="contactPerson" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="contactPerson" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">GST Number</label>
            <Field name="gstNumber" type="text" className="w-full border rounded p-2 uppercase" />
            <ErrorMessage name="gstNumber" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="flex items-center">
            <Field name="isActive" type="checkbox" className="mr-2" />
            <label htmlFor="isActive">Active</label>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CustomerOnboardingForm;
