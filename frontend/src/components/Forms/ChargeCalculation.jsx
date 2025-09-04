

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import api from "../../constants/API/axiosInstance";

// // Settlement cycles
// const settlementCycles = [
//   { key: "T0", label: "T+0 (Same Day)" },
//   { key: "T1", label: "T+1 (Next Day)" },
//   { key: "T2", label: "T+2 (Two Days)" }
// ];

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
//       }`}>
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-3 text-white hover:text-gray-200"
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// };

// const EnhancedTransactionSelectionForm = () => {
//   const { register, watch, handleSubmit, reset, setValue } = useForm({
//     defaultValues: {
//       customerType: "",
//       franchiseId: "",
//       merchantId: "",
//       productId: "",
//       cycle: "",
//       selectedTransactions: []
//     }
//   });

//   const [availableFranchises, setAvailableFranchises] = useState([]);
//   const [availableDirectMerchants, setAvailableDirectMerchants] = useState([]);
//   const [availableFranchiseMerchants, setAvailableFranchiseMerchants] = useState([]);
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [selectedEntity, setSelectedEntity] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [settlementCandidates, setSettlementCandidates] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [processingBatch, setProcessingBatch] = useState(false);
//   const [creatingBatch, setCreatingBatch] = useState(false);
//   const [currentBatch, setCurrentBatch] = useState(null);
//   const [toast, setToast] = useState(null);

//   const customerType = watch("customerType");
//   const franchiseId = watch("franchiseId");
//   const merchantId = watch("merchantId");
//   const productId = watch("productId");
//   const cycle = watch("cycle");
//   const selectedTransactions = watch("selectedTransactions");

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//   };

//   const hideToast = () => {
//     setToast(null);
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setLoading(true);
//       try {
//         const [franchisesResponse, directMerchantsResponse] = await Promise.all([
//           api.get("/franchise"),
//           api.get("/merchants/direct-merchant")
//         ]);

//         setAvailableFranchises(franchisesResponse.data);
//         setAvailableDirectMerchants(directMerchantsResponse.data);
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         showToast("Failed to load initial data", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Reset form when customer type changes
//   useEffect(() => {
//     if (customerType) {
//       setValue("franchiseId", "");
//       setValue("merchantId", "");
//       setValue("productId", "");
//       setValue("cycle", "");
//       setValue("selectedTransactions", []);
//       setAvailableFranchiseMerchants([]);
//       setAvailableProducts([]);
//       setSelectedEntity(null);
//       setSelectedProduct(null);
//       setSettlementCandidates([]);
//       setCurrentBatch(null);
//       setSelectAll(false);
//     }
//   }, [customerType, setValue]);

//   // Fetch franchise merchants when franchise is selected
//   useEffect(() => {
//     const fetchFranchiseMerchants = async () => {
//       if (!franchiseId || customerType !== "franchise") return;

//       setLoading(true);
//       try {
//         const response = await api.get(`/merchants/franchise/${franchiseId}`);
//         setAvailableFranchiseMerchants(response.data);

//         const franchise = availableFranchises.find(f => f.id === parseInt(franchiseId));
//         setSelectedEntity(franchise);
//       } catch (error) {
//         console.error("Error fetching franchise merchants:", error);
//         setAvailableFranchiseMerchants([]);
//         showToast("Failed to load franchise merchants", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFranchiseMerchants();
//   }, [franchiseId, customerType, availableFranchises]);

//   // Set selected entity for direct merchant
//   useEffect(() => {
//     if (customerType === "direct" && merchantId) {
//       const merchant = availableDirectMerchants.find(m => m.id === parseInt(merchantId));
//       setSelectedEntity(merchant);
//     }
//   }, [merchantId, customerType, availableDirectMerchants]);

//   // Fetch products when merchant is selected
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!merchantId) {
//         setAvailableProducts([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         let response;
//         if (customerType === "franchise") {
//           response = await api.get(`/franchise/products/${franchiseId}`);
//         } else {
//           response = await api.get(`/merchants/products/${merchantId}`);
//         }

//         setAvailableProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setAvailableProducts([]);
//         showToast("Failed to load products", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [merchantId, customerType, franchiseId]);

//   // Set selected product
//   useEffect(() => {
//     if (productId) {
//       const product = availableProducts.find(p => p.productId === parseInt(productId));
//       setSelectedProduct(product);
//     }
//   }, [productId, availableProducts]);

//   const createBatch = async () => {
//     if (!merchantId || !productId || !cycle) {
//       showToast("Please select merchant, product, and cycle first", "error");
//       return;
//     }

//     setCreatingBatch(true);
//     try {
//       // Create settlement batch
//       const batchResponse = await api.post(
//         `/merchants/${merchantId}/settlement/batches?cycleKey=${cycle}&createdBy=admin&productId=${productId}`
//       );

//       const batch = batchResponse.data;
//       setCurrentBatch(batch);

//       // Fetch settlement candidates
//       const candidatesResponse = await api.get(
//         `/merchants/${merchantId}/settlement/batches/${batch.batchId}/candidates`
//       );

//       setSettlementCandidates(candidatesResponse.data);
//       setValue("selectedTransactions", []);
//       setSelectAll(false);

//       showToast(`Batch created successfully! Found ${candidatesResponse.data.length} candidates`);

//     } catch (error) {
//       console.error("Error creating batch:", error);
//       showToast(error.response?.data?.message || "Failed to create batch", "error");
//       setCurrentBatch(null);
//       setSettlementCandidates([]);
//     } finally {
//       setCreatingBatch(false);
//     }
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);

//     if (newSelectAll) {
//       const allCandidateIds = settlementCandidates.map(t => t.transactionReferenceId);
//       setValue("selectedTransactions", allCandidateIds);
//     } else {
//       setValue("selectedTransactions", []);
//     }
//   };

//   const handleTransactionToggle = (transactionReferenceId) => {
//     const currentSelected = selectedTransactions || [];
//     const newSelected = currentSelected.includes(transactionReferenceId)
//       ? currentSelected.filter(id => id !== transactionReferenceId)
//       : [...currentSelected, transactionReferenceId];

//     setValue("selectedTransactions", newSelected);
//     setSelectAll(newSelected.length === settlementCandidates.length);
//   };

//   const onSubmit = async (data) => {
//     if (!data.selectedTransactions?.length) {
//       showToast("Please select at least one transaction to settle", "error");
//       return;
//     }

//     if (!currentBatch) {
//       showToast("No active batch found. Please create a batch first", "error");
//       return;
//     }

//     setProcessingBatch(true);

//     try {
//       const settleResponse = await api.post(
//         `/merchants/${merchantId}/settlement/batches/${currentBatch.batchId}/settle`,
//         { vendorTxIds: data.selectedTransactions }
//       );

//       showToast(`Successfully settled ${data.selectedTransactions.length} transactions!`);

//       // Reset form after successful settlement
//       resetForm();

//     } catch (error) {
//       console.error("Error processing settlement:", error);
//       showToast(error.response?.data?.message || "Failed to process settlement", "error");
//     } finally {
//       setProcessingBatch(false);
//     }
//   };

//   const resetForm = () => {
//     reset();
//     setSelectedEntity(null);
//     setSelectedProduct(null);
//     setAvailableFranchiseMerchants([]);
//     setAvailableProducts([]);
//     setSettlementCandidates([]);
//     setSelectAll(false);
//     setCurrentBatch(null);
//   };

//   const calculateTotals = () => {
//     const selectedCandidates = settlementCandidates.filter(
//       t => selectedTransactions?.includes(t.transactionReferenceId)
//     );

//     const totalAmount = selectedCandidates.reduce((sum, t) => sum + (t.amount || 0), 0);
//     const totalFee = selectedCandidates.reduce((sum, t) => sum + (t.fee || 0), 0);
//     const totalNet = selectedCandidates.reduce((sum, t) => sum + (t.netAmount || 0), 0);

//     return {
//       totalAmount,
//       totalFee,
//       totalNet,
//       count: selectedCandidates.length
//     };
//   };

//   const totals = calculateTotals();

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getMerchantsForSelection = () => {
//     return customerType === "franchise" ? availableFranchiseMerchants : availableDirectMerchants;
//   };

//   const canCreateBatch = merchantId && productId && cycle && !currentBatch;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={hideToast}
//         />
//       )}

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Management</h1>
//           <p className="text-gray-600">Process merchant transaction settlements by cycle and product</p>
//         </div>

//         <div className="space-y-6">
//           {/* Selection Fields */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Parameters</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Customer Type Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
//                 <select
//                   {...register("customerType", { required: true })}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   disabled={loading || currentBatch}
//                 >
//                   <option value="">Select type...</option>
//                   <option value="direct">Direct Merchant</option>
//                   <option value="franchise">Franchise</option>
//                 </select>
//               </div>

//               {/* Franchise Selection */}
//               {customerType === "franchise" && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Franchise</label>
//                   <select
//                     {...register("franchiseId", { required: customerType === "franchise" })}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={loading || currentBatch}
//                   >
//                     <option value="">Choose franchise...</option>
//                     {availableFranchises.map((franchise) => (
//                       <option key={franchise.id} value={franchise.id}>
//                         {franchise.franchiseName} - {franchise.contactPersonName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Merchant Selection */}
//               {customerType && (customerType === "direct" || franchiseId) && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Merchant</label>
//                   <select
//                     {...register("merchantId", { required: true })}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={loading || currentBatch}
//                   >
//                     <option value="">Choose merchant...</option>
//                     {getMerchantsForSelection().map((merchant) => (
//                       <option key={merchant.id} value={merchant.id}>
//                         {merchant.businessName} - {merchant.contactPersonName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Product Selection */}
//               {merchantId && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
//                   <select
//                     {...register("productId", { required: true })}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={loading || currentBatch}
//                   >
//                     <option value="">Choose product...</option>
//                     {availableProducts.map((product) => (
//                       <option key={product.productId} value={product.productId}>
//                         {product.productName} - {product.productCode}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Settlement Cycle */}
//               {productId && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Cycle</label>
//                   <select
//                     {...register("cycle", { required: true })}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={loading || currentBatch}
//                   >
//                     <option value="">Select cycle...</option>
//                     {settlementCycles.map((cycleOption) => (
//                       <option key={cycleOption.key} value={cycleOption.key}>
//                         {cycleOption.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Create Batch Button */}
//               {canCreateBatch && (
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={createBatch}
//                     disabled={creatingBatch || !canCreateBatch}
//                     className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
//                   >
//                     {creatingBatch ? 'Creating Batch...' : 'Create Settlement Batch'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Batch Information */}
//           {currentBatch && (
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-4">Active Settlement Batch</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-500">Batch ID:</span>
//                       <p className="font-medium">{currentBatch.batchId}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Status:</span>
//                       <p className="font-medium text-blue-600">{currentBatch.status}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Window Start:</span>
//                       <p className="font-medium">{formatDate(currentBatch.windowStart)}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Window End:</span>
//                       <p className="font-medium">{formatDate(currentBatch.windowEnd)}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={resetForm}
//                   className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel Batch
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Selected Details */}
//           {selectedEntity && selectedProduct && (
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-500">
//                     {customerType === "franchise" ? "Franchise:" : "Business:"}
//                   </span>
//                   <p className="font-medium">
//                     {customerType === "franchise" ? selectedEntity.franchiseName : selectedEntity.businessName}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Contact Person:</span>
//                   <p className="font-medium">{selectedEntity.contactPersonName}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Product:</span>
//                   <p className="font-medium">{selectedProduct.productName}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Settlement Cycle:</span>
//                   <p className="font-medium">{settlementCycles.find(c => c.key === cycle)?.label}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Settlement Candidates */}
//           {settlementCandidates.length > 0 && (
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium text-gray-900">
//                   Settlement Candidates ({settlementCandidates.length})
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={handleSelectAll}
//                   className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors"
//                   disabled={processingBatch}
//                 >
//                   {selectAll ? "Deselect All" : "Select All"}
//                 </button>
//               </div>

//               {/* Transaction List */}
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {settlementCandidates.map((transaction) => (
//                   <label
//                     key={transaction.transactionReferenceId}
//                     className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedTransactions?.includes(transaction.transactionReferenceId)
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200'
//                       }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedTransactions?.includes(transaction.transactionReferenceId) || false}
//                       onChange={() => handleTransactionToggle(transaction.transactionReferenceId)}
//                       className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       disabled={processingBatch}
//                     />

//                     <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
//                       <div className="lg:col-span-2">
//                         <div className="text-sm font-medium text-gray-900">
//                           {formatDate(transaction.date)}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           ID: {transaction.transactionReferenceId}
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm font-bold text-gray-900">
//                           ₹{(transaction.amount || 0).toLocaleString('en-IN')}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {transaction.cardType} {transaction.brandType}
//                         </div>
//                       </div>

//                       <div>
//                         {transaction.fee > 0 ? (
//                           <>
//                             <div className="text-sm text-red-600">
//                               -₹{transaction.fee.toLocaleString('en-IN')}
//                             </div>
//                             <div className="text-xs text-gray-500">Fee ({transaction.appliedRate}%)</div>
//                           </>
//                         ) : (
//                           <div className="text-xs text-red-500">{transaction.error || 'No rate'}</div>
//                         )}
//                       </div>

//                       <div>
//                         {transaction.netAmount > 0 ? (
//                           <div className="text-sm font-medium text-green-600">
//                             ₹{transaction.netAmount.toLocaleString('en-IN')}
//                           </div>
//                         ) : (
//                           <div className="text-sm text-gray-400">-</div>
//                         )}
//                         <div className="text-xs text-gray-500">Net Amount</div>
//                       </div>

//                       <div>
//                         <div className="text-xs text-gray-600">{transaction.cardName || 'Unknown Card'}</div>
//                       </div>
//                     </div>
//                   </label>
//                 ))}
//               </div>

//               {/* Selection Summary */}
//               {selectedTransactions?.length > 0 && (
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-600">Selected:</span>
//                       <p className="font-bold text-gray-900">{totals.count} transactions</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Total Amount:</span>
//                       <p className="font-bold text-gray-900">₹{totals.totalAmount.toLocaleString('en-IN')}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Total Fees:</span>
//                       <p className="font-bold text-red-600">₹{totals.totalFee.toLocaleString('en-IN')}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Net Settlement:</span>
//                       <p className="font-bold text-green-600">₹{totals.totalNet.toLocaleString('en-IN')}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* No Candidates Message */}
//           {currentBatch && !loading && settlementCandidates.length === 0 && (
//             <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//               <div className="text-gray-500">
//                 <p className="text-lg font-medium">No settlement candidates found</p>
//                 <p className="text-sm mt-2">
//                   No transactions are available for settlement in the selected {cycle} cycle window.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Loading Indicators */}
//           {(loading || creatingBatch) && (
//             <div className="text-center py-8">
//               <div className="inline-flex items-center">
//                 <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
//                 <span className="text-gray-600">
//                   {creatingBatch ? 'Creating settlement batch...' : 'Loading...'}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Processing Overlay */}
//           {processingBatch && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//                 <div className="flex items-center mb-4">
//                   <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
//                   <span className="text-gray-700 font-medium">Processing Settlement</span>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Settling {selectedTransactions?.length} transactions...
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               disabled={processingBatch}
//             >
//               Reset All
//             </button>

//             <div className="flex items-center space-x-4">
//               {selectedTransactions?.length > 0 && (
//                 <div className="text-sm text-gray-600">
//                   {totals.count} selected • Net: ₹{totals.totalNet.toLocaleString('en-IN')}
//                 </div>
//               )}

//               <button
//                 type="button"
//                 disabled={!selectedTransactions?.length || processingBatch || !currentBatch}
//                 onClick={handleSubmit(onSubmit)}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
//               >
//                 {processingBatch
//                   ? 'Processing...'
//                   : `Settle ${selectedTransactions?.length || 0} Transaction${selectedTransactions?.length === 1 ? '' : 's'}`
//                 }
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedTransactionSelectionForm;



import React from "react";
// import { useSettlementForm } from "../TempFilesForCharge/useSettlementForm"
// import Toast from "../TempFilesForCharge/Toast";
// import SelectionForm from "../TempFilesForCharge/SelectionForm";
// import BatchInfo from "../TempFilesForCharge/BatchInfo";
// import SettlementDetails from "../TempFilesForCharge/SettlementDetails";
// import SettlementCandidates from "../TempFilesForCharge/SettlementCandidates";
// import LoadingSpinner from "../TempFilesForCharge/LoadingSpinner";
// import ProcessingOverlay from "../TempFilesForCharge/ProcessingOverlay";
// import ActionButtons from "../TempFilesForCharge/ActionButtons";

// const EnhancedTransactionSelectionForm = () => {
//   const {
//     // Form controls
//     register,
//     handleSubmit,

//     // Form values
//     customerType,
//     franchiseId,
//     merchantId,
//     productId,
//     cycle,
//     selectedTransactions,

//     // Data states
//     availableFranchises,
//     availableDirectMerchants,
//     availableFranchiseMerchants,
//     availableProducts,
//     selectedEntity,
//     selectedProduct,
//     settlementCandidates,
//     currentBatch,

//     // UI states
//     selectAll,
//     loading,
//     processingBatch,
//     creatingBatch,
//     toast,

//     // Computed values
//     canCreateBatch,
//     totals,

//     // Actions
//     hideToast,
//     createBatch,
//     handleSelectAll,
//     handleTransactionToggle,
//     onSubmit,
//     resetForm
//   } = useSettlementForm();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={hideToast}
//         />
//       )}

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Management</h1>
//           <p className="text-gray-600">Process merchant transaction settlements by cycle and product</p>
//         </div>

//         <div className="space-y-6">
//           {/* Selection Fields */}
//           <SelectionForm
//             register={register}
//             customerType={customerType}
//             franchiseId={franchiseId}
//             merchantId={merchantId}
//             productId={productId}
//             cycle={cycle}
//             availableFranchises={availableFranchises}
//             availableDirectMerchants={availableDirectMerchants}
//             availableFranchiseMerchants={availableFranchiseMerchants}
//             availableProducts={availableProducts}
//             loading={loading}
//             currentBatch={currentBatch}
//             canCreateBatch={canCreateBatch}
//             creatingBatch={creatingBatch}
//             onCreateBatch={createBatch}
//           />

//           {/* Batch Information */}
//           <BatchInfo
//             currentBatch={currentBatch}
//             onCancelBatch={resetForm}
//           />

//           {/* Selected Details */}
//           <SettlementDetails
//             selectedEntity={selectedEntity}
//             selectedProduct={selectedProduct}
//             customerType={customerType}
//             cycle={cycle}
//           />

//           {/* Settlement Candidates */}
//           <SettlementCandidates
//             settlementCandidates={settlementCandidates}
//             selectedTransactions={selectedTransactions}
//             selectAll={selectAll}
//             processingBatch={processingBatch}
//             onSelectAll={handleSelectAll}
//             onTransactionToggle={handleTransactionToggle}
//             totals={totals}
//           />

//           {/* No Candidates Message */}
//           {currentBatch && !loading && settlementCandidates.length === 0 && (
//             <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//               <div className="text-gray-500">
//                 <p className="text-lg font-medium">No settlement candidates found</p>
//                 <p className="text-sm mt-2">
//                   No transactions are available for settlement in the selected {cycle} cycle window.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Loading Indicators */}
//           {(loading || creatingBatch) && (
//             <LoadingSpinner
//               text={creatingBatch ? 'Creating settlement batch...' : 'Loading...'}
//             />
//           )}

//           {/* Processing Overlay */}
//           <ProcessingOverlay
//             isVisible={processingBatch}
//             selectedCount={selectedTransactions?.length || 0}
//           />

//           {/* Action Buttons */}
//           <ActionButtons
//             selectedTransactions={selectedTransactions}
//             totals={totals}
//             processingBatch={processingBatch}
//             currentBatch={currentBatch}
//             onResetForm={resetForm}
//             onSubmit={handleSubmit(onSubmit)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedTransactionSelectionForm;


import { useSettlementForm } from "../TempFilesForCharge/useSettlementForm"
import Toast from "../TempFilesForCharge/Toast";
import SelectionForm from "../TempFilesForCharge/SelectionForm";
import BatchInfo from "../TempFilesForCharge/BatchInfo";
import SettlementDetails from "../TempFilesForCharge/SettlementDetails";
import SettlementCandidates from "../TempFilesForCharge/SettlementCandidates";
import LoadingSpinner from "../TempFilesForCharge/LoadingSpinner";
import ProcessingOverlay from "../TempFilesForCharge/ProcessingOverlay";
import ActionButtons from "../TempFilesForCharge/ActionButtons";
import FranchiseMerchantSelector from "../TempFilesForCharge/FranchiseMerchantSelector";

const EnhancedTransactionSelectionForm = () => {
  const {
    // Form controls
    register,
    handleSubmit,

    // Form values
    customerType,
    franchiseId,
    merchantId,
    productId,
    cycle,
    selectedTransactions,
    selectedMerchants,
    batchType,

    // Data states
    availableFranchises,
    availableDirectMerchants,
    availableFranchiseMerchants,
    availableProducts,
    selectedEntity,
    selectedProduct,
    settlementCandidates,
    currentBatch,
    currentFranchiseBatch,
    selectedMerchantForCandidates,

    // UI states
    selectAll,
    loading,
    processingBatch,
    creatingBatch,
    toast,

    // Computed values
    canCreateBatch,
    canLoadCandidates,
    totals,

    // Actions
    hideToast,
    createBatch,
    loadMerchantCandidates,
    handleSelectAll,
    handleTransactionToggle,
    handleMerchantToggle,
    onSubmit,
    resetForm
  } = useSettlementForm();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Management</h1>
          <p className="text-gray-600">
            Process {customerType === "franchise" ? "franchise bulk" : "merchant"} transaction settlements by cycle and product
          </p>
        </div>

        <div className="space-y-6">
          {/* Selection Fields */}
          <SelectionForm
            register={register}
            customerType={customerType}
            franchiseId={franchiseId}
            merchantId={merchantId}
            productId={productId}
            cycle={cycle}
            selectedMerchants={selectedMerchants}
            batchType={batchType}
            availableFranchises={availableFranchises}
            availableDirectMerchants={availableDirectMerchants}
            availableFranchiseMerchants={availableFranchiseMerchants}
            availableProducts={availableProducts}
            loading={loading}
            currentBatch={currentBatch}
            currentFranchiseBatch={currentFranchiseBatch}
            canCreateBatch={canCreateBatch}
            creatingBatch={creatingBatch}
            onCreateBatch={createBatch}
            onMerchantToggle={handleMerchantToggle}
          />

          {/* Batch Information */}
          <BatchInfo
            currentBatch={currentBatch}
            currentFranchiseBatch={currentFranchiseBatch}
            customerType={customerType}
            onCancelBatch={resetForm}
          />

          {/* Selected Details */}
          <SettlementDetails
            selectedEntity={selectedEntity}
            selectedProduct={selectedProduct}
            customerType={customerType}
            cycle={cycle}
          />

          {/* Franchise Merchant Selector (for loading candidates) */}
          {customerType === "franchise" && canLoadCandidates && (
            <FranchiseMerchantSelector
              availableMerchants={availableFranchiseMerchants}
              selectedMerchantForCandidates={selectedMerchantForCandidates}
              loading={loading}
              onLoadCandidates={loadMerchantCandidates}
            />
          )}

          {/* Settlement Candidates */}
          {settlementCandidates.length > 0 && (
            <SettlementCandidates
              settlementCandidates={settlementCandidates}
              selectedTransactions={selectedTransactions}
              selectAll={selectAll}
              processingBatch={processingBatch}
              customerType={customerType}
              selectedMerchantForCandidates={selectedMerchantForCandidates}
              availableFranchiseMerchants={availableFranchiseMerchants}
              onSelectAll={handleSelectAll}
              onTransactionToggle={handleTransactionToggle}
              totals={totals}
            />
          )}

          {/* No Candidates Message */}
          {((currentBatch && customerType === "direct") ||
            (selectedMerchantForCandidates && customerType === "franchise")) &&
            !loading && settlementCandidates.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">No settlement candidates found</p>
                  <p className="text-sm mt-2">
                    No transactions are available for settlement in the selected {cycle} cycle window
                    {customerType === "franchise" && " for this merchant"}.
                  </p>
                </div>
              </div>
            )}

          {/* Franchise Batch Created but no merchant selected message */}
          {currentFranchiseBatch && !selectedMerchantForCandidates &&
            settlementCandidates.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-blue-800">
                  <h3 className="text-lg font-medium mb-2">Franchise Batch Created Successfully</h3>
                  <p className="text-sm">
                    Select a merchant above to view and process their settlement candidates.
                  </p>
                </div>
              </div>
            )}

          {/* Loading Indicators */}
          {(loading || creatingBatch) && (
            <LoadingSpinner
              text={creatingBatch ?
                (customerType === "franchise" ? 'Creating franchise batch...' : 'Creating settlement batch...') :
                'Loading...'
              }
            />
          )}

          {/* Processing Overlay */}
          <ProcessingOverlay
            isVisible={processingBatch}
            selectedCount={selectedTransactions?.length || 0}
            customerType={customerType}
          />

          {/* Action Buttons */}
          <ActionButtons
            selectedTransactions={selectedTransactions}
            totals={totals}
            processingBatch={processingBatch}
            currentBatch={currentBatch}
            currentFranchiseBatch={currentFranchiseBatch}
            customerType={customerType}
            selectedMerchantForCandidates={selectedMerchantForCandidates}
            onResetForm={resetForm}
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedTransactionSelectionForm;


