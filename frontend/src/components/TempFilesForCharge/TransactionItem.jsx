import React from 'react';

const TransactionItem = ({
    transaction,
    isSelected,
    onToggle,
    disabled = false
}) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(transaction.transactionReferenceId)}
                className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={disabled}
            />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div className="lg:col-span-2">
                    <div className="text-sm font-medium text-gray-900">
                        {formatDate(transaction.date)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        ID: {transaction.transactionReferenceId}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-bold text-gray-900">
                        ₹{(transaction.amount || 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                        {transaction.cardType} {transaction.brandType}
                    </div>
                </div>

                <div>
                    {transaction.fee > 0 ? (
                        <>
                            <div className="text-sm text-red-600">
                                -₹{transaction.fee.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-gray-500">Fee ({transaction.appliedRate}%)</div>
                        </>
                    ) : (
                        <div className="text-xs text-red-500">{transaction.error || 'No rate'}</div>
                    )}
                </div>

                <div>
                    {transaction.netAmount > 0 ? (
                        <div className="text-sm font-medium text-green-600">
                            ₹{transaction.netAmount.toLocaleString('en-IN')}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400">-</div>
                    )}
                    <div className="text-xs text-gray-500">Net Amount</div>
                </div>

                <div>
                    <div className="text-xs text-gray-600">{transaction.cardName || 'Unknown Card'}</div>
                </div>
            </div>
        </label>
    );
};

export default TransactionItem;