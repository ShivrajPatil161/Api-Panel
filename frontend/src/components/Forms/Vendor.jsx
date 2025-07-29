import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import VendorTable from '../Tables/VendorTable';

const VendorForm = () => {
  const initialValues = {
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    type: '',
    isActive: false
  };

  const validationSchema = Yup.object({
    vendorName: Yup.string().required('Vendor name is required'),
    contactPerson: Yup.string().required('Contact person is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number').required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    type: Yup.string().required('Type is required'),
    isActive: Yup.boolean()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log('Vendor form submitted', values);
    resetForm();
  };

  return (
    <div>
      <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Vendor Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="grid grid-cols-2 gap-5 space-y-4">
          <div>
            <label className="block mb-1">Vendor Name</label>
            <Field name="vendorName" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="vendorName" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Contact Person</label>
            <Field name="contactPerson" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="contactPerson" component="div" className="text-red-600 text-sm" />
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
            <label className="block mb-1">Type</label>
            <Field name="type" as="select" className="w-full border rounded p-2">
              <option value="">Select Type</option>
              <option value="Bank">Bank</option>
              <option value="NBFC">NBFC</option>
              <option value="Other">Other</option>
            </Field>
            <ErrorMessage name="type" component="div" className="text-red-600 text-sm" />
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
     <VendorTable />
    </div>
  );
};

export default VendorForm;
