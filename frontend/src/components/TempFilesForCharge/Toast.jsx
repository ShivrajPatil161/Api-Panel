import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-3 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;