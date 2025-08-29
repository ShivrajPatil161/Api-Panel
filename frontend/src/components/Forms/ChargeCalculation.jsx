import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// Dummy data
const customerTypes = ["franchise", "direct-merchant"];

const dummyData = {
  franchise: [
    { id: "f1", name: "Franchise A", settlementCycle: "Daily", schemeCode: "FR001" },
    { id: "f2", name: "Franchise B", settlementCycle: "Weekly", schemeCode: "FR002" },
    { id: "f3", name: "Franchise C", settlementCycle: "Monthly", schemeCode: "FR003" }
  ],
  "direct-merchant": [
    { id: "m1", name: "Merchant A", settlementCycle: "Daily", schemeCode: "DM001" },
    { id: "m2", name: "Merchant B", settlementCycle: "Weekly", schemeCode: "DM002" },
    { id: "m3", name: "Merchant C", settlementCycle: "Monthly", schemeCode: "DM003" }
  ]
};

const dummyTransactions = {
  f1: [
    { id: "t1", date: "2024-08-29", amount: 1500, description: "Payment from Customer A" },
    { id: "t2", date: "2024-08-28", amount: 2300, description: "Payment from Customer B" },
    { id: "t3", date: "2024-08-27", amount: 890, description: "Payment from Customer C" }
  ],
  f2: [
    { id: "t4", date: "2024-08-29", amount: 3200, description: "Weekly Settlement A" },
    { id: "t5", date: "2024-08-26", amount: 1800, description: "Weekly Settlement B" }
  ],
  f3: [
    { id: "t6", date: "2024-08-29", amount: 5600, description: "Monthly Settlement" },
    { id: "t7", date: "2024-08-25", amount: 4200, description: "Adjustment Payment" }
  ],
  m1: [
    { id: "t8", date: "2024-08-29", amount: 2100, description: "Direct Payment A" },
    { id: "t9", date: "2024-08-28", amount: 1750, description: "Direct Payment B" }
  ],
  m2: [
    { id: "t10", date: "2024-08-29", amount: 980, description: "Merchant Transaction A" },
    { id: "t11", date: "2024-08-27", amount: 1200, description: "Merchant Transaction B" },
    { id: "t12", date: "2024-08-26", amount: 750, description: "Merchant Transaction C" }
  ],
  m3: [
    { id: "t13", date: "2024-08-29", amount: 3400, description: "Monthly Direct Payment" }
  ]
};

const TransactionSelectionForm = () => {
  const { register, watch, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      customerType: "",
      customerId: "",
      selectedTransactions: []
    }
  });

  const [availableCustomers, setAvailableCustomers] = useState([]);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [availableTransactions, setAvailableTransactions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const customerType = watch("customerType");
  const customerId = watch("customerId");
  const selectedTransactions = watch("selectedTransactions");

  // Update available customers when customer type changes
  useEffect(() => {
    if (customerType) {
      setAvailableCustomers(dummyData[customerType] || []);
      setValue("customerId", "");
      setSelectedCustomerInfo(null);
      setAvailableTransactions([]);
      setValue("selectedTransactions", []);
    } else {
      setAvailableCustomers([]);
    }
  }, [customerType, setValue]);

  // Update customer info and transactions when customer is selected
  useEffect(() => {
    if (customerId) {
      const customer = availableCustomers.find(c => c.id === customerId);
      setSelectedCustomerInfo(customer);
      const transactions = dummyTransactions[customerId] || [];
      setAvailableTransactions(transactions);
      setValue("selectedTransactions", []);
      setSelectAll(false);
    } else {
      setSelectedCustomerInfo(null);
      setAvailableTransactions([]);
      setValue("selectedTransactions", []);
      setSelectAll(false);
    }
  }, [customerId, availableCustomers, setValue]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allTransactionIds = availableTransactions.map(t => t.id);
      setValue("selectedTransactions", allTransactionIds);
    } else {
      setValue("selectedTransactions", []);
    }
  };

  const handleTransactionToggle = (transactionId) => {
    const currentSelected = selectedTransactions || [];
    const newSelected = currentSelected.includes(transactionId)
      ? currentSelected.filter(id => id !== transactionId)
      : [...currentSelected, transactionId];

    setValue("selectedTransactions", newSelected);
    setSelectAll(newSelected.length === availableTransactions.length);
  };

  const onSubmit = (data) => {
    const selectedTransactionDetails = availableTransactions.filter(
      t => data.selectedTransactions.includes(t.id)
    );

    const submitData = {
      ...data,
      customerInfo: selectedCustomerInfo,
      transactionDetails: selectedTransactionDetails
    };

    console.log("Form submitted:", submitData);
    alert("Form submitted! Check console for details.");
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-2xl border border-gray-200">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Transaction Management</h2>
        <p className="text-gray-600">Select customers and manage their transactions efficiently</p>
      </div>

      <div className="space-y-8">
        {/* Customer Selection Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            Customer Selection
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Customer Type
              </label>
              <select
                {...register("customerType", { required: true })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
              >
                <option value="">Choose customer type...</option>
                {customerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "direct-merchant" ? "Direct Merchant" : "Franchise"}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Selection */}
            {availableCustomers.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Select {customerType === "direct-merchant" ? "Merchant" : "Franchise"}
                </label>
                <select
                  {...register("customerId", { required: true })}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="">Choose {customerType === "direct-merchant" ? "merchant" : "franchise"}...</option>
                  {availableCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information Display */}
        {selectedCustomerInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Settlement Cycle</span>
                <p className="text-lg font-semibold text-gray-900">{selectedCustomerInfo.settlementCycle}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Scheme Code</span>
                <p className="text-lg font-semibold text-gray-900 font-mono">{selectedCustomerInfo.schemeCode}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Customer Name</span>
                <p className="text-lg font-semibold text-gray-900">{selectedCustomerInfo.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Selection */}
        {availableTransactions.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                Transaction Selection
              </h3>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md font-semibold"
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <div className="grid grid-cols-12 gap-4 font-bold text-gray-700 text-sm uppercase tracking-wide">
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Amount</div>
                  <div className="col-span-6">Description</div>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {availableTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 ${selectedTransactions?.includes(transaction.id) ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={selectedTransactions?.includes(transaction.id) || false}
                          onChange={() => handleTransactionToggle(transaction.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(transaction.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{transaction.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="col-span-6">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTransactions?.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-blue-800 font-semibold">
                    <span className="text-2xl font-bold">{selectedTransactions.length}</span> transaction(s) selected
                  </p>
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-medium">Total Amount</p>
                    <p className="text-xl font-bold text-blue-800">
                      ₹{availableTransactions
                        .filter(t => selectedTransactions.includes(t.id))
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-gray-600">
              {selectedTransactions?.length > 0 ? (
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Ready to process {selectedTransactions.length} transaction(s)
                </span>
              ) : (
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  Select transactions to continue
                </span>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setAvailableCustomers([]);
                  setSelectedCustomerInfo(null);
                  setAvailableTransactions([]);
                  setSelectAll(false);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                Reset All
              </button>
              <button
                type="submit"
                disabled={!selectedTransactions?.length}
                onClick={handleSubmit(onSubmit)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Process Transactions ({selectedTransactions?.length || 0})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSelectionForm;