import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const VendorRateMasterForm = () => {
  const initialValues = {
    vendor: '',
    product: '',
    oneTimeCost: '',
    perTransactionFee: '',
    subscriptionType: '',
    subscriptionAmount: '',
    effectiveFrom: '',
    effectiveTo: ''
  };

  const validationSchema = Yup.object({
    vendor: Yup.string().required('Vendor is required'),
    product: Yup.string().required('Product is required'),
    oneTimeCost: Yup.number().required('Required').min(0, 'Cannot be negative'),
    perTransactionFee: Yup.number().required('Required').min(0, 'Cannot be negative'),
    subscriptionType: Yup.string().required('Subscription type is required'),
    subscriptionAmount: Yup.number().required('Required').min(0, 'Cannot be negative'),
    effectiveFrom: Yup.date().required('Start date required'),
    effectiveTo: Yup.date().required('End date required')
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Vendor Rate Master form submitted", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Vendor Rate Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Vendor</label>
            <Field name="vendor" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="vendor" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Product</label>
            <Field name="product" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">One-Time Cost</label>
              <Field name="oneTimeCost" type="number" className="w-full border rounded p-2" />
              <ErrorMessage name="oneTimeCost" component="div" className="text-red-600 text-sm" />
            </div>
            <div>
              <label className="block mb-1">Per Transaction Fee</label>
              <Field name="perTransactionFee" type="number" className="w-full border rounded p-2" />
              <ErrorMessage name="perTransactionFee" component="div" className="text-red-600 text-sm" />
            </div>
          </div>

          <div>
            <label className="block mb-1">Subscription Type</label>
            <Field name="subscriptionType" as="select" className="w-full border rounded p-2">
              <option value="">Select</option>
              <option value="Monthly">Monthly</option>
              <option value="Annual">Annual</option>
            </Field>
            <ErrorMessage name="subscriptionType" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <label className="block mb-1">Subscription Amount</label>
            <Field name="subscriptionAmount" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="subscriptionAmount" component="div" className="text-red-600 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Effective From</label>
              <Field name="effectiveFrom" type="date" className="w-full border rounded p-2" />
              <ErrorMessage name="effectiveFrom" component="div" className="text-red-600 text-sm" />
            </div>
            <div>
              <label className="block mb-1">Effective To</label>
              <Field name="effectiveTo" type="date" className="w-full border rounded p-2" />
              <ErrorMessage name="effectiveTo" component="div" className="text-red-600 text-sm" />
            </div>
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default VendorRateMasterForm;
