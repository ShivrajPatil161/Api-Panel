// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Sample options – replace with dynamic data as needed
// const customers = ["Franchise A", "Merchant B", "Franchise C"];
// const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

// const OutwardForm = () => {
//   const initialValues = {
//     customer: "",
//     product: "",
//     quantity: "",
//     dispatchDate: "",
//     assignedBy: "",
//     remarks: ""
//   };

//   const validationSchema = Yup.object({
//     customer: Yup.string().required("Customer is required"),
//     product: Yup.string().required("Product is required"),
//     quantity: Yup.number()
//       .positive("Must be positive")
//       .integer("Must be an integer")
//       .required("Quantity is required"),
//     dispatchDate: Yup.date().required("Dispatch date is required"),
//     assignedBy: Yup.string().required("Assigned By is required"),
//     remarks: Yup.string()
//   });

//   const onSubmit = (values, { resetForm }) => {
//     console.log("Outward Form Submitted", values);
//     resetForm();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 shadow-md rounded-xl bg-white">
//       <h2 className="text-xl font-bold mb-4">Outward Master Form</h2>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//         <Form className="space-y-4">
//           <div>
//             <label className="block mb-1">Customer (Franchise/Merchant)</label>
//             <Field name="customer" as="select" className="w-full border rounded p-2">
//               <option value="">Select Customer</option>
//               {customers.map((c, index) => (
//                 <option key={index} value={c}>{c}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Product</label>
//             <Field name="product" as="select" className="w-full border rounded p-2">
//               <option value="">Select Product</option>
//               {products.map((p, index) => (
//                 <option key={index} value={p}>{p}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Quantity</label>
//             <Field name="quantity" type="number" className="w-full border rounded p-2" />
//             <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Dispatch Date</label>
//             <Field name="dispatchDate" type="date" className="w-full border rounded p-2" />
//             <ErrorMessage name="dispatchDate" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Assigned By</label>
//             <Field name="assignedBy" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="assignedBy" component="div" className="text-red-600 text-sm" />
//           </div>

//           <div>
//             <label className="block mb-1">Remarks</label>
//             <Field name="remarks" as="textarea" className="w-full border rounded p-2" />
//           </div>

//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Submit
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default OutwardForm;


import { useState } from 'react'

const Outward = () => {
  const [formData, setFormData] = useState({
    deliveryNumber: '',
    customerId: '',
    customerName: '',
    customerType: '',
    dispatchDate: '',
    dispatchedBy: '',
    productId: '',
    productName: '',
    productType: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    serialNumbers: '',
    deliveryAddress: '',
    contactPerson: '',
    contactNumber: '',
    deliveryMethod: '',
    trackingNumber: '',
    expectedDelivery: '',
    remarks: ''
  })

  const [serialNumberGrid, setSerialNumberGrid] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-calculate total amount
    if (name === 'quantity' || name === 'unitPrice') {
      const qty = name === 'quantity' ? parseFloat(value) || 0 : parseFloat(formData.quantity) || 0
      const price = name === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(formData.unitPrice) || 0
      setFormData(prev => ({
        ...prev,
        totalAmount: (qty * price).toFixed(2)
      }))
    }

    // Create serial number grid when quantity changes
    if (name === 'quantity') {
      const qty = parseInt(value) || 0
      if (qty > 0) {
        const newGrid = Array.from({ length: qty }, (_, index) => ({
          id: index + 1,
          MID: '',
          SID: '',
          TID: '',
          VpID: '',
          selectedFields: {
            MID: false,
            SID: false,
            TID: false,
            VpID: false
          }
        }))
        setSerialNumberGrid(newGrid)
      } else {
        setSerialNumberGrid([])
      }
    }
  }

  const handleSerialNumberChange = (rowId, field, value) => {
    setSerialNumberGrid(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    )
  }

  const handleFieldSelection = (rowId, field, checked) => {
    setSerialNumberGrid(prev =>
      prev.map(row =>
        row.id === rowId
          ? {
            ...row,
            selectedFields: { ...row.selectedFields, [field]: checked },
            // Clear the value if unchecked
            [field]: checked ? row[field] : ''
          }
          : row
      )
    )
  }

  const handleSelectAllForField = (field) => {
    setSerialNumberGrid(prev =>
      prev.map(row => ({
        ...row,
        selectedFields: { ...row.selectedFields, [field]: true }
      }))
    )
  }

  const handleDeselectAllForField = (field) => {
    setSerialNumberGrid(prev =>
      prev.map(row => ({
        ...row,
        selectedFields: { ...row.selectedFields, [field]: false },
        [field]: ''
      }))
    )
  }

  const handleSubmit = () => {
    // Include serial number grid data in form submission
    const submissionData = {
      ...formData,
      serialNumberGrid: serialNumberGrid
    }

    console.log('Outward Entry:', submissionData)
    // Add your API call here
    alert('Outward entry saved successfully!')

    // Reset form
    setFormData({
      deliveryNumber: '',
      customerId: '',
      customerName: '',
      customerType: '',
      dispatchDate: '',
      dispatchedBy: '',
      productId: '',
      productName: '',
      productType: '',
      quantity: '',
      unitPrice: '',
      totalAmount: '',
      serialNumbers: '',
      deliveryAddress: '',
      contactPerson: '',
      contactNumber: '',
      deliveryMethod: '',
      trackingNumber: '',
      expectedDelivery: '',
      remarks: ''
    })
    setSerialNumberGrid([])
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Outward Entry</h2>

      <div className="space-y-6">
        {/* Delivery & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery & Customer Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Number *
                </label>
                <input
                  type="text"
                  name="deliveryNumber"
                  value={formData.deliveryNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter delivery number"
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID *
                </label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Type *
                </label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select customer type</option>
                  <option value="franchise">Franchise</option>
                  <option value="merchant">Merchant</option>
                  <option value="direct_customer">Direct Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispatch Date *
                </label>
                <input
                  type="date"
                  name="dispatchDate"
                  value={formData.dispatchDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispatched By *
                </label>
                <input
                  type="text"
                  name="dispatchedBy"
                  value={formData.dispatchedBy}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dispatcher name"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select product type</option>
                  <option value="pos_machine">POS Machine</option>
                  <option value="qr_scanner">QR Scanner</option>
                  <option value="card_reader">Card Reader</option>
                  <option value="printer">Thermal Printer</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price *
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter unit price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input
                  type="text"
                  name="totalAmount"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter complete delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Method *
              </label>
              <select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select delivery method</option>
                <option value="courier">Courier</option>
                <option value="self_pickup">Self Pickup</option>
                <option value="direct_delivery">Direct Delivery</option>
                <option value="logistics_partner">Logistics Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dynamic Serial Number Grid with Selection */}
          {serialNumberGrid.length > 0 ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Serial Numbers (Select required fields for each item)
              </label>

              {/* Column Action Buttons */}
              <div className="mb-3 flex flex-wrap gap-2">
                {['MID', 'SID', 'TID', 'VpID'].map(field => (
                  <div key={field} className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleSelectAllForField(field)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Select All {field}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeselectAllForField(field)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Deselect All {field}
                    </button>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded-md">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          S.No
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          <div className="flex flex-col items-center">
                            <span>MID</span>
                            <span className="text-xs text-gray-400">Select & Enter</span>
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          <div className="flex flex-col items-center">
                            <span>SID</span>
                            <span className="text-xs text-gray-400">Select & Enter</span>
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          <div className="flex flex-col items-center">
                            <span>TID</span>
                            <span className="text-xs text-gray-400">Select & Enter</span>
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          <div className="flex flex-col items-center">
                            <span>VpID</span>
                            <span className="text-xs text-gray-400">Select & Enter</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {serialNumberGrid.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-sm text-gray-900 border-b">
                            {row.id}
                          </td>
                          {['MID', 'SID', 'TID', 'VpID'].map(field => (
                            <td key={field} className="px-3 py-2 border-b">
                              <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={row.selectedFields[field]}
                                    onChange={(e) => handleFieldSelection(row.id, field, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-600">Include {field}</span>
                                </label>
                                <input
                                  type="text"
                                  value={row[field]}
                                  onChange={(e) => handleSerialNumberChange(row.id, field, e.target.value)}
                                  disabled={!row.selectedFields[field]}
                                  className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!row.selectedFields[field] ? 'bg-gray-100 text-gray-400' : ''
                                    }`}
                                  placeholder={row.selectedFields[field] ? `Enter ${field}` : 'Not selected'}
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Numbers (comma-separated for multiple items) *
              </label>
              <textarea
                name="serialNumbers"
                value={formData.serialNumbers}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity first to use the serial number grid, or enter serial numbers manually"
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional remarks"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Outward Entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default Outward