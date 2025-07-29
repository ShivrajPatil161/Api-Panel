import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Example lists – use API or props in production
const entityTypes = ["Franchise", "Vendor"];
const chargeTypes = ["Fixed", "Percentage"];

const ChargeCalculationForm = () => {
  const initialValues = {
    entityType: "",
    entityName: "",
    chargeType: "",
    chargeValue: "",
    applicableFrom: "",
    remarks: ""
  };

  const validationSchema = Yup.object({
    entityType: Yup.string().required("Entity type is required"),
    entityName: Yup.string().required("Entity name is required"),
    chargeType: Yup.string().required("Charge type is required"),
    chargeValue: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be positive")
      .required("Charge value is required"),
    applicableFrom: Yup.date().required("Applicable date is required"),
    remarks: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Charge Calculation Submitted:", values);
    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Charge Calculation Master Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-4">
          {/* Entity Type (Franchise/Vendor) */}
          <div>
            <label className="block mb-1">Entity Type</label>
            <Field name="entityType" as="select" className="w-full border rounded p-2">
              <option value="">Select Type</option>
              {entityTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </Field>
            <ErrorMessage name="entityType" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Entity Name (manual input or dynamic dropdown) */}
          <div>
            <label className="block mb-1">Entity Name</label>
            <Field name="entityName" type="text" className="w-full border rounded p-2" />
            <ErrorMessage name="entityName" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Charge Type */}
          <div>
            <label className="block mb-1">Charge Type</label>
            <Field name="chargeType" as="select" className="w-full border rounded p-2">
              <option value="">Select Charge Type</option>
              {chargeTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </Field>
            <ErrorMessage name="chargeType" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Charge Value */}
          <div>
            <label className="block mb-1">Charge Value {`(${chargeTypes.includes("Percentage") ? "% or ₹" : ""})`}</label>
            <Field name="chargeValue" type="number" className="w-full border rounded p-2" />
            <ErrorMessage name="chargeValue" component="div" className="text-red-600 text-sm" />
          </div>

          {/* Applicable From Date */}
          <div>
            <label className="block mb-1">Applicable From</label>
            <Field name="applicableFrom" type="date" className="w-full border rounded p-2" />
            <ErrorMessage name="applicableFrom" component="div" className="text-red-600 text-sm" />
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

export default ChargeCalculationForm;
