// import React from 'react';

// const BatchInfo = ({ currentBatch, onCancelBatch }) => {
//     if (!currentBatch) return null;

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-IN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     return (
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <div className="flex justify-between items-start">
//                 <div>
//                     <h2 className="text-lg font-medium text-gray-900 mb-4">Active Settlement Batch</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <span className="text-gray-500">Batch ID:</span>
//                             <p className="font-medium">{currentBatch.batchId}</p>
//                         </div>
//                         <div>
//                             <span className="text-gray-500">Status:</span>
//                             <p className="font-medium text-blue-600">{currentBatch.status}</p>
//                         </div>
//                         <div>
//                             <span className="text-gray-500">Window Start:</span>
//                             <p className="font-medium">{formatDate(currentBatch.windowStart)}</p>
//                         </div>
//                         <div>
//                             <span className="text-gray-500">Window End:</span>
//                             <p className="font-medium">{formatDate(currentBatch.windowEnd)}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <button
//                     onClick={onCancelBatch}
//                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                 >
//                     Cancel Batch
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BatchInfo;

import React from 'react';

const BatchInfo = ({ currentBatch, currentFranchiseBatch, customerType, onCancelBatch }) => {
    if (!currentBatch && !currentFranchiseBatch) return null;

    const batch = currentFranchiseBatch || currentBatch;
    const isFranchiseBatch = customerType === "franchise";

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                        {isFranchiseBatch ? "Franchise Batch Information" : "Batch Information"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Batch ID:</span>
                            <p className="font-medium">{batch.batchId}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Status:</span>
                            <p className="font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${batch.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                        batch.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                                            batch.status === 'PROCESSING' ? 'bg-orange-100 text-orange-800' :
                                                batch.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                    {batch.status}
                                </span>
                            </p>
                        </div>
                        {isFranchiseBatch ? (
                            <>
                                <div>
                                    <span className="text-gray-500">Total Merchants:</span>
                                    <p className="font-medium">{batch.totalMerchants || 0}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Cycle:</span>
                                    <p className="font-medium">{batch.cycleKey}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-gray-500">Window Start:</span>
                                    <p className="font-medium">{batch.windowStart ? new Date(batch.windowStart).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Window End:</span>
                                    <p className="font-medium">{batch.windowEnd ? new Date(batch.windowEnd).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Additional batch details for both types */}
                    {(batch.totalTransactions > 0 || batch.totalAmount > 0) && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Total Transactions:</span>
                                <p className="font-medium">{batch.totalTransactions || 0}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Total Amount:</span>
                                <p className="font-medium">₹{(batch.totalAmount || 0).toFixed(2)}</p>
                            </div>
                            {!isFranchiseBatch && (
                                <div>
                                    <span className="text-gray-500">Total Fees:</span>
                                    <p className="font-medium">₹{(batch.totalFees || 0).toFixed(2)}</p>
                                </div>
                            )}
                            {isFranchiseBatch && (
                                <div>
                                    <span className="text-gray-500">Franchise Commission:</span>
                                    <p className="font-medium">₹{(batch.totalFranchiseCommission || 0).toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={onCancelBatch}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                    Cancel Batch
                </button>
            </div>
        </div>
    );
};

export default BatchInfo;