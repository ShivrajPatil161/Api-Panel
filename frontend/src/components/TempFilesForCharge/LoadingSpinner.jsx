import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', inline = false }) => {
    if (inline) {
        return (
            <div className="inline-flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                <span className="text-gray-600 text-sm">{text}</span>
            </div>
        );
    }

    return (
        <div className="text-center py-8">
            <div className="inline-flex items-center">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                <span className="text-gray-600">{text}</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;