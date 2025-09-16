// AddBankModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../constants/API/axiosInstance';

const AddBankModal = ({ isOpen, onClose, onBankAdded }) => {
    const [formData, setFormData] = useState({
        ifscCode: '',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        bankHolderName: ''
    });
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const customerId = localStorage.getItem('customerId');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.ifscCode || !formData.bankName || !formData.accountNumber || !formData.confirmAccountNumber || !formData.bankHolderName) {
            toast.error('All fields are required');
            return false;
        }

        if (formData.accountNumber !== formData.confirmAccountNumber) {
            toast.error('Account numbers do not match');
            return false;
        }

        if (formData.ifscCode.length !== 11) {
            toast.error('IFSC code must be 11 characters');
            return false;
        }

        return true;
    };

    const handleVerify = async () => {
        if (!validateForm()) return;

        try {
            setVerifyLoading(true);
            const response = await api.post(`/payout/verify/${customerId}`, {
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                bankHolderName: formData.bankHolderName
            });

            setIsVerified(true);
            toast.success('Bank details verified successfully');
        } catch (error) {
            toast.error('Verification failed. Please check your details');
            setIsVerified(false);
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!isVerified) {
            toast.error('Please verify bank details before submitting');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(`/payout/add-bank/${customerId}`, {
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                bankHolderName: formData.bankHolderName
            });

            toast.success('Bank added successfully');
            onBankAdded(response.data);
            resetForm();
        } catch (error) {
            toast.error('Failed to add bank. Please try again');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            ifscCode: '',
            bankName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            bankHolderName: ''
        });
        setIsVerified(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Bank</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code *
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleInputChange}
                                placeholder="IFSC Code"
                                maxLength={11}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                placeholder="Bank Name"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number *
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="Account Number"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Account Number *
                        </label>
                        <input
                            type="text"
                            name="confirmAccountNumber"
                            value={formData.confirmAccountNumber}
                            onChange={handleInputChange}
                            placeholder="Confirm Account Number"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                }`}
                        />
                        {formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && (
                            <p className="text-red-500 text-xs mt-1">Account numbers do not match</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Holder Name *
                        </label>
                        <input
                            type="text"
                            name="bankHolderName"
                            value={formData.bankHolderName}
                            onChange={handleInputChange}
                            placeholder="Bank Holder Name"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {isVerified && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 text-sm">Bank details verified successfully</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={verifyLoading || isVerified}
                            className={`flex py-2 px-4 rounded font-medium ${isVerified
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
                                }`}
                        >
                            {verifyLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </div>
                            ) : isVerified ? (
                                'Verified ✓'
                            ) : (
                                'Verify'
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !isVerified}
                            className="flex bg-red-500 text-white py-2 px-4 rounded font-medium hover:bg-red-600 disabled:bg-red-300"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBankModal;