import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../constants/API/axiosInstance';
import { X } from 'lucide-react';

// ✅ Define Zod Schema
const PrefundRequestSchema = z.object({
    mobileNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Invalid mobile number format'),
    depositAmount: z
        .number({ invalid_type_error: 'Deposit amount is required' })
        .positive('Deposit amount must be greater than zero'),
    bankHolderName: z
        .string()
        .min(2, 'Bank holder name must be at least 2 characters')
        .max(100, 'Bank holder name must not exceed 100 characters'),
    bankAccountName: z
        .string()
        .min(2, 'Bank account name must be at least 2 characters')
        .max(100, 'Bank account name must not exceed 100 characters'),
    bankAccountNumber: z
        .string()
        .regex(/^\d{9,18}$/, 'Bank account number must be between 9 to 18 digits'),
    bankTranId: z
        .string()
        .min(5, 'Bank transaction ID must be at least 5 characters')
        .max(50, 'Bank transaction ID must not exceed 50 characters'),
    depositDate: z.string().optional(),
    paymentMode: z.string().optional(),
    depositType: z.string().optional(),
    depositImage: z.string().optional(),
    narration: z
        .string()
        .max(500, 'Narration must not exceed 500 characters')
        .optional(),
});

const PrefundRequestForm = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(PrefundRequestSchema),
        defaultValues: {
            mobileNumber: '',
            depositAmount: '',
            bankHolderName: '',
            bankAccountName: '',
            bankAccountNumber: '',
            bankTranId: '',
            depositDate: '',
            paymentMode: '',
            depositType: '',
            depositImage: '',
            narration: '',
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Convert depositAmount from string to number if needed
            const payload = {
                ...data,
                depositAmount: Number(data.depositAmount),
            };

            const response = await api.post('/prefund-auth/request', payload);
            reset();
            onSuccess && onSuccess(response.data);
            onClose();
        } catch (error) {
            setSubmitError(
                error.response?.data?.message || 'Failed to submit prefund request'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setSubmitError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        New Prefund Request
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {submitError}
                        </div>
                    )}

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('mobileNumber')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter 10-digit mobile number"
                        />
                        {errors.mobileNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.mobileNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Deposit Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('depositAmount', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter deposit amount"
                        />
                        {errors.depositAmount && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.depositAmount.message}
                            </p>
                        )}
                    </div>

                    {/* Bank Holder Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('bankHolderName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter bank holder name"
                        />
                        {errors.bankHolderName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.bankHolderName.message}
                            </p>
                        )}
                    </div>

                    {/* Bank Account Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Account Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('bankAccountName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter bank account name"
                        />
                        {errors.bankAccountName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.bankAccountName.message}
                            </p>
                        )}
                    </div>

                    {/* Bank Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('bankAccountNumber')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter bank account number"
                        />
                        {errors.bankAccountNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.bankAccountNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Bank Transaction ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('bankTranId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter bank transaction ID"
                        />
                        {errors.bankTranId && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.bankTranId.message}
                            </p>
                        )}
                    </div>

                    {/* Deposit Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit Date
                        </label>
                        <input
                            type="date"
                            {...register('depositDate')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Payment Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Mode
                        </label>
                        <select
                            {...register('paymentMode')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select payment mode</option>
                            <option value="NEFT">NEFT</option>
                            <option value="RTGS">RTGS</option>
                            <option value="IMPS">IMPS</option>
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    {/* Deposit Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit Type
                        </label>
                        <select
                            {...register('depositType')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select deposit type</option>
                            <option value="Initial">Initial</option>
                            <option value="Additional">Additional</option>
                            <option value="Refill">Refill</option>
                        </select>
                    </div>

                    {/* Deposit Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deposit Image (URL/Path)
                        </label>
                        <input
                            type="text"
                            {...register('depositImage')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter image URL or path"
                        />
                    </div>

                    {/* Narration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Narration
                        </label>
                        <textarea
                            {...register('narration')}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add any additional notes (optional)"
                        />
                        {errors.narration && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.narration.message}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrefundRequestForm;
