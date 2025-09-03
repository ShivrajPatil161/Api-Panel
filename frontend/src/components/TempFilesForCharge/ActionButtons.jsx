import React from 'react';

const ActionButtons = ({
    selectedTransactions,
    totals,
    processingBatch,
    currentBatch,
    onResetForm,
    onSubmit
}) => {
    return (
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
                type="button"
                onClick={onResetForm}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={processingBatch}
            >
                Reset All
            </button>

            <div className="flex items-center space-x-4">
                {selectedTransactions?.length > 0 && (
                    <div className="text-sm text-gray-600">
                        {totals.count} selected • Net: ₹{totals.totalNet.toLocaleString('en-IN')}
                    </div>
                )}

                <button
                    type="button"
                    disabled={!selectedTransactions?.length || processingBatch || !currentBatch}
                    onClick={onSubmit}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                    {processingBatch
                        ? 'Processing...'
                        : `Settle ${selectedTransactions?.length || 0} Transaction${selectedTransactions?.length === 1 ? '' : 's'}`
                    }
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;