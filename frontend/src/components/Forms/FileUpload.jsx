import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Max file size = 2MB, accepted types: pdf, images, docs
const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const FileUploadForm = () => {
  const initialValues = {
    uploadFor: "",
    file: null,
    remarks: ""
  };

  const validationSchema = Yup.object({
    uploadFor: Yup.string().required("Select upload category"),
    file: Yup.mixed()
      .required("File is required")
      .test("fileSize", "File too large (max 2MB)", value => !value || value.size <= FILE_SIZE)
      .test("fileFormat", "Unsupported format", value => !value || SUPPORTED_FORMATS.includes(value.type)),
    remarks: Yup.string()
  });

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("uploadFor", values.uploadFor);
    formData.append("file", values.file);
    formData.append("remarks", values.remarks);

    // Simulate upload
    console.log("Uploading file:", {
      uploadFor: values.uploadFor,
      file: values.file.name,
      remarks: values.remarks
    });

    resetForm();
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">File Upload Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Upload For</label>
              <Field name="uploadFor" as="select" className="w-full border rounded p-2">
                <option value="">Select Category</option>
                <option value="Vendor">Vendor</option>
                <option value="Product">Product</option>
              </Field>
              <ErrorMessage name="uploadFor" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label className="block mb-1">File</label>
              <input
                name="file"
                type="file"
                className="w-full border bg-amber-300"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="file" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Remarks (optional)</label>
              <Field name="remarks" as="textarea" className="w-full border rounded p-2" />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Upload
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FileUploadForm;
