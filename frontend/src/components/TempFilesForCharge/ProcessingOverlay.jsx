import React from 'react';

const ProcessingOverlay = ({ isVisible, selectedCount = 0 }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <div className="flex items-center mb-4">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">Processing Settlement</span>
                </div>
                <p className="text-sm text-gray-500">
                    Settling {selectedCount} transactions...
                </p>
            </div>
        </div>
    );
};

export default ProcessingOverlay;