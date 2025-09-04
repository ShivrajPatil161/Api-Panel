import React from 'react';
import TransactionItem from './TransactionItem';

const SettlementCandidates = ({
    settlementCandidates,
    selectedTransactions,
    selectAll,
    processingBatch,
    onSelectAll,
    onTransactionToggle,
    totals
}) => {
    if (settlementCandidates.length === 0) return null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Settlement Candidates ({settlementCandidates.length})
                </h2>
                <button
                    type="button"
                    onClick={onSelectAll}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors"
                    disabled={processingBatch}
                >
                    {selectAll ? "Deselect All" : "Select All"}
                </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {settlementCandidates.map((transaction) => (
                    <TransactionItem
                        key={transaction.transactionReferenceId}
                        transaction={transaction}
                        isSelected={selectedTransactions?.includes(transaction.transactionReferenceId) || false}
                        onToggle={onTransactionToggle}
                        disabled={processingBatch}
                    />
                ))}
            </div>

            {/* Selection Summary */}
            {selectedTransactions?.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Selected:</span>
                            <p className="font-bold text-gray-900">{totals.count} transactions</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Total Amount:</span>
                            <p className="font-bold text-gray-900">₹{totals.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Total Fees:</span>
                            <p className="font-bold text-red-600">₹{totals.totalFee.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Net Settlement:</span>
                            <p className="font-bold text-green-600">₹{totals.totalNet.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettlementCandidates;