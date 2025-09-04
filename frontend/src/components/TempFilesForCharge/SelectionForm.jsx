// import React from 'react';

// const settlementCycles = [
//     { key: "T0", label: "T+0 (Same Day)" },
//     { key: "T1", label: "T+1 (Next Day)" },
//     { key: "T2", label: "T+2 (Two Days)" }
// ];

// const SelectionForm = ({
//     register,
//     customerType,
//     franchiseId,
//     merchantId,
//     productId,
//     cycle,
//     availableFranchises,
//     availableDirectMerchants,
//     availableFranchiseMerchants,
//     availableProducts,
//     loading,
//     currentBatch,
//     canCreateBatch,
//     creatingBatch,
//     onCreateBatch
// }) => {

//     const getMerchantsForSelection = () => {
//         return customerType === "franchise" ? availableFranchiseMerchants : availableDirectMerchants;
//     };

//     return (
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Parameters</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Customer Type Selection */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
//                     <select
//                         {...register("customerType", { required: true })}
//                         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         disabled={loading || currentBatch}
//                     >
//                         <option value="">Select type...</option>
//                         <option value="direct">Direct Merchant</option>
//                         <option value="franchise">Franchise</option>
//                     </select>
//                 </div>

//                 {/* Franchise Selection */}
//                 {customerType === "franchise" && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Select Franchise</label>
//                         <select
//                             {...register("franchiseId", { required: customerType === "franchise" })}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             disabled={loading || currentBatch}
//                         >
//                             <option value="">Choose franchise...</option>
//                             {availableFranchises.map((franchise) => (
//                                 <option key={franchise.id} value={franchise.id}>
//                                     {franchise.franchiseName} - {franchise.contactPersonName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Merchant Selection */}
//                 {customerType && (customerType === "direct" || franchiseId) && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Select Merchant</label>
//                         <select
//                             {...register("merchantId", { required: true })}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             disabled={loading || currentBatch}
//                         >
//                             <option value="">Choose merchant...</option>
//                             {getMerchantsForSelection().map((merchant) => (
//                                 <option key={merchant.id} value={merchant.id}>
//                                     {merchant.businessName} - {merchant.contactPersonName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Product Selection */}
//                 {merchantId && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
//                         <select
//                             {...register("productId", { required: true })}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             disabled={loading || currentBatch}
//                         >
//                             <option value="">Choose product...</option>
//                             {availableProducts.map((product) => (
//                                 <option key={product.productId} value={product.productId}>
//                                     {product.productName} - {product.productCode}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Settlement Cycle */}
//                 {productId && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Cycle</label>
//                         <select
//                             {...register("cycle", { required: true })}
//                             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             disabled={loading || currentBatch}
//                         >
//                             <option value="">Select cycle...</option>
//                             {settlementCycles.map((cycleOption) => (
//                                 <option key={cycleOption.key} value={cycleOption.key}>
//                                     {cycleOption.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Create Batch Button */}
//                 {canCreateBatch && (
//                     <div className="flex items-end">
//                         <button
//                             type="button"
//                             onClick={onCreateBatch}
//                             disabled={creatingBatch || !canCreateBatch}
//                             className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
//                         >
//                             {creatingBatch ? 'Creating Batch...' : 'Create Settlement Batch'}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SelectionForm;


import React from 'react';

const settlementCycles = [
    { key: "T0", label: "T+0 (Same Day)" },
    { key: "T1", label: "T+1 (Next Day)" },
    { key: "T2", label: "T+2 (Two Days)" }
];

const SelectionForm = ({
    register,
    customerType,
    franchiseId,
    merchantId,
    productId,
    cycle,
    selectedMerchants,
    batchType,
    availableFranchises,
    availableDirectMerchants,
    availableFranchiseMerchants,
    availableProducts,
    loading,
    currentBatch,
    currentFranchiseBatch,
    canCreateBatch,
    creatingBatch,
    onCreateBatch,
    onMerchantToggle
}) => {

    const getMerchantsForSelection = () => {
        return customerType === "franchise" ? availableFranchiseMerchants : availableDirectMerchants;
    };

    const shouldShowMerchantSelection = () => {
        if (customerType === "direct") {
            return true;
        } else if (customerType === "franchise") {
            return franchiseId && productId && cycle;
        }
        return false;
    };

    const shouldShowProductSelection = () => {
        if (customerType === "direct") {
            return merchantId;
        } else if (customerType === "franchise") {
            return franchiseId;
        }
        return false;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Parameters</h2>
            <div className="space-y-6">
                {/* First Row - Customer Type and Franchise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                        <select
                            {...register("customerType", { required: true })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading || currentBatch || currentFranchiseBatch}
                        >
                            <option value="">Select type...</option>
                            <option value="direct">Direct Merchant</option>
                            <option value="franchise">Franchise</option>
                        </select>
                    </div>

                    {/* Franchise Selection */}
                    {customerType === "franchise" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Franchise</label>
                            <select
                                {...register("franchiseId", { required: customerType === "franchise" })}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || currentFranchiseBatch}
                            >
                                <option value="">Choose franchise...</option>
                                {availableFranchises.map((franchise) => (
                                    <option key={franchise.id} value={franchise.id}>
                                        {franchise.franchiseName} - {franchise.contactPersonName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Second Row - Product Selection */}
                {shouldShowProductSelection() && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                            <select
                                {...register("productId", { required: true })}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || currentBatch || currentFranchiseBatch}
                            >
                                <option value="">Choose product...</option>
                                {availableProducts.map((product) => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName} - {product.productCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Settlement Cycle */}
                        {productId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Cycle</label>
                                <select
                                    {...register("cycle", { required: true })}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading || currentBatch || currentFranchiseBatch}
                                >
                                    <option value="">Select cycle...</option>
                                    {settlementCycles.map((cycleOption) => (
                                        <option key={cycleOption.key} value={cycleOption.key}>
                                            {cycleOption.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Direct Merchant Selection */}
                {customerType === "direct" && shouldShowMerchantSelection() && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Merchant</label>
                            <select
                                {...register("merchantId", { required: true })}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || currentBatch}
                            >
                                <option value="">Choose merchant...</option>
                                {availableDirectMerchants.map((merchant) => (
                                    <option key={merchant.id} value={merchant.id}>
                                        {merchant.businessName} - {merchant.contactPersonName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Franchise Batch Type and Merchant Selection */}
                {customerType === "franchise" && shouldShowMerchantSelection() && availableFranchiseMerchants.length > 0 && (
                    <div className="space-y-4">
                        {/* Batch Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Batch Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        {...register("batchType")}
                                        type="radio"
                                        value="selective"
                                        className="mr-2"
                                        disabled={loading || currentFranchiseBatch}
                                    />
                                    Selective Merchants
                                </label>
                                <label className="flex items-center">
                                    <input
                                        {...register("batchType")}
                                        type="radio"
                                        value="full"
                                        className="mr-2"
                                        disabled={loading || currentFranchiseBatch}
                                    />
                                    All Merchants
                                </label>
                            </div>
                        </div>

                        {/* Merchant Selection for Selective Batch */}
                        {batchType === "selective" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Merchants ({selectedMerchants?.length || 0} selected)
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                                    {availableFranchiseMerchants.map((merchant) => (
                                        <label key={merchant.merchantId} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedMerchants?.includes(merchant.merchantId) || false}
                                                onChange={() => onMerchantToggle(merchant.merchantId)}
                                                disabled={loading || currentFranchiseBatch}
                                                className="rounded"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{merchant.businessName}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({merchant.availableTransactions} transactions, ₹{merchant.totalAmount?.toFixed(2) || '0.00'})
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full Batch Info */}
                        {batchType === "full" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-sm text-blue-700">
                                    All {availableFranchiseMerchants.length} merchants will be included in the batch.
                                    Total transactions: {availableFranchiseMerchants.reduce((sum, m) => sum + m.availableTransactions, 0)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Batch Button */}
                {canCreateBatch && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onCreateBatch}
                            disabled={creatingBatch || !canCreateBatch}
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            {creatingBatch ? 'Creating Batch...' :
                                customerType === "franchise" ? 'Create Franchise Batch' : 'Create Settlement Batch'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectionForm;