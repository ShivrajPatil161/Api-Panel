import React, { useState } from 'react';

const FranchiseMerchantSelector = ({
    availableMerchants,
    selectedMerchantForCandidates,
    loading,
    onLoadCandidates
}) => {
    const [selectedMerchantId, setSelectedMerchantId] = useState(selectedMerchantForCandidates || "");

    const handleLoadCandidates = () => {
        if (selectedMerchantId) {
            onLoadCandidates(parseInt(selectedMerchantId));
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Merchant for Settlement</h2>
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Merchant to View Candidates
                    </label>
                    <select
                        value={selectedMerchantId}
                        onChange={(e) => setSelectedMerchantId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    >
                        <option value="">Select merchant...</option>
                        {availableMerchants.map((merchant) => (
                            <option key={merchant.merchantId} value={merchant.merchantId}>
                                {merchant.businessName} - {merchant.contactPerson} 
                                ({merchant.availableTransactions} transactions, ₹{merchant.totalAmount?.toFixed(2) || '0.00'})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleLoadCandidates}
                        disabled={!selectedMerchantId || loading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        {loading ? 'Loading...' : 'Load Candidates'}
                    </button>
                </div>
            </div>
            
            {selectedMerchantForCandidates && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                        Currently viewing candidates for: {
                            availableMerchants.find(m => m.merchantId === selectedMerchantForCandidates)?.businessName
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default FranchiseMerchantSelector;