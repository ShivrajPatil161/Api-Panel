// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import api from "../../constants/API/axiosInstance";

// // Customer types
// const customerTypes = ["franchise", "direct-merchant"];

// const TransactionSelectionForm = () => {
//   const { register, watch, handleSubmit, reset, setValue } = useForm({
//     defaultValues: {
//       customerType: "",
//       franchiseId: "",
//       merchantId: "",
//       selectedTransactions: []
//     }
//   });

//   const [availableFranchises, setAvailableFranchises] = useState([]);
//   const [availableMerchants, setAvailableMerchants] = useState([]);
//   const [selectedFranchise, setSelectedFranchise] = useState(null);
//   const [selectedMerchant, setSelectedMerchant] = useState(null);
//   const [availableTransactions, setAvailableTransactions] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const customerType = watch("customerType");
//   const franchiseId = watch("franchiseId");
//   const merchantId = watch("merchantId");
//   const selectedTransactions = watch("selectedTransactions");

//   // Fetch franchises or direct merchants when customer type changes
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       if (!customerType) {
//         setAvailableFranchises([]);
//         setAvailableMerchants([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         if (customerType === "franchise") {
//           const response = await api.get("/franchise");
//           setAvailableFranchises(response.data);
//           setAvailableMerchants([]);
//         } else if (customerType === "direct-merchant") {
//           const response = await api.get("/merchants/direct-merchant");
//           setAvailableMerchants(response.data);
//           setAvailableFranchises([]);
//         }

//         // Reset form values
//         setValue("franchiseId", "");
//         setValue("merchantId", "");
//         setValue("selectedTransactions", []);
//         setSelectedFranchise(null);
//         setSelectedMerchant(null);
//         setAvailableTransactions([]);
//         setSelectAll(false);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, [customerType, setValue]);

//   // Fetch franchise merchants when franchise is selected
//   useEffect(() => {
//     const fetchFranchiseMerchants = async () => {
//       if (!franchiseId || customerType !== "franchise") {
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await api.get(`/merchants/franchise/${franchiseId}`);
//         setAvailableMerchants(response.data);

//         // Find selected franchise info
//         const franchise = availableFranchises.find(f => f.id === parseInt(franchiseId));
//         setSelectedFranchise(franchise);

//         // Reset merchant selection
//         setValue("merchantId", "");
//         setValue("selectedTransactions", []);
//         setSelectedMerchant(null);
//         setAvailableTransactions([]);
//         setSelectAll(false);
//       } catch (error) {
//         console.error("Error fetching franchise merchants:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFranchiseMerchants();
//   }, [franchiseId, customerType, availableFranchises, setValue]);

//   // Handle merchant selection and fetch transactions
//   useEffect(() => {
//     const fetchMerchantTransactions = async () => {
//       if (!merchantId) {
//         setSelectedMerchant(null);
//         setAvailableTransactions([]);
//         setValue("selectedTransactions", []);
//         setSelectAll(false);
//         return;
//       }

//       // Find selected merchant info
//       const merchant = availableMerchants.find(m => m.id === parseInt(merchantId));
//       setSelectedMerchant(merchant);

//       // API call to fetch transactions
//       setLoading(true);
//       try {
//         const response = await api.get(`/get-trans/${merchantId}`);
//         setAvailableTransactions(response.data);
//         setValue("selectedTransactions", []);
//         setSelectAll(false);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//         setAvailableTransactions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMerchantTransactions();
//   }, [merchantId, availableMerchants, setValue]);

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);

//     if (newSelectAll) {
//       const allTransactionIds = availableTransactions.map(t => t.id);
//       setValue("selectedTransactions", allTransactionIds);
//     } else {
//       setValue("selectedTransactions", []);
//     }
//   };

//   const handleTransactionToggle = (transactionId) => {
//     const currentSelected = selectedTransactions || [];
//     const newSelected = currentSelected.includes(transactionId)
//       ? currentSelected.filter(id => id !== transactionId)
//       : [...currentSelected, transactionId];

//     setValue("selectedTransactions", newSelected);
//     setSelectAll(newSelected.length === availableTransactions.length);
//   };

//   const onSubmit = (data) => {
//     const selectedTransactionDetails = availableTransactions.filter(
//       t => data.selectedTransactions.includes(t.id)
//     );

//     const submitData = {
//       customerType: data.customerType,
//       franchiseInfo: selectedFranchise,
//       merchantInfo: selectedMerchant,
//       selectedTransactions: data.selectedTransactions,
//       transactionDetails: selectedTransactionDetails
//     };

//     console.log("Form submitted:", submitData);
//     alert("Form submitted! Check console for details.");
//   };

//   const resetForm = () => {
//     reset();
//     setAvailableFranchises([]);
//     setAvailableMerchants([]);
//     setSelectedFranchise(null);
//     setSelectedMerchant(null);
//     setAvailableTransactions([]);
//     setSelectAll(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className=" mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Management</h1>
//           <p className="text-gray-600">Select customers and manage transactions</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Selection Fields */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Selection</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Customer Type Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
//                 <select
//                   {...register("customerType", { required: true })}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   disabled={loading}
//                 >
//                   <option value="">Select type...</option>
//                   {customerTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type === "direct-merchant" ? "Direct Merchant" : "Franchise"}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Franchise Selection */}
//               {customerType === "franchise" && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Franchise</label>
//                   {availableFranchises.length > 0 ? (
//                     <select
//                       {...register("franchiseId", { required: customerType === "franchise" })}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       disabled={loading}
//                     >
//                       <option value="">Choose franchise...</option>
//                       {availableFranchises.map((franchise) => (
//                         <option key={franchise.id} value={franchise.id}>
//                           {franchise.franchiseName}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <div className="text-gray-500 p-2">Loading...</div>
//                   )}
//                 </div>
//               )}

//               {/* Merchant Selection */}
//               {availableMerchants.length > 0 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Merchant</label>
//                   <select
//                     {...register("merchantId", { required: true })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={loading}
//                   >
//                     <option value="">Choose merchant...</option>
//                     {availableMerchants.map((merchant) => (
//                       <option key={merchant.id} value={merchant.id}>
//                         {merchant.businessName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Selected Details */}
//           {(selectedFranchise || (customerType === "direct-merchant" && selectedMerchant)) && (
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Details</h2>

//               {selectedFranchise && (
//                 <div className="mb-4 pb-4 border-b border-gray-200">
//                   <h3 className="font-medium text-gray-700 mb-2">Franchise Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-500">Name:</span>
//                       <p className="font-medium">{selectedFranchise.franchiseName}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Contact:</span>
//                       <p className="font-medium">{selectedFranchise.contactPersonName}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Merchants:</span>
//                       <p className="font-medium">{selectedFranchise.merchantCount}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {selectedMerchant && (
//                 <div>
//                   <h3 className="font-medium text-gray-700 mb-2">Merchant Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-500">Business:</span>
//                       <p className="font-medium">{selectedMerchant.businessName}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Contact:</span>
//                       <p className="font-medium">{selectedMerchant.contactPersonName}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Wallet Balance:</span>
//                       <p className="font-medium">₹{selectedMerchant.walletBalance.toLocaleString('en-IN')}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Transactions */}
//           {availableTransactions.length > 0 && (
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium text-gray-900">Transactions</h2>
//                 <button
//                   type="button"
//                   onClick={handleSelectAll}
//                   className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors"
//                 >
//                   {selectAll ? "Deselect All" : "Select All"}
//                 </button>
//               </div>

//               {/* Transaction List */}
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {availableTransactions.map((transaction) => (
//                   <label
//                     key={transaction.id}
//                     className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTransactions?.includes(transaction.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                       }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedTransactions?.includes(transaction.id) || false}
//                       onChange={() => handleTransactionToggle(transaction.id)}
//                       className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
//                       <div>
//                         <span className="text-sm font-medium text-gray-900">
//                           {new Date(transaction.date).toLocaleDateString('en-IN')}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-sm font-bold text-gray-900">
//                           ₹{transaction.amount.toLocaleString('en-IN')}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600 truncate">
//                           {transaction.description}
//                         </span>
//                       </div>
//                     </div>
//                   </label>
//                 ))}
//               </div>

//               {/* Summary */}
//               {selectedTransactions?.length > 0 && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-md">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="font-medium text-gray-700">
//                       {selectedTransactions.length} transaction(s) selected
//                     </span>
//                     <span className="font-bold text-gray-900">
//                       Total: ₹{availableTransactions
//                         .filter(t => selectedTransactions.includes(t.id))
//                         .reduce((sum, t) => sum + t.amount, 0)
//                         .toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Loading Indicator */}
//           {loading && (
//             <div className="text-center py-4">
//               <div className="inline-flex items-center">
//                 <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
//                 <span className="text-gray-600">Loading...</span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               disabled={!selectedTransactions?.length}
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//             >
//               Process ({selectedTransactions?.length || 0})
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TransactionSelectionForm;



import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../constants/API/axiosInstance";

// Settlement cycles
const settlementCycles = [
  { key: "T0", label: "T+0 (Same Day)" },
  { key: "T1", label: "T+1 (Next Day)" },
  { key: "T2", label: "T+2 (Two Days)" }
];

const TransactionSelectionForm = () => {
  const { register, watch, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      merchantId: "",
      cycle: "",
      selectedTransactions: []
    }
  });

  const [availableMerchants, setAvailableMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [settlementCandidates, setSettlementCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingBatch, setProcessingBatch] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);

  const merchantId = watch("merchantId");
  const cycle = watch("cycle");
  const selectedTransactions = watch("selectedTransactions");

  // Fetch merchants on component mount
  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const response = await api.get("/merchants");
        setAvailableMerchants(response.data);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  // Calculate date window based on cycle
  const getDateWindow = (cycleKey) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (cycleKey) {
      case "T0":
        return {
          from: today.toISOString(),
          to: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
      case "T1":
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return {
          from: yesterday.toISOString(),
          to: today.toISOString()
        };
      case "T2":
        const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return {
          from: twoDaysAgo.toISOString(),
          to: oneDayAgo.toISOString()
        };
      default:
        return { from: today.toISOString(), to: today.toISOString() };
    }
  };

  // Fetch settlement candidates when merchant and cycle are selected
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!merchantId || !cycle) {
        setSettlementCandidates([]);
        setValue("selectedTransactions", []);
        setSelectAll(false);
        return;
      }

      // Find selected merchant info
      const merchant = availableMerchants.find(m => m.id === parseInt(merchantId));
      setSelectedMerchant(merchant);

      setLoading(true);
      try {
        const { from, to } = getDateWindow(cycle);
        const response = await api.get(`/api/merchants/${merchantId}/settlement/candidates`, {
          params: { from, to, cycle }
        });
        setSettlementCandidates(response.data);
        setValue("selectedTransactions", []);
        setSelectAll(false);
        setSettlementResult(null);
      } catch (error) {
        console.error("Error fetching settlement candidates:", error);
        setSettlementCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [merchantId, cycle, availableMerchants, setValue]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allCandidateIds = settlementCandidates.map(t => t.id.toString());
      setValue("selectedTransactions", allCandidateIds);
    } else {
      setValue("selectedTransactions", []);
    }
  };

  const handleTransactionToggle = (transactionId) => {
    const currentSelected = selectedTransactions || [];
    const transactionIdStr = transactionId.toString();
    const newSelected = currentSelected.includes(transactionIdStr)
      ? currentSelected.filter(id => id !== transactionIdStr)
      : [...currentSelected, transactionIdStr];

    setValue("selectedTransactions", newSelected);
    setSelectAll(newSelected.length === settlementCandidates.length);
  };

  const onSubmit = async (data) => {
    if (!data.selectedTransactions?.length) {
      alert("Please select at least one transaction to settle.");
      return;
    }

    setProcessingBatch(true);
    setSettlementResult(null);

    try {
      // 1. Create settlement batch
      const batchResponse = await api.post(`/api/merchants/${merchantId}/settlement/batches`);
      const batchId = batchResponse.data.batchId;

      // 2. Settle selected transactions
      const settleResponse = await api.post(
        `/api/merchants/${merchantId}/settlement/batches/${batchId}/settle`,
        { vendorTxIds: data.selectedTransactions }
      );

      setSettlementResult({
        success: true,
        batchId,
        results: settleResponse.data
      });

      // Refresh candidates to remove settled ones
      const { from, to } = getDateWindow(cycle);
      const refreshResponse = await api.get(`/api/merchants/${merchantId}/settlement/candidates`, {
        params: { from, to, cycle }
      });
      setSettlementCandidates(refreshResponse.data);
      setValue("selectedTransactions", []);
      setSelectAll(false);

    } catch (error) {
      console.error("Error processing settlement:", error);
      setSettlementResult({
        success: false,
        error: error.response?.data?.message || error.message
      });
    } finally {
      setProcessingBatch(false);
    }
  };

  const resetForm = () => {
    reset();
    setSelectedMerchant(null);
    setSettlementCandidates([]);
    setSelectAll(false);
    setSettlementResult(null);
  };

  const calculateTotals = () => {
    const selectedCandidates = settlementCandidates.filter(
      t => selectedTransactions?.includes(t.id.toString())
    );

    const totalAmount = selectedCandidates.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Simplified fee calculation (you'll get actual from backend)
    const estimatedFee = totalAmount * 0.025; // 2.5% estimate
    const estimatedNet = totalAmount - estimatedFee;

    return { totalAmount, estimatedFee, estimatedNet, count: selectedCandidates.length };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Management</h1>
          <p className="text-gray-600">Process merchant transaction settlements by cycle</p>
        </div>

        <div className="space-y-6">
          {/* Selection Fields */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Merchant Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Merchant</label>
                <select
                  {...register("merchantId", { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Choose merchant...</option>
                  {availableMerchants.map((merchant) => (
                    <option key={merchant.id} value={merchant.id}>
                      {merchant.businessName} - {merchant.contactPersonName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Settlement Cycle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Cycle</label>
                <select
                  {...register("cycle", { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select cycle...</option>
                  {settlementCycles.map((cycleOption) => (
                    <option key={cycleOption.key} value={cycleOption.key}>
                      {cycleOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selected Merchant Details */}
          {selectedMerchant && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Merchant Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Business Name:</span>
                  <p className="font-medium">{selectedMerchant.businessName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Contact Person:</span>
                  <p className="font-medium">{selectedMerchant.contactPersonName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Current Balance:</span>
                  <p className="font-medium text-green-600">
                    ₹{(selectedMerchant.walletBalance || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Settlement Cycle:</span>
                  <p className="font-medium">{settlementCycles.find(c => c.key === cycle)?.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Settlement Candidates */}
          {settlementCandidates.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Settlement Candidates ({settlementCandidates.length})
                </h2>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors"
                  disabled={processingBatch}
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>

              {/* Transaction Headers */}
              <div className="hidden md:grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-md mb-2 text-sm font-medium text-gray-700">
                <div>Date</div>
                <div>Amount</div>
                <div>Card Type</div>
                <div>MID/TID</div>
                <div>Device Serial</div>
                <div>Select</div>
              </div>

              {/* Transaction List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {settlementCandidates.map((transaction) => (
                  <label
                    key={transaction.id}
                    className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${selectedTransactions?.includes(transaction.id.toString())
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                      }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        ₹{(transaction.amount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.cardType || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.mid || transaction.tid || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction['device serial'] || 'N/A'}
                      </div>
                      <div className="flex justify-center md:justify-start">
                        <input
                          type="checkbox"
                          checked={selectedTransactions?.includes(transaction.id.toString()) || false}
                          onChange={() => handleTransactionToggle(transaction.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={processingBatch}
                        />
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Selection Summary */}
              {selectedTransactions?.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Selected:</span>
                      <p className="font-bold text-gray-900">{totals.count} transactions</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gross Amount:</span>
                      <p className="font-bold text-gray-900">₹{totals.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Fee (2.5%):</span>
                      <p className="font-bold text-red-600">₹{totals.estimatedFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Net Amount:</span>
                      <p className="font-bold text-green-600">₹{totals.estimatedNet.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Candidates Message */}
          {merchantId && cycle && !loading && settlementCandidates.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-gray-500">
                <p className="text-lg">No settlement candidates found</p>
                <p className="text-sm mt-2">
                  No unsettled transactions found for {selectedMerchant?.businessName} in the {cycle} cycle window.
                </p>
              </div>
            </div>
          )}

          {/* Settlement Result */}
          {settlementResult && (
            <div className={`rounded-lg border p-6 ${settlementResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
              }`}>
              <h3 className={`text-lg font-medium mb-4 ${settlementResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                Settlement {settlementResult.success ? 'Completed' : 'Failed'}
              </h3>

              {settlementResult.success ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-700">
                    <strong>Batch ID:</strong> {settlementResult.batchId}
                  </p>

                  {settlementResult.results && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Successful:</span>
                        <p className="font-bold">{settlementResult.results.successful || 0}</p>
                      </div>
                      <div>
                        <span className="text-yellow-600">Already Settled:</span>
                        <p className="font-bold">{settlementResult.results.alreadySettled || 0}</p>
                      </div>
                      <div>
                        <span className="text-red-600">Failed:</span>
                        <p className="font-bold">{settlementResult.results.failed || 0}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-700">{settlementResult.error}</p>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                <span className="text-gray-600">Loading settlement candidates...</span>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {processingBatch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <div className="flex items-center">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                  <span className="text-gray-700">Processing settlement batch...</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Please wait while we settle your transactions.</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={processingBatch}
            >
              Reset
            </button>

            <div className="flex space-x-4">
              {selectedTransactions?.length > 0 && (
                <div className="text-sm text-gray-600 self-center">
                  {totals.count} selected • Est. net: ₹{totals.estimatedNet.toLocaleString('en-IN')}
                </div>
              )}

              <button
                type="button"
                disabled={!selectedTransactions?.length || processingBatch}
                onClick={handleSubmit(onSubmit)}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                {processingBatch ? 'Processing...' : `Settle ${selectedTransactions?.length || 0} Transactions`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSelectionForm;