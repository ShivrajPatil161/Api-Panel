

import { useState } from 'react'

const Inward = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    vendorId: '',
    vendorName: '',
    receivedDate: '',
    receivedBy: '',
    productId: '',
    productName: '',
    productType: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    serialNumbers: '',
    batchNumber: '',
    warrantyPeriod: '',
    condition: 'new',
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

    console.log('Inward Entry:', submissionData)
    // Add your API call here
    alert('Inward entry saved successfully!')

    // Reset form
    setFormData({
      invoiceNumber: '',
      vendorId: '',
      vendorName: '',
      receivedDate: '',
      receivedBy: '',
      productId: '',
      productName: '',
      productType: '',
      quantity: '',
      unitPrice: '',
      totalAmount: '',
      serialNumbers: '',
      batchNumber: '',
      warrantyPeriod: '',
      condition: 'new',
      remarks: ''
    })
    setSerialNumberGrid([])
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inward Entry</h2>

      <div className="space-y-6">
        {/* Invoice & Vendor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Invoice & Vendor Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter invoice number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor ID *
                </label>
                <input
                disabled
                  type="text"
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-200  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vendor ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vendor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received Date *
                </label>
                <input
                  type="date"
                  name="receivedDate"
                  value={formData.receivedDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By *
                </label>
                <input
                  type="text"
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter receiver name"
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
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter batch number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Period (months)
              </label>
              <input
                type="number"
                name="warrantyPeriod"
                value={formData.warrantyPeriod}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter warranty period"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Used</option>
                <option value="damaged">Damaged</option>
              </select>
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
                Serial Numbers (TID/MID/SID/VPID/MOBNO)
              </label>
              <textarea
                name="serialNumbers"
                value={formData.serialNumbers}
                onChange={handleChange}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Inward Entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default Inward