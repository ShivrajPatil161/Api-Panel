import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const bankSchema = z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumber: z.string()
        .min(9, 'Account number must be at least 9 digits')
        .max(18, 'Account number must not exceed 18 digits')
        .regex(/^\d+$/, 'Account number must contain only digits'),
    ifscCode: z.string()
        .min(11, 'IFSC code must be 11 characters')
        .max(11, 'IFSC code must be 11 characters')
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    charges: z.enum(['yes', 'no']),
    chargesType: z.string().optional()
}).refine((data) => {
    if (data.charges === 'yes') {
        return data.chargesType && (data.chargesType === 'percentage' || data.chargesType === 'flat');
    }
    return true;
}, {
    message: 'Charges type is required when charges is enabled',
    path: ['chargesType']
});

const AdminBankForm = ({ isOpen, onClose, defaultValues = null, onSubmit }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(bankSchema),
        defaultValues: defaultValues || {
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            charges: 'no',
            chargesType: ''
        }
    });

    const charges = watch('charges');

    if (!isOpen) return null;

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {defaultValues ? 'Edit Bank' : 'Add Bank'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('bankName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter bank name"
                            />
                            {errors.bankName && (
                                <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('accountNumber')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="9-18 digits"
                                maxLength={18}
                            />
                            {errors.accountNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('ifscCode')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                                placeholder="Enter IFSC code"
                                maxLength={11}
                            />
                            {errors.ifscCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.ifscCode.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Charges <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            charges === 'yes'
                                                ? (document.querySelector('input[name="charges"][value="no"]').click())
                                                : (document.querySelector('input[name="charges"][value="yes"]').click())
                                        }
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${charges === 'yes' ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${charges === 'yes' ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        {charges === 'yes' ? 'Enabled' : 'Disabled'}
                                    </span>
                                    {/* Hidden radio inputs (for react-hook-form) */}
                                    <input type="radio" {...register('charges')} value="yes" className="hidden" />
                                    <input type="radio" {...register('charges')} value="no" className="hidden" />
                                </div>
                            </div>

                            {charges === 'yes' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Charges Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('chargesType')}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select type</option>
                                        <option value="percentage">percentage</option>
                                        <option value="flat">flat</option>
                                    </select>
                                    {errors.chargesType && (
                                        <p className="text-red-500 text-sm mt-1">{errors.chargesType.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(handleFormSubmit)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {defaultValues ? 'Update Bank' : 'Add Bank'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBankForm;